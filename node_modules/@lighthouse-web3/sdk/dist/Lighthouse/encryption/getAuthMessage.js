"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../utils/util");
const kavach_1 = require("@lighthouse-web3/kavach");
exports.default = async (publicKey) => {
    const address = (0, util_1.addressValidator)(publicKey);
    if (!address) {
        throw new Error('Invalid public Key');
    }
    const { error, message } = await (0, kavach_1.getAuthMessage)(publicKey);
    if (error) {
        throw error;
    }
    /*
      return:
        { data: { message: 'Please sign this message to prove you are owner of this account: 269e5d45-caf7-474d-8167-ab6b140e0249' } }
    */
    return { data: { message } };
};
