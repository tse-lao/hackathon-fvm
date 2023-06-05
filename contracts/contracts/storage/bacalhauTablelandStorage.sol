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

    string private constant COMPUTATION_TABLE_PREFIX = "compute_over_data";
    // string private constant COMPUTATION_SCHEMA = "wasmCID text, inputCID text, startCMD text, CMD text, JobId text, creator text, bacalhauJobID text, result text";
    string private constant COMPUTATION_SCHEMA =
        "jobID text, requestID text, input text, requestor text, bacalhauJobID text, result text";

    string private constant JOB_BOUNTY_TABLE_PREFIX = "job_bounty";
    // string private constant COMPUTATION_SCHEMA = "wasmCID text, inputCID text, startCMD text, CMD text, JobId text, creator text, bacalhauJobID text, result text";
    string private constant JOB_BOUNTY_SCHEMA =
        "bountyID text, name text, description text, dataFormat text, reward text, creator text, winner text";

    string private constant JOB_TABLE_PREFIX = "job";
    // string private constant COMPUTATION_SCHEMA = "wasmCID text, inputCID text, startCMD text, CMD text, JobId text, creator text, bacalhauJobID text, result text";
    string private constant JOB_SCHEMA =
        "jobID text, name text, description text, dataFormat text, startCommand text, endCommand text, numberOfInputs text, creator text, validated text";

    constructor() {
        tablelandContract = TablelandDeployments.get();

        createStatements.push(
            SQLHelpers.toCreateFromSchema(COMPUTATION_SCHEMA, COMPUTATION_TABLE_PREFIX)
        );

        createStatements.push(SQLHelpers.toCreateFromSchema(JOB_SCHEMA, JOB_TABLE_PREFIX));

        createStatements.push(
            SQLHelpers.toCreateFromSchema(JOB_BOUNTY_SCHEMA, JOB_BOUNTY_TABLE_PREFIX)
        );

        tableIDs = tablelandContract.create(address(this), createStatements);

        tables.push(SQLHelpers.toNameFromId(COMPUTATION_TABLE_PREFIX, tableIDs[0]));
        tables.push(SQLHelpers.toNameFromId(JOB_TABLE_PREFIX, tableIDs[1]));
        tables.push(SQLHelpers.toNameFromId(JOB_BOUNTY_TABLE_PREFIX, tableIDs[2]));
    }

    function updateJobResult(string[] memory set, uint256 requestID) public onlyOwner {
        string memory temp = string.concat("bacalhauJobID='", set[0], "'");
        string memory filter = string.concat("requestID=", Strings.toString(requestID));
        mutate(
            tableIDs[0],
            SQLHelpers.toUpdate(COMPUTATION_TABLE_PREFIX, tableIDs[0], temp, filter)
        );

        temp = string.concat("result='", set[1], "'");
        mutate(
            tableIDs[0],
            SQLHelpers.toUpdate(COMPUTATION_TABLE_PREFIX, tableIDs[0], temp, filter)
        );
    }

    function updateJobResult(string memory _set, uint256 requestID) public onlyOwner {
        string memory set  = string.concat("result='", _set, "'");
        string memory filter = string.concat("requestID=", Strings.toString(requestID));

        mutate(
            tableIDs[0],
            SQLHelpers.toUpdate(COMPUTATION_TABLE_PREFIX, tableIDs[0], set, filter)
        );
    }

    function BountyInsertion(
        uint256 bountyID,
        string memory name,
        string memory description,
        string memory dataFormat,
        uint256 reward,
        address creator
    ) public onlyOwner {
        mutate(
            tableIDs[2],
            SQLHelpers.toInsert(
                JOB_BOUNTY_TABLE_PREFIX,
                tableIDs[2],
                "bountyID, name, description, dataFormat, reward, creator, winner",
                string.concat(
                    SQLHelpers.quote(Strings.toString(bountyID)),
                    ",",
                    SQLHelpers.quote(name),
                    ",",
                    SQLHelpers.quote(description),
                    ",",
                    SQLHelpers.quote(dataFormat),
                    ",",
                    SQLHelpers.quote(Strings.toString(reward)),
                    ",",
                    SQLHelpers.quote(Strings.toHexString(creator)),
                    ",",
                    SQLHelpers.quote("undefined")
                )
            )
        );
    }

    function updateBountyWinner(address winner, uint256 bountyID) public onlyOwner {
        string memory set = string.concat("winner='", Strings.toHexString(winner), "'");
        string memory filter = string.concat("bountyID=", Strings.toString(bountyID));
        mutate(tableIDs[2], SQLHelpers.toUpdate(JOB_BOUNTY_TABLE_PREFIX, tableIDs[2], set, filter));
    }

    function computationInsertion(
        uint256 jobID,
        string memory input,
        uint256 requestID,
        address requestor
    ) public onlyOwner {
        mutate(
            tableIDs[0],
            SQLHelpers.toInsert(
                COMPUTATION_TABLE_PREFIX,
                tableIDs[0],
                "jobID, requestID, input, requestor, bacalhauJobID, result",
                string.concat(
                    SQLHelpers.quote(Strings.toString(jobID)),
                    ",",
                    SQLHelpers.quote(Strings.toString(requestID)),
                    ",",
                    SQLHelpers.quote(input),
                    ",",
                    SQLHelpers.quote(Strings.toHexString(requestor)),
                    ",",
                    SQLHelpers.quote("pendingBacalhauJobID"),
                    ",",
                    SQLHelpers.quote("jobSubmitted")
                )
            )
        );
    }

    function jobInsertion(
        uint256 jobID,
        string memory name,
        string memory description,
        string memory dataFormat,
        string memory startCommand,
        string memory endCommand,
        uint256 numberOfInputs,
        address creator
    ) public onlyOwner {
        mutate(
            tableIDs[1],
            SQLHelpers.toInsert(
                JOB_TABLE_PREFIX,
                tableIDs[1],
                "jobID, name, description, dataFormat, startCommand, endCommand, numberOfInputs, creator, validated",
                string.concat(
                    SQLHelpers.quote(Strings.toString(jobID)),
                    ",",
                    SQLHelpers.quote(name),
                    ",",
                    SQLHelpers.quote(description),
                    ",",
                    SQLHelpers.quote(dataFormat),
                    ",",
                    SQLHelpers.quote(startCommand),
                    ",",
                    SQLHelpers.quote(endCommand),
                    ",",
                    SQLHelpers.quote(Strings.toString(numberOfInputs)),
                    ",",
                    SQLHelpers.quote(Strings.toHexString(creator)),
                    ",",
                    SQLHelpers.quote("true")
                )
            )
        );
    }

    function mutate(uint256 tableId, string memory statement) internal {
        tablelandContract.mutate(address(this), tableId, statement);
    }
}
