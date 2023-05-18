// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import '@tableland/evm/contracts/utils/TablelandDeployments.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Strings.sol';
import '@tableland/evm/contracts/utils/SQLHelpers.sol';
import {CBOR} from 'solidity-cborutils/contracts/CBOR.sol';
import {AccountCBOR} from '@zondax/filecoin-solidity/contracts/v0.8/cbor/AccountCbor.sol';
import {MarketCBOR} from '@zondax/filecoin-solidity/contracts/v0.8/cbor/MarketCbor.sol';
import {MarketTypes} from '@zondax/filecoin-solidity/contracts/v0.8/types/MarketTypes.sol';
import {AccountTypes} from '@zondax/filecoin-solidity/contracts/v0.8/types/AccountTypes.sol';
import {CommonTypes} from '@zondax/filecoin-solidity/contracts/v0.8/types/CommonTypes.sol';
import {BigNumbers, BigNumber} from '@zondax/solidity-bignumber/src/BigNumbers.sol';
import {BigInts} from '@zondax/filecoin-solidity/contracts/v0.8/utils/BigInts.sol';
import {FilAddresses} from '@zondax/filecoin-solidity/contracts/v0.8/utils/FilAddresses.sol';
import '../interfaces/IDealClient.sol';

/** @title DB_NFT. */
/// @author Nick Lionis (github handle : nijoe1 )
/// @notice Use this contract for creating Decentralized datassets with others and sell them as NFTs
/// All the data inside the tables are pointing on an IPFS CID.
contract dealTablelandStorage is IDealClient, Ownable {
    ITablelandTables private tablelandContract;
    using CBOR for CBOR.CBORBuffer;
    using AccountCBOR for *;
    using MarketCBOR for *;

    string private _baseURIString;

    string private constant REQUEST_TABLE_PREFIX = 'request';
    string private constant REQUEST_SCHEMA =
        'piece_cid text, location_ref text, car_size text, piece_size text, storage_price_per_epoch text, timestampt text, creator text';

    string private constant DEAL_TABLE_PREFIX = 'deal';
    string private constant DEAL_SCHEMA =
        'piece_cid text, dealID text, status text';

    uint256 storage_price_per_epoch;

    string[] private createStatements;
    string[] public tables;
    uint256[] private tableIDs;

    // ["data_contribution_80001_6068","file_main_80001_6069","file_attribute_80001_6070"]

    // 0xBF62ef1486468a6bd26Dd669C06db43dEd5B849B,0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6
    constructor() {
        _baseURIString = 'https://testnets.tableland.network/api/v1/query?statement=';

        tablelandContract = TablelandDeployments.get();

        createStatements.push(
            SQLHelpers.toCreateFromSchema(REQUEST_SCHEMA, REQUEST_TABLE_PREFIX)
        );
        createStatements.push(
            SQLHelpers.toCreateFromSchema(DEAL_SCHEMA, DEAL_TABLE_PREFIX)
        );

        tableIDs = tablelandContract.create(address(this), createStatements);

        tables.push(SQLHelpers.toNameFromId(REQUEST_TABLE_PREFIX, tableIDs[0]));
        tables.push(SQLHelpers.toNameFromId(DEAL_TABLE_PREFIX, tableIDs[1]));
    }

    function mutate(uint256 tableId, string memory statement) internal {
        tablelandContract.mutate(address(this), tableId, statement);
    }

    function deserializeMarketDealNotifyParams(
        bytes memory params
    ) public pure returns (MarketTypes.MarketDealNotifyParams memory) {
        return MarketCBOR.deserializeMarketDealNotifyParams(params);
    }

    function serializeDealProposal(
        DealRequest memory deal
    ) public view returns (bytes memory) {
        MarketTypes.DealProposal memory ret;
        ret.piece_cid = CommonTypes.Cid(deal.piece_cid);
        ret.piece_size = deal.piece_size;
        ret.verified_deal = deal.verified_deal;
        ret.client = FilAddresses.fromEthAddress(address(this));
        // Set a dummy provider. The provider that picks up this deal will need to set its own address.
        ret.provider = FilAddresses.fromActorID(0);
        ret.label = CommonTypes.DealLabel(bytes(deal.label), true);
        ret.start_epoch = CommonTypes.ChainEpoch.wrap(deal.start_epoch);
        ret.end_epoch = CommonTypes.ChainEpoch.wrap(deal.end_epoch);
        ret.storage_price_per_epoch = BigInts.fromUint256(
            deal.storage_price_per_epoch
        );
        ret.provider_collateral = BigInts.fromUint256(deal.provider_collateral);
        ret.client_collateral = BigInts.fromUint256(deal.client_collateral);
        return MarketCBOR.serializeDealProposal(ret);
    }

    function deserializeDealProposal(
        bytes memory params
    ) public pure returns (MarketTypes.DealProposal memory) {
        AccountTypes.AuthenticateMessageParams memory amp = params
            .deserializeAuthenticateMessageParams();
        return MarketCBOR.deserializeDealProposal(amp.message);
    }

    function retBuf() public pure returns (bytes memory) {
        CBOR.CBORBuffer memory buf = CBOR.create(1);
        buf.writeBool(true);
        return buf.data();
    }
    

    function toUpdateStatus(
        string memory status,
        uint256 dealID
    ) public onlyOwner{
         mutate(tableIDs[1],SQLHelpers.toUpdate(DEAL_TABLE_PREFIX, tableIDs[1], string.concat("status='", status, "'"), string.concat('dealID=', Strings.toString(dealID))));
    }


    function requestInsertion(
        string memory piece_cid,
        string memory location_ref,
        uint64 car_size,
        uint64 piece_size,
        uint256 timestampt,
        address creator
    ) public onlyOwner{
        mutate(
            tableIDs[0],
            SQLHelpers.toInsert(
                REQUEST_TABLE_PREFIX,
                tableIDs[0],
                'piece_cid, location_ref, car_size, piece_size, storage_price_per_epoch, timestampt, creator',
                string.concat(
                    SQLHelpers.quote(piece_cid),
                    ',',
                    SQLHelpers.quote(location_ref),
                    ',',
                    SQLHelpers.quote(Strings.toString(car_size)),
                    ',',
                    SQLHelpers.quote(Strings.toString(piece_size)),
                    ',',
                    SQLHelpers.quote(Strings.toString(storage_price_per_epoch)),
                    ',',
                    SQLHelpers.quote(Strings.toString(timestampt)),
                    ',',
                    SQLHelpers.quote(Strings.toHexString(creator))
                )
            )
        );
    }

    function dealInsertion(
        string memory piece_cid,
        uint64 dealID,
        string memory status
    ) public onlyOwner{
        mutate(
            tableIDs[1],
            SQLHelpers.toInsert(
                DEAL_TABLE_PREFIX,
                tableIDs[1],
                'piece_cid, dealID, status',
                string.concat(
                    SQLHelpers.quote(piece_cid),
                    ',',
                    SQLHelpers.quote(Strings.toString(dealID)),
                    ',',
                    SQLHelpers.quote(status)
                )
            )
        );
    }

    function serializeExtraParamsV1(
        ExtraParamsV1 memory params
    ) public pure returns (bytes memory) {
        CBOR.CBORBuffer memory buf = CBOR.create(64);
        buf.startFixedArray(4);
        buf.writeString(params.location_ref);
        buf.writeUInt64(params.car_size);
        buf.writeBool(params.skip_ipni_announce);
        buf.writeBool(params.remove_unsealed_copy);
        return buf.data();
    }
}
