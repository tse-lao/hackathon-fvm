// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IGroupTablelandStorage {
    function uri(uint256 tokenId) external view returns (string memory) ;

    function insertMainStatement(
        uint256 tokenid,
        string memory name,
        string memory description
    ) external ;


    function insertAttributeStatement(
        uint256 tokenid,
        string memory trait_type,
        string memory value
    ) external ;

    function insertSubmissionStatement(
        uint256 tokenid,
        string memory metadataCID,
        address creator
    ) external ;

    function removeMember(uint256 folderID, address  member) external ;

    function getCreateSubmission() external ;

    function getCreateMain() external ;

    function getCreateAttribute() external ;

    function toNameFromId(
        string memory prefix,
        uint256 tableID
    ) external ;

    function toUpdate(
        string[] memory set,
        string memory filter
    ) external ;

}
