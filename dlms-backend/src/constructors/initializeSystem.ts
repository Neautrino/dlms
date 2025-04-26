import { Keypair, PublicKey, SystemProgram, SendTransactionError, Transaction } from "@solana/web3.js";
import { program, provider } from "../utils";
import { Request, Response, RequestHandler } from "express";
import * as anchor from "@coral-xyz/anchor";
import { web3 } from "@coral-xyz/anchor";
import bs58 from "bs58";

export const initializeSystem: RequestHandler = async (req, res) => {
  try {
    const {userAddress, mintAddress} = req.body;
    if (!userAddress || !mintAddress) {
      res.status(400).json({ error: 'User address and mint address are required' });
      return;
    }

    const userPubkey = new PublicKey(userAddress);
    const mintPubkey = new PublicKey(mintAddress);

    // Derive System PDA
    const [systemStatePda] = PublicKey.findProgramAddressSync(
      [Buffer.from("System")],
      program.programId
    );

    const blockhashResponse = await program.provider.connection.getLatestBlockhash();

    const tx = new Transaction();
    
    await program.methods
      .initializeSystem(mintPubkey)
      .accounts({
        // @ts-ignore
        systemState: systemStatePda,
        authority: userPubkey,
        systemProgram: SystemProgram.programId,
      })
      .instruction()
      .then(ix => tx.add(ix));

    tx.recentBlockhash = blockhashResponse.blockhash;
    tx.feePayer = userPubkey;
    
    const serializedTransaction = tx.serialize({ requireAllSignatures: false });
    const base58SerializedTx = bs58.encode(serializedTransaction);

    res.status(200).json({ 
      serializedTransaction: base58SerializedTx
    });
  } catch (error: any) {
    console.error('Error initializing system:', error);
    if (error instanceof SendTransactionError) {
      const logs = await error.getLogs(program.provider.connection);
      console.error('Simulation logs:', logs);
    }
    res.status(500).json({ 
      error: 'Error in initializing system', 
      details: error instanceof SendTransactionError ? 'Check server logs for simulation logs.' : error.message 
    });
  }
};