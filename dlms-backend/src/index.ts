import * as anchor from '@coral-xyz/anchor';
import { DLMS_PROGRAM_ID } from './utils';
import { clusterApiUrl, Connection } from '@solana/web3.js';
import idl from './contract/idl.json';
import type { DlmsContract } from './contract/dlms.ts'

 
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
 
export const program = new anchor.Program(idl as unknown as DlmsContract, {
  connection,
});

const programId = DLMS_PROGRAM_ID;

console.log("connection", connection);
console.log("programId", programId.toBase58());
console.log("program", program.programId.toBase58());