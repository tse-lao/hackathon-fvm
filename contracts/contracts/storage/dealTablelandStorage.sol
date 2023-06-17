// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "@tableland/evm/contracts/utils/TablelandDeployments.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@tableland/evm/contracts/utils/SQLHelpers.sol";
import {CBOR} from "solidity-cborutils/contracts/CBOR.sol";
import {AccountCBOR} from "@zondax/filecoin-solidity/contracts/v0.8/cbor/AccountCbor.sol";
import {MarketCBOR} from "@zondax/filecoin-solidity/contracts/v0.8/cbor/MarketCbor.sol";
import {MarketTypes} from "@zondax/filecoin-solidity/contracts/v0.8/types/MarketTypes.sol";
import {CommonTypes} from "@zondax/filecoin-solidity/contracts/v0.8/types/CommonTypes.sol";
import {BigNumbers, BigNumber} from "@zondax/solidity-bignumber/src/BigNumbers.sol";
import {BigInts} from "@zondax/filecoin-solidity/contracts/v0.8/utils/BigInts.sol";
import {FilAddresses} from "@zondax/filecoin-solidity/contracts/v0.8/utils/FilAddresses.sol";
import {MarketAPI} from "@zondax/filecoin-solidity/contracts/v0.8/MarketAPI.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "../interfaces/IDealClient.sol";

