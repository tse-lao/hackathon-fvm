"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.getNetwork = void 0;
const conf_1 = __importDefault(require("conf"));
const lighthouse_config_1 = require("../../lighthouse.config");
const config = new conf_1.default();
exports.config = config;
function getNetwork() {
    return config.get('LIGHTHOUSE_GLOBAL_NETWORK')
        ? config.get('LIGHTHOUSE_GLOBAL_NETWORK')
        : lighthouse_config_1.lighthouseConfig.network;
}
exports.getNetwork = getNetwork;
