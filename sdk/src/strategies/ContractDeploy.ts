import { Worker } from '../Worker';
import { ContractDeployConfig } from '../types';
import { GasGuardian } from '../GasGuardian';
import { type PublicClient, type Hash } from 'viem';

/**
 * Executes a contract deployment transaction.
 * Estimates gas for deployment and enforces limits before broadcasting.
 *
 * @param worker The worker instance performing the deployment.
 * @param config The deployment configuration (bytecode, args).
 * @param gasGuardian The gas guardian to track usage.
 * @param publicClient The viem public client for gas estimation.
 */
export async function executeContractDeploy(
    worker: Worker,
    config: ContractDeployConfig,
    gasGuardian: GasGuardian,
    publicClient: PublicClient
): Promise<Hash> {
    const bytecode = config.bytecode as `0x${string}`;
    const args = config.args || [];

    try {
        // Estimate deployment gas
        // Note: deployContract is a helper on WalletClient, but estimateGas needs explicit call
        const estimatedGas = await publicClient.estimateGas({
            account: worker.account,
            data: bytecode,
            // TODO: handle args encoding for estimation if strict?
            // Typically just data + args encoded is fine, but estimateGas with 'data' works for deploy
        });

        gasGuardian.checkLimit(estimatedGas);

        const hash = await worker.client.deployContract({
            abi: [],
            bytecode: bytecode,
            account: worker.account,
            args: args,
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
