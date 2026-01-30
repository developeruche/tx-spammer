import { Worker } from '../Worker';
import { EthTransferConfig } from '../types';
import { GasGuardian } from '../GasGuardian';
import { type PublicClient } from 'viem';
/**
 * Executes a single ETH transfer transaction.
 *
 * @param worker The worker instance sending the transaction.
 * @param config The transfer configuration (amount, recipient).
 * @param gasGuardian The gas guardian to check and record usage.
 * @param publicClient The viem public client for gas estimation.
 */
export declare function executeEthTransfer(worker: Worker, config: EthTransferConfig, gasGuardian: GasGuardian, publicClient: PublicClient): Promise<void>;
