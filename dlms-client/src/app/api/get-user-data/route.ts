import { program } from "@/lib/program";
import { UserAccount, UserRole, FullUserData, LaborMetadata, ManagerMetadata } from "@/types/user";
import { PublicKey } from "@solana/web3.js";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { walletAddress } = await req.json();

    const userPda = PublicKey.findProgramAddressSync(
      [Buffer.from("User"), new PublicKey(walletAddress).toBuffer()],
      program.programId
    )[0];

    try {
      const user = await program.account.userAccount.fetch(userPda);
      
      // Transform the user account data
      const transformedAccount: UserAccount = {
        publicKey: userPda.toString(),
        authority: user.authority.toString(),
        name: user.name,
        metadata_uri: user.metadataUri,
        active: user.active,
        verified: user.verified,
        rating: user.rating,
        rating_count: user.ratingCount,
        timestamp: user.timestamp,
        index: user.index,
        role: user.role === 0 ? UserRole.Labour : UserRole.Manager,
        spam: user.spam,
      };

      // Fetch metadata from the URI
      let metadata: LaborMetadata | ManagerMetadata;
      try {
        const metadataResponse = await fetch(user.metadataUri);
        const metadataData = await metadataResponse.json();
        
        // Transform metadata based on role
        if (user.role === 0) {
          // Labor metadata
          metadata = {
            name: metadataData.name,
            bio: metadataData.bio,
            profileImage: metadataData.profileImage,
            gender: metadataData.gender,
            dateOfBirth: metadataData.dateOfBirth ? new Date(metadataData.dateOfBirth) : undefined,
            languages: metadataData.languages,
            city: metadataData.city,
            state: metadataData.state,
            postalCode: metadataData.postalCode,
            country: metadataData.country,
            verificationDocuments: metadataData.verificationDocuments,
            experience: metadataData.experience,
            skillsets: metadataData.skillsets,
            certifications: metadataData.certifications,
            workHistory: metadataData.workHistory,
            relevantDocuments: metadataData.relevantDocuments,
          } as LaborMetadata;
        } else {
          // Manager metadata
          metadata = {
            name: metadataData.name,
            bio: metadataData.bio,
            profileImage: metadataData.profileImage,
            gender: metadataData.gender,
            dateOfBirth: metadataData.dateOfBirth ? new Date(metadataData.dateOfBirth) : undefined,
            languages: metadataData.languages,
            city: metadataData.city,
            state: metadataData.state,
            postalCode: metadataData.postalCode,
            country: metadataData.country,
            verificationDocuments: metadataData.verificationDocuments,
            companyDetails: metadataData.companyDetails,
            managementExperience: metadataData.managementExperience,
            relevantDocuments: metadataData.relevantDocuments,
          } as ManagerMetadata;
        }
      } catch (error) {
        console.error('Error fetching metadata:', error);
        // Return basic metadata if fetch fails
        metadata = {
          name: user.name,
          bio: '',
        } as (LaborMetadata | ManagerMetadata);
      }

      const fullUserData: FullUserData = {
        account: transformedAccount,
        metadata: metadata,
      };

      return NextResponse.json({ 
        exists: true, 
        message: "User data fetched successfully", 
        data: fullUserData 
      });
      
    } catch (error: any) {
      // Check if the error is due to account not existing
      if (error.message?.includes("Account does not exist")) {
        return NextResponse.json({ 
          exists: false, 
          message: "User does not exist", 
          data: null 
        });
      }
      throw error; // Re-throw other errors
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch user data', 
        exists: false, 
        message: "Failed to fetch user data", 
        data: null 
      },
      { status: 500 }
    );
  }
}
