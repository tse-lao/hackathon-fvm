"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const lighthouse_config_1 = require("../../lighthouse.config");
exports.default = async (cid) => {
    try {
        const conditions = await axios_1.default.get(lighthouse_config_1.lighthouseConfig.lighthouseBLSNode +
            `/api/fileAccessConditions/get/${cid}`);
        return { data: conditions.data };
    }
    catch (error) {
        throw new Error(error.message);
    }
};
