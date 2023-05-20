// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

interface IRewardTablelandStorage {
    function claimInsertion(
        string memory label,
        uint64 dealID,
        uint64 client,
        uint64 provider,
        int64 activationEpoch,
        int64 dealEndEpoch
    ) external;

    function bountyInsertion(
        string memory label,
        string memory location_ref,
        uint256 bountyreward,
        uint256 size,
        int64 minAcceptedDealDuration
    ) external;

    function updateDonatedTokens(string memory label, uint256 donatedTokens) external;
}
