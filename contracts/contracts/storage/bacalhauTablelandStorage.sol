// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@tableland/evm/contracts/utils/SQLHelpers.sol";
import "@tableland/evm/contracts/utils/TablelandDeployments.sol";

/** @title DB_NFT. */
/// @author Nick Lionis (github handle : nijoe1 )
/// @notice Use this contract for creating Decentralized datassets with others and sell them as NFTs
/// All the data inside the tables are pointing on an IPFS CID.
contract bacalhauTablelandStorage is Ownable {

    ITablelandTables private tablelandContract;

    string[] private createStatements;
    string[] public tables;
    uint256[] private tableIDs;

    uint256 computationTableID;
    string public computationTableName;
    string private constant COMPUTATION_TABLE_PREFIX = "computation";
    string private constant COMPUTATION_SCHEMA =
        "specStart text, input text, specEnd text, bridgeJobId text, jobId text, result text, creator text";


    constructor() {
        tablelandContract = TablelandDeployments.get();

        createStatements.push(
            SQLHelpers.toCreateFromSchema(COMPUTATION_SCHEMA, COMPUTATION_TABLE_PREFIX)
        );

        tableIDs = tablelandContract.create(address(this), createStatements);

        tables.push(SQLHelpers.toNameFromId(COMPUTATION_TABLE_PREFIX, tableIDs[0]));

        setTableInfo(tables[0], tableIDs[0]);
    }

    function setTableInfo(
        string memory computationtableName,
        uint256 computationtableID
    ) internal {
        computationTableName = computationtableName;
        computationTableID = computationtableID;
    }

    function updateJobResult(string memory result, uint256 jobID) public onlyOwner {
        string memory set = string.concat("result='", result, "'");
        string memory filter = string.concat("bridgeJobId=", Strings.toString(jobID));
        mutate(
            computationTableID,
            SQLHelpers.toUpdate(COMPUTATION_TABLE_PREFIX, computationTableID, set, filter)
        );
    }

    function computationInsertion(
        string memory specStart,
        string memory input,
        string memory specEnd,
        uint256 bridgeJobId,
        string memory jobId,
        address creator
    ) public onlyOwner {
        mutate(
            computationTableID,
            SQLHelpers.toInsert(
                COMPUTATION_TABLE_PREFIX,
                computationTableID,
                "specStart, input, specEnd, bridgeJobId, jobId, result, creator",
                string.concat(
                    SQLHelpers.quote(specStart),
                    ",",
                    SQLHelpers.quote(input),
                    ",",
                    SQLHelpers.quote(specEnd),
                    ",",
                    SQLHelpers.quote(Strings.toString(bridgeJobId)),
                    ",",
                    SQLHelpers.quote(jobId),
                    ",",
                    SQLHelpers.quote("pending"),
                    ",",
                    SQLHelpers.quote(Strings.toHexString(creator))
                )
            )
        );
    }

    function mutate(uint256 tableId, string memory statement) internal {
        tablelandContract.mutate(address(this), tableId, statement);
    }
}
