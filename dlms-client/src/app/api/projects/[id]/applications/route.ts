import { NextRequest } from "next/server";
import { program } from "@/utils/program";
import { PublicKey } from "@solana/web3.js";
import { ApplicationStatus } from "@/types/application";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = parseInt(params.id);
    
    // Get all applications for this project
    const applications = await program.account.application.all([
      {
        memcmp: {
          offset: 8 + 32 + 32, // Skip discriminator + project + labour
          bytes: projectId.toString(),
        },
      },
    ]);

    // Filter only pending applications
    const pendingApplications = applications
      .filter(app => app.account.status === ApplicationStatus.Pending)
      .map(app => ({
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

    return Response.json(pendingApplications, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return Response.json(
      { error: "Failed to fetch applications" },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
} 