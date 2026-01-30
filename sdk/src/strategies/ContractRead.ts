import { Worker } from '../Worker';
import { ContractReadConfig } from '../types';
import { GasGuardian } from '../GasGuardian';
import { PublicClient } from 'viem';

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
    // BUT the prompt says "GasGuardian... tracks cumulative gas used". 
    // eth_calls don't use gas on chain. I will NOT count them towards the cap unless specified.

    // Actually, checking the prompt: "If the sequence hits this cap, the spammer must gracefully halt."
    // It's likely about block saturation. So reads shouldn't count.

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
