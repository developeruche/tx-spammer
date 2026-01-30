export class GasGuardian {
    private totalGasUsed: bigint = 0n;
    private readonly maxGasLimit: bigint;
    private _isLimitReached: boolean = false;

    constructor(maxGasLimit: bigint) {
        this.maxGasLimit = maxGasLimit;
    }

    /**
     * Checks if the estimated gas would exceed the limit.
     * Throws an error if the limit is exceeded.
     */
    public checkLimit(estimatedGas: bigint): void {
        if (this._isLimitReached) {
            throw new Error('Gas limit already reached. No further transactions allowed.');
        }
        if (this.totalGasUsed + estimatedGas > this.maxGasLimit) {
            this._isLimitReached = true;
            throw new Error(`Gas limit exceeded. Total: ${this.totalGasUsed}, Attempting: ${estimatedGas}, Max: ${this.maxGasLimit}`);
        }
    }

    /**
     * Records the actual gas used by a transaction.
     */
    public recordUsage(gasUsed: bigint): void {
        this.totalGasUsed += gasUsed;
        if (this.totalGasUsed >= this.maxGasLimit) {
            this._isLimitReached = true;
        }
    }

    public get gasUsed(): bigint {
        return this.totalGasUsed;
    }

    public get isLimitReached(): boolean {
        return this._isLimitReached;
    }

    public reset(): void {
        this.totalGasUsed = 0n;
        this._isLimitReached = false;
    }
}
