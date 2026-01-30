import {
    createWalletClient,
    http,
    type WalletClient,
    type Transport,
    type Chain,
    type Account,
    parseEther,
    createPublicClient,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { mainnet } from 'viem/chains';
import { SpamSequenceConfig, SpamSequenceConfigSchema } from './types';
import { GasGuardian } from './GasGuardian';
import { Worker } from './Worker';
import {
    executeEthTransfer,
    executeContractDeploy,
    executeContractRead,
    executeContractWrite,
} from './strategies';

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
export class SpamOrchestrator {
    private config: SpamSequenceConfig;
    private rootAccount: Account;
    private rootClient: WalletClient<Transport, Chain, Account>;
    private publicClient: ReturnType<typeof createPublicClient>;
    private workers: Worker[] = [];
    private gasGuardian: GasGuardian;
    private chain: Chain;

    /**
     * @param config The spam sequence configuration.
     * @param rootPrivateKey The private key of the funding account.
     */
    constructor(config: SpamSequenceConfig, rootPrivateKey: `0x${string}`) {
        // Validate config
        this.config = SpamSequenceConfigSchema.parse(config);

        this.chain = {
            ...mainnet,
            id: this.config.chainId,
            rpcUrls: { default: { http: [this.config.rpcUrl] } },
        } as Chain;

        this.rootAccount = privateKeyToAccount(rootPrivateKey);
        this.rootClient = createWalletClient({
            account: this.rootAccount,
            chain: this.chain,
            transport: http(this.config.rpcUrl),
        });

        this.publicClient = createPublicClient({
            chain: this.chain,
            transport: http(this.config.rpcUrl),
        });

        this.gasGuardian = new GasGuardian(this.config.maxGasLimit);
    }

    /**
     * Sets up the spam environment by creating worker wallets and funding them.
     *
     * @param fundingAmount The amount of ETH (in wei) to send to each worker. Defaults to 1 ETH.
     */
    public async setup(fundingAmount: bigint = parseEther('1')): Promise<void> {
        console.log(`Setting up ${this.config.concurrency} workers...`);

        for (let i = 0; i < this.config.concurrency; i++) {
            const worker = new Worker(this.config.rpcUrl, this.chain);
            this.workers.push(worker);
        }

        // Fund workers
        console.log(`Funding workers with ${fundingAmount} wei each...`);
        const fundingTxs: `0x${string}`[] = [];
        const nonce = await this.publicClient.getTransactionCount({
            address: this.rootAccount.address,
        });

        for (let i = 0; i < this.workers.length; i++) {
            const tx = await this.rootClient.sendTransaction({
                to: this.workers[i].address,
                value: fundingAmount,
                // @ts-ignore
                nonce: nonce + i,
            });
            fundingTxs.push(tx);
        }

        console.log(`Waiting for ${fundingTxs.length} funding transactions to confirm...`);
        // Ideally we wait for all receipt. For MVP, we wait for Promise.all(waitForTransactionReceipt)
        await Promise.all(
            fundingTxs.map((hash) => this.publicClient.waitForTransactionReceipt({ hash }))
        );

        console.log('All workers funded. Initializing worker nonces...');

        // Initialize nonces
        await Promise.all(
            this.workers.map(async (worker) => {
                const n = await this.publicClient.getTransactionCount({ address: worker.address });
                worker.setNonce(n);
            })
        );

        console.log('Setup complete.');
    }

    /**
     * Starts the spam sequence based on the configured strategy.
     *
     * Supports:
     * - Single Strategy: All workers execute the same task.
     * - Mixed Strategy: Workers are partitioned based on percentage allocation.
     *
     * Stops when the duration expires or gas limits are reached.
     */
    public async start(): Promise<void> {
        console.log('Starting spam sequence...');
        const strategy = this.config.strategy;
        const duration = this.config.durationSeconds
            ? this.config.durationSeconds * 1000
            : Infinity;
        const startTime = Date.now();

        // Helper to run a strategy loop for a subset of workers
        const runLoop = async (workers: Worker[], stratConfig: any, guardian: GasGuardian) => {
            const loopTasks = workers.map(async (worker, index) => {
                while (true) {
                    if (guardian.isLimitReached) break;
                    if (Date.now() - startTime > duration) break;

                    try {
                        if (stratConfig.mode === 'transfer') {
                            await executeEthTransfer(
                                worker,
                                stratConfig,
                                guardian,
                                this.publicClient as any
                            );
                        } else if (stratConfig.mode === 'deploy') {
                            await executeContractDeploy(
                                worker,
                                stratConfig,
                                guardian,
                                this.publicClient as any
                            );
                        } else if (stratConfig.mode === 'read') {
                            await executeContractRead(
                                worker,
                                stratConfig,
                                guardian,
                                this.publicClient as any
                            );
                        } else if (stratConfig.mode === 'write') {
                            await executeContractWrite(
                                worker,
                                stratConfig,
                                guardian,
                                this.publicClient as any
                            );
                        }
                    } catch (e: any) {
                        // console.error(`Worker execution failed:`, e.message);
                        // Stop this worker's loop if critical constraint hit
                        if (guardian.isLimitReached) break;
                        // Optimization: Wait a bit on error to avoid hot-looping crashes?
                        // await new Promise(r => setTimeout(r, 100));
                    }
                }
            });
            await Promise.all(loopTasks);
        };

        if (strategy.mode === 'mixed') {
            console.log('Executing Mixed Strategy...');
            let workerOffset = 0;
            const tasks: Promise<void>[] = [];

            // Sort strategies to handle remainder logic deterministically? Or just iterate.
            for (let i = 0; i < strategy.strategies.length; i++) {
                const subStrat = strategy.strategies[i];
                // Calculate split
                const isLast = i === strategy.strategies.length - 1;
                const sharePercent = subStrat.percentage / 100;

                // Workers
                let count = Math.floor(this.config.concurrency * sharePercent);
                if (isLast) {
                    // Assign all remaining workers to the last group to avoid rounding loss
                    count = this.workers.length - workerOffset;
                }
                if (count <= 0) continue;

                const assignedWorkers = this.workers.slice(workerOffset, workerOffset + count);
                workerOffset += count;

                // Gas Limit
                // For 'read', gas limit is effectively infinity/ignored by strategy logic,
                // but we can assign a portion of the max limit to its guardian just in case.
                const gasLimitShare = BigInt(
                    Math.floor(Number(this.config.maxGasLimit) * sharePercent)
                );
                const subGuardian = new GasGuardian(gasLimitShare);

                console.log(
                    `- Sub-strategy '${subStrat.config.mode}': ${count} workers, ~${gasLimitShare} gas limit`
                );

                tasks.push(runLoop(assignedWorkers, subStrat.config, subGuardian));
            }

            await Promise.all(tasks);
        } else {
            // Single Mode
            await runLoop(this.workers, strategy, this.gasGuardian);
        }

        console.log('Spam sequence finished.');
    }
}
