// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

interface IMultisig {

    struct Transaction {
        address to;
        uint value;
        bytes data;
        bool executed;
        uint numConfirmations;
    }

    event Deposit(address indexed sender, uint amount, uint balance);

    function isMultisigOwner(address owner)external view returns(bool);

}
