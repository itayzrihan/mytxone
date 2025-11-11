import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import { getDb } from "@/db/queries";
import { communityEvent, user, communityEventAttendee } from "@/db/schema";
import { eq, desc, gte, and } from "drizzle-orm";

// GET /api/communities/[id]/events - Fetch events for a community
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getDb();
    const communityId = params.id;
    const searchParams = request.nextUrl.searchParams;
    const upcoming = searchParams.get("upcoming") === "true";

    let query = db
      .select({
        id: communityEvent.id,
        communityId: communityEvent.communityId,
        title: communityEvent.title,
        description: communityEvent.description,
        hostId: communityEvent.hostId,
        startTime: communityEvent.startTime,
        endTime: communityEvent.endTime,
        location: communityEvent.location,
        meetingLink: communityEvent.meetingLink,
        maxAttendees: communityEvent.maxAttendees,
        attendeeCount: communityEvent.attendeeCount,
        isPublic: communityEvent.isPublic,
        imageUrl: communityEvent.imageUrl,
        createdAt: communityEvent.createdAt,
        hostName: user.fullName,
        hostImage: user.profileImageUrl,
      })
      .from(communityEvent)
      .innerJoin(user, eq(communityEvent.hostId, user.id))
      .where(eq(communityEvent.communityId, communityId))
      .$dynamic();

    if (upcoming) {
      query = query.where(
        and(
          eq(communityEvent.communityId, communityId),
          gte(communityEvent.startTime, new Date())
        )
      );
    }

    const events = await query.orderBy(communityEvent.startTime);

    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

// POST /api/communities/[id]/events - Create a new event
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
    const {
      title,
      description,
      startTime,
      endTime,
      location,
      meetingLink,
      maxAttendees,
      isPublic,
      imageUrl,
    } = body;

    if (!title || !startTime || !endTime) {
      return NextResponse.json(
        { error: "Title, start time, and end time are required" },
        { status: 400 }
      );
    }

    const newEvent = await db
      .insert(communityEvent)
      .values({
        communityId,
        title,
        description: description || null,
        hostId: currentUser[0].id,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        location: location || null,
        meetingLink: meetingLink || null,
        maxAttendees: maxAttendees || null,
        attendeeCount: 0,
        isPublic: isPublic ?? true,
        imageUrl: imageUrl || null,
      })
      .returning();

    return NextResponse.json(newEvent[0], { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
