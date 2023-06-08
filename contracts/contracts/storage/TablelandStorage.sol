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

contract TablelandStorage is Ownable {

    ITablelandTables private tablelandContract;

    string[] private createStatements;
    string[] public tables;
    uint256[] private tableIDs;

    string private baseURIString;

    string private constant MAIN_TABLE_PREFIX = "main_table";
    string private constant MAIN_SCHEMA =
        "tokenID text, dataFormatCID text, dbName text, description text, dbCID text, minRows text, requiredRows text, piece_cid text, blockTimestamp text";

    string private constant ATTRIBUTE_TABLE_PREFIX = "attribute_table";
    string private constant ATTRIBUTE_SCHEMA = "tokenID text, trait_type text, value text";

    string private constant SUBMISSION_TABLE_PREFIX = "contribution_table";
    string private constant SUBMISSION_SCHEMA =
        "tokenID text, dataCID text, rows text, blockTimestamp text, creator text";

    constructor(string memory _baseURIString) {
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


        baseURIString = _baseURIString;
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
     * @param {string} piece_cid - piece_cid.
     */

    function insertMainStatement(
        uint256 tokenid,
        string memory dataFormatCID,
        string memory dbName,
        string memory description,
        string memory dbCID,
        uint256 minRows,
        uint256 requiredRows,
        string memory piece_cid
    ) public onlyOwner {
        mutate(
            tableIDs[1],
            SQLHelpers.toInsert(
                MAIN_TABLE_PREFIX,
                tableIDs[1],
                "tokenID, dataFormatCID, dbName, description, dbCID, minRows, requiredRows, piece_cid, blockTimestamp",
                string.concat(
                    SQLHelpers.quote(Strings.toString(tokenid)),
                    ",",
                    SQLHelpers.quote(dataFormatCID),
                    ",",
                    SQLHelpers.quote(dbName),
                    ",",
                    SQLHelpers.quote(description),
                    ",",
                    SQLHelpers.quote(dbCID),
                    ",",
                    SQLHelpers.quote(Strings.toString(minRows)),
                    ",",
                    SQLHelpers.quote(Strings.toString(requiredRows)),
                    ",",
                    SQLHelpers.quote(piece_cid),
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
        uint256 rows,
        address creator
    ) public onlyOwner {
        mutate(
            tableIDs[0],
            SQLHelpers.toInsert(
                SUBMISSION_TABLE_PREFIX,
                tableIDs[0],
                "tokenID, dataCID, rows, blockTimestamp, creator",
                string.concat(
                    SQLHelpers.quote(Strings.toString(tokenid)),
                    ",",
                    SQLHelpers.quote(dataCID),
                    ",",
                    SQLHelpers.quote(Strings.toString(rows)),
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

    /// @notice Overriten URI function of the ERC1155 to fit Tableland based NFTs
    /// @dev retrieves the value of the tokenID
    /// @return the tokenURI link for the specific NFT metadata
    function uri(uint256 tokenId) public view returns (string memory) {
        return
            string(
                abi.encodePacked(
                    baseURIString,
                    "SELECT%20",
                    "json_object%28%27tokenID%27%2C",
                    tables[1],
                    "%2EtokenID%2C%27dbName%27%2CdbName%2C%27dbCID%27%2CdbCID%2C%27description%27%2Cdescription%2C%27dataFormatCID%27%2CdataFormatCID%2C%27attributes%27%2Cjson_group_array%28json_object%28%27trait_type%27%2Ctrait_type%2C%27value%27%2Cvalue%29%29%29%20",
                    "FROM%20",
                    tables[1],
                    "%20JOIN%20",
                    tables[2],
                    "%20WHERE%20",
                    tables[1],
                    "%2EtokenID%20%3D%20",
                    tables[2],
                    "%2EtokenID%20and%20",
                    tables[1],
                    "%2EtokenID%3D",
                    Strings.toString(tokenId),
                    "&mode=list"
                )
            );
    }

    /*
     * @dev Sets the tableland gateway prefix for tableland updates.
     * @param {string} baseURI - The new baseURI.
     */
    function setTableURI(string memory baseURI) public onlyOwner {
        baseURIString = baseURI;
    }

    /*
     * @dev Returns the address that signed a given string message.
     * @param {string} message - The message that was signed.
     * @param {uint8} v - Recovery byte of the signature.
     * @param {bytes32} r - R component of the signature.
     * @param {bytes32} s - S component of the signature.
     * @param {address} pkp - Public key of the signer.
     * @return {bool} res - True if the signature is valid, false otherwise.
     */
    function verifyString(
        string memory message,
        uint8 v,
        bytes32 r,
        bytes32 s,
        address pkp
    ) public pure returns (bool res) {
        // The message header; we will fill in the length next
        string memory header = "\x19Ethereum Signed Message:\n000000";
        uint256 lengthOffset;
        uint256 length;
        assembly {
            // The first word of a string is its length
            length := mload(message)
            // The beginning of the base-10 m essage length in the prefix
            lengthOffset := add(header, 57)
        }
        // Maximum length we support
        require(length <= 999999);
        // The length of the message's length in base-10
        uint256 lengthLength = 0;
        // The divisor to get the next left-most message length digit
        uint256 divisor = 100000;
        // Move one digit of the message length to the right at a time
        while (divisor != 0) {
            // The place value at the divisor
            uint256 digit = length / divisor;
            if (digit == 0) {
                // Skip leading zeros
                if (lengthLength == 0) {
                    divisor /= 10;
                    continue;
                }
            }
            // Found a non-zero digit or non-leading zero digit
            lengthLength++;
            // Remove this digit from the message length's current value
            length -= digit * divisor;
            // Shift our base-10 divisor over
            divisor /= 10;
            // Convert the digit to its ASCII representation (man ascii)
            digit += 0x30;
            // Move to the next character and write the digit
            lengthOffset++;
            assembly {
                mstore8(lengthOffset, digit)
            }
        }
        // The null string requires exactly 1 zero (unskip 1 leading 0)
        if (lengthLength == 0) {
            lengthLength = 1 + 0x19 + 1;
        } else {
            lengthLength += 1 + 0x19;
        }
        // Truncate the tailing zeros from the header
        assembly {
            mstore(header, lengthLength)
        }
        // Perform the elliptic curve recover operation
        bytes32 check = keccak256(abi.encodePacked(header, message));
        return ecrecover(check, v, r, s) == pkp;
    }

    function verify(
        string memory message,
        bytes memory signature,
        address _signer
    ) public pure returns (bool) {
        // bytes32 messageHash = getMessageHash(_message);
        // bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);

        return recoverSigner(keccak256(
                abi.encodePacked("\x19Ethereum Signed Message:\n32", message)
            ), signature) == _signer;
    }

    function recoverSigner(
        bytes32 _ethSignedMessageHash,
        bytes memory _signature
    ) public pure returns (address) {
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(_signature);

        return ecrecover(_ethSignedMessageHash, v, r, s);
    }

    function splitSignature(
        bytes memory sig
    ) public pure returns (bytes32 r, bytes32 s, uint8 v) {
        require(sig.length == 65, "invalid signature length");

        assembly {
            /*
            First 32 bytes stores the length of the signature

            add(sig, 32) = pointer of sig + 32
            effectively, skips first 32 bytes of signature

            mload(p) loads next 32 bytes starting at the memory address p into memory
            */

            // first 32 bytes, after the length prefix
            r := mload(add(sig, 32))
            // second 32 bytes
            s := mload(add(sig, 64))
            // final byte (first byte of the next 32 bytes)
            v := byte(0, mload(add(sig, 96)))
        }

        // implicitly return (r, s, v)
    }

    function sendViaCall(address payable _to) public payable {
        // Call returns a boolean value indicating success or failure.
        // This is the current recommended method to use.
        (bool sent, bytes memory data) = _to.call{value: msg.value}("");
        require(sent, "Failed to send Ether");
    }
}
