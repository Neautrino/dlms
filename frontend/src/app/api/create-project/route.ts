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
    const body = await request.formData();

    console.log(body);

    // Get basic project fields
    const title = body.get("title") as string;
    const description = body.get("description") as string;
    const dailyRate = body.get("dailyRate") as string;
    const durationDays = body.get("durationDays") as string;
    const maxLabourers = body.get("maxLabourers") as string;
    const projectImage = body.get("projectImage") as File | null;

    // Get additional project details
    const country = body.get("country") as string;
    const state = body.get("state") as string;
    const requiredSkills = body.get("requiredSkills") as string;
    const company = body.get("company") as string;
    const category = body.get("category") as string;
    const managerWalletAddress = body.get("managerWalletAddress") as string;
    const startDate = body.get("startDate") as string | null;
    const applicationDeadline = body.get("applicationDeadline") as string | null

    // Get document descriptions
    const relevantDocDesc = body.get("relevantDocsDescription") as string | null;

    // Handle multiple file uploads for project documentation
    const relevantDocuments = Array.from(body.entries())
      .filter(([key]) => key.startsWith("relevantDocuments"))
      .map(([_, value]) => value as File);

    if (!managerWalletAddress) {
      return Response.json({
        success: false,
        error: "Wallet address is required"
      }, {
        status: 400,
      });
    }

    if (!title || !dailyRate || !durationDays || !maxLabourers || !description ||
      !country || !state || !company || !category || !managerWalletAddress) {
      return Response.json({
        success: false,
        error: "Missing required fields"
      }, {
        status: 400,
      });
    }

    // Validate numeric inputs
    const dailyRateNumber = parseFloat(dailyRate);
    const durationDaysNumber = parseInt(durationDays);
    const maxLabourersNumber = parseInt(maxLabourers);

    if (isNaN(dailyRateNumber) || dailyRateNumber <= 0) {
      return Response.json({
        success: false,
        error: "Daily rate must be a positive number"
      }, { status: 400 });
    }

    if (isNaN(durationDaysNumber) || durationDaysNumber <= 0) {
      return Response.json({
        success: false,
        error: "Duration days must be a positive integer"
      }, { status: 400 });
    }

    if (isNaN(maxLabourersNumber) || maxLabourersNumber <= 0 || maxLabourersNumber > 255) {
      return Response.json({
        success: false,
        error: "Max labourers must be a positive integer not exceeding 255"
      }, { status: 400 });
    }


    // Upload project image if provided
    let projectImageUrl = "";
    if (projectImage && projectImage instanceof File && projectImage.size > 0) {
      projectImageUrl = await uploadFileToPinata(projectImage);
    }




    // Upload multiple relevant documents
    let relevantDocumentsUrl = ""
    if (relevantDocuments.length > 0) {
      const uploaded = await pinata.upload.public.fileArray(relevantDocuments);
      relevantDocumentsUrl = await getUrl(uploaded.cid);
    }



    // Prepare metadata object according to the provided interface
    const metadata: ProjectMetadata = {
      title,
      description,
      location: `${country}, ${state}`,
      requiredSkills: requiredSkills ? requiredSkills.split(",").map(item => item.trim()).filter(Boolean) : [],
      category,
      company,
      managerWalletAddress,
      required_labourer_count: maxLabourersNumber,
      ...(projectImageUrl && { projectImage: projectImageUrl }),
      ...(startDate && { startDate }),
      ...(applicationDeadline && { application_deadline: applicationDeadline }),
      relevant_documents: {
        description: relevantDocDesc || "Project documents",
        uri: relevantDocumentsUrl
      }
    };

    // Upload metadata to Pinata
    const metadataUrl = await uploadMetadataToPinata(metadata);

    // Create transaction for the Solana program
    const currentWallet = new PublicKey(managerWalletAddress);

    // Get the manager account PDA
    const [managerAccountPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("User"), currentWallet.toBuffer()],
      program.programId
    );

    // Get the system state PDA
    const [systemStatePda] = PublicKey.findProgramAddressSync(
      [Buffer.from("System")],
      program.programId
    );

    // Get the system state to calculate the new project PDA
    const systemState = await program.account.systemState.fetch(systemStatePda);
    const projectCount = systemState.projectCount;

    let thisU32 = new BN(projectCount);
    let projectPda = PublicKey.findProgramAddressSync(
      [
        Buffer.from("Project"),
        managerAccountPda.toBuffer(),
        thisU32.toBuffer("le", 4),
      ],
      program.programId
    )[0];

    // Calculate the escrow account PDA
    const [escrowAccountPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("Escrow"), projectPda.toBuffer()],
      program.programId
    );
    // Get manager's token account
    const tokenAccounts = await program.provider.connection.getTokenAccountsByOwner(
      currentWallet,
      { mint: new PublicKey(systemState.mint) }
    );

    if (tokenAccounts.value.length === 0) {
      return Response.json({
        success: false,
        error: "No token account found for the project owner"
      }, { status: 400 });
    }

    const managerTokenAccount = tokenAccounts.value[0].pubkey;

    const blockhashResponse = await program.provider.connection.getLatestBlockhash();
    const tx = new Transaction();

    console.log("Manager PDA: ", managerAccountPda.toBase58());
    console.log("System State PDA: ", systemStatePda.toBase58());
    console.log("Project PDA: ", projectPda.toBase58());
    console.log("Escrow Account PDA: ", escrowAccountPda.toBase58());
    console.log("Metadata URL: ", metadataUrl);

    // Convert dailyRate to lamports/smallest unit (assuming token has 9 decimals like SOL)
    const dailyRateLamports = new BN(Math.floor(dailyRateNumber * 1e9));

    await program.methods
      .createProject(
        title,
        metadataUrl,
        dailyRateLamports,
        durationDaysNumber,
        maxLabourersNumber
      )
      .accounts({
        systemState: systemStatePda,
        // @ts-ignore
        managerAccount: managerAccountPda,
        project: projectPda,
        escrowAccount: escrowAccountPda,
        managerTokenAccount: managerTokenAccount,
        mint: new PublicKey(systemState.mint),
        authority: currentWallet,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      })
      .instruction()
      .then(ix => tx.add(ix));

    console.log("transaction created");

    tx.recentBlockhash = blockhashResponse.blockhash;
    tx.feePayer = currentWallet;

    const serializedTransaction = tx.serialize({ requireAllSignatures: false });
    const base58SerializedTx = bs58.encode(serializedTransaction);

    // Prepare expected on-chain project data structure for the response
    const projectData = {
      manager: managerAccountPda.toBase58(),
      title,
      metadata_uri: metadataUrl,
      daily_rate: dailyRateNumber,
      duration_days: durationDaysNumber,
      max_labourers: maxLabourersNumber,
      labour_count: 0,
      status: ProjectStatus.Open,
      escrow_account: escrowAccountPda.toBase58(),
      timestamp: Math.floor(Date.now() / 1000),
      index: projectCount
    };

    return Response.json({
      success: true,
      metadataUrl,
      lastValidBlockHeight: blockhashResponse.lastValidBlockHeight,
      blockhash: blockhashResponse.blockhash,
      serializedTransaction: base58SerializedTx,
      metadata,
      project: projectData,
      projectPda: projectPda.toBase58(),
      escrowAccountPda: escrowAccountPda.toBase58()
    }, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      }
    });
  } catch (error) {
    console.error("Error in create-project route:", error);
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