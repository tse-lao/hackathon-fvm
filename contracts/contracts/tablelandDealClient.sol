// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;
import {MarketAPI} from "@zondax/filecoin-solidity/contracts/v0.8/MarketAPI.sol";
import {CommonTypes} from "@zondax/filecoin-solidity/contracts/v0.8/types/CommonTypes.sol";
import {MarketTypes} from "@zondax/filecoin-solidity/contracts/v0.8/types/MarketTypes.sol";
import {BigInts} from "@zondax/filecoin-solidity/contracts/v0.8/utils/BigInts.sol";
import {FilAddresses} from "@zondax/filecoin-solidity/contracts/v0.8/utils/FilAddresses.sol";
import {DataCapAPI} from "@zondax/filecoin-solidity/contracts/v0.8/DataCapAPI.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./interfaces/IDealTablelandStorage.sol";
import "./interfaces/IDealClient.sol";
// Accept tokens from ERC1155 OR ERC721 address to tokenID
// mapping(address => Enumerable.UintSet) contractTokensForPermanent deals
// Each tokenID could have more than one files on it so maybe we need a counter for this contract and create something like thisContractCounterID => address => tokenID so then like apes can add files into their tokens
// Each tokenID dataPiece has a funding pool to pay for the deals

contract tablelandDealClient is IDealClient, AccessControl {

    // If i am going to create an address => tokensSet meaning that an address has made those deals so i need to add a token Counter
        // IN GENERAL MAKE THAT WAY SO WE CAN ACCEPT DEALS FROM EVERYONE LIKE 
        // if DEALcLIENT IS DEPLOYABLE USING CREATE2 I WILL CREATE A DAO WITH ACCESS CONTROLL GIVEN TO THE POLYGON MULTISIG OWNERS
        // 
    using EnumerableSet for EnumerableSet.UintSet;
    using Counters for Counters.Counter;
    Counters.Counter private tokenIDs;

    address private MARKET_ACTOR_ETH_ADDRESS = address(0xff00000000000000000000000000000000000005);

    mapping(bytes32 => DealRequest) private request;

    mapping(bytes => mapping(bytes => bool)) private pieceproviders;

    mapping(bytes => EnumerableSet.UintSet) private piecedeals;

    mapping(bytes => currentRequestInfo) private currentPieceRequestInfo;

    IDealTablelandStorage dealClientTablelandStorage;

    struct tokenDealInfo {
        bytes piece_cid;
        string label;
        uint64 piece_size;
        string location_ref;
        uint64 car_size;
        uint256 dataCapAllocation;
    }

    mapping(uint256 => tokenDealInfo) public tokenInfoMap;
    // That mapping can solve the issue to create a dealClient capable of acceppting from different kind of contracts to store the tokens OF THAT CONTRACT
    // ON FIELCOIN THE OWNERS SOULD FIRST EXECUTE A TREANSACTION
    // TO SPESIFY THEIR TOKEN FILECOIN STORAGE DEALS INFO
    mapping(address => mapping(uint256 => tokenDealInfo)) contractTotokenInfoMap;

    mapping(address => uint) public userFunds;

    constructor(
        IDealTablelandStorage dealTablelandView,
        address[] memory _admins
    ){
        dealClientTablelandStorage = dealTablelandView;
        uint256 size = _admins.length;
        address admin;
        for (uint i = 0; i < size; ) {
            admin = _admins[i];
            _grantRole(DEFAULT_ADMIN_ROLE,admin);
            unchecked {
                ++i;
            }
        }
    }

    function setTokenInfo(
        bytes memory piece_cid,
        string memory label,
        uint64 piece_size,
        string memory location_ref,
        uint64 car_size,
        uint256 tokenDataCapAllocationInBytes
    ) public onlyRole(DEFAULT_ADMIN_ROLE){
        tokenIDs.increment();
        uint256 newToken = tokenIDs.current();
        (uint256 contractDataCapInBytes, bool Converted) = BigInts.toUint256(
            DataCapAPI.balance(FilAddresses.fromEthAddress(address(this)))
        );
        contractDataCapInBytes = contractDataCapInBytes * 1073741824;
        require(
            !Converted,
            "Issues converting uint256 to BigInt, may not have accurate values"
        );
        require(contractDataCapInBytes >= tokenDataCapAllocationInBytes);

        tokenInfoMap[newToken] = tokenDealInfo(piece_cid, label, piece_size, location_ref, car_size,tokenDataCapAllocationInBytes);
    }


    // After a proposal deal is materialized we offer more deal replications
    function makeDealProposal(uint256 tokenId) external onlyRole(DEFAULT_ADMIN_ROLE) returns (bytes32) {
        require(tokenInfoMap[tokenId].car_size > 0);
        tokenDealInfo memory dealInfo = tokenInfoMap[tokenId];
        bool verifiedDeal;
        if(dealInfo.dataCapAllocation >= dealInfo.car_size) {
            verifiedDeal = true;
        }
        int64 blockNumber = int64(uint64(block.number));
        DealRequest memory deal = DealRequest(dealInfo.piece_cid,dealInfo.piece_size,verifiedDeal,dealInfo.label,blockNumber + 5760,blockNumber + 2102400,0,0,0,1,
                                                ExtraParamsV1(
                                                    dealInfo.location_ref, dealInfo.car_size, false, false
                                                )
                                            );
        // Checking if the deal is requested previously if so we only allow a deal for the same file only if the prev deal is terminated or activated or timeout occured
        if (
            currentPieceRequestInfo[deal.piece_cid].currentRequestID != bytes32(0) ||
            piecedeals[deal.piece_cid].contains(currentPieceRequestInfo[deal.piece_cid].dealid)
        ) {
            updateActivationStatus(deal.piece_cid);
            require(
                currentPieceRequestInfo[deal.piece_cid].status == Status.DealActivated ||
                    currentPieceRequestInfo[deal.piece_cid].status == Status.DealTerminated ||
                    currentPieceRequestInfo[deal.piece_cid].status == Status.RequestTimeout,
                "piece_cid is still in a pending deal try later"
            );
        }
        if(verifiedDeal){
            tokenInfoMap[tokenId].dataCapAllocation -= dealInfo.car_size;
        }
        // creates a unique ID for the deal proposal -- there are many ways to do this
        bytes32 id = keccak256(abi.encodePacked(block.number, msg.sender));

        currentPieceRequestInfo[deal.piece_cid] = currentRequestInfo(
            id,
            0,
            Status.RequestSubmitted
        );
        request[id] = deal;
        dealClientTablelandStorage.requestInsertion(
            tokenId,
            deal.label,
            deal.extra_params.location_ref,
            deal.piece_size,
            block.number
        );

        // writes the proposal metadata to the event log
        emit DealProposalCreate(id, deal.piece_size, deal.verified_deal, 0);

        return id;
    }

    // // helper function to get deal request based from id
    // function getDealRequest(bytes32 requestId) public view returns (DealRequest memory) {
    //     DealRequest storage deal = request[requestId];
    //     return deal;
    // }

    // Returns a CBOR-encoded DealProposal.
    function getDealProposal(bytes32 proposalId) public view returns (bytes memory) {
        DealRequest storage deal = request[proposalId];
        return dealClientTablelandStorage.serializeDealProposal(deal);
    }
    // Returns a CBOR-encoded ExtraParams.
    function getExtraParams(bytes32 proposalId) public view returns (bytes memory extra_params) {
        DealRequest storage deal = request[proposalId];
        return dealClientTablelandStorage.serializeExtraParamsV1(deal.extra_params);
    }

    // authenticateMessage is the callback from the market actor into the contract
    // as part of PublishStorageDeals. This message holds the deal proposal from the
    // miner, which needs to be validated by the contract in accordance with the
    // deal requests made and the contract's own policies
    // @params - cbor byte array of AccountTypes.AuthenticateMessageParams
    function authenticateMessage(bytes memory params) internal view {
        require(msg.sender == MARKET_ACTOR_ETH_ADDRESS);

        MarketTypes.DealProposal memory proposal = dealClientTablelandStorage
            .deserializeDealProposal(params);

        bytes memory pieceCid = proposal.piece_cid.data;
        require(currentPieceRequestInfo[pieceCid].status == Status.RequestSubmitted);

        DealRequest storage req = request[currentPieceRequestInfo[pieceCid].currentRequestID];

        require(proposal.verified_deal == req.verified_deal, "verified_deal param mismatch");
        (uint256 proposalStoragePricePerEpoch, bool storagePriceConverted) = BigInts.toUint256(
            proposal.storage_price_per_epoch
        );
        require(
            !storagePriceConverted,
            "Issues converting uint256 to BigInt, may not have accurate values"
        );
        (uint256 proposalClientCollateral, bool collateralConverted) = BigInts.toUint256(
            proposal.client_collateral
        );
        require(
            !collateralConverted,
            "Issues converting uint256 to BigInt, may not have accurate values"
        );
        require(
            proposalStoragePricePerEpoch <= req.storage_price_per_epoch,
            "storage price greater than request amount"
        );
        require(
            proposalClientCollateral <= req.client_collateral,
            "client collateral greater than request amount"
        );
    }

    // dealNotify is the callback from the market actor into the contract at the end
    // of PublishStorageDeals. This message holds the previously approved deal proposal
    // and the associated dealID. The dealID is stored as part of the contract state
    // and the completion of this call marks the success of PublishStorageDeals
    // @params - cbor byte array of MarketDealNotifyParams
    function dealNotify(bytes memory params) internal {
        require(msg.sender == MARKET_ACTOR_ETH_ADDRESS);

        MarketTypes.MarketDealNotifyParams memory mdnp = dealClientTablelandStorage
            .deserializeMarketDealNotifyParams(params);
        MarketTypes.DealProposal memory proposal = dealClientTablelandStorage
            .deserializeDealProposal(mdnp.dealProposal);

        // These checks prevent race conditions between the authenticateMessage and
        // marketDealNotify calls where someone could have 2 of the same deal proposals
        // within the same PSD msg, which would then get validated by authenticateMessage
        // However, only one of those deals should be allowed
        require(
            currentPieceRequestInfo[proposal.piece_cid.data].status == Status.RequestSubmitted,
            "deal proposal doesn't have any request"
        );

        require(
            !pieceproviders[proposal.piece_cid.data][proposal.provider.data],
            "A provider is already storing that deal"
        );

        uint256 DEAL_ID = uint256(uint64(mdnp.dealId));

        // get deal client
        uint64 provider = MarketAPI.getDealProvider(mdnp.dealId);

        // dealToProposal[DEAL_ID] = proposal;

        pieceproviders[proposal.piece_cid.data][proposal.provider.data] = true;

        piecedeals[proposal.piece_cid.data].add(DEAL_ID);

        currentPieceRequestInfo[proposal.piece_cid.data].dealid = DEAL_ID;

        currentPieceRequestInfo[proposal.piece_cid.data].status = Status.DealPublished;
        string storage payloadCID = request[
            currentPieceRequestInfo[proposal.piece_cid.data].currentRequestID
        ].label;
        dealClientTablelandStorage.dealInsertion(
            payloadCID,
            DEAL_ID,
            uint256(provider),
            "DealPublished"
        );
    }

    // This function can be called/smartly polled to retrieve the deal activation status
    // associated with provided pieceCid and update the contract state based on that
    // info
    function updateActivationStatus(bytes memory pieceCid) internal {
        uint256 dealid = currentPieceRequestInfo[pieceCid].dealid;
        DealRequest storage deal = request[currentPieceRequestInfo[pieceCid].currentRequestID];
        // Checking if the deal rewuest start epoch is passed and changing the status to Deal timeout
        if (deal.start_epoch <= int64(uint64(block.number))) {
            currentPieceRequestInfo[pieceCid].status = Status.RequestTimeout;
            dealClientTablelandStorage.toUpdateStatus("RequestTimeout", dealid);
            return;
        }
        if (dealid != 0) {
            MarketTypes.GetDealActivationReturn memory ret = MarketAPI.getDealActivation(
                uint64(dealid)
            );
            if (CommonTypes.ChainEpoch.unwrap(ret.terminated) > 0) {
                currentPieceRequestInfo[pieceCid].status = Status.DealTerminated;
                dealClientTablelandStorage.toUpdateStatus("Terminated", dealid);
            } else if (CommonTypes.ChainEpoch.unwrap(ret.activated) > 0) {
                currentPieceRequestInfo[pieceCid].status = Status.DealActivated;
                dealClientTablelandStorage.toUpdateStatus("Activated", dealid);
            }
        }
    }

    // If the deal time is ended make the provider eligible to make again a deal for that piece
    // if (
    //     deal.end_epoch <= int64(uint64(block.number)) &&
    //     CommonTypes.ChainEpoch.unwrap(ret.terminated) <= 0
    // ) {
    //     MarketTypes.DealProposal storage proposal = dealToProposal[dealid];
    //     pieceproviders[proposal.piece_cid.data][proposal.provider.data] = false;
    // }

    // addBalance funds the builtin storage market actor's escrow
    // with funds from the contract's own balance
    // @value - amount to be added in escrow in attoFIL
    receive() external payable {
        MarketAPI.addBalance(FilAddresses.fromEthAddress(address(this)), msg.value);
    }

    function receiveDataCap(bytes memory params) internal {
        require(
            msg.sender == address(0xfF00000000000000000000000000000000000007),
            "msg.sender needs to be market actor f05"
        );
        emit ReceivedDataCap("DataCap Received!");
        // Add get datacap balance api and store datacap amount
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
            revert("the filecoin method that was called is not handled");
        }
        return (0, codec, ret);
    }
}
