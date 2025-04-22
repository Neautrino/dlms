"use strict";
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
exports.fetchUserStateByAuthority = exports.fetchUserStateByPublicKey = exports.fetchUserState = void 0;
const web3_js_1 = require("@solana/web3.js");
const utils_1 = require("../utils");
const fetchUserState = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userState = yield utils_1.program.account.userAccount.all();
        res.status(200).json(userState);
    }
    catch (error) {
        console.error('Error fetching user state:', error);
        res.status(500).json({ error: 'Error in fetching data' });
    }
});
exports.fetchUserState = fetchUserState;
const fetchUserStateByPublicKey = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userAddress } = req.params;
    if (!userAddress) {
        res.status(400).json({ error: 'User address parameter is required' });
    }
    const pubKey = new web3_js_1.PublicKey(userAddress);
    if (!pubKey) {
        res.status(400).json({ error: 'Invalid user address' });
    }
    try {
        const userState = yield utils_1.program.account.userAccount.fetch(userAddress);
        res.status(200).json(userState);
    }
    catch (error) {
        console.error('Error fetching user state:', error);
        res.status(500).json({ error: 'Internal Server Error: PublicKey does not match' });
    }
});
exports.fetchUserStateByPublicKey = fetchUserStateByPublicKey;
const fetchUserStateByAuthority = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { authority } = req.params;
    if (!authority) {
        res.status(400).json({ error: 'Authority parameter is required' });
    }
    const pubKey = new web3_js_1.PublicKey(authority);
    if (!pubKey) {
        res.status(400).json({ error: 'Invalid authority address' });
    }
    try {
        const userState = yield utils_1.program.account.userAccount.all([
            {
                memcmp: {
                    offset: 8,
                    bytes: pubKey.toBase58(),
                },
            },
        ]);
        res.status(200).json(userState);
    }
    catch (error) {
        console.error('Error fetching user state by authorrity:', error);
        res.status(500).json({ error: 'Internal Server Error: Authority does not match' });
    }
});
exports.fetchUserStateByAuthority = fetchUserStateByAuthority;
