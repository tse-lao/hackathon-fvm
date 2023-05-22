//SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface IDealReward {

    struct bounty {
        uint256 size;
        uint256 donatedTokens;
        int64 minDealDays;
        bool created;
    }

    /// @dev Emitted when a proposal for a commP is created
    /// @param id: id of the commP
    /// @param commP: cid of the deal proposal
    event CommpProposed(uint id, bytes commP);

    /// @dev Emitted when a bounty for a commP is added to the DAO
    /// @param commP: cid of the Bounty
    event bountyCreated(bytes commP);

    /// @dev Emitted when a bounty for a commP is fully funded: ready for claims
    /// @param commP: cid of the Bounty
    event bountyFullyFunded(bytes commP);
}
