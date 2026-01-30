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

export class Worker {
    public account: Account;
    public client: WalletClient<Transport, Chain, Account>;
    private nonce: number | null = null;

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

    public get address(): Address {
        return this.account.address;
    }

    /**
     * Updates the local nonce. Ideally, called after an initial sync.
     */
    public setNonce(nonce: number) {
        this.nonce = nonce;
    }

    /**
     * Gets the current nonce and increments it for the next call.
     * Throws if nonce is not initialized.
     */
    public getAndIncrementNonce(): number {
        if (this.nonce === null) {
            throw new Error("Nonce not initialized for worker");
        }
        return this.nonce++;
    }

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
