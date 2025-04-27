import { program } from "@/lib/program";
import { UserAccount, UserRole } from "@/types/user";
import { PublicKey } from "@solana/web3.js";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

  try {
    const users = await program.account.userAccount.all();
		const { walletAddress } = await req.json();

		const userPda = PublicKey.findProgramAddressSync(
			[Buffer.from("User"), new PublicKey(walletAddress).toBuffer()],
			program.programId
		)[0];

		try {
			const user = await program.account.userAccount.fetch(userPda);
			return NextResponse.json({ exists: true, message: "User data fetched successfully", userRole: user.role === 0 ? UserRole.Labour : UserRole.Manager, data: {Pubkey: userPda.toBase58(), ...user} });
			
		} catch (error: any) {
			// Check if the error is due to account not existing
			if (error.message?.includes("Account does not exist")) {
				return NextResponse.json({ exists: false, message: "User does not exist", data: null });
			}
			throw error; // Re-throw other errors
		}
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users', exists: false, message: "Failed to fetch users", data: null },
      { status: 500 }
    );
  }
}

async function getUserMetaData(url: string) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}
