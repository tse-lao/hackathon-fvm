// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import {AxelarExecutable} from '@axelar-network/axelar-gmp-sdk-solidity/contracts/executable/AxelarExecutable.sol';
import {IAxelarGateway} from '@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol';
import {IAxelarGasService} from '@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Strings.sol';
import '@tableland/evm/contracts/utils/SQLHelpers.sol';
import "@tableland/evm/contracts/utils/TablelandDeployments.sol";
import '@openzeppelin/contracts/token/ERC1155/IERC1155.sol';

/** @title DB_NFT. */
/// @author Nick Lionis (github handle : nijoe1 )
/// @notice Use this contract for creating Decentralized datassets with others and sell them as NFTs
/// All the data inside the tables are pointing on an IPFS CID.
contract TablelandStorage is AxelarExecutable, Ownable {
    ITablelandTables private tablelandContract;

    // address contractManager;

    string main;
    string attribute;
    string contribution;
    uint256 mainID;
    uint256 attributeID;
    uint256 contributionID;

    string[] private createStatements;
    string[] public tables;
    uint256[] private tableIDs;

    IAxelarGasService public immutable gasService;
    IERC1155 public DB_NFT;
    string private _baseURIString;

    string private constant MAIN_TABLE_PREFIX = 'file_main';
    string private constant MAIN_SCHEMA =
        'tokenID text, dataFormatCID text, dbName text, description text, dbCID text, minimumRowsOnSubmission text, requiredRows text, piece_cid text';

    string private constant ATTRIBUTE_TABLE_PREFIX = 'file_attribute';
    string private constant ATTRIBUTE_SCHEMA =
        'tokenID text, trait_type text, value text';

    string private constant SUBMISSION_TABLE_PREFIX = 'data_contribution';
    string private constant SUBMISSION_SCHEMA =
        'tokenID text, dataCID text, rows text, creator text';

    // ["data_contribution_80001_6068","file_main_80001_6069","file_attribute_80001_6070"]

    // "0xBF62ef1486468a6bd26Dd669C06db43dEd5B849B","0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6"
    constructor(
        address gateway_,
        address gasReceiver_
    ) AxelarExecutable(gateway_) {
        gasService = IAxelarGasService(gasReceiver_);
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

        setTableInfo(
            tables[0],
            tableIDs[0],
            tables[1],
            tableIDs[1],
            tables[2],
            tableIDs[2]
        );
        _baseURIString = 'https://testnets.tableland.network/api/v1/query?statement=';
    }

    function setContract(IERC1155 nft) public onlyOwner {
        DB_NFT = IERC1155(nft);
    }

    function setTableInfo(
        string memory contributionName,
        uint256 contributionId,
        string memory mainName,
        uint256 mainId,
        string memory attributeName,
        uint256 attributeId
    ) internal {
        contribution = contributionName;
        main = mainName;
        attribute = attributeName;
        contributionID = contributionId;
        mainID = mainId;
        attributeID = attributeId;
    }

    // modifier onlyDBNFT() {
    //     if (!(contractManager == address(0))) {
    //         revert();
    //     }
    //     _;
    // }

    // function setContractManager(address manager) public onlyOwner {
    //     contractManager = manager;
    // }

    function toUpdate(
        string memory set,
        string memory filter
    ) public onlyOwner{
        mutate(mainID , SQLHelpers.toUpdate(MAIN_TABLE_PREFIX, mainID, set, filter));
    }

    function insertMainStatement(
        uint256 tokenid,
        string memory dataFormatCID,
        string memory dbName,
        string memory description,
        string memory dbCID,
        uint256 minimumRowsOnSubmission,
        uint256 requiredRows,
        string memory piece_cid
    ) public onlyOwner{
        
             mutate(mainID, SQLHelpers.toInsert(
                MAIN_TABLE_PREFIX,
                mainID,
                'tokenID, dataFormatCID, dbName, description, dbCID, minimumRowsOnSubmission, requiredRows, piece_cid',
                string.concat(
                    SQLHelpers.quote(Strings.toString(tokenid)),
                    ',',
                    SQLHelpers.quote(dataFormatCID),
                    ',',
                    SQLHelpers.quote(dbName),
                    ',',
                    SQLHelpers.quote(description),
                    ',',
                    SQLHelpers.quote(dbCID),
                    ',',
                    SQLHelpers.quote(Strings.toString(minimumRowsOnSubmission)),
                    ',',
                    SQLHelpers.quote(Strings.toString(requiredRows)),
                    ',',
                    SQLHelpers.quote(piece_cid)
                )
            ));
    }


    function mutate(uint256 tableId, string memory statement) internal {
        tablelandContract.mutate(address(this), tableId, statement);
    }

    function insertSubmissionStatement(
        uint256 tokenid,
        string memory dataCID,
        uint256 rows,
        address creator
    ) public  onlyOwner{
        
            mutate(contributionID, SQLHelpers.toInsert(
                SUBMISSION_TABLE_PREFIX,
                contributionID,
                'tokenID, dataCID, rows, creator',
                string.concat(
                    SQLHelpers.quote(Strings.toString(tokenid)),
                    ',',
                    SQLHelpers.quote(dataCID),
                    ',',
                    SQLHelpers.quote(Strings.toString(rows)),
                    ',',
                    SQLHelpers.quote(Strings.toHexString(creator))
                )
            ));
    }

    function insertAttributeStatement(
        uint256 tokenid,
        string memory trait_type,
        string memory value
    ) public onlyOwner{
        mutate(attributeID,
            SQLHelpers.toInsert(
                ATTRIBUTE_TABLE_PREFIX,
                attributeID,
                'tokenID, trait_type, value',
                string.concat(
                    SQLHelpers.quote((Strings.toString(tokenid))),
                    ',',
                    SQLHelpers.quote(trait_type),
                    ',',
                    SQLHelpers.quote(value)
                )
            ));
    }

    /// @notice Overriten URI function of the ERC1155 to fit Tableland based NFTs
    /// @dev retrieves the value of the tokenID
    /// @return the tokenURI link for the specific NFT metadata
    function uri(uint256 tokenId) public view returns (string memory) {
        return
            string(
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
                    '%2EtokenID%3D',
                    Strings.toString(tokenId),
                    '&mode=list'
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
        string memory input,
        string memory _specStart,
        string memory _specEnd,
        string memory jobId
    ) public payable {
        bytes memory payload = abi.encode(_specStart,input,_specEnd, jobId, msg.sender);
        if (msg.value > 0) {
            gasService.payNativeGasForContractCall{value: msg.value}(
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
        string memory piece_cid,
        bytes memory piece_cid_bytes,
        string memory location_ref,
        uint256 bountyReward,
        int64 minAcceptedDealDuration,
        uint256 size
    ) public payable {
        bytes memory payload = abi.encode(
            piece_cid,
            piece_cid_bytes,
            location_ref,
            bountyReward,
            minAcceptedDealDuration,
            size
        );
        if (msg.value > 0) {
            gasService.payNativeGasForContractCall{value: msg.value}(
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
        bytes memory piece_cid,
        string memory label,
        uint64 piece_size,
        int64 end_epoch,
        string memory location_ref,
        uint64 car_size
    ) public payable {
        bytes memory payload = abi.encode(piece_cid, label, piece_size, end_epoch, msg.sender,location_ref,car_size);
        if (msg.value > 0) {
            gasService.payNativeGasForContractCall{value: msg.value}(
                address(this),
                destinationChain,
                destinationAddress,
                payload,
                msg.sender
            );
        }
        gateway.callContract(destinationChain, destinationAddress, payload);
    }

    // Returns the address that signed a given string message
    function verifyString(
        string memory message,
        uint8 v,
        bytes32 r,
        bytes32 s,
        address pkp
    ) public pure returns (bool res) {
        // The message header; we will fill in the length next
        string memory header = '\x19Ethereum Signed Message:\n000000';
        uint256 lengthOffset;
        uint256 length;
        assembly {
            // The first word of a string is its length
            length := mload(message)
            // The beginning of the base-10 m essage length in the prefix
            lengthOffset := add(header, 57)
        }
        // Maximum length we support
        require(length <= 999999);
        // The length of the message's length in base-10
        uint256 lengthLength = 0;
        // The divisor to get the next left-most message length digit
        uint256 divisor = 100000;
        // Move one digit of the message length to the right at a time
        while (divisor != 0) {
            // The place value at the divisor
            uint256 digit = length / divisor;
            if (digit == 0) {
                // Skip leading zeros
                if (lengthLength == 0) {
                    divisor /= 10;
                    continue;
                }
            }
            // Found a non-zero digit or non-leading zero digit
            lengthLength++;
            // Remove this digit from the message length's current value
            length -= digit * divisor;
            // Shift our base-10 divisor over
            divisor /= 10;
            // Convert the digit to its ASCII representation (man ascii)
            digit += 0x30;
            // Move to the next character and write the digit
            lengthOffset++;
            assembly {
                mstore8(lengthOffset, digit)
            }
        }
        // The null string requires exactly 1 zero (unskip 1 leading 0)
        if (lengthLength == 0) {
            lengthLength = 1 + 0x19 + 1;
        } else {
            lengthLength += 1 + 0x19;
        }
        // Truncate the tailing zeros from the header
        assembly {
            mstore(header, lengthLength)
        }
        // Perform the elliptic curve recover operation
        bytes32 check = keccak256(abi.encodePacked(header, message));
        return ecrecover(check, v, r, s) == pkp;
    }

    function sendViaCall(address payable _to) public payable {
        // Call returns a boolean value indicating success or failure.
        // This is the current recommended method to use.
        (bool sent, bytes memory data) = _to.call{value: msg.value}('');
        require(sent, 'Failed to send Ether');
    }
}
