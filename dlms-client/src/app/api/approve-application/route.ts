// File: app/api/approve-application/route.ts
import {
    PublicKey,
    SystemProgram,
    Transaction
  } from "@solana/web3.js";
  import { NextRequest } from "next/server";
  import { program } from "@/utils/program";
  import bs58 from "bs58";
  export async function POST(request: NextRequest) {
    try {
      const body = await request.json();
  
      // Get required fields
      const { 
        walletAddress,    // Manager's wallet address (signer)
        applicationPda,   // Application to approve
        projectPda,       // Project PDA
        labourAccountPda  // Labour account PDA
      } = body;
  
      if (!walletAddress || !applicationPda || !projectPda || !labourAccountPda) {
        return Response.json({
          success: false,
          error: "Missing required fields: wallet address, application PDA, project PDA, and labour account PDA are required"
        }, {
          status: 400,
        });
      }
  
      // Convert string addresses to PublicKeys
      const currentWallet = new PublicKey(walletAddress);
      const applicationPublicKey = new PublicKey(applicationPda);
      const projectPublicKey = new PublicKey(projectPda);
      const labourAccountPublicKey = new PublicKey(labourAccountPda);
  
      // Get the manager account PDA using USER_STATE seed
      const [managerAccountPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("User"), currentWallet.toBuffer()],
        program.programId
      );
  
      // Fetch the project to get its index
      const projectAccount = await program.account.project.fetch(projectPublicKey);
  
      // Verify the project is managed by this manager
      if (!projectAccount.manager.equals(managerAccountPda)) {
        return Response.json({
          success: false,
          error: "Not authorized to approve applications for this project"
        }, {
          status: 403,
        });
      }
  
      // Verify project is in Open status
      if (!('open' in projectAccount.status)) {
        return Response.json({
          success: false,
          error: "Project is not in Open status"
        }, {
          status: 400,
        });
      }
  
      // Verify project is not full
      if (projectAccount.labourCount >= projectAccount.maxLabourers) {
        return Response.json({
          success: false,
          error: "Project has reached maximum number of labourers"
        }, {
          status: 400,
        });
      }
  
      // Calculate the assignment PDA using ASSIGNMENT seed
      const [assignmentPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("Assignment"), labourAccountPublicKey.toBuffer(), projectPublicKey.toBuffer()],
        program.programId
      );
  
      const blockhashResponse = await program.provider.connection.getLatestBlockhash();
      const tx = new Transaction();
  
      console.log("Manager Account PDA: ", managerAccountPda.toBase58());
      console.log("Project PDA: ", projectPublicKey.toBase58());
      console.log("Application PDA: ", applicationPublicKey.toBase58());
      console.log("Labour Account PDA: ", labourAccountPublicKey.toBase58());
      console.log("Assignment PDA: ", assignmentPda.toBase58());
  
      // Add approve application instruction to transaction
      await program.methods
        .approveApplication()
        .accounts({
          // @ts-ignore - Anchor types don't match exactly but the program expects these names
          application: applicationPublicKey,
          labourAccount: labourAccountPublicKey,
          project: projectPublicKey,
          managerAccount: managerAccountPda,
          assignment: assignmentPda,
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
  
      // Prepare expected on-chain updated data for the response
      const laborCount = projectAccount.labourCount + 1;
      const newStatus = laborCount >= projectAccount.maxLabourers 
        ? { inProgress: {} } 
        : { open: {} };
  
      const assignmentData = {
        labour: labourAccountPublicKey.toBase58(),
        project: projectPublicKey.toBase58(),
        days_worked: 0,
        days_paid: 0,
        active: true,
        timestamp: Math.floor(Date.now() / 1000)
      };
  
      const updatedApplicationData = {
        status: { pending: {} },
        timestamp: Math.floor(Date.now() / 1000)
      };
  
      const updatedProjectData = {
        labour_count: laborCount,
        status: newStatus
      };
  
      return Response.json({
        success: true,
        lastValidBlockHeight: blockhashResponse.lastValidBlockHeight,
			  blockhash: blockhashResponse.blockhash,
        serializedTransaction: base58SerializedTx,
        assignment: assignmentData,
        assignmentPda: assignmentPda.toBase58(),
        updatedApplication: updatedApplicationData,
        updatedProject: updatedProjectData
      }, {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
        }
      });
    } catch (error) {
      console.error("Error in approve-application route:", error);
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