import { SpamSequenceConfig } from './types';
/**
 * The central coordinator for the spam sequence.
 *
 * Responsibilities:
 * - Validates configuration.
 * - Initializes the root wallet and worker wallets.
 * - Funds workers from the root account.
 * - Manages the lifecycle of the spam sequence.
 * - Orchestrates different strategies (Single or Mixed) by dispatching workers.
 */
export declare class SpamOrchestrator {
    private config;
    private rootAccount;
    private rootClient;
    private publicClient;
    private workers;
    private gasGuardian;
    private chain;
    /**
     * @param config The spam sequence configuration.
     * @param rootPrivateKey The private key of the funding account.
     */
    constructor(config: SpamSequenceConfig, rootPrivateKey: `0x${string}`);
    /**
     * Sets up the spam environment by creating worker wallets and funding them.
     *
     * @param fundingAmount The amount of ETH (in wei) to send to each worker. Defaults to 1 ETH.
     */
    setup(fundingAmount?: bigint): Promise<void>;
    /**
     * Starts the spam sequence based on the configured strategy.
     *
     * Supports:
     * - Single Strategy: All workers execute the same task.
     * - Mixed Strategy: Workers are partitioned based on percentage allocation.
     *
     * Stops when the duration expires or gas limits are reached.
     */
    start(): Promise<void>;
}
