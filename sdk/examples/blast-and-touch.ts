import { SpamOrchestrator, SpamSequenceConfig } from '../src/index';
import { parseEther, createWalletClient, http, publicActions, parseAbi } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { foundry } from 'viem/chains';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Example script to verify BlastLargeContracts and BatchToucher.
 */

import { spawn, ChildProcess } from 'child_process';

const RPC_URL = 'http://127.0.0.1:8545';
const ROOT_PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
const OUTPUT_FILE = path.join(__dirname, 'deployed_addresses.txt');

let anvilProcess: ChildProcess | null = null;

async function startAnvil() {
    console.log('Starting local Anvil node...');
    return new Promise<void>((resolve, reject) => {
        // Spawn anvil on default port 8545
        anvilProcess = spawn('anvil', ['--port', '8545'], { stdio: 'ignore' });

        anvilProcess.on('error', (err: any) => {
            console.error('Failed to start anvil:', err);
            reject(err);
        });
        // Simple wait for startup
        setTimeout(() => {
            console.log('Anvil started.');
            resolve();
        }, 2000);
    });
}

function stopAnvil() {
    if (anvilProcess) {
        console.log('Stopping Anvil...');
        anvilProcess.kill();
    }
}

// BatchToucher ABI/Bytecode (Simple version from prompt)
const TOUCHER_LOW_LEVEL_ABI = parseAbi([
    'function touchBatch(address[] calldata targets) external',
]);
const TOUCHER_SOURCE = `
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;
contract BatchToucher {
    function touchBatch(address[] calldata targets) external {
        for (uint256 i = 0; i < targets.length; i++) {
            (bool success, ) = targets[i].call(""); 
        }
    }
}
`;

async function main() {
    try {
        await startAnvil();

        console.log('Starting BlastLargeContracts + BatchToucher verification...');

        // Clean up old output
        if (fs.existsSync(OUTPUT_FILE)) {
            fs.unlinkSync(OUTPUT_FILE);
        }

        const artifactPath = path.join(
            __dirname,
            '../../contract/out/BatchToucher.sol/BatchToucher.json'
        );
        let toucherAddress = '0x0000000000000000000000000000000000000000';

        if (fs.existsSync(artifactPath)) {
            const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf-8'));
            const account = privateKeyToAccount(ROOT_PRIVATE_KEY);
            const client = createWalletClient({
                account,
                chain: { ...foundry, rpcUrls: { default: { http: [RPC_URL] } } },
                transport: http(RPC_URL),
            }).extend(publicActions);

            console.log('Deploying BatchToucher...');
            const hash = await client.deployContract({
                abi: artifact.abi,
                bytecode: artifact.bytecode.object,
            });
            const receipt = await client.waitForTransactionReceipt({ hash });
            toucherAddress = receipt.contractAddress!;
            console.log('BatchToucher deployed at:', toucherAddress);
        } else {
            console.warn('Artifact not found. Using dummy address (Expect Reverts/Failures).');
        }

        const blastConfig: SpamSequenceConfig = {
            rpcUrl: RPC_URL,
            chainId: 31337,
            maxGasLimit: 29_000_000n,
            concurrency: 5,
            durationSeconds: 5,
            strategy: {
                mode: 'blast_large_contracts',
                contractCount: 50,
                codeSize: 24 * 1024,
                outputFile: OUTPUT_FILE,
            },
        };

        const orchestratorBlast = new SpamOrchestrator(blastConfig, ROOT_PRIVATE_KEY);
        await orchestratorBlast.setup(parseEther('1'));
        await orchestratorBlast.start();

        // Check file
        if (fs.existsSync(OUTPUT_FILE)) {
            const lines = fs
                .readFileSync(OUTPUT_FILE, 'utf-8')
                .split('\n')
                .filter((l) => l);
            console.log(`Generated ${lines.length} addresses.`);
        } else {
            console.error('Failed to generate address file.');
            throw new Error('Address file generation failed');
        }

        const touchConfig: SpamSequenceConfig = {
            rpcUrl: RPC_URL,
            chainId: 31337,
            maxGasLimit: 29_000_000n,
            concurrency: 2,
            durationSeconds: 5,
            strategy: {
                mode: 'batch_toucher',
                inputFile: OUTPUT_FILE,
                batchSize: 10,
                toucherAddress: toucherAddress,
            },
        };

        const orchestratorTouch = new SpamOrchestrator(touchConfig, ROOT_PRIVATE_KEY);
        await orchestratorTouch.setup(parseEther('1'));
        const result = await orchestratorTouch.start();

        console.log('Touch Stats:', result.stats);
        if (result.stats['Strategy (batch_toucher)'] > 0) {
            console.log('SUCCESS: Touched contracts.');
        } else {
            console.error('FAILURE: No touch transactions.');
            throw new Error('No touch transactions executed');
        }
    } catch (e) {
        console.error('Test Failed:', e);
        process.exit(1);
    } finally {
        stopAnvil();
    }
}

main();
