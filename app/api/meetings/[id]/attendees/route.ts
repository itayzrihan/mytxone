import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import { getDb } from "@/db/queries";
import { meeting, meetingAttendee, user } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET /api/meetings/[id]/attendees - Get attendees for a meeting
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    const db = getDb();
    const meetingId = params.id;

    // Verify the user is the meeting creator
    const meetingData = await db
      .select()
      .from(meeting)
      .where(eq(meeting.id, meetingId))
      .limit(1);

    if (meetingData.length === 0) {
      return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
    }

    // Check if current user is the meeting creator
    if (session?.user?.email) {
      const currentUser = await db
        .select()
        .from(user)
        .where(eq(user.email, session.user.email))
        .limit(1);

      if (currentUser.length === 0 || currentUser[0].id !== meetingData[0].userId) {
        return NextResponse.json(
          { error: "You don't have permission to view attendees for this meeting" },
          { status: 403 }
        );
      }
    } else {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get attendees with their user information
    const attendees = await db
      .select({
        id: user.id,
        fullName: user.fullName,
        notMytxEmail: user.notMytxEmail,
        phoneNumber: user.phoneNumber,
        profileImageUrl: user.profileImageUrl,
      })
      .from(meetingAttendee)
      .innerJoin(user, eq(meetingAttendee.userId, user.id))
      .where(eq(meetingAttendee.meetingId, meetingId));

    return NextResponse.json(attendees);
  } catch (error) {
    console.error("Error fetching attendees:", error);
    return NextResponse.json(
      { error: "Failed to fetch attendees" },
      { status: 500 }
    );
  }
}
