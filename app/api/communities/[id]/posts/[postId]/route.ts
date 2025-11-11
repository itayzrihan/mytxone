import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import { getDb } from "@/db/queries";
import { communityPost, user } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// GET /api/communities/[id]/posts/[postId] - Get a specific post
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; postId: string } }
) {
  try {
    const db = getDb();
    const { postId } = params;

    const post = await db
      .select({
        id: communityPost.id,
        communityId: communityPost.communityId,
        userId: communityPost.userId,
        content: communityPost.content,
        mediaUrls: communityPost.mediaUrls,
        mediaTypes: communityPost.mediaTypes,
        likeCount: communityPost.likeCount,
        commentCount: communityPost.commentCount,
        shareCount: communityPost.shareCount,
        isPinned: communityPost.isPinned,
        isEdited: communityPost.isEdited,
        createdAt: communityPost.createdAt,
        updatedAt: communityPost.updatedAt,
        userFullName: user.fullName,
        userProfileImage: user.profileImageUrl,
        userEmail: user.email,
      })
      .from(communityPost)
      .innerJoin(user, eq(communityPost.userId, user.id))
      .where(eq(communityPost.id, postId))
      .limit(1);

    if (post.length === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post[0]);
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

// PATCH /api/communities/[id]/posts/[postId] - Update a post
export async function PATCH(
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
    const { content, mediaUrls, mediaTypes } = body;

    // Check if user owns the post
    const existingPost = await db
      .select()
      .from(communityPost)
      .where(
        and(
          eq(communityPost.id, postId),
          eq(communityPost.userId, currentUser[0].id)
        )
      )
      .limit(1);

    if (existingPost.length === 0) {
      return NextResponse.json(
        { error: "Post not found or unauthorized" },
        { status: 404 }
      );
    }

    const updatedPost = await db
      .update(communityPost)
      .set({
        content: content !== undefined ? content : existingPost[0].content,
        mediaUrls: mediaUrls !== undefined ? mediaUrls : existingPost[0].mediaUrls,
        mediaTypes: mediaTypes !== undefined ? mediaTypes : existingPost[0].mediaTypes,
        isEdited: true,
        updatedAt: new Date(),
      })
      .where(eq(communityPost.id, postId))
      .returning();

    return NextResponse.json(updatedPost[0]);
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

// DELETE /api/communities/[id]/posts/[postId] - Delete a post
export async function DELETE(
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

    // Check if user owns the post
    const existingPost = await db
      .select()
      .from(communityPost)
      .where(
        and(
          eq(communityPost.id, postId),
          eq(communityPost.userId, currentUser[0].id)
        )
      )
      .limit(1);

    if (existingPost.length === 0) {
      return NextResponse.json(
        { error: "Post not found or unauthorized" },
        { status: 404 }
      );
    }

    await db.delete(communityPost).where(eq(communityPost.id, postId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
