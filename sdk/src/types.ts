import { z } from 'zod';
import { Address, Hex } from 'viem';

// --- Zod Schemas ---

export const EthTransferConfigSchema = z.object({
    mode: z.literal('transfer'),
    depth: z.number().int().positive().default(1), // Chain depth (A -> B -> C...)
    amountPerTx: z.bigint().positive().default(1n),
    recipient: z.string().optional(), // If not set, generate random or use chain
});

export const ContractDeployConfigSchema = z.object({
    mode: z.literal('deploy'),
    bytecode: z.string().startsWith('0x'),
    args: z.array(z.any()).optional(), // Constructor arguments
});

export const ContractReadConfigSchema = z.object({
    mode: z.literal('read'),
    targetContract: z.string().startsWith('0x'),
    functionName: z.string(),
    abi: z.array(z.any()), // JSON ABI
    args: z.array(z.any()).optional(),
});

export const ContractWriteConfigSchema = z.object({
    mode: z.literal('write'),
    targetContract: z.string().startsWith('0x'),
    functionName: z.string(),
    abi: z.array(z.any()), // JSON ABI
    argsGenerator: z.custom<() => any[]>().optional(), // For dynamic args
    staticArgs: z.array(z.any()).optional(),
});

export const SpamStrategySchema = z.discriminatedUnion('mode', [
    EthTransferConfigSchema,
    ContractDeployConfigSchema,
    ContractReadConfigSchema,
    ContractWriteConfigSchema,
]);

export const SpamSequenceConfigSchema = z.object({
    rpcUrl: z.string().url(),
    chainId: z.number().int().positive(),
    maxGasLimit: z.bigint().default(29_000_000n),
    concurrency: z.number().int().positive().default(10), // Number of concurrent workers
    strategy: SpamStrategySchema,
    durationSeconds: z.number().int().positive().optional(),
    totalTxs: z.number().int().positive().optional(),
});

// --- TypeScript Interfaces (Inferred) ---

export type EthTransferConfig = z.infer<typeof EthTransferConfigSchema>;
export type ContractDeployConfig = z.infer<typeof ContractDeployConfigSchema>;
export type ContractReadConfig = z.infer<typeof ContractReadConfigSchema>;
export type ContractWriteConfig = z.infer<typeof ContractWriteConfigSchema>;
export type SpamStrategyConfig = z.infer<typeof SpamStrategySchema>;
export type SpamSequenceConfig = z.infer<typeof SpamSequenceConfigSchema>;
