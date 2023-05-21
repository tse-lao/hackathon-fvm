// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./interfaces/ITablelandStorage.sol";

/** @title DB_NFT. */
/// @author Nick Lionis (github handle : nijoe1 )
/// @notice Use this contract for creating Decentralized datassets with others and sell them as NFTs
/// All the data inside the tables are pointing on an IPFS CID.

// DB Versioning that will also include timestampt
// To allow to create open non encrypted DBs without requirun=ing contributions ...abi
// A licence field
contract DB_NFT is ERC1155, Ownable {
    ITablelandStorage private TablelandStorage;
    using Counters for Counters.Counter;
    using EnumerableSet for EnumerableSet.UintSet;
    // using EnumerableSet for EnumerableSet.AddressSet;

    struct tokenInfo {
        address creator;
        address splitterContract;
        uint256 requiredRows;
        uint256 remainingRows;
        uint256 minimumRowsOnSubmission;
        uint256 price;
        bool mintable;
    }

    Counters.Counter private tokenID;

    mapping(uint256 => tokenInfo) private tokenInfoMap;

    mapping(uint256 => mapping(address => uint256)) private submissionsNumberByID;

    mapping(string => EnumerableSet.UintSet) private submittedCIDtoTokens;

    mapping(string => bool) private signedMessages;

    address public SignerAddress;

    constructor(ITablelandStorage tablelandStorage) ERC1155("") {
        TablelandStorage = tablelandStorage;
    }

    function RequestDB(
        string memory dataFormatCID,
        string memory dbName,
        string memory description,
        string[] memory categories,
        uint256 requiredRows,
        uint256 minimumRowsOnSubmission
    ) public {
        require(requiredRows > 0);
        tokenID.increment();
        uint256 tokenId = tokenID.current();
        tokenInfoMap[tokenId].requiredRows = requiredRows;
        tokenInfoMap[tokenId].remainingRows = requiredRows;
        tokenInfoMap[tokenId].minimumRowsOnSubmission = minimumRowsOnSubmission;
        tokenInfoMap[tokenId].creator = msg.sender;

        TablelandStorage.insertMainStatement(
            tokenId,
            dataFormatCID,
            dbName,
            description,
            "CID will get added after the DB is fullfilled and the DB NFT creation",
            minimumRowsOnSubmission,
            requiredRows,
            "label"
        );

        TablelandStorage.insertAttributeStatement(
            tokenId,
            "creator",
            Strings.toHexString(msg.sender)
        );

        for (uint256 i = 0; i < categories.length; i++) {
            TablelandStorage.insertAttributeStatement(tokenId, "category", categories[i]);
        }
    }

    function submitData(
        uint256 tokenId,
        string memory dataCID,
        uint256 rows,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public {
        string memory signedMessage = string.concat(
            Strings.toString(tokenId),
            dataCID,
            Strings.toString(rows)
        );
        require(_exists(tokenId));
        require(tokenInfoMap[tokenId].requiredRows > 0, "this is an OpenDB you cannot submit");
        require(!signedMessages[signedMessage]);
        require(TablelandStorage.verifyString(signedMessage, v, r, s, SignerAddress));
        require(tokenInfoMap[tokenId].minimumRowsOnSubmission <= rows, "sumbit more data");
        require(!submittedCIDtoTokens[dataCID].contains(tokenId), "DB already has that CID");

        signedMessages[signedMessage] = true;
        submissionsNumberByID[tokenId][msg.sender] += rows;
        submittedCIDtoTokens[dataCID].add(tokenId);
        if (tokenInfoMap[tokenId].remainingRows >= rows) {
            tokenInfoMap[tokenId].remainingRows -= rows;
        } else {
            tokenInfoMap[tokenId].remainingRows = 0;
        }

        TablelandStorage.insertSubmissionStatement(tokenId, dataCID, rows, msg.sender);
    }

    // We also need to call this function from the PKP because we need to set a fair royaltiesAddress splitter contract
    function createDB_NFT(
        uint256 tokenId,
        string memory dbCID,
        uint256 mintPrice,
        address royaltiesAddress,
        string memory label,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public {
        require(_exists(tokenId));

        string memory signedMessage = string.concat(
            Strings.toString(tokenId),
            dbCID,
            Strings.toString(mintPrice),
            Strings.toHexString(royaltiesAddress)
        );
        require(!signedMessages[signedMessage]);

        require(TablelandStorage.verifyString(signedMessage, v, r, s, SignerAddress));

        require(
            !tokenInfoMap[tokenId].mintable &&
                tokenInfoMap[tokenId].remainingRows <= 0 &&
                tokenInfoMap[tokenId].creator == msg.sender
        );
        signedMessages[signedMessage] = true;

        tokenInfoMap[tokenId].mintable = true;
        tokenInfoMap[tokenId].splitterContract = royaltiesAddress;
        tokenInfoMap[tokenId].price = mintPrice;

        // ITablelandTables.Statement[] memory statements = new ITablelandTables.Statement[](4);

        TablelandStorage.toUpdate(
            string.concat("dbCID='", dbCID, "'"),
            string.concat("tokenID=", Strings.toString(tokenId))
        );

        TablelandStorage.toUpdate(
            string.concat("label='", label, "'"),
            string.concat("tokenID=", Strings.toString(tokenId))
        );

        TablelandStorage.insertAttributeStatement(tokenId, "price", Strings.toString(mintPrice));

        TablelandStorage.insertAttributeStatement(
            tokenId,
            "splitterContract",
            Strings.toHexString(royaltiesAddress)
        );
    }

    function updateDB_NFT1(uint256 tokenId, string memory dbCID, string memory label) public {
        require(_exists(tokenId));
        require(tokenInfoMap[tokenId].requiredRows > 0);
        require(tokenInfoMap[tokenId].creator == msg.sender);
        TablelandStorage.toUpdate(
            string.concat("dbCID='", dbCID, "'"),
            string.concat("tokenID=", Strings.toString(tokenId))
        );

        TablelandStorage.toUpdate(
            string.concat("label='", label, "'"),
            string.concat("tokenID=", Strings.toString(tokenId))
        );
    }

    function updateDB_NFT(
        uint256 tokenId,
        string memory dbCID,
        string memory label,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public {
        require(_exists(tokenId));
        require(tokenInfoMap[tokenId].requiredRows > 0);
        require(tokenInfoMap[tokenId].creator == msg.sender);
        string memory signedMessage = string.concat(Strings.toString(tokenId), dbCID);
                require(!signedMessages[signedMessage]);

        require(TablelandStorage.verifyString(signedMessage, v, r, s, SignerAddress));
                signedMessages[signedMessage] = true;

        TablelandStorage.toUpdate(
            string.concat("dbCID='", dbCID, "'"),
            string.concat("tokenID=", Strings.toString(tokenId))
        );

        TablelandStorage.toUpdate(
            string.concat("label='", label, "'"),
            string.concat("tokenID=", Strings.toString(tokenId))
        );
    }

    // We also need to call this function from the PKP because we need to set a fair royaltiesAddress splitter contract
    function createOpenDataSet(
        string memory dbCID,
        string memory label,
        string memory dataFormatCID,
        string memory dbName,
        string memory description,
        string[] memory categories
    ) public {
        tokenID.increment();
        tokenInfoMap[tokenID.current()].requiredRows = 0;
        TablelandStorage.insertMainStatement(
            tokenID.current(),
            dataFormatCID,
            dbName,
            description,
            dbCID,
            0,
            0,
            label
        );

        TablelandStorage.insertAttributeStatement(
            tokenID.current(),
            "creator",
            Strings.toHexString(msg.sender)
        );

        for (uint256 i = 0; i < categories.length; i++) {
            TablelandStorage.insertAttributeStatement(tokenID.current(), "category", categories[i]);
        }
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
        TablelandStorage.sendViaCall{value: msg.value}(
            payable(tokenInfoMap[tokenid].splitterContract)
        );
        _mint(msg.sender, tokenid, 1, "");
    }

    /// @notice Overriten URI function of the ERC1155 to fit Tableland based NFTs
    /// @dev retrieves the value of the tokenID
    /// @return the tokenURI link for the specific NFT metadata
    function uri(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId));
        return TablelandStorage.uri(tokenId);
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

    function assignNewSignerAddress(address newSignerAddress) public onlyOwner {
        SignerAddress = newSignerAddress;
    }

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal pure override {
        require(
            from == address(0) || to == address(0),
            "This a Soulbound token. It cannot be transferred. It can only be burned by the token owner."
        );
    }
}
