//SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {AccountTypes} from "@zondax/filecoin-solidity/contracts/v0.8/types/AccountTypes.sol";
import {CommonTypes} from "@zondax/filecoin-solidity/contracts/v0.8/types/CommonTypes.sol";
import {MarketTypes} from "@zondax/filecoin-solidity/contracts/v0.8/types/MarketTypes.sol";

interface IDealClient {
    // User request for this contract to make a deal. This structure is modelled after Filecoin's Deal
    // Proposal, but leaves out the provider, since any provider can pick up a deal broadcast by this
    // contract.
    struct DealRequest {
        bytes piece_cid;
        uint64 piece_size;
        bool verified_deal;
        string label;
        int64 start_epoch;
        int64 end_epoch;
        uint256 storage_price_per_epoch;
        uint256 provider_collateral;
        uint256 client_collateral;
        uint64 extra_params_version;
        ExtraParamsV1 extra_params;
    }

    // Extra parameters associated with the deal request. These are off-protocol flags that
    // the storage provider will need.
    struct ExtraParamsV1 {
        string location_ref;
        uint64 car_size;
        bool skip_ipni_announce;
        bool remove_unsealed_copy;
    }

    event ReceivedDataCap(string received);
    event DealProposalCreate(bytes32 indexed id, uint64 size, bool indexed verified, uint256 price);

    enum Status {
        None,
        RequestSubmitted,
        DealPublished,
        DealActivated,
        DealTerminated,
        RequestTimeout
    }

    struct currentRequestInfo {
        bytes32 currentRequestID;
        uint256 dealid;
        Status status;
        uint256 requiredBalance;
    }
}