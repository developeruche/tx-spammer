
import json
import os

input_path = "../../contract/out/Spammer.sol/Spammer.json"
output_path = "SpammerArtifact.ts"

# Resolve absolute path for safety in the subagent environment if needed, 
# but relative paths usually work from cwd. 
# We'll assume cwd is sdk/examples/

try:
    with open(input_path, 'r') as f:
        data = json.load(f)
        abi = data['abi']
        # Bytecode might be in 'bytecode.object' or just 'bytecode'
        bytecode = data['bytecode']['object'] if isinstance(data['bytecode'], dict) else data['bytecode']

    content = f"""export const SPAMMER_ABI = {json.dumps(abi, indent=4)} as const;

export const SPAMMER_BYTECODE = "{bytecode}" as const;
"""

    with open(output_path, 'w') as f:
        f.write(content)
        
    print(f"Successfully extracted artifact to {output_path}")

except Exception as e:
    print(f"Error: {e}")
