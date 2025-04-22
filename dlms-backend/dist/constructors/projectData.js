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
exports.fetchProjectByManagerAddress = exports.fetchProjectByPublicKey = exports.fetchAllProjects = void 0;
const web3_js_1 = require("@solana/web3.js");
const utils_1 = require("../utils");
const fetchAllProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projects = yield utils_1.program.account.project.all();
        res.status(200).json(projects);
    }
    catch (error) {
        console.error('Error fetching project state:', error);
        res.status(500).json({ error: 'Error in fetching project data' });
    }
});
exports.fetchAllProjects = fetchAllProjects;
const fetchProjectByPublicKey = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { projectAddress } = req.params;
    if (!projectAddress) {
        res.status(400).json({ error: 'Project address parameter is required' });
    }
    const pubKey = new web3_js_1.PublicKey(projectAddress);
    if (!pubKey) {
        res.status(400).json({ error: 'Invalid project address' });
    }
    try {
        const projectState = yield utils_1.program.account.project.fetch(projectAddress);
        res.status(200).json(projectState);
    }
    catch (error) {
        console.error('Error fetching project state:', error);
        res.status(500).json({ error: 'Internal Server Error: PublicKey does not match' });
    }
});
exports.fetchProjectByPublicKey = fetchProjectByPublicKey;
const fetchProjectByManagerAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { managerAddress } = req.params;
    if (!managerAddress) {
        res.status(400).json({ error: 'Authority parameter is required' });
    }
    const pubKey = new web3_js_1.PublicKey(managerAddress);
    if (!pubKey) {
        res.status(400).json({ error: 'Invalid authority address' });
    }
    try {
        const projectState = yield utils_1.program.account.project.all([
            {
                memcmp: {
                    offset: 8,
                    bytes: pubKey.toBase58(),
                },
            },
        ]);
        res.status(200).json(projectState);
    }
    catch (error) {
        console.error('Error fetching project state:', error);
        res.status(500).json({ error: 'Internal Server Error: Address does not match' });
    }
});
exports.fetchProjectByManagerAddress = fetchProjectByManagerAddress;
