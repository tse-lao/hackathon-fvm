// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "./interfaces/IMultisig.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@tableland/evm/contracts/utils/SQLHelpers.sol";
import "@tableland/evm/contracts/utils/TablelandDeployments.sol";

// import {Initializable} from "@openzeppelin/contracts/proxy/utils/Initializable.sol";

contract Multisig is IMultisig {
    ITablelandTables private tablelandContract;

    string[] private createStatements;
    string[] public tables;
    uint256[] private tableIDs;
    string public name;
    string public description;

    string private constant PROPOSAL_TABLE_PREFIX = "transaction_proposal";
    // string private constant COMPUTATION_SCHEMA = "wasmCID text, inputCID text, startCMD text, CMD text, JobId text, creator text, bacalhauJobID text, result text";
    string private constant PROPOSAL_SCHEMA =
        "proposalID text, name text, description text, proposer text, executed text";

    string private constant CONFIRMATIONS_TABLE_PREFIX = "confirmation";
    // string private constant COMPUTATION_SCHEMA = "wasmCID text, inputCID text, startCMD text, CMD text, JobId text, creator text, bacalhauJobID text, result text";
    string private constant CONFIRMATIONS_TABLE_SCHEMA =
        "proposalID text, confirmationAddress text";

    address[] public owners;
    address factoryAddress;
    mapping(address => bool) public isOwner;
    uint public numConfirmationsRequired;

    // mapping from tx index => owner => bool
    mapping(uint => mapping(address => bool)) public isConfirmed;

    Transaction[] public transactions;

    constructor(bytes memory _data) {
        (name, description, owners, factoryAddress, numConfirmationsRequired) = abi.decode(
            _data,
            (string, string, address[], address, uint256)
        );

        require(owners.length > 0, "owners required");
        require(
            numConfirmationsRequired > 0 && numConfirmationsRequired <= owners.length,
            "invalid number of required confirmations"
        );
        for (uint i = 0; i < owners.length; i++) {
            require(owners[i] != address(0), "invalid owner");
            require(!isOwner[owners[i]], "owner not unique");
            isOwner[owners[i]] = true;
        }
        // require(owner() == _admin, "Account: not token owner.");
        tablelandContract = TablelandDeployments.get();

        createStatements.push(
            SQLHelpers.toCreateFromSchema(PROPOSAL_SCHEMA, PROPOSAL_TABLE_PREFIX)
        );

        createStatements.push(
            SQLHelpers.toCreateFromSchema(CONFIRMATIONS_TABLE_SCHEMA, CONFIRMATIONS_TABLE_PREFIX)
        );

        tableIDs = tablelandContract.create(address(this), createStatements);

        tables.push(SQLHelpers.toNameFromId(PROPOSAL_TABLE_PREFIX, tableIDs[0]));
        tables.push(SQLHelpers.toNameFromId(CONFIRMATIONS_TABLE_PREFIX, tableIDs[1]));
    }

    function submitTransaction(
        address _to,
        uint _value,
        bytes memory _data,
        string memory proposalName,
        string memory proposalDescription
    ) public onlyOwner {
        uint txIndex = transactions.length;

        transactions.push(
            Transaction({to: _to, value: _value, data: _data, executed: false, numConfirmations: 1})
        );

        insertProposal(txIndex, proposalName, proposalDescription);

        isConfirmed[txIndex][msg.sender] = true;

        insertConfirmation(txIndex);
        // rare case
        if (transactions[txIndex].numConfirmations >= numConfirmationsRequired) {
            executeTransaction(txIndex, transactions[txIndex]);
        }
    }

    function confirmTransaction(
        uint _txIndex
    ) public onlyOwner txExists(_txIndex) notExecuted(_txIndex) notConfirmed(_txIndex) {
        Transaction storage transaction = transactions[_txIndex];
        transaction.numConfirmations += 1;
        isConfirmed[_txIndex][msg.sender] = true;
        insertConfirmation(_txIndex);
        if (transaction.numConfirmations >= numConfirmationsRequired) {
            executeTransaction(_txIndex, transaction);
        }
    }

    function deleteConfirmation(uint256 proposalID) internal {
        string memory filter = string.concat(
            "proposalID=",
            SQLHelpers.quote(Strings.toString(proposalID)),
            " and ",
            "confirmationAddress=",
            SQLHelpers.quote(Strings.toHexString(msg.sender))
        );
        mutate(tableIDs[0], SQLHelpers.toDelete(CONFIRMATIONS_TABLE_PREFIX, tableIDs[0], filter));
    }

    function revokeConfirmation(
        uint _txIndex
    ) public onlyOwner txExists(_txIndex) notExecuted(_txIndex) {
        Transaction storage transaction = transactions[_txIndex];

        require(isConfirmed[_txIndex][msg.sender], "tx not confirmed");

        transaction.numConfirmations -= 1;
        isConfirmed[_txIndex][msg.sender] = false;
        deleteConfirmation(_txIndex);
    }

    function executeTransaction(uint256 _txIndex, Transaction memory transaction) internal {
        _call(transaction.to, transaction.value, transaction.data);
        transaction.executed = true;
        updateExecutionStatus(_txIndex);
    }

    function addMember(address newMember, uint256 _numConfirmationsRequired) external {
        require(msg.sender == address(this));
        bytes memory _data = abi.encodeWithSignature(
            "addMember(address,uint256)",
            newMember,
            _numConfirmationsRequired
        );
        (bool success, bytes memory data) = factoryAddress.call(_data);
        require(success, "failed");
        numConfirmationsRequired = _numConfirmationsRequired;
        isOwner[newMember] = true;
    }

    function removeMember(address member, uint256 _numConfirmationsRequired) external {
        require(msg.sender == address(this));
        bytes memory _data = abi.encodeWithSignature(
            "removeMember(address,uint256)",
            member,
            _numConfirmationsRequired
        );
        (bool success, bytes memory data) = factoryAddress.call(_data);
        require(success, "failed");
        numConfirmationsRequired = _numConfirmationsRequired;
        isOwner[member] = false;
    }

    function isMultisigOwner(address owner) public view returns (bool) {
        return isOwner[owner];
    }

    function getOwners() public view returns (address[] memory) {
        return owners;
    }

    function getTransactionCount() public view returns (uint) {
        return transactions.length;
    }

    function getTransaction(
        uint _txIndex
    )
        public
        view
        returns (address to, uint value, bytes memory data, bool executed, uint numConfirmations)
    {
        Transaction storage transaction = transactions[_txIndex];

        return (
            transaction.to,
            transaction.value,
            transaction.data,
            transaction.executed,
            transaction.numConfirmations
        );
    }

    function _call(address target, uint256 value, bytes memory data) internal {
        (bool success, bytes memory result) = target.call{value: value}(data);
        if (!success) {
            assembly {
                revert(add(result, 32), mload(result))
            }
        }
    }

    modifier onlyOwner() {
        require(isOwner[msg.sender], "not owner");
        _;
    }

    modifier txExists(uint _txIndex) {
        require(_txIndex < transactions.length, "tx does not exist");
        _;
    }

    modifier notExecuted(uint _txIndex) {
        require(!transactions[_txIndex].executed, "tx already executed");
        _;
    }

    modifier notConfirmed(uint _txIndex) {
        require(!isConfirmed[_txIndex][msg.sender], "tx already confirmed");
        _;
    }

    /*
     * @dev Inserts a new record into the attribute table.
     * @param {uint256} tokenid - Token ID.
     * @param {string} trait_type - Trait type.
     * @param {string} value - Value.
     * @param {address} proposer - Value.
     */

    function insertProposal(
        uint256 proposalID,
        string memory _name,
        string memory _description
    ) internal {
        mutate(
            tableIDs[0],
            SQLHelpers.toInsert(
                PROPOSAL_TABLE_PREFIX,
                tableIDs[0],
                "proposalID, name, description, proposer, executed",
                string.concat(
                    SQLHelpers.quote((Strings.toString(proposalID))),
                    ",",
                    SQLHelpers.quote(_name),
                    ",",
                    SQLHelpers.quote(_description),
                    ",",
                    SQLHelpers.quote(Strings.toHexString(msg.sender)),
                    ",",
                    SQLHelpers.quote("false")
                )
            )
        );
    }

    /*
     * @dev Inserts a new record into the attribute table.
     * @param {uint256} proposalID - Token ID.
     */

    function insertConfirmation(uint256 proposalID) internal {
        mutate(
            tableIDs[1],
            SQLHelpers.toInsert(
                CONFIRMATIONS_TABLE_PREFIX,
                tableIDs[1],
                "proposalID, confirmationAddress",
                string.concat(
                    SQLHelpers.quote((Strings.toString(proposalID))),
                    ",",
                    SQLHelpers.quote(Strings.toHexString(msg.sender))
                )
            )
        );
    }

    function updateExecutionStatus(uint256 proposalID) internal {
        string memory set = string.concat("executed='", "true", "'");
        string memory filter = string.concat(
            "proposalID=",
            SQLHelpers.quote(Strings.toString(proposalID))
        );
        mutate(tableIDs[0], SQLHelpers.toUpdate(PROPOSAL_TABLE_PREFIX, tableIDs[0], set, filter));
    }

    function mutate(uint256 tableId, string memory statement) internal {
        tablelandContract.mutate(address(this), tableId, statement);
    }

    receive() external payable {
        emit Deposit(msg.sender, msg.value, address(this).balance);
    }
}
