import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import { getDb } from "@/db/queries";
import { meeting, meetingAttendee, user } from "@/db/schema";
import { eq, and, desc, gte, sql, inArray } from "drizzle-orm";

// GET /api/meetings - Fetch all public meetings or user's own meetings
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const db = getDb();
    const searchParams = request.nextUrl.searchParams;
    const filter = searchParams.get("filter"); // 'owned', 'attending', 'public'

    if (filter === "owned") {
      // User must be logged in to see owned meetings
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

      const ownedMeetings = await db
        .select({
          id: meeting.id,
          userId: meeting.userId,
          title: meeting.title,
          description: meeting.description,
          meetingType: meeting.meetingType,
          category: meeting.category,
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
        .where(eq(meeting.userId, currentUser[0].id))
        .groupBy(
          meeting.id,
          meeting.userId,
          meeting.title,
          meeting.description,
          meeting.meetingType,
          meeting.category,
          meeting.imageUrl,
          meeting.startTime,
          meeting.endTime,
          meeting.timezone,
          meeting.meetingUrl,
          meeting.maxAttendees,
          meeting.isPublic,
          meeting.requiresApproval,
          meeting.status,
          sql`${meeting.tags}::text`,
          meeting.createdAt,
          meeting.updatedAt
        )
        .orderBy(desc(meeting.createdAt));

      console.log('GET /api/meetings?filter=owned:', {
        userEmail: session.user.email,
        userId: currentUser[0].id,
        ownedMeetingsCount: ownedMeetings.length,
      });

      return NextResponse.json(ownedMeetings);
    }

    if (filter === "attending") {
      // User must be logged in
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

      const attendingMeetings = await db
        .select({
          id: meeting.id,
          userId: meeting.userId,
          title: meeting.title,
          description: meeting.description,
          meetingType: meeting.meetingType,
          category: meeting.category,
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
          registrationStatus: meetingAttendee.registrationStatus,
          attendanceStatus: meetingAttendee.attendanceStatus,
          attendeeCount: sql<number>`cast(count(*) over (partition by ${meeting.id}) as int)`,
        })
        .from(meetingAttendee)
        .innerJoin(meeting, eq(meetingAttendee.meetingId, meeting.id))
        .where(eq(meetingAttendee.userId, currentUser[0].id))
        .orderBy(desc(meeting.startTime));

      return NextResponse.json(attendingMeetings);
    }

    if (filter === "user") {
      // Fetch meetings for a specific user (public only)
      const userId = searchParams.get("userId");
      const publicOnly = searchParams.get("publicOnly") === "true";

      if (!userId) {
        return NextResponse.json({ error: "userId is required" }, { status: 400 });
      }

      console.log('GET /api/meetings?filter=user:', {
        userId,
        publicOnly,
      });

      const whereConditions: any[] = [eq(meeting.userId, userId)];
      
      if (publicOnly) {
        whereConditions.push(eq(meeting.isPublic, true));
      }

      const userMeetings = await db
        .select({
          id: meeting.id,
          userId: meeting.userId,
          title: meeting.title,
          description: meeting.description,
          meetingType: meeting.meetingType,
          category: meeting.category,
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
        .where(and(...whereConditions))
        .groupBy(
          meeting.id,
          meeting.userId,
          meeting.title,
          meeting.description,
          meeting.meetingType,
          meeting.category,
          meeting.imageUrl,
          meeting.startTime,
          meeting.endTime,
          meeting.timezone,
          meeting.meetingUrl,
          meeting.maxAttendees,
          meeting.isPublic,
          meeting.requiresApproval,
          meeting.status,
          sql`${meeting.tags}::text`,
          meeting.createdAt,
          meeting.updatedAt
        )
        .orderBy(desc(meeting.startTime));

      console.log('User meetings found:', {
        count: userMeetings.length,
        meetings: userMeetings.map(m => ({ id: m.id, title: m.title, userId: m.userId })),
      });

      return NextResponse.json(userMeetings);
    }

    // Default: return all public upcoming meetings
    const categories = searchParams.get("categories")?.split(",").filter(Boolean) || [];
    
    const whereConditions: any[] = [
      eq(meeting.isPublic, true),
      gte(meeting.startTime, new Date())
    ];
    
    if (categories.length > 0) {
      whereConditions.push(inArray(meeting.category, categories));
    }
    
    const publicMeetings = await db
      .select({
        id: meeting.id,
        userId: meeting.userId,
        title: meeting.title,
        description: meeting.description,
        meetingType: meeting.meetingType,
        category: meeting.category,
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
      .where(and(...whereConditions))
      .groupBy(
        meeting.id,
        meeting.userId,
        meeting.title,
        meeting.description,
        meeting.meetingType,
        meeting.category,
        meeting.imageUrl,
        meeting.startTime,
        meeting.endTime,
        meeting.timezone,
        meeting.meetingUrl,
        meeting.maxAttendees,
        meeting.isPublic,
        meeting.requiresApproval,
        meeting.status,
        sql`${meeting.tags}::text`,
        meeting.createdAt,
        meeting.updatedAt
      )
      .orderBy(meeting.startTime);

    return NextResponse.json(publicMeetings);
  } catch (error) {
    console.error("Error fetching meetings:", error);
    return NextResponse.json(
      { error: "Failed to fetch meetings" },
      { status: 500 }
    );
  }
}

// POST /api/meetings - Create a new meeting
export async function POST(request: NextRequest) {
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

    const userData = currentUser[0];

    // Check meeting creation limits based on subscription
    const existingMeetings = await db
      .select()
      .from(meeting)
      .where(
        and(
          eq(meeting.userId, userData.id),
          gte(meeting.endTime, new Date()) // Only count upcoming/ongoing meetings
        )
      );

    console.log('=== CREATE MEETING - EXISTING COUNT CHECK ===');
    console.log('User:', userData.email, 'ID:', userData.id);
    console.log('Plan:', userData.subscription);
    console.log('Existing active meetings:', existingMeetings.length);
    console.log('=== END CHECK ===');

    const meetingLimits = {
      free: 1,
      basic: 3,
      pro: Infinity,
    };

    const limit = meetingLimits[userData.subscription as keyof typeof meetingLimits] || 1;

    if (existingMeetings.length >= limit) {
      console.log('❌ LIMIT REACHED:', userData.email, 'has', existingMeetings.length, 'of', limit, 'meetings');
      return NextResponse.json(
        {
          error: `Meeting limit reached. ${userData.subscription} plan allows ${limit === Infinity ? "unlimited" : limit} active meeting${limit > 1 ? "s" : ""}. Please delete an old meeting or upgrade your plan.`,
          currentCount: existingMeetings.length,
          limit: limit === Infinity ? "unlimited" : limit,
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      meetingType,
      category,
      imageUrl,
      startTime,
      endTime,
      timezone,
      meetingUrl,
      maxAttendees,
      isPublic,
      requiresApproval,
      tags,
    } = body;

    if (!title || !startTime || !endTime || !meetingType || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newMeeting = await db
      .insert(meeting)
      .values({
        userId: userData.id,
        title,
        description: description || null,
        meetingType,
        category,
        imageUrl: imageUrl || null,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        timezone: timezone || "UTC",
        meetingUrl: meetingUrl || null,
        maxAttendees: maxAttendees || null,
        isPublic: isPublic ?? true,
        requiresApproval: requiresApproval ?? false,
        status: "upcoming",
        tags: tags || null,
      })
      .returning();

    console.log('✅ MEETING CREATED:', {
      meetingId: newMeeting[0]?.id,
      title: newMeeting[0]?.title,
      userId: newMeeting[0]?.userId,
      startTime: newMeeting[0]?.startTime,
      endTime: newMeeting[0]?.endTime,
    });

    return NextResponse.json(newMeeting[0], { status: 201 });
  } catch (error) {
    console.error("Error creating meeting:", error);
    return NextResponse.json(
      { error: "Failed to create meeting" },
      { status: 500 }
    );
  }
}
