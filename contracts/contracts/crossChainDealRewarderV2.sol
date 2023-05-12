// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { AxelarExecutable } from "@axelar-network/axelar-gmp-sdk-solidity/contracts/executable/AxelarExecutable.sol";
import { IAxelarGateway } from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol";
import { IAxelarGasService } from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol";
import "@tableland/evm/contracts/utils/TablelandDeployments.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@tableland/evm/contracts/utils/SQLHelpers.sol";
import "@zondax/filecoin-solidity/contracts/v0.8/utils/Actor.sol";
import "@zondax/filecoin-solidity/contracts/v0.8/MarketAPI.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./interfaces/IDealReward.sol";
import "./sendReward.sol";

contract DealRewardV2 is  IDealReward , AxelarExecutable{
    
    IAxelarGasService public immutable gasService;

    ITablelandTables private tablelandContract;


    address constant CALL_ACTOR_ID = 0xfe00000000000000000000000000000000000005;
    uint64 constant DEFAULT_FLAG = 0x00000000;
    uint64 constant METHOD_SEND = 0;

    using EnumerableSet for EnumerableSet.UintSet;
    using EnumerableSet for EnumerableSet.AddressSet;
    using Counters for Counters.Counter;

    uint256 bounty_tableID;
    string public bounty_tableName;
    string private constant BOUNTY_TABLE_PREFIX = "bounty";
    string private constant BOUNTY_SCHEMA = "piece_cid blob, piece_cidIPFS_URL text, reward text, size text, creator text, key text";

    uint256 claim_tableID;
    string public claim_tableName;
    string private constant CLAIM_TABLE_PREFIX = "claim";
    string private constant CLAIM_SCHEMA = "piece_cid blob, dealID text, client text, provider text";

    mapping(bytes => bounty) public pieceToBounty;

    mapping(bytes => mapping(uint64 => bool)) public pieceToSPs;

    mapping(address => uint) public userFunds;




    function claimInsertion(bytes memory piece_cid, uint64 dealID, uint64 client, uint64 provider) internal view returns(string memory){
        return SQLHelpers.toInsert(
            BOUNTY_TABLE_PREFIX,
            bounty_tableID,
            "piece_cid, dealID, client, provider",
            string.concat(
                string(piece_cid),
                ",",
                SQLHelpers.quote(Strings.toString(dealID)),
                ",",
                SQLHelpers.quote(Strings.toString(client)),
                ",",
                SQLHelpers.quote(Strings.toString(provider))
            )
        );
    }

    function bountyInsertion(bytes memory piece_cid, address creator, string memory key, string memory piece_cidIPFS_URL, uint256 bountyreward, uint256 size) internal view returns(string memory){
        return SQLHelpers.toInsert(
            BOUNTY_TABLE_PREFIX,
            bounty_tableID,
            "piece_cid, piece_cidIPFS_URL, reward, size",
            string.concat(
                string(piece_cid),
                ",",
                SQLHelpers.quote(piece_cidIPFS_URL),
                ",",
                SQLHelpers.quote(Strings.toString(bountyreward)),
                ",",
                SQLHelpers.quote(Strings.toString(size)),
                  ",",
                SQLHelpers.quote(Strings.toHexString(creator)),
                  ",",
                SQLHelpers.quote(key)
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

    constructor(address gateway_, address gasReceiver_) AxelarExecutable(gateway_) {

        gasService = IAxelarGasService(gasReceiver_);

        tablelandContract = TablelandDeployments.get();

        bounty_tableID = tablelandContract.create(
            address(this),
            SQLHelpers.toCreateFromSchema(BOUNTY_SCHEMA, BOUNTY_TABLE_PREFIX)
        );
        bounty_tableName = SQLHelpers.toNameFromId(BOUNTY_TABLE_PREFIX, bounty_tableID);


        claim_tableID = tablelandContract.create(
            address(this),
            SQLHelpers.toCreateFromSchema(CLAIM_SCHEMA, CLAIM_TABLE_PREFIX)
        );
        claim_tableName = SQLHelpers.toNameFromId(CLAIM_TABLE_PREFIX, claim_tableID);
    }



    /// @dev Creating a Bounty only for accepted proposals
    /// @param piece_cid: cid of the bounty
    /// @param bountyReward: reward for each client or storageProvider that will make a deal for that piece_cid
    /// @param minDealDays: minimum remaining deal accepted days for a client or SP to claim the bounty
    /// @param size: size of the file
    function createBounty(bytes memory piece_cid, address creator, string memory piece_cidIPFS_URL ,uint256 bountyReward,int64 minDealDays,uint256 size) public {
        require(pieceToBounty[piece_cid].created == false, "Bounty exists");
        bytes32 hash = keccak256(abi.encode(piece_cid,msg.sender));
        // string memory key = bytes32ToString(hash);
        bounty memory newBounty =       
        bounty({
                bountyReward: bountyReward, 
                donatedTokens: 0, 
                minDealDays: minDealDays,
                created : true
               });

        pieceToBounty[piece_cid] = newBounty;

        mutate(bounty_tableID, bountyInsertion( piece_cid, creator , key, piece_cidIPFS_URL, bountyReward, size )); 

    }

    // First string to bytes and then bytes to string to make the pieceCID 
    // look similar but now us a real string 
    // string => bytes
    // pieceCID STRING  0x00000181E2039220206B86B273FF34FCE19D6B804EFF5A3F5747ADA4EAA22F1D49C01E52DDB7875B4B
    // Bytes of pieceCID 0x307830303030303138314532303339323230323036423836423237334646333446434531394436423830344546463541334635373437414441344541413232463144343943303145353244444237383735423442
    
    // bytes of pieceCID to String and we take a string representation
    // 
    function stringToBytes(string memory input)public pure returns(bytes memory) {
        bytes memory output = bytes(input);
        return output;
    }

    function bytesToString(bytes memory output)public pure returns(string memory){
            return string(output);
    }


    /// @dev Funding a Bounty
    /// @param piece_cid: cid of the bounty to get funded
    function fundBounty(bytes memory piece_cid) public payable {
        require(pieceToBounty[piece_cid].created, "bounty does not exists");
        pieceToBounty[piece_cid].donatedTokens = pieceToBounty[piece_cid].donatedTokens + msg.value;
    }

    /// @dev Claiming a bounty: Client or SP that made a deal for a piece_cid can claim it and 
    /// @dev get rewarded  
    /// @param deal_id: deal_id to check if DAO rules are met to reward the client or SP
    function claim_bounty(uint64 deal_id) public {
        // get deal piece_cid and sizeof(piece_cid)
        bytes memory piece_cid = MarketAPI.getDealDataCommitment(deal_id).data;
        // get deal SP
        uint64 provider = MarketAPI.getDealProvider(deal_id);
        // get deal client
        uint64 client = MarketAPI.getDealClient(deal_id);
        // get deal Term ( start - end )
        int64 endOfDeal =  CommonTypes.ChainEpoch.unwrap(MarketAPI.getDealTerm(deal_id).end);
        // dealDuration represents the remaining days of the deal
        int64 dealDuration = endOfDeal - int64(uint64(block.number));
        // get deal Activation State
        int64 terminatedEpoch = CommonTypes.ChainEpoch.unwrap(MarketAPI.getDealActivation(deal_id).terminated);
        // get deal Activation State
        int64 activationEpoch = CommonTypes.ChainEpoch.unwrap(MarketAPI.getDealActivation(deal_id).activated);

        authorizeDeal(piece_cid, provider, dealDuration, terminatedEpoch,activationEpoch);

        pieceToSPs[piece_cid][provider] = true;

        uint bountyReward = pieceToBounty[piece_cid].bountyReward;

        reward(client, bountyReward);
        // piece_cidToDeals[piece_cid].add(uint256(deal_id));
        pieceToBounty[piece_cid].donatedTokens = pieceToBounty[piece_cid].donatedTokens - pieceToBounty[piece_cid].bountyReward;

    }

    /// @dev authorizing a deal claim
    /// @param piece_cid: piece_cid of the deal to check
    /// @param provider: provider of the deal check if he already storing the file
    /// @param dealDuration: checking if the dealDuration > BountyMinimumDealDays
    /// @param terminated: to check if the deal is failed to send storage proof
    /// @param activationEpoch: used in combination with the dealDuration
    function authorizeDeal(bytes memory piece_cid, uint64 provider, int64 dealDuration, int64 terminated, int64 activationEpoch) internal view {
        require(pieceToBounty[piece_cid].created, "bounty on funding phase OR isFullyClaimed");
        require((pieceToBounty[piece_cid].donatedTokens - pieceToBounty[piece_cid].bountyReward) > pieceToBounty[piece_cid].donatedTokens);
        require(!pieceToSPs[piece_cid][provider], "SP is already storing that file");
        require(dealDuration - pieceToBounty[piece_cid].minDealDays > 0 ,"deal ends too soon");
        require(terminated == 0 && activationEpoch > 0); 
    }

    // /// @dev checking if a bounty is funded: used for the application logic
    // /// @param piece_cidid: the id of the piece_cid
    // function isBountyFunded(uint256 piece_cidid) public view returns(bool){
    //     return onBounties.contains(piece_cidid);
    // }

    // /// @dev getting the claimed deals for a piece_cid
    // /// @param piece_cid: the piece_cid to get its deals
    // function getDeals(bytes memory piece_cid) public view returns(uint32[] memory piece_cid_deals){
    //     uint256 size = piece_cidToDeals[piece_cid].length();
    //     piece_cid_deals = new uint32[](size);
    //     for (uint256 i = 0; i < size; i++) {
    //         piece_cid_deals[i] = uint32(uint64(piece_cidToDeals[piece_cid].at(i)));
    //     }
    //     return piece_cid_deals;
    // }

        /// @dev Send amount $FIL to the filecoin actor at actor_id 
    /// @dev that contributed to the DAO for replicating a piece_cid
    /// @param actorID: actor at actor_id
    /// @param BountyReward: Amount of $FIL
    function reward(uint64 actorID, uint256 BountyReward) internal {
        bytes memory emptyParams = "";
        delete emptyParams;
        Actor.callByID(CommonTypes.FilActorId.wrap(actorID), METHOD_SEND, Misc.NONE_CODEC, emptyParams, BountyReward, false);
    }


    function call_actor_id(uint64 method, uint256 value, uint64 flags, uint64 codec, bytes memory params, uint64 id) public returns (bool, int256, uint64, bytes memory) {
        (bool success, bytes memory data) = address(CALL_ACTOR_ID).delegatecall(abi.encode(method, value, flags, codec, params, id));
        (int256 exit, uint64 return_codec, bytes memory return_value) = abi.decode(data, (int256, uint64, bytes));
        return (success, exit, return_codec, return_value);
    }
}