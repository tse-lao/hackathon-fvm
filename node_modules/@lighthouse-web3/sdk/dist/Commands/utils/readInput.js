"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const read_1 = __importDefault(require("read"));
/*
  Function to read input from command line
  * @return string containing cli input.
  * @param {object} object containing options for read.

  example:
  const options = {
    prompt: "Set a password for your wallet:",
    silent: true,
  };
  
*/
exports.default = async (options) => {
    return new Promise(function (resolve, reject) {
        (0, read_1.default)(options, async (err, result) => {
            result ? resolve(result.trim()) : reject(err);
        });
    });
};
