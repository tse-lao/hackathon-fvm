"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const lighthouse_config_1 = require("../../lighthouse.config");
exports.default = async (cid) => {
    try {
        const dealStatus = (await axios_1.default.get(lighthouse_config_1.lighthouseConfig.lighthouseAPI +
            `/api/lighthouse/deal_status?cid=${cid}`)).data;
        return { data: dealStatus };
    }
    catch (error) {
        throw new Error(error.message);
    }
};
