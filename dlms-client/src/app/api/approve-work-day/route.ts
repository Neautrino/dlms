import { connection, program } from "@/utils/program";
import { BN } from "@coral-xyz/anchor";
import { createAssociatedTokenAccountInstruction, getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { NextResponse } from "next/server";
import bs58 from "bs58";

export async function POST(req: Request) {
    try {
        const { walletAddress, managerPda, projectPda, labourPda, dayNumber } = await req.json();

if (!walletAddress || !managerPda || !projectPda || !labourPda || !dayNumber) {
    throw new Error('One or more required addresses are missing');
}

        // Convert string PDAs to PublicKey objects
        const projectPubkey = new PublicKey(projectPda);
        const labourPubkey = new PublicKey(labourPda);
        const currentWallet = new PublicKey(walletAddress);
        const managerPubkey = new PublicKey(managerPda);


        const [systemStatePda] = PublicKey.findProgramAddressSync(
            [Buffer.from("System")],
            program.programId
          );

        const systemState = await program.account.systemState.fetch(systemStatePda);

        const labourAccount = await program.account.userAccount.fetch(labourPda);

        // Get the assignment account
        const [assignmentPda] = PublicKey.findProgramAddressSync(
            [
                Buffer.from("Assignment"),
                labourPubkey.toBuffer(),
                projectPubkey.toBuffer(),
            ],
            program.programId
        );

        const workdayNumber = new BN(parseInt(dayNumber))
        // Get the work verification account
        const [workVerificationPda] = PublicKey.findProgramAddressSync(
            [
                Buffer.from("Verify"), // match the Rust constant
                labourPubkey.toBuffer(),
                projectPubkey.toBuffer(),
                workdayNumber.toBuffer("le", 2)
            ],
            program.programId
        );

        // Get the escrow account
        const [escrowPda] = PublicKey.findProgramAddressSync(
            [
                Buffer.from("Escrow"),
                projectPubkey.toBuffer(),
            ],
            program.programId
        );

        const mint = new PublicKey(systemState.mint);
        const labourATA = await getAssociatedTokenAddress(
            new PublicKey(systemState.mint),
            labourAccount.authority
        );

        const blockhashResponse = await program.provider.connection.getLatestBlockhash();
    	const tx = new Transaction();

        try {
            await connection.getTokenAccountBalance(labourATA);
        } catch (error) {
            // ATA doesn't exist, create it
            tx.add(
                createAssociatedTokenAccountInstruction(
                    currentWallet, // payer
                    labourATA, // associatedToken
                    labourAccount.authority, // owner
                    mint
                )
            );
        }

         await program.methods
            .approveWorkDay()
            .accounts({
                //@ts-ignore
                managerAccount: managerPubkey,
                project: projectPubkey,
                labourAccount: labourPubkey,
                assignment: assignmentPda,
                workVerification: workVerificationPda,
                escrowAccount: escrowPda,
                labourTokenAccount: labourATA, // This shoulde the actual token account
                authority: currentWallet,
                tokenProgram: TOKEN_PROGRAM_ID,
                systemProgram: SystemProgram.programId,
            })
            .instruction()
      		.then(ix => tx.add(ix));

        // Get the latest blockhash
        tx.recentBlockhash = blockhashResponse.blockhash;
		tx.feePayer = currentWallet;

        const serializedTransaction = tx.serialize({ requireAllSignatures: false });
    	const base58SerializedTx = bs58.encode(serializedTransaction);

        return NextResponse.json({
            success: true,
            lastValidBlockHeight: blockhashResponse.lastValidBlockHeight,
			blockhash: blockhashResponse.blockhash,
			serializedTransaction: base58SerializedTx,
        });
    } catch (error) {
        console.error('Error creating approve work transaction:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to create approve work transaction',
                message: error instanceof Error ? error.message : 'Unknown error occurred'
            },
            { status: 500 }
        );
    }
} 