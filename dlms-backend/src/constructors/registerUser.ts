import { Request, Response } from "express";
import * as anchor from "@coral-xyz/anchor";
import { connection, program } from "../utils";
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
export const registerUser = async (req: Request, res: Response) => {

    try {
        const newUser = Keypair.fromSecretKey(new Uint8Array([177,42,253,4,110,176,79,140,148,39,119,58,202,171,73,77,167,146,143,253,43,113,111,239,11,246,144,230,216,133,73,93,145,77,202,178,227,74,18,115,163,208,22,56,29,187,61,43,111,131,238,90,170,178,18,117,53,198,134,237,106,84,76,208]));
        const userAddress = newUser.publicKey.toBase58();

        console.log("New user address:", userAddress); 

        const [userPda] = PublicKey.findProgramAddressSync(
            [Buffer.from("User"), newUser.publicKey.toBuffer()],
            program.programId
        );

        const [systemStatePda] = PublicKey.findProgramAddressSync(
            [Buffer.from("System")],
            program.programId
        );

        console.log("User PDA:", userPda.toBase58());
        console.log("System State PDA:", systemStatePda.toBase58());

        const balance = await connection.getBalance(newUser.publicKey);
        if (balance < anchor.web3.LAMPORTS_PER_SOL) {
            console.log("Requesting airdrop for the wallet...");
            await connection.confirmTransaction(
                await connection.requestAirdrop(newUser.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL),
                "confirmed"
            );
        }

        const tx = await program.methods.registerUser("John Doe", "https://your.pinata.url", { labour: {} })
            .accounts({
                // @ts-ignore
                systemState: systemStatePda,
                // @ts-ignore
                userAccount: userPda,
                authority: newUser.publicKey,
                systemProgram: SystemProgram.programId,
            })
            .signers([newUser])
            .rpc();

        console.log("Transaction signature:", tx);

        const userAccount = await program.account.userAccount.fetch(userPda);
        console.log("Created user account:", userAccount);

        res.status(200).json({
            message: "User registered successfully",
            userAddress: userAddress,
            txHash: tx
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Error in registering user' });
    }
}