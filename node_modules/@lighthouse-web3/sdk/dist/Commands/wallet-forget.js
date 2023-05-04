"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kleur_1 = require("kleur");
const getNetwork_1 = require("./utils/getNetwork");
async function default_1() {
    getNetwork_1.config.delete('LIGHTHOUSE_GLOBAL_WALLET');
    getNetwork_1.config.delete('LIGHTHOUSE_GLOBAL_PUBLICKEY');
    console.log((0, kleur_1.green)('Wallet Removed!'));
}
exports.default = default_1;
