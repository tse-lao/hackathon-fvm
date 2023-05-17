// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;
import './IDealClient.sol';
import {MarketTypes} from '@zondax/filecoin-solidity/contracts/v0.8/types/MarketTypes.sol';
import {AccountTypes} from '@zondax/filecoin-solidity/contracts/v0.8/types/AccountTypes.sol';

interface IDealTablelandView is IDealClient {
    // function toUpdate(string memory prefix, uint256 tableID,string memory set, string memory filter)external view returns(string memory);

    function dealInsertion(
        string memory piece_cid,
        uint64 dealID,
        string memory status
    ) external;

    function requestInsertion(
        string memory piece_cid,
        string memory location_ref,
        uint64 car_size,
        uint64 piece_size,
        uint256 timestampt,
        address creator
    ) external;

    function toUpdateStatus(
        string memory status,
        uint256 dealID
    ) external;

    function serializeExtraParamsV1(
        ExtraParamsV1 memory params
    ) external pure returns (bytes memory);

    function deserializeMarketDealNotifyParams(
        bytes memory params
    ) external pure returns (MarketTypes.MarketDealNotifyParams memory);

    function deserializeDealProposal(
        bytes memory dealProposal
    ) external pure returns (MarketTypes.DealProposal memory);

    function serializeDealProposal(
        DealRequest memory deal
    ) external view returns (bytes memory);

    function retBuf() external pure returns (bytes memory);
}
