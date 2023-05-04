"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* istanbul ignore file */
const axios_1 = __importDefault(require("axios"));
const encryptionNode_1 = require("../encryptionNode");
const lighthouse_config_1 = require("../../../lighthouse.config");
exports.default = async (cid, fileEncryptionKey) => {
    try {
        const result = await axios_1.default.post(lighthouse_config_1.lighthouseConfig.lighthouseGateway + '/api/v0/cat/' + cid, null, {
            responseType: 'arraybuffer',
        });
        const decrypted = await (0, encryptionNode_1.decryptFile)(Buffer.from(result.data), fileEncryptionKey);
        return decrypted;
    }
    catch (error) {
        throw new Error(error.message);
    }
};
