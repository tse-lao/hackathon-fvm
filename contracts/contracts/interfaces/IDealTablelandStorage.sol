// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;
import "./IDealClient.sol";

interface IDealTablelandStorage is IDealClient {
    function dealInsertion(bytes memory piece_cid, uint256 dealID, bytes32 requestId) external;

    function requestInsertion(bytes memory piece_cid, bytes32 requestId) external;

    function serializeExtraParamsV1(
        ExtraParamsV1 memory params
    ) external pure returns (bytes memory);

    function serializeDealProposal(DealRequest memory deal) external view returns (bytes memory);

    function retBuf() external pure returns (bytes memory);

    function addDAO(address newDAO, address[] memory owners, address multisig) external;

    function toUpdateStatus(string memory status, uint256 dealID) external;

    function addBalance() external payable ;

    function getActivationStatus(
        uint64 dealid
    ) external returns (MarketTypes.GetDealActivationReturn memory);
}