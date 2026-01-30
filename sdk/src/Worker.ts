import {
    createWalletClient,
    http,
    type WalletClient,
    type Account,
    type Chain,
    type PublicClient,
    type Transport,
    type Hash,
    parseEther,
    Address
} from 'viem';
import { privateKeyToAccount, generatePrivateKey } from 'viem/accounts';

/**
 * Represents a single worker wallet in the spam system.
 * Handles local nonce management to enable high-concurrency transaction submission.
 */
export class Worker {
    public account: Account;
    public client: WalletClient<Transport, Chain, Account>;
    private nonce: number | null = null;

    /**
     * Creates a new Worker instance with a fresh random private key.
     * 
     * @param rpcUrl The RPC URL to connect to.
     * @param chain The chain definition to use.
     */
    constructor(rpcUrl: string, chain: Chain) {
        // Generate a fresh random private key for this worker
        const privateKey = generatePrivateKey();
        this.account = privateKeyToAccount(privateKey);

        this.client = createWalletClient({
            account: this.account,
            chain: chain,
            transport: http(rpcUrl),
        });
    }

    /**
     * Returns the address of the worker's wallet.
     */
    public get address(): Address {
        return this.account.address;
    }

    /**
     * Initializes or updates the local nonce. 
     * Must be called before sending transactions, typically after fetching the current nonce from the network.
     * 
     * @param nonce The starting nonce value.
     */
    public setNonce(nonce: number) {
        this.nonce = nonce;
    }

    /**
     * Gets the current local nonce and increments it for the next transaction.
     * Use this to avoid 'nonce too low' errors during rapid fire submission.
     * 
     * @returns The nonce to use for the current transaction.
     * @throws Error if the nonce has not been initialized via setNonce().
     */
    public getAndIncrementNonce(): number {
        if (this.nonce === null) {
            throw new Error("Nonce not initialized for worker");
        }
        return this.nonce++;
    }

    /**
     * Sends a transaction from this worker's wallet using the managed local nonce.
     * 
     * @param to The recipient address.
     * @param value The value in wei to transfer (default 0).
     * @param data The calldata for the transaction (default empty).
     * @returns The hash of the submitted transaction.
     */
    public async sendTransaction(
        to: Address,
        value: bigint = 0n,
        data: Hash = '0x'
    ): Promise<Hash> {
        return this.client.sendTransaction({
            to,
            value,
            data,
            // @ts-ignore - nonce override is valid but viem types might be strict depending on version
            nonce: this.getAndIncrementNonce()
        });
    }
}
