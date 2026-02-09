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
 * Wraps runtime bytecode in a standard deployment preamble (Init Code).
 * Structure:
 * PUSH2 size
 * PUSH1 0 (dest offset)
 * DUP2 (size)
 * PUSH1 offset (start of data in init code)
 * PUSH1 0 (src offset for memory copy)
 * CODECOPY
 * PUSH1 0 (return offset)
 * RETURN
 *
 * Simplified:
 * 61 SSSS (PUSH2 size)
 * 60 00 (PUSH1 0)
 * 81 (DUP2 - size)
 * 60 0D (PUSH1 13 - offset of data)
 * 82 (DUP3 - 0)
 * 39 (CODECOPY)
 * 81 (DUP2 - size)
 * 60 00 (PUSH1 0)
 * F3 (RETURN)
 */
function wrapInDeployer(runtimeBytecode: `0x${string}`): `0x${string}` {
    const runtimeBytes = Buffer.from(runtimeBytecode.slice(2), 'hex');
    const size = runtimeBytes.length;

    if (size > 0xffff) {
        throw new Error('Bytecode too large for simple PUSH2 deployer (max 65535)');
    }

    const sizeHex = size.toString(16).padStart(4, '0');

    // Preamble hex string
    // 61 SSSS 80 61 000D 60 00 39 60 00 F3
    // Wait, let's stick to the verified sequence:
    // PUSH2 SSSS (61 SSSS)
    // PUSH1 00 (60 00)
    // DUP2 (81)
    // PUSH2 000D (61 000D) -- Access offset 13. 
    // DUP3 (82) -- 0
    // CODECOPY (39)
    // DUP2 (81) -- size
    // PUSH1 00 (60 00)
    // RETURN (F3)

    // Length check: 
    // 61 SSSS (3)
    // 60 00 (2)
    // 81 (1)
    // 61 000D (3) - Assuming we use PUSH2 for offset too just to be safe/aligned, or PUSH1 if < 256. 13 is < 256.
    // Let's use PUSH1 for offset 13: 60 0D (2)
    // Total so far: 3+2+1+2 = 8
    // 82 (1) -> 9
    // 39 (1) -> 10
    // 81 (1) -> 11
    // 60 00 (2) -> 13
    // F3 (1) -> 14

    // If preamble is 14 bytes, offset is 14 (0x0E).

    // Opcode Sequence (14 bytes):
    // 61 SSSS      (PUSH2 size)
    // 60 00        (PUSH1 0)
    // 81           (DUP2 -> size)
    // 60 0E        (PUSH1 14 -> offset)
    // 82           (DUP3 -> 0)
    // 39           (CODECOPY)
    // 81           (DUP2 -> size)
    // 60 00        (PUSH1 0)
    // F3           (RETURN)

    const preamble = `61${sizeHex}600081600e8239816000f3`;

    return `0x${preamble}${runtimeBytes.toString('hex')}`;
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

    const rawBytecode = generateGarbageBytecode(pseudoIndex, config.codeSize);
    const bytecode = wrapInDeployer(rawBytecode);

    // Predict address
    const predictedAddress = getContractAddress({
        from: worker.account.address,
        nonce: BigInt(nonce),
    });

    // Hardcoded gas limit based on 24KB contract size:
    // 21k (base) + 32k (create) + 24576 * 200 (code) = ~5M gas.
    // Setting to 6,000,000 for safety.
    const gasLimit = 6_000_000n;
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
