import { program } from "@/utils/program";
import { UserAccount, UserRole, FullUserData, LaborMetadata, ManagerMetadata } from "@/types/user";
import { PublicKey } from "@solana/web3.js";
import { NextResponse } from "next/server";
import { Application } from "@/types/application";

export async function POST(req: Request) {
  try {
    const { walletAddress } = await req.json();

    const userPda = PublicKey.findProgramAddressSync(
      [Buffer.from("User"), new PublicKey(walletAddress).toBuffer()],
      program.programId
    )[0];

      const application = await program.account.userAccount.all([
        {
            memcmp: {
                offset: 8+32,
                bytes: walletAddress,
            }
        }
      ]);
      
    //   // Transform the user account data
    //   const transformedApplications: Application = {
        
    //     labour: user.authority,
    //     project: user.project,
    //     description: user.description,
    //     status: user.status,
    //     timestamp: user.timestamp,
    //   };

     return NextResponse.json({
        applications: application
     });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch user data', 
        exists: false, 
        message: "Failed to fetch user data", 
        user: null 
      },
      { status: 500 }
    );
  }
}
