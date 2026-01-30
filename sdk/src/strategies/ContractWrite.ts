import { Worker } from '../Worker';
import { ContractWriteConfig } from '../types';
import { GasGuardian } from '../GasGuardian';
import { type PublicClient } from 'viem';

export async function executeContractWrite(
    worker: Worker,
    config: ContractWriteConfig,
    gasGuardian: GasGuardian,
    publicClient: PublicClient
): Promise<void> {

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
            account: worker.account
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

    } catch (error) {
        throw error;
    }
}
