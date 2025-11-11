import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import { getDb } from "@/db/queries";
import { community, communityMember, user } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// POST /api/communities/[id]/join - Join a community
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    const db = getDb();
    const communityId = params.id;

    // Check if community exists
    const communityData = await db
      .select()
      .from(community)
      .where(eq(community.id, communityId))
      .limit(1);

    if (communityData.length === 0) {
      return NextResponse.json({ error: "Community not found" }, { status: 404 });
    }

    const body = await request.json();
    const { guestName, guestEmail } = body;

    // Handle guest join
    if (!session?.user?.email) {
      if (!guestName || !guestEmail) {
        return NextResponse.json(
          { error: "Guest name and email are required" },
          { status: 400 }
        );
      }

      // Check if guest is already a member
      const existingMember = await db
        .select()
        .from(communityMember)
        .where(
          and(
            eq(communityMember.communityId, communityId),
            eq(communityMember.guestEmail, guestEmail)
          )
        )
        .limit(1);

      if (existingMember.length > 0) {
        return NextResponse.json(
          { error: "You are already a member of this community" },
          { status: 400 }
        );
      }

      const newMember = await db
        .insert(communityMember)
        .values({
          communityId,
          userId: null,
          guestName,
          guestEmail,
          membershipStatus: communityData[0].requiresApproval ? "pending" : "member",
          role: "member",
        })
        .returning();

      return NextResponse.json(
        {
          message: communityData[0].requiresApproval
            ? "Join request submitted. Waiting for approval."
            : "Successfully joined the community",
          member: newMember[0],
        },
        { status: 201 }
      );
    }

    // Handle authenticated user join
    const currentUser = await db
      .select()
      .from(user)
      .where(eq(user.email, session.user.email))
      .limit(1);

    if (currentUser.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user is already a member
    const existingMember = await db
      .select()
      .from(communityMember)
      .where(
        and(
          eq(communityMember.communityId, communityId),
          eq(communityMember.userId, currentUser[0].id)
        )
      )
      .limit(1);

    if (existingMember.length > 0) {
      return NextResponse.json(
        { error: "You are already a member of this community" },
        { status: 400 }
      );
    }

    const newMember = await db
      .insert(communityMember)
      .values({
        communityId,
        userId: currentUser[0].id,
        membershipStatus: communityData[0].requiresApproval ? "pending" : "member",
        role: "member",
      })
      .returning();

    return NextResponse.json(
      {
        message: communityData[0].requiresApproval
          ? "Join request submitted. Waiting for approval."
          : "Successfully joined the community",
        member: newMember[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error joining community:", error);
    return NextResponse.json(
      { error: "Failed to join community" },
      { status: 500 }
    );
  }
}
