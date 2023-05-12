// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

interface ITablelandView {
    
    function uri(uint256 tokenId) external view returns (string memory);

    function insertMainStatement(uint256 tokenid ,string memory dataFormatCID, string memory DBname,string memory description,string memory metadataCID, uint256 minimumRowsOnSubmission, string memory piece_cid) external view returns(string memory);

    function insertAttributeStatement(uint256 tokenid ,string memory trait_type, string memory value1) external view returns(string memory);

    function insertSubmissionStatement(uint256 tokenid ,string memory metadataCID, uint256 rows,address creator) external view returns(string memory);

    function getCreateSubmission() external view returns(string memory);

    function getCreateMain() external view returns(string memory);

    function getCreateAttribute() external view returns(string memory);

    function toNameFromId(string memory prefix, uint256 tableID) external view returns(string memory);

    function toUpdate(string memory prefix, uint256 tableID,string memory set, string memory filter)external view returns(string memory);

    function verifyString(string memory message, uint8 v, bytes32 r, bytes32 s, address pkp) external pure returns (bool res);

}