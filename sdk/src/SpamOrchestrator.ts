import {
    createWalletClient,
    http,
    type WalletClient,
    type Transport,
    type Chain,
    type Account,
    parseEther,
    createPublicClient
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { mainnet } from 'viem/chains'; // Default, can be overridden
import { SpamSequenceConfig, SpamSequenceConfigSchema } from './types';
import { GasGuardian } from './GasGuardian';
import { Worker } from './Worker';
import {
    executeEthTransfer,
    executeContractDeploy,
    executeContractRead,
    executeContractWrite
} from './strategies';

export class SpamOrchestrator {
    private config: SpamSequenceConfig;
    private rootAccount: Account;
    private rootClient: WalletClient<Transport, Chain, Account>;
    private publicClient: ReturnType<typeof createPublicClient>;
    private workers: Worker[] = [];
    private gasGuardian: GasGuardian;
    private chain: Chain;

    constructor(config: SpamSequenceConfig, rootPrivateKey: `0x${string}`) {
        // Validate config
        this.config = SpamSequenceConfigSchema.parse(config);

        this.chain = { ...mainnet, id: this.config.chainId, rpcUrls: { default: { http: [this.config.rpcUrl] } } } as Chain;

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
     * Setup Flow: Create workers and fund them.
     * @param fundingAmount Amount of ETH to send to each worker.
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

    public async start(): Promise<void> {
        console.log("Starting spam sequence...");
        const strategy = this.config.strategy;
        const duration = this.config.durationSeconds ? this.config.durationSeconds * 1000 : Infinity;
        const startTime = Date.now();

        const tasks = this.workers.map(async (worker, index) => {
            while (true) {
                // Check constraints
                if (this.gasGuardian.isLimitReached) break;
                if (Date.now() - startTime > duration) break;
                // TODO: check totalTxs count if implemented

                try {
                    if (strategy.mode === 'transfer') {
                        await executeEthTransfer(worker, strategy, this.gasGuardian);
                    } else if (strategy.mode === 'deploy') {
                        await executeContractDeploy(worker, strategy, this.gasGuardian);
                    } else if (strategy.mode === 'read') {
                        await executeContractRead(worker, strategy, this.gasGuardian, this.publicClient);
                    } else if (strategy.mode === 'write') {
                        await executeContractWrite(worker, strategy, this.gasGuardian);
                    }
                } catch (e: any) {
                    console.error(`Worker ${index} execution failed:`, e.message);
                    // If gas limit reached, we want to stop everyone, but this worker loop breaks naturally on next check
                    if (this.gasGuardian.isLimitReached) break;
                    // For other errors, maybe we continue? or break? 
                    // Creating a robust spammer usually means we ignore transient errors and keep going.
                }
            }
        });

        await Promise.all(tasks);
        console.log("Spam sequence finished.");
        console.log("Total estimated gas used:", this.gasGuardian.gasUsed.toString());
    }
}
