import { SpamOrchestrator } from '../src/SpamOrchestrator';
import { SpamSequenceConfig } from '../src/types';
import { parseEther, createWalletClient, http, publicActions } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { foundry } from 'viem/chains';
import { SPAMMER_ABI, SPAMMER_BYTECODE } from './SpammerArtifact';

async function verify() {
    const RPC_URL = 'http://127.0.0.1:8545';
    const ROOT_PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'; // Anvil default #0

    console.log('Deploying Spammer contract...');

    // Setup client for deployment
    const account = privateKeyToAccount(ROOT_PRIVATE_KEY);
    const client = createWalletClient({
        account,
        chain: {
            ...foundry,
            rpcUrls: { default: { http: [RPC_URL] } },
        },
        transport: http(RPC_URL),
    }).extend(publicActions);

    // Deploy Spammer
    const hash = await client.deployContract({
        abi: SPAMMER_ABI,
        bytecode: SPAMMER_BYTECODE,
        args: [],
    });

    const receipt = await client.waitForTransactionReceipt({ hash });

    if (!receipt.contractAddress) {
        throw new Error('Deployment failed');
    }

    console.log('Spammer deployed at:', receipt.contractAddress);
    console.log('Setting up spammer...');

    const config: SpamSequenceConfig = {
        rpcUrl: RPC_URL,
        chainId: 31337,
        maxGasLimit: 60_000_000n,
        concurrency: 20,
        durationSeconds: 0,
        strategy: {
            mode: 'write',
            targetContract: receipt.contractAddress,
            functionName: 'spam',
            abi: SPAMMER_ABI as any,
            staticArgs: [],
        },
    };

    const orchestrator = new SpamOrchestrator(config, ROOT_PRIVATE_KEY);
    await orchestrator.setup(parseEther('0.1'));

    console.log('Starting spam...');
    const result = await orchestrator.start();
    console.log('Spam finished.');

    console.log('Result:', result);

    if (result.totalGasUsed > 0n && result.finalBlockGasUsed > 0n) {
        console.log('Verification SUCCEEDED: Returned valid SpamResult structure.');
        console.log(
            `Total Gas Used: ${result.totalGasUsed}, Final Block Gas: ${result.finalBlockGasUsed}`
        );
        console.log('Stats:', result.stats);
        process.exit(0);
    } else {
        console.error('Verification FAILED: Invalid return structure.');
        process.exit(1);
    }
}

verify();
