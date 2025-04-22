"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DLMS_PROGRAM_ID = exports.DlmsIDL = void 0;
exports.getDlmsProgram = getDlmsProgram;
exports.getDlmsProgramId = getDlmsProgramId;
// Here we export some useful types and functions for interacting with the Anchor program.
const anchor_1 = require("@coral-xyz/anchor");
const web3_js_1 = require("@solana/web3.js");
const idl_json_1 = __importDefault(require("./contract/idl.json"));
exports.DlmsIDL = idl_json_1.default;
// The programId is imported from the program IDL.
exports.DLMS_PROGRAM_ID = new web3_js_1.PublicKey(idl_json_1.default.address);
// This is a helper function to get the Votingdapp Anchor program.
function getDlmsProgram(provider, address) {
    return new anchor_1.Program(Object.assign(Object.assign({}, idl_json_1.default), { address: address ? address.toBase58() : idl_json_1.default.address, instructions: idl_json_1.default.instructions }), provider);
}
// This is a helper function to get the program ID for the Votingdapp program depending on the cluster.
function getDlmsProgramId(cluster) {
    switch (cluster) {
        case 'devnet':
        case 'testnet':
            // This is the program ID for the Votingdapp program on devnet and testnet.
            return new web3_js_1.PublicKey('coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF');
        case 'mainnet-beta':
        default:
            return exports.DLMS_PROGRAM_ID;
    }
}
