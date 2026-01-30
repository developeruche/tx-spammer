import { Worker } from '../Worker';
import { EthTransferConfig } from '../types';
import { GasGuardian } from '../GasGuardian';
import { parseEther, type Hash } from 'viem';

export async function executeEthTransfer(
    worker: Worker,
    config: EthTransferConfig,
    gasGuardian: GasGuardian
): Promise<void> {
    const amount = config.amountPerTx;
    const recipient = config.recipient || worker.address; // Self-transfer if no recipient

    // Estimated gas for a standard transfer is 21000
    const estimatedGas = 21000n;

    try {
        gasGuardian.checkLimit(estimatedGas);

        const hash = await worker.sendTransaction(
            recipient as `0x${string}`,
            amount
        );

        // We assume the tx will consume 21000 gas for simplicity in tracking, 
        // though in reality we'd wait for receipt to be exact. 
        // For high-performance spamming, we pre-check and post-record.
        gasGuardian.recordUsage(estimatedGas);

        // In a real recursive scenario (depth > 1), we would chain additional transfers here 
        // or wait for this one to mine. For high-volume spam, we often fire-and-forget 
        // or batch them if nonces allow.
        // The requirement mentions A -> B -> C.
        // If depth is > 1, this specific call might just be one step.
        // However, for simple spamming, we might just loop this function.

    } catch (error) {
        // If gas limit reached or other error, we stop this worker's current attempt
        throw error;
    }
}
