import { Worker } from '../Worker';
import { BlastLargeContractsConfig } from '../types';
import { GasGuardian } from '../GasGuardian';
import { type PublicClient, type Hash, getContractAddress, toHex } from 'viem';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Generates random garbage bytecode of a specific size.
 * Based on the user provided example.
 */
function generateGarbageBytecode(index: number, totalSize: number): `0x${string}` {
    const prefix = new Uint8Array([0x00]);
    const suffixBuffer = Buffer.alloc(8);
    suffixBuffer.writeBigUInt64BE(BigInt(index));
    const suffix = new Uint8Array(suffixBuffer);
    const fillerSize = totalSize - 1 - 8;
    if (fillerSize < 0) throw new Error('Code size too small');
    const filler = crypto.randomBytes(fillerSize);

    return toHex(Buffer.concat([prefix, filler, suffix]));
}

/**
 * Executes the blast large contracts strategy.
 * Deploys multiple random contracts and logs their addresses to a file.
 */
export async function executeBlastLargeContracts(
    worker: Worker,
    config: BlastLargeContractsConfig,
    gasGuardian: GasGuardian,
    publicClient: PublicClient
): Promise<Hash> {
    // Generate unique garbage code using nonce + random offset for uniqueness
    const nonce = worker.getCurrentNonce();
    const pseudoIndex = Number(nonce) + Math.floor(Math.random() * 1000000);

    const bytecode = generateGarbageBytecode(pseudoIndex, config.codeSize);

    // Predict address
    const predictedAddress = getContractAddress({
        from: worker.account.address,
        nonce: BigInt(nonce),
    });

    // Hardcoded gas limit based on testing:
    // Observed estimate: ~1,001,000. Buffered (20%): ~1,201,000.
    // Setting to 1,250,000 for safety.
    const gasLimit = 1_250_000n;
    gasGuardian.checkLimit(gasLimit);

    const hash = await worker.client.deployContract({
        bytecode: bytecode,
        abi: [],
        args: [],
        // @ts-ignore
        nonce: worker.getAndIncrementNonce(),
        gas: gasLimit,
    });

    gasGuardian.recordUsage(gasLimit);

    // Append to output file
    try {
        const line = `${predictedAddress}\n`;
        const dir = path.dirname(config.outputFile);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.appendFileSync(config.outputFile, line);
    } catch (e) {
        console.error(`Failed to write to output file: ${e}`);
    }

    return hash;
}
