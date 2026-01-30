// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {Spammer} from "../src/Spammer.sol";

contract DeploySpammer is Script {
    function deploy_spammer() public returns (Spammer) {
        vm.startBroadcast();
        Spammer spammer = new Spammer();
        vm.stopBroadcast();
        return spammer;
    }

    function run() public {
        deploy_spammer();
    }
}