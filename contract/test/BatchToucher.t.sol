// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/BatchToucher.sol";

contract MockTarget {
    uint256 public callCount;

    fallback() external payable {
        callCount++;
    }
}

contract BatchToucherTest is Test {
    BatchToucher public toucher;
    MockTarget public t1;
    MockTarget public t2;
    MockTarget public t3;

    function setUp() public {
        toucher = new BatchToucher();
        t1 = new MockTarget();
        t2 = new MockTarget();
        t3 = new MockTarget();
    }

    function testTouchBatch() public {
        address[] memory targets = new address[](3);
        targets[0] = address(t1);
        targets[1] = address(t2);
        targets[2] = address(t3);

        toucher.touchBatch(targets);

        assertEq(t1.callCount(), 1);
        assertEq(t2.callCount(), 1);
        assertEq(t3.callCount(), 1);
    }

    function testTouchBatchEmpty() public {
        address[] memory targets = new address[](0);
        toucher.touchBatch(targets);
        // Should not revert
    }
}
