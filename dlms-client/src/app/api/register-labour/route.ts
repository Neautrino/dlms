// // File: app/api/register-labor/route.ts
// import {
// 	clusterApiUrl,
// 	Connection,
// 	PublicKey,
// 	SystemProgram,
// 	Transaction
// } from "@solana/web3.js";
// import { NextRequest } from "next/server";
// import { pinataGateway, uploadFileToPinata, uploadMetadataToPinata } from "@/utils/config";
// import { LaborMetadata, UserRole } from "@/types/user";
// import { program } from "@/lib/program";

// const connection = new Connection(clusterApiUrl("devnet"));

// export async function POST(request: NextRequest) {
// 	try {
// 		const body = await request.formData();

// 		console.log(body);

// 		// Get basic form fields
// 		const name = body.get("name") as string;
// 		const bio = body.get("bio") as string;
// 		const userPubkey = body.get("userPubkey") as string;

// 		// Handle file uploads with null checks
// 		const profileImage = body.get("profileImage") as File | null;

// 		// Get other form fields with proper type handling
// 		const languages = body.get("languages") as string | null;
// 		const location = body.get("location") as string | null;
// 		const dateOfBirth = body.get("dateOfBirth") as string | null;
// 		const experience = body.get("experience") as string | null;
// 		const skillsets = body.get("skillsets") as string | null;
// 		const certifications = body.get("certifications") as string | null;
// 		const availability = body.get("availability") as string | null;
// 		const hourlyRate = body.get("hourlyRate") as string | null;
// 		const workHistory = body.get("workHistory") as string | null;

// 		// Handle multiple file uploads
// 		const relevantDocumentsEntries = Array.from(body.entries())
// 			.filter(([key]) => key.startsWith("relevantDocuments"))
// 			.map(([_, value]) => value as File);

// 		// Upload profile image if provided
// 		let profileImageUrl = "";
// 		if (profileImage && profileImage instanceof File && profileImage.size > 0) {
// 			profileImageUrl = await uploadFileToPinata(profileImage);
// 		}

// 		// Upload relevant documents if provided
// 		const relevantDocumentsUrls = [];
// 		if (relevantDocumentsEntries.length > 0) {
// 			const uploadPromises = relevantDocumentsEntries
// 				.filter(doc => doc instanceof File && doc.size > 0)
// 				.map(doc => uploadFileToPinata(doc));

// 			if (uploadPromises.length > 0) {
// 				const results = await Promise.all(uploadPromises);
// 				relevantDocumentsUrls.push(...results);
// 			}
// 		}

// 		// Process work history
// 		const parsedWorkHistory = workHistory ? workHistory
// 			.split("|")
// 			.map(item => {
// 				const [title = "", description = "", duration = ""] = item.split("~").map(p => p.trim());
// 				return { title, description, duration };
// 			})
// 			.filter(item => item.title && item.description)
// 			: undefined;

// 		// Prepare metadata object with proper type conversions
// 		const metadata: LaborMetadata = {
// 			name,
// 			bio,
// 			...(profileImageUrl && { profileImage: profileImageUrl }),
// 			...(languages && { languages: languages.split(",").map(item => item.trim()).filter(Boolean) }),
// 			...(location && { location }),
// 			...(dateOfBirth && { dateOfBirth: new Date(dateOfBirth) }),
// 			...(experience && { experience: experience.split(",").map(item => item.trim()).filter(Boolean) }),
// 			...(skillsets && { skillsets: skillsets.split(",").map(item => item.trim()).filter(Boolean) }),
// 			...(certifications && { certifications: certifications.split(",").map(item => item.trim()).filter(Boolean) }),
// 			...(availability && { availability }),
// 			...(hourlyRate && { hourlyRate: parseFloat(hourlyRate) }),
// 			...(parsedWorkHistory && { workHistory: parsedWorkHistory }),
// 			...(relevantDocumentsUrls.length > 0 && { relevantDocuments: relevantDocumentsUrls })
// 		};

// 		// Upload metadata to Pinata
// 		const metadataUrl = await uploadMetadataToPinata(metadata);

// 		if (!userPubkey) {
// 			return Response.json({
// 				success: false,
// 				error: "User pubkey is required"
// 			}, {
// 				status: 400,
// 			});
// 		}
// 		// create pda for user and store onchain
// 		const currentWallet = new PublicKey(userPubkey);
// 		const [userPda] = PublicKey.findProgramAddressSync(
// 			[Buffer.from("User"), currentWallet.toBuffer()],
// 			program.programId
// 		);

// 		const { blockhash } = await connection.getLatestBlockhash();

// 		// Create transaction
// 		const transaction = new Transaction({
// 			recentBlockhash: blockhash,
// 			feePayer: currentWallet
// 		});

// 		const [systemStatePda] = PublicKey.findProgramAddressSync(
// 			[Buffer.from("System")], // Adjust this based on your actual system state seed
// 			program.programId
// 		);

// 		const registerInstruction = await program.methods.registerUser({
// 			name,
// 			metadataUrl: metadataUrl,
// 			role: UserRole.Labour
// 		})
// 			.accounts({
// 				systemState: new PublicKey("8RXzY5JHrfRN6TzdWijSn84X8u9n3SkKa8jCa3vVUaQi"),
// 				userAccount: userPda,
// 				authority: currentWallet,
// 				systemProgram: SystemProgram.programId,
// 			})
// 			.instruction();

// 		transaction.add(registerInstruction);

// 		// Serialize the transaction
// 		const serializedTransaction = transaction.serialize({
// 			requireAllSignatures: false,
// 			verifySignatures: false
// 		}).toString('base64');

// 		return Response.json({
// 			success: true,
// 			metadataUrl,
// 			transaction: serializedTransaction,
// 			metadata
// 		}, {
// 			status: 200,
// 			headers: {
// 				"Access-Control-Allow-Origin": "*",
// 			}
// 		});
// 	} catch (error) {
// 		console.error("Error in register-labor route:", error);
// 		const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";

// 		return Response.json({
// 			success: false,
// 			error: errorMessage
// 		}, {
// 			status: 500,
// 			headers: {
// 				"Access-Control-Allow-Origin": "*",
// 			}
// 		});
// 	}
// }

// // Handle OPTIONS request for CORS
// export async function OPTIONS() {
// 	return new Response(null, {
// 		status: 204,
// 		headers: {
// 			"Access-Control-Allow-Origin": "*",
// 			"Access-Control-Allow-Methods": "POST, OPTIONS",
// 			"Access-Control-Allow-Headers": "Content-Type",
// 		},
// 	});
// }