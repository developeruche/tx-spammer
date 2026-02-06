// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;


contract BatchToucher {
    // This function touches a list of addresses by sending 0 value calls to them.
    // This forces the client to load their bytecode into the witness.
    function touchBatch(address[] calldata targets) external {
        for (uint256 i = 0; i < targets.length; i++) {
            // Low-level call with 0 value and 0 data.
            // We ignore the return value (success/failure) because we only care
            // about the side effect: loading the code from the state trie.
            (bool success, ) = targets[i].call(""); 
        }
    }
}