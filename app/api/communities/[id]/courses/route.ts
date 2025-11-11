import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import { getDb } from "@/db/queries";
import { communityCourse, user, communityCourseEnrollment } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";

// GET /api/communities/[id]/courses - Fetch courses for a community
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getDb();
    const communityId = params.id;

    const courses = await db
      .select({
        id: communityCourse.id,
        communityId: communityCourse.communityId,
        title: communityCourse.title,
        description: communityCourse.description,
        instructorId: communityCourse.instructorId,
        thumbnailUrl: communityCourse.thumbnailUrl,
        duration: communityCourse.duration,
        level: communityCourse.level,
        price: communityCourse.price,
        enrollmentCount: communityCourse.enrollmentCount,
        isPublished: communityCourse.isPublished,
        createdAt: communityCourse.createdAt,
        instructorName: user.fullName,
        instructorImage: user.profileImageUrl,
      })
      .from(communityCourse)
      .innerJoin(user, eq(communityCourse.instructorId, user.id))
      .where(eq(communityCourse.communityId, communityId))
      .orderBy(desc(communityCourse.createdAt));

    return NextResponse.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

// POST /api/communities/[id]/courses - Create a new course
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
    const body = await request.json();
    const { title, description, thumbnailUrl, duration, level, price, isPublished } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Course title is required" },
        { status: 400 }
      );
    }

    const newCourse = await db
      .insert(communityCourse)
      .values({
        communityId,
        title,
        description: description || null,
        instructorId: currentUser[0].id,
        thumbnailUrl: thumbnailUrl || null,
        duration: duration || null,
        level: level || "beginner",
        price: price || null,
        enrollmentCount: 0,
        isPublished: isPublished ?? false,
      })
      .returning();

    return NextResponse.json(newCourse[0], { status: 201 });
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 }
    );
  }
}
