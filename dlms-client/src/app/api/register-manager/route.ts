// // File: app/api/register-manager/route.ts
// import {
//     clusterApiUrl,
//     Connection,
//   } from "@solana/web3.js";
//   import { NextRequest } from "next/server";
//   import { pinataGateway, uploadFileToPinata, uploadMetadataToPinata } from "@/utils/config";
//   import { ManagerMetadata } from "@/types/user";
  
//   const connection = new Connection(clusterApiUrl("devnet"));
  
//   export async function POST(request: NextRequest) {
//     try {
//       const body = await request.formData();
  
//       // Get basic form fields
//       const name = body.get("name") as string;
//       const bio = body.get("bio") as string;
      
//       // Handle file uploads with null checks
//       const profileImage = body.get("profileImage") as File | null;
      
//       // Get other form fields with proper type handling
//       const languages = body.get("languages") as string | null;
//       const location = body.get("location") as string | null;
//       const dateOfBirth = body.get("dateOfBirth") as string | null;
//       const company = body.get("company") as string | null;
      
//       // Company details
//       const industry = body.get("industry") as string | null;
//       const companySize = body.get("companySize") as string | null;
//       const founded = body.get("founded") as string | null;
//       const companyLocation = body.get("companyLocation") as string | null;
//       const website = body.get("website") as string | null;
      
//       const hiringFrequency = body.get("hiringFrequency") as string | null;
//       const managementExperience = body.get("managementExperience") as string | null;
//       const teamSize = body.get("teamSize") as string | null;
//       const industryFocus = body.get("industryFocus") as string | null;
      
//       // Budget range
//       const budgetMin = body.get("budgetMin") as string | null;
//       const budgetMax = body.get("budgetMax") as string | null;
//       const budgetCurrency = body.get("budgetCurrency") as string | null;
      
//       const previousHires = body.get("previousHires") as string | null;
  
//       // Handle multiple file uploads
//       const relevantDocumentsEntries = Array.from(body.entries())
//         .filter(([key]) => key.startsWith("relevantDocuments"))
//         .map(([_, value]) => value as File);
  
//       // Upload profile image if provided
//       let profileImageUrl = "";
//       if (profileImage && profileImage instanceof File && profileImage.size > 0) {
//         profileImageUrl = await uploadFileToPinata(profileImage);
//       }
  
//       // Upload relevant documents if provided
//       const relevantDocumentsUrls = [];
//       if (relevantDocumentsEntries.length > 0) {
//         const uploadPromises = relevantDocumentsEntries
//           .filter(doc => doc instanceof File && doc.size > 0)
//           .map(doc => uploadFileToPinata(doc));
        
//         if (uploadPromises.length > 0) {
//           const results = await Promise.all(uploadPromises);
//           relevantDocumentsUrls.push(...results);
//         }
//       }
  
//       // Process previous hires
//       const parsedPreviousHires = previousHires ? previousHires
//         .split("|")
//         .map(item => {
//           const [role = "", duration = "", projectOutcome = ""] = item.split("~").map(p => p.trim());
//           return { role, duration, ...(projectOutcome && { projectOutcome }) };
//         })
//         .filter(item => item.role && item.duration)
//         : undefined;
  
//       // Prepare company details if any provided
//       const companyDetails = (industry || companySize || founded || companyLocation || website) ? {
//         ...(industry && { industry }),
//         ...(companySize && { size: companySize }),
//         ...(founded && { founded: parseInt(founded, 10) }),
//         ...(companyLocation && { location: companyLocation }),
//         ...(website && { website })
//       } : undefined;
  
//       // Prepare budget range if any provided
//       const projectBudgetRange = (budgetMin && budgetMax && budgetCurrency) ? {
//         min: parseFloat(budgetMin),
//         max: parseFloat(budgetMax),
//         currency: budgetCurrency
//       } : undefined;
  
//       // Prepare metadata object with proper type conversions
//       const metadata: ManagerMetadata = {
//         name,
//         bio,
//         ...(profileImageUrl && { profileImage: profileImageUrl }),
//         ...(languages && { languages: languages.split(",").map(item => item.trim()).filter(Boolean) }),
//         ...(location && { location }),
//         ...(dateOfBirth && { dateOfBirth: new Date(dateOfBirth) }),
//         ...(company && { company }),
//         ...(companyDetails && { companyDetails }),
//         ...(hiringFrequency && { hiringFrequency }),
//         ...(managementExperience && { managementExperience: parseInt(managementExperience, 10) }),
//         ...(teamSize && { teamSize: parseInt(teamSize, 10) }),
//         ...(industryFocus && { industryFocus: industryFocus.split(",").map(item => item.trim()).filter(Boolean) }),
//         ...(projectBudgetRange && { projectBudgetRange }),
//         ...(parsedPreviousHires && { previousHires: parsedPreviousHires }),
//         ...(relevantDocumentsUrls.length > 0 && { relevantDocuments: relevantDocumentsUrls })
//       };
  
//       // Upload metadata to Pinata
//       const metadataUrl = await uploadMetadataToPinata(metadata);
  
//       return Response.json({
//         success: true,
//         metadataUrl,
//         metadata
//       }, {
//         status: 200,
//         headers: {
//           "Access-Control-Allow-Origin": "*",
//         }
//       });
//     } catch (error) {
//       console.error("Error in register-manager route:", error);
//       const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      
//       return Response.json({ 
//         success: false,
//         error: errorMessage 
//       }, {
//         status: 500,
//         headers: {
//           "Access-Control-Allow-Origin": "*",
//         }
//       });
//     }
//   }
  
//   // Handle OPTIONS request for CORS
//   export async function OPTIONS() {
//     return new Response(null, {
//       status: 204,
//       headers: {
//         "Access-Control-Allow-Origin": "*",
//         "Access-Control-Allow-Methods": "POST, OPTIONS",
//         "Access-Control-Allow-Headers": "Content-Type",
//       },
//     });
//   }