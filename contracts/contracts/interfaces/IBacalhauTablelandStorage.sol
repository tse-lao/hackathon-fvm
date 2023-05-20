// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

interface IBacalhauTablelandStorage {
    function updateJobResult(string memory result, uint256 jobID) external;

    function computationInsertion(
        string memory specStart,
        string memory input,
        string memory specEnd,
        uint256 bridgeJobId,
        string memory jobId,
        address creator
    ) external;
}
