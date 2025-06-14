import { PublicKey, Transaction } from '@solana/web3.js';
import { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction } from '@solana/spl-token';
import { connection, program } from "@/utils/program";
import { BN } from "@coral-xyz/anchor";

export async function POST(req: Request) {
    try {
        const { userPubkey, amount } = await req.json();
        const user = new PublicKey(userPubkey);

        // Get the system state PDA
        const [systemStatePda] = PublicKey.findProgramAddressSync(
            [Buffer.from("System")],
            program.programId
        );
        
        const tokenDecimals = Number(process.env.TOKEN_DECIMALS || '9');
        const tokenAmount = amount * 10 ** tokenDecimals;

        // Get the mint authority PDA
        const [mintAuthorityPDA, mintBump] = PublicKey.findProgramAddressSync(
            [Buffer.from("mint")],
            program.programId
        );

        // Get the system state account data
        const systemState = await program.account.systemState.fetch(systemStatePda);
        
        // Get the mint account from the system state
        const mint = systemState.mint;

        // Get the user's ATA (Associated Token Account)
        const userATA = await getAssociatedTokenAddress(
            new PublicKey(mint),
            user
        );

        // Check if user's ATA exists
        let transaction = new Transaction();
        
        try {
            await connection.getTokenAccountBalance(userATA);
        } catch (error) {
            // ATA doesn't exist, create it
            transaction.add(
                createAssociatedTokenAccountInstruction(
                    user, // payer
                    userATA, // associatedToken
                    user, // owner
                    new PublicKey(mint) // mint
                )
            );
        }

        // Create the mint token instruction
        const mintTokenIx = await program.methods
            .mintToken(new BN(tokenAmount))
            .accounts({
                systemState: systemStatePda,
                mint: new PublicKey(mint),
                // @ts-ignore
                mintAuthority: mintAuthorityPDA,
                to: userATA,
                tokenProgram: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA') // SPL Token program ID
            })
            .instruction();

        // Add the mint token instruction to the transaction
        transaction.add(mintTokenIx);
        
        // Set recent blockhash and fee payer
        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        transaction.feePayer = user;

        // Serialize the transaction
        const serializedTransaction = transaction.serialize({
            requireAllSignatures: false,
            verifySignatures: false
        });

        // Return the serialized transaction to be signed by the client
        return new Response(JSON.stringify({
            transaction: Buffer.from(serializedTransaction).toString('base64'),
            message: 'Transaction created successfully'
        }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Error creating mint transaction:', error);
        return new Response(JSON.stringify({
            error: 'Failed to create transaction',
            message: error instanceof Error ? error.message : 'Unknown error occurred'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}