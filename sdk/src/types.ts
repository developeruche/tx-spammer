import { z } from 'zod';
import { Address, Hex } from 'viem';

// --- Zod Schemas ---

/**
 * Configuration for ETH transfer spam strategy.
 * Includes depth for recursive transfers (if implemented) and recipient handling.
 */
export const EthTransferConfigSchema = z.object({
    mode: z.literal('transfer'),
    /** Chain depth for recursive transfers (e.g. A -> B -> C). Default is 1. */
    depth: z.number().int().positive().default(1),
    /** Amount of ETH to transfer per transaction in wei. Default is 1 wei. */
    amountPerTx: z.bigint().positive().default(1n),
    /** Optional recipient address. If not set, may self-transfer or generate random address. */
    recipient: z.string().optional(),
});

/**
 * Configuration for contract deployment spam strategy.
 * Requires bytecode and optional constructor arguments.
 */
export const ContractDeployConfigSchema = z.object({
    mode: z.literal('deploy'),
    /** Hex string of the contract bytecode to deploy. */
    bytecode: z.string().startsWith('0x'),
    /** Optional constructor arguments for the deployment. */
    args: z.array(z.any()).optional(),
});

/**
 * Configuration for contract read operations (eth_call).
 * Does not consume gas on-chain but stresses the RPC node.
 */
export const ContractReadConfigSchema = z.object({
    mode: z.literal('read'),
    /** The target contract address to read from. */
    targetContract: z.string().startsWith('0x'),
    /** The name of the function to call. */
    functionName: z.string(),
    /** The contract ABI in JSON format. */
    abi: z.array(z.any()),
    /** Optional arguments for the function call. */
    args: z.array(z.any()).optional(),
});

/**
 * Configuration for contract write operations (state-changing transactions).
 * Consumes gas and stresses block building.
 */
export const ContractWriteConfigSchema = z.object({
    mode: z.literal('write'),
    /** The target contract address to write to. */
    targetContract: z.string().startsWith('0x'),
    /** The name of the function to call. */
    functionName: z.string(),
    /** The contract ABI in JSON format. */
    abi: z.array(z.any()),
    /** Optional generator function for dynamic arguments per call. */
    argsGenerator: z.custom<() => any[]>().optional(),
    /** Optional static arguments for the function call (used if generator not provided). */
    staticArgs: z.array(z.any()).optional(),
});

// Single strategy types for reuse
const SingleStrategySchema = z.discriminatedUnion('mode', [
    EthTransferConfigSchema,
    ContractDeployConfigSchema,
    ContractReadConfigSchema,
    ContractWriteConfigSchema,
]);

/**
 * Configuration for mixed strategy mode.
 * Allows defining multiple sub-strategies with percentage-based resource allocation.
 */
export const MixedStrategyConfigSchema = z.object({
    mode: z.literal('mixed'),
    /**
     * List of strategies with their respective percentage allocation.
     * Percentages must sum to 100.
     */
    strategies: z
        .array(
            z.object({
                config: SingleStrategySchema,
                percentage: z.number().nonnegative().max(100),
            })
        )
        .refine(
            (items) => {
                const sum = items.reduce((acc, item) => acc + item.percentage, 0);
                return Math.abs(sum - 100) < 0.1; // Allow small float error
            },
            { message: 'Percentages must sum to 100' }
        ),
});

/**
 * Union schema for all possible spam strategies.
 */
export const SpamStrategySchema = z.discriminatedUnion('mode', [
    EthTransferConfigSchema,
    ContractDeployConfigSchema,
    ContractReadConfigSchema,
    ContractWriteConfigSchema,
    MixedStrategyConfigSchema,
]);

/**
 * Top-level configuration for a spam sequence.
 */
export const SpamSequenceConfigSchema = z.object({
    /** RPC URL of the target node. */
    rpcUrl: z.string().url(),
    /** Chain ID of the target network. */
    chainId: z.number().int().positive(),
    /** Maximum cumulative gas limit for the sequence. Execution stops if reached. */
    maxGasLimit: z.bigint().default(29_000_000n),
    /** Number of concurrent workers (wallets) to use. */
    concurrency: z.number().int().positive().default(10),
    /** The selected spam strategy configuration. */
    strategy: SpamStrategySchema,
    /** Optional duration in seconds to run the spam sequence. */
    durationSeconds: z.number().int().nonnegative().optional(),
    /** Optional maximum total transactions to attempts (if implemented). */
    totalTxs: z.number().int().positive().optional(),
});

// --- TypeScript Interfaces (Inferred) ---

/** TypeScript type alias for ETH Transfer config. */
export type EthTransferConfig = z.infer<typeof EthTransferConfigSchema>;
/** TypeScript type alias for Contract Deploy config. */
export type ContractDeployConfig = z.infer<typeof ContractDeployConfigSchema>;
/** TypeScript type alias for Contract Read config. */
export type ContractReadConfig = z.infer<typeof ContractReadConfigSchema>;
/** TypeScript type alias for Contract Write config. */
export type ContractWriteConfig = z.infer<typeof ContractWriteConfigSchema>;
/** TypeScript type alias for Mixed Strategy config. */
export type MixedStrategyConfig = z.infer<typeof MixedStrategyConfigSchema>;
/** TypeScript type alias for any Spam Strategy config. */
export type SpamStrategyConfig = z.infer<typeof SpamStrategySchema>;
/** TypeScript type alias for the full Spam Sequence config. */
export type SpamSequenceConfig = z.infer<typeof SpamSequenceConfigSchema>;

/**
 * Result returned after the spam sequence completes.
 */
export interface SpamResult {
    /** The block number of the last transaction mined (or current block if no txs). */
    blockNumber: bigint;
    /** The hash of the last transaction sent, if any. */
    txHash: Hex | null;
    /** Total cumulative gas used by all transactions in this sequence (local estimate). */
    totalGasUsed: bigint;
    /** The total gas used in the block corresponding to blockNumber. */
    finalBlockGasUsed: bigint;
}
