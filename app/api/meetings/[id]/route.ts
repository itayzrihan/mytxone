import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import { getDb } from "@/db/queries";
import { meeting, meetingAttendee, user } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";

// GET /api/meetings/[id] - Get a specific meeting with attendee count
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getDb();
    const meetingId = params.id;

    const meetingData = await db
      .select({
        id: meeting.id,
        userId: meeting.userId,
        title: meeting.title,
        description: meeting.description,
        meetingType: meeting.meetingType,
        imageUrl: meeting.imageUrl,
        startTime: meeting.startTime,
        endTime: meeting.endTime,
        timezone: meeting.timezone,
        meetingUrl: meeting.meetingUrl,
        maxAttendees: meeting.maxAttendees,
        isPublic: meeting.isPublic,
        requiresApproval: meeting.requiresApproval,
        status: meeting.status,
        tags: meeting.tags,
        createdAt: meeting.createdAt,
        updatedAt: meeting.updatedAt,
        attendeeCount: sql<number>`cast(count(${meetingAttendee.id}) as int)`,
      })
      .from(meeting)
      .leftJoin(meetingAttendee, eq(meeting.id, meetingAttendee.meetingId))
      .where(eq(meeting.id, meetingId))
      .groupBy(meeting.id)
      .limit(1);

    if (meetingData.length === 0) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }

    return NextResponse.json(meetingData[0]);
  } catch (error) {
    console.error("Error fetching meeting:", error);
    return NextResponse.json(
      { error: "Failed to fetch meeting" },
      { status: 500 }
    );
  }
}

// PUT /api/meetings/[id] - Update a meeting
export async function PUT(
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

    const meetingId = params.id;

    // Check if user owns this meeting
    const existingMeeting = await db
      .select()
      .from(meeting)
      .where(eq(meeting.id, meetingId))
      .limit(1);

    if (existingMeeting.length === 0) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }

    if (existingMeeting[0].userId !== currentUser[0].id) {
      return NextResponse.json(
        { error: "You don't have permission to edit this meeting" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      meetingType,
      imageUrl,
      startTime,
      endTime,
      timezone,
      meetingUrl,
      maxAttendees,
      isPublic,
      requiresApproval,
      status,
      tags,
    } = body;

    const updatedMeeting = await db
      .update(meeting)
      .set({
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(meetingType && { meetingType }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(startTime && { startTime: new Date(startTime) }),
        ...(endTime && { endTime: new Date(endTime) }),
        ...(timezone && { timezone }),
        ...(meetingUrl !== undefined && { meetingUrl }),
        ...(maxAttendees !== undefined && { maxAttendees }),
        ...(isPublic !== undefined && { isPublic }),
        ...(requiresApproval !== undefined && { requiresApproval }),
        ...(status && { status }),
        ...(tags !== undefined && { tags }),
        updatedAt: new Date(),
      })
      .where(eq(meeting.id, meetingId))
      .returning();

    return NextResponse.json(updatedMeeting[0]);
  } catch (error) {
    console.error("Error updating meeting:", error);
    return NextResponse.json(
      { error: "Failed to update meeting" },
      { status: 500 }
    );
  }
}

// DELETE /api/meetings/[id] - Delete a meeting
export async function DELETE(
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

    const meetingId = params.id;

    // Check if user owns this meeting
    const existingMeeting = await db
      .select()
      .from(meeting)
      .where(eq(meeting.id, meetingId))
      .limit(1);

    if (existingMeeting.length === 0) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }

    if (existingMeeting[0].userId !== currentUser[0].id) {
      return NextResponse.json(
        { error: "You don't have permission to delete this meeting" },
        { status: 403 }
      );
    }

    // Delete the meeting (cascade will handle attendees)
    await db.delete(meeting).where(eq(meeting.id, meetingId));

    return NextResponse.json({ success: true, message: "Meeting deleted" });
  } catch (error) {
    console.error("Error deleting meeting:", error);
    return NextResponse.json(
      { error: "Failed to delete meeting" },
      { status: 500 }
    );
  }
}
