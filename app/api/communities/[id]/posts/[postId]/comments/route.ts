import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import { getDb } from "@/db/queries";
import { communityComment, user, communityPost } from "@/db/schema";
import { eq, desc, and, isNull, sql } from "drizzle-orm";

// GET /api/communities/[id]/posts/[postId]/comments - Fetch comments for a post
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; postId: string } }
) {
  try {
    const db = getDb();
    const { postId } = params;

    const comments = await db
      .select({
        id: communityComment.id,
        postId: communityComment.postId,
        userId: communityComment.userId,
        content: communityComment.content,
        likeCount: communityComment.likeCount,
        parentCommentId: communityComment.parentCommentId,
        isEdited: communityComment.isEdited,
        createdAt: communityComment.createdAt,
        updatedAt: communityComment.updatedAt,
        userFullName: user.fullName,
        userProfileImage: user.profileImageUrl,
        userEmail: user.email,
      })
      .from(communityComment)
      .innerJoin(user, eq(communityComment.userId, user.id))
      .where(
        and(
          eq(communityComment.postId, postId),
          isNull(communityComment.parentCommentId) // Only top-level comments
        )
      )
      .orderBy(desc(communityComment.createdAt));

    // Fetch replies for each comment
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await db
          .select({
            id: communityComment.id,
            postId: communityComment.postId,
            userId: communityComment.userId,
            content: communityComment.content,
            likeCount: communityComment.likeCount,
            parentCommentId: communityComment.parentCommentId,
            isEdited: communityComment.isEdited,
            createdAt: communityComment.createdAt,
            updatedAt: communityComment.updatedAt,
            userFullName: user.fullName,
            userProfileImage: user.profileImageUrl,
            userEmail: user.email,
          })
          .from(communityComment)
          .innerJoin(user, eq(communityComment.userId, user.id))
          .where(eq(communityComment.parentCommentId, comment.id))
          .orderBy(communityComment.createdAt);

        return { ...comment, replies };
      })
    );

    return NextResponse.json(commentsWithReplies);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

// POST /api/communities/[id]/posts/[postId]/comments - Create a comment
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
    const { content, parentCommentId } = body;

    if (!content || content.trim() === "") {
      return NextResponse.json(
        { error: "Comment content is required" },
        { status: 400 }
      );
    }

    const newComment = await db
      .insert(communityComment)
      .values({
        postId,
        userId: currentUser[0].id,
        content: content.trim(),
        parentCommentId: parentCommentId || null,
        likeCount: 0,
        isEdited: false,
      })
      .returning();

    // Update comment count on post
    await db
      .update(communityPost)
      .set({
        commentCount: sql`${communityPost.commentCount} + 1`,
      })
      .where(eq(communityPost.id, postId));

    return NextResponse.json(newComment[0], { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}
