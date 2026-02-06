// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/Spammer.sol";

contract SpammerTest is Test {
    Spammer public spammer;

    function setUp() public {
        spammer = new Spammer();
    }

    function testSpam() public {
        // Just verify it doesn't revert.
        spammer.spam();
    }
}
