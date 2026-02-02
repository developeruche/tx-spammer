// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/Spammer.sol";
import "../src/Spam.sol";

contract SpammerWrapperTest is Test {
    Spammer public spammer;

    function setUp() public {
        spammer = new Spammer();
    }

    function test_write_one() public {
        // We can't easily check state changes in the ephemeral Spam contract without events,
        // but we can ensure the transaction succeeds.
        spammer.write_one();
    }

    function test_write_two() public {
        spammer.write_two();
    }

    function test_write_three() public {
        spammer.write_three();
    }
}
