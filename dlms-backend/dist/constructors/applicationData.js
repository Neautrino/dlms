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
exports.fetchApplicationByProject = exports.fetchApplicationByLabour = exports.fetchAllApplications = void 0;
const web3_js_1 = require("@solana/web3.js");
const utils_1 = require("../utils");
const fetchAllApplications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const applications = yield utils_1.program.account.application.all();
        res.status(200).json(applications);
    }
    catch (error) {
        console.error('Error fetching application state:', error);
        res.status(500).json({ error: 'Error in fetching application data' });
    }
});
exports.fetchAllApplications = fetchAllApplications;
const fetchApplicationByLabour = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { labourAddress } = req.params;
    if (!labourAddress) {
        res.status(400).json({ error: 'Labour address parameter is required' });
    }
    const pubKey = new web3_js_1.PublicKey(labourAddress);
    if (!pubKey) {
        res.status(400).json({ error: 'Invalid labour address' });
    }
    try {
        const applicationState = yield utils_1.program.account.application.all([
            {
                memcmp: {
                    offset: 8,
                    bytes: pubKey.toBase58(),
                },
            },
        ]);
        res.status(200).json(applicationState);
    }
    catch (error) {
        console.error('Error fetching application state:', error);
        res.status(500).json({ error: 'Internal Server Error: PublicKey does not match' });
    }
});
exports.fetchApplicationByLabour = fetchApplicationByLabour;
const fetchApplicationByProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectAddress } = req.params;
    if (!projectAddress) {
        res.status(400).json({ error: 'Project address parameter is required' });
    }
    const pubKey = new web3_js_1.PublicKey(projectAddress);
    if (!pubKey) {
        res.status(400).json({ error: 'Invalid project address' });
    }
    try {
        const applicationState = yield utils_1.program.account.application.all([
            {
                memcmp: {
                    offset: 8 + 32,
                    bytes: pubKey.toBase58(),
                },
            },
        ]);
        res.status(200).json(applicationState);
    }
    catch (error) {
        console.error('Error fetching application state:', error);
        res.status(500).json({ error: 'Internal Server Error: PublicKey does not match' });
    }
});
exports.fetchApplicationByProject = fetchApplicationByProject;
