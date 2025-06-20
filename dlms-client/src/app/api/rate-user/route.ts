// File: app/api/create-project/route.ts
import {
    PublicKey,
    SystemProgram,
    SYSVAR_RENT_PUBKEY,
    Transaction
  } from "@solana/web3.js";
  import { NextRequest } from "next/server";
  import { getUrl, pinata, uploadFileToPinata, uploadMetadataToPinata } from "@/utils/config";
  import { ProjectMetadata, ProjectStatus } from "@/types/project";
  import { program } from "@/utils/program";
  import bs58 from "bs58";
  import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
  import { BN } from "@coral-xyz/anchor";
  
  export async function POST(request: NextRequest) {
    try {
      const body = await request.json();
  
      // Get required fields
      const { rating, context, userAddress, reviewerAddress } = body;
  
      if (!rating || !context || !userAddress || !reviewerAddress) {
        return Response.json({
          success: false,
          error: "Missing required fields"
        }, {
          status: 400,
        });
      }

      if (reviewerAddress === userAddress) {
        return Response.json({
          success: false,
          error: "You cannot rate yourself"
        }, { status: 400 });
      }
  
      // Validate rating
      const ratingNumber = parseInt(rating);
      if (isNaN(ratingNumber) || ratingNumber < 1 || ratingNumber > 5) {
        return Response.json({
          success: false,
          error: "Rating must be between 1 and 5"
        }, { status: 400 });
      }
  
      // Get the user account PDA
      const [userAccountPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("User"), new PublicKey(userAddress).toBuffer()],
        program.programId
      );
  
      // Get the review account PDA
      const [reviewPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("Review"), new PublicKey(reviewerAddress).toBuffer(), userAccountPda.toBuffer()],
        program.programId
      );

      const currentWallet = new PublicKey(reviewerAddress);
  
      const blockhashResponse = await program.provider.connection.getLatestBlockhash();
    	const tx = new Transaction();
  
      await program.methods
        .rateUser(
          ratingNumber,
          context
        )
        .accounts({
          // @ts-ignore
          userAccount: userAccountPda,
          review: reviewPda,
          authority: currentWallet,
          systemProgram: SystemProgram.programId,
        })
        .instruction()
        .then(ix => tx.add(ix));
  
      tx.recentBlockhash = blockhashResponse.blockhash;
      tx.feePayer = currentWallet;
  
      const serializedTransaction = tx.serialize({ requireAllSignatures: false });
      const base58SerializedTx = bs58.encode(serializedTransaction);
  
      return Response.json({
        success: true,
        lastValidBlockHeight: blockhashResponse.lastValidBlockHeight,
			blockhash: blockhashResponse.blockhash,
        serializedTransaction: base58SerializedTx,
        userAccountPda: userAccountPda.toBase58(),
        reviewPda: reviewPda.toBase58()
      }, {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
        }
      });
    } catch (error) {
      console.error("Error in rate-user route:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
  
      return Response.json({
        success: false,
        error: errorMessage
      }, {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        }
      });
    }
  }
  
  // Handle OPTIONS request for CORS
  export async function OPTIONS() {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }