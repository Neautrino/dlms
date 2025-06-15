import { program } from "@/utils/program";
import { UserAccount, UserRole, FullUserData, LaborMetadata, ManagerMetadata } from "@/types/user";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const users = await program.account.userAccount.all();

    // Transform users to include metadata
    const transformedUsers: FullUserData[] = await Promise.all(users.map(async user => {
      // Create the account part
      const account: UserAccount = {
        publicKey: user.publicKey.toString(),
        authority: user.account.authority.toString(),
        name: user.account.name,
        metadata_uri: user.account.metadataUri,
        active: user.account.active,
        verified: user.account.verified,
        rating: user.account.rating,
        rating_count: user.account.ratingCount,
        timestamp: user.account.timestamp,
        index: user.account.index,
        role: 'labour' in user.account.role ? UserRole.Labour : UserRole.Manager,
        spam: user.account.spam,
      };

      // Default metadata
      let metadata: LaborMetadata | ManagerMetadata = {
        name: user.account.name,
        bio: "Loading profile...",
        profileImage: "/api/placeholder/80/80",
      };

      // Fetch metadata from IPFS if available
      if (user.account.metadataUri) {
        try {
          const metadataResponse = await fetch(user.account.metadataUri);
          if (metadataResponse.ok) {
            const ipfsMetadata = await metadataResponse.json();
            
            // Add the fetched metadata to our default metadata
            metadata = {
              ...metadata,
              ...ipfsMetadata
            };
          }
        } catch (err) {
          console.error(`Error fetching metadata for user ${user.account.authority.toString()}:`, err);
        }
      }

      // Return the full user data
      return {
        account,
        metadata
      };
    }));

    return NextResponse.json(transformedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

async function getUserMetaData(url: string) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}
