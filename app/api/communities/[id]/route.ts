import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import { getDb } from "@/db/queries";
import { community, communityMember, user } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

// GET /api/communities/[id] - Get a single community
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getDb();
    const communityId = params.id;

    const communityData = await db
      .select({
        id: community.id,
        userId: community.userId,
        title: community.title,
        description: community.description,
        communityType: community.communityType,
        category: community.category,
        imageUrl: community.imageUrl,
        memberCount: sql<number>`cast(count(${communityMember.id}) as int)`,
        isPublic: community.isPublic,
        requiresApproval: community.requiresApproval,
        status: community.status,
        tags: community.tags,
        createdAt: community.createdAt,
        updatedAt: community.updatedAt,
      })
      .from(community)
      .leftJoin(communityMember, eq(community.id, communityMember.communityId))
      .where(eq(community.id, communityId))
      .groupBy(
        community.id,
        community.userId,
        community.title,
        community.description,
        community.communityType,
        community.category,
        community.imageUrl,
        community.isPublic,
        community.requiresApproval,
        community.status,
        sql`${community.tags}::text`,
        community.createdAt,
        community.updatedAt
      )
      .limit(1);

    if (communityData.length === 0) {
      return NextResponse.json({ error: "Community not found" }, { status: 404 });
    }

    return NextResponse.json(communityData[0]);
  } catch (error) {
    console.error("Error fetching community:", error);
    return NextResponse.json(
      { error: "Failed to fetch community" },
      { status: 500 }
    );
  }
}

// DELETE /api/communities/[id] - Delete a community
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    const db = getDb();
    const communityId = params.id;

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await db
      .select()
      .from(user)
      .where(eq(user.email, session.user.email))
      .limit(1);

    if (currentUser.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if community exists and user is the owner
    const communityData = await db
      .select()
      .from(community)
      .where(eq(community.id, communityId))
      .limit(1);

    if (communityData.length === 0) {
      return NextResponse.json({ error: "Community not found" }, { status: 404 });
    }

    if (communityData[0].userId !== currentUser[0].id) {
      return NextResponse.json(
        { error: "You don't have permission to delete this community" },
        { status: 403 }
      );
    }

    // Delete the community (cascade will handle members)
    await db.delete(community).where(eq(community.id, communityId));

    return NextResponse.json(
      { message: "Community deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting community:", error);
    return NextResponse.json(
      { error: "Failed to delete community" },
      { status: 500 }
    );
  }
}
