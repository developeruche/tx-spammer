const fs = require('fs');
const path = require('path');

const artifactPath = path.resolve(__dirname, '../../contract/out/Spammer.sol/Spammer.json');
const targetPath = path.resolve(__dirname, 'SpammerArtifact.ts');

if (!fs.existsSync(artifactPath)) {
    console.error('Artifact not found at:', artifactPath);
    process.exit(1);
}

const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
const abi = JSON.stringify(artifact.abi, null, 4);
const bytecode = artifact.bytecode.object;

const content = `export const SPAMMER_ABI = ${abi} as const;

export const SPAMMER_BYTECODE = "${bytecode}";
`;

fs.writeFileSync(targetPath, content);
console.log('Updated SpammerArtifact.ts');
