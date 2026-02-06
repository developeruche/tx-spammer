import { Worker } from '../Worker';
import { BatchToucherConfig } from '../types';
import { GasGuardian } from '../GasGuardian';
import { type PublicClient, type Hash, parseAbi } from 'viem';
import * as fs from 'fs';

// Helper cache for file contents to avoid re-reading every access
let globalAddressList: string[] | null = null;
let globalAddressListPath: string | null = null;

function getAddresses(filePath: string): string[] {
    if (globalAddressList && globalAddressListPath === filePath) {
        return globalAddressList;
    }
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        // Filter out empty lines
        const addresses = content
            .split('\n')
            .map((l) => l.trim())
            .filter((l) => l.startsWith('0x'));
        if (addresses.length === 0) {
            console.warn(`Warning: No addresses found in input file ${filePath}`);
        }
        globalAddressList = addresses;
        globalAddressListPath = filePath;
        return addresses;
    } catch (e) {
        console.error(`Failed to read input file ${filePath}: ${e}`);
        return [];
    }
}

/**
 * Executes the batch toucher strategy.
 * Reads addresses from a file and calls 'touchBatch' on the BatchToucher contract.
 */
export async function executeBatchToucher(
    worker: Worker,
    config: BatchToucherConfig,
    gasGuardian: GasGuardian,
    publicClient: PublicClient,
    context?: { workerIndex: number; totalWorkers: number }
): Promise<Hash> {
    const addresses = getAddresses(config.inputFile);

    if (addresses.length === 0) {
        throw new Error(`No addresses available to touch in ${config.inputFile}`);
    }

    const batchSize = config.batchSize;
    let batch: `0x${string}`[] = [];

    if (context) {
        // Deterministic Partitioning
        // Range per worker:
        const totalAddresses = addresses.length;
        const addressesPerWorker = Math.ceil(totalAddresses / context.totalWorkers);

        const start = context.workerIndex * addressesPerWorker;
        const end = Math.min(start + addressesPerWorker, totalAddresses);

        // Calculate partition size and current offset derived from worker nonce
        const partitionSize = end - start;
        if (partitionSize <= 0) {
            // No addresses for this worker (e.g. excess workers)
            // We can return a successful dummy hash or just error.
            // For spam context, we throw to alert config mismatch or just break loop at caller level.
            throw new Error('Worker assigned empty partition');
        }

        const currentNonce = Number(worker.getCurrentNonce());
        const offset = (currentNonce * batchSize) % partitionSize;
        const batchStart = start + offset;

        batch = addresses.slice(batchStart, batchStart + batchSize) as `0x${string}`[];

        // Wrap around if batch exceeds partition end
        if (batch.length < batchSize) {
            const remaining = batchSize - batch.length;
            const wrapBatch = addresses.slice(start, start + remaining) as `0x${string}`[];
            batch = batch.concat(wrapBatch);
        }
    } else {
        // Fallback to random if context not provided
        const startIndex = Math.floor(Math.random() * (addresses.length - batchSize));
        const validStart = Math.max(0, startIndex);
        batch = addresses.slice(validStart, validStart + batchSize) as `0x${string}`[];
    }

    // ABI for touchBatch
    const abi = parseAbi(['function touchBatch(address[] calldata targets) external']);

    const args = [batch] as const;

    const estimatedGas = await publicClient.estimateContractGas({
        address: config.toucherAddress as `0x${string}`,
        abi: abi,
        functionName: 'touchBatch',
        args: args,
        account: worker.account,
    });

    gasGuardian.checkLimit(estimatedGas);

    const hash = await worker.client.writeContract({
        address: config.toucherAddress as `0x${string}`,
        abi: abi,
        functionName: 'touchBatch',
        args: args,
        account: worker.account,
        chain: worker.client.chain,
        // @ts-ignore
        nonce: worker.getAndIncrementNonce(),
    });

    gasGuardian.recordUsage(estimatedGas);
    return hash;
}
