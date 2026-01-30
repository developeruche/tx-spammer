import { Worker } from '../Worker';
import { ContractReadConfig } from '../types';
import { GasGuardian } from '../GasGuardian';
import { PublicClient } from 'viem';

/**
 * Executes a read-only contract call (eth_call).
 * Does not check gas limits since it's off-chain, but puts load on the RPC node.
 * 
 * @param worker The worker instance performing the read.
 * @param config The read configuration (contract, method, args).
 * @param gasGuardian The gas guardian (unused for blocking reads).
 * @param publicClient The viem client to perform the call.
 */
export async function executeContractRead(
    worker: Worker,
    config: ContractReadConfig,
    gasGuardian: GasGuardian,
    publicClient: any
): Promise<void> {
    // Reads are "eth_call" and do not consume gas on-chain in the same way, 
    // but they do put load on the node. The user prompt says "High-frequency eth_call operations".
    // The GasGuardian tracks "Gas Cap". Usually gas cap refers to on-chain gas used.
    // However, if we want to limit the *spam load*, we might count it or not.
    // Given the "29M Gas Cap" constraint usually applies to blocks/throughput, 
    // and reads don't fill blocks, maybe we don't count them against the Guardian?
    // BUT the prompt tracks cumulative gas used. 
    // eth_calls don't use gas on chain. I will NOT count them towards the cap unless specified.

    try {
        await publicClient.readContract({
            address: config.targetContract as `0x${string}`,
            abi: config.abi,
            functionName: config.functionName,
            args: config.args || [],
        });

    } catch (error) {
        throw error;
    }
}
