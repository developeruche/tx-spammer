import { SpamOrchestrator } from '../src/SpamOrchestrator';
import { SpamSequenceConfig } from '../src/types';
import { parseEther } from 'viem';

async function main() {
    const rpcUrl = process.env.RPC_URL || 'http://127.0.0.1:8545';
    const privateKey = process.env.PRIVATE_KEY as `0x${string}` || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'; // Anvil Account #0

    const config: SpamSequenceConfig = {
        rpcUrl,
        chainId: 31337, // Anvil default
        maxGasLimit: 29_000_000n,
        concurrency: 2,
        durationSeconds: 10,
        strategy: {
            mode: 'transfer',
            amountPerTx: parseEther('0.0001'),
            depth: 10
        }
    };

    const orchestrator = new SpamOrchestrator(config, privateKey);

    try {
        await orchestrator.setup(parseEther('1'));
        await orchestrator.start();
    } catch (error) {
        console.error('Spam failed:', error);
    }
}

main();
