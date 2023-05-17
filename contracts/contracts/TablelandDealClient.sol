// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import {MarketAPI} from '@zondax/filecoin-solidity/contracts/v0.8/MarketAPI.sol';
import {CommonTypes} from '@zondax/filecoin-solidity/contracts/v0.8/types/CommonTypes.sol';
import {MarketTypes} from '@zondax/filecoin-solidity/contracts/v0.8/types/MarketTypes.sol';
import {BigInts} from '@zondax/filecoin-solidity/contracts/v0.8/utils/BigInts.sol';
import {FilAddresses} from '@zondax/filecoin-solidity/contracts/v0.8/utils/FilAddresses.sol';
import '@openzeppelin/contracts/utils/structs/EnumerableSet.sol';
import './interfaces/IDealTablelandView.sol';
import './interfaces/IDealClient.sol';

// contract crossChainDealClient is AxelarExecutable, Ownable, IDealClient {
contract TablelandDealClient is IDealClient {
    // User request for this contract to make a deal. This structure is modelled after Filecoin's Deal
    // Proposal, but leaves out the provider, since any provider can pick up a deal broadcast by this
    // contract.

    // https://data.lighthouse.storage/
    // IN GENERAL TRY TO MAKE A LOT OF DEAL PROPOSAL PARAMETERS CHANGABLE THROUGH FUNCTIONS SO WE DONT NEED SO MUCH MEMORY BUT ALSO NOT MANY PARAMS IN THE PROSS CALL AND IN GENERAL CALL
    //  ZONDAX DATA CAP CONTRACT https://www.npmjs.com/package/@zondax/filecoin-solidity?activeTab=code I CAN ALSO CHECK INTO THE PROPOSALS

    // Make tableland integration as light as possible
    // Allow to create multiple deals for the same file and create a dashboard about the deal Status or worst case use just the status to reactivate
    // Allow give dataCap to certain tokenIDs and give them verified deal functionality
    // Making deals for tokenIDs and also by using tableland can let SPs to first check the data that they want to store
    // create a setter function for the price per GB/epoch field for all the deals and we are going to renew them for now only owner then maybe dao participants
    // We can somehow create a more descriptive event mechanism while making deals where storage providers can subscribe to using their wallets
    // Or they can use our api calls to do that
    // Create a cross chain enviroment to make deals let NFT contracts to receive datacap using tokenIDs and let also anyone to make deals for their prvate data
    // Each address has submitted some FIL tokens in the escrow i need to check if axelar can call from the other side payable functions

    IDealTablelandView idealTablelandView;

    mapping(address => uint) public userFunds;

    // IAxelarGasService public immutable gasService;
    using EnumerableSet for EnumerableSet.UintSet;
    // using EnumerableBytes32Set for EnumerableBytes32Set.Bytes32Set;

    address private MARKET_ACTOR_ETH_ADDRESS = address(0xff00000000000000000000000000000000000005);


    mapping(bytes32 => DealRequest) private request;

    // We can yse this one instead the above one bc we will store everything on tableland
    mapping(bytes => mapping(bytes => bool)) private pieceproviders;

    // We can yse this one instead the above one bc we will store everything on tableland
    mapping(bytes => EnumerableSet.UintSet) private piecedeals;

    // Replace it with a tableland update mutation

    // mapping(bytes => bool) public pieceVerified;

    // Replace with a tableland table mutation update

    mapping(bytes => currentRequestInfo) private currentPieceRequestInfo;

    uint256 storage_price_per_epoch = 0;

    // string[] private createStatements;
    // string[] public tables;
    // uint256[] public tableIDs;

    // mapping(bytes => mapping(address => userDataCapAndFunds)) userDataCapANdFunds;

    // struct userDataCapAndFunds {
    //     uint dataCap;
    //     uint Funds;
    // }

    //  When status is terminated add a bad status on SP so we can index that using tableland
    // address public owner;
    constructor(
        IDealTablelandView dealTablelandView
    )  {
        idealTablelandView = dealTablelandView;
    }



    function makeDealProposal(
        DealRequest memory deal
    ) public {
        if(piecedeals[deal.piece_cid].contains(currentPieceRequestInfo[deal.piece_cid].dealid)){
            updateActivationStatus(currentPieceRequestInfo[deal.piece_cid].dealid,deal.piece_cid);
        }
        // Update Current Proposed Deal Status to check if it is possible to make a new proposal
        // Create a mapping pieceCID => bool first time requesting ????
        // A way to allow a proposed deal for a pieceCID that the Request is created long time ago and no SP updated the State
        require(
            currentPieceRequestInfo[deal.piece_cid].status ==
                Status.DealActivated ||
                currentPieceRequestInfo[deal.piece_cid].status ==
                Status.DealTerminated
        );
        uint numberOfEpochs = 0;
        require(userFunds[msg.sender] >= numberOfEpochs * storage_price_per_epoch);
        // creates a unique ID for the deal proposal -- there are many ways to do this
        bytes32 id = keccak256(abi.encodePacked(block.timestamp, msg.sender));

        currentPieceRequestInfo[deal.piece_cid] = currentRequestInfo(id, 0, Status.RequestSubmitted);

        request[id] = deal;
        idealTablelandView.requestInsertion(
            deal.label,
            deal.extra_params.location_ref,
            deal.extra_params.car_size,
            deal.piece_size,
            block.timestamp,
            msg.sender
        );

        // writes the proposal metadata to the event log
        emit DealProposalCreate(
            id,
            deal.piece_size,
            deal.verified_deal,
            storage_price_per_epoch
        );
    }

    // Returns a CBOR-encoded DealProposal.
    function getDealProposal(
        bytes32 proposalId
    ) public view returns (bytes memory) {
        DealRequest memory deal = request[proposalId];
        return idealTablelandView.serializeDealProposal(deal);
    }

    function getExtraParams(
        bytes32 proposalId
    ) public view returns (bytes memory extra_params) {
        DealRequest memory deal = request[proposalId];
        return idealTablelandView.serializeExtraParamsV1(deal.extra_params);
    }

    // authenticateMessage is the callback from the market actor into the contract
    // as part of PublishStorageDeals. This message holds the deal proposal from the
    // miner, which needs to be validated by the contract in accordance with the
    // deal requests made and the contract's own policies
    // @params - cbor byte array of AccountTypes.AuthenticateMessageParams
    function authenticateMessage(bytes memory params) internal view {
        require(msg.sender == MARKET_ACTOR_ETH_ADDRESS);

        MarketTypes.DealProposal memory proposal = idealTablelandView
            .deserializeDealProposal(params);

        bytes memory pieceCid = proposal.piece_cid.data;
        // require(
        //     currentPieceRequestInfo[pieceCid].status == Status.RequestSubmitted
        // );

        DealRequest memory req = request[
            currentPieceRequestInfo[pieceCid].currentRequestID
        ];

        // require(proposal.verified_deal == req.verified_deal);
        (
            uint256 proposalStoragePricePerEpoch,
            bool storagePriceConverted
        ) = BigInts.toUint256(proposal.storage_price_per_epoch);

        (uint256 proposalClientCollateral, bool collateralConverted) = BigInts
            .toUint256(proposal.storage_price_per_epoch);
        require(storagePriceConverted && collateralConverted && (proposalStoragePricePerEpoch <= req.storage_price_per_epoch) && (proposalClientCollateral <= req.client_collateral) && (proposal.verified_deal == req.verified_deal) && (currentPieceRequestInfo[pieceCid].status == Status.RequestSubmitted));
        // require(proposalStoragePricePerEpoch <= req.storage_price_per_epoch);
        // require(proposalClientCollateral <= req.client_collateral);
    }

    // dealNotify is the callback from the market actor into the contract at the end
    // of PublishStorageDeals. This message holds the previously approved deal proposal
    // and the associated dealID. The dealID is stored as part of the contract state
    // and the completion of this call marks the success of PublishStorageDeals
    // @params - cbor byte array of MarketDealNotifyParams
    function dealNotify(bytes memory params) internal {
        require(msg.sender == MARKET_ACTOR_ETH_ADDRESS);

        MarketTypes.MarketDealNotifyParams memory mdnp = idealTablelandView
            .deserializeMarketDealNotifyParams(params);
        MarketTypes.DealProposal memory proposal = idealTablelandView
            .deserializeDealProposal(mdnp.dealProposal);

        // These checks prevent race conditions between the authenticateMessage and
        // marketDealNotify calls where someone could have 2 of the same deal proposals
        // within the same PSD msg, which would then get validated by authenticateMessage
        // However, only one of those deals should be allowed
        require(
            currentPieceRequestInfo[proposal.piece_cid.data].status ==
                Status.RequestSubmitted
        );

        require(
            !pieceproviders[proposal.piece_cid.data][proposal.provider.data]
        );

        uint256 DEAL_ID = uint256(uint64(mdnp.dealId));
        pieceproviders[proposal.piece_cid.data][proposal.provider.data] = true;
        piecedeals[proposal.piece_cid.data].add(DEAL_ID);

        currentPieceRequestInfo[proposal.piece_cid.data].dealid = DEAL_ID;

        currentPieceRequestInfo[proposal.piece_cid.data].status = Status
            .DealPublished;

        idealTablelandView.dealInsertion(
            request[
                currentPieceRequestInfo[proposal.piece_cid.data]
                    .currentRequestID
            ].label,
            mdnp.dealId,
            'DealPublished'
        );
    }

    // This function can be called/smartly polled to retrieve the deal activation status
    // associated with provided pieceCid and update the contract state based on that
    // info
    function updateActivationStatus(uint256 dealid, bytes memory pieceCid) internal {
        
            MarketTypes.GetDealActivationReturn memory ret = MarketAPI.getDealActivation(uint64(dealid));
            if (CommonTypes.ChainEpoch.unwrap(ret.terminated) > 0) {
                    currentPieceRequestInfo[pieceCid].status = Status
                        .DealTerminated;
                        idealTablelandView.toUpdateStatus("Terminated",dealid);
            }else if(CommonTypes.ChainEpoch.unwrap(ret.activated) > 0){
                    currentPieceRequestInfo[pieceCid].status = Status.DealActivated;
                    idealTablelandView.toUpdateStatus("Activated",dealid);
            }
    }
    
    // addBalance funds the builtin storage market actor's escrow
    // with funds from the contract's own balance
    // @value - amount to be added in escrow in attoFIL
    function addBalance() public payable {
        userFunds[msg.sender] = userFunds[msg.sender] + msg.value;
        MarketAPI.addBalance(FilAddresses.fromEthAddress(address(this)), msg.value);
    }
    // This function attempts to withdraw the specified amount from the contract addr's escrow balance
    // If less than the given amount is available, the full escrow balance is withdrawn
    // @client - Eth address where the balance is withdrawn to. This can be the contract address or an external address
    // @value - amount to be withdrawn in escrow in attoFIL
    function withdrawBalance(
        uint256 value
    ) public {
        require(userFunds[msg.sender] >= value);

        MarketTypes.WithdrawBalanceParams memory params = MarketTypes
            .WithdrawBalanceParams(
                FilAddresses.fromEthAddress(address(this)), CommonTypes.BigInt(abi.encodePacked(value),false));
        MarketAPI.withdrawBalance(params);
        userFunds[msg.sender] = userFunds[msg.sender] - value;
    }

    function receiveDataCap(bytes memory params) internal {
        require(msg.sender == address(0xfF00000000000000000000000000000000000007));
        emit ReceivedDataCap('DataCap Received!');
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
            ret = idealTablelandView.retBuf();
            codec = 0x51;
        } else if (method == uint64(4186741094)) {
            dealNotify(params);
        } else if (method == uint64(3726118371)) {
            receiveDataCap(params);
        } else {
            revert();
        }
        return (0, codec, ret);
    }
}
