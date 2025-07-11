import { NextResponse } from 'next/server';
import { connection, program } from '@/utils/program';
import { PublicKey } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';
import { DLMS_PROGRAM_ID } from '@/utils/program';

export async function POST(req: Request) {
  try {
    const { labourPubkey } = await req.json();

    if (!labourPubkey) {
      return NextResponse.json(
        { error: 'Labour public key is required' },
        { status: 400 }
      );
    }

    const labourPublicKey = new PublicKey(labourPubkey);

    // Fetch all assignments for the labor
    const assignments = await program.account.assignment.all([
        {
            memcmp: {
              offset: 8 , 
              bytes: labourPublicKey.toBase58(),
            }
          }
    ])

    console.log("Assignments: ", assignments)

    // Process assignments and get verification status
    const processedAssignments = await Promise.all(
      assignments.map(async (assignment) => {
        const accountData = assignment.account;
        
        // Parse the assignment data
        const project = accountData.project.toBase58();
        const labour = accountData.labour.toBase58();
        const daysWorked = accountData.daysWorked;
        const daysPaid = accountData.daysPaid;
        const active = accountData.active;
        const timestamp = accountData.timestamp;

        // Fetch work verifications for this assignment
        const verifications = await connection.getProgramAccounts(
          DLMS_PROGRAM_ID,
          {
            filters: [
              {
                memcmp: {
                  offset: 8 +32,
                  bytes: project,
                },
              },
              {
                memcmp: {
                  offset: 8,
                  bytes: labour,
                },
              },
            ],
          }
        );

        // Process verifications
        const processedVerifications = verifications.map((verification) => {
          const verificationData = verification.account.data;
          return {
            publicKey: verification.pubkey.toBase58(),
            account: {
              project: new PublicKey(verificationData.slice(8, 40)).toBase58(),
              labour: new PublicKey(verificationData.slice(40, 72)).toBase58(),
              dayNumber: new BN(verificationData.slice(72, 80), 'le').toNumber(),
              managerVerified: verificationData[80] === 1,
              labourVerified: verificationData[81] === 1,
              metadataUri: Buffer.from(verificationData.slice(82, -8)).toString('utf8').replace(/\0/g, ''),
              timestamp: new BN(verificationData.slice(-8), 'le').toString(),
              paymentProcessed: verificationData[82] === 1,
            },
          };
        });

        return {
          publicKey: assignment.publicKey.toBase58(),
          project,
          labour,
          daysWorked,
          daysPaid,
          active,
          timestamp,
          verifications: processedVerifications,
          verificationStatus: {
            total: processedVerifications.length,
            verified: processedVerifications.filter(v => v.account.managerVerified && v.account.labourVerified).length,
            pending: processedVerifications.filter(v => !v.account.managerVerified || !v.account.labourVerified).length,
          },
        };
      })
    );

    return NextResponse.json({
      success: true,
      assignments: processedAssignments,
    });
  } catch (error) {
    console.error('Error fetching assignments by labour:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assignments' },
      { status: 500 }
    );
  }
} 