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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = void 0;
const anchor = __importStar(require("@coral-xyz/anchor"));
const utils_1 = require("../utils");
const web3_js_1 = require("@solana/web3.js");
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUser = web3_js_1.Keypair.fromSecretKey(new Uint8Array([177, 42, 253, 4, 110, 176, 79, 140, 148, 39, 119, 58, 202, 171, 73, 77, 167, 146, 143, 253, 43, 113, 111, 239, 11, 246, 144, 230, 216, 133, 73, 93, 145, 77, 202, 178, 227, 74, 18, 115, 163, 208, 22, 56, 29, 187, 61, 43, 111, 131, 238, 90, 170, 178, 18, 117, 53, 198, 134, 237, 106, 84, 76, 208]));
        const userAddress = newUser.publicKey.toBase58();
        console.log("New user address:", userAddress);
        const [userPda] = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("User"), newUser.publicKey.toBuffer()], utils_1.program.programId);
        const [systemStatePda] = web3_js_1.PublicKey.findProgramAddressSync([Buffer.from("System")], utils_1.program.programId);
        console.log("User PDA:", userPda.toBase58());
        console.log("System State PDA:", systemStatePda.toBase58());
        const balance = yield utils_1.connection.getBalance(newUser.publicKey);
        if (balance < anchor.web3.LAMPORTS_PER_SOL) {
            console.log("Requesting airdrop for the wallet...");
            yield utils_1.connection.confirmTransaction(yield utils_1.connection.requestAirdrop(newUser.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL), "confirmed");
        }
        const tx = yield utils_1.program.methods.registerUser("John Doe", "https://your.pinata.url", { labour: {} })
            .accounts({
            // @ts-ignore
            systemState: systemStatePda,
            // @ts-ignore
            userAccount: userPda,
            authority: newUser.publicKey,
            systemProgram: web3_js_1.SystemProgram.programId,
        })
            .signers([newUser])
            .rpc();
        console.log("Transaction signature:", tx);
        const userAccount = yield utils_1.program.account.userAccount.fetch(userPda);
        console.log("Created user account:", userAccount);
        res.status(200).json({
            message: "User registered successfully",
            userAddress: userAddress,
            txHash: tx
        });
    }
    catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Error in registering user' });
    }
});
exports.registerUser = registerUser;
