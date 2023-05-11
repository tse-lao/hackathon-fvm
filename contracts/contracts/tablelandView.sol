// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import { AxelarExecutable } from "@axelar-network/axelar-gmp-sdk-solidity/contracts/executable/AxelarExecutable.sol";
import { IAxelarGateway } from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol";
import { IAxelarGasService } from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@tableland/evm/contracts/utils/SQLHelpers.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

/** @title DB_NFT. */
/// @author Nick Lionis (github handle : nijoe1 )
/// @notice Use this contract for creating Decentralized datassets with others and sell them as NFTs
/// All the data inside the tables are pointing on an IPFS CID.
contract tablelandView is  AxelarExecutable ,Ownable{

    string main;
    string attribute;
    string contribution;
    uint256 mainID;
    uint256 attributeID;
    uint256 contributionID;

    string[] private createStatements;
 
    IAxelarGasService public immutable gasService;
    IERC1155 public DB_NFT;
    string  private _baseURIString;

    string private constant MAIN_TABLE_PREFIX = "file_main";
    string private constant MAIN_SCHEMA = "tokenID text, dataFormatCID text, dbName text, description text, dbCID text, minimumRowsOnSubmission text";

    string private constant ATTRIBUTE_TABLE_PREFIX = "file_attribute";
    string private constant ATTRIBUTE_SCHEMA = "tokenID text, trait_type text, value text";

    string private constant SUBMISSION_TABLE_PREFIX = "data_contribution";
    string private constant SUBMISSION_SCHEMA = "tokenID text, dataCID text, rows text, creator text"; 
// ["data_contribution_80001_6068","file_main_80001_6069","file_attribute_80001_6070"]

// 0xBF62ef1486468a6bd26Dd669C06db43dEd5B849B,0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6
     constructor(address gateway_, address gasReceiver_) AxelarExecutable(gateway_) {
        
        gasService = IAxelarGasService(gasReceiver_);
        _baseURIString = "https://testnets.tableland.network/api/v1/query?statement=";
     }

    function setContract(IERC1155 nft) public onlyOwner{
        DB_NFT = IERC1155(nft);
    }

    function setTableInfo(string memory contributionName,uint256 contributionId,string memory mainName,uint256 mainId,string memory attributeName, uint256 attributeId) public onlyOwner{ 
        contribution = contributionName;
        main = mainName;
        attribute = attributeName;
        contributionID = contributionId;
        mainID = mainId;
        attributeID = attributeId;
    }


    function toUpdate(string memory prefix, uint256 tableID,string memory set, string memory filter)public view returns(string memory){
        return SQLHelpers.toUpdate(prefix,tableID, set, filter);
    }
    
    function insertMainStatement(uint256 tokenid ,string memory dataFormatCID, string memory dbName,string memory description,string memory dbCID,uint256 minimumRowsOnSubmission) public view returns(string memory){
    return
    SQLHelpers.toInsert(
            MAIN_TABLE_PREFIX,
            mainID,
            "tokenID, dataFormatCID, dbName, description, dbCID, minimumRowsOnSubmission",
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
                SQLHelpers.quote(Strings.toString(minimumRowsOnSubmission))
            )
    );
    }

    function insertSubmissionStatement(uint256 tokenid ,string memory dataCID, uint256 rows,address creator) public view returns(string memory){
        return   SQLHelpers.toInsert(
                    SUBMISSION_TABLE_PREFIX,
                    contributionID,
                    "tokenID, dataCID, rows, creator",
                    string.concat(
                        SQLHelpers.quote(Strings.toString(tokenid)),
                        ",",
                        SQLHelpers.quote(dataCID),
                        ",",
                        SQLHelpers.quote(Strings.toString(rows)),
                        ",",
                        SQLHelpers.quote(Strings.toHexString(creator))
                    )
                );
    }

    function insertAttributeStatement(uint256 tokenid ,string memory trait_type, string memory value) public view returns(string memory){
        return  SQLHelpers.toInsert(
                ATTRIBUTE_TABLE_PREFIX,
                attributeID,
                "tokenID, trait_type, value",
                string.concat(
                    SQLHelpers.quote((Strings.toString(tokenid))),
                    ",",
                    SQLHelpers.quote(trait_type),
                    ",",
                    SQLHelpers.quote(value)
                )
            );
    }

        /// @notice Overriten URI function of the ERC1155 to fit Tableland based NFTs
    /// @dev retrieves the value of the tokenID
    /// @return the tokenURI link for the specific NFT metadata
	function uri(uint256 tokenId) public view returns (string memory) {
		return string(
			abi.encodePacked(
                _baseURIString,
				'SELECT%20',
				'json_object%28%27tokenID%27%2C',
				main,
				'%2EtokenID%2C%27dbName%27%2CdbName%2C%27dbCID%27%2CdbCID%2C%27description%27%2Cdescription%2C%27dataFormatCID%27%2CdataFormatCID%2C%27attributes%27%2Cjson_group_array%28json_object%28%27trait_type%27%2Ctrait_type%2C%27value%27%2Cvalue%29%29%29%20',
				'FROM%20',
				main,
				'%20JOIN%20',
				attribute,
				'%20WHERE%20',
				main,
				'%2EtokenID%20%3D%20',
				attribute,
				'%2EtokenID%20and%20',
				main,
				'%2EtokenID%3D'
                ,Strings.toString(tokenId), '&mode=list'
			)
		);
	}

        /// @notice Setting the tableland gateway prefix 
    /// @dev only for tableland updates
    function setTableURI(string memory baseURI) public onlyOwner {
        _baseURIString = baseURI;
    }


    function executeCrossChainBacalhauJob(
        string calldata destinationChain,
        string calldata destinationAddress,
        uint256 tokenId,
        string memory _spec,
        string memory jobId
    ) public payable {
        require(DB_NFT.balanceOf(msg.sender, tokenId) > 0);
        bytes memory payload = abi.encode(tokenId, _spec, jobId, msg.sender);
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

    function createCrossChainBounty(
        string calldata destinationChain,
        string calldata destinationAddress,
        uint256 tokenId,
        string memory _spec,
        string memory jobId
    ) public payable {
        require(DB_NFT.balanceOf(msg.sender, tokenId) > 0);
        bytes memory payload = abi.encode(tokenId, _spec, jobId, msg.sender);
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

    function createCrossChainDealRequest(
        string calldata destinationChain,
        string calldata destinationAddress,
        uint256 tokenId,
        string memory _spec,
        string memory jobId
    ) public payable {
        require(DB_NFT.balanceOf(msg.sender, tokenId) > 0);
        bytes memory payload = abi.encode(tokenId, _spec, jobId, msg.sender);
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
}