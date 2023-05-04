"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* istanbul ignore file */
const axios_1 = __importDefault(require("axios"));
const encryptionBrowser_1 = require("../encryptionBrowser");
const lighthouse_config_1 = require("../../../lighthouse.config");
exports.default = async (cid, fileEncryptionKey, mimeType) => {
    const result = await axios_1.default.post(lighthouse_config_1.lighthouseConfig.lighthouseGateway + '/api/v0/cat/' + cid, null, {
        responseType: 'blob',
    });
    const decrypted = await (0, encryptionBrowser_1.decryptFile)(await result.data.arrayBuffer(), fileEncryptionKey);
    if (decrypted) {
        if (mimeType) {
            return new Blob([decrypted], { type: mimeType });
        }
        else {
            return new Blob([decrypted]);
        }
    }
    else {
        return null;
    }
};
