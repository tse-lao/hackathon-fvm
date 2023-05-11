// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import { AxelarExecutable } from "@axelar-network/axelar-gmp-sdk-solidity/contracts/executable/AxelarExecutable.sol";
import { IAxelarGateway } from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol";
import { IAxelarGasService } from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol";
import { MarketAPI } from "@zondax/filecoin-solidity/contracts/v0.8/MarketAPI.sol";
import { CommonTypes } from "@zondax/filecoin-solidity/contracts/v0.8/types/CommonTypes.sol";
import { MarketTypes } from "@zondax/filecoin-solidity/contracts/v0.8/types/MarketTypes.sol";
import { Actor } from "@zondax/filecoin-solidity/contracts/v0.8/utils/Actor.sol";
import { Misc } from "@zondax/filecoin-solidity/contracts/v0.8/utils/Misc.sol";

/* 
Contract Usage
    Step   |   Who   |    What is happening  |   Why 
    ------------------------------------------------
    Deploy | contract owner   | contract owner deploys address is owner who can call addCID  | create contract setting up rules to follow
    AddCID | data pinners     | set up cids that the contract will incentivize in deals      | add request for a deal in the filecoin network, "store data" function
    Fund   | contract funders |  add FIL to the contract to later by paid out by deal        | ensure the deal actually gets stored by providing funds for bounty hunter and (indirect) storage provider
    Claim  | bounty hunter    | claim the incentive to complete the cycle                    | pay back the bounty hunter for doing work for the contract

*/
contract DealRewarder is AxelarExecutable {
    IAxelarGasService public immutable gasService;

    mapping(bytes => bool) public cidSet;
    mapping(bytes => uint) public cidSizes;
    mapping(bytes => mapping(uint64 => bool)) public cidProviders;

    mapping(address => uint) public userFunds;
    mapping(string => bool) private allowedSourceChains;
    mapping(string => bool) private allowedSourceAddresses;
    mapping(string => string) private chainToAddress;

    address public owner;
    address constant CALL_ACTOR_ID = 0xfe00000000000000000000000000000000000005;
    uint64 constant DEFAULT_FLAG = 0x00000000;
    uint64 constant METHOD_SEND = 0;

   // Gateway = 0xe432150cce91c13a887f7D836923d5597adD8E31 & gasReceiver = 0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6
    // lillypad bridge = 0x489656E4eDDD9c88F5Fe863bDEd9Ed0Dc29B224c,0xe432150cce91c13a887f7D836923d5597adD8E31,0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6
    constructor(address gateway_, address gasReceiver_) AxelarExecutable(gateway_) {

        gasService = IAxelarGasService(gasReceiver_);
        owner = msg.sender;
    }

    function fund(uint64 unused) public payable {}

    function addCID(bytes calldata cidraw, uint size) public {
       require(msg.sender == owner);
       cidSet[cidraw] = true;
       cidSizes[cidraw] = size;
    }

    function policyOK(bytes memory cidraw, uint64 provider) internal view returns (bool) {
        bool alreadyStoring = cidProviders[cidraw][provider];
        return !alreadyStoring;
    }

    function authorizeData(bytes memory cidraw, uint64 provider, uint size) public {
        require(cidSet[cidraw], "cid must be added before authorizing");
        require(cidSizes[cidraw] == size, "data size must match expected");
        require(policyOK(cidraw, provider), "deal failed policy check: has provider already claimed this cid?");

        cidProviders[cidraw][provider] = true;
    }
    type FilActorId is uint64;
    function claim_bounty(uint64 deal_id) public {
        MarketTypes.GetDealDataCommitmentReturn memory commitmentRet = MarketAPI.getDealDataCommitment(deal_id);
        uint64 providerRet = MarketAPI.getDealProvider(deal_id);

        authorizeData(commitmentRet.data, providerRet, commitmentRet.size);
        
        // get dealer (bounty hunter client)
        uint64 clientRet = MarketAPI.getDealClient(deal_id);

        // send reward to client 
        send(clientRet);

        // send reward to client 
        send(clientRet);

    }

    function call_actor_id(uint64 method, uint256 value, uint64 flags, uint64 codec, bytes memory params, uint64 id) public returns (bool, int256, uint64, bytes memory) {
        (bool success, bytes memory data) = address(CALL_ACTOR_ID).delegatecall(abi.encode(method, value, flags, codec, params, id));
        (int256 exit, uint64 return_codec, bytes memory return_value) = abi.decode(data, (int256, uint64, bytes));
        return (success, exit, return_codec, return_value);
    }

    // send 1 FIL to the filecoin actor at actor_id
    function send(uint64 actorID) internal {
        bytes memory emptyParams = "";
        delete emptyParams;

        uint oneFIL = 1000000000000000000;
        Actor.callByID(CommonTypes.FilActorId.wrap(actorID), METHOD_SEND, Misc.NONE_CODEC, emptyParams, oneFIL, false);
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

    function executeJOB(uint256 tokenID, string memory _spec, address sender) internal {
        // require(userFunds[sender] >= lilypadFee, "Not enough to run Lilypad job");
        // TODO: spec -> do proper json encoding, look out for quotes in _prompt
        // uint id = bridge.runLilypadJob{value: lilypadFee}(address(this), _spec, uint8(LilypadResultType.CID));
        // require(id > 0, "job didn't return a value");
        // computationInsertion(tokenID, _spec, id, sender);
        // mutate(tableID,computationInsertion(tokenID, _spec, id, sender));
    }

    function submitFunds() public payable{
        userFunds[msg.sender] = userFunds[msg.sender] + msg.value;
    }

    function withdrawFunds() public{
        require(userFunds[msg.sender] > 0);
        address payable to = payable(msg.sender);
        to.transfer(userFunds[msg.sender]);
    }
}