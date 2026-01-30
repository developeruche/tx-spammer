import { Worker } from '../Worker';
import { ContractWriteConfig } from '../types';
import { GasGuardian } from '../GasGuardian';
import { type PublicClient } from 'viem';
/**
 * Executes a state-changing contract write transaction.
 * Estimates gas and enforces limits. Supports dynamic arguments via generator or static args.
 *
 * @param worker The worker instance performing the write.
 * @param config The write configuration (target, method, args).
 * @param gasGuardian The gas guardian to track usage.
 * @param publicClient The viem public client for gas estimation.
 */
export declare function executeContractWrite(worker: Worker, config: ContractWriteConfig, gasGuardian: GasGuardian, publicClient: PublicClient): Promise<void>;