/** @title DB_NFT. */
/// @author Nick Lionis (github handle : nijoe1 )
/// @notice Use this contract for creating Decentralized datassets with others and sell them as NFTs
/// All the data inside the tables are pointing on an IPFS CID.
contract dealTablelandStorage is IDealClient, AccessControl {
    ITablelandTables private tablelandContract;
    using CBOR for CBOR.CBORBuffer;
    using AccountCBOR for *;
    using MarketCBOR for *;

    bytes32 public constant ADD_DAO_ROLE = keccak256("ADD DAO ROLE");

    bytes32 public constant CONTRACT_CALLER_ROLE = keccak256("CONTRACT CALLER ROLE");

    string private constant REQUEST_TABLE_PREFIX = "request";
    string private constant REQUEST_SCHEMA = "piece_cid text, daoAddress text, requestID text";

    string private constant DEAL_TABLE_PREFIX = "deal";
    string private constant DEAL_SCHEMA = "piece_cid text, dealID text, requestID text";

    string private constant DATA_DAO_OWNER_TABLE_PREFIX = "dao_owner";
    string private constant DATA_DAO_OWNER_SCHEMA =
        "daoAddress text, ownerAddress text, multisigAddress text";

    uint256 storage_price_per_epoch;

    string[] private createStatements;
    string[] public tables;
    uint256[] private tableIDs;
    bytes _request_buffer;
    bytes _extra_params_buffer;

    // ["data_contribution_80001_6068","file_main_80001_6069","file_attribute_80001_6070"]

    // 0xBF62ef1486468a6bd26Dd669C06db43dEd5B849B,0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6
    constructor(address _dealClientFacory) {
        // _baseURIString = 'https://testnets.tableland.network/api/v1/query?format=objects&extract=true&unwrap=true&statement=';
        _grantRole(ADD_DAO_ROLE, _dealClientFacory);
        tablelandContract = TablelandDeployments.get();

        createStatements.push(SQLHelpers.toCreateFromSchema(REQUEST_SCHEMA, REQUEST_TABLE_PREFIX));
        createStatements.push(SQLHelpers.toCreateFromSchema(DEAL_SCHEMA, DEAL_TABLE_PREFIX));

        createStatements.push(
            SQLHelpers.toCreateFromSchema(DATA_DAO_OWNER_SCHEMA, DATA_DAO_OWNER_TABLE_PREFIX)
        );
        tableIDs = tablelandContract.create(address(this), createStatements);

        tables.push(SQLHelpers.toNameFromId(REQUEST_TABLE_PREFIX, tableIDs[0]));
        tables.push(SQLHelpers.toNameFromId(DEAL_TABLE_PREFIX, tableIDs[1]));
        tables.push(SQLHelpers.toNameFromId(DATA_DAO_OWNER_TABLE_PREFIX, tableIDs[2]));
    }

    function mutate(uint256 tableId, string memory statement) internal {
        tablelandContract.mutate(address(this), tableId, statement);
    }

    function serializeDealProposal(DealRequest memory deal) public view returns (bytes memory) {
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
        ret.storage_price_per_epoch = BigInts.fromUint256(deal.storage_price_per_epoch);
        ret.provider_collateral = BigInts.fromUint256(deal.provider_collateral);
        ret.client_collateral = BigInts.fromUint256(deal.client_collateral);
        return MarketCBOR.serializeDealProposal(ret);
    }

    function deserializeDealProposalOnAuthenticate(
        bytes memory params
    ) public pure returns (MarketTypes.DealProposal memory) {
        AccountTypes.AuthenticateMessageParams memory amp = params
            .deserializeAuthenticateMessageParams();
        return MarketCBOR.deserializeDealProposal(amp.message);
    }

    function deserializeDealProposalOnNotify(
        bytes memory params
    )
        public
        pure
        returns (MarketTypes.DealProposal memory, MarketTypes.MarketDealNotifyParams memory)
    {
        MarketTypes.MarketDealNotifyParams memory mdnp = MarketCBOR
            .deserializeMarketDealNotifyParams(params);
        return (MarketCBOR.deserializeDealProposal(mdnp.dealProposal), mdnp);
    }

    function retBuf() public pure returns (bytes memory) {
        CBOR.CBORBuffer memory buf = CBOR.create(1);
        buf.writeBool(true);
        return buf.data();
    }

    // function toUpdateStatus(
    //     string memory status,
    //     uint256 dealID
    // ) public onlyRole(CONTRACT_CALLER_ROLE) {
    //     mutate(
    //         tableIDs[1],
    //         SQLHelpers.toUpdate(
    //             DEAL_TABLE_PREFIX,
    //             tableIDs[1],
    //             string.concat("status='", status, "'"),
    //             string.concat("dealID=", Strings.toString(dealID))
    //         )
    //     );
    // }

    function requestInsertion(
        bytes memory piece_cid,
        bytes32 requestID
    ) public onlyRole(CONTRACT_CALLER_ROLE) {
        mutate(
            tableIDs[0],
            SQLHelpers.toInsert(
                REQUEST_TABLE_PREFIX,
                tableIDs[0],
                "piece_cid, daoAddress, requestID",
                string.concat(
                    SQLHelpers.quote(bytesToString(piece_cid)),
                    ",",
                    SQLHelpers.quote(Strings.toHexString(msg.sender)),
                    ",",
                    SQLHelpers.quote(bytes32ToString(requestID))
                )
            )
        );
    }

    function dealInsertion(
        bytes memory piece_cid,
        uint256 dealID,
        bytes32 requestID
    ) public onlyRole(CONTRACT_CALLER_ROLE) {
        mutate(
            tableIDs[1],
            SQLHelpers.toInsert(
                DEAL_TABLE_PREFIX,
                tableIDs[1],
                "piece_cid, dealID, requestID",
                string.concat(
                    SQLHelpers.quote(bytesToString(piece_cid)),
                    ",",
                    SQLHelpers.quote(Strings.toString(dealID)),
                    ",",
                    SQLHelpers.quote(bytes32ToString(requestID))
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

    function addDAO(
        address newDAO,
        address[] memory owners,
        address multisigAddress
    ) public onlyRole(ADD_DAO_ROLE) {
        _grantRole(CONTRACT_CALLER_ROLE, newDAO);
        uint size = owners.length;
        address owner;
        for (uint i = 0; i < size; ) {
            owner = owners[i];
            mutate(
                tableIDs[2],
                SQLHelpers.toInsert(
                    DATA_DAO_OWNER_TABLE_PREFIX,
                    tableIDs[2],
                    "daoAddress, ownerAddress, multisigAddress",
                    string.concat(
                        SQLHelpers.quote(Strings.toHexString(newDAO)),
                        ",",
                        SQLHelpers.quote(Strings.toHexString(owner)),
                        ",",
                        SQLHelpers.quote(Strings.toHexString(multisigAddress))
                    )
                )
            );
            unchecked {
                ++i;
            }
        }
    }

    function bytesToString(bytes memory data) public pure returns (string memory) {
        // Fixed buffer size for hexadecimal convertion
        bytes memory converted = new bytes(data.length * 2);

        bytes memory _base = "0123456789abcdef";

        for (uint256 i = 0; i < data.length; i++) {
            converted[i * 2] = _base[uint8(data[i]) / _base.length];
            converted[i * 2 + 1] = _base[uint8(data[i]) % _base.length];
        }

        return string(abi.encodePacked("0x", converted));
    }

    function bytes32ToString(bytes32 data) public pure returns (string memory) {
        // Fixed buffer size for hexadecimal convertion
        bytes memory converted = new bytes(data.length * 2);

        bytes memory _base = "0123456789abcdef";

        for (uint256 i = 0; i < data.length; i++) {
            converted[i * 2] = _base[uint8(data[i]) / _base.length];
            converted[i * 2 + 1] = _base[uint8(data[i]) % _base.length];
        }

        return string(abi.encodePacked("0x", converted));
    }

    function addBalance() external payable {
        MarketAPI.addBalance(FilAddresses.fromEthAddress(msg.sender), msg.value);
    }

    function getActivationStatus(
        uint64 dealid
    ) external returns (MarketTypes.GetDealActivationReturn memory ret) {
        return MarketAPI.getDealActivation(dealid);
    }
}
