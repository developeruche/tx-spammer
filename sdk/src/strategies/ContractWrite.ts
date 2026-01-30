import { Worker } from '../Worker';
import { ContractWriteConfig } from '../types';
import { GasGuardian } from '../GasGuardian';

export async function executeContractWrite(
    worker: Worker,
    config: ContractWriteConfig,
    gasGuardian: GasGuardian
): Promise<void> {

    const estimatedGas = 100_000n; // Placeholder, should ideally simulate

    try {
        gasGuardian.checkLimit(estimatedGas);

        // Determine args: static or generated
        let args = config.staticArgs || [];
        if (config.argsGenerator) {
            args = config.argsGenerator();
        }

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
