import { type WalletClient, type Account, type Chain, type Transport, type Hash, Address } from 'viem';
/**
 * Represents a single worker wallet in the spam system.
 * Handles local nonce management to enable high-concurrency transaction submission.
 */
export declare class Worker {
    account: Account;
    client: WalletClient<Transport, Chain, Account>;
    private nonce;
    /**
     * Creates a new Worker instance with a fresh random private key.
     *
     * @param rpcUrl The RPC URL to connect to.
     * @param chain The chain definition to use.
     */
    constructor(rpcUrl: string, chain: Chain);
    /**
     * Returns the address of the worker's wallet.
     */
    get address(): Address;
    /**
     * Initializes or updates the local nonce.
     * Must be called before sending transactions, typically after fetching the current nonce from the network.
     *
     * @param nonce The starting nonce value.
     */
    setNonce(nonce: number): void;
    /**
     * Gets the current local nonce and increments it for the next transaction.
     * Use this to avoid 'nonce too low' errors during rapid fire submission.
     *
     * @returns The nonce to use for the current transaction.
     * @throws Error if the nonce has not been initialized via setNonce().
     */
    getAndIncrementNonce(): number;
    /**
     * Sends a transaction from this worker's wallet using the managed local nonce.
     *
     * @param to The recipient address.
     * @param value The value in wei to transfer (default 0).
     * @param data The calldata for the transaction (default empty).
     * @returns The hash of the submitted transaction.
     */
    sendTransaction(to: Address, value?: bigint, data?: Hash): Promise<Hash>;
}
