"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GasGuardian = void 0;
/**
 * Responsible for tracking and limiting gas usage during the spam sequence.
 * Ensures the total estimated gas does not exceed the configured maximum.
 */
class GasGuardian {
    totalGasUsed = 0n;
    maxGasLimit;
    _isLimitReached = false;
    /**
     * @param maxGasLimit The total gas limit allowed for this guardian instance.
     */
    constructor(maxGasLimit) {
        this.maxGasLimit = maxGasLimit;
    }
    /**
     * Checks if the estimated gas would exceed the limit.
     * Throws an error if the limit is exceeded to prevent the transaction.
     *
     * @param estimatedGas The gas estimated for the pending transaction.
     * @throws Error if the limit is already reached or would be exceeded.
     */
    checkLimit(estimatedGas) {
        if (this._isLimitReached) {
            throw new Error('Gas limit already reached. No further transactions allowed.');
        }
        if (this.totalGasUsed + estimatedGas > this.maxGasLimit) {
            this._isLimitReached = true;
            throw new Error(`Gas limit exceeded. Total: ${this.totalGasUsed}, Attempting: ${estimatedGas}, Max: ${this.maxGasLimit}`);
        }
    }
    /**
     * Records the actual gas used by a transaction (or the estimate if actual usage is not available).
     * Updates the internal counter and checks if the limit has been hit.
     *
     * @param gasUsed The amount of gas to add to the total usage.
     */
    recordUsage(gasUsed) {
        this.totalGasUsed += gasUsed;
        if (this.totalGasUsed >= this.maxGasLimit) {
            this._isLimitReached = true;
        }
    }
    /**
     * Returns the total amount of gas recorded so far.
     */
    get gasUsed() {
        return this.totalGasUsed;
    }
    /**
     * Returns true if the gas limit has been reached or exceeded.
     */
    get isLimitReached() {
        return this._isLimitReached;
    }
    /**
     * Resets the gas usage counter and limit flag.
     */
    reset() {
        this.totalGasUsed = 0n;
        this._isLimitReached = false;
    }
}
exports.GasGuardian = GasGuardian;
