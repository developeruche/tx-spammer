/**
 * Responsible for tracking and limiting gas usage during the spam sequence.
 * Ensures the total estimated gas does not exceed the configured maximum.
 */
export declare class GasGuardian {
    private totalGasUsed;
    private readonly maxGasLimit;
    private _isLimitReached;
    /**
     * @param maxGasLimit The total gas limit allowed for this guardian instance.
     */
    constructor(maxGasLimit: bigint);
    /**
     * Checks if the estimated gas would exceed the limit.
     * Throws an error if the limit is exceeded to prevent the transaction.
     *
     * @param estimatedGas The gas estimated for the pending transaction.
     * @throws Error if the limit is already reached or would be exceeded.
     */
    checkLimit(estimatedGas: bigint): void;
    /**
     * Records the actual gas used by a transaction (or the estimate if actual usage is not available).
     * Updates the internal counter and checks if the limit has been hit.
     *
     * @param gasUsed The amount of gas to add to the total usage.
     */
    recordUsage(gasUsed: bigint): void;
    /**
     * Returns the total amount of gas recorded so far.
     */
    get gasUsed(): bigint;
    /**
     * Returns true if the gas limit has been reached or exceeded.
     */
    get isLimitReached(): boolean;
    /**
     * Resets the gas usage counter and limit flag.
     */
    reset(): void;
}
