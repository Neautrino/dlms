import { program } from "@/utils/program";
import { UserAccount, UserRole } from "@/types/user";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const users = await program.account.userAccount.all();

    // const transformedUsers: UserAccount[] = users.map(user => {
    //     return {
    //         publicKey: user.publicKey.toString(),
    //         authority: user.account.authority.toString(),
    //         name: user.account.name,
    //         metadata_uri: user.account.metadataUri,
    //         active: user.account.active,
    //         verified: user.account.verified,
    //         rating: user.account.rating,
    //         rating_count: user.account.ratingCount,
    //         timestamp: user.account.timestamp,
    //         index: user.account.index,
    //         role: user.account.role === 0 ? UserRole.Labor : UserRole.Manager,
    //         spam: user.account.spam,
    //     }
    // })

    return NextResponse.json(users);
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
