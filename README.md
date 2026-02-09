# EVM Transaction Spammer

**High-performance transaction load generator for EVM networks.**

[![Documentation](https://img.shields.io/badge/docs-tx--spammer.vercel.app-blue?style=for-the-badge&logo=vercel)](https://tx-spammer.vercel.app/)
[![npm version](https://img.shields.io/npm/v/@developeruche/tx-spammer-sdk?style=for-the-badge)](https://www.npmjs.com/package/@developeruche/tx-spammer-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

## Documentation

**Read the full documentation here: [https://tx-spammer.vercel.app/](https://tx-spammer.vercel.app/)**

The documentation includes:
- **Architecture**: How the `SpamOrchestrator`, `Worker Pool`, and `GasGuardian` work together.
- **Strategies**: Configuring Mixed, Write, Read, and Deploy strategies.
- **Reference**: Full TypeScript API documentation.

## Quick Start

### Installation

```bash
npm install @developeruche/tx-spammer-sdk
```

### Usage

```typescript
import { SpamOrchestrator } from '@developeruche/tx-spammer-sdk';
import { parseEther } from 'viem';

const orchestrator = new SpamOrchestrator({
    rpcUrl: 'http://127.0.0.1:8545',
    maxGasLimit: 29_000_000n,
    concurrency: 50, // 50 concurrent workers
    strategy: {
        mode: 'transfer',
        amountPerTx: parseEther('0.001')
    }
}, process.env.PRIVATE_KEY);

await orchestrator.setup(parseEther('1')); // Fund workers
await orchestrator.start(); // Unleash the flood
```

## Features

- **Mass Concurrency**: Spawns hundreds of lightweight, ephemeral wallets.
- **Gas Guardian**: Atomic state management to enforce strict block/sequence gas limits.
- **Mixed Strategy**: Define complex load profiles (e.g., "60% Writes, 30% Reads, 10% Deploys").
- **Zero Config**: Works out-of-the-box with Anvil and other Foundry tools.

## Advanced Strategies

### 1. Blast Large Contracts (`blast_large_contracts`)
Deploys randomly generated contracts with **24KB of garbage bytecode**.
- **Purpose**: Rapidly bloat the chain state and fill block space with large deployments.
- **Mechanism**:
    - Generates unique garbage bytecode for every transaction.
    - Wraps bytecode in a valid deployment preamble to ensure it is stored as runtime code.
    - Uses a high gas limit (~6M) to accommodate large payloads.
    - logs deployed addresses to a file.

```typescript
const strategy = {
    mode: 'blast_large_contracts',
    codeSize: 24 * 1024, // 24KB
    count: 1000,
    outputFile: './deployed_addresses.txt'
};
```

### 2. Batch Toucher (`batch_toucher`)
Reads a list of addresses and "touches" them (loads their state) in batches.
- **Purpose**: Stress-test the execution client's state access and witness generation patterns (e.g., verifying `verkle` or `merkle` witness performance).
- **Mechanism**:
    - **Deterministic Partitioning**: Workers automatically partition the address list among themselves to ensure **100% disjoint coverage** with zero overlap.
    - Calls a `touchBatch(address[])` function on a helper contract.
    - Forces the EVM to load the account and code for every address in the batch.

```typescript
const strategy = {
    mode: 'batch_toucher',
    inputFile: './deployed_addresses.txt',
    batchSize: 50,
    toucherAddress: '0x...' // Address of the BatchToucher contract
};
```

## Development

```bash
# Install dependencies
pnpm install

# Build SDK
pnpm --filter sdk build

# Run Docs
pnpm --filter docs dev
```
