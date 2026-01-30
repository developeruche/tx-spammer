"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeContractWrite = executeContractWrite;
/**
 * Executes a state-changing contract write transaction.
 * Estimates gas and enforces limits. Supports dynamic arguments via generator or static args.
 *
 * @param worker The worker instance performing the write.
 * @param config The write configuration (target, method, args).
 * @param gasGuardian The gas guardian to track usage.
 * @param publicClient The viem public client for gas estimation.
 */
async function executeContractWrite(worker, config, gasGuardian, publicClient) {
    try {
        // Determine args
        let args = config.staticArgs || [];
        if (config.argsGenerator) {
            args = config.argsGenerator();
        }
        const estimatedGas = await publicClient.estimateContractGas({
            address: config.targetContract,
            abi: config.abi,
            functionName: config.functionName,
            args: args,
            account: worker.account
        });
        gasGuardian.checkLimit(estimatedGas);
        const hash = await worker.client.writeContract({
            address: config.targetContract,
            abi: config.abi,
            functionName: config.functionName,
            args: args,
            account: worker.account,
            chain: worker.client.chain,
            // @ts-ignore
            nonce: worker.getAndIncrementNonce(),
        });
        gasGuardian.recordUsage(estimatedGas);
    }
    catch (error) {
        throw error;
    }
}
