"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kavach_1 = require("@lighthouse-web3/kavach");
exports.default = async (publicKey, cid, signedMessage, conditions, aggregator = undefined, chainType = 'evm') => {
    // send encryption key
    const { isSuccess, error } = await (0, kavach_1.accessControl)(publicKey, cid, signedMessage, conditions, aggregator, chainType);
    if (error) {
        throw error;
    }
    return { data: { cid: cid, status: 'Success' } };
};
