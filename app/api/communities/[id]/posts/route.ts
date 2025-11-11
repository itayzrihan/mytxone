import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import { getDb } from "@/db/queries";
import { communityPost, user, communityMember, communityPostReaction } from "@/db/schema";
import { eq, desc, and, sql } from "drizzle-orm";

// GET /api/communities/[id]/posts - Fetch all posts for a community
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getDb();
    const communityId = params.id;
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    const posts = await db
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
      .where(eq(communityPost.communityId, communityId))
      .orderBy(desc(communityPost.isPinned), desc(communityPost.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

// POST /api/communities/[id]/posts - Create a new post
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const communityId = params.id;

    // Check if user is a member of the community
    const membership = await db
      .select()
      .from(communityMember)
      .where(
        and(
          eq(communityMember.communityId, communityId),
          eq(communityMember.userId, currentUser[0].id)
        )
      )
      .limit(1);

    if (membership.length === 0) {
      return NextResponse.json(
        { error: "You must be a member to post" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { content, mediaUrls, mediaTypes } = body;

    if (!content && (!mediaUrls || mediaUrls.length === 0)) {
      return NextResponse.json(
        { error: "Post must have content or media" },
        { status: 400 }
      );
    }

    const newPost = await db
      .insert(communityPost)
      .values({
        communityId,
        userId: currentUser[0].id,
        content: content || "",
        mediaUrls: mediaUrls || null,
        mediaTypes: mediaTypes || null,
        likeCount: 0,
        commentCount: 0,
        shareCount: 0,
        isPinned: false,
        isEdited: false,
      })
      .returning();

    return NextResponse.json(newPost[0], { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
