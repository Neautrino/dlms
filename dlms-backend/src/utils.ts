// Here we export some useful types and functions for interacting with the Anchor program.
import * as anchor from '@coral-xyz/anchor';
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js'
import idl from './contract/idl.json'
import type { DlmsContract } from './contract/dlms.ts'

export { DlmsContract, idl }

export const DLMS_PROGRAM_ID = new PublicKey(idl.address)

export const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

export const program = new anchor.Program(idl as DlmsContract, {
  connection,
}) as anchor.Program<DlmsContract>;

