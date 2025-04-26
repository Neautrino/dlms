import {
	clusterApiUrl,
	Connection,
	Keypair,
	PublicKey,
	SystemProgram,
	Transaction,
} from "@solana/web3.js";
import { NextRequest } from "next/server";
import { pinata } from "@/utils/config";

const connection = new Connection(clusterApiUrl("devnet"));


async function uploadImageToPinata(file: File) {
	const groups = await pinata.groups.public
    .list()
    .name("Images")

    console.log(groups)

	let group = groups.groups.find((g) => g.name === "Images")

    console.log(group)

	if (!group) {
		group = await pinata.groups.public.create({
            name: "Images",
        });
	}

    console.log(group)
	const upload = await pinata.upload.public
		.file(file)
		.name(file.name)
		.group(group.id);

    console.log(upload)

	return `https://${pinataGateway}/ipfs/${upload.cid}`;
}

// async function uploadMetadataToPinata(
// 	name: string,
// 	symbol: string,
// 	description: string,
// 	imageUrl: string
// ) {
// 	const metadata = {
// 		name,
// 		symbol,
// 		image: imageUrl,
// 		description,
// 	};

// 	// Check if the group exists
// 	const existingGroups = await pinata.groups.list();
// 	let group = existingGroups.find((g) => g.name === "Token Launchpad JSON");

// 	if (!group) {
// 		group = await pinata.groups.create({ name: "Token Launchpad JSON" });
// 	}

// 	const upload = await pinata.upload
// 		.json(metadata)
// 		.addMetadata({
// 			name,
// 		})
// 		.group(group.id)
// 		.cidVersion(1);

// 	return { metadataUrl: `https://${pinataGateway}/ipfs/${upload.IpfsHash}` };
// }

export async function POST(request: NextRequest) {
	const body = await request.formData();

	// const name = body.get("name") as string;
	// const decimals = parseInt(body.get("decimals") as string);
	// const initialSupply = parseInt(body.get("initialSupply") as string);
	// const totalSupply = parseInt(body.get("totalSupply") as string);
	// const symbol = body.get("symbol") as string;
	// const description = body.get("description") as string;
	const imageFile = body.get("image") as File;
	// const walletPublicKey = new PublicKey(body.get("publicKey") as string);

	// if (!name || !symbol || !description || !imageFile) {
	// 	return new Response(
	// 		JSON.stringify({ error: "Missing required fields" }),
	// 		{
	// 			status: 400,
	// 			headers: { "Content-Type": "application/json" },
	// 		}
	// 	);
	// }

	try {
		const imageUrl = await uploadImageToPinata(imageFile);
		// const pinataResponse = await uploadMetadataToPinata(
		// 	name,
		// 	symbol,
		// 	description,
		// 	imageUrl
		// );

		// const tokenKeyPair = Keypair.generate();
		// const tokenMetaData = {
		// 	mint: tokenKeyPair.publicKey,
		// 	name,
		// 	symbol,
		// 	uri: pinataResponse.metadataUrl,
		// 	additionalMetadata:
		// 		totalSupply > 0
		// 			? [["maxSupply", totalSupply.toString()] as const]
		// 			: [],
		// };

		// const tokenLen = getMintLen([ExtensionType.MetadataPointer]);
		// const metadataLen =
		// 	TYPE_SIZE + LENGTH_SIZE + pack(tokenMetaData).length;

		// const tokenRent = await connection.getMinimumBalanceForRentExemption(
		// 	tokenLen + metadataLen
		// );

		// const transaction = new Transaction().add(
		// 	SystemProgram.createAccount({
		// 		fromPubkey: walletPublicKey,
		// 		newAccountPubkey: tokenKeyPair.publicKey,
		// 		space: tokenLen,
		// 		lamports: tokenRent,
		// 		programId: TOKEN_2022_PROGRAM_ID,
		// 	}),
		// 	createInitializeMetadataPointerInstruction(
		// 		tokenKeyPair.publicKey,
		// 		walletPublicKey,
		// 		tokenKeyPair.publicKey,
		// 		TOKEN_2022_PROGRAM_ID
		// 	),
		// 	createInitializeMintInstruction(
		// 		tokenKeyPair.publicKey,
		// 		decimals,
		// 		walletPublicKey,
		// 		null,
		// 		TOKEN_2022_PROGRAM_ID
		// 	),
		// 	createInitializeInstruction({
		// 		programId: TOKEN_2022_PROGRAM_ID,
		// 		mint: tokenKeyPair.publicKey,
		// 		metadata: tokenKeyPair.publicKey,
		// 		name: tokenMetaData.name,
		// 		symbol: tokenMetaData.symbol,
		// 		uri: tokenMetaData.uri,
		// 		mintAuthority: walletPublicKey,
		// 		updateAuthority: walletPublicKey,
		// 	})
		// );

		// const { blockhash, lastValidBlockHeight } =
		// 	await connection.getLatestBlockhash();
		// transaction.recentBlockhash = blockhash;
		// transaction.lastValidBlockHeight = lastValidBlockHeight;
		// transaction.feePayer = walletPublicKey;

		// let associatedTokenAccount: PublicKey | null = null;

		// if (initialSupply > 0) {
		// 	const { serializedTx, associatedToken } =
		// 		await getOrCreateAssociatedTokenAccountTx(
		// 			connection,
		// 			walletPublicKey,
		// 			tokenKeyPair.publicKey,
		// 			walletPublicKey,
		// 			false,
		// 			undefined,
		// 			TOKEN_2022_PROGRAM_ID
		// 		);

		// 	associatedTokenAccount = associatedToken;

		// 	if (serializedTx) {
		// 		const tx = Transaction.from(
		// 			Buffer.from(serializedTx, "base64")
		// 		);
		// 		transaction.add(...tx.instructions);
		// 	}

		// 	const mintAmount = initialSupply * Math.pow(10, decimals);
		// 	console.log("Before minting", transaction);
		// 	transaction.add(
		// 		createMintToCheckedInstruction(
		// 			tokenKeyPair.publicKey,
		// 			associatedToken,
		// 			walletPublicKey,
		// 			mintAmount,
		// 			decimals,
		// 			[],
		// 			TOKEN_2022_PROGRAM_ID
		// 		)
		// 	);
		// }

		// // partial sign
		// transaction.partialSign(tokenKeyPair);

		// // serialize to send to frontend
		// const serializedTransaction = transaction
		// 	.serialize({
		// 		requireAllSignatures: false,
		// 		verifySignatures: false,
		// 	})
		// 	.toString("base64");

		// return new Response(
		// 	JSON.stringify({
		// 		serializedTransaction,
		// 		tokenAddress: tokenKeyPair.publicKey.toString(),
		// 		mint: tokenKeyPair.publicKey.toString(),
		// 		lastValidBlockHeight,
		// 		associatedTokenAccount: associatedTokenAccount?.toString(),
		// 	}),
		// 	{
		// 		headers: { "Content-Type": "application/json" },
		// 		status: 200,
		// 	}
		// );

        return new Response(JSON.stringify({ imageUrl }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
	} catch (error) {
		// const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
		// return new Response(JSON.stringify({ error:errorMessage }), {
		// 	status: 500,
		// 	headers: { "Content-Type": "application/json" },
		// });
	}
}   