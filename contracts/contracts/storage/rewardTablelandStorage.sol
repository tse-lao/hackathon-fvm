// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@tableland/evm/contracts/utils/SQLHelpers.sol";
import "@tableland/evm/contracts/utils/TablelandDeployments.sol";

/** @title DB_NFT. */
/// @author Nick Lionis (github handle : nijoe1 )
/// @notice Use this contract for creating Decentralized datassets with others and sell them as NFTs
/// All the data inside the tables are pointing on an IPFS CID.
contract rewardTablelandStorage is Ownable {
    ITablelandTables private tablelandContract;
    string[] private createStatements;
    string[] public tables;
    uint256[] private tableIDs;

    uint256 bounty_tableID;
    string public bounty_tableName;
    string private constant BOUNTY_TABLE_PREFIX = "bounty";
    string private constant BOUNTY_SCHEMA =
        "label text, location_ref text, donatedTokens text, size text, minAcceptedDealDuration text";

    uint256 claim_tableID;
    string public claim_tableName;
    string private constant CLAIM_TABLE_PREFIX = "claim";
    string private constant CLAIM_SCHEMA =
        "label text, dealID text, client text, provider text, activationEpoch text, dealEndEpoch text";

    constructor() {
        tablelandContract = TablelandDeployments.get();
        createStatements.push(SQLHelpers.toCreateFromSchema(BOUNTY_SCHEMA, BOUNTY_TABLE_PREFIX));
        createStatements.push(SQLHelpers.toCreateFromSchema(CLAIM_SCHEMA, CLAIM_TABLE_PREFIX));

        tableIDs = tablelandContract.create(address(this), createStatements);

        tables.push(SQLHelpers.toNameFromId(BOUNTY_TABLE_PREFIX, tableIDs[0]));
        tables.push(SQLHelpers.toNameFromId(CLAIM_TABLE_PREFIX, tableIDs[1]));

        setTableInfo(tables[0], tableIDs[0], tables[1], tableIDs[1]);
    }

    function setTableInfo(
        string memory bountytableName,
        uint256 bountytableID,
        string memory claimtableName,
        uint256 claimtableID
    ) internal {
        bounty_tableName = bountytableName;
        bounty_tableID = bountytableID;
        claim_tableName = claimtableName;
        claim_tableID = claimtableID;
    }

    function updateDonatedTokens(string memory label, uint256 donatedTokens) public onlyOwner {
        string memory set = string.concat("donatedTokens='", Strings.toString(donatedTokens), "'");
        string memory filter = string.concat("label=", label);
        mutate(
            bounty_tableID,
            SQLHelpers.toUpdate(BOUNTY_TABLE_PREFIX, bounty_tableID, set, filter)
        );
    }



    function bountyInsertion(
        string memory label,
        string memory location_ref,
        uint256 donatedTokens,
        uint256 size,
        int64 minAcceptedDealDuration
    ) public onlyOwner {
        mutate(
            bounty_tableID,
            SQLHelpers.toInsert(
                BOUNTY_TABLE_PREFIX,
                bounty_tableID,
                "label, location_ref, donatedTokens, size, minAcceptedDealDuration",
                string.concat(
                    SQLHelpers.quote(label),
                    ",",
                    SQLHelpers.quote(location_ref),
                    ",",
                    SQLHelpers.quote(Strings.toString(donatedTokens)),
                    ",",
                    SQLHelpers.quote(Strings.toString(size)),
                    ",",
                    SQLHelpers.quote(Strings.toString(uint(int(minAcceptedDealDuration))))
                )
            )
        );
    }

    function claimInsertion(
        string memory label,
        uint64 dealID,
        uint64 client,
        uint64 provider,
        int64 activationEpoch,
        int64 dealEndEpoch
    ) public onlyOwner {
        mutate(
            claim_tableID,
            SQLHelpers.toInsert(
                CLAIM_TABLE_PREFIX,
                claim_tableID,
                "label, dealID, client, provider, activationEpoch, dealEndEpoch",
                string.concat(
                    SQLHelpers.quote(label),
                    ",",
                    SQLHelpers.quote(Strings.toString(dealID)),
                    ",",
                    SQLHelpers.quote(Strings.toString(client)),
                    ",",
                    SQLHelpers.quote(Strings.toString(provider)),
                    ",",
                    SQLHelpers.quote(Strings.toString(uint(int(activationEpoch)))),
                    ",",
                    SQLHelpers.quote(Strings.toString(uint(int(dealEndEpoch))))
                )
            )
        );
    }

    function mutate(uint256 tableId, string memory statement) internal {
        tablelandContract.mutate(address(this), tableId, statement);
    }
}
