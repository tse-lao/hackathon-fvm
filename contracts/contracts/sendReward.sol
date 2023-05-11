// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@zondax/filecoin-solidity/contracts/v0.8/utils/Actor.sol";
import "@zondax/filecoin-solidity/contracts/v0.8/MarketAPI.sol";

contract sendReward {

    address constant CALL_ACTOR_ID = 0xfe00000000000000000000000000000000000005;
    uint64 constant DEFAULT_FLAG = 0x00000000;
    uint64 constant METHOD_SEND = 0;

    /// @dev Send amount $FIL to the filecoin actor at actor_id 
    /// @dev that contributed to the DAO for replicating a commP
    /// @param actorID: actor at actor_id
    /// @param BountyReward: Amount of $FIL
    function reward(uint64 actorID, uint256 BountyReward) internal {
        bytes memory emptyParams = "";
        delete emptyParams;
        Actor.callByID(CommonTypes.FilActorId.wrap(actorID), METHOD_SEND, Misc.NONE_CODEC, emptyParams, BountyReward, false);
    }


    function call_actor_id(uint64 method, uint256 value, uint64 flags, uint64 codec, bytes memory params, uint64 id) public returns (bool, int256, uint64, bytes memory) {
        (bool success, bytes memory data) = address(CALL_ACTOR_ID).delegatecall(abi.encode(method, value, flags, codec, params, id));
        (int256 exit, uint64 return_codec, bytes memory return_value) = abi.decode(data, (int256, uint64, bytes));
        return (success, exit, return_codec, return_value);
    }

}