// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;

import {Multisig} from "./Multisig.sol";
import "@tableland/evm/contracts/utils/SQLHelpers.sol";
import "@tableland/evm/contracts/utils/TablelandDeployments.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract multisigFactory {
    using EnumerableSet for EnumerableSet.AddressSet;
    ITablelandTables private tablelandContract;

    string[] private createStatements;
    string[] public tables;
    uint256[] private tableIDs;
    address[] owners;
    uint256 numConfirmationsRequired;
    string name;
    string description;
    EnumerableSet.AddressSet multisigs;

    string private constant MULTISIG_TABLE_PREFIX = "multisig";
    // string private constant COMPUTATION_SCHEMA = "wasmCID text, inputCID text, startCMD text, CMD text, JobId text, creator text, bacalhauJobID text, result text";
    string private constant MULTISIG_SCHEMA =
        "multisigAddress text, name text, description text, numberOfConfirmations text, proposalTable text, confirmationTable text";

    string private constant MULTISIG_OWNERS_TABLE_PREFIX = "multisig_member";
    // string private constant COMPUTATION_SCHEMA = "wasmCID text, inputCID text, startCMD text, CMD text, JobId text, creator text, bacalhauJobID text, result text";
    string private constant MULTISIG_OWNERS_SCHEMA = "multisigAddress text, ownerAddress text";

    constructor() {
        tablelandContract = TablelandDeployments.get();
        createStatements.push(
            SQLHelpers.toCreateFromSchema(MULTISIG_SCHEMA, MULTISIG_TABLE_PREFIX)
        );
        createStatements.push(
            SQLHelpers.toCreateFromSchema(MULTISIG_OWNERS_SCHEMA, MULTISIG_OWNERS_TABLE_PREFIX)
        );

        tableIDs = tablelandContract.create(address(this), createStatements);
        tables.push(SQLHelpers.toNameFromId(MULTISIG_TABLE_PREFIX, tableIDs[0]));
        tables.push(SQLHelpers.toNameFromId(MULTISIG_OWNERS_TABLE_PREFIX, tableIDs[1]));
    }

    function createWallet(bytes calldata _data, bytes32 _salt) external {
        address factoryAddress;
        (name, description, owners, factoryAddress, numConfirmationsRequired) = abi.decode(
            _data,
            (string, string, address[], address, uint256)
        );
        require(factoryAddress == address(this));
        // Create2 opcode
        Multisig multisigWallet = (new Multisig){salt: _salt}(_data);

        string memory _proposalTable = multisigWallet.tables(0);
        string memory _confirmationTable = multisigWallet.tables(1);
        multisigs.add(address(multisigWallet));
        addMultisig(
            name,
            description,
            address(multisigWallet),
            owners,
            numConfirmationsRequired,
            _proposalTable,
            _confirmationTable
        );
    }

    function getMultisigInitBytes(
        string memory _name,
        string memory _description,
        address[] memory _owners,
        address _factory,
        uint256 _number
    ) public pure returns (bytes memory) {
        return abi.encode(_name, _description, _owners, _factory, _number);
    }

    function addMultisig(
        string memory _name,
        string memory _description,
        address _multisigAddress,
        address[] memory _owners,
        uint256 _numConfirmationsRequired,
        string memory _proposalTable,
        string memory _confirmationTable
    ) internal {
        for (uint256 i = 0; i < _owners.length; i++) {
            insertMember(_multisigAddress, _owners[i]);
        }
        mutate(
            tableIDs[0],
            SQLHelpers.toInsert(
                MULTISIG_TABLE_PREFIX,
                tableIDs[0],
                "multisigAddress, name, description, numberOfConfirmations, proposalTable, confirmationTable",
                string.concat(
                    SQLHelpers.quote(Strings.toHexString(_multisigAddress)),
                    ",",
                    SQLHelpers.quote(_name),
                    ",",
                    SQLHelpers.quote(_description),
                    ",",
                    SQLHelpers.quote(Strings.toString(_numConfirmationsRequired)),
                    ",",
                    SQLHelpers.quote(_proposalTable),
                    ",",
                    SQLHelpers.quote(_confirmationTable)
                )
            )
        );
    }

    function getMultisigAddress(uint256 index) public view returns (address) {
        return multisigs.at(index);
    }

    function insertMember(address multisigAddress, address _owner) internal {
        mutate(
            tableIDs[1],
            SQLHelpers.toInsert(
                MULTISIG_OWNERS_TABLE_PREFIX,
                tableIDs[1],
                "multisigAddress, ownerAddress",
                string.concat(
                    SQLHelpers.quote(Strings.toHexString(multisigAddress)),
                    ",",
                    SQLHelpers.quote(Strings.toHexString(_owner))
                )
            )
        );
    }

    function addMember(address _member, uint256 _numConfirmationsRequired) public {
        require(multisigs.contains(msg.sender));
        insertMember(msg.sender, _member);
        updateNumberOfConfirmations(_numConfirmationsRequired);
    }

    function removeMember(address _member, uint256 _numConfirmationsRequired) public {
        require(multisigs.contains(msg.sender));
        string memory filter = string.concat(
            "multisigAddress=",
            SQLHelpers.quote(Strings.toHexString(msg.sender)),
            " and ",
            "ownerAddress=",
            SQLHelpers.quote(Strings.toHexString(_member))
        );
        mutate(tableIDs[1], SQLHelpers.toDelete(MULTISIG_OWNERS_TABLE_PREFIX, tableIDs[1], filter));
        updateNumberOfConfirmations(_numConfirmationsRequired);
    }

    function updateNumberOfConfirmations(uint256 numberOfConfirmations) internal {
        string memory set = string.concat(
            "numberOfConfirmations='",
            Strings.toString(numberOfConfirmations),
            "'"
        );
        string memory filter = string.concat(
            "multisigAddress=",
            SQLHelpers.quote(Strings.toHexString(msg.sender))
        );
        mutate(tableIDs[0], SQLHelpers.toUpdate(MULTISIG_TABLE_PREFIX, tableIDs[0], set, filter));
    }

    function mutate(uint256 tableId, string memory statement) internal {
        tablelandContract.mutate(address(this), tableId, statement);
    }
}
