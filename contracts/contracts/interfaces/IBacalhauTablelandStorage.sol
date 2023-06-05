// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

interface IBacalhauTablelandStorage {

    function updateJobResult(string[] memory set, uint256 jobID) external;

    function jobInsertion(
        uint256 jobID,
        string memory name,
        string memory description,
        string memory dataFormat,
        string memory startCommand,
        string memory endCommand,
        uint256 numberOfInputs,
        address creator
    )  external;

    function computationInsertion(
        uint256 jobID,
        string memory input,
        uint256 requestID,
        address requestor
    )external;

    function BountyInsertion(
        uint256 bountyID,
        string memory name,
        string memory description,
        string memory dataFormat,
        uint256 reward,
        address creator
    ) external;

    function updateBountyWinner(address winner, uint256 bountyID) external;

    function updateJobResult(string memory set, uint256 requestID) external;
    
}
