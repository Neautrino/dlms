import { program } from "@/utils/program";
import { UserAccount, UserRole, FullUserData, LaborMetadata, ManagerMetadata } from "@/types/user";
import { PublicKey } from "@solana/web3.js";
import { NextResponse } from "next/server";
import { Application } from "@/types/application";

export async function POST(req: Request) {
  try {
    const { projectPubkey } = await req.json();

    const publicKey = new PublicKey(projectPubkey);

    const applications = await program.account.application.all([
      {
        memcmp: {
          offset: 8 + 32, // 8 for discriminator + 32 for labour pubkey
          bytes: publicKey.toBase58(),
        }
      }
    ]);
      
    return NextResponse.json({
      applications: applications
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching application data:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch application data', 
        exists: false, 
        message: "Failed to fetch application data", 
        applications: [] 
      },
      { status: 500 }
    );
  }
}
