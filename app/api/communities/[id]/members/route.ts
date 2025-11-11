import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db/queries";
import { communityMember, user } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET /api/communities/[id]/members - Fetch members of a community
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getDb();
    const communityId = params.id;

    const members = await db
      .select({
        id: communityMember.id,
        communityId: communityMember.communityId,
        userId: communityMember.userId,
        membershipStatus: communityMember.membershipStatus,
        role: communityMember.role,
        joinedAt: communityMember.joinedAt,
        userFullName: user.fullName,
        userProfileImage: user.profileImageUrl,
        userEmail: user.email,
      })
      .from(communityMember)
      .innerJoin(user, eq(communityMember.userId, user.id))
      .where(eq(communityMember.communityId, communityId));

    return NextResponse.json(members);
  } catch (error) {
    console.error("Error fetching members:", error);
    return NextResponse.json(
      { error: "Failed to fetch members" },
      { status: 500 }
    );
  }
}
