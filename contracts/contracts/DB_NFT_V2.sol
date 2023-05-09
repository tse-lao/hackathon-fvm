// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "@tableland/evm/contracts/utils/TablelandDeployments.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@tableland/evm/contracts/utils/SQLHelpers.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./interfaces/ITablelandView.sol";


/** @title DB_NFT. */
/// @author Nick Lionis (github handle : nijoe1 )
/// @notice Use this contract for creating Decentralized datassets with others and sell them as NFTs
/// All the data inside the tables are pointing on an IPFS CID.
contract DB_NFT_V2 is ERC1155 , Ownable {

    ITablelandTables private tablelandContract;
    ITablelandView private tablelandView;
    using Counters for Counters.Counter;
    string private value;
    string private sourceChain;
    string private sourceAddress;

    struct tokenInfo{
        address splitterContract;
        uint256 price;
        uint256 requiredRows;
        uint256 remainingRows;
        bool mintable;
    }
    
    Counters.Counter private tokenID;

    mapping(uint256 => tokenInfo) public tokenInfoMap;

    mapping(uint256 => mapping (address => uint256))  private submissionsNumberByID;
  
    string  private _baseURIString;

    string private constant MAIN_TABLE_PREFIX = "file_main";
    string private constant MAIN_SCHEMA = "tokenID text, dataFormatCID text, DBname text, description text, metadataCID text";

    string private constant ATTRIBUTE_TABLE_PREFIX = "file_attribute";
    string private constant ATTRIBUTE_SCHEMA = "tokenID text, trait_type text, value text";

    string private constant SUBMISSION_TABLE_PREFIX = "data_contribution";
    string private constant SUBMISSION_SCHEMA = "tokenID text, metadataCID text, rows text, creator text"; 

    string[] private createStatements;
    string[] public tables;
    uint256[] public tableIDs;
    address public PKP;
    // Gateway = 0xBF62ef1486468a6bd26Dd669C06db43dEd5B849B & gasReceiver = 0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6
    // 0xBF62ef1486468a6bd26Dd669C06db43dEd5B849B,0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6
    constructor(ITablelandView tablelandview) ERC1155("") {
        tablelandView = tablelandview;
        tablelandContract = TablelandDeployments.get();

        createStatements.push(SQLHelpers.toCreateFromSchema(SUBMISSION_SCHEMA, SUBMISSION_TABLE_PREFIX));
        createStatements.push(SQLHelpers.toCreateFromSchema(MAIN_SCHEMA, MAIN_TABLE_PREFIX));
        createStatements.push(SQLHelpers.toCreateFromSchema(ATTRIBUTE_SCHEMA, ATTRIBUTE_TABLE_PREFIX));

        tableIDs = tablelandContract.create(
            address(this),
            createStatements
        );

        tables.push(SQLHelpers.toNameFromId(SUBMISSION_TABLE_PREFIX, tableIDs[0]));
        tables.push(SQLHelpers.toNameFromId(MAIN_TABLE_PREFIX, tableIDs[1]));
        tables.push(SQLHelpers.toNameFromId(ATTRIBUTE_TABLE_PREFIX, tableIDs[2]));
    }

    function RequestDB(string memory dataFormatCID , string memory DBname , string memory description , string memory category, uint256 requiredRows) public {
        // REQUIRE MORE THAN 1 ROWS
        tokenID.increment();
        uint256 ID = tokenID.current();
        tokenInfoMap[ID].requiredRows = requiredRows;
        tokenInfoMap[ID].remainingRows = requiredRows;
        string memory temp = tablelandView.insertMainStatement(ID,dataFormatCID,DBname,description,"CID will get added after the DB is fullfilled and the DB NFT creation");
        mutate(tableIDs[1],temp);
        temp = tablelandView.insertAttributeStatement(ID ,"category", category);
        mutate(tableIDs[2],temp);
        temp = tablelandView.insertAttributeStatement(ID ,"creator", Strings.toHexString(msg.sender));
        mutate(tableIDs[2],temp);
    }

    function submitData(uint256 tokenId, string memory metadataCID, uint256 rows) public{
        // onlyPKP(msg.sender);        
        submissionsNumberByID[tokenId][msg.sender] = submissionsNumberByID[tokenId][msg.sender] + rows;
        if(tokenInfoMap[tokenId].remainingRows >= rows){
            tokenInfoMap[tokenId].remainingRows = tokenInfoMap[tokenId].remainingRows - rows;
        }
        else{
            tokenInfoMap[tokenId].remainingRows = 0;
        }
        mutate(tableIDs[0],tablelandView.insertSubmissionStatement(tokenId ,metadataCID,rows,msg.sender));
    }

    // We also need to call this function from the PKP because we need to set a fair royaltiesAddress splitter contract
    function createDB_NFT(uint256 tokenId, string memory metadataCID , uint256 mintPrice, address royaltiesAddress) public {
        require(_exists(tokenId));
        // onlyPKP(msg.sender);
        require(!tokenInfoMap[tokenId].mintable && tokenInfoMap[tokenId].remainingRows == 0);
        tokenInfoMap[tokenId].mintable = true;
        tokenInfoMap[tokenId].price = mintPrice;
        tokenInfoMap[tokenId].splitterContract = royaltiesAddress;
        string memory set = string.concat("metadataCID='",metadataCID,"'");
        string memory filter = string.concat("tokenID=",Strings.toString(tokenId));
        mutate(tableIDs[1],tablelandView.toUpdate(MAIN_TABLE_PREFIX,tableIDs[1], set, filter));
    }


    function getContribution(address contributor, uint256 tokenId) public view returns(uint256){
        return submissionsNumberByID[tokenId][contributor];
    }


    function mint(uint256 tokenid) public payable {
        require(_exists(tokenid) && tokenInfoMap[tokenid].price <= msg.value);
        require(tokenInfoMap[tokenid].mintable);
        require(balanceOf(msg.sender,tokenid) < 1);
        address payable to = payable(tokenInfoMap[tokenid].splitterContract);
        to.transfer(msg.value);
        _mint(msg.sender, tokenid, 1, "");
    }
     
    function onlyPKP(address sender) internal view{
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
    function totalSupply() public view returns (uint256){
        return tokenID.current();
    }    

    /// @notice withdraw function of the contract funds only by the contract owner
    function withdraw() public payable onlyOwner{
        address payable to = payable(msg.sender);
        to.transfer(address(this).balance);
    }

    function _exists(uint256 tokenId) internal view returns(bool){
        return tokenId <= tokenID.current();
    }

    function mutate(
        uint256 tableId,
        string memory statement
    ) internal {
        tablelandContract.mutate(
            address(this),
            tableId,
            statement
        );
    }

 

    function assignNewPKP(address newPKP) public onlyOwner {
        PKP = newPKP;
    }
}
