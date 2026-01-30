"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeEthTransfer = executeEthTransfer;
/**
 * Executes a single ETH transfer transaction.
 *
 * @param worker The worker instance sending the transaction.
 * @param config The transfer configuration (amount, recipient).
 * @param gasGuardian The gas guardian to check and record usage.
 * @param publicClient The viem public client for gas estimation.
 */
async function executeEthTransfer(worker, config, gasGuardian, publicClient) {
    const amount = config.amountPerTx;
    const recipient = config.recipient || worker.address;
    try {
        const estimatedGas = await publicClient.estimateGas({
            account: worker.account,
            to: recipient,
            value: amount
        });
        gasGuardian.checkLimit(estimatedGas);
        const hash = await worker.sendTransaction(recipient, amount);
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
    }
    catch (error) {
        // If gas limit reached or other error, we stop this worker's current attempt
        throw error;
    }
}
