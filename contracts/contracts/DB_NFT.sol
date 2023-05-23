// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./interfaces/ITablelandStorage.sol";

/**
 * @title DB_NFT
 * @author Nick Lionis (github: nijoe1)
 * @notice Contract for creating decentralized datassets as NFTs
 *
 * @dev This contract allows users to create decentralized databases (DBs) as non-fungible tokens (NFTs).
 * DBs can be public datasets, private repos, or open datasets. Users can request DBs, contribute to existing DBs,
 * and mint DB NFTs. DB NFTs provide access to the DB contents and can be sold or transferred.
 *
 * Features:
 * - Request a DB: Users can request the creation of a DB by providing data format, DB name, description, and other details.
 * - Contribute to a DB: Users can contribute their data and specified number of rows to an existing DB.
 * - Create a private repo: Users can create a private repo and share it by adding people to the Merkle tree.
 * - Create an open dataset: Users can create an open dataset accessible to anyone.
 * - Mint DB Soulbound NFTs: DB creators can mint NFTs that provide access to the DB contents.
 *
 * @dev This contract integrates with Tableland for managing DB data and metadata.
 */

contract DB_NFT is ERC1155, Ownable {

    using Counters for Counters.Counter;
    using EnumerableSet for EnumerableSet.UintSet;
    
    // Structure to store information about a DB
    struct DBInfo {
        address creator;
        address splitterContract;
        bytes32 submitRoot;
        uint256 mintPrice;
        int256 requiredRows;
        uint256 minSubRows;
        DBState dbState;
    }

    // Enum to represent the state of a DB
    enum DBState {
        RequestStatus,
        ReadyToBeMintable,
        Mintable,
        Repo,
        OpenDataset
    }

    // Counter for token IDs
    Counters.Counter private tokenID;

    // Mapping to store DBInfo for each token ID
    mapping(uint256 => DBInfo) private dbInfoMap;

    // Mapping to track signed messages
    mapping(string => bool) private signedMessages;

    // Mapping to store contributors of private repos
    mapping(address => EnumerableSet.UintSet) private privateRepoContributor;

    // Address of the signer
    address public signerAddress;

    // Instance of the Tableland storage contract
    ITablelandStorage private tablelandStorage;

    constructor(ITablelandStorage _tablelandStorage, address _signerAddress) ERC1155("") {
        tablelandStorage = _tablelandStorage;
        signerAddress = _signerAddress;
    }


    /**
     * @notice Creates a DB request
     * @dev Users can request the creation of a DB by providing data format, DB name, description, and other details.
     * @param dataFormatCID Format of data this DB will contain
     * @param dbName DB Name
     * @param description DB description
     * @param categories Data field categories
     * @param requiredRows Minimum amount of Rows to create the DB NFT
     * @param minSubRows Minimum rows per Contribution
     */

    function RequestDB(
        string memory dataFormatCID,
        string memory dbName,
        string memory description,
        string[] memory categories,
        int256 requiredRows,
        uint256 minSubRows
    ) public {
        require(requiredRows > 0);
        tokenID.increment();
        uint256 tokenId = tokenID.current();
        dbInfoMap[tokenId].requiredRows = requiredRows;
        dbInfoMap[tokenId].minSubRows = minSubRows;
        dbInfoMap[tokenId].creator = msg.sender;
        dbInfoMap[tokenId].dbState = DBState.RequestStatus;

        tablelandStorage.insertMainStatement(tokenId,dataFormatCID,dbName,description,"dbCID",minSubRows,uint256(requiredRows),"label");

        tablelandStorage.insertAttributeStatement(tokenId,"creator",Strings.toHexString(msg.sender));

        for (uint256 i = 0; i < categories.length; i++) {
            tablelandStorage.insertAttributeStatement(tokenId, "category", categories[i]);
        }
    }


    /**
     * @notice Creates a private repo and can share it with others
     * @dev Creating a Private Repo cannot be an NFT. Allowlisted addresses can add files in the repo and decrypt the repo contents using custom control conditions with lighthouse
     * @param repoName Repo name
     * @param description Repo description
     * @param SubmitProof Contains the whitelisted addresses
     * @param SubmitRoot MerkleRoot
     */

    function createPrivateRepo(
        string memory repoName,
        string memory description,
        string[] memory SubmitProof,
        bytes32 SubmitRoot
    ) public {
        require(SubmitProof.length > 0, "wrong input whitelisted address array must be greater than 0");
        tokenID.increment();
        uint256 tokenId = tokenID.current();
        dbInfoMap[tokenId].creator = msg.sender;
        dbInfoMap[tokenId].dbState = DBState.Repo;

        // Adds the whitelisted Addresses on tableland and 
        // assigns the MerkleRoot to the Repo token
        setRepoSubmitAccessMerkleRoot(tokenId, SubmitProof, SubmitRoot);

        tablelandStorage.insertMainStatement(tokenId,"repo",repoName,description,"repo",0,0,"repo");
        tablelandStorage.insertAttributeStatement(tokenId,"creator",Strings.toHexString(msg.sender));
    }


    /**
      * @notice Creates an open DataSet accessible to anyone
      * It can get used to perform Compute Over Data 
      * Operations using the lillypad contracts
      * @dev Creating an OpenDB cannot be an NFT
      * Open to Everyone
      * @param dbCID: repoName
      * @param label: repoDescription
      * @param dataFormatCID: contains the whitelisted addresses
      * @param dbName: MerkleRoot
      * @param description: MerkleRoot
      * @param categories: MerkleRoot
     */

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
        tablelandStorage.insertMainStatement(tokenID.current(),dataFormatCID,dbName,description,dbCID,0,0,label);
        uint256 size = categories.length;
        for (uint256 i = 0; i < size; i++) {
                tablelandStorage.insertAttributeStatement(tokenID.current(),"category",categories[i]);
        }
        tablelandStorage.insertAttributeStatement(tokenID.current(),"creator",Strings.toHexString(msg.sender));
    }


    /*
     * @notice Creates a contribution on a DB_NFT
     * adding into contribution table the contribution
     * @dev The contribution needs to get signed by our
     * Backend to evaluate the dataCID format is the same
     * with the DB_dataFormat only signatures from Connect-Fast
     * are accepted
     * @param tokenId: tokenId to contribute
     * @param dataCID: CID content of the file contributed
     * @param rows: how many entries are included
     * @param SubmitProof: In case it is a repo it requires
     * the merkle proofHex of the msg.sender otherwise this is
     * an empty array
     * @param v: v Signature param
     * @param r: r Signature param
     * @param s: s Signature param
    */
    
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

        string memory signedMessage = string.concat(Strings.toString(tokenId),dataCID,Strings.toString(rows));
        // If there is access control for submissions check if sender
        // is elligible to participate in that DB submission!!!
        if (dbInfoMap[tokenId].submitRoot != bytes32(0)) {
            bytes32 Root = dbInfoMap[tokenId].submitRoot;
            require(verifyProof(SubmitProof, Root, msg.sender), "not in submit allowlist");
            if (!privateRepoContributor[msg.sender].contains(tokenId)) {
                string[] memory proof = new string[](1);
                proof[0] = Strings.toHexString(msg.sender);
                tablelandStorage.insertTokenProof(tokenId, proof, "VIEW");
            }
        }

        require(dbInfoMap[tokenId].minSubRows <= rows, "sumbit more data");
        require(dbInfoMap[tokenId].dbState != DBState.OpenDataset,"this is an OpenDB you cannot submit");
        checkSigPolicy(signedMessage, v, r, s);

        privateRepoContributor[msg.sender].add(tokenId);

        dbInfoMap[tokenId].requiredRows -= int256(rows);

        if (dbInfoMap[tokenId].requiredRows <= 0 && dbInfoMap[tokenId].dbState != DBState.Mintable) {
            dbInfoMap[tokenId].dbState = DBState.ReadyToBeMintable;
        }

        tablelandStorage.insertSubmissionStatement(tokenId, dataCID, rows, msg.sender);
    }


    /*
    * @notice Creates a DB_NFT SoulBound token others can mint
    * it to gain access to the DB contents
    * @dev Create DB_NFT requires our
    * Backend to evaluate the dbCID witch is a merge
    * of all the contributions and to create the splitterContract
    * using the thirdWeb factory to distribute fairly all the token mint 
    * Revenues to the Contributors callable only from the NFT Requestor-Creator
    * @param tokenId: tokenId to of the DB that will be created
    * @param dbCID: Merged CID of the DataBase
    * @param mintPrice: mint price of the DB
    * @param splitterContractAddress: ThirdWeb splitter contractAddress
    * @param label: The Filecoin PayloadCID so it can get used to create
    * cross chain join queries on the tableland tables to get the Tableland versions
    * of the dealClient and the dealRewarder Deals Status
    * @param v: v Signature param
    * @param r: r Signature param
    * @param s: s Signature param 
    */

    function createDBNFT(
        uint256 tokenId,
        string memory dbCID,
        uint256 mintPrice,
        address splitterContractAddress,
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
            Strings.toHexString(splitterContractAddress)
        );

        require(dbInfoMap[tokenId].dbState == DBState.ReadyToBeMintable);
        onlyTokenCreator(tokenId, msg.sender);
        checkSigPolicy(signedMessage, v, r, s);

        dbInfoMap[tokenId].dbState = DBState.Mintable;
        dbInfoMap[tokenId].splitterContract = splitterContractAddress;
        dbInfoMap[tokenId].mintPrice = mintPrice;

        string[] memory set = new string[](2);
        string memory filter = string.concat("tokenID=", Strings.toString(tokenId));
        set[0] = string.concat("dbCID='", dbCID, "'");
        set[1] = string.concat("label='", label, "'");
        tablelandStorage.toUpdate(set, filter);
        tablelandStorage.insertAttributeStatement(tokenId, "price", Strings.toString(mintPrice));
        tablelandStorage.insertAttributeStatement(tokenId,"splitterContract",Strings.toHexString(splitterContractAddress));
    }


   /*
    * @notice Update a DB_NFT 
    * @dev Create DB_NFT requires our
    * Backend to evaluate the dbCID witch is a merge
    * of all the Newcontributions and the previous mergedCID
    * @param tokenId: tokenId to of the DB that will be created
    * @param dbCID: Merged CID of the DataBase
    * @param label: The Filecoin PayloadCID so it can get used to create
    * cross chain join queries on the tableland tables to get the Tableland versions
    * of the dealClient and the dealRewarder Deals Status
    * @param v: v Signature param
    * @param r: r Signature param
    * @param s: s Signature param 
   */

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
        checkSigPolicy(signedMessage, v, r, s);
        require(dbInfoMap[tokenId].dbState == DBState.Mintable);

        string[] memory set = new string[](2);
        string memory filter = string.concat("tokenID=", Strings.toString(tokenId));
        set[0] = string.concat("dbCID='", dbCID, "'");
        set[1] = string.concat("label='", label, "'");
        tablelandStorage.toUpdate(set, filter);
    }


   /*
    * @dev Validates a Signed String that is Signed by our backend
    * @param signedMessage: The Signed Message
    * @param v: v Signature param
    * @param r: r Signature param
    * @param s: s Signature param 
    */

    function checkSigPolicy(
        string memory signedMessage,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) internal {
        require(!signedMessages[signedMessage], "CID already added");
        require(tablelandStorage.verifyString(signedMessage, v, r, s, signerAddress),"Invalid Signature");
        signedMessages[signedMessage] = true;
    }
    

    /*
    * @dev Minting DB NFTs only if it is mintable
    * @param tokenid: TokenID to mint
    */

    function mintDB(uint256 tokenid) public payable {
        _exists(tokenid);
        require(dbInfoMap[tokenid].dbState == DBState.Mintable, "DB not still mintable");
        require(balanceOf(msg.sender, tokenid) < 1 && dbInfoMap[tokenid].mintPrice == msg.value,"cannot mint already owner or wrong price");
        tablelandStorage.sendViaCall{value: msg.value}(
            payable(dbInfoMap[tokenid].splitterContract)
        );
        _mint(msg.sender, tokenid, 1, "");
    }


    /*
    * @dev Custom Access Control condition used with lighthouse for DB_NFTs
    * returns true if someone contributed or he is the cretor or he is a tokenHolder
    * @param sender: sender to check access
    * @param tokenid: TokenID to to check access for sender
    */

    function hasAccess(address sender, uint256 tokenid) public view returns (bool) {
        return privateRepoContributor[sender].contains(tokenid) || dbInfoMap[tokenid].creator == sender || balanceOf(sender, tokenid) > 0;
    }


   /*
    * @dev Custom Access Control condition used with lighthouse for private repos
    * returns true if someone is in the allowlist and made at least one contribution
    * @param sender: sender to check access
    * @param tokenid: TokenID to to check access for sender
    */

    function hasRepoAccess(address sender, uint256 tokenid) public view returns (bool) {
        return privateRepoContributor[sender].contains(tokenid);
    }


   /*
    * @dev Assigns the Merkle Tree allowlist the contributions of the private repo
    * and adds the allowlisted this function can get also used for DB_NFTs to allow only
    * a set of addresses to contribute to a DB_NFT 
    * addresses into tableland to keep them in a decentralized enviroment
    * @param tokenId: TokenID of the private repo
    * @param SubmitProof: the allowlisted addresses in string to be added on tableland
    * @param SubmitRoot: Merkle Root to validate contributions-Submission
    */

    function setRepoSubmitAccessMerkleRoot(
        uint256 tokenId,
        string[] memory SubmitProof,
        bytes32 SubmitRoot
    ) public {
        onlyTokenCreator(tokenId, msg.sender);
        dbInfoMap[tokenId].submitRoot = SubmitRoot;
        tablelandStorage.insertTokenProof(tokenId, SubmitProof, "SUBMIT");
    }


   /*
    * @notice withdraw function of the contract funds 
    * callable only by the contract owner
    */

    function withdraw() public payable onlyOwner {
        address payable to = payable(msg.sender);
        to.transfer(address(this).balance);
    }


    /*
    * @dev returns the TablelandStorage Helper Contract that is responsible
    * to maintain the DB_NFTs tables this contract is the only one that can call it
    */

    function getTablelandStorage() public view returns (ITablelandStorage) {
        return tablelandStorage;
    }


   /*
    * @dev future function in when maximum amount of rows on tableland tables is exceeded
    * only callable by the contract owner   
    * @dev assigns a new Signer for the contract
    * only callable by the contract owner
    */

    function setNewTablelandStorage(ITablelandStorage _newTablelandStorageContract)public onlyOwner{
        tablelandStorage = _newTablelandStorageContract;
    }


   /*
    * @dev assigns a new Signer for the contract
    * only callable by the contract owner
    */

    function assignNewSignerAddress(address _signerAddress) public onlyOwner {
        signerAddress = _signerAddress;
    }


   /*
    * @notice Overriten URI function of the ERC1155 to fit Tableland based NFTs
    * @dev retrieves the value of the tokenID
    * @return the tokenURI link for the specific NFT metadata
    * @param tokenId: TokenID of the private repo
    */

    function uri(uint256 tokenId) public view virtual override returns (string memory) {
        _exists(tokenId);
        return tablelandStorage.uri(tokenId);
    }


   /*
    * @notice returns the total number of DBs
    */
    function totalSupply() public view returns (uint256) {
        return tokenID.current();
    }


   /*
    * @dev Verifies if an address is allowed to interact with the tokenID
    * based on the Merkle Tree
    * @param proof: MerkleHexProof
    * @param root: MerkleTree Root
    * @param sender: Address to verify
    */

    function verifyProof(
        bytes32[] memory proof,
        bytes32 root,
        address sender
    ) internal pure returns (bool) {
        return MerkleProof.verify(proof, root, keccak256(abi.encodePacked(sender)));
    }


   /*
    * @dev checks if a tokenId exists
    * @param tokenId: TokenID to make the check
    */

    function _exists(uint256 tokenId) internal view {
        require(tokenId <= tokenID.current(), "non existed tokenID");
    }


   /*
    * @dev checks the tokenCreator
    * @param tokenId: TokenID to make the check
    * @param sender: TokenID to make the check
    */
    function onlyTokenCreator(uint256 tokenId, address sender) internal view {
        require(dbInfoMap[tokenId].creator == sender, "only token creator");
    }


   /*
    * @dev Makes the DB_NFTs SoulBound tokens
    * @param operator:
    * @param from: 
    * @param to: 
    * @param ids: 
    * @param amounts: 
    * @param data:
    */
   
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
