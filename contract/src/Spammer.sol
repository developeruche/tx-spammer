// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "./Spam.sol";

contract Spammer {
    function write_one() public {
        Spam spam = new Spam();
        spam.write_one();
    }

    function write_two() public {
        Spam spam = new Spam();
        spam.write_two();
    }

    function write_three() public {
        Spam spam = new Spam();
        spam.write_three();
    }
}
