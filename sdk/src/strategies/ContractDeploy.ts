import { Worker } from '../Worker';
import { ContractDeployConfig } from '../types';
import { GasGuardian } from '../GasGuardian';
import { type Hash } from 'viem';

export async function executeContractDeploy(
    worker: Worker,
    config: ContractDeployConfig,
    gasGuardian: GasGuardian
): Promise<void> {
    const bytecode = config.bytecode;
    const args = config.args || [];

    // TODO: Better gas estimation for deployment.
    // For now, using a safe upper bound or a standard value for simple contracts.
    // A complex contract might need 2M+ gas.
    // We can try to estimate locally if possible, but for spamming we might just set a high limit.
    const estimatedGas = 500_000n;

    try {
        gasGuardian.checkLimit(estimatedGas);

        // Deploy using sendTransaction with null 'to'
        const hash = await worker.client.deployContract({
            abi: [], // ABI not strictly needed for raw bytecode deploy if no args encoding needed, but viem might require it for args
            bytecode: bytecode as `0x${string}`,
            account: worker.account,
            args: args,
            chain: worker.client.chain,
            // @ts-ignore - nonce handling
            nonce: worker.getAndIncrementNonce(),
        });

        gasGuardian.recordUsage(estimatedGas);

    } catch (error) {
        throw error;
    }
}
