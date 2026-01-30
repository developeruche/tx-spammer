"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpamOrchestrator = void 0;
const viem_1 = require("viem");
const accounts_1 = require("viem/accounts");
const chains_1 = require("viem/chains");
const types_1 = require("./types");
const GasGuardian_1 = require("./GasGuardian");
const Worker_1 = require("./Worker");
const strategies_1 = require("./strategies");
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
class SpamOrchestrator {
    config;
    rootAccount;
    rootClient;
    publicClient;
    workers = [];
    gasGuardian;
    chain;
    /**
     * @param config The spam sequence configuration.
     * @param rootPrivateKey The private key of the funding account.
     */
    constructor(config, rootPrivateKey) {
        // Validate config
        this.config = types_1.SpamSequenceConfigSchema.parse(config);
        this.chain = { ...chains_1.mainnet, id: this.config.chainId, rpcUrls: { default: { http: [this.config.rpcUrl] } } };
        this.rootAccount = (0, accounts_1.privateKeyToAccount)(rootPrivateKey);
        this.rootClient = (0, viem_1.createWalletClient)({
            account: this.rootAccount,
            chain: this.chain,
            transport: (0, viem_1.http)(this.config.rpcUrl),
        });
        this.publicClient = (0, viem_1.createPublicClient)({
            chain: this.chain,
            transport: (0, viem_1.http)(this.config.rpcUrl),
        });
        this.gasGuardian = new GasGuardian_1.GasGuardian(this.config.maxGasLimit);
    }
    /**
     * Sets up the spam environment by creating worker wallets and funding them.
     *
     * @param fundingAmount The amount of ETH (in wei) to send to each worker. Defaults to 1 ETH.
     */
    async setup(fundingAmount = (0, viem_1.parseEther)('1')) {
        console.log(`Setting up ${this.config.concurrency} workers...`);
        for (let i = 0; i < this.config.concurrency; i++) {
            const worker = new Worker_1.Worker(this.config.rpcUrl, this.chain);
            this.workers.push(worker);
        }
        // Fund workers
        console.log(`Funding workers with ${fundingAmount} wei each...`);
        const fundingTxs = [];
        const nonce = await this.publicClient.getTransactionCount({ address: this.rootAccount.address });
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
        await Promise.all(fundingTxs.map(hash => this.publicClient.waitForTransactionReceipt({ hash })));
        console.log("All workers funded. Initializing worker nonces...");
        // Initialize nonces
        await Promise.all(this.workers.map(async (worker) => {
            const n = await this.publicClient.getTransactionCount({ address: worker.address });
            worker.setNonce(n);
        }));
        console.log("Setup complete.");
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
    async start() {
        console.log("Starting spam sequence...");
        const strategy = this.config.strategy;
        const duration = this.config.durationSeconds ? this.config.durationSeconds * 1000 : Infinity;
        const startTime = Date.now();
        // Helper to run a strategy loop for a subset of workers
        const runLoop = async (workers, stratConfig, guardian) => {
            const loopTasks = workers.map(async (worker, index) => {
                while (true) {
                    if (guardian.isLimitReached)
                        break;
                    if (Date.now() - startTime > duration)
                        break;
                    try {
                        if (stratConfig.mode === 'transfer') {
                            await (0, strategies_1.executeEthTransfer)(worker, stratConfig, guardian, this.publicClient);
                        }
                        else if (stratConfig.mode === 'deploy') {
                            await (0, strategies_1.executeContractDeploy)(worker, stratConfig, guardian, this.publicClient);
                        }
                        else if (stratConfig.mode === 'read') {
                            await (0, strategies_1.executeContractRead)(worker, stratConfig, guardian, this.publicClient);
                        }
                        else if (stratConfig.mode === 'write') {
                            await (0, strategies_1.executeContractWrite)(worker, stratConfig, guardian, this.publicClient);
                        }
                    }
                    catch (e) {
                        // console.error(`Worker execution failed:`, e.message);
                        // Stop this worker's loop if critical constraint hit
                        if (guardian.isLimitReached)
                            break;
                        // Optimization: Wait a bit on error to avoid hot-looping crashes?
                        // await new Promise(r => setTimeout(r, 100));
                    }
                }
            });
            await Promise.all(loopTasks);
        };
        if (strategy.mode === 'mixed') {
            console.log("Executing Mixed Strategy...");
            let workerOffset = 0;
            const tasks = [];
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
                if (count <= 0)
                    continue;
                const assignedWorkers = this.workers.slice(workerOffset, workerOffset + count);
                workerOffset += count;
                // Gas Limit
                // For 'read', gas limit is effectively infinity/ignored by strategy logic, 
                // but we can assign a portion of the max limit to its guardian just in case.
                const gasLimitShare = BigInt(Math.floor(Number(this.config.maxGasLimit) * sharePercent));
                const subGuardian = new GasGuardian_1.GasGuardian(gasLimitShare);
                console.log(`- Sub-strategy '${subStrat.config.mode}': ${count} workers, ~${gasLimitShare} gas limit`);
                tasks.push(runLoop(assignedWorkers, subStrat.config, subGuardian));
            }
            await Promise.all(tasks);
        }
        else {
            // Single Mode
            await runLoop(this.workers, strategy, this.gasGuardian);
        }
        console.log("Spam sequence finished.");
    }
}
exports.SpamOrchestrator = SpamOrchestrator;
