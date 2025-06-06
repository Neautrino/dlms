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
exports.fetchSystemState = void 0;
const utils_1 = require("../utils");
const fetchSystemState = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const systemState = yield utils_1.program.account.systemState.all();
        res.status(200).json(systemState[0]);
    }
    catch (error) {
        console.error('Error fetching system state:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.fetchSystemState = fetchSystemState;
