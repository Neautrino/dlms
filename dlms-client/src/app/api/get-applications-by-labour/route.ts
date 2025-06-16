import { program } from "@/utils/program";
import { PublicKey } from "@solana/web3.js";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { labourPubkey } = await req.json();

    const publicKey = new PublicKey(labourPubkey);

    const applications = await program.account.application.all([
      {
        memcmp: {
          offset: 8, // 8 for discriminator
          bytes: publicKey.toBase58(),
        }
      }
    ]);
      
    // Transform the applications data
    const transformedApplications = applications.map(app => ({
      publicKey: app.publicKey.toBase58(),
      labour: app.account.labour.toBase58(),
      project: app.account.project.toBase58(),
      description: app.account.description,
      skills: app.account.skills || [],
      experience: app.account.experience || "",
      availability: app.account.availability || "",
      expectedRate: app.account.expected_rate || 0,
      additionalInfo: app.account.additional_info || "",
      status: app.account.status,
      timestamp: app.account.timestamp,
    }));
      
    return NextResponse.json({
      applications: transformedApplications
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