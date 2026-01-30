import { Worker } from '../Worker';
import { EthTransferConfig } from '../types';
import { GasGuardian } from '../GasGuardian';
import { type PublicClient } from 'viem';

/**
 * Executes a single ETH transfer transaction.
 * 
 * @param worker The worker instance sending the transaction.
 * @param config The transfer configuration (amount, recipient).
 * @param gasGuardian The gas guardian to check and record usage.
 * @param publicClient The viem public client for gas estimation.
 */
export async function executeEthTransfer(
    worker: Worker,
    config: EthTransferConfig,
    gasGuardian: GasGuardian,
    publicClient: PublicClient
): Promise<void> {
    const amount = config.amountPerTx;
    const recipient = config.recipient || worker.address;

    try {
        const estimatedGas = await publicClient.estimateGas({
            account: worker.account,
            to: recipient as `0x${string}`,
            value: amount
        });

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
