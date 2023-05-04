"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAddress = exports.hashMessage = exports.verifyMessage = void 0;
const ethers_1 = require("ethers");
exports.verifyMessage = (_a = ethers_1.utils === null || ethers_1.utils === void 0 ? void 0 : ethers_1.utils.verifyMessage) !== null && _a !== void 0 ? _a : ethers_1.verifyMessage;
exports.hashMessage = (_b = ethers_1.utils === null || ethers_1.utils === void 0 ? void 0 : ethers_1.utils.hashMessage) !== null && _b !== void 0 ? _b : ethers_1.hashMessage;
exports.getAddress = (_c = ethers_1.utils === null || ethers_1.utils === void 0 ? void 0 : ethers_1.utils.getAddress) !== null && _c !== void 0 ? _c : ethers_1.getAddress;
