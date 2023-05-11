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
contract DB_NFT_V2 is ERC1155 , Ownable {

    ITablelandTables private tablelandContract;
    ITablelandView private tablelandView;
    using Counters for Counters.Counter;
    using EnumerableSet for EnumerableSet.UintSet;

    string private value;
    string private sourceChain;
    string private sourceAddress;

    struct tokenInfo{
        bytes commP;
        address creator;
        address splitterContract;
        uint256 price;
        uint256 requiredRows;
        uint256 remainingRows;
        uint256 minimumRowsOnSubmission;
        bool mintable;
    }
    
    Counters.Counter private tokenID;

    mapping(uint256 => tokenInfo) public tokenInfoMap;

    mapping(uint256 => mapping (address => uint256))  private submissionsNumberByID;

    mapping(string => EnumerableSet.UintSet) private submittedCIDtoTokens;
  
    string  private _baseURIString;

    string private constant MAIN_TABLE_PREFIX = "file_main";
    string private constant MAIN_SCHEMA = "tokenID text, dataFormatCID text, dbName text, description text, dbCID text, minimumRowsOnSubmission text";

    string private constant ATTRIBUTE_TABLE_PREFIX = "file_attribute";
    string private constant ATTRIBUTE_SCHEMA = "tokenID text, trait_type text, value text";

    string private constant SUBMISSION_TABLE_PREFIX = "data_contribution";
    string private constant SUBMISSION_SCHEMA = "tokenID text, dataCID text, rows text, creator text"; 

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

    function RequestDB(string memory dataFormatCID , string memory dbName , string memory description , string[] memory categories, uint256 requiredRows, uint256 minimumRowsOnSubmission) public {
        // REQUIRE MORE THAN 1 ROWS
        tokenID.increment();
        uint256 ID = tokenID.current();
        tokenInfoMap[ID].requiredRows = requiredRows;
        tokenInfoMap[ID].remainingRows = requiredRows;
        tokenInfoMap[ID].minimumRowsOnSubmission = minimumRowsOnSubmission;
        tokenInfoMap[ID].creator = msg.sender;

        mutate(tableIDs[1],tablelandView.insertMainStatement(ID,dataFormatCID,dbName,description,"CID will get added after the DB is fullfilled and the DB NFT creation",minimumRowsOnSubmission));
        mutate(tableIDs[2],tablelandView.insertAttributeStatement(ID ,"creator", Strings.toHexString(msg.sender)));
        
        ITablelandTables.Statement[] memory statements;

        for(uint256 i = 0; i < categories.length; i++){
            statements[i].statement = (tablelandView.insertAttributeStatement(ID ,"category", categories[i]));
            statements[i].tableId = tableIDs[2];
        }
        mutate(statements);
    }

    function submitData(uint256 tokenId, string memory dataCID, uint256 rows) public{
        // onlyPKP(msg.sender);       
        require(tokenInfoMap[tokenId].minimumRowsOnSubmission <= rows, "sumbit more data");
        require(!submittedCIDtoTokens[dataCID].contains(tokenId), "DB already has that CID");
        submissionsNumberByID[tokenId][msg.sender] = submissionsNumberByID[tokenId][msg.sender] + rows;
        if(tokenInfoMap[tokenId].remainingRows >= rows){
            tokenInfoMap[tokenId].remainingRows = tokenInfoMap[tokenId].remainingRows - rows;
        }
        else{
            tokenInfoMap[tokenId].remainingRows = 0;
        }
        mutate(tableIDs[0],tablelandView.insertSubmissionStatement(tokenId ,dataCID,rows,msg.sender));
    }

    // We also need to call this function from the PKP because we need to set a fair royaltiesAddress splitter contract
    function createDB_NFT(uint256 tokenId, string memory dbCID , uint256 mintPrice, address royaltiesAddress, bytes memory commP) public {
        require(_exists(tokenId));
        // onlyPKP(msg.sender);
        require(!tokenInfoMap[tokenId].mintable && tokenInfoMap[tokenId].remainingRows <= 0 && tokenInfoMap[tokenId].creator == msg.sender);
        tokenInfoMap[tokenId].mintable = true;
        tokenInfoMap[tokenId].price = mintPrice;
        tokenInfoMap[tokenId].splitterContract = royaltiesAddress;
        tokenInfoMap[tokenId].commP = commP;
        string memory set = string.concat("dbCID='",dbCID,"'");
        string memory filter = string.concat("tokenID=",Strings.toString(tokenId));
        mutate(tableIDs[1],tablelandView.toUpdate(MAIN_TABLE_PREFIX,tableIDs[1], set, filter));
    }

    // Give access to the submissions of an NFT and the NFT final DB to the contributors and to the Owner
    function hasAccess(address contributor, uint256 tokenId) public view returns(bool){
        return submissionsNumberByID[tokenId][contributor] > 0 || tokenInfoMap[tokenId].creator == contributor  || balanceOf(contributor,tokenId) > 0;
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

    function mutate(
        ITablelandTables.Statement[] memory statements 
    ) internal {
        tablelandContract.mutate(
            address(this),
            statements
        );
    }

    function assignNewPKP(address newPKP) public onlyOwner {
        PKP = newPKP;
    }
}
