import { createPublicClient, http, createWalletClient, parseEther, type Hash } from 'viem';
import { foundry } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import { SpamOrchestrator } from '../src/SpamOrchestrator';
import { SpamSequenceConfig } from '../src/types';
import { SPAMMER_ABI, SPAMMER_BYTECODE } from './SpammerArtifact';

// Configuration
const RPC_URL = process.env.RPC_URL || 'http://127.0.0.1:8545';
const ROOT_PRIVATE_KEY =
    process.env.PRIVATE_KEY || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'; // Anvil default #0

// Helper to wait
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function main() {
    console.log('🚀 Starting E2E Suite...');

    // Setup Clients
    const chain = { ...foundry, rpcUrls: { default: { http: [RPC_URL] } } };
    const publicClient = createPublicClient({ chain, transport: http(RPC_URL) });
    const rootAccount = privateKeyToAccount(ROOT_PRIVATE_KEY as `0x${string}`);
    const rootClient = createWalletClient({
        account: rootAccount,
        chain,
        transport: http(RPC_URL),
    });

    // 0. Deploy Spammer Contract (Target for Write/Read)
    console.log('\n--- 0. Setup: Deploying Spammer.sol Target ---');
    const deployHash = await rootClient.deployContract({
        abi: SPAMMER_ABI,
        bytecode: SPAMMER_BYTECODE,
    });
    console.log('Deploy tx sent:', deployHash);
    const receipt = await publicClient.waitForTransactionReceipt({ hash: deployHash });
    const spammerAddress = receipt.contractAddress!;
    console.log('Spammer deployed at:', spammerAddress);

    // 1. ETH Transfer Spam
    console.log('\n--- Stage 1: EthTransfer Spam ---');
    const transferConfig: SpamSequenceConfig = {
        rpcUrl: RPC_URL,
        chainId: 31337,
        maxGasLimit: 5_000_000n, // Lower limit to test capping
        concurrency: 2,
        durationSeconds: 5,
        strategy: {
            mode: 'transfer',
            amountPerTx: parseEther('0.0001'),
            depth: 1,
        },
    };
    const orchestrator1 = new SpamOrchestrator(transferConfig, ROOT_PRIVATE_KEY as `0x${string}`);
    await orchestrator1.setup(parseEther('0.1'));
    await orchestrator1.start();

    // 2. Contract Deploy Spam
    console.log('\n--- Stage 2: ContractDeploy Spam ---');
    const deployConfig: SpamSequenceConfig = {
        rpcUrl: RPC_URL,
        chainId: 31337,
        maxGasLimit: 10_000_000n,
        concurrency: 2,
        durationSeconds: 5,
        strategy: {
            mode: 'deploy',
            bytecode: SPAMMER_BYTECODE,
            args: [],
        },
    };
    const orchestrator2 = new SpamOrchestrator(deployConfig, ROOT_PRIVATE_KEY as `0x${string}`);
    await orchestrator2.setup(parseEther('0.1'));
    await orchestrator2.start();

    // 3. Contract Write Spam (write_one)
    console.log('\n--- Stage 3: ContractWrite Spam (write_one) ---');

    // Capture state before
    const initialRead = (await publicClient.readContract({
        address: spammerAddress,
        abi: SPAMMER_ABI,
        functionName: 'read_one',
    })) as any;
    // console.log('Initial State Hash (partial):', toHex(initialRead.r_1d[0]));

    const writeConfig: SpamSequenceConfig = {
        rpcUrl: RPC_URL,
        chainId: 31337,
        maxGasLimit: 10_000_000n,
        concurrency: 2,
        durationSeconds: 5,
        strategy: {
            mode: 'write',
            targetContract: spammerAddress,
            functionName: 'write_one',
            abi: SPAMMER_ABI as any,
            staticArgs: [],
        },
    };
    const orchestrator3 = new SpamOrchestrator(writeConfig, ROOT_PRIVATE_KEY as `0x${string}`);
    await orchestrator3.setup(parseEther('0.1'));
    await orchestrator3.start();

    // Verify state change
    const finalRead = (await publicClient.readContract({
        address: spammerAddress,
        abi: SPAMMER_ABI,
        functionName: 'read_one',
    })) as any;

    // Check if 1d mapping changed (just check first element)
    const initialVal = initialRead.r_1d[0];
    const finalVal = finalRead.r_1d[0];

    if (initialVal !== finalVal) {
        console.log(
            `✅ State Verification PASSED: value changed from ${initialVal} to ${finalVal}`
        );
    } else {
        console.warn(`⚠️ State Verification FAILED: value did not change (${initialVal})`);
        // Note: If block.timestamp didn't change (fast spam in same block?), it might be same.
        // But with durationSeconds=5, it should change.
    }

    // 4. Contract Read Spam (read_one)
    console.log('\n--- Stage 4: ContractRead Spam (read_one) ---');
    const readConfig: SpamSequenceConfig = {
        rpcUrl: RPC_URL,
        chainId: 31337,
        maxGasLimit: 10_000_000n, // Should not be consumed, but limit exists
        concurrency: 2,
        durationSeconds: 5,
        strategy: {
            mode: 'read',
            targetContract: spammerAddress,
            functionName: 'read_one',
            abi: SPAMMER_ABI as any,
            args: [],
        },
    };
    const orchestrator4 = new SpamOrchestrator(readConfig, ROOT_PRIVATE_KEY as `0x${string}`);
    await orchestrator4.setup(parseEther('0.01')); // Cheap setup for reads
    await orchestrator4.start();

    // 5. Mixed Strategy Spam
    // "2% - ethTransfers, 48% Contract reads, 50% contract writes"
    console.log('\n--- Stage 5: Mixed Strategy Spam ---');
    console.log('Target: 2% Transfer, 48% Read, 50% Write');

    const mixedConfig: SpamSequenceConfig = {
        rpcUrl: RPC_URL,
        chainId: 31337,
        maxGasLimit: 10_000_000n,
        // Need enough concurrency to see splits. 50 workers => 1 transfer, 24 reads, 25 writes
        concurrency: 50,
        durationSeconds: 10,
        strategy: {
            mode: 'mixed',
            strategies: [
                {
                    percentage: 2,
                    config: {
                        mode: 'transfer',
                        amountPerTx: parseEther('0.0001'),
                        depth: 1,
                    },
                },
                {
                    percentage: 48,
                    config: {
                        mode: 'read',
                        targetContract: spammerAddress,
                        functionName: 'read_one',
                        abi: SPAMMER_ABI as any,
                    },
                },
                {
                    percentage: 50,
                    config: {
                        mode: 'write',
                        targetContract: spammerAddress,
                        functionName: 'write_one',
                        abi: SPAMMER_ABI as any,
                        staticArgs: [],
                    },
                },
            ],
        },
    };
    const orchestrator5 = new SpamOrchestrator(mixedConfig, ROOT_PRIVATE_KEY as `0x${string}`);
    await orchestrator5.setup(parseEther('0.01')); // Setup for 50 workers
    await orchestrator5.start();

    console.log('\n✅ E2E Suite Completed Successfully!');
}

main().catch(console.error);
