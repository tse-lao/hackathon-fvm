// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "./tablelandDealClient.sol";

contract tablelandDealClientFactory {
    address adminAddress;
    IDealTablelandStorage tablelandStorage;

    constructor() {
        adminAddress = msg.sender;
    }

    function createDataDAO(address[] memory owners, address multisig, bytes32 randomSalt) external {
        // Create2 opcode
        tablelandDealClient dataDAO = (new tablelandDealClient){salt: randomSalt}(
            tablelandStorage,
            owners
        );
        tablelandStorage.addDAO(address(dataDAO), owners, multisig);
    }

    function setDealTablelandStorage(address _tablelandStorage) public {
        require(msg.sender == adminAddress, "not admin");
        tablelandStorage = IDealTablelandStorage(_tablelandStorage);
    }
}
