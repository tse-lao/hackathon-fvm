// SPDX-License-Identifier: MIT
pragma solidity >=0.8.17;
import "hardhat/console.sol";
import { AxelarExecutable } from "@axelar-network/axelar-gmp-sdk-solidity/contracts/executable/AxelarExecutable.sol";
import { IAxelarGateway } from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol";
import { IAxelarGasService } from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol";
import "@tableland/evm/contracts/utils/TablelandDeployments.sol";
import "@tableland/evm/contracts/utils/SQLHelpers.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./LilypadEventsUpgradeable.sol";
import "./LilypadCallerInterface.sol";

contract crossChainBacalhauJobs is AxelarExecutable , LilypadCallerInterface, Ownable  {
    address public bridgeAddress;
    LilypadEventsUpgradeable bridge;
    uint256 public lilypadFee; //=30000000000000000;

    IAxelarGasService public immutable gasService;

    mapping(address => uint) public userFunds;
    mapping(string => bool) private allowedSourceChains;
    mapping(string => bool) private allowedSourceAddresses;
    mapping(string => string) private chainToAddress;

    ITablelandTables private tablelandContract;
    uint256 tableID;
    string public tableName;
    string private constant COMPUTATION_TABLE_PREFIX = "computation";
    string private constant COMPUTATION_SCHEMA = "tokenID text, spec text, jobId text, resultCID text, creator text";

    // Gateway = 0xe432150cce91c13a887f7D836923d5597adD8E31 & gasReceiver = 0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6
    // lillypad bridge = 0x489656E4eDDD9c88F5Fe863bDEd9Ed0Dc29B224c,0xe432150cce91c13a887f7D836923d5597adD8E31,0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6
    constructor(address _bridgeContractAddress, address gateway_, address gasReceiver_) AxelarExecutable(gateway_) {

        gasService = IAxelarGasService(gasReceiver_);

        bridgeAddress = _bridgeContractAddress;
        bridge = LilypadEventsUpgradeable(_bridgeContractAddress);
        uint fee = bridge.getLilypadFee();
        lilypadFee = fee;

        tablelandContract = TablelandDeployments.get();
        tableID = tablelandContract.create(
            address(this),
            SQLHelpers.toCreateFromSchema(COMPUTATION_SCHEMA, COMPUTATION_TABLE_PREFIX)
        );
        tableName = SQLHelpers.toNameFromId(COMPUTATION_TABLE_PREFIX, tableID);
    }

    function setBridgeAddress(address _newAddress) public onlyOwner {
      bridgeAddress= _newAddress;
    }

    function setLPEventsAddress(address _eventsAddress) public onlyOwner {
        bridge = LilypadEventsUpgradeable(_eventsAddress);
    }

    function getLilypadFee() external {
        lilypadFee = bridge.getLilypadFee(); 
    }

    function submitFunds() public payable{
        userFunds[msg.sender] = userFunds[msg.sender] + msg.value;
    }

    function withdrawFunds() public{
        require(userFunds[msg.sender] > 0);
        address payable to = payable(msg.sender);
        to.transfer(userFunds[msg.sender]);
    }

    function executeJOB(uint256 tokenID, string memory _spec, address sender) internal {
        require(userFunds[sender] >= lilypadFee, "Not enough to run Lilypad job");
        // TODO: spec -> do proper json encoding, look out for quotes in _prompt
        uint id = bridge.runLilypadJob{value: lilypadFee}(address(this), _spec, uint8(LilypadResultType.CID));
        require(id > 0, "job didn't return a value");
        computationInsertion(tokenID, _spec, id, sender);
        mutate(tableID,computationInsertion(tokenID, _spec, id, sender));
    }


    function lilypadFulfilled(address _from, uint _jobId, LilypadResultType _resultType, string calldata _result) external override {
        //need some checks here that it a legitimate result
        require(_from == address(bridge)); //really not secure
        require(_resultType == LilypadResultType.CID);
        string memory set = string.concat("resultCID='",_result,"'");
        string memory filter = string.concat("jobId=",Strings.toString(_jobId));
        mutate(tableID,SQLHelpers.toUpdate(COMPUTATION_TABLE_PREFIX,tableID, set, filter));
    }

    function lilypadCancelled(address _from, uint _jobId, string calldata _errorMsg) external override {
        require(_from == address(bridge)); //really not secure
        string memory set = string.concat("resultCID='",_errorMsg,"'");
        string memory filter = string.concat("jobId=",Strings.toString(_jobId));
        mutate(tableID,SQLHelpers.toUpdate(COMPUTATION_TABLE_PREFIX,tableID, set, filter));
    }

    // Handles calls created by setAndSend. Updates this contract's value
    function _execute(
        string calldata sourceChain_,
        string calldata sourceAddress_,
        bytes calldata payload_
    ) internal override {
        require(allowedSourceAddresses[sourceAddress_] && allowedSourceChains[sourceChain_]);
        string memory _spec;
        uint256 tokenId;
        address sender;
        (tokenId, _spec, sender) = abi.decode(payload_, (uint256, string, address));
        executeJOB(tokenId, _spec, sender);
    }

    function addSourceChains(string memory new_sourceChain, string memory new_sourceAddress) public onlyOwner{
        chainToAddress[new_sourceChain] = new_sourceAddress;
        allowedSourceAddresses[new_sourceAddress] = true;
        allowedSourceChains[new_sourceChain] = true;
    }

    function computationInsertion(uint256 tokenId, string memory _spec, uint256 jobId, address creator) internal view returns(string memory){
        return SQLHelpers.toInsert(
            COMPUTATION_TABLE_PREFIX,
            tableID,
            "tokenID, spec, jobId, resultCID, creator",
            string.concat(
                SQLHelpers.quote(Strings.toString(tokenId)),
                ",",
                SQLHelpers.quote(_spec),
                ",",
                SQLHelpers.quote(Strings.toString(jobId)),
                ",",
                SQLHelpers.quote("pending"),
                ",",
                SQLHelpers.quote(Strings.toHexString(creator))
            )
        );
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