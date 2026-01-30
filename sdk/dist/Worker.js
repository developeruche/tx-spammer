"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Worker = void 0;
const viem_1 = require("viem");
const accounts_1 = require("viem/accounts");
/**
 * Represents a single worker wallet in the spam system.
 * Handles local nonce management to enable high-concurrency transaction submission.
 */
class Worker {
    account;
    client;
    nonce = null;
    /**
     * Creates a new Worker instance with a fresh random private key.
     *
     * @param rpcUrl The RPC URL to connect to.
     * @param chain The chain definition to use.
     */
    constructor(rpcUrl, chain) {
        // Generate a fresh random private key for this worker
        const privateKey = (0, accounts_1.generatePrivateKey)();
        this.account = (0, accounts_1.privateKeyToAccount)(privateKey);
        this.client = (0, viem_1.createWalletClient)({
            account: this.account,
            chain: chain,
            transport: (0, viem_1.http)(rpcUrl),
        });
    }
    /**
     * Returns the address of the worker's wallet.
     */
    get address() {
        return this.account.address;
    }
    /**
     * Initializes or updates the local nonce.
     * Must be called before sending transactions, typically after fetching the current nonce from the network.
     *
     * @param nonce The starting nonce value.
     */
    setNonce(nonce) {
        this.nonce = nonce;
    }
    /**
     * Gets the current local nonce and increments it for the next transaction.
     * Use this to avoid 'nonce too low' errors during rapid fire submission.
     *
     * @returns The nonce to use for the current transaction.
     * @throws Error if the nonce has not been initialized via setNonce().
     */
    getAndIncrementNonce() {
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
    async sendTransaction(to, value = 0n, data = '0x') {
        return this.client.sendTransaction({
            to,
            value,
            data,
            // @ts-ignore - nonce override is valid but viem types might be strict depending on version
            nonce: this.getAndIncrementNonce()
        });
    }
}
exports.Worker = Worker;
