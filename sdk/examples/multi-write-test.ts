import { SpamOrchestrator, SpamSequenceConfig } from '../src/index';
import { parseEther, createWalletClient, http, publicActions } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { foundry } from 'viem/chains';
import { SPAMMER_ABI, SPAMMER_BYTECODE } from './SpammerArtifact';

const RPC_URL = 'http://127.0.0.1:8545';
const ROOT_PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

async function deploySpammer(index: number) {
    const account = privateKeyToAccount(ROOT_PRIVATE_KEY);
    const client = createWalletClient({
        account,
        chain: {
            ...foundry,
            rpcUrls: { default: { http: [RPC_URL] } },
        },
        transport: http(RPC_URL),
    }).extend(publicActions);

    console.log(`Deploying Spammer #${index}...`);
    const hash = await client.deployContract({
        abi: SPAMMER_ABI,
        bytecode: SPAMMER_BYTECODE,
        args: [],
    });
    const receipt = await client.waitForTransactionReceipt({ hash });
    return receipt.contractAddress!;
}

async function main() {
    console.log('Starting MultiContractWrite verification...');

    // 1. Deploy 3 target contracts
    const targets: string[] = [];
    for (let i = 0; i < 3; i++) {
        const addr = await deploySpammer(i + 1);
        console.log(`Deployed target ${i + 1}: ${addr}`);
        targets.push(addr);
    }

    // 2. Configure spammer to use these targets
    const config: SpamSequenceConfig = {
        rpcUrl: RPC_URL,
        chainId: 31337,
        maxGasLimit: 30_000_000n,
        concurrency: 5, // 5 workers to ensure round-robin usage
        durationSeconds: 10,
        strategy: {
            mode: 'write_many',
            targetContracts: targets,
            functionName: 'spam',
            abi: SPAMMER_ABI as any,
            staticArgs: [],
        },
    };

    const orchestrator = new SpamOrchestrator(config, ROOT_PRIVATE_KEY);

    try {
        await orchestrator.setup(parseEther('5')); // Fund generously
        const result = await orchestrator.start();
        console.log('Spam finished. Stats:', result.stats);

        // Assertions
        if (result.stats['Strategy (write_many)'] > 0) {
            console.log('SUCCESS: Transactions sent using write_many strategy.');
        } else {
            console.error('FAILURE: No transactions sent.');
            process.exit(1);
        }
    } catch (e) {
        console.error('Error during spam:', e);
        process.exit(1);
    }
}

main();
