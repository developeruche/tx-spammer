// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/Spammer.sol";

contract SpammerTest is Test {
    Spammer public spammer;

    function setUp() public {
        spammer = new Spammer();
    }

    function testReadOne() public {
        Spammer.Result_One memory res = spammer.read_one();

        // Basic sanity checks to ensure data is populated
        // We know the contract populates these in constructor
        assertFalse(res.r_1d[0] == 0, "r_1d should not be zero");
        assertFalse(res.r_1ds1[0].uint256_1 == 0, "r_1ds1 should not be zero");
    }

    function testWriteOne() public {
        Spammer.Result_One memory beforeRes = spammer.read_one();

        // Advance time to ensure random seed changes
        vm.warp(block.timestamp + 100);

        spammer.write_one();

        Spammer.Result_One memory afterRes = spammer.read_one();

        // Value should change because of new timestamp
        assertFalse(
            beforeRes.r_1d[0] == afterRes.r_1d[0],
            "r_1d should change after write_one"
        );
    }

    function testReadTwo() public {
        Spammer.Result_Two memory res = spammer.read_two();

        // Basic sanity checks
        assertFalse(res.r_1d[0] == 0, "r_1d should not be zero");
        assertFalse(
            res.r_2da[0] == address(0),
            "r_2da should not be zero address"
        );
    }

    function testWriteTwo() public {
        Spammer.Result_Two memory beforeRes = spammer.read_two();

        vm.warp(block.timestamp + 100);

        spammer.write_two();

        Spammer.Result_Two memory afterRes = spammer.read_two();

        assertFalse(
            beforeRes.r_1d[0] == afterRes.r_1d[0],
            "r_1d should change after write_two (via write_one)"
        );
        assertFalse(
            beforeRes.r_2da[0] == afterRes.r_2da[0],
            "r_2da should change after write_two"
        );
    }

    function testReadThree() public {
        Spammer.Result_Three memory res = spammer.read_three();

        // Basic sanity checks
        assertFalse(res.r_1d[0] == 0, "r_1d should not be zero");
        assertFalse(
            res.r_3db[0] == bytes32(0),
            "r_3db should not be zero bytes"
        );
    }

    function testWriteThree() public {
        Spammer.Result_Three memory beforeRes = spammer.read_three();

        vm.warp(block.timestamp + 100);

        spammer.write_three();

        Spammer.Result_Three memory afterRes = spammer.read_three();

        assertFalse(
            beforeRes.r_1d[0] == afterRes.r_1d[0],
            "r_1d should change after write_three (via write_two -> write_one)"
        );
        assertFalse(
            beforeRes.r_2da[0] == afterRes.r_2da[0],
            "r_2da should change after write_three (via write_two)"
        );
        assertFalse(
            beforeRes.r_3db[0] == afterRes.r_3db[0],
            "r_3db should change after write_three"
        );
    }
}
