// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "@tableland/evm/contracts/utils/TablelandDeployments.sol";
import "@tableland/evm/contracts/utils/SQLHelpers.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title DB_NFT.
 * @author Nick Lionis (github handle: nijoe1)
 * @notice Use this contract for creating Decentralized datassets with others and sell them as NFTs
 * All the data inside the tables are pointing on an IPFS CID.
 */

contract groupTablelandStorage is Ownable {
    ITablelandTables private tablelandContract;

    string[] private createStatements;
    string[] public tables;
    uint256[] private tableIDs;

    string private baseURIString;

    string private constant MAIN_TABLE_PREFIX = "main_table";
    string private constant MAIN_SCHEMA =
        "tokenID text, name text, description text, blockTimestamp text";

    string private constant ATTRIBUTE_TABLE_PREFIX = "attribute_table";
    string private constant ATTRIBUTE_SCHEMA = "tokenID text, trait_type text, value text";

    string private constant SUBMISSION_TABLE_PREFIX = "contribution_table";
    string private constant SUBMISSION_SCHEMA =
        "tokenID text, dataCID text, blockTimestamp text, creator text";

    constructor() {
        tablelandContract = TablelandDeployments.get();

        createStatements.push(
            SQLHelpers.toCreateFromSchema(SUBMISSION_SCHEMA, SUBMISSION_TABLE_PREFIX)
        );
        createStatements.push(SQLHelpers.toCreateFromSchema(MAIN_SCHEMA, MAIN_TABLE_PREFIX));
        createStatements.push(
            SQLHelpers.toCreateFromSchema(ATTRIBUTE_SCHEMA, ATTRIBUTE_TABLE_PREFIX)
        );

        tableIDs = tablelandContract.create(address(this), createStatements);

        tables.push(SQLHelpers.toNameFromId(SUBMISSION_TABLE_PREFIX, tableIDs[0]));
        tables.push(SQLHelpers.toNameFromId(MAIN_TABLE_PREFIX, tableIDs[1]));
        tables.push(SQLHelpers.toNameFromId(ATTRIBUTE_TABLE_PREFIX, tableIDs[2]));
    }

    /*
     * @dev Internal function to perform an update on the main table.
     * @param {stringp[]} set: Array of SET statements for the update.
     * @param {string} filter:Filter condition for the update.
     */
    function toUpdate(string[] memory set, string memory filter) public onlyOwner {
        mutate(tableIDs[1], SQLHelpers.toUpdate(MAIN_TABLE_PREFIX, tableIDs[1], set[0], filter));
        mutate(tableIDs[1], SQLHelpers.toUpdate(MAIN_TABLE_PREFIX, tableIDs[1], set[1], filter));
    }

    /*
     * @dev Inserts a new record into the main table.
     * @param {uint256} tokenid - Token ID.
     * @param {string} dataFormatCID - Data format CID.
     * @param {string} dbName - Database name.
     * @param {string} description - Description.
     * @param {string} dbCID - Database CID.
     * @param {uint256} minRows - Minimum number of rows.
     * @param {uint256} requiredRows - Required number of rows.
     * @param {string} label - Label.
     */

    function insertMainStatement(
        uint256 tokenid,
        string memory name,
        string memory description
    ) public onlyOwner {
        mutate(
            tableIDs[1],
            SQLHelpers.toInsert(
                MAIN_TABLE_PREFIX,
                tableIDs[1],
                "tokenID, name, description, blockTimestamp",
                string.concat(
                    SQLHelpers.quote(Strings.toString(tokenid)),
                    ",",
                    SQLHelpers.quote(name),
                    ",",
                    SQLHelpers.quote(description),
                    ",",
                    SQLHelpers.quote(Strings.toString(block.timestamp))
                )
            )
        );
    }

    /*
     * @dev Internal function to execute a mutation on a table.
     * @param {uint256} tableId - Table ID.
     * @param {string} statement - Mutation statement.
     */
    function mutate(uint256 tableId, string memory statement) internal {
        tablelandContract.mutate(address(this), tableId, statement);
    }

    /*
     * @dev Inserts a new record into the submission table.
     * @param {uint256} tokenid - Token ID.
     * @param {string} dataCID - Data CID.
     * @param {uint256} rows - Number of rows.
     * @param {address} creator - Creator address.
     */

    function insertSubmissionStatement(
        uint256 tokenid,
        string memory dataCID,
        address creator
    ) public onlyOwner {
        mutate(
            tableIDs[0],
            SQLHelpers.toInsert(
                SUBMISSION_TABLE_PREFIX,
                tableIDs[0],
                "tokenID, dataCID, blockTimestamp, creator",
                string.concat(
                    SQLHelpers.quote(Strings.toString(tokenid)),
                    ",",
                    SQLHelpers.quote(dataCID),
                    ",",
                    SQLHelpers.quote(Strings.toString(block.timestamp)),
                    ",",
                    SQLHelpers.quote(Strings.toHexString(creator))
                )
            )
        );
    }

    /*
     * @dev Inserts a new record into the attribute table.
     * @param {uint256} tokenid - Token ID.
     * @param {string} trait_type - Trait type.
     * @param {string} value - Value.
     */

    function insertAttributeStatement(
        uint256 tokenid,
        string memory trait_type,
        string memory value
    ) public onlyOwner {
        mutate(
            tableIDs[2],
            SQLHelpers.toInsert(
                ATTRIBUTE_TABLE_PREFIX,
                tableIDs[2],
                "tokenID, trait_type, value",
                string.concat(
                    SQLHelpers.quote((Strings.toString(tokenid))),
                    ",",
                    SQLHelpers.quote(trait_type),
                    ",",
                    SQLHelpers.quote(value)
                )
            )
        );
    }

    function removeMember(uint256 folderID, address member) public onlyOwner {
        string memory filter = string.concat(
            "tokenID=",
            SQLHelpers.quote(Strings.toString(folderID)),
            " and ",
            "trait_type=",
            SQLHelpers.quote("member"),
            " and ",
            "value=",
            SQLHelpers.quote(Strings.toHexString(member))
        );
        mutate(tableIDs[1], SQLHelpers.toDelete(ATTRIBUTE_TABLE_PREFIX, tableIDs[2], filter));
    }

    /*
     * @dev Sets the tableland gateway prefix for tableland updates.
     * @param {string} baseURI - The new baseURI.
     */
    function setTableURI(string memory baseURI) public onlyOwner {
        baseURIString = baseURI;
    }

    function bytesToString(bytes memory data) public pure returns (string memory) {
        // Fixed buffer size for hexadecimal convertion
        bytes memory converted = new bytes(data.length * 2);

        bytes memory _base = "0123456789abcdef";

        for (uint256 i = 0; i < data.length; i++) {
            converted[i * 2] = _base[uint8(data[i]) / _base.length];
            converted[i * 2 + 1] = _base[uint8(data[i]) % _base.length];
        }

        return string(abi.encodePacked("0x", converted));
    }
}
