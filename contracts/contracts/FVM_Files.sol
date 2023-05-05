// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;
// import { AxelarExecutable } from "@axelar-network/axelar-gmp-sdk-solidity/contracts/executable/AxelarExecutable.sol";
// import { IAxelarGateway } from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol";
// import { IAxelarGasService } from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol";
// import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@tableland/evm/contracts/ITablelandTables.sol";
// import "@tableland/evm/contracts/ITablelandController.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
// import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";
import "./utils/SQLHelpers.sol";


/*
CryptoStudio is builded to provide a completly dynamic NFT experience
Digital Artists can create their NFTs and think of unlimited ways to create
dynamic NFT experiences by leveraging tableland SQL utilities inside SmartContracts
*/

/** @title CryptoStudio a dynamic NFT Collection. */
/// @author Nick Lionis (github handle : nijoe1 )
/// @notice Use this contract for minting your NFTs inside the Crypto Studio application
/// @dev A new Dynamic NFTContract that takes The benefits of pure SQL dynamic features
/// Tableland offers mutable Data with immutable access control only by the SmartContract
/// All the data inside the tables are pointing to an IPFS CID.

// contract FVM_Files is ERC1155, Ownable , ERC2981, AxelarExecutable 
// contract FilesV2 is ERC1155, Ownable , AxelarExecutable 
// contract FilesV2 is ERC1155 , AxelarExecutable 

contract FVM_Files is ERC1155 

