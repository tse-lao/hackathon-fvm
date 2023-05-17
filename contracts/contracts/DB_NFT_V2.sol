// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "@tableland/evm/contracts/utils/TablelandDeployments.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@tableland/evm/contracts/utils/SQLHelpers.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./interfaces/ITablelandView.sol";

/** @title DB_NFT. */
/// @author Nick Lionis (github handle : nijoe1 )
/// @notice Use this contract for creating Decentralized datassets with others and sell them as NFTs
/// All the data inside the tables are pointing on an IPFS CID.

// DB Versioning that will also include timestampt
// To allow to create open non encrypted DBs without requirun=ing contributions ...abi
// A licence field
contract DB_NFT_V2 is ERC1155, Ownable {
    ITablelandTables private tablelandContract;
    ITablelandView private tablelandView;
    using Counters for Counters.Counter;
    using EnumerableSet for EnumerableSet.UintSet;
    using EnumerableSet for EnumerableSet.AddressSet;

    string private value;
    string private sourceChain;
    string private sourceAddress;

    struct tokenInfo {
        address creator;
        address splitterContract;
        uint256 requiredRows;
        uint256 remainingRows;
        uint256 minimumRowsOnSubmission;
        uint256 price;
        bool mintable;
        EnumerableSet.AddressSet allowedAddresses;
    }

    Counters.Counter private tokenID;

    mapping(uint256 => tokenInfo) private tokenInfoMap;

    mapping(uint256 => mapping(address => uint256)) private submissionsNumberByID;

    mapping(string => EnumerableSet.UintSet) private submittedCIDtoTokens;

    string private _baseURIString;

    string private constant MAIN_TABLE_PREFIX = "file_main";
    string private constant MAIN_SCHEMA =
        "tokenID text, dataFormatCID text, dbName text, description text, dbCID text, minimumRowsOnSubmission text, requiredRows text, piece_cid text";

    string private constant ATTRIBUTE_TABLE_PREFIX = "file_attribute";
    string private constant ATTRIBUTE_SCHEMA = "tokenID text, trait_type text, value text";

    string private constant SUBMISSION_TABLE_PREFIX = "data_contribution";
    string private constant SUBMISSION_SCHEMA =
        "tokenID text, dataCID text, rows text, creator text";

    string[] private createStatements;
    string[] public tables;
    uint256[] public tableIDs;
    address public PKP;

    // Gateway = 0xBF62ef1486468a6bd26Dd669C06db43dEd5B849B & gasReceiver = 0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6
    // 0xBF62ef1486468a6bd26Dd669C06db43dEd5B849B,0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6
    constructor(ITablelandView tablelandview) ERC1155("") {
        tablelandView = tablelandview;
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

        tablelandView.setTableInfo(
            tables[0],
            tableIDs[0],
            tables[1],
            tableIDs[1],
            tables[2],
            tableIDs[2]
        );
    }

    function RequestDB(
        string memory dataFormatCID,
        string memory dbName,
        string memory description,
        string[] memory categories,
        uint256 requiredRows,
        uint256 minimumRowsOnSubmission
    ) public {
        // function RequestDB(string memory dataFormatCID , string memory dbName , string memory description , string[] memory categories, uint256 requiredRows, uint256 minimumRowsOnSubmission, address[] allowed) public {
        // REQUIRE MORE THAN 1 ROWS
        require(requiredRows > 0);
        tokenID.increment();
        uint256 tokenId = tokenID.current();
        tokenInfoMap[tokenId].requiredRows = requiredRows;
        tokenInfoMap[tokenId].remainingRows = requiredRows;
        tokenInfoMap[tokenId].minimumRowsOnSubmission = minimumRowsOnSubmission;
        tokenInfoMap[tokenId].creator = msg.sender;
        // for(uint256 i = 0; i < allowed.length; i++){
        //     tokenInfoMap[ID].allowedAddresses.add(allowed[i]);
        // }
        mutate(
            tableIDs[1],
            tablelandView.insertMainStatement(
                tokenId,
                dataFormatCID,
                dbName,
                description,
                "CID will get added after the DB is fullfilled and the DB NFT creation",
                minimumRowsOnSubmission,
                requiredRows,
                "piece_cid"
            )
        );
        mutate(
            tableIDs[2],
            tablelandView.insertAttributeStatement(
                tokenId,
                "creator",
                Strings.toHexString(msg.sender)
            )
        );
        ITablelandTables.Statement[] memory statements = new ITablelandTables.Statement[](
            categories.length
        );

        for (uint256 i = 0; i < categories.length; i++) {
            statements[i].statement = (
                tablelandView.insertAttributeStatement(tokenId, "category", categories[i])
            );
            statements[i].tableId = tableIDs[2];
        }

        // statements[categories.length].statement = tablelandView.insertMainStatement(tokenId,dataFormatCID,dbName,description,"CID will get added after the DB is fullfilled and the DB NFT creation",minimumRowsOnSubmission,requiredRows,"piece_cid");
        // statements[categories.length].tableId = tableIDs[1];

        // statements[categories.length+1].statement = tablelandView.insertAttributeStatement(tokenId ,"creator", Strings.toHexString(msg.sender));
        // statements[categories.length+1].tableId = tableIDs[2];
        mutate(statements);
    }

    function submitData(
        uint256 tokenId,
        string memory dataCID,
        uint256 rows,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public {
        require(_exists(tokenId));
        require(tokenInfoMap[tokenId].requiredRows > 0, "this is an OpenDB you cannot submit");
        string memory signMessage = string.concat(
            Strings.toString(tokenId),
            dataCID,
            Strings.toString(rows)
        );
        require(tablelandView.verifyString(signMessage, v, r, s, PKP));
        // onlyPKP(msg.sender);
        // if(tokenInfoMap[tokenId].allowedAddresses.length > 0){
        //     require(tokenInfoMap[tokenId].allowedAddresses.contains(msg.sender));
        // }
        require(tokenInfoMap[tokenId].minimumRowsOnSubmission <= rows, "sumbit more data");
        require(!submittedCIDtoTokens[dataCID].contains(tokenId), "DB already has that CID");
        submissionsNumberByID[tokenId][msg.sender] =
            submissionsNumberByID[tokenId][msg.sender] +
            rows;
        submittedCIDtoTokens[dataCID].add(tokenId);
        if (tokenInfoMap[tokenId].remainingRows >= rows) {
            tokenInfoMap[tokenId].remainingRows = tokenInfoMap[tokenId].remainingRows - rows;
        } else {
            tokenInfoMap[tokenId].remainingRows = 0;
        }
        mutate(
            tableIDs[0],
            tablelandView.insertSubmissionStatement(tokenId, dataCID, rows, msg.sender)
        );
    }

    // We also need to call this function from the PKP because we need to set a fair royaltiesAddress splitter contract
    function createDB_NFT(
        uint256 tokenId,
        string memory dbCID,
        uint256 mintPrice,
        address royaltiesAddress,
        string memory piece_cid,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public {
        require(_exists(tokenId));

        string memory signMessage = string.concat(
            Strings.toString(tokenId),
            dbCID,
            Strings.toString(mintPrice),
            Strings.toHexString(royaltiesAddress)
        );
        require(tablelandView.verifyString(signMessage, v, r, s, PKP));

        require(
            !tokenInfoMap[tokenId].mintable &&
                tokenInfoMap[tokenId].remainingRows <= 0 &&
                tokenInfoMap[tokenId].creator == msg.sender
        );
        tokenInfoMap[tokenId].mintable = true;
        tokenInfoMap[tokenId].splitterContract = royaltiesAddress;
        tokenInfoMap[tokenId].price = mintPrice;

        ITablelandTables.Statement[] memory statements = new ITablelandTables.Statement[](4);

        statements[0].tableId = tableIDs[1];
        statements[0].statement = tablelandView.toUpdate(
            MAIN_TABLE_PREFIX,
            tableIDs[1],
            string.concat("dbCID='", dbCID, "'"),
            string.concat("tokenID=", Strings.toString(tokenId))
        );

        statements[1].tableId = tableIDs[1];
        statements[1].statement = tablelandView.toUpdate(
            MAIN_TABLE_PREFIX,
            tableIDs[1],
            string.concat("piece_cid='", piece_cid, "'"),
            string.concat("tokenID=", Strings.toString(tokenId))
        );

        statements[2].tableId = tableIDs[2];
        statements[2].statement = tablelandView.insertAttributeStatement(
            tokenId,
            "price",
            Strings.toString(mintPrice)
        );

        statements[3].tableId = tableIDs[2];
        statements[3].statement = tablelandView.insertAttributeStatement(
            tokenId,
            "splitterContract",
            Strings.toHexString(royaltiesAddress)
        );

        mutate(statements);
    }

    function updateDB_NFT(
        uint256 tokenId,
        string memory dbCID,
        string memory piece_cid,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public {
        require(_exists(tokenId));

        string memory signMessage = string.concat(Strings.toString(tokenId), dbCID);
        require(tablelandView.verifyString(signMessage, v, r, s, PKP));
        ITablelandTables.Statement[] memory statements = new ITablelandTables.Statement[](2);

        statements[0].tableId = tableIDs[1];
        statements[0].statement = tablelandView.toUpdate(
            MAIN_TABLE_PREFIX,
            tableIDs[1],
            string.concat("dbCID='", dbCID, "'"),
            string.concat("tokenID=", Strings.toString(tokenId))
        );

        statements[1].tableId = tableIDs[1];
        statements[1].statement = tablelandView.toUpdate(
            MAIN_TABLE_PREFIX,
            tableIDs[1],
            string.concat("piece_cid='", piece_cid, "'"),
            string.concat("tokenID=", Strings.toString(tokenId))
        );
        mutate(statements);
    }

    // We also need to call this function from the PKP because we need to set a fair royaltiesAddress splitter contract
    function createOpenDataSet(
        string memory dbCID,
        string memory piece_cid,
        string memory dataFormatCID,
        string memory dbName,
        string memory description,
        string[] memory categories
    ) public {
        tokenID.increment();
        // uint256 tokenId = tokenID.current();
        mutate(
            tableIDs[1],
            tablelandView.insertMainStatement(
                tokenID.current(),
                dataFormatCID,
                dbName,
                description,
                dbCID,
                0,
                0,
                piece_cid
            )
        );
        mutate(
            tableIDs[2],
            tablelandView.insertAttributeStatement(
                tokenID.current(),
                "creator",
                Strings.toHexString(msg.sender)
            )
        );
        ITablelandTables.Statement[] memory statements = new ITablelandTables.Statement[](
            categories.length
        );

        for (uint256 i = 0; i < categories.length; i++) {
            statements[i].statement = (
                tablelandView.insertAttributeStatement(tokenID.current(), "category", categories[i])
            );
            statements[i].tableId = tableIDs[2];
        }
        mutate(statements);
    }

    // Give access to the submissions of an NFT and the NFT final DB to the contributors and to the Owner
    function hasAccess(address contributor, uint256 tokenId) public view returns (bool) {
        return
            submissionsNumberByID[tokenId][contributor] > 0 ||
            tokenInfoMap[tokenId].creator == contributor ||
            balanceOf(contributor, tokenId) > 0;
    }

    function mint(uint256 tokenid) public payable {
        require(_exists(tokenid) && tokenInfoMap[tokenid].price <= msg.value);
        require(tokenInfoMap[tokenid].mintable);
        require(balanceOf(msg.sender, tokenid) < 1);
        tablelandView.sendViaCall{value: msg.value}(
            payable(tokenInfoMap[tokenid].splitterContract)
        );
        _mint(msg.sender, tokenid, 1, "");
    }

    function onlyPKP(address sender) internal view {
        require(sender == PKP);
    }

    /// @notice Overriten URI function of the ERC1155 to fit Tableland based NFTs
    /// @dev retrieves the value of the tokenID
    /// @return the tokenURI link for the specific NFT metadata
    function uri(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId));
        return tablelandView.uri(tokenId);
    }

    /// @notice returns the total number of minted NFTs
    function totalSupply() public view returns (uint256) {
        return tokenID.current();
    }

    /// @notice withdraw function of the contract funds only by the contract owner
    function withdraw() public payable onlyOwner {
        address payable to = payable(msg.sender);
        to.transfer(address(this).balance);
    }

    function _exists(uint256 tokenId) internal view returns (bool) {
        return tokenId <= tokenID.current();
    }

    function mutate(uint256 tableId, string memory statement) internal {
        tablelandContract.mutate(address(this), tableId, statement);
    }

    function mutate(ITablelandTables.Statement[] memory statements) internal {
        tablelandContract.mutate(address(this), statements);
    }

    function assignNewPKP(address newPKP) public onlyOwner {
        PKP = newPKP;
    }
}
