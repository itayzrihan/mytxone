import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db/queries";
import { communityLeaderboard, user } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

// GET /api/communities/[id]/leaderboard - Fetch leaderboard for a community
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getDb();
    const communityId = params.id;
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "50");

    const leaderboard = await db
      .select({
        id: communityLeaderboard.id,
        communityId: communityLeaderboard.communityId,
        userId: communityLeaderboard.userId,
        points: communityLeaderboard.points,
        postsCount: communityLeaderboard.postsCount,
        commentsCount: communityLeaderboard.commentsCount,
        reactionsReceived: communityLeaderboard.reactionsReceived,
        coursesCompleted: communityLeaderboard.coursesCompleted,
        eventsAttended: communityLeaderboard.eventsAttended,
        rank: communityLeaderboard.rank,
        badges: communityLeaderboard.badges,
        updatedAt: communityLeaderboard.updatedAt,
        userFullName: user.fullName,
        userProfileImage: user.profileImageUrl,
        userEmail: user.email,
      })
      .from(communityLeaderboard)
      .innerJoin(user, eq(communityLeaderboard.userId, user.id))
      .where(eq(communityLeaderboard.communityId, communityId))
      .orderBy(desc(communityLeaderboard.points))
      .limit(limit);

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
