// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract Spammer {
    // ===================================================
    // Constants
    // ===================================================
    uint256 public constant ConstantUint256_1 =
        3264298902840367610842488557027791257854333893453722375653019111003822541146;
    uint256 public constant ConstantUint256_2 =
        3264298902840367610842488557027791257854333893453722375653019111003822541146;
    uint256 public constant ConstantUint256_3 =
        3264298902840367610842488557027791257854333893453722375653019111003822541146;
    uint256 public constant ConstantUint256_4 =
        3264298902840367610842488557027791257854333893453722375653019111003822541146;
    uint256 public constant ConstantUint256_5 =
        3264298902840367610842488557027791257854333893453722375653019111003822541146;
    uint256 public constant ConstantUint256_6 =
        3264298902840367610842488557027791257854333893453722375653019111003822541146;
    uint256 public constant ConstantUint256_7 =
        3264298902840367610842488557027791257854333893453722375653019111003822541146;
    uint256 public constant ConstantUint256_8 =
        3264298902840367610842488557027791257854333893453722375653019111003822541146;
    uint256 public constant ConstantUint256_9 =
        3264298902840367610842488557027791257854333893453722375653019111003822541146;
    uint256 public constant ConstantUint256_10 =
        3264298902840367610842488557027791257854333893453722375653019111003822541146;

    address public constant ConstantAddress_1 = 0x75cc09358F100583d66F5277138bfB476345dC1B;
    address public constant ConstantAddress_2 = 0x75cc09358F100583d66F5277138bfB476345dC1B;
    address public constant ConstantAddress_3 = 0x75cc09358F100583d66F5277138bfB476345dC1B;
    address public constant ConstantAddress_4 = 0x75cc09358F100583d66F5277138bfB476345dC1B;
    address public constant ConstantAddress_5 = 0x75cc09358F100583d66F5277138bfB476345dC1B;
    address public constant ConstantAddress_6 = 0x75cc09358F100583d66F5277138bfB476345dC1B;
    address public constant ConstantAddress_7 = 0x75cc09358F100583d66F5277138bfB476345dC1B;
    address public constant ConstantAddress_8 = 0x75cc09358F100583d66F5277138bfB476345dC1B;
    address public constant ConstantAddress_9 = 0x75cc09358F100583d66F5277138bfB476345dC1B;
    address public constant ConstantAddress_10 = 0x75cc09358F100583d66F5277138bfB476345dC1B;

    bytes32 public constant ConstantBytes32_1 = 0x07378717ae548106c4b38cbefffae84e0d2a8e23168a0264468d84704298c95a;
    bytes32 public constant ConstantBytes32_2 = 0x07378717ae548106c4b38cbefffae84e0d2a8e23168a0264468d84704298c95a;
    bytes32 public constant ConstantBytes32_3 = 0x07378717ae548106c4b38cbefffae84e0d2a8e23168a0264468d84704298c95a;
    bytes32 public constant ConstantBytes32_4 = 0x07378717ae548106c4b38cbefffae84e0d2a8e23168a0264468d84704298c95a;
    bytes32 public constant ConstantBytes32_5 = 0x07378717ae548106c4b38cbefffae84e0d2a8e23168a0264468d84704298c95a;
    bytes32 public constant ConstantBytes32_6 = 0x07378717ae548106c4b38cbefffae84e0d2a8e23168a0264468d84704298c95a;
    bytes32 public constant ConstantBytes32_7 = 0x07378717ae548106c4b38cbefffae84e0d2a8e23168a0264468d84704298c95a;
    bytes32 public constant ConstantBytes32_8 = 0x07378717ae548106c4b38cbefffae84e0d2a8e23168a0264468d84704298c95a;
    bytes32 public constant ConstantBytes32_9 = 0x07378717ae548106c4b38cbefffae84e0d2a8e23168a0264468d84704298c95a;
    bytes32 public constant ConstantBytes32_10 = 0x07378717ae548106c4b38cbefffae84e0d2a8e23168a0264468d84704298c95a;

    // ================================================
    // Structs
    // ================================================

    struct Struct_1 {
        uint256 uint256_1;
        uint256 uint256_2;
        uint256 uint256_3;
        uint256 uint256_4;
        uint256 uint256_5;
        uint256 uint256_6;
        uint256 uint256_7;
        uint256 uint256_8;
        uint256 uint256_9;
        uint256 uint256_10;
    }

    struct Struct_2 {
        address address_1;
        address address_2;
        address address_3;
        address address_4;
        address address_5;
        address address_6;
        address address_7;
        address address_8;
        address address_9;
        address address_10;
    }

    struct Struct_3 {
        bytes32 bytes32_1;
        bytes32 bytes32_2;
        bytes32 bytes32_3;
        bytes32 bytes32_4;
        bytes32 bytes32_5;
        bytes32 bytes32_6;
        bytes32 bytes32_7;
        bytes32 bytes32_8;
        bytes32 bytes32_9;
        bytes32 bytes32_10;
    }

    // ================================================
    // Mappings
    // ================================================

    // 1 D
    mapping(address => uint256) public mapping_1d;
    mapping(address => address) public mapping_1d_address;
    mapping(address => bytes32) public mapping_1d_bytes32;

    // 2 D
    mapping(address => mapping(address => uint256)) public mapping_2d;
    mapping(address => mapping(address => address)) public mapping_2d_address;
    mapping(address => mapping(address => bytes32)) public mapping_2d_bytes32;

    // 3 D
    mapping(address => mapping(address => mapping(address => uint256))) public mapping_3d;
    mapping(address => mapping(address => mapping(address => address))) public mapping_3d_address;
    mapping(address => mapping(address => mapping(address => bytes32))) public mapping_3d_bytes32;

    struct Result_One {
        uint256[3] r_1d;
        uint256[3] r_2d;
        uint256[3] r_3d;
        Struct_1[3] r_1ds1;
        Struct_1[3] r_2ds1;
        Struct_1[3] r_3ds1;
    }

    struct Result_Two {
        uint256[3] r_1d;
        uint256[3] r_2d;
        uint256[3] r_3d;
        Struct_1[3] r_1ds1;
        Struct_1[3] r_2ds1;
        Struct_1[3] r_3ds1;
        address[3] r_1da;
        address[3] r_2da;
        address[3] r_3da;
        Struct_2[3] r_1ds2;
        Struct_2[3] r_2ds2;
        Struct_2[3] r_3ds2;
    }

    struct Result_Three {
        uint256[3] r_1d;
        uint256[3] r_2d;
        uint256[3] r_3d;
        Struct_1[3] r_1ds1;
        Struct_1[3] r_2ds1;
        Struct_1[3] r_3ds1;
        address[3] r_1da;
        address[3] r_2da;
        address[3] r_3da;
        Struct_2[3] r_1ds2;
        Struct_2[3] r_2ds2;
        Struct_2[3] r_3ds2;
        bytes32[3] r_1db;
        bytes32[3] r_2db;
        bytes32[3] r_3db;
        Struct_3[3] r_1ds3;
        Struct_3[3] r_2ds3;
        Struct_3[3] r_3ds3;
    }

    // 1D with Struct
    mapping(address => Struct_1) public mapping_1d_struct_1;
    mapping(address => Struct_2) public mapping_1d_struct_2;
    mapping(address => Struct_3) public mapping_1d_struct_3;

    // 2D with Struct
    mapping(address => mapping(address => Struct_1)) public mapping_2d_struct_1;
    mapping(address => mapping(address => Struct_2)) public mapping_2d_struct_2;
    mapping(address => mapping(address => Struct_3)) public mapping_2d_struct_3;

    // 3D with Struct
    mapping(address => mapping(address => mapping(address => Struct_1))) public mapping_3d_struct_1;
    mapping(address => mapping(address => mapping(address => Struct_2))) public mapping_3d_struct_2;
    mapping(address => mapping(address => mapping(address => Struct_3))) public mapping_3d_struct_3;

    // 1 D read keys
    address public constant D1_read_keys_address_1 = 0x09371A71Ae8F666004E1B2A506c0eEdA4a79ccE8;
    address public constant D1_read_keys_address_2 = 0xe688b84b23f322a994A53dbF8E15FA82CDB71127;
    address public constant D1_read_keys_address_3 = 0xaCCaC8e7ADb651cbD269b851181C7b4Eb9bd332A;

    // 2 D read keys
    address public constant D2_stage_1_read_keys_address_1 = 0xe1c0DC9937319d17bf63ff73bEfd47A87810C8a8;
    address public constant D2_stage_1_read_keys_address_2 = 0xfD62020Cee216Dc543E29752058Ee9f60f7D9Ff9;
    address public constant D2_stage_1_read_keys_address_3 = 0x945fE55105c82806aFB6c637C66cFAD61eEA5B77;

    address public constant D2_stage_2_read_keys_address_1 = 0x69C0e44cfE9fDd9683255E4D41652eF2Fd4FfB32;
    address public constant D2_stage_2_read_keys_address_2 = 0x94E0d7Bf4385C266d93818b6CB728Cf024554AA0;
    address public constant D2_stage_2_read_keys_address_3 = 0xc0007D8c810becE9B3199Bb65799145165F9437C;

    // 3 D read keys
    address public constant D3_stage_1_read_keys_address_1 = 0xe1c0DC9937319d17bf63ff73bEfd47A87810C8a8;
    address public constant D3_stage_1_read_keys_address_2 = 0xfD62020Cee216Dc543E29752058Ee9f60f7D9Ff9;
    address public constant D3_stage_1_read_keys_address_3 = 0x69C0e44cfE9fDd9683255E4D41652eF2Fd4FfB32;

    address public constant D3_stage_2_read_keys_address_1 = 0x727ab98FbF6df0C0cF2B1ECEE9BfB9b70f1b1857;
    address public constant D3_stage_2_read_keys_address_2 = 0x945fE55105c82806aFB6c637C66cFAD61eEA5B77;
    address public constant D3_stage_2_read_keys_address_3 = 0x3D6bF18DE84dA25d519974DA38bE7990D115436e;

    address public constant D3_stage_3_read_keys_address_1 = 0x9866c16098A278246CF313DA88B386C61060B93B;
    address public constant D3_stage_3_read_keys_address_2 = 0x8122842ce1B636EB7F7144B42089A4D7025085bB;
    address public constant D3_stage_3_read_keys_address_3 = 0x94E0d7Bf4385C266d93818b6CB728Cf024554AA0;

    // 1D Struct read keys
    address public constant Struct_1_read_keys_address_1 = 0x04B79F7F444a1983e6034a4442B85ED8576259e6;
    address public constant Struct_1_read_keys_address_2 = 0x70C068C0d639C8184d758CD467d2aee8D789dC67;
    address public constant Struct_1_read_keys_address_3 = 0xBEEDD84b868A3282d9D2B724f0ACbDe280678888;

    // 2D Struct read keys
    address public constant Struct_2_read_keys_address_1 = 0xe92e65049b3c2ca12806E9567B08895118c5a03f;
    address public constant Struct_2_read_keys_address_2 = 0x2CfF890f0378a11913B6129B2E97417a2c302680;
    address public constant Struct_2_read_keys_address_3 = 0x88F7388B0108f6fABA4E9dB888A66ef83657846b;

    address public constant Struct_2_stage_2_read_keys_address_1 = 0x1592010A9858f156617457D34d93912064A162C4;
    address public constant Struct_2_stage_2_read_keys_address_2 = 0x04a66650Ca5fcAd2c59a5544776841fD7bb1De0a;
    address public constant Struct_2_stage_2_read_keys_address_3 = 0xDBBab478129857Ca7acD2E6444a39613d7737b26;

    // 3D Struct read keys
    address public constant Struct_3_read_keys_address_1 = 0x23f311709dA08E7939fcbA1f67367ffc7F40f525;
    address public constant Struct_3_read_keys_address_2 = 0xf62624324bFd9DCA76095cEEC877A0946F0d3C4D;
    address public constant Struct_3_read_keys_address_3 = 0xA7EfBd09D86b0EC510594B15f8a892F867bEDF7A;

    address public constant Struct_3_stage_2_read_keys_address_1 = 0xf626ec1ef676b5399c64c344AC9825646F0D3c4d;
    address public constant Struct_3_stage_2_read_keys_address_2 = 0x945F7b00678C83Cb86cCF65b302ED20d8caa5b77;
    address public constant Struct_3_stage_2_read_keys_address_3 = 0x4dc2A3Ace8CDF0988c617C59A2d3C7af84fCa217;

    address public constant Struct_3_stage_3_read_keys_address_1 = 0xFE31d026F3f285927EfcB1C2Ee8558b4d7CF2141;
    address public constant Struct_3_stage_3_read_keys_address_2 = 0x83F765f5e13273949BcdbF0B3C02c4bfb350F46A;
    address public constant Struct_3_stage_3_read_keys_address_3 = 0x1D107293b9836d3B333978Da6ff7a9943C2a0b16;

    function _randomUint(uint256 seed) internal view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.timestamp, seed, "uint")));
    }

    function _randomAddress(uint256 seed) internal view returns (address) {
        return address(uint160(uint256(keccak256(abi.encodePacked(block.timestamp, seed, "address")))));
    }

    function _randomBytes32(uint256 seed) internal view returns (bytes32) {
        return keccak256(abi.encodePacked(block.timestamp, seed, "bytes32"));
    }

    function _randomStruct1(uint256 seed) internal view returns (Struct_1 memory) {
        return Struct_1(
            _randomUint(seed),
            _randomUint(seed + 1),
            _randomUint(seed + 2),
            _randomUint(seed + 3),
            _randomUint(seed + 4),
            _randomUint(seed + 5),
            _randomUint(seed + 6),
            _randomUint(seed + 7),
            _randomUint(seed + 8),
            _randomUint(seed + 9)
        );
    }

    function _randomStruct2(uint256 seed) internal view returns (Struct_2 memory) {
        return Struct_2(
            _randomAddress(seed),
            _randomAddress(seed + 1),
            _randomAddress(seed + 2),
            _randomAddress(seed + 3),
            _randomAddress(seed + 4),
            _randomAddress(seed + 5),
            _randomAddress(seed + 6),
            _randomAddress(seed + 7),
            _randomAddress(seed + 8),
            _randomAddress(seed + 9)
        );
    }

    function _randomStruct3(uint256 seed) internal view returns (Struct_3 memory) {
        return Struct_3(
            _randomBytes32(seed),
            _randomBytes32(seed + 1),
            _randomBytes32(seed + 2),
            _randomBytes32(seed + 3),
            _randomBytes32(seed + 4),
            _randomBytes32(seed + 5),
            _randomBytes32(seed + 6),
            _randomBytes32(seed + 7),
            _randomBytes32(seed + 8),
            _randomBytes32(seed + 9)
        );
    }

    constructor() {
        // 1D
        {
            address[3] memory keys = [D1_read_keys_address_1, D1_read_keys_address_2, D1_read_keys_address_3];
            for (uint256 i = 0; i < 3; i++) {
                uint256 seed = uint256(uint160(keys[i]));
                mapping_1d[keys[i]] = _randomUint(seed);
                mapping_1d_address[keys[i]] = _randomAddress(seed);
                mapping_1d_bytes32[keys[i]] = _randomBytes32(seed);
            }
        }

        // 2D
        {
            address[3] memory k1 =
                [D2_stage_1_read_keys_address_1, D2_stage_1_read_keys_address_2, D2_stage_1_read_keys_address_3];
            address[3] memory k2 =
                [D2_stage_2_read_keys_address_1, D2_stage_2_read_keys_address_2, D2_stage_2_read_keys_address_3];
            for (uint256 i = 0; i < 3; i++) {
                uint256 seed = uint256(uint160(k1[i]) ^ uint160(k2[i]));
                mapping_2d[k1[i]][k2[i]] = _randomUint(seed);
                mapping_2d_address[k1[i]][k2[i]] = _randomAddress(seed);
                mapping_2d_bytes32[k1[i]][k2[i]] = _randomBytes32(seed);
            }
        }

        // 3D
        {
            address[3] memory k1 =
                [D3_stage_1_read_keys_address_1, D3_stage_1_read_keys_address_2, D3_stage_1_read_keys_address_3];
            address[3] memory k2 =
                [D3_stage_2_read_keys_address_1, D3_stage_2_read_keys_address_2, D3_stage_2_read_keys_address_3];
            address[3] memory k3 =
                [D3_stage_3_read_keys_address_1, D3_stage_3_read_keys_address_2, D3_stage_3_read_keys_address_3];
            for (uint256 i = 0; i < 3; i++) {
                uint256 seed = uint256(uint160(k1[i]) ^ uint160(k2[i]) ^ uint160(k3[i]));
                mapping_3d[k1[i]][k2[i]][k3[i]] = _randomUint(seed);
                mapping_3d_address[k1[i]][k2[i]][k3[i]] = _randomAddress(seed);
                mapping_3d_bytes32[k1[i]][k2[i]][k3[i]] = _randomBytes32(seed);
            }
        }

        // 1D Struct
        {
            address[3] memory keys =
                [Struct_1_read_keys_address_1, Struct_1_read_keys_address_2, Struct_1_read_keys_address_3];
            for (uint256 i = 0; i < 3; i++) {
                uint256 seed = uint256(uint160(keys[i]));
                mapping_1d_struct_1[keys[i]] = _randomStruct1(seed);
                mapping_1d_struct_2[keys[i]] = _randomStruct2(seed);
                mapping_1d_struct_3[keys[i]] = _randomStruct3(seed);
            }
        }

        // 2D Struct
        {
            address[3] memory k1 =
                [Struct_2_read_keys_address_1, Struct_2_read_keys_address_2, Struct_2_read_keys_address_3];
            address[3] memory k2 = [
                Struct_2_stage_2_read_keys_address_1,
                Struct_2_stage_2_read_keys_address_2,
                Struct_2_stage_2_read_keys_address_3
            ];
            for (uint256 i = 0; i < 3; i++) {
                uint256 seed = uint256(uint160(k1[i]) ^ uint160(k2[i]));
                mapping_2d_struct_1[k1[i]][k2[i]] = _randomStruct1(seed);
                mapping_2d_struct_2[k1[i]][k2[i]] = _randomStruct2(seed);
                mapping_2d_struct_3[k1[i]][k2[i]] = _randomStruct3(seed);
            }
        }

        // 3D Struct
        {
            address[3] memory k1 =
                [Struct_3_read_keys_address_1, Struct_3_read_keys_address_2, Struct_3_read_keys_address_3];
            address[3] memory k2 = [
                Struct_3_stage_2_read_keys_address_1,
                Struct_3_stage_2_read_keys_address_2,
                Struct_3_stage_2_read_keys_address_3
            ];
            address[3] memory k3 = [
                Struct_3_stage_3_read_keys_address_1,
                Struct_3_stage_3_read_keys_address_2,
                Struct_3_stage_3_read_keys_address_3
            ];
            for (uint256 i = 0; i < 3; i++) {
                uint256 seed = uint256(uint160(k1[i]) ^ uint160(k2[i]) ^ uint160(k3[i]));
                mapping_3d_struct_1[k1[i]][k2[i]][k3[i]] = _randomStruct1(seed);
                mapping_3d_struct_2[k1[i]][k2[i]][k3[i]] = _randomStruct2(seed);
                mapping_3d_struct_3[k1[i]][k2[i]][k3[i]] = _randomStruct3(seed);
            }
        }
    }

    function read_one() public view returns (Result_One memory res) {
        // 1D
        {
            address[3] memory keys = [D1_read_keys_address_1, D1_read_keys_address_2, D1_read_keys_address_3];
            for (uint256 i = 0; i < 3; i++) {
                res.r_1d[i] = mapping_1d[keys[i]];
            }
        }
        // 2D
        {
            address[3] memory k1 =
                [D2_stage_1_read_keys_address_1, D2_stage_1_read_keys_address_2, D2_stage_1_read_keys_address_3];
            address[3] memory k2 =
                [D2_stage_2_read_keys_address_1, D2_stage_2_read_keys_address_2, D2_stage_2_read_keys_address_3];
            for (uint256 i = 0; i < 3; i++) {
                res.r_2d[i] = mapping_2d[k1[i]][k2[i]];
            }
        }
        // 3D
        {
            address[3] memory k1 =
                [D3_stage_1_read_keys_address_1, D3_stage_1_read_keys_address_2, D3_stage_1_read_keys_address_3];
            address[3] memory k2 =
                [D3_stage_2_read_keys_address_1, D3_stage_2_read_keys_address_2, D3_stage_2_read_keys_address_3];
            address[3] memory k3 =
                [D3_stage_3_read_keys_address_1, D3_stage_3_read_keys_address_2, D3_stage_3_read_keys_address_3];
            for (uint256 i = 0; i < 3; i++) {
                res.r_3d[i] = mapping_3d[k1[i]][k2[i]][k3[i]];
            }
        }
        // 1D Struct 1
        {
            address[3] memory keys =
                [Struct_1_read_keys_address_1, Struct_1_read_keys_address_2, Struct_1_read_keys_address_3];
            for (uint256 i = 0; i < 3; i++) {
                res.r_1ds1[i] = mapping_1d_struct_1[keys[i]];
            }
        }
        // 2D Struct 1
        {
            address[3] memory k1 =
                [Struct_2_read_keys_address_1, Struct_2_read_keys_address_2, Struct_2_read_keys_address_3];
            address[3] memory k2 = [
                Struct_2_stage_2_read_keys_address_1,
                Struct_2_stage_2_read_keys_address_2,
                Struct_2_stage_2_read_keys_address_3
            ];
            for (uint256 i = 0; i < 3; i++) {
                res.r_2ds1[i] = mapping_2d_struct_1[k1[i]][k2[i]];
            }
        }
        // 3D Struct 1
        {
            address[3] memory k1 =
                [Struct_3_read_keys_address_1, Struct_3_read_keys_address_2, Struct_3_read_keys_address_3];
            address[3] memory k2 = [
                Struct_3_stage_2_read_keys_address_1,
                Struct_3_stage_2_read_keys_address_2,
                Struct_3_stage_2_read_keys_address_3
            ];
            address[3] memory k3 = [
                Struct_3_stage_3_read_keys_address_1,
                Struct_3_stage_3_read_keys_address_2,
                Struct_3_stage_3_read_keys_address_3
            ];
            for (uint256 i = 0; i < 3; i++) {
                res.r_3ds1[i] = mapping_3d_struct_1[k1[i]][k2[i]][k3[i]];
            }
        }
    }

    function read_two() public view returns (Result_Two memory res) {
        // Reuse read_one
        {
            Result_One memory one = read_one();
            res.r_1d = one.r_1d;
            res.r_2d = one.r_2d;
            res.r_3d = one.r_3d;
            res.r_1ds1 = one.r_1ds1;
            res.r_2ds1 = one.r_2ds1;
            res.r_3ds1 = one.r_3ds1;
        }

        // 1D Addr
        {
            address[3] memory keys = [D1_read_keys_address_1, D1_read_keys_address_2, D1_read_keys_address_3];
            for (uint256 i = 0; i < 3; i++) {
                res.r_1da[i] = mapping_1d_address[keys[i]];
            }
        }
        // 2D Addr
        {
            address[3] memory k1 =
                [D2_stage_1_read_keys_address_1, D2_stage_1_read_keys_address_2, D2_stage_1_read_keys_address_3];
            address[3] memory k2 =
                [D2_stage_2_read_keys_address_1, D2_stage_2_read_keys_address_2, D2_stage_2_read_keys_address_3];
            for (uint256 i = 0; i < 3; i++) {
                res.r_2da[i] = mapping_2d_address[k1[i]][k2[i]];
            }
        }
        // 3D Addr
        {
            address[3] memory k1 =
                [D3_stage_1_read_keys_address_1, D3_stage_1_read_keys_address_2, D3_stage_1_read_keys_address_3];
            address[3] memory k2 =
                [D3_stage_2_read_keys_address_1, D3_stage_2_read_keys_address_2, D3_stage_2_read_keys_address_3];
            address[3] memory k3 =
                [D3_stage_3_read_keys_address_1, D3_stage_3_read_keys_address_2, D3_stage_3_read_keys_address_3];
            for (uint256 i = 0; i < 3; i++) {
                res.r_3da[i] = mapping_3d_address[k1[i]][k2[i]][k3[i]];
            }
        }

        // 1D Struct 2
        {
            address[3] memory keys =
                [Struct_1_read_keys_address_1, Struct_1_read_keys_address_2, Struct_1_read_keys_address_3];
            for (uint256 i = 0; i < 3; i++) {
                res.r_1ds2[i] = mapping_1d_struct_2[keys[i]];
            }
        }
        // 2D Struct 2
        {
            address[3] memory k1 =
                [Struct_2_read_keys_address_1, Struct_2_read_keys_address_2, Struct_2_read_keys_address_3];
            address[3] memory k2 = [
                Struct_2_stage_2_read_keys_address_1,
                Struct_2_stage_2_read_keys_address_2,
                Struct_2_stage_2_read_keys_address_3
            ];
            for (uint256 i = 0; i < 3; i++) {
                res.r_2ds2[i] = mapping_2d_struct_2[k1[i]][k2[i]];
            }
        }
        // 3D Struct 2
        {
            address[3] memory k1 =
                [Struct_3_read_keys_address_1, Struct_3_read_keys_address_2, Struct_3_read_keys_address_3];
            address[3] memory k2 = [
                Struct_3_stage_2_read_keys_address_1,
                Struct_3_stage_2_read_keys_address_2,
                Struct_3_stage_2_read_keys_address_3
            ];
            address[3] memory k3 = [
                Struct_3_stage_3_read_keys_address_1,
                Struct_3_stage_3_read_keys_address_2,
                Struct_3_stage_3_read_keys_address_3
            ];
            for (uint256 i = 0; i < 3; i++) {
                res.r_3ds2[i] = mapping_3d_struct_2[k1[i]][k2[i]][k3[i]];
            }
        }
    }

    function read_three() public view returns (Result_Three memory res) {
        // Reuse read_two
        {
            Result_Two memory two = read_two();
            res.r_1d = two.r_1d;
            res.r_2d = two.r_2d;
            res.r_3d = two.r_3d;
            res.r_1ds1 = two.r_1ds1;
            res.r_2ds1 = two.r_2ds1;
            res.r_3ds1 = two.r_3ds1;
            res.r_1da = two.r_1da;
            res.r_2da = two.r_2da;
            res.r_3da = two.r_3da;
            res.r_1ds2 = two.r_1ds2;
            res.r_2ds2 = two.r_2ds2;
            res.r_3ds2 = two.r_3ds2;
        }

        // 1D Bytes
        {
            address[3] memory keys = [D1_read_keys_address_1, D1_read_keys_address_2, D1_read_keys_address_3];
            for (uint256 i = 0; i < 3; i++) {
                res.r_1db[i] = mapping_1d_bytes32[keys[i]];
            }
        }
        // 2D Bytes
        {
            address[3] memory k1 =
                [D2_stage_1_read_keys_address_1, D2_stage_1_read_keys_address_2, D2_stage_1_read_keys_address_3];
            address[3] memory k2 =
                [D2_stage_2_read_keys_address_1, D2_stage_2_read_keys_address_2, D2_stage_2_read_keys_address_3];
            for (uint256 i = 0; i < 3; i++) {
                res.r_2db[i] = mapping_2d_bytes32[k1[i]][k2[i]];
            }
        }
        // 3D Bytes
        {
            address[3] memory k1 =
                [D3_stage_1_read_keys_address_1, D3_stage_1_read_keys_address_2, D3_stage_1_read_keys_address_3];
            address[3] memory k2 =
                [D3_stage_2_read_keys_address_1, D3_stage_2_read_keys_address_2, D3_stage_2_read_keys_address_3];
            address[3] memory k3 =
                [D3_stage_3_read_keys_address_1, D3_stage_3_read_keys_address_2, D3_stage_3_read_keys_address_3];
            for (uint256 i = 0; i < 3; i++) {
                res.r_3db[i] = mapping_3d_bytes32[k1[i]][k2[i]][k3[i]];
            }
        }

        // 1D Struct 3
        {
            address[3] memory keys =
                [Struct_1_read_keys_address_1, Struct_1_read_keys_address_2, Struct_1_read_keys_address_3];
            for (uint256 i = 0; i < 3; i++) {
                res.r_1ds3[i] = mapping_1d_struct_3[keys[i]];
            }
        }
        // 2D Struct 3
        {
            address[3] memory k1 =
                [Struct_2_read_keys_address_1, Struct_2_read_keys_address_2, Struct_2_read_keys_address_3];
            address[3] memory k2 = [
                Struct_2_stage_2_read_keys_address_1,
                Struct_2_stage_2_read_keys_address_2,
                Struct_2_stage_2_read_keys_address_3
            ];
            for (uint256 i = 0; i < 3; i++) {
                res.r_2ds3[i] = mapping_2d_struct_3[k1[i]][k2[i]];
            }
        }
        // 3D Struct 3
        {
            address[3] memory k1 =
                [Struct_3_read_keys_address_1, Struct_3_read_keys_address_2, Struct_3_read_keys_address_3];
            address[3] memory k2 = [
                Struct_3_stage_2_read_keys_address_1,
                Struct_3_stage_2_read_keys_address_2,
                Struct_3_stage_2_read_keys_address_3
            ];
            address[3] memory k3 = [
                Struct_3_stage_3_read_keys_address_1,
                Struct_3_stage_3_read_keys_address_2,
                Struct_3_stage_3_read_keys_address_3
            ];
            for (uint256 i = 0; i < 3; i++) {
                res.r_3ds3[i] = mapping_3d_struct_3[k1[i]][k2[i]][k3[i]];
            }
        }
    }

    function write_one() public {
        // 1D
        {
            address[3] memory keys = [D1_read_keys_address_1, D1_read_keys_address_2, D1_read_keys_address_3];
            for (uint256 i = 0; i < 3; i++) {
                uint256 seed = uint256(uint160(keys[i])) + block.timestamp;
                mapping_1d[keys[i]] = _randomUint(seed);
            }
        }

        // 2D
        {
            address[3] memory k1 =
                [D2_stage_1_read_keys_address_1, D2_stage_1_read_keys_address_2, D2_stage_1_read_keys_address_3];
            address[3] memory k2 =
                [D2_stage_2_read_keys_address_1, D2_stage_2_read_keys_address_2, D2_stage_2_read_keys_address_3];
            for (uint256 i = 0; i < 3; i++) {
                uint256 seed = uint256(uint160(k1[i]) ^ uint160(k2[i])) + block.timestamp;
                mapping_2d[k1[i]][k2[i]] = _randomUint(seed);
            }
        }

        // 3D
        {
            address[3] memory k1 =
                [D3_stage_1_read_keys_address_1, D3_stage_1_read_keys_address_2, D3_stage_1_read_keys_address_3];
            address[3] memory k2 =
                [D3_stage_2_read_keys_address_1, D3_stage_2_read_keys_address_2, D3_stage_2_read_keys_address_3];
            address[3] memory k3 =
                [D3_stage_3_read_keys_address_1, D3_stage_3_read_keys_address_2, D3_stage_3_read_keys_address_3];
            for (uint256 i = 0; i < 3; i++) {
                uint256 seed = uint256(uint160(k1[i]) ^ uint160(k2[i]) ^ uint160(k3[i])) + block.timestamp;
                mapping_3d[k1[i]][k2[i]][k3[i]] = _randomUint(seed);
            }
        }

        // 1D Struct
        {
            address[3] memory keys =
                [Struct_1_read_keys_address_1, Struct_1_read_keys_address_2, Struct_1_read_keys_address_3];
            for (uint256 i = 0; i < 3; i++) {
                uint256 seed = uint256(uint160(keys[i])) + block.timestamp;
                mapping_1d_struct_1[keys[i]] = _randomStruct1(seed);
            }
        }

        // 2D Struct
        {
            address[3] memory k1 =
                [Struct_2_read_keys_address_1, Struct_2_read_keys_address_2, Struct_2_read_keys_address_3];
            address[3] memory k2 = [
                Struct_2_stage_2_read_keys_address_1,
                Struct_2_stage_2_read_keys_address_2,
                Struct_2_stage_2_read_keys_address_3
            ];
            for (uint256 i = 0; i < 3; i++) {
                uint256 seed = uint256(uint160(k1[i]) ^ uint160(k2[i])) + block.timestamp;
                mapping_2d_struct_1[k1[i]][k2[i]] = _randomStruct1(seed);
            }
        }

        // 3D Struct
        {
            address[3] memory k1 =
                [Struct_3_read_keys_address_1, Struct_3_read_keys_address_2, Struct_3_read_keys_address_3];
            address[3] memory k2 = [
                Struct_3_stage_2_read_keys_address_1,
                Struct_3_stage_2_read_keys_address_2,
                Struct_3_stage_2_read_keys_address_3
            ];
            address[3] memory k3 = [
                Struct_3_stage_3_read_keys_address_1,
                Struct_3_stage_3_read_keys_address_2,
                Struct_3_stage_3_read_keys_address_3
            ];
            for (uint256 i = 0; i < 3; i++) {
                uint256 seed = uint256(uint160(k1[i]) ^ uint160(k2[i]) ^ uint160(k3[i])) + block.timestamp;
                mapping_3d_struct_1[k1[i]][k2[i]][k3[i]] = _randomStruct1(seed);
            }
        }
    }

    function write_two() public {
        write_one();

        // 1D Address
        {
            address[3] memory keys = [D1_read_keys_address_1, D1_read_keys_address_2, D1_read_keys_address_3];
            for (uint256 i = 0; i < 3; i++) {
                uint256 seed = uint256(uint160(keys[i])) + block.timestamp;
                mapping_1d_address[keys[i]] = _randomAddress(seed);
            }
        }

        // 2D Address
        {
            address[3] memory k1 =
                [D2_stage_1_read_keys_address_1, D2_stage_1_read_keys_address_2, D2_stage_1_read_keys_address_3];
            address[3] memory k2 =
                [D2_stage_2_read_keys_address_1, D2_stage_2_read_keys_address_2, D2_stage_2_read_keys_address_3];
            for (uint256 i = 0; i < 3; i++) {
                uint256 seed = uint256(uint160(k1[i]) ^ uint160(k2[i])) + block.timestamp;
                mapping_2d_address[k1[i]][k2[i]] = _randomAddress(seed);
            }
        }

        // 3D Address
        {
            address[3] memory k1 =
                [D3_stage_1_read_keys_address_1, D3_stage_1_read_keys_address_2, D3_stage_1_read_keys_address_3];
            address[3] memory k2 =
                [D3_stage_2_read_keys_address_1, D3_stage_2_read_keys_address_2, D3_stage_2_read_keys_address_3];
            address[3] memory k3 =
                [D3_stage_3_read_keys_address_1, D3_stage_3_read_keys_address_2, D3_stage_3_read_keys_address_3];
            for (uint256 i = 0; i < 3; i++) {
                uint256 seed = uint256(uint160(k1[i]) ^ uint160(k2[i]) ^ uint160(k3[i])) + block.timestamp;
                mapping_3d_address[k1[i]][k2[i]][k3[i]] = _randomAddress(seed);
            }
        }

        // 1D Struct 2
        {
            address[3] memory keys =
                [Struct_1_read_keys_address_1, Struct_1_read_keys_address_2, Struct_1_read_keys_address_3];
            for (uint256 i = 0; i < 3; i++) {
                uint256 seed = uint256(uint160(keys[i])) + block.timestamp;
                mapping_1d_struct_2[keys[i]] = _randomStruct2(seed);
            }
        }

        // 2D Struct 2
        {
            address[3] memory k1 =
                [Struct_2_read_keys_address_1, Struct_2_read_keys_address_2, Struct_2_read_keys_address_3];
            address[3] memory k2 = [
                Struct_2_stage_2_read_keys_address_1,
                Struct_2_stage_2_read_keys_address_2,
                Struct_2_stage_2_read_keys_address_3
            ];
            for (uint256 i = 0; i < 3; i++) {
                uint256 seed = uint256(uint160(k1[i]) ^ uint160(k2[i])) + block.timestamp;
                mapping_2d_struct_2[k1[i]][k2[i]] = _randomStruct2(seed);
            }
        }

        // 3D Struct 2
        {
            address[3] memory k1 =
                [Struct_3_read_keys_address_1, Struct_3_read_keys_address_2, Struct_3_read_keys_address_3];
            address[3] memory k2 = [
                Struct_3_stage_2_read_keys_address_1,
                Struct_3_stage_2_read_keys_address_2,
                Struct_3_stage_2_read_keys_address_3
            ];
            address[3] memory k3 = [
                Struct_3_stage_3_read_keys_address_1,
                Struct_3_stage_3_read_keys_address_2,
                Struct_3_stage_3_read_keys_address_3
            ];
            for (uint256 i = 0; i < 3; i++) {
                uint256 seed = uint256(uint160(k1[i]) ^ uint160(k2[i]) ^ uint160(k3[i])) + block.timestamp;
                mapping_3d_struct_2[k1[i]][k2[i]][k3[i]] = _randomStruct2(seed);
            }
        }
    }

    function write_three() public {
        write_two();

        // 1D Bytes
        {
            address[3] memory keys = [D1_read_keys_address_1, D1_read_keys_address_2, D1_read_keys_address_3];
            for (uint256 i = 0; i < 3; i++) {
                uint256 seed = uint256(uint160(keys[i])) + block.timestamp;
                mapping_1d_bytes32[keys[i]] = _randomBytes32(seed);
            }
        }

        // 2D Bytes
        {
            address[3] memory k1 =
                [D2_stage_1_read_keys_address_1, D2_stage_1_read_keys_address_2, D2_stage_1_read_keys_address_3];
            address[3] memory k2 =
                [D2_stage_2_read_keys_address_1, D2_stage_2_read_keys_address_2, D2_stage_2_read_keys_address_3];
            for (uint256 i = 0; i < 3; i++) {
                uint256 seed = uint256(uint160(k1[i]) ^ uint160(k2[i])) + block.timestamp;
                mapping_2d_bytes32[k1[i]][k2[i]] = _randomBytes32(seed);
            }
        }

        // 3D Bytes
        {
            address[3] memory k1 =
                [D3_stage_1_read_keys_address_1, D3_stage_1_read_keys_address_2, D3_stage_1_read_keys_address_3];
            address[3] memory k2 =
                [D3_stage_2_read_keys_address_1, D3_stage_2_read_keys_address_2, D3_stage_2_read_keys_address_3];
            address[3] memory k3 =
                [D3_stage_3_read_keys_address_1, D3_stage_3_read_keys_address_2, D3_stage_3_read_keys_address_3];
            for (uint256 i = 0; i < 3; i++) {
                uint256 seed = uint256(uint160(k1[i]) ^ uint160(k2[i]) ^ uint160(k3[i])) + block.timestamp;
                mapping_3d_bytes32[k1[i]][k2[i]][k3[i]] = _randomBytes32(seed);
            }
        }

        // 1D Struct 3
        {
            address[3] memory keys =
                [Struct_1_read_keys_address_1, Struct_1_read_keys_address_2, Struct_1_read_keys_address_3];
            for (uint256 i = 0; i < 3; i++) {
                uint256 seed = uint256(uint160(keys[i])) + block.timestamp;
                mapping_1d_struct_3[keys[i]] = _randomStruct3(seed);
            }
        }

        // 2D Struct 3
        {
            address[3] memory k1 =
                [Struct_2_read_keys_address_1, Struct_2_read_keys_address_2, Struct_2_read_keys_address_3];
            address[3] memory k2 = [
                Struct_2_stage_2_read_keys_address_1,
                Struct_2_stage_2_read_keys_address_2,
                Struct_2_stage_2_read_keys_address_3
            ];
            for (uint256 i = 0; i < 3; i++) {
                uint256 seed = uint256(uint160(k1[i]) ^ uint160(k2[i])) + block.timestamp;
                mapping_2d_struct_3[k1[i]][k2[i]] = _randomStruct3(seed);
            }
        }

        // 3D Struct 3
        {
            address[3] memory k1 =
                [Struct_3_read_keys_address_1, Struct_3_read_keys_address_2, Struct_3_read_keys_address_3];
            address[3] memory k2 = [
                Struct_3_stage_2_read_keys_address_1,
                Struct_3_stage_2_read_keys_address_2,
                Struct_3_stage_2_read_keys_address_3
            ];
            address[3] memory k3 = [
                Struct_3_stage_3_read_keys_address_1,
                Struct_3_stage_3_read_keys_address_2,
                Struct_3_stage_3_read_keys_address_3
            ];
            for (uint256 i = 0; i < 3; i++) {
                uint256 seed = uint256(uint160(k1[i]) ^ uint160(k2[i]) ^ uint160(k3[i])) + block.timestamp;
                mapping_3d_struct_3[k1[i]][k2[i]][k3[i]] = _randomStruct3(seed);
            }
        }
    }
}
