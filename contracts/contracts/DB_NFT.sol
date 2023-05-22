// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "./interfaces/ITablelandStorage.sol";

/** @title DB_NFT. */
/// @author Nick Lionis (github handle : nijoe1 )
/// @notice Use this contract for creating Decentralized datassets with others and sell them as NFTs
/// All the data inside the tables are pointing on an IPFS CID.

// DB Versioning that will also include timestampt
// To allow to create open non encrypted DBs without requirun=ing contributions ...abi
// A licence field
contract DB_NFT is ERC1155, Ownable {
    using Counters for Counters.Counter;
    using EnumerableSet for EnumerableSet.UintSet;
    using EnumerableSet for EnumerableSet.AddressSet;

    struct DBInfo {
        address creator;
        address splitterContract;
        bytes32 accessRoot;
        bytes32 submitRoot;
        uint256 price;
        int256 requiredRows;
        uint256 minimumRowsOnSubmission;
        DBState dbState;
    }

    enum DBState {
        RequestStatus,
        ReadyToBeMintable,
        Mintable,
        Repo,
        OpenDataset
    }

    Counters.Counter private tokenID;

    EnumerableSet.AddressSet private allowedSignerPlatforms;

    mapping(uint256 => DBInfo) private dbInfoMap;

    mapping(uint256 => mapping(address => uint256)) private submissionsNumberByID;

    mapping(string => bool) private signedMessages;

    address public signerAddress;

    ITablelandStorage private tablelandStorage;

    constructor(ITablelandStorage _tablelandStorage, address _signerAddress) ERC1155("") {
        tablelandStorage = _tablelandStorage;
        signerAddress = _signerAddress;
    }

    function RequestDB(
        string memory dataFormatCID,
        string memory dbName,
        string memory description,
        string[] memory categories,
        int256 requiredRows,
        uint256 minimumRowsOnSubmission
    ) public {
        require(requiredRows > 0);
        tokenID.increment();
        uint256 tokenId = tokenID.current();
        dbInfoMap[tokenId].requiredRows = requiredRows;
        dbInfoMap[tokenId].minimumRowsOnSubmission = minimumRowsOnSubmission;
        dbInfoMap[tokenId].creator = msg.sender;
        dbInfoMap[tokenId].dbState = DBState.RequestStatus;

        tablelandStorage.insertMainStatement(
            tokenId,
            dataFormatCID,
            dbName,
            description,
            "dbCID",
            minimumRowsOnSubmission,
            uint256(requiredRows),
            "label"
        );

        tablelandStorage.insertAttributeStatement(
            tokenId,
            "creator",
            Strings.toHexString(msg.sender)
        );

        for (uint256 i = 0; i < categories.length; i++) {
            tablelandStorage.insertAttributeStatement(tokenId, "category", categories[i]);
        }
    }

    function createPrivateRepo(
        string memory repoName,
        string memory description,
        string[] memory AccessProof,
        bytes32 AccessRoot,
        string[] memory SubmitProof,
        bytes32 SubmitRoot
    ) public {
        tokenID.increment();
        uint256 tokenId = tokenID.current();
        dbInfoMap[tokenId].creator = msg.sender;
        dbInfoMap[tokenId].dbState = DBState.Repo;

        setRepoViewAccess(tokenId,AccessProof, AccessRoot);
        setRepoSubmitAccess(tokenId,SubmitProof, SubmitRoot);


        tablelandStorage.insertMainStatement(
            tokenId,
            "repo",
            repoName,
            description,
            "repo",
            0,
            0,
            "repo"
        );

        tablelandStorage.insertAttributeStatement(
            tokenId,
            "creator",
            Strings.toHexString(msg.sender)
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
        dbInfoMap[tokenID.current()].dbState = DBState.OpenDataset;
        tablelandStorage.insertMainOpenDBStatement(
            tokenID.current(),
            dataFormatCID,
            dbName,
            description,
            dbCID,
            label
        );

        uint256 size = categories.length + 1;
        for (uint256 i = 0; i < size; i++) {
            if (i < size) {
                tablelandStorage.insertAttributeStatement(
                    tokenID.current(),
                    "category",
                    categories[i]
                );
            } else {
                tablelandStorage.insertAttributeStatement(
                    tokenID.current(),
                    "creator",
                    Strings.toHexString(msg.sender)
                );
            }
        }
    }

    function contribute(
        uint256 tokenId,
        string memory dataCID,
        uint256 rows,
        bytes32[] memory SubmitProof,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public {
        _exists(tokenId);

        string memory signedMessage = string.concat(
            Strings.toString(tokenId),
            dataCID,
            Strings.toString(rows)
        );
        // If there is access control for submissions check if sender
        // is elligible to participate in that DB submission!!!
        if (dbInfoMap[tokenId].submitRoot != bytes32(0)) {
            bytes32 Root = dbInfoMap[tokenId].submitRoot;
            require(
                verifyProof(SubmitProof, Root, msg.sender),
                "not in submit allowlist"
            );
        }

        require(dbInfoMap[tokenId].minimumRowsOnSubmission <= rows, "sumbit more data");

        require(
            dbInfoMap[tokenId].dbState != DBState.OpenDataset,
            "this is an OpenDB you cannot submit"
        );

        checkSigPolicy(signedMessage, v, r, s, signerAddress);

        submissionsNumberByID[tokenId][msg.sender] += rows;

        dbInfoMap[tokenId].requiredRows -= int256(rows);

        if (dbInfoMap[tokenId].requiredRows > 0 && dbInfoMap[tokenId].dbState != DBState.Mintable) {
            dbInfoMap[tokenId].dbState = DBState.ReadyToBeMintable;
        }

        tablelandStorage.insertSubmissionStatement(tokenId, dataCID, rows, msg.sender);
    }

    // We also need to call this function from the PKP because we need to set a fair royaltiesAddress splitter contract
    function createDBNFT(
        uint256 tokenId,
        string memory dbCID,
        uint256 mintPrice,
        address royaltiesAddress,
        string memory label,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public {
        _exists(tokenId);

        string memory signedMessage = string.concat(
            Strings.toString(tokenId),
            dbCID,
            Strings.toString(mintPrice),
            Strings.toHexString(royaltiesAddress)
        );

        require(dbInfoMap[tokenId].dbState == DBState.ReadyToBeMintable);

        onlyTokenCreator(tokenId, msg.sender);

        checkSigPolicy(signedMessage, v, r, s, signerAddress);

        dbInfoMap[tokenId].dbState = DBState.Mintable;

        dbInfoMap[tokenId].splitterContract = royaltiesAddress;

        dbInfoMap[tokenId].price = mintPrice;

        string[] memory set = new string[](2);
        string memory filter = string.concat("tokenID=", Strings.toString(tokenId));

        set[0] = string.concat("dbCID='", dbCID, "'");
        set[1] = string.concat("label='", label, "'");

        tablelandStorage.toUpdate(set, filter);

        tablelandStorage.insertAttributeStatement(tokenId, "price", Strings.toString(mintPrice));

        tablelandStorage.insertAttributeStatement(
            tokenId,
            "splitterContract",
            Strings.toHexString(royaltiesAddress)
        );
    }

    function updateDB_NFT1(uint256 tokenId, string memory dbCID, string memory label) public {
        _exists(tokenId);
        require(dbInfoMap[tokenId].requiredRows > 0);
        onlyTokenCreator(tokenId, msg.sender);

        string[] memory set = new string[](2);
        string memory filter = string.concat("tokenID=", Strings.toString(tokenId));
        set[0] = string.concat("dbCID='", dbCID, "'");
        set[1] = string.concat("label='", label, "'");
        tablelandStorage.toUpdate(set, filter);
    }

    function updateDB(
        uint256 tokenId,
        string memory dbCID,
        string memory label,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public {
        _exists(tokenId);
        onlyTokenCreator(tokenId, msg.sender);        
        string memory signedMessage = string.concat(Strings.toString(tokenId), dbCID);
        checkSigPolicy(signedMessage, v, r, s, signerAddress);
        require(dbInfoMap[tokenId].dbState == DBState.Mintable);

        string[] memory set = new string[](2);
        string memory filter = string.concat("tokenID=", Strings.toString(tokenId));
        set[0] = string.concat("dbCID='", dbCID, "'");
        set[1] = string.concat("label='", label, "'");
        tablelandStorage.toUpdate(set, filter);
    }

    function checkDBState(uint256 tokenId, DBState state) internal view returns (bool) {
        return dbInfoMap[tokenId].dbState == state;
    }

    function checkSigPolicy(
        string memory signedMessage,
        uint8 v,
        bytes32 r,
        bytes32 s,
        address SignerAddress
    ) internal {
        require(!signedMessages[signedMessage], "CID already added");
        require(
            tablelandStorage.verifyString(signedMessage, v, r, s, SignerAddress),
            "Invalid Signature"
        );
        signedMessages[signedMessage] = true;
    }

    function addsignerAddress(address _signerAddress) public onlyOwner {
        allowedSignerPlatforms.add(_signerAddress);
    }

    function removesignerAddress(address _signerAddress) public onlyOwner {
        allowedSignerPlatforms.remove(_signerAddress);
    }

    function mintDB(uint256 tokenid) public payable {
        _exists(tokenid);
        require(dbInfoMap[tokenid].dbState == DBState.Mintable, "DB not still mintable");
        require(
            balanceOf(msg.sender, tokenid) < 1 && dbInfoMap[tokenid].price <= msg.value,
            "cannot mint already owner or wrong price"
        );
        tablelandStorage.sendViaCall{value: msg.value}(
            payable(dbInfoMap[tokenid].splitterContract)
        );
        _mint(msg.sender, tokenid, 1, "");
    }

    /// @notice withdraw function of the contract funds only by the contract owner
    function withdraw() public payable onlyOwner {
        address payable to = payable(msg.sender);
        to.transfer(address(this).balance);
    }

    function getTablelandStorage() public view returns (ITablelandStorage) {
        return tablelandStorage;
    }

    // Give access to the submissions of an NFT and the NFT final DB to the contributors and to the Owner
    function hasAccess(address contributor, uint256 tokenId) public view returns (bool) {
        return
            submissionsNumberByID[tokenId][contributor] > 0 ||
            dbInfoMap[tokenId].creator == contributor ||
            balanceOf(contributor, tokenId) > 0;
    }

    function hasRepoAccess(
        uint256 tokenid,
        bytes32[] memory Accessproof,
        address sender
    ) public view returns (bool) {
        return verifyProof(Accessproof, dbInfoMap[tokenid].accessRoot,sender);
    }

    function setRepoSubmitAccess(
        uint256 tokenId,
        string[] memory SubmitProof,
        bytes32 SubmitRoot
    ) public {
        onlyTokenCreator(tokenId, msg.sender);
        dbInfoMap[tokenId].submitRoot = SubmitRoot;
        tablelandStorage.insertTokenProof(tokenId, SubmitProof, "SUBMIT");
    }
    
    function setRepoViewAccess(
        uint256 tokenId,
        string[] memory Accessproof,
        bytes32 AccessRoot
    ) public {
        onlyTokenCreator(tokenId, msg.sender);
        dbInfoMap[tokenId].accessRoot = AccessRoot;
        tablelandStorage.insertTokenProof(tokenId, Accessproof, "VIEW");
    }

    /// @notice Overriten URI function of the ERC1155 to fit Tableland based NFTs
    /// @dev retrieves the value of the tokenID
    /// @return the tokenURI link for the specific NFT metadata
    function uri(uint256 tokenId) public view virtual override returns (string memory) {
        _exists(tokenId);
        return tablelandStorage.uri(tokenId);
    }

    /// @notice returns the total number of minted NFTs
    function totalSupply() public view returns (uint256) {
        return tokenID.current();
    }

    function verifyProof(bytes32[] memory proof, bytes32 root, address sender) internal pure returns (bool) {
        return MerkleProof.verify(proof, root, keccak256(abi.encodePacked(sender)));
    }

    function _exists(uint256 tokenId) internal view {
        require(tokenId <= tokenID.current(), "non existed tokenID");
    }

    function onlyTokenCreator(uint256 tokenId, address sender) internal view {
        require(dbInfoMap[tokenId].creator == sender, "only token creator");
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
