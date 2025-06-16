// File: app/api/register-labor/route.ts
import {
	PublicKey,
	SystemProgram,
	Transaction
} from "@solana/web3.js";
import { NextRequest } from "next/server";
import { getUrl, pinata, uploadFileToPinata, uploadMetadataToPinata } from "@/utils/config";
import { ManagerMetadata } from "@/types/user";
import { program } from "@/utils/program";
import bs58 from "bs58";

export async function POST(request: NextRequest) {
	try {
		const body = await request.formData();

		console.log(body);

		// Get basic form fields
		const name = body.get("name") as string;
		const bio = body.get("bio") as string;
		const profileImage = body.get("profileImage") as File | null;
		const walletAddress = body.get("walletAddress") as string;
		const gender = body.get("gender") as string;
		const dateOfBirth = body.get("dateOfBirth") as string;
		const languages = body.get("languages") as string;
		const city = body.get("city") as string;
		const state = body.get("state") as string;
		const postalCode = body.get("postalCode") as string;
		const country = body.get("country") as string;
		const verificationDocuments = body.get("verificationDocuments") as File | null;

		// Get work details
		const company = body.get("company") as string;
		const industryFocus = body.get("industryFocus") as string;
		const founded = body.get("founded") as string;
		const location = body.get("location") as string;
		const managementExperience = body.get("managementExperience") as string;

		// Handle multiple file uploads
		const relevantDocuments = Array.from(body.entries())
			.filter(([key]) => key.startsWith("relevantDocuments"))
			.map(([_, value]) => value as File);

		if (!walletAddress) {
			return Response.json({
				success: false,
				error: "Wallet address is required"
			}, {
				status: 400,
			});
		}
		// Upload profile image if provided
		let profileImageUrl = "";
		if (profileImage && profileImage instanceof File && profileImage.size > 0) {
			profileImageUrl = await uploadFileToPinata(profileImage);
		}

		// Upload verification document if provided
		let verificationDocumentsUrl = "";
		if (verificationDocuments && verificationDocuments instanceof File && verificationDocuments.size > 0) {
			verificationDocumentsUrl = await uploadFileToPinata(verificationDocuments);
		}

		// Upload multiple relevant documents
		let relevantDocumentsUrl = ""
		if (relevantDocuments.length > 0) {
			const uploaded = await pinata.upload.public.fileArray(relevantDocuments);
			relevantDocumentsUrl = await getUrl(uploaded.cid);
		}

		// Prepare metadata object with proper type conversions
		const metadata: ManagerMetadata = {
			name,
			bio,
			...(profileImageUrl && { profileImage: profileImageUrl }),
			...(gender && { gender }),
			...(dateOfBirth && { dateOfBirth: new Date(dateOfBirth) }),
			...(languages && { languages: languages.split(",").map(item => item.trim()).filter(Boolean) }),
			...(city && { city }),
			...(state && { state }),
			...(postalCode && { postalCode }),
			...(country && { country }),
			...(verificationDocumentsUrl && { verificationDocuments: verificationDocumentsUrl }),
			...(company && { company }),
			...(industryFocus && { industryFocus }),
			...(founded && { founded: parseInt(founded) }),
			...(location && { location }),
			...(managementExperience && { managementExperience: parseInt(managementExperience) }),
			...(relevantDocumentsUrl && { relevantDocuments: relevantDocumentsUrl }),
		};

		// Upload metadata to Pinata
		const metadataUrl = await uploadMetadataToPinata(metadata);

		// create pda for user and store onchain
		const currentWallet = new PublicKey(walletAddress);

		const [managerPda] = PublicKey.findProgramAddressSync(
			[Buffer.from("User"), currentWallet.toBuffer()],
			program.programId
		);

		const [systemStatePda] = PublicKey.findProgramAddressSync(
			[Buffer.from("System")],
			program.programId
		);

		const blockhashResponse = await program.provider.connection.getLatestBlockhash();

    	const tx = new Transaction();

		console.log("Manager PDA: ", managerPda.toBase58());
		console.log("System State PDA: ", systemStatePda.toBase58());
		console.log("Metadata URL: ", metadataUrl);

		await program.methods
			.registerUser(
				name,
				metadataUrl,
				{ manager: {}}
			)
			.accounts({
				systemState: systemStatePda,
				// @ts-ignore
				managerAccount: managerPda,
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
			metadataUrl,
			lastValidBlockHeight: blockhashResponse.lastValidBlockHeight,
			blockhash: blockhashResponse.blockhash,
			serializedTransaction: base58SerializedTx,
			metadata
		}, {
			status: 200,
			headers: {
				"Access-Control-Allow-Origin": "*",
			}
		});
	} catch (error) {
		console.error("Error in register-labor route:", error);
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