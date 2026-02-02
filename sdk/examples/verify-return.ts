
import { SpamOrchestrator } from '../src/SpamOrchestrator';
import { SpamSequenceConfig } from '../src/types';
import { parseEther, createWalletClient, http, publicActions } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { foundry } from 'viem/chains';
import * as fs from 'fs';
import * as path from 'path';

async function verify() {
    const RPC_URL = 'http://127.0.0.1:8545';
    const ROOT_PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'; // Anvil default #0

    // Load artifact
    const artifactPath = path.resolve(__dirname, '../../contract/out/Spammer.sol/Spammer.json');
    if (!fs.existsSync(artifactPath)) {
        console.error('Artifact not found at:', artifactPath);
        process.exit(1);
    }
    const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));

    // Deploy Spammer contract
    const account = privateKeyToAccount(ROOT_PRIVATE_KEY as `0x${string}`);
    const client = createWalletClient({
        account,
        chain: foundry,
        transport: http(RPC_URL),
    }).extend(publicActions);

    console.log('Deploying Spammer contract...');
    const hash = await client.deployContract({
        abi: artifact.abi,
        bytecode: artifact.bytecode.object,
    });
    const receipt = await client.waitForTransactionReceipt({ hash });
    const contractAddress = receipt.contractAddress!;
    console.log('Spammer deployed at:', contractAddress);

    const config: SpamSequenceConfig = {
        rpcUrl: RPC_URL,
        chainId: 31337,
        maxGasLimit: 30_000_000n,
        concurrency: 2,
        durationSeconds: 0,
        strategy: {
            mode: 'write',
            targetContract: contractAddress,
            functionName: 'write_one',
            abi: artifact.abi,
            staticArgs: [],
        },
    };

    const orchestrator = new SpamOrchestrator(config, ROOT_PRIVATE_KEY as `0x${string}`);

    try {
        console.log('Setting up spammer...');
        await orchestrator.setup(parseEther('0.1'));

        console.log('Starting spam...');
        const result = await orchestrator.start();

        console.log('Spam finished.');
        console.log('Result:', result);

        if (
            typeof result.blockNumber === 'bigint' &&
            (result.txHash === null || result.txHash.startsWith('0x')) &&
            typeof result.totalGasUsed === 'bigint' &&
            typeof result.finalBlockGasUsed === 'bigint'
        ) {
            console.log('Verification SUCCEEDED: Returned valid SpamResult structure.');
            console.log(`Total Gas Used: ${result.totalGasUsed}, Final Block Gas: ${result.finalBlockGasUsed}`);
            process.exit(0);
        } else {
            console.error('Verification FAILED: Invalid return structure.');
            console.error('Expected SpamResult, got:', result);
            process.exit(1);
        }

    } catch (error) {
        console.error('Verification FAILED with error:', error);
        process.exit(1);
    }
}

verify();
