import * as anchor from '@coral-xyz/anchor';
import { Connection, PublicKey } from '@solana/web3.js'
import idl from '../contract/idl.json'
import type { DlmsContract } from '../contract/dlms.ts'

export { DlmsContract, idl }

export const DLMS_PROGRAM_ID = new PublicKey("Fm9ozCZNtE94x64Rh5pZv88vVZ8B9rFjjiEArmthiVA")

// Create a connection to the Solana cluster
export const connection = new Connection("https://api.devnet.solana.com", "confirmed");

// Create provider without wallet
export const provider = new anchor.AnchorProvider(
  connection,
  {} as any, // Mock wallet object
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

