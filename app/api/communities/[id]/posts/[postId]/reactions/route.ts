import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import { getDb } from "@/db/queries";
import { communityPostReaction, user, communityPost } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";

// POST /api/communities/[id]/posts/[postId]/reactions - Toggle reaction on a post
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; postId: string } }
) {
  try {
    const session = await auth();
    const db = getDb();

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

    const { postId } = params;
    const body = await request.json();
    const { reactionType } = body;

    if (!reactionType) {
      return NextResponse.json(
        { error: "Reaction type is required" },
        { status: 400 }
      );
    }

    // Check if user already reacted
    const existingReaction = await db
      .select()
      .from(communityPostReaction)
      .where(
        and(
          eq(communityPostReaction.postId, postId),
          eq(communityPostReaction.userId, currentUser[0].id)
        )
      )
      .limit(1);

    if (existingReaction.length > 0) {
      // If same reaction, remove it (toggle off)
      if (existingReaction[0].reactionType === reactionType) {
        await db
          .delete(communityPostReaction)
          .where(eq(communityPostReaction.id, existingReaction[0].id));

        // Decrement like count
        await db
          .update(communityPost)
          .set({
            likeCount: sql`${communityPost.likeCount} - 1`,
          })
          .where(eq(communityPost.id, postId));

        return NextResponse.json({ action: "removed", reactionType });
      } else {
        // Update to new reaction type
        await db
          .update(communityPostReaction)
          .set({
            reactionType,
            createdAt: new Date(),
          })
          .where(eq(communityPostReaction.id, existingReaction[0].id));

        return NextResponse.json({ action: "updated", reactionType });
      }
    } else {
      // Add new reaction
      await db.insert(communityPostReaction).values({
        postId,
        userId: currentUser[0].id,
        reactionType,
      });

      // Increment like count
      await db
        .update(communityPost)
        .set({
          likeCount: sql`${communityPost.likeCount} + 1`,
        })
        .where(eq(communityPost.id, postId));

      return NextResponse.json({ action: "added", reactionType }, { status: 201 });
    }
  } catch (error) {
    console.error("Error toggling reaction:", error);
    return NextResponse.json(
      { error: "Failed to toggle reaction" },
      { status: 500 }
    );
  }
}

// GET /api/communities/[id]/posts/[postId]/reactions - Get reactions for a post
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; postId: string } }
) {
  try {
    const db = getDb();
    const { postId } = params;

    const reactions = await db
      .select({
        id: communityPostReaction.id,
        postId: communityPostReaction.postId,
        userId: communityPostReaction.userId,
        reactionType: communityPostReaction.reactionType,
        createdAt: communityPostReaction.createdAt,
        userFullName: user.fullName,
        userProfileImage: user.profileImageUrl,
      })
      .from(communityPostReaction)
      .innerJoin(user, eq(communityPostReaction.userId, user.id))
      .where(eq(communityPostReaction.postId, postId));

    return NextResponse.json(reactions);
  } catch (error) {
    console.error("Error fetching reactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch reactions" },
      { status: 500 }
    );
  }
}
