// File: app/api/apply-to-project/route.ts
import {
    PublicKey,
    SystemProgram,
    Transaction
  } from "@solana/web3.js";
  import { NextRequest } from "next/server";
  import { program } from "@/utils/program";
  import bs58 from "bs58";
  import { ApplicationStatus } from "@/types/application";
  
  export async function POST(request: NextRequest) {
    try {
      const body = await request.json();
  
      // Get basic application fields
      const { 
        walletAddress, 
        projectPublicKey, 
        description, 
      } = body;
  
      if (!walletAddress || !projectPublicKey || !description) {
        return Response.json({
          success: false,
          error: "Missing required fields: wallet address, project ID, and description are required"
        }, {
          status: 400,
        });
      }

      // Create transaction for the Solana program
      const currentWallet = new PublicKey(walletAddress);
      const projectPubKey = new PublicKey(projectPublicKey);
  
      // Get the labour account PDA (user account)
      const [labourAccountPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("User"), currentWallet.toBuffer()],
        program.programId
      );
  
      // Calculate the application PDA
      const [applicationPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("Application"), labourAccountPda.toBuffer(), projectPubKey.toBuffer()],
        program.programId
      );
  
      const blockhashResponse = await program.provider.connection.getLatestBlockhash();
      const tx = new Transaction();
  
      console.log("Labour Account PDA: ", labourAccountPda.toBase58());
      console.log("Project PDA: ", projectPubKey.toBase58());
      console.log("Application PDA: ", applicationPda.toBase58());
  
      // Add application instruction to transaction
      await program.methods
        .applyToProject(description)
        .accounts({
          // @ts-ignore
          labourAccount: labourAccountPda,
          project: projectPubKey,
          application: applicationPda,
          authority: currentWallet,
          systemProgram: SystemProgram.programId,
        })
        .instruction()
        .then(ix => tx.add(ix));
  
      console.log("Transaction created");
  
      tx.recentBlockhash = blockhashResponse.blockhash;
      tx.feePayer = currentWallet;
  
      const serializedTransaction = tx.serialize({ requireAllSignatures: false });
      const base58SerializedTx = bs58.encode(serializedTransaction);
  
      // Prepare expected on-chain application data structure for the response
      const applicationData = {
        labour: labourAccountPda.toBase58(),
        project: projectPubKey.toBase58(),
        description,
        status: ApplicationStatus.Pending,
        timestamp: Math.floor(Date.now() / 1000),
      };
  
      return Response.json({
        success: true,
        serializedTransaction: base58SerializedTx,
        application: applicationData,
        applicationPda: applicationPda.toBase58()
      }, {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
        }
      });
    } catch (error) {
      console.error("Error in apply-to-project route:", error);
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