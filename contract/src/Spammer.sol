// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

contract Spammer {
    mapping(address => mapping(address => mapping(address => uint256)))
        public map1;
    mapping(address => mapping(address => mapping(address => uint256)))
        public map2;
    mapping(address => mapping(address => mapping(address => uint256)))
        public map3;

    uint256 private nonce;

    constructor() {
        spam();
    }

    function spam() public {
        address k1 = _randomAddr("k1");
        address k2 = _randomAddr("k2");
        address k3 = _randomAddr("k3");

        uint256 val = _randomUint("val");

        map1[k1][k2][k3] = val;
        map2[k1][k2][k3] = val;
        map3[k1][k2][k3] = val;

        nonce++;
    }

    function _randomAddr(string memory seed) internal view returns (address) {
        return
            address(
                uint160(
                    uint256(
                        keccak256(
                            abi.encode(
                                block.timestamp,
                                block.prevrandao,
                                msg.sender,
                                block.number,
                                nonce,
                                seed
                            )
                        )
                    )
                )
            );
    }

    function _randomUint(string memory seed) internal view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encode(
                        block.timestamp,
                        block.prevrandao,
                        msg.sender,
                        block.number,
                        nonce,
                        seed
                    )
                )
            );
    }
}
