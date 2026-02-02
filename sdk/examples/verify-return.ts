
import { SpamOrchestrator } from '../src/SpamOrchestrator';
import { SpamSequenceConfig } from '../src/types';
import { parseEther } from 'viem';

async function verify() {
    const RPC_URL = 'http://127.0.0.1:8545';
    const ROOT_PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'; // Anvil default #0

    const config: SpamSequenceConfig = {
        rpcUrl: RPC_URL,
        chainId: 31337,
        maxGasLimit: 30_000_000n,
        concurrency: 2,
        durationSeconds: 0,
        strategy: {
            mode: 'transfer',
            amountPerTx: parseEther('0.0001'),
            depth: 1,
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
