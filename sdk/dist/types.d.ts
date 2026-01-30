import { z } from 'zod';
/**
 * Configuration for ETH transfer spam strategy.
 * Includes depth for recursive transfers (if implemented) and recipient handling.
 */
export declare const EthTransferConfigSchema: z.ZodObject<{
    mode: z.ZodLiteral<"transfer">;
    depth: z.ZodDefault<z.ZodNumber>;
    amountPerTx: z.ZodDefault<z.ZodBigInt>;
    recipient: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * Configuration for contract deployment spam strategy.
 * Requires bytecode and optional constructor arguments.
 */
export declare const ContractDeployConfigSchema: z.ZodObject<{
    mode: z.ZodLiteral<"deploy">;
    bytecode: z.ZodString;
    args: z.ZodOptional<z.ZodArray<z.ZodAny>>;
}, z.core.$strip>;
/**
 * Configuration for contract read operations (eth_call).
 * Does not consume gas on-chain but stresses the RPC node.
 */
export declare const ContractReadConfigSchema: z.ZodObject<{
    mode: z.ZodLiteral<"read">;
    targetContract: z.ZodString;
    functionName: z.ZodString;
    abi: z.ZodArray<z.ZodAny>;
    args: z.ZodOptional<z.ZodArray<z.ZodAny>>;
}, z.core.$strip>;
/**
 * Configuration for contract write operations (state-changing transactions).
 * Consumes gas and stresses block building.
 */
export declare const ContractWriteConfigSchema: z.ZodObject<{
    mode: z.ZodLiteral<"write">;
    targetContract: z.ZodString;
    functionName: z.ZodString;
    abi: z.ZodArray<z.ZodAny>;
    argsGenerator: z.ZodOptional<z.ZodCustom<() => any[], () => any[]>>;
    staticArgs: z.ZodOptional<z.ZodArray<z.ZodAny>>;
}, z.core.$strip>;
/**
 * Configuration for mixed strategy mode.
 * Allows defining multiple sub-strategies with percentage-based resource allocation.
 */
export declare const MixedStrategyConfigSchema: z.ZodObject<{
    mode: z.ZodLiteral<"mixed">;
    strategies: z.ZodArray<z.ZodObject<{
        config: z.ZodDiscriminatedUnion<[z.ZodObject<{
            mode: z.ZodLiteral<"transfer">;
            depth: z.ZodDefault<z.ZodNumber>;
            amountPerTx: z.ZodDefault<z.ZodBigInt>;
            recipient: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>, z.ZodObject<{
            mode: z.ZodLiteral<"deploy">;
            bytecode: z.ZodString;
            args: z.ZodOptional<z.ZodArray<z.ZodAny>>;
        }, z.core.$strip>, z.ZodObject<{
            mode: z.ZodLiteral<"read">;
            targetContract: z.ZodString;
            functionName: z.ZodString;
            abi: z.ZodArray<z.ZodAny>;
            args: z.ZodOptional<z.ZodArray<z.ZodAny>>;
        }, z.core.$strip>, z.ZodObject<{
            mode: z.ZodLiteral<"write">;
            targetContract: z.ZodString;
            functionName: z.ZodString;
            abi: z.ZodArray<z.ZodAny>;
            argsGenerator: z.ZodOptional<z.ZodCustom<() => any[], () => any[]>>;
            staticArgs: z.ZodOptional<z.ZodArray<z.ZodAny>>;
        }, z.core.$strip>], "mode">;
        percentage: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
/**
 * Union schema for all possible spam strategies.
 */
export declare const SpamStrategySchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    mode: z.ZodLiteral<"transfer">;
    depth: z.ZodDefault<z.ZodNumber>;
    amountPerTx: z.ZodDefault<z.ZodBigInt>;
    recipient: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    mode: z.ZodLiteral<"deploy">;
    bytecode: z.ZodString;
    args: z.ZodOptional<z.ZodArray<z.ZodAny>>;
}, z.core.$strip>, z.ZodObject<{
    mode: z.ZodLiteral<"read">;
    targetContract: z.ZodString;
    functionName: z.ZodString;
    abi: z.ZodArray<z.ZodAny>;
    args: z.ZodOptional<z.ZodArray<z.ZodAny>>;
}, z.core.$strip>, z.ZodObject<{
    mode: z.ZodLiteral<"write">;
    targetContract: z.ZodString;
    functionName: z.ZodString;
    abi: z.ZodArray<z.ZodAny>;
    argsGenerator: z.ZodOptional<z.ZodCustom<() => any[], () => any[]>>;
    staticArgs: z.ZodOptional<z.ZodArray<z.ZodAny>>;
}, z.core.$strip>, z.ZodObject<{
    mode: z.ZodLiteral<"mixed">;
    strategies: z.ZodArray<z.ZodObject<{
        config: z.ZodDiscriminatedUnion<[z.ZodObject<{
            mode: z.ZodLiteral<"transfer">;
            depth: z.ZodDefault<z.ZodNumber>;
            amountPerTx: z.ZodDefault<z.ZodBigInt>;
            recipient: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>, z.ZodObject<{
            mode: z.ZodLiteral<"deploy">;
            bytecode: z.ZodString;
            args: z.ZodOptional<z.ZodArray<z.ZodAny>>;
        }, z.core.$strip>, z.ZodObject<{
            mode: z.ZodLiteral<"read">;
            targetContract: z.ZodString;
            functionName: z.ZodString;
            abi: z.ZodArray<z.ZodAny>;
            args: z.ZodOptional<z.ZodArray<z.ZodAny>>;
        }, z.core.$strip>, z.ZodObject<{
            mode: z.ZodLiteral<"write">;
            targetContract: z.ZodString;
            functionName: z.ZodString;
            abi: z.ZodArray<z.ZodAny>;
            argsGenerator: z.ZodOptional<z.ZodCustom<() => any[], () => any[]>>;
            staticArgs: z.ZodOptional<z.ZodArray<z.ZodAny>>;
        }, z.core.$strip>], "mode">;
        percentage: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>], "mode">;
/**
 * Top-level configuration for a spam sequence.
 */
export declare const SpamSequenceConfigSchema: z.ZodObject<{
    rpcUrl: z.ZodString;
    chainId: z.ZodNumber;
    maxGasLimit: z.ZodDefault<z.ZodBigInt>;
    concurrency: z.ZodDefault<z.ZodNumber>;
    strategy: z.ZodDiscriminatedUnion<[z.ZodObject<{
        mode: z.ZodLiteral<"transfer">;
        depth: z.ZodDefault<z.ZodNumber>;
        amountPerTx: z.ZodDefault<z.ZodBigInt>;
        recipient: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>, z.ZodObject<{
        mode: z.ZodLiteral<"deploy">;
        bytecode: z.ZodString;
        args: z.ZodOptional<z.ZodArray<z.ZodAny>>;
    }, z.core.$strip>, z.ZodObject<{
        mode: z.ZodLiteral<"read">;
        targetContract: z.ZodString;
        functionName: z.ZodString;
        abi: z.ZodArray<z.ZodAny>;
        args: z.ZodOptional<z.ZodArray<z.ZodAny>>;
    }, z.core.$strip>, z.ZodObject<{
        mode: z.ZodLiteral<"write">;
        targetContract: z.ZodString;
        functionName: z.ZodString;
        abi: z.ZodArray<z.ZodAny>;
        argsGenerator: z.ZodOptional<z.ZodCustom<() => any[], () => any[]>>;
        staticArgs: z.ZodOptional<z.ZodArray<z.ZodAny>>;
    }, z.core.$strip>, z.ZodObject<{
        mode: z.ZodLiteral<"mixed">;
        strategies: z.ZodArray<z.ZodObject<{
            config: z.ZodDiscriminatedUnion<[z.ZodObject<{
                mode: z.ZodLiteral<"transfer">;
                depth: z.ZodDefault<z.ZodNumber>;
                amountPerTx: z.ZodDefault<z.ZodBigInt>;
                recipient: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>, z.ZodObject<{
                mode: z.ZodLiteral<"deploy">;
                bytecode: z.ZodString;
                args: z.ZodOptional<z.ZodArray<z.ZodAny>>;
            }, z.core.$strip>, z.ZodObject<{
                mode: z.ZodLiteral<"read">;
                targetContract: z.ZodString;
                functionName: z.ZodString;
                abi: z.ZodArray<z.ZodAny>;
                args: z.ZodOptional<z.ZodArray<z.ZodAny>>;
            }, z.core.$strip>, z.ZodObject<{
                mode: z.ZodLiteral<"write">;
                targetContract: z.ZodString;
                functionName: z.ZodString;
                abi: z.ZodArray<z.ZodAny>;
                argsGenerator: z.ZodOptional<z.ZodCustom<() => any[], () => any[]>>;
                staticArgs: z.ZodOptional<z.ZodArray<z.ZodAny>>;
            }, z.core.$strip>], "mode">;
            percentage: z.ZodNumber;
        }, z.core.$strip>>;
    }, z.core.$strip>], "mode">;
    durationSeconds: z.ZodOptional<z.ZodNumber>;
    totalTxs: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
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
