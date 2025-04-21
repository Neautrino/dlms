// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import DlmsIDL from './contract/idl.json'
import type { DlmsContract } from './contract/dlms.ts'

// Re-export the generated IDL and type
export { DlmsContract, DlmsIDL }

// The programId is imported from the program IDL.
export const DLMS_PROGRAM_ID = new PublicKey(DlmsIDL.address)

// This is a helper function to get the Votingdapp Anchor program.
export function getDlmsProgram(provider: AnchorProvider, address?: PublicKey) {
  return new Program({
    ...DlmsIDL,
    address: address ? address.toBase58() : DlmsIDL.address,
    instructions: DlmsIDL.instructions
  }, provider)
}

// This is a helper function to get the program ID for the Votingdapp program depending on the cluster.
export function getDlmsProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Votingdapp program on devnet and testnet.
      return new PublicKey('coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF')
    case 'mainnet-beta':
    default:
      return DLMS_PROGRAM_ID
  }
}    
