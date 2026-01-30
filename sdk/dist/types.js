"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpamSequenceConfigSchema = exports.SpamStrategySchema = exports.MixedStrategyConfigSchema = exports.ContractWriteConfigSchema = exports.ContractReadConfigSchema = exports.ContractDeployConfigSchema = exports.EthTransferConfigSchema = void 0;
const zod_1 = require("zod");
// --- Zod Schemas ---
/**
 * Configuration for ETH transfer spam strategy.
 * Includes depth for recursive transfers (if implemented) and recipient handling.
 */
exports.EthTransferConfigSchema = zod_1.z.object({
    mode: zod_1.z.literal('transfer'),
    /** Chain depth for recursive transfers (e.g. A -> B -> C). Default is 1. */
    depth: zod_1.z.number().int().positive().default(1),
    /** Amount of ETH to transfer per transaction in wei. Default is 1 wei. */
    amountPerTx: zod_1.z.bigint().positive().default(1n),
    /** Optional recipient address. If not set, may self-transfer or generate random address. */
    recipient: zod_1.z.string().optional(),
});
/**
 * Configuration for contract deployment spam strategy.
 * Requires bytecode and optional constructor arguments.
 */
exports.ContractDeployConfigSchema = zod_1.z.object({
    mode: zod_1.z.literal('deploy'),
    /** Hex string of the contract bytecode to deploy. */
    bytecode: zod_1.z.string().startsWith('0x'),
    /** Optional constructor arguments for the deployment. */
    args: zod_1.z.array(zod_1.z.any()).optional(),
});
/**
 * Configuration for contract read operations (eth_call).
 * Does not consume gas on-chain but stresses the RPC node.
 */
exports.ContractReadConfigSchema = zod_1.z.object({
    mode: zod_1.z.literal('read'),
    /** The target contract address to read from. */
    targetContract: zod_1.z.string().startsWith('0x'),
    /** The name of the function to call. */
    functionName: zod_1.z.string(),
    /** The contract ABI in JSON format. */
    abi: zod_1.z.array(zod_1.z.any()),
    /** Optional arguments for the function call. */
    args: zod_1.z.array(zod_1.z.any()).optional(),
});
/**
 * Configuration for contract write operations (state-changing transactions).
 * Consumes gas and stresses block building.
 */
exports.ContractWriteConfigSchema = zod_1.z.object({
    mode: zod_1.z.literal('write'),
    /** The target contract address to write to. */
    targetContract: zod_1.z.string().startsWith('0x'),
    /** The name of the function to call. */
    functionName: zod_1.z.string(),
    /** The contract ABI in JSON format. */
    abi: zod_1.z.array(zod_1.z.any()),
    /** Optional generator function for dynamic arguments per call. */
    argsGenerator: zod_1.z.custom().optional(),
    /** Optional static arguments for the function call (used if generator not provided). */
    staticArgs: zod_1.z.array(zod_1.z.any()).optional(),
});
// Single strategy types for reuse
const SingleStrategySchema = zod_1.z.discriminatedUnion('mode', [
    exports.EthTransferConfigSchema,
    exports.ContractDeployConfigSchema,
    exports.ContractReadConfigSchema,
    exports.ContractWriteConfigSchema,
]);
/**
 * Configuration for mixed strategy mode.
 * Allows defining multiple sub-strategies with percentage-based resource allocation.
 */
exports.MixedStrategyConfigSchema = zod_1.z.object({
    mode: zod_1.z.literal('mixed'),
    /**
     * List of strategies with their respective percentage allocation.
     * Percentages must sum to 100.
     */
    strategies: zod_1.z.array(zod_1.z.object({
        config: SingleStrategySchema,
        percentage: zod_1.z.number().nonnegative().max(100),
    })).refine((items) => {
        const sum = items.reduce((acc, item) => acc + item.percentage, 0);
        return Math.abs(sum - 100) < 0.1; // Allow small float error
    }, { message: "Percentages must sum to 100" }),
});
/**
 * Union schema for all possible spam strategies.
 */
exports.SpamStrategySchema = zod_1.z.discriminatedUnion('mode', [
    exports.EthTransferConfigSchema,
    exports.ContractDeployConfigSchema,
    exports.ContractReadConfigSchema,
    exports.ContractWriteConfigSchema,
    exports.MixedStrategyConfigSchema,
]);
/**
 * Top-level configuration for a spam sequence.
 */
exports.SpamSequenceConfigSchema = zod_1.z.object({
    /** RPC URL of the target node. */
    rpcUrl: zod_1.z.string().url(),
    /** Chain ID of the target network. */
    chainId: zod_1.z.number().int().positive(),
    /** Maximum cumulative gas limit for the sequence. Execution stops if reached. */
    maxGasLimit: zod_1.z.bigint().default(29000000n),
    /** Number of concurrent workers (wallets) to use. */
    concurrency: zod_1.z.number().int().positive().default(10),
    /** The selected spam strategy configuration. */
    strategy: exports.SpamStrategySchema,
    /** Optional duration in seconds to run the spam sequence. */
    durationSeconds: zod_1.z.number().int().positive().optional(),
    /** Optional maximum total transactions to attempts (if implemented). */
    totalTxs: zod_1.z.number().int().positive().optional(),
});
