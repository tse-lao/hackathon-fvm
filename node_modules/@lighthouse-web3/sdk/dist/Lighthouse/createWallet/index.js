"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const ethers_1 = require("ethers");
const lighthouse_config_1 = require("../../lighthouse.config");
exports.default = async (password) => {
    try {
        const wallet = ethers_1.ethers.Wallet.createRandom();
        const _ = await axios_1.default.get(lighthouse_config_1.lighthouseConfig.lighthouseAPI +
            `/api/auth/get_message?publicKey=${wallet.address}`);
        const encryptedWallet = await wallet.encrypt(password);
        /*
          return:
            {
              data: {
                encryptedWallet: `{"address":"ee98ba4b911ba9c13eaf44b5b81d1217bc8c0ee3","id":"f05692b3-f06d-4ed9-948b-93ab3260555e","version":3,"Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"5c469bc090e91849761a053e3c3792e0"},"ciphertext":"a5868bab7b10fbb0d74267ef97bdbb0f812b646954a16fc929a1621a27b084d2","kdf":"scrypt","kdfparams":{"salt":"bd96e53b53a61732533e3f77f16f3d73a450269bf2508f4878d4a0940180e89e","n":131072,"dklen":32,"p":1,"r":8},"mac":"bcde1c8a5e8b99ec3f214da88223da7f75f1d92c56f125352fae9207f34cebd9"},"x-ethers":{"client":"ethers.js","gethFilename":"UTC--2022-09-13T08-03-14.0Z--ee98ba4b911ba9c13eaf44b5b81d1217bc8c0ee3","mnemonicCounter":"effdf7fc9f51d1ca4d6c2ae771bfc4c6","mnemonicCiphertext":"41c68bf6c315ff02c5c95f26b15c5b63","path":"m/44'/60'/0'/0/0","locale":"en","version":"0.1"}}`
              }
            }
        */
        return { data: { encryptedWallet } };
    }
    catch (error) {
        throw new Error(error.message);
    }
};
