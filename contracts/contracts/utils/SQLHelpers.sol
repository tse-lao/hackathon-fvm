// SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.11 <0.9.0;

import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @dev Library of helpers for generating SQL statements from common parameters.
 */
library SQLHelpers {
    string public constant SUBNFT_TABLE_PREFIX = "subNFTs";
    string public constant SUBNFT_SCHEMA = "rootID text, subNFTID text";
    string public constant SUBMISSION_TABLE_PREFIX = "submission";
    string public constant SUBMISSION_SCHEMA = "tokenID text, metadataCID text, rows text, creator text";
    string public constant ATTRIBUTE_TABLE_PREFIX = "attribute";
    string public constant ATTRIBUTE_SCHEMA = "tokenID text, trait_type text, value text";
    string public constant MAIN_TABLE_PREFIX = "main";
    string public constant MAIN_SCHEMA = "tokenID text, dataFormatCID text, DBname text, desc text, metadataCID text";

    /**
     * @dev Generates a properly formatted table name from a prefix and table id.
     *
     * prefix - the user generated table prefix as a string
     * tableId - the Tableland generated tableId as a uint256
     *
     * Requirements:
     *
     * - block.chainid must refer to a supported chain.
     */
    function toNameFromId(string memory prefix, uint256 tableId)
        internal
        view
        returns (string memory)
    {
        return
            string.concat(
                    prefix,
                    "_",
                    Strings.toString(block.chainid),
                    "_",
                    Strings.toString(tableId)
                );
    }

    /**
     * @dev Generates a CREATE statement based on a desired schema and table prefix.
     *
     * schema - a comma seperated string indicating the desired prefix. Example: "int id, text name"
     * prefix - the user generated table prefix as a string
     *
     * Requirements:
     *
     * - block.chainid must refer to a supported chain.
     */
    function toCreateFromSchema(string memory schema, string memory prefix)
        internal
        view
        returns (string memory)
    {
        return
            string.concat(
                    "CREATE TABLE ",
                    prefix,
                    "_",
                    Strings.toString(block.chainid),
                    " (",
                    schema,
                    ");"
                );
    }

    /**
     * @dev Generates an INSERT statement based on table prefix, tableId, columns, and values.
     *
     * prefix - the user generated table prefix as a string.
     * tableId - the Tableland generated tableId as a uint256.
     * columns - a string encoded ordered list of columns that will be updated. Example: "name, age".
     * values - a string encoded ordered list of values that will be inserted wrapped in parentheses. Example: "'jerry', 24". Values order must match column order.
     *
     * Requirements:
     *
     * - block.chainid must refer to a supported chain.
     */
    function toInsert(
        string memory prefix,
        uint256 tableId,
        string memory columns,
        string memory values
    ) internal view returns (string memory) {
        string memory name = toNameFromId(prefix, tableId);
        return
            string.concat(
                    "INSERT INTO ",
                    name,
                    "(",
                    columns,
                    ")VALUES(",
                    values,
                    ")"
                );
    }

    /**
     * @dev Generates an Update statement based on table prefix, tableId, setters, and filters.
     *
     * prefix - the user generated table prefix as a string
     * tableId - the Tableland generated tableId as a uint256
     * setters - a string encoded set of updates. Example: "name='tom', age=26"
     * filters - a string encoded list of filters or "" for no filters. Example: "id<2 and name!='jerry'"
     *
     * Requirements:
     *
     * - block.chainid must refer to a supported chain.
     */
    function toUpdate(
        string memory prefix,
        uint256 tableId,
        string memory setters,
        string memory filters
    ) internal view returns (string memory) {
        string memory name = toNameFromId(prefix, tableId);
        string memory filter = "";
        if (bytes(filters).length > 0) {
            filter = string.concat(" WHERE ", filters);
        }
        return
            string.concat("UPDATE ", name, " SET ", setters, filter);
    }

    /**
     * @dev Generates a Delete statement based on table prefix, tableId, and filters.
     *
     * prefix - the user generated table prefix as a string.
     * tableId - the Tableland generated tableId as a uint256.
     * filters - a string encoded list of filters. Example: "id<2 and name!='jerry'".
     *
     * Requirements:
     *
     * - block.chainid must refer to a supported chain.
     */
    function toDelete(
        string memory prefix,
        uint256 tableId,
        string memory filters
    ) internal view returns (string memory) {
        string memory name = toNameFromId(prefix, tableId);
        return
            string.concat("DELETE FROM ", name, " WHERE ", filters);
    }

    /**
     * @dev Add single quotes around a string value
     *
     * input - any input value.
     *
     */
    function quote(string memory input) internal pure returns (string memory) {
        return string.concat("'", input, "'");
    }

    function insertMainStatement(uint256 mainTableID,uint256 tokenid ,string memory dataFormatCID, string memory DBname,string memory description,string memory metadataCID) internal view returns(string memory){
    return
    toInsert(
            MAIN_TABLE_PREFIX,
            mainTableID,
            "tokenID, dataFormatCID, DBname, desc, metadataCID",
            string.concat(
                quote(Strings.toString(tokenid)),
                ",",
                quote(dataFormatCID),
                ",",
                quote(DBname),
                ",",
                quote(description),
                ",",
                quote(metadataCID)
            )
    );
    }

    function insertSubmisaionStatement(uint256 submissionTableID,uint256 tokenid ,string memory metadataCID, uint256 rows,address creator) internal view returns(string memory){
    return
    toInsert(
            SUBMISSION_TABLE_PREFIX,
            submissionTableID,
            "tokenID, metadataCID text, rows, creator",
            string.concat(
                quote(Strings.toString(tokenid)),
                ",",
                quote(metadataCID),
                ",",
                quote(Strings.toString(rows)),
                ",",
                quote(Strings.toHexString(creator)),
                ",",
                quote(""),
                ",",
                quote("")
            )
    );
    }

    function insertAttributeStatement(uint256 attributeTableID,uint256 tokenid ,string memory trait_type, string memory value) internal view returns(string memory){
        return  toInsert(
                ATTRIBUTE_TABLE_PREFIX,
                attributeTableID,
                "tokenID, trait_type, value",
                string.concat(
                    quote((Strings.toString(tokenid))),
                    ",",
                    quote(trait_type),
                    ",",
                    quote(value)
                )
            );
    }

    function subNFTInsertion(uint256 subNFT_tableID, string memory rootID, string memory subNFTID) internal view returns(string memory){
        return toInsert(
            SUBNFT_TABLE_PREFIX,
            subNFT_tableID,
            "rootID, subNFTID",
            string.concat(
                quote(rootID),
                ",",
                quote(subNFTID)
            )
        );
    }
}