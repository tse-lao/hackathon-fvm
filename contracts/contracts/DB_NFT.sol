// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;
import { AxelarExecutable } from "@axelar-network/axelar-gmp-sdk-solidity/contracts/executable/AxelarExecutable.sol";
import { IAxelarGateway } from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol";
import { IAxelarGasService } from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol";
import "@tableland/evm/contracts/utils/TablelandDeployments.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@tableland/evm/contracts/utils/SQLHelpers.sol";


/** @title DB_NFT. */
/// @author Nick Lionis (github handle : nijoe1 )
/// @notice Use this contract for creating Decentralized datassets with others and sell them as NFTs
/// All the data inside the tables are pointing on an IPFS CID.
contract DB_NFT is ERC1155 , AxelarExecutable {

    ITablelandTables private tablelandContract;

    using Counters for Counters.Counter;
    string private value;
    string private sourceChain;
    string private sourceAddress;
    IAxelarGasService public immutable gasService;

    struct tokenInfo{
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
  
    string  private _baseURIString;

    string private constant MAIN_TABLE_PREFIX = "file_main";
    string private constant MAIN_SCHEMA = "tokenID text, dataFormatCID text, DBname text, description text, metadataCID text";

    string private constant ATTRIBUTE_TABLE_PREFIX = "file_attribute";
    string private constant ATTRIBUTE_SCHEMA = "tokenID text, trait_type text, value text";

    string private constant SUBMISSION_TABLE_PREFIX = "data_contribution";
    string private constant SUBMISSION_SCHEMA = "tokenID text, metadataCID text, rows text, creator text";

    string[] private createStatements;
    string[] public tables;
    uint256[] private tableIDs;
    address public owner;
    // Gateway = 0xBF62ef1486468a6bd26Dd669C06db43dEd5B849B & gasReceiver = 0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6
    // 0xBF62ef1486468a6bd26Dd669C06db43dEd5B849B,0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6
    constructor(address gateway_, address gasReceiver_) ERC1155("") AxelarExecutable(gateway_) {
        owner = msg.sender;
        gasService = IAxelarGasService(gasReceiver_);
        _baseURIString = "https://testnets.tableland.network/api/v1/query?statement=";

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
        tokenInfoMap[ID].category = category;
        insertMain(ID,dataFormatCID,DBname,description,category,msg.sender,"CID will get added after the DB is fullfilled and the DB NFT creation");
    }

    function submitData(uint256 tokenId, string memory metadataCID, uint256 rows) public{
        // require(ONLUpkpaddress);
        submissionsNumberByID[tokenId][msg.sender] = submissionsNumberByID[tokenId][msg.sender] + rows;
        if(tokenInfoMap[tokenId].remainingRows >= rows){
            tokenInfoMap[tokenId].remainingRows = tokenInfoMap[tokenId].remainingRows - rows;
        }
        else{
            tokenInfoMap[tokenId].remainingRows = 0;
        }
        mutate(tableIDs[0],insertSubmissionStatement(tokenId ,metadataCID,rows,msg.sender));
    }

    // We also need to call this function from the PKP because we need to set a fair royaltiesAddress splitter contract
    function createDB_NFT(uint256 tokenId, string memory metadataCID , uint256 mintPrice, address royaltiesAddress) public {
        // require(msg.sender == tokenInfoMap[tokenId].creator && tokenInfoMap[tokenId].remainingRows == 0); ADD EXISTS REQUIRE
        require(!tokenInfoMap[tokenId].mintable && tokenInfoMap[tokenId].remainingRows == 0);
        tokenInfoMap[tokenId].mintable = true;
        tokenInfoMap[tokenId].price = mintPrice;
        tokenInfoMap[tokenId].splitterContract = royaltiesAddress;
        string memory set = string.concat("metadataCID='",metadataCID,"'");
        string memory filter = string.concat("tokenID=",Strings.toString(tokenId));
        mutate(tableIDs[1],SQLHelpers.toUpdate(MAIN_TABLE_PREFIX,tableIDs[1], set, filter));
    }


    function executeCrossChainBacalhauJob(
        string calldata destinationChain,
        string calldata destinationAddress,
        uint256 tokenId,
        string memory _spec
    ) external payable {
        require(balanceOf(msg.sender, tokenId) > 0);
        bytes memory payload = abi.encode(tokenId, _spec, msg.sender);
        if (msg.value > 0) {
            gasService.payNativeGasForContractCall{ value: msg.value }(
                address(this),
                destinationChain,
                destinationAddress,
                payload,
                msg.sender
            );
        }
        gateway.callContract(destinationChain, destinationAddress, payload);
    }

    function mint(uint256 tokenid) public payable {
        require(_exists(tokenid) && tokenInfoMap[tokenid].price <= msg.value);
        require(tokenInfoMap[tokenid].mintable);
        require(balanceOf(msg.sender,tokenid) < 1);
        // (bool success, ) = tokenInfoMap[tokenid].splitterContract.call{ value: msg.value }("");
        //     require(success);
        _mint(msg.sender, tokenid, 1, "");
    }

    function _exists(uint256 tokenId) internal view returns(bool){
        return tokenId <= tokenID.current();
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
        // "tokenID text, dataFormatCID text, DBname text, description text, metadataCID text";
		return string(
			abi.encodePacked(
                _baseURIString,
				'SELECT%20',
				'json_object%28%27tokenID%27%2C',
				tables[1],
				'%2EtokenID%2C%27DBname%27%2CDBname%2C%27metadataCID%27%2CmetadataCID%2C%27description%27%2Cdescription%2C%27dataFormatCID%27%2CdataFormatCID%2C%27attributes%27%2Cjson_group_array%28json_object%28%27trait_type%27%2Ctrait_type%2C%27value%27%2Cvalue%29%29%29%20',
				'FROM%20',
				tables[1],
				'%20JOIN%20',
				tables[2],
				'%20WHERE%20',
				tables[1],
				'%2EtokenID%20%3D%20',
				tables[2],
				'%2EtokenID%20and%20',
				tables[1],
				'%2EtokenID%3D'
                ,Strings.toString(tokenId), '&mode=list'
			)
		);
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

    function insertMainStatement(uint256 tokenid ,string memory dataFormatCID, string memory DBname,string memory description,string memory metadataCID) internal view returns(string memory){
    return
    SQLHelpers.toInsert(
            MAIN_TABLE_PREFIX,
            tableIDs[1],
            "tokenID, dataFormatCID, DBname, description, metadataCID",
            string.concat(
                SQLHelpers.quote(Strings.toString(tokenid)),
                ",",
                SQLHelpers.quote(dataFormatCID),
                ",",
                SQLHelpers.quote(DBname),
                ",",
                SQLHelpers.quote(description),
                ",",
                SQLHelpers.quote(metadataCID)
            )
    );
    }

    function insertSubmissionStatement(uint256 tokenid ,string memory metadataCID, uint256 rows,address creator) internal view returns(string memory){
    return
    SQLHelpers.toInsert(
            SUBMISSION_TABLE_PREFIX,
            tableIDs[0],
            "tokenID, metadataCID, rows, creator",
            string.concat(
                SQLHelpers.quote(Strings.toString(tokenid)),
                ",",
                SQLHelpers.quote(metadataCID),
                ",",
                SQLHelpers.quote(Strings.toString(rows)),
                ",",
                SQLHelpers.quote(Strings.toHexString(creator))
            )
    );
    }

    function insertAttributeStatement(uint256 tokenid ,string memory trait_type, string memory value1) internal view returns(string memory){
        return  SQLHelpers.toInsert(
                ATTRIBUTE_TABLE_PREFIX,
                tableIDs[2],
                "tokenID, trait_type, value",
                string.concat(
                    SQLHelpers.quote((Strings.toString(tokenid))),
                    ",",
                    SQLHelpers.quote(trait_type),
                    ",",
                    SQLHelpers.quote(value1)
                )
            );
    }

    function insertMain(uint256 ID, string memory dataFormatCID, string memory DBname, string memory description, string memory category, address sender, string memory metadataCID) private{ 
        mutate(tableIDs[1],insertMainStatement(ID,dataFormatCID,DBname,description,metadataCID));
        mutate(tableIDs[2],insertAttributeStatement(ID ,"category", category));
        mutate(tableIDs[2],insertAttributeStatement(ID ,"creator", Strings.toHexString(sender)));
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
}
