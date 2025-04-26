// Here we export some useful types and functions for interacting with the Anchor program.
import * as anchor from '@coral-xyz/anchor';
import { clusterApiUrl, Connection, Keypair, PublicKey } from '@solana/web3.js'
import idl from './contract/idl.json'
import type { DlmsContract } from './contract/dlms.ts'

export { DlmsContract, idl }

export const DLMS_PROGRAM_ID = new PublicKey("Fm9ozCZNtE94x64Rh5pZv88vVZ8B9rFjjiEArmthiVA")

// Create a connection to the Solana cluster
export const connection = new Connection("https://api.devnet.solana.com", "confirmed");

const wallet = new anchor.Wallet(Keypair.generate());

export const provider = new anchor.AnchorProvider(
  connection,
  wallet,
  { commitment: "confirmed" }
);

anchor.setProvider(provider);

export const program = new anchor.Program(
  idl as DlmsContract,
  provider
) as anchor.Program<DlmsContract>;

// export const program = new anchor.Program(idl as DlmsContract, {
//   connection,
// }) as anchor.Program<DlmsContract>;

