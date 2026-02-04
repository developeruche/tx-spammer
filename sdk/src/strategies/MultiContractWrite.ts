import { Worker } from '../Worker';
import { ContractWriteManyConfig } from '../types';
import { GasGuardian } from '../GasGuardian';
import { type PublicClient, type Hash } from 'viem';

/**
 * Executes a state-changing contract write transaction on one of multiple target contracts.
 * Estimates gas and enforces limits. Supports dynamic arguments via generator or static args.
 * Contract selection is round-robin based on worker nonce.
 *
 * @param worker The worker instance performing the write.
 * @param config The write configuration (targetContracts, method, args).
 * @param gasGuardian The gas guardian to track usage.
 * @param publicClient The viem public client for gas estimation.
 */
export async function executeMultiContractWrite(
    worker: Worker,
    config: ContractWriteManyConfig,
    gasGuardian: GasGuardian,
    publicClient: PublicClient
): Promise<Hash> {
    try {
        // Determine args
        let args = config.staticArgs || [];
        if (config.argsGenerator) {
            args = config.argsGenerator();
        }

        // Select target contract based on worker nonce (round-robin)
        // We use the current nonce to determine the target index
        const nonce = worker.getCurrentNonce();
        const targetIndex = Number(nonce) % config.targetContracts.length;
        const targetContract = config.targetContracts[targetIndex];

        const estimatedGas = await publicClient.estimateContractGas({
            address: targetContract as `0x${string}`,
            abi: config.abi,
            functionName: config.functionName,
            args: args,
            account: worker.account,
        });

        gasGuardian.checkLimit(estimatedGas);

        const hash = await worker.client.writeContract({
            address: targetContract as `0x${string}`,
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
