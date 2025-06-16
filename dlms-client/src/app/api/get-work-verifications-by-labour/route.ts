import { program } from "@/utils/program";
import { PublicKey } from "@solana/web3.js";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { labourPubkey } = await req.json();

    const publicKey = new PublicKey(labourPubkey);

    const workVerifications = await program.account.workVerification.all([
      {
        memcmp: {
          offset: 8, // 8 for discriminator
          bytes: publicKey.toBase58(),
        }
      }
    ]);
      
    // Transform the work verifications data
    const transformedWorkVerifications = workVerifications.map(work => ({
      project: work.account.project.toBase58(),
      labour: work.account.labour.toBase58(),
      day_number: work.account.dayNumber,
      manager_verified: work.account.managerVerified,
      labour_verified: work.account.labourVerified,
      metadata_uri: work.account.metadataUri,
      timestamp: work.account.timestamp,
      payment_processed: work.account.paymentProcessed,
    }));
      
    return NextResponse.json({
      workVerifications: transformedWorkVerifications
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching work verification data:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch work verification data', 
        exists: false, 
        message: "Failed to fetch work verification data", 
        workVerifications: [] 
      },
      { status: 500 }
    );
  }
} 