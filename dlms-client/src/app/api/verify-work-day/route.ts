import {
    PublicKey,
    SystemProgram,
    Transaction
} from "@solana/web3.js";
import { NextRequest } from "next/server";
import { getUrl, pinata, uploadFileToPinata, uploadMetadataToPinata } from "@/utils/config";
import { program } from "@/utils/program";
import bs58 from "bs58";
import { BN } from "@coral-xyz/anchor";

interface WorkVerificationMetadata {
    description: string;
    hours_worked: number;
    tasks_completed: string[];
    challenges_faced?: string;
    next_day_plan?: string;
    work_image?: string;
    supporting_documents?: string;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.formData();

        console.log("Received form data:", body);

        // Get required fields
        const walletAddress = body.get("walletAddress") as string;
        const projectPda = body.get("projectPda") as string;
        const dayNumber = parseInt(body.get("dayNumber") as string);

        // Get work verification details    
        const description = body.get("description") as string;
        const hoursWorked = parseInt(body.get("hoursWorked") as string);
        const tasksCompleted = (body.get("tasksCompleted") as string).split(",").map(task => task.trim());
        const challengesFaced = body.get("challengesFaced") as string;
        const nextDayPlan = body.get("nextDayPlan") as string;

        // Handle work images
        const workImages = Array.from(body.entries())
            .filter(([key]) => key === "workImages")
            .map(([_, value]) => value as File);

        // Handle supporting documents
        const supportingDocuments = body.get("supportingDocuments") as File | null;

        if (!walletAddress || !projectPda || !dayNumber || !description || !hoursWorked || !tasksCompleted.length) {
            return Response.json({
                success: false,
                error: "Missing required fields: wallet address, project PDA, day number, description, hours worked, and tasks completed are required"
            }, {
                status: 400,
            });
        }

        // Upload work images if provided
        let workImagesUrl;
        if (workImages.length > 0) {
            const uploaded = await pinata.upload.public.fileArray(workImages);
            console.log("Uploaded:", uploaded)
            workImagesUrl = await getUrl(uploaded.cid);
        }

        // Upload supporting documents if provided
        let supportingDocumentsUrl = "";
        if (supportingDocuments && supportingDocuments instanceof File && supportingDocuments.size > 0) {
            supportingDocumentsUrl = await uploadFileToPinata(supportingDocuments);
            console.log("supporting", supportingDocumentsUrl)
        }

        // Prepare metadata object
        const metadata: WorkVerificationMetadata = {
            description,
            hours_worked: hoursWorked,
            tasks_completed: tasksCompleted,
            ...(challengesFaced && { challenges_faced: challengesFaced }),
            ...(nextDayPlan && { next_day_plan: nextDayPlan }),
            ...(workImagesUrl && { work_images: workImagesUrl }),
            ...(supportingDocumentsUrl && { supporting_documents: supportingDocumentsUrl })
        };

        // Upload metadata to Pinata
        const metadataUrl = await uploadMetadataToPinata(metadata);

        // Convert string addresses to PublicKeys
        const currentWallet = new PublicKey(walletAddress);
        const projectPublicKey = new PublicKey(projectPda);

        // Get the labour account PDA
        const [labourAccountPda] = PublicKey.findProgramAddressSync(
            [Buffer.from("User"), currentWallet.toBuffer()],
            program.programId
        );

        // Get the assignment PDA
        const [assignmentPda] = PublicKey.findProgramAddressSync(
            [Buffer.from("Assignment"), labourAccountPda.toBuffer(), projectPublicKey.toBuffer()],
            program.programId
        );

        const assignment = await program.account.assignment.fetch(assignmentPda);
        const nextWorkDay = new BN(assignment.daysWorked + 1);
        const [workVerificationPda] = PublicKey.findProgramAddressSync(
            [
                Buffer.from("Verify"), // match the Rust constant
                labourAccountPda.toBuffer(),
                projectPublicKey.toBuffer(),
                nextWorkDay.toBuffer("le", 2)
            ],
            program.programId
        );

        // Fetch project and assignment data to validate constraints
        const projectAccount = await program.account.project.fetch(projectPublicKey);
        const assignmentAccount = await program.account.assignment.fetch(assignmentPda);

        // Validate project is active
        if (!('inProgress' in projectAccount.status) && !('open' in projectAccount.status)) {
            return Response.json({
                success: false,
                error: "Project is not active"
            }, {
                status: 400,
            });
        }

        // Validate assignment is active
        if (!assignmentAccount.active) {
            return Response.json({
                success: false,
                error: "Assignment is not active"
            }, {
                status: 400,
            });
        }

        // Validate day number
        if (dayNumber !== assignmentAccount.daysWorked + 1) {
            return Response.json({
                success: false,
                error: "Invalid day number"
            }, {
                status: 400,
            });
        }

        const blockhashResponse = await program.provider.connection.getLatestBlockhash();
        const tx = new Transaction();

        console.log("Labour Account PDA: ", labourAccountPda.toBase58());
        console.log("Project PDA: ", projectPublicKey.toBase58());
        console.log("Assignment PDA: ", assignmentPda.toBase58());
        console.log("Work Verification PDA: ", workVerificationPda.toBase58());
        console.log("Metadata URL: ", metadataUrl);

        // Add verify work day instruction to transaction
        await program.methods
            .verifyWorkDay(
                dayNumber,
                metadataUrl
            )
            .accounts({
                // @ts-ignore - Anchor types don't match exactly but the program expects these names
                labourAccount: labourAccountPda,
                project: projectPublicKey,
                assignment: assignmentPda,
                workVerification: workVerificationPda,
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

        // Prepare expected on-chain work verification data structure for the response
        const workVerificationData = {
            project: projectPublicKey.toBase58(),
            labour: labourAccountPda.toBase58(),
            day_number: dayNumber,
            manager_verified: false,
            labour_verified: true,
            metadata_uri: metadataUrl,
            timestamp: Math.floor(Date.now() / 1000),
            payment_processed: false
        };

        return Response.json({
            success: true,
            lastValidBlockHeight: blockhashResponse.lastValidBlockHeight,
            blockhash: blockhashResponse.blockhash,
            serializedTransaction: base58SerializedTx,
            workVerification: workVerificationData,
            workVerificationPda: workVerificationPda.toBase58(),
            metadata
        }, {
            status: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
            }
        });
    } catch (error) {
        console.error("Error in verify-work-day route:", error);
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