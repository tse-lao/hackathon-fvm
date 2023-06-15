// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;
import {BigInts} from "@zondax/filecoin-solidity/contracts/v0.8/utils/BigInts.sol";
import {FilAddresses} from "@zondax/filecoin-solidity/contracts/v0.8/utils/FilAddresses.sol";
import {MarketCBOR} from "@zondax/filecoin-solidity/contracts/v0.8/cbor/MarketCbor.sol";
import {AccountCBOR} from "@zondax/filecoin-solidity/contracts/v0.8/cbor/AccountCbor.sol";
import {DataCapAPI} from "@zondax/filecoin-solidity/contracts/v0.8/DataCapAPI.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./interfaces/IDealTablelandStorage.sol";
import "./interfaces/IDealClient.sol";

contract tablelandDealClient is IDealClient, AccessControl {
    using MarketCBOR for *;
    using AccountCBOR for *;

    using EnumerableSet for EnumerableSet.UintSet;

    address private MARKET_ACTOR_ETH_ADDRESS = address(0xff00000000000000000000000000000000000005);

    mapping(bytes32 => DealRequest) public request;

    mapping(bytes => mapping(bytes => bool)) private pieceproviders;

    mapping(bytes => EnumerableSet.UintSet) private piecedeals;

    mapping(bytes => currentRequestInfo) public currentPieceRequestInfo;

    uint256 public balance;

    uint256 public dataCapBalance;

    uint256 dataCapBeforeUpdate;

    uint256 balanceBeforeUpdate;

    uint256 storage_price_per_epoch = 500000000;

    IDealTablelandStorage dealClientTablelandStorage;

    constructor(IDealTablelandStorage dealTablelandView, address[] memory _admins) {
        dealClientTablelandStorage = dealTablelandView;
        uint256 size = _admins.length;
        address admin;
        for (uint i = 0; i < size; ) {
            admin = _admins[i];
            _grantRole(DEFAULT_ADMIN_ROLE, admin);
            unchecked {
                ++i;
            }
        }
    }

    // After a proposal deal is materialized we offer more deal replications
    function makeDealProposal(DealRequest memory deal) external onlyRole(DEFAULT_ADMIN_ROLE) {
        // Checking if the deal is requested previously if so we only allow a deal for the same file only if the prev deal is terminated or activated or timeout occured

        if (
            currentPieceRequestInfo[deal.piece_cid].currentRequestID != bytes32(0) ||
            piecedeals[deal.piece_cid].contains(currentPieceRequestInfo[deal.piece_cid].dealid)
        ) {
            updateActivationStatus(deal.piece_cid);
            // "piece_cid is still in a pending deal try later"
            require(
                currentPieceRequestInfo[deal.piece_cid].status == Status.DealPublished ||
                    currentPieceRequestInfo[deal.piece_cid].status == Status.RequestTimeout
            );
        }
        checkContractDataCap();
        uint256 requiredDataCap = deal.piece_size * 8;
        uint256 checkDataCap = dataCapBalance - (requiredDataCap + dataCapBeforeUpdate);
        uint256 requiredBalance;
        uint256 checkBalance;
        if (checkDataCap >= requiredDataCap) {
            deal.verified_deal = true;
            // verified price per GB per epoch
            deal.storage_price_per_epoch = 0;
            dataCapBalance = checkDataCap;
            dataCapBeforeUpdate += requiredDataCap;
        } else {
            // unverified price per GB per epoch
            deal.storage_price_per_epoch = storage_price_per_epoch;
            int64 epoch_duration = deal.end_epoch - deal.start_epoch;
            requiredBalance = ((deal.storage_price_per_epoch *
                uint64(epoch_duration) *
                deal.piece_size) / 10 ** 9);
            checkBalance = balance - (requiredBalance + balanceBeforeUpdate);
            require(checkBalance >= balance);
            balance = checkBalance;
            balanceBeforeUpdate += requiredBalance;
        }
        // creates a unique ID for the deal proposal -- there are many ways to do this
        bytes32 id = keccak256(abi.encodePacked(block.number, msg.sender));

        currentPieceRequestInfo[deal.piece_cid] = currentRequestInfo(
            id,
            0,
            Status.RequestSubmitted,
            requiredBalance
        );
        request[id] = deal;
        dealClientTablelandStorage.requestInsertion(deal.piece_cid, id);

        emit DealProposalCreate(
            id,
            deal.piece_size,
            deal.verified_deal,
            deal.storage_price_per_epoch
        );
    }

    function checkContractDataCap() internal {
        (uint256 contractDataCap, bool Converted) = BigInts.toUint256(
            DataCapAPI.balance(FilAddresses.fromEthAddress(address(this)))
        );
        require(!Converted);
        dataCapBalance = contractDataCap;
    }

    // Returns a CBOR-encoded DealProposal.
    function getDealProposal(bytes32 proposalId) public view returns (bytes memory) {
        DealRequest memory deal = request[proposalId];
        return dealClientTablelandStorage.serializeDealProposal(deal);
    }

    // Returns a CBOR-encoded ExtraParams.
    function getExtraParams(bytes32 proposalId) public view returns (bytes memory extra_params) {
        DealRequest memory deal = request[proposalId];
        return dealClientTablelandStorage.serializeExtraParamsV1(deal.extra_params);
    }

    function authenticateMessage(bytes memory params) internal view {
        require(msg.sender == MARKET_ACTOR_ETH_ADDRESS);

        AccountTypes.AuthenticateMessageParams memory amp = params
            .deserializeAuthenticateMessageParams();

        MarketTypes.DealProposal memory proposal = MarketCBOR.deserializeDealProposal(amp.message);

        bytes memory piece_cid = proposal.piece_cid.data;

        require(currentPieceRequestInfo[piece_cid].status == Status.RequestSubmitted);

        DealRequest memory req = request[currentPieceRequestInfo[piece_cid].currentRequestID];
        // "verified_deal param mismatch"
        require(proposal.verified_deal == req.verified_deal);
        (uint256 proposalStoragePricePerEpoch, bool storagePriceConverted) = BigInts.toUint256(
            proposal.storage_price_per_epoch
        );
        //  "Issues converting uint256 to BigInt, may not have accurate values"
        require(
            !storagePriceConverted
        );
        (uint256 proposalClientCollateral, bool collateralConverted) = BigInts.toUint256(
            proposal.client_collateral
        );
        // "Issues converting uint256 to BigInt, may not have accurate values"
        require(
            !collateralConverted
        );
        //  "storage price greater than request amount"
        require(
            proposalStoragePricePerEpoch <= req.storage_price_per_epoch
        );
        // "client collateral greater than request amount"
        require(
            proposalClientCollateral <= req.client_collateral
        );
    }

    // dealNotify is the callback from the market actor into the contract at the end
    // of PublishStorageDeals. This message holds the previously approved deal proposal
    // and the associated dealID. The dealID is stored as part of the contract state
    // and the completion of this call marks the success of PublishStorageDeals
    // @params - cbor byte array of MarketDealNotifyParams
    function dealNotify(bytes memory params) internal {
        require(msg.sender == MARKET_ACTOR_ETH_ADDRESS);

        MarketTypes.MarketDealNotifyParams memory mdnp = MarketCBOR
            .deserializeMarketDealNotifyParams(params);

        MarketTypes.DealProposal memory proposal = MarketCBOR.deserializeDealProposal(
            mdnp.dealProposal
        );

        bytes memory piece_cid = proposal.piece_cid.data;

        // These checks prevent race conditions between the authenticateMessage and
        // marketDealNotify calls where someone could have 2 of the same deal proposals
        // within the same PSD msg, which would then get validated by authenticateMessage
        // However, only one of those deals should be allowed

        // "deal proposal doesn't have any request"
        require(
            currentPieceRequestInfo[piece_cid].status == Status.RequestSubmitted
        );

        // "This provider is already storing that deal"
        require(
            !pieceproviders[piece_cid][proposal.provider.data]
        );

        pieceproviders[piece_cid][proposal.provider.data] = true;

        uint256 DEAL_ID = uint256(mdnp.dealId);

        piecedeals[piece_cid].add(DEAL_ID);

        currentRequestInfo storage current = currentPieceRequestInfo[piece_cid];

        current.dealid = DEAL_ID;

        current.status = Status.DealPublished;

        dealClientTablelandStorage.dealInsertion(piece_cid, DEAL_ID, current.currentRequestID);

        dataCapBeforeUpdate += proposal.piece_size * 8;
        balanceBeforeUpdate += current.requiredBalance;
    }

    // addBalance funds the builtin storage market actor's escrow
    // with funds from the contract's own balance
    // @value - amount to be added in escrow in attoFIL
    receive() external payable {
        balance += msg.value;
        dealClientTablelandStorage.addBalance{value: msg.value}();
    }

    function receiveDataCap(bytes memory params) internal {
        // "msg.sender needs to be actor f07"
        require(
            msg.sender == address(0xfF00000000000000000000000000000000000007)
        );
    }

    // This function can be called/smartly polled to retrieve the deal activation status
    // associated with provided pieceCid and update the contract state based on that
    // info
    function updateActivationStatus(bytes memory piece_cid) internal {
        currentRequestInfo storage current = currentPieceRequestInfo[piece_cid];
        DealRequest memory deal = request[currentPieceRequestInfo[piece_cid].currentRequestID];
        // Checking if the deal rewuest start epoch is passed and changing the status to Deal timeout
        if (deal.start_epoch <= int64(uint64(block.number))) {
            current.status = Status.RequestTimeout;
            return;
        }
    }

    // handle_filecoin_method is the universal entry point for any evm based
    // actor for a call coming from a builtin filecoin actor
    // @method - FRC42 method number for the specific method hook
    // @params - CBOR encoded byte array params
    function handle_filecoin_method(
        uint64 method,
        uint64,
        bytes memory params
    ) public returns (uint32, uint64, bytes memory) {
        bytes memory ret;
        uint64 codec;
        // dispatch methods
        if (method == uint64(2643134072)) {
            authenticateMessage(params);
            // If we haven't reverted, we should return a CBOR true to indicate that verification passed.
            ret = dealClientTablelandStorage.retBuf();
            codec = 0x51;
        } else if (method == uint64(4186741094)) {
            dealNotify(params);
        } else if (method == uint64(3726118371)) {
            receiveDataCap(params);
        } else {
            // "the filecoin method that was called is not handled"
            revert();
        }
        return (0, codec, ret);
    }
}
