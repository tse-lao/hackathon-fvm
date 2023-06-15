// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./interfaces/IGroupTablelandStorage.sol";
import "./interfaces/IMultisig.sol";

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

contract GroupFolder is AccessControl {

    using Counters for Counters.Counter;
    using EnumerableSet for EnumerableSet.UintSet;
    using EnumerableSet for EnumerableSet.AddressSet;

    bytes32 CONTRACT_TABLELAND_MOD = keccak256("CONTRACT TABLELAND MOD");

    enum typeOf {
        multisigGroup,
        group,
        OpenDataset
    }

    mapping(uint256 => typeOf) private tokenType;

    // Counter for token IDs
    Counters.Counter private tokenID;

    // Instance of the Tableland storage contract
    IGroupTablelandStorage private tablelandStorage;

    constructor(IGroupTablelandStorage _tablelandStorage) {
        tablelandStorage = _tablelandStorage;
        _grantRole(CONTRACT_TABLELAND_MOD,msg.sender);
    }

    /**
     * @notice Creates a private repo and can share it with others
     * @dev Creating a Private Repo cannot be an NFT. Allowlisted addresses can add files in the repo and decrypt the repo contents using custom control conditions with lighthouse
     * @param repoName Repo name
     * @param description Repo description
     * @param allowedAddresses Contains the whitelisted addresses
     */

    function createPrivateRepo(
        string memory repoName,
        string memory description,
        address admin,
        address[] memory allowedAddresses
    ) public {
        tokenID.increment();
        uint256 tokenId = tokenID.current();
        tokenType[tokenId] = typeOf.group;
        _grantRole(keccak256(abi.encodePacked("GROUP_ADMIN",tokenId)),admin);
        for(uint256 i = 0; i < allowedAddresses.length; i++){
            _grantRole(keccak256(abi.encodePacked(tokenId)),allowedAddresses[i]);
            tablelandStorage.insertAttributeStatement(
                tokenId,
                "member",
                Strings.toHexString(allowedAddresses[i])
            );
        }

        tablelandStorage.insertMainStatement(
            tokenId,
            repoName,
            description
        );
        tablelandStorage.insertAttributeStatement(
            tokenId,
            "admin",
            Strings.toHexString(msg.sender)
        );

        tablelandStorage.insertAttributeStatement(
            tokenId,
            "type",
            "privateFolder"
        );
    }

    function addMemberToPrivateFolder(uint256 folderID, address newMember) public onlyRole(keccak256(abi.encodePacked("GROUP_ADMIN",folderID))){
            _grantRole(keccak256(abi.encodePacked(folderID)),newMember);
            tablelandStorage.insertAttributeStatement(
                folderID,
                "member",
                Strings.toHexString(newMember)
            );
    }

    function removeMemberFromPrivateFolder(uint256 folderID, address member) public onlyRole(keccak256(abi.encodePacked("GROUP_ADMIN",folderID))){
            _revokeRole(keccak256(abi.encodePacked(folderID)),member);
            tablelandStorage.removeMember(folderID, member);
    }


        /**
     * @notice Creates a private repo and can share it with others
     * @dev Creating a Private Repo cannot be an NFT. Allowlisted addresses can add files in the repo and decrypt the repo contents using custom control conditions with lighthouse
     * @param folderName Repo name
     * @param description Repo description
     * @param multisig Contains the whitelisted addresses
     */

    function createMultisigFolder(
        string memory folderName,
        string memory description,
        address multisig
        ) public {
        tokenID.increment();
        uint256 tokenId = tokenID.current();
        tokenType[tokenId] = typeOf.multisigGroup;
        require(IMultisig(multisig).isMultisigOwner(msg.sender),"not multisig member");

        tablelandStorage.insertMainStatement(
            tokenId,
            folderName,
            description
        );
        tablelandStorage.insertAttributeStatement(
            tokenId,
            "creator",
            Strings.toHexString(msg.sender)
        );
        
        tablelandStorage.insertAttributeStatement(
            tokenId,
            "type",
            "multisigFolder"
        );

        tablelandStorage.insertAttributeStatement(
            tokenId,
            "multisigAddress",
            Strings.toHexString(multisig)
        );    
    }

    /**
     * @notice Creates an open DataSet accessible to anyone
     * It can get used to perform Compute Over Data
     * Operations using the lillypad contracts
     * @dev Creating an OpenDB cannot be an NFT
     * Open to Everyone
     * @param name: MerkleRoot
     * @param description: MerkleRoot
     * @param categories: MerkleRoot
     * @param datasetCID: contains the whitelisted addresses
     * @param mimetype: contains the whitelisted addresses
     */

    function createOpenDataSet(
        string memory name,
        string memory description,
        string[] memory categories,
        string memory datasetCID,
        string memory dataFormatCID,
        string memory mimetype,
        string memory piece_cid
    ) public {
        tokenID.increment();

        uint256 tokenId = tokenID.current();

        tokenType[tokenId] = typeOf.OpenDataset;

        tablelandStorage.insertMainStatement(
            tokenId,
            name,
            description
        );
        uint256 size = categories.length;
        for (uint256 i = 0; i < size;) {
            tablelandStorage.insertAttributeStatement(tokenId, "category", categories[i]);
            unchecked {
                ++i;
            }
        }

        tablelandStorage.insertAttributeStatement(
            tokenId,
            "creator",
            Strings.toHexString(msg.sender)
        );

        tablelandStorage.insertAttributeStatement(
            tokenId,
            "datasetCID",
            datasetCID
        );

        tablelandStorage.insertAttributeStatement(
            tokenId,
            "dataFormatCID",
            dataFormatCID
        );
        
        tablelandStorage.insertAttributeStatement(
            tokenId,
            "mimetype",
            mimetype
        );

        tablelandStorage.insertAttributeStatement(
            tokenId,
            "type",
            "openDataset"
        );

        tablelandStorage.insertAttributeStatement(
            tokenId,
            "piece_cid",
            piece_cid
        );          
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
     */

    function addFileOnPrivateGroup(
        uint256 tokenId,
        string memory dataCID
    ) public onlyRole(keccak256(abi.encodePacked(tokenId))) {
        tablelandStorage.insertSubmissionStatement(tokenId, dataCID,  msg.sender);
    }

      /*
     * @notice Creates a contribution on a DB_NFT
     * adding into contribution table the contribution
     * @dev The contribution needs to get signed by our
     * Backend to evaluate the dataCID format is the same
     * with the DB_dataFormat only signatures from Connect-Fast
     * are accepted
     * @param tokenId: tokenId to contribute
     * @param multisig: tokenId to contribute
     * @param dataCID: CID content of the file contributed
     */

    function addFileOnMultisigGroup(
        uint256 tokenId,
        address multisig,
        string memory dataCID
    ) public {
        require(tokenType[tokenId] == typeOf.multisigGroup);
        require(IMultisig(multisig).isMultisigOwner(msg.sender));
        tablelandStorage.insertSubmissionStatement(tokenId, dataCID, msg.sender);
    }


    function hasFolderAccess(address sender, address multisig, uint256 tokenid) public view returns (bool) {
        if(multisig == address(0)){
            return hasRole(keccak256(abi.encodePacked(tokenid)), sender);
        }
        else{
            return IMultisig(multisig).isMultisigOwner(msg.sender);
        }
    }


    /*
     * @dev returns the TablelandStorage Helper Contract that is responsible
     * to maintain the DB_NFTs tables this contract is the only one that can call it
     */

    function getTablelandStorage() public view returns (IGroupTablelandStorage) {
        return tablelandStorage;
    }

    /*
     * @dev future function in when maximum amount of rows on tableland tables is exceeded
     * only callable by the contract owner
     * @dev assigns a new Signer for the contract
     * only callable by the contract owner
     */

    function setNewTablelandStorage(
        IGroupTablelandStorage _newTablelandStorageContract
    ) public onlyRole(CONTRACT_TABLELAND_MOD) {
        tablelandStorage = _newTablelandStorageContract;
    }


    /*
     * @notice returns the total number of DBs
     */
    function totalSupply() public view returns (uint256) {
        return tokenID.current();
    }

    /*
     * @dev checks if a tokenId exists
     * @param tokenId: TokenID to make the check
     */

    function _exists(uint256 tokenId) internal view {
        require(tokenId <= tokenID.current(), "non existed tokenID");
    }

}
