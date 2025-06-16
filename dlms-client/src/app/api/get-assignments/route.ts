import { program } from "@/utils/program";
import { PublicKey } from "@solana/web3.js";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { pubkey, role } = await req.json();

    if (!pubkey) {
      return NextResponse.json(
        { error: 'Public key is required' },
        { status: 400 }
      );
    }

    const publicKey = new PublicKey(pubkey);
    let assignments;

    if (role === 'manager') {
      // Fetch assignments by manager
      assignments = await program.account.assignment.all([
        {
          memcmp: {
            offset: 8 + 32, // Skip discriminator + labour
            bytes: publicKey.toBase58(),
          }
        }
      ]);
    } else if (role === 'labour') {
      // Fetch assignments by labour
      assignments = await program.account.assignment.all([
        {
          memcmp: {
            offset: 8, // Skip discriminator
            bytes: publicKey.toBase58(),
          }
        }
      ]);
    } else {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    // Transform the assignments data
    const transformedAssignments = assignments.map(assignment => ({
      publicKey: assignment.publicKey.toBase58(),
      labour: assignment.account.labour.toBase58(),
      project: assignment.account.project.toBase58(),
      daysWorked: assignment.account.daysWorked,
      daysPaid: assignment.account.daysPaid,
      active: assignment.account.active,
      timestamp: assignment.account.timestamp,
    }));

    return NextResponse.json({
      assignments: transformedAssignments
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assignments' },
      { status: 500 }
    );
  }
} 