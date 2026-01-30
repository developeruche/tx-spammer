import { Worker } from '../Worker';
import { ContractReadConfig } from '../types';
import { GasGuardian } from '../GasGuardian';
/**
 * Executes a read-only contract call (eth_call).
 * Does not check gas limits since it's off-chain, but puts load on the RPC node.
 *
 * @param worker The worker instance performing the read.
 * @param config The read configuration (contract, method, args).
 * @param gasGuardian The gas guardian (unused for blocking reads).
 * @param publicClient The viem client to perform the call.
 */
export declare function executeContractRead(worker: Worker, config: ContractReadConfig, gasGuardian: GasGuardian, publicClient: any): Promise<void>;
