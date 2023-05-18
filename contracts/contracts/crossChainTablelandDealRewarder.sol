// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {AxelarExecutable} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/executable/AxelarExecutable.sol";
import {IAxelarGateway} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol";
import {IAxelarGasService} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol";
import "@tableland/evm/contracts/utils/TablelandDeployments.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@tableland/evm/contracts/utils/SQLHelpers.sol";
import "@zondax/filecoin-solidity/contracts/v0.8/utils/Actor.sol";
import "@zondax/filecoin-solidity/contracts/v0.8/MarketAPI.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./interfaces/IDealReward.sol";


contract crossChainTablelandDealRewarder is IDealReward, AxelarExecutable {
    // Create a orice per GB per epoch variable and take input the piece_size to generate the bountyReward in a generic way
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
    string private constant BOUNTY_SCHEMA =
        "piece_cid text, location_ref text, reward text, donatedTokens text, size text, minAcceptedDealDuration text";

    uint256 claim_tableID;
    string public claim_tableName;
    string private constant CLAIM_TABLE_PREFIX = "claim";
    string private constant CLAIM_SCHEMA =
        "piece_cid text, dealID text, client text, provider text, activationEpoch text, dealEndEpoch text";

    mapping(bytes => bounty) public pieceToBounty;

    mapping(bytes => string) public pieceInfo;

    mapping(bytes => mapping(uint64 => bool)) public pieceToSPs;

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
    /// @param piece_cid_bytes: reward for each client or storageProvider that will make a deal for that piece_cid
    /// @param location_ref: size of the file
    /// @param bountyReward: size of the file
    /// @param minAcceptedDealDuration: size of the file
    /// @param size: size of the file
    function createBounty(
        string memory piece_cid,
        bytes memory piece_cid_bytes,
        string memory location_ref,
        uint256 bountyReward,
        int64 minAcceptedDealDuration,
        uint256 size
    ) public {
        require(pieceToBounty[piece_cid_bytes].created == false, "Bounty exists");
        require(minAcceptedDealDuration > 0);
        // string memory key = bytes32ToString(hash);
        bounty memory newBounty = bounty({
            bountyReward: bountyReward,
            donatedTokens: 0,
            minDealDays: minAcceptedDealDuration,
            created: true
        });

        // bytes memory bountyID = stringToBytes(piece_cid);
        pieceInfo[piece_cid_bytes] = piece_cid;

        pieceToBounty[piece_cid_bytes] = newBounty;

        mutate(
            bounty_tableID,
            bountyInsertion(piece_cid, location_ref, bountyReward, size, minAcceptedDealDuration)
        );
    }

    /// @dev Funding a Bounty
    /// @param piece_cid: cid of the bounty to get funded
    function fundBounty(bytes memory piece_cid) public payable {
        require(pieceToBounty[piece_cid].created, "bounty does not exists");
        pieceToBounty[piece_cid].donatedTokens += msg.value;

        string memory set = string.concat(
            "donatedTokens='",
            Strings.toString(pieceToBounty[piece_cid].donatedTokens),
            "'"
        );
        string memory filter = string.concat("piece_cid=", pieceInfo[piece_cid]);
        mutate(
            bounty_tableID,
            SQLHelpers.toUpdate(BOUNTY_TABLE_PREFIX, bounty_tableID, set, filter)
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

        uint bountyReward = pieceToBounty[piece_cid].bountyReward;

        reward(client, bountyReward);
        // piece_cidToDeals[piece_cid].add(uint256(deal_id));
        pieceToBounty[piece_cid].donatedTokens -= pieceToBounty[piece_cid].bountyReward;

        mutate(
            bounty_tableID,
            claimInsertion(
                pieceInfo[piece_cid],
                deal_id,
                client,
                provider,
                activationEpoch,
                dealEndEpoch
            )
        );

        string memory set = string.concat(
            "donatedTokens='",
            Strings.toString(pieceToBounty[piece_cid].donatedTokens),
            "'"
        );
        string memory filter = string.concat("piece_cid=", pieceInfo[piece_cid]);
        mutate(
            bounty_tableID,
            SQLHelpers.toUpdate(BOUNTY_TABLE_PREFIX, bounty_tableID, set, filter)
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
            (pieceToBounty[piece_cid].donatedTokens - pieceToBounty[piece_cid].bountyReward) >=
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
    function reward(uint64 actorID, uint256 BountyReward) internal {
        bytes memory emptyParams = "";
        delete emptyParams;
        Actor.callByID(
            CommonTypes.FilActorId.wrap(actorID),
            METHOD_SEND,
            Misc.NONE_CODEC,
            emptyParams,
            BountyReward,
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

    function claimInsertion(
        string memory piece_cid,
        uint64 dealID,
        uint64 client,
        uint64 provider,
        int64 activationEpoch,
        int64 dealEndEpoch
    ) internal view returns (string memory) {
        return
            SQLHelpers.toInsert(
                BOUNTY_TABLE_PREFIX,
                bounty_tableID,
                "piece_cid, dealID, client, provider, activationEpoch, dealEndEpoch",
                string.concat(
                    string(piece_cid),
                    ",",
                    SQLHelpers.quote(Strings.toString(dealID)),
                    ",",
                    SQLHelpers.quote(Strings.toString(client)),
                    ",",
                    SQLHelpers.quote(Strings.toString(provider)),
                    ",",
                    SQLHelpers.quote(Strings.toString(uint(int(activationEpoch)))),
                    ",",
                    SQLHelpers.quote(Strings.toString(uint(int(dealEndEpoch))))
                )
            );
    }

    function bountyInsertion(
        string memory piece_cid,
        string memory location_ref,
        uint256 bountyreward,
        uint256 size,
        int64 minAcceptedDealDuration
    ) internal view returns (string memory) {
        return
            SQLHelpers.toInsert(
                BOUNTY_TABLE_PREFIX,
                bounty_tableID,
                "piece_cid, location_ref, reward, donatedTokens, size, minAcceptedDealDuration",
                string.concat(
                    string(piece_cid),
                    ",",
                    SQLHelpers.quote(location_ref),
                    ",",
                    SQLHelpers.quote(Strings.toString(bountyreward)),
                    ",",
                    SQLHelpers.quote(Strings.toString(0)),
                    ",",
                    SQLHelpers.quote(Strings.toString(size)),
                    ",",
                    SQLHelpers.quote(Strings.toString(uint(int(minAcceptedDealDuration))))
                )
            );
    }

    function mutate(uint256 tableId, string memory statement) internal {
        tablelandContract.mutate(address(this), tableId, statement);
    }

    // Other Contracts can use this contract to perform crossChain calls and to create bounties from all the axelar supported chains
    function _execute(bytes calldata payload_) internal {
        string memory piece_cid;
        bytes memory piece_cid_bytes;
        string memory location_ref;
        uint256 bountyReward;
        int64 minAcceptedDealDuration;
        uint256 size;
        (
            piece_cid,
            piece_cid_bytes,
            location_ref,
            bountyReward,
            minAcceptedDealDuration,
            size
        ) = abi.decode(payload_, (string, bytes, string, uint256, int64, uint256));
        createBounty(
            piece_cid,
            piece_cid_bytes,
            location_ref,
            bountyReward,
            minAcceptedDealDuration,
            size
        );
    }
}
