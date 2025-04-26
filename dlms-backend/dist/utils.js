"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.program = exports.connection = exports.DLMS_PROGRAM_ID = exports.idl = void 0;
// Here we export some useful types and functions for interacting with the Anchor program.
const anchor = __importStar(require("@coral-xyz/anchor"));
const web3_js_1 = require("@solana/web3.js");
const idl_json_1 = __importDefault(require("./contract/idl.json"));
exports.idl = idl_json_1.default;
exports.DLMS_PROGRAM_ID = new web3_js_1.PublicKey("Fm9ozCZNtE94x64Rh5pZv88vVZ8B9rFjjiEArmthiVA");
// Create a connection to the Solana cluster
exports.connection = new web3_js_1.Connection("https://api.devnet.solana.com", "confirmed");
// const wallet = new anchor.Wallet(Keypair.generate());
// export const provider = new anchor.AnchorProvider(
//   connection,
//   wallet,
//   { commitment: "confirmed" }
// );
// anchor.setProvider(provider);
// export const program = new anchor.Program(
//   idl as DlmsContract,
//   provider
// ) as anchor.Program<DlmsContract>;
exports.program = new anchor.Program(idl_json_1.default, {
    connection: exports.connection,
});
