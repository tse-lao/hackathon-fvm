// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@zondax/filecoin-solidity/contracts/v0.8/utils/Actor.sol";
import "@zondax/filecoin-solidity/contracts/v0.8/MarketAPI.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./interfaces/IRewardTablelandStorage.sol";
import "./interfaces/IDealReward.sol";

contract tablelandDealRewarder is IDealReward, Ownable {
    // Create a orice per GB per epoch variable and take input the piece_size to generate the bountyReward in a generic way
    IRewardTablelandStorage private RewardTablelandStorage;

    address constant CALL_ACTOR_ID = 0xfe00000000000000000000000000000000000005;
    uint64 constant DEFAULT_FLAG = 0x00000000;
    uint64 constant METHOD_SEND = 0;

    using EnumerableSet for EnumerableSet.UintSet;
    using EnumerableSet for EnumerableSet.AddressSet;
    using Counters for Counters.Counter;

    mapping(bytes => bounty) public pieceToBounty;

    mapping(bytes => string) public piecelabel;

    mapping(bytes => mapping(uint64 => bool)) public pieceToSPs;

    int64 public price_per_epoch = 0;

    int64 public standardAcceptedDealDuration = 2102400;

    constructor(IRewardTablelandStorage rewardTablelandStorage) {
        RewardTablelandStorage = rewardTablelandStorage;
    }

    /// @dev Creating a Bounty only for accepted proposals
    /// @param label: cid of the bounty
    /// @param piece_cid_bytes: reward for each client or storageProvider that will make a deal for that piece_cid
    /// @param location_ref: size of the file
    /// @param size: size of the file
    function createBounty(
        string memory label,
        bytes memory piece_cid_bytes,
        string memory location_ref,
        uint256 size
    ) public payable {
        require(pieceToBounty[piece_cid_bytes].created == false, "Bounty exists");
        // string memory key = bytes32ToString(hash);
        bounty memory newBounty = bounty({
            size: size,
            donatedTokens: msg.value,
            minDealDays: standardAcceptedDealDuration,
            created: true
        });

        // bytes memory bountyID = stringToBytes(piece_cid);
        piecelabel[piece_cid_bytes] = label;

        pieceToBounty[piece_cid_bytes] = newBounty;

        RewardTablelandStorage.bountyInsertion(
            label,
            location_ref,
            msg.value,
            size,
            standardAcceptedDealDuration
        );
    }

    /// @dev Funding a Bounty
    /// @param piece_cid: cid of the bounty to get funded
    function fundBounty(bytes memory piece_cid) public payable {
        require(pieceToBounty[piece_cid].created, "bounty does not exists");
        pieceToBounty[piece_cid].donatedTokens += msg.value;
        RewardTablelandStorage.updateDonatedTokens(
            piecelabel[piece_cid],
            pieceToBounty[piece_cid].donatedTokens
        );
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
        int64 dealEndEpoch = CommonTypes.ChainEpoch.unwrap(MarketAPI.getDealTerm(deal_id).end);
        // dealDuration represents the remaining days of the deal
        int64 dealDuration = dealEndEpoch - int64(uint64(block.number));
        // get deal Activation State
        int64 terminatedEpoch = CommonTypes.ChainEpoch.unwrap(
            MarketAPI.getDealActivation(deal_id).terminated
        );
        // get deal Activation State
        int64 activationEpoch = CommonTypes.ChainEpoch.unwrap(
            MarketAPI.getDealActivation(deal_id).activated
        );

        authorizeDeal(piece_cid, provider, dealDuration, terminatedEpoch, activationEpoch);

        pieceToSPs[piece_cid][provider] = true;

        int64 bountyReward = int64(int256(pieceToBounty[piece_cid].size)) * price_per_epoch;

        reward(client, bountyReward);
        // piece_cidToDeals[piece_cid].add(uint256(deal_id));
        pieceToBounty[piece_cid].donatedTokens -= uint64(bountyReward);

        RewardTablelandStorage.claimInsertion(
            piecelabel[piece_cid],
            deal_id,
            client,
            provider,
            activationEpoch,
            dealEndEpoch
        );

        RewardTablelandStorage.updateDonatedTokens(
            piecelabel[piece_cid],
            pieceToBounty[piece_cid].donatedTokens
        );
    }

    /// @dev authorizing a deal claim
    /// @param piece_cid: piece_cid of the deal to check
    /// @param provider: provider of the deal check if he already storing the file
    /// @param dealDuration: checking if the dealDuration > BountyMinimumDealDays
    /// @param terminated: to check if the deal is failed to send storage proof
    /// @param activationEpoch: used in combination with the dealDuration
    function authorizeDeal(
        bytes memory piece_cid,
        uint64 provider,
        int64 dealDuration,
        int64 terminated,
        int64 activationEpoch
    ) internal view {
        require(pieceToBounty[piece_cid].created, "bounty on funding phase OR isFullyClaimed");
        require(
            (pieceToBounty[piece_cid].donatedTokens -
                (pieceToBounty[piece_cid].size * uint64(price_per_epoch))) >=
                pieceToBounty[piece_cid].donatedTokens,
            "bounty needs more funding to get claimed"
        );
        require(!pieceToSPs[piece_cid][provider], "SP is already storing that file");
        require(
            dealDuration - pieceToBounty[piece_cid].minDealDays > 0,
            "deal ends too soon create a new one"
        );
        require(terminated == 0 && activationEpoch > 0, "deal terminated or not yet activated");
    }

    /// @dev Send amount $FIL to the filecoin actor at actor_id
    /// @dev that contributed to the DAO for replicating a piece_cid
    /// @param actorID: actor at actor_id
    /// @param BountyReward: Amount of $FIL
    function reward(uint64 actorID, int256 BountyReward) internal {
        bytes memory emptyParams = "";
        delete emptyParams;
        Actor.callByID(
            CommonTypes.FilActorId.wrap(actorID),
            METHOD_SEND,
            Misc.NONE_CODEC,
            emptyParams,
            uint256(BountyReward),
            false
        );
    }

    function call_actor_id(
        uint64 method,
        uint256 value,
        uint64 flags,
        uint64 codec,
        bytes memory params,
        uint64 id
    ) public returns (bool, int256, uint64, bytes memory) {
        (bool success, bytes memory data) = address(CALL_ACTOR_ID).delegatecall(
            abi.encode(method, value, flags, codec, params, id)
        );
        (int256 exit, uint64 return_codec, bytes memory return_value) = abi.decode(
            data,
            (int256, uint64, bytes)
        );
        return (success, exit, return_codec, return_value);
    }

    function setPricePerEpoch(int64 new_price_per_epoch) public onlyOwner {
        price_per_epoch = new_price_per_epoch;
    }
}
