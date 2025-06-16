import { program } from "@/utils/program";
import { PublicKey } from "@solana/web3.js";
import { NextResponse } from "next/server";
import { UserRole } from "@/types/user";

export async function POST(req: Request) {
  try {
    const { walletAddress } = await req.json();

    const publicKey = new PublicKey(walletAddress);

    const userAccount = await program.account.userAccount.fetch(publicKey);
      
    return NextResponse.json({
      role: userAccount.role
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user role:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch user role', 
        message: "Failed to fetch user role",
        role: null
      },
      { status: 500 }
    );
  }
} 