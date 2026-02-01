import { Worker } from '../Worker';
import { ContractWriteConfig } from '../types';
import { GasGuardian } from '../GasGuardian';
import { type PublicClient, type Hash } from 'viem';

/**
 * Executes a state-changing contract write transaction.
 * Estimates gas and enforces limits. Supports dynamic arguments via generator or static args.
 *
 * @param worker The worker instance performing the write.
 * @param config The write configuration (target, method, args).
 * @param gasGuardian The gas guardian to track usage.
 * @param publicClient The viem public client for gas estimation.
 */
export async function executeContractWrite(
    worker: Worker,
    config: ContractWriteConfig,
    gasGuardian: GasGuardian,
    publicClient: PublicClient
): Promise<Hash> {
    try {
        // Determine args
        let args = config.staticArgs || [];
        if (config.argsGenerator) {
            args = config.argsGenerator();
        }

        const estimatedGas = await publicClient.estimateContractGas({
            address: config.targetContract as `0x${string}`,
            abi: config.abi,
            functionName: config.functionName,
            args: args,
            account: worker.account,
        });

        gasGuardian.checkLimit(estimatedGas);

        const hash = await worker.client.writeContract({
            address: config.targetContract as `0x${string}`,
            abi: config.abi,
            functionName: config.functionName,
            args: args,
            account: worker.account,
            chain: worker.client.chain,
            // @ts-ignore
            nonce: worker.getAndIncrementNonce(),
        });

        gasGuardian.recordUsage(estimatedGas);
        return hash;
    } catch (error) {
        throw error;
    }
}