{
    string private constant SUBNFT_TABLE_PREFIX = "sub_NFTs";
    string private constant SUBNFT_SCHEMA = "rootID text, subNFTID text";
    string private constant SUBMISSION_TABLE_PREFIX = "data_contribution";
    string private constant SUBMISSION_SCHEMA = "tokenID text, metadataCID text, rows text, creator text";
    string private constant ATTRIBUTE_TABLE_PREFIX = "file_attribute";
    string private constant ATTRIBUTE_SCHEMA = "tokenID text, trait_type text, value text";
    string private constant MAIN_TABLE_PREFIX = "file_main";
    string private constant MAIN_SCHEMA = "tokenID text, dataFormatCID text, DBname text, desc text, metadataCID text";
    using EnumerableSet for EnumerableSet.UintSet;
    using EnumerableSet for EnumerableSet.AddressSet;
    using Counters for Counters.Counter;
    string private value;
    string private sourceChain;
    string private sourceAddress;
    // IAxelarGasService public immutable gasService;

    struct tokenInfo{
        address creator;
        address splitterContract;
        uint256 price;
        uint256 requiredRows;
        uint256 remainingRows;
        string category;
        bool mintable;
    }
    

    Counters.Counter private tokenID;
    mapping(uint256 => tokenInfo) public tokenInfoMap;
    mapping(uint256 => mapping (address => uint256))  private submissionsNumberByID;
    mapping(uint256=> EnumerableSet.AddressSet) private allowedAddresses;
  
    ITablelandTables private tablelandContract;

    string  private _baseURIString;

    string  private mainTable;
    uint256 private mainTableID;

    string  private attributeTable;
    uint256 private attributeTableID;

    string  private submission_table;
    uint256 private submission_tableID;

    string  private subNFT_table;
    uint256 private subNFT_tableID;

    address public owner;

    // constructor(address gateway_, address gasReceiver_) ERC1155("") AxelarExecutable(gateway_) {
    constructor() ERC1155("") {     
        owner = msg.sender;
        // gasService = IAxelarGasService(gasReceiver_);
        _baseURIString = "https://testnets.tableland.network/api/v1/query?statement=";
        // MUMBAI
        // tablelandContract = ITablelandTables(0x4b48841d4b32C4650E4ABc117A03FE8B51f38F68);
        // HYPERSPACE
        tablelandContract = ITablelandTables(0x0B9737ab4B3e5303CB67dB031b509697e31c02d3);

        // Create  tables.

        submission_tableID = tablelandContract.createTable(
            address(this),
            SQLHelpers.toCreateFromSchema(SUBMISSION_SCHEMA, SUBMISSION_TABLE_PREFIX)
        );

        submission_table = SQLHelpers.toNameFromId(SUBMISSION_TABLE_PREFIX, submission_tableID);

                // Create crypto Studio main nft table.
        mainTableID = tablelandContract.createTable(
            address(this),
            SQLHelpers.toCreateFromSchema(MAIN_SCHEMA, MAIN_TABLE_PREFIX)
        );

        mainTable = SQLHelpers.toNameFromId(MAIN_TABLE_PREFIX, mainTableID);
        // Create crypto Studio attribute nft table.
        attributeTableID = tablelandContract.createTable(
            address(this),
            SQLHelpers.toCreateFromSchema(ATTRIBUTE_SCHEMA, ATTRIBUTE_TABLE_PREFIX)
        );

        attributeTable = SQLHelpers.toNameFromId(ATTRIBUTE_TABLE_PREFIX, attributeTableID);

        // Create crypto Studio social space table.
        subNFT_tableID = tablelandContract.createTable(
            address(this),
            SQLHelpers.toCreateFromSchema(SUBNFT_SCHEMA, SUBNFT_TABLE_PREFIX)
        );

        subNFT_table = SQLHelpers.toNameFromId(SUBNFT_TABLE_PREFIX, subNFT_tableID);
    }

    /// @notice Minting function 
    /// @dev retrieves the values for the NFT that is going to be Minted.
    /// the caller must mint an NFT on top of his pre taken category otherwise he cannot mint
    // string private constant MAIN_SCHEMA = "tokenID text, description text, image text, name text, files text, maxSupply text, currentSupply text, mintPrice text";
// tokenID text, dataFormatCID text, DBname text, desc text, metadataCID

// , uint256 mintPrice, uint256 maxSupply add them later
    function RequestDB(string memory dataFormatCID , string memory DBname , string memory description , string memory category, address[] memory allowed, uint256 requiredRows, string memory metadataCID) public {
        tokenID.increment();
        uint256 ID = tokenID.current();
        tokenInfoMap[ID].creator = msg.sender;
        tokenInfoMap[ID].requiredRows = requiredRows;
        tokenInfoMap[ID].remainingRows = requiredRows;
        tokenInfoMap[ID].category = category;
        for(uint256 i = 0; i< allowed.length; i++){
            allowedAddresses[ID].add(allowed[i]);
        }
        insertMain(ID,dataFormatCID,DBname,description,category,msg.sender,metadataCID);
    }


    function insertMain(uint256 ID, string memory dataFormatCID, string memory DBname, string memory description, string memory category, address sender, string memory metadataCID) internal{
        string memory insert_statement =  SQLHelpers.insertMainStatement(MAIN_TABLE_PREFIX,mainTableID,ID,dataFormatCID,DBname,description,metadataCID);
        string memory insert_statement2 = SQLHelpers.insertAttributeStatement(ATTRIBUTE_TABLE_PREFIX,attributeTableID,ID ,"category", category);
        string memory insert_statement3 = SQLHelpers.insertAttributeStatement(ATTRIBUTE_TABLE_PREFIX,attributeTableID,ID ,"creator", Strings.toHexString(sender));   
        runSQL(mainTableID,insert_statement);
        runSQL(attributeTableID,insert_statement2);
        runSQL(attributeTableID,insert_statement3);
    }

    function submitData(uint256 tokenId, string memory metadataCID, uint256 rows) public{
        require(allowedAddresses[tokenId].contains(msg.sender));
        submissionsNumberByID[tokenId][msg.sender] = submissionsNumberByID[tokenId][msg.sender] + rows;
        if(tokenInfoMap[tokenId].remainingRows >= rows){
            tokenInfoMap[tokenId].remainingRows = tokenInfoMap[tokenId].remainingRows - rows;
        }
        else{
            tokenInfoMap[tokenId].remainingRows = 0;
        }
        string memory insert_statement =  SQLHelpers.insertSubmissionStatement(SUBMISSION_TABLE_PREFIX,submission_tableID,tokenId ,metadataCID,rows,msg.sender);
        runSQL(mainTableID,insert_statement);
    }

    function createDB_NFT(uint256 tokenId, string memory metadataCID , uint256 mintPrice, address royaltiesAddress) public {
        require(msg.sender == tokenInfoMap[tokenId].creator && tokenInfoMap[tokenId].remainingRows == 0);
        tokenInfoMap[tokenId].price = mintPrice;
        tokenInfoMap[tokenId].splitterContract = royaltiesAddress;
        string memory set = string.concat("metadataCID='",metadataCID,"'");
        string memory filter = string.concat("tokenID=",Strings.toString(tokenId));
        string memory Update_statement = SQLHelpers.toUpdate(MAIN_TABLE_PREFIX,mainTableID, set, filter);
        runSQL(mainTableID,Update_statement);
    }

    // // Handles calls created by setAndSend. Updates this contract's value
    // function _execute(
    //     // string calldata sourceChain_,
    //     // string calldata sourceAddress_,
    //     bytes calldata payload_
    // ) internal {
    // // ) internal override {

    //     (uint256 ID,string memory DBname, string memory dataFormatCID , string memory metadataCID , string memory description ,string memory category, uint256 mintPrice, uint256 subNFTOF, address sender) = abi.decode(payload_, (uint256,string,string,string ,string,string,uint256,uint256, address));
    //     // CreateFileNFT(name, imageCID, fileCID, description, category, mintPrice, maxSupply, subNFTOF);
    //     require(balanceOf(sender, subNFTOF) > 0 || tokenInfoMap[subNFTOF].creator == sender || sender == address(this));
    //         tokenID.increment();
    //         uint256 tokenId = tokenID.current();
    //         tokenInfoMap[tokenId].price = mintPrice;
    //         insertMain(tokenId,dataFormatCID,DBname,description,category,sender,metadataCID);
    //         string memory insert_statement4 = SQLHelpers.subNFTInsertion(SUBNFT_TABLE_PREFIX,subNFT_tableID, Strings.toString(subNFTOF), Strings.toString(ID));
    //         runSQL(subNFT_tableID,insert_statement4);
    // }

    //     // Call this function to update the value of this contract along with all its siblings'.
    // function setRemoteValue(
    //     string calldata destinationChain,
    //     string calldata destinationAddress,
    //     uint256 tokenId
    // ) external payable {
    //     bytes memory payload = abi.encode(tokenId, msg.sender);
    //     if (msg.value > 0) {
    //         gasService.payNativeGasForContractCall{ value: msg.value }(
    //             address(this),
    //             destinationChain,
    //             destinationAddress,
    //             payload,
    //             msg.sender
    //         );
    //     }
    //     gateway.callContract(destinationChain, destinationAddress, payload);
    // }


    function Mint(uint256 tokenid) public payable {
        require(_exists(tokenid) && tokenInfoMap[tokenid].price <= msg.value);
        require(tokenInfoMap[tokenid].mintable);
        require(balanceOf(msg.sender,tokenid) < 1);
        (bool success, ) = tokenInfoMap[tokenid].splitterContract.call{ value: msg.value }("");
            require(success);
        _mint(msg.sender, tokenid, 1, "");
    }

    function _exists(uint256 tokenId) internal view returns(bool){
        return tokenId <= tokenID.current();
    }

    // Function to make Insertions , Updates and Deletions to our Tableland Tables 
    /// @notice Function to make Insertions , Updates and Deletions to our Tableland Tables 
    /// @dev retrieves the value of the tableID and the statement to execute on the table 
    function runSQL(uint256 tableID, string memory statement) private{
         tablelandContract.runSQL(
            address(this),
            tableID,
            statement        
        );
    }

    /// @notice Setting the tableland gateway prefix 
    /// @dev only for tableland updates
    function setTableURI(string memory baseURI) public {
        onlyOwner(msg.sender);
        _baseURIString = baseURI;
    }

    function onlyOwner(address sender) internal view{
        require(sender == owner);
    }

    /// @notice Overriten URI function of the ERC1155 to fit Tableland based NFTs
    /// @dev retrieves the value of the tokenID
    /// @return the tokenURI link for the specific NFT metadata
	function uri(uint256 tokenId) public view virtual override returns (string memory) {
		require(_exists(tokenId));
		return string(
			abi.encodePacked(
                _baseURIString,
				'SELECT%20',
				'json_object%28%27tokenID%27%2C',
				mainTable,
				'%2EtokenID%2C%27name%27%2Cname%2C%27files%27%2Cfiles%2C%27description%27%2Cdescription%2C%27image%27%2Cimage%2C%27attributes%27%2Cjson_group_array%28json_object%28%27trait_type%27%2Ctrait_type%2C%27value%27%2Cvalue%29%29%29%20',
				'FROM%20',
				mainTable,
				'%20JOIN%20',
				attributeTable,
				'%20WHERE%20',
				mainTable,
				'%2EtokenID%20%3D%20',
				attributeTable,
				'%2EtokenID%20and%20',
				mainTable,
				'%2EtokenID%3D'
                ,Strings.toString(tokenId), '&mode=list'
			)
		);
	}

    function returnTables() public view returns(string memory){
        return string.concat(mainTable," ",attributeTable," ",subNFT_table," ",submission_table);
    }


    /// @notice returns the total number of minted NFTs
    function totalSupply() public view returns (uint256){
        return tokenID.current();
    }    

    /// @notice withdraw function of the contract funds only by the contract owner
    function withdraw() public payable {
        onlyOwner(msg.sender);
        address payable to = payable(msg.sender);
        to.transfer(address(this).balance);
    }
}
