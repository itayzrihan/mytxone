import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import { getDb } from "@/db/queries";
import { meeting, meetingAttendee, user } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";

// POST /api/meetings/[id]/register - Register for a meeting
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    const db = getDb();
    const meetingId = params.id;

    // Check if meeting exists
    const meetingData = await db
      .select({
        id: meeting.id,
        userId: meeting.userId,
        maxAttendees: meeting.maxAttendees,
        requiresApproval: meeting.requiresApproval,
        startTime: meeting.startTime,
        attendeeCount: sql<number>`cast(count(${meetingAttendee.id}) as int)`,
      })
      .from(meeting)
      .leftJoin(meetingAttendee, eq(meeting.id, meetingAttendee.meetingId))
      .where(eq(meeting.id, meetingId))
      .groupBy(meeting.id, meeting.userId, meeting.maxAttendees, meeting.requiresApproval, meeting.startTime)
      .limit(1);

    if (meetingData.length === 0) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }

    const meetingInfo = meetingData[0];

    // Check if meeting has already started
    if (new Date(meetingInfo.startTime) < new Date()) {
      return NextResponse.json(
        { error: "Cannot register for a meeting that has already started" },
        { status: 400 }
      );
    }

    // Check if meeting is full
    if (
      meetingInfo.maxAttendees !== null &&
      meetingInfo.attendeeCount >= meetingInfo.maxAttendees
    ) {
      return NextResponse.json(
        { error: "Meeting is full" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { guestName, guestEmail } = body;

    let userId = null;
    if (session?.user?.email) {
      const currentUser = await db
        .select()
        .from(user)
        .where(eq(user.email, session.user.email))
        .limit(1);

      if (currentUser.length > 0) {
        userId = currentUser[0].id;

        // Check if user is already registered
        const existingRegistration = await db
          .select()
          .from(meetingAttendee)
          .where(
            and(
              eq(meetingAttendee.meetingId, meetingId),
              eq(meetingAttendee.userId, userId)
            )
          )
          .limit(1);

        if (existingRegistration.length > 0) {
          return NextResponse.json(
            { error: "You are already registered for this meeting" },
            { status: 400 }
          );
        }
      }
    }

    // Guest registration
    if (!userId && (!guestName || !guestEmail)) {
      return NextResponse.json(
        { error: "Guest name and email are required for non-authenticated users" },
        { status: 400 }
      );
    }

    // Check for duplicate guest email
    if (!userId && guestEmail) {
      const existingGuestRegistration = await db
        .select()
        .from(meetingAttendee)
        .where(
          and(
            eq(meetingAttendee.meetingId, meetingId),
            eq(meetingAttendee.guestEmail, guestEmail)
          )
        )
        .limit(1);

      if (existingGuestRegistration.length > 0) {
        return NextResponse.json(
          { error: "This email is already registered for this meeting" },
          { status: 400 }
        );
      }
    }

    const registrationStatus = meetingInfo.requiresApproval ? "registered" : "approved";

    const newAttendee = await db
      .insert(meetingAttendee)
      .values({
        meetingId,
        userId: userId || null,
        guestName: guestName || null,
        guestEmail: guestEmail || null,
        registrationStatus,
        attendanceStatus: "pending",
      })
      .returning();

    return NextResponse.json(
      {
        ...newAttendee[0],
        message: meetingInfo.requiresApproval
          ? "Registration submitted. Awaiting approval."
          : "Successfully registered for the meeting",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering for meeting:", error);
    return NextResponse.json(
      { error: "Failed to register for meeting" },
      { status: 500 }
    );
  }
}

// DELETE /api/meetings/[id]/register - Unregister from a meeting
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

    // Find and delete the registration
    const registration = await db
      .delete(meetingAttendee)
      .where(
        and(
          eq(meetingAttendee.meetingId, meetingId),
          eq(meetingAttendee.userId, currentUser[0].id)
        )
      )
      .returning();

    if (registration.length === 0) {
      return NextResponse.json(
        { error: "Registration not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Successfully unregistered from meeting",
    });
  } catch (error) {
    console.error("Error unregistering from meeting:", error);
    return NextResponse.json(
      { error: "Failed to unregister from meeting" },
      { status: 500 }
    );
  }
}
