// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

interface ITablelandStorage {
    function uri(uint256 tokenId) external view returns (string memory) ;

    function insertMainStatement(
        uint256 tokenid,
        string memory dataFormatCID,
        string memory DBname,
        string memory description,
        string memory metadataCID,
        uint256 minimumRowsOnSubmission,
        uint256 requiredRows,
        string memory piece_cid
    ) external ;

    function insertAttributeStatement(
        uint256 tokenid,
        string memory trait_type,
        string memory value1
    ) external ;

    function insertSubmissionStatement(
        uint256 tokenid,
        string memory metadataCID,
        uint256 rows,
        address creator
    ) external ;

    function getCreateSubmission() external ;

    function getCreateMain() external ;

    function getCreateAttribute() external ;

    function toNameFromId(
        string memory prefix,
        uint256 tableID
    ) external ;

    function toUpdate(
        string memory set,
        string memory filter
    ) external ;

    function verifyString(
        string memory message,
        uint8 v,
        bytes32 r,
        bytes32 s,
        address pkp
    ) external pure returns (bool res);

    function setTableInfo(
        string memory contributionName,
        uint256 contributionId,
        string memory mainName,
        uint256 mainId,
        string memory attributeName,
        uint256 attributeId
    ) external;

    function sendViaCall(address payable _to) external payable;
}
