import { Worker } from '../Worker';
import { ContractDeployConfig } from '../types';
import { GasGuardian } from '../GasGuardian';
import { type PublicClient } from 'viem';
/**
 * Executes a contract deployment transaction.
 * Estimates gas for deployment and enforces limits before broadcasting.
 *
 * @param worker The worker instance performing the deployment.
 * @param config The deployment configuration (bytecode, args).
 * @param gasGuardian The gas guardian to track usage.
 * @param publicClient The viem public client for gas estimation.
 */
export declare function executeContractDeploy(worker: Worker, config: ContractDeployConfig, gasGuardian: GasGuardian, publicClient: PublicClient): Promise<void>;
