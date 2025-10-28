import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import { getDb } from "@/db/queries";
import { user, meeting } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ plan: "free", meetingCount: 0 }, { status: 200 });
    }

    const db = getDb();

    // Fetch user's subscription plan from database
    const [userData] = await db
      .select({
        subscription: user.subscription,
        id: user.id,
        email: user.email,
      })
      .from(user)
      .where(eq(user.email, session.user.email))
      .limit(1);

    if (!userData) {
      return NextResponse.json({ plan: "free", meetingCount: 0 }, { status: 200 });
    }

    // Count ALL user's meetings (regardless of whether they've passed)
    let meetingCount = 0;
    try {
      // Get all meetings created by this user (for usage limit counting)
      const meetingCountResult = await db
        .select()
        .from(meeting)
        .where(eq(meeting.userId, userData.id));
      
      meetingCount = meetingCountResult.length;
    } catch (meetingError) {
      console.error('Error fetching meeting count:', meetingError instanceof Error ? meetingError.message : meetingError);
      // Continue without meeting count
    }

    // Return the user's plan and meeting count
    const plan = userData.subscription || "free";
    return NextResponse.json({ plan, meetingCount }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user plan:", error);
    return NextResponse.json({ plan: "free", meetingCount: 0 }, { status: 200 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { plan } = body;

    // Validate plan
    if (!plan || !['free', 'basic', 'pro'].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const db = getDb();

    // Get the user first to verify they exist
    const [userData] = await db
      .select({ id: user.id, email: user.email })
      .from(user)
      .where(eq(user.email, session.user.email))
      .limit(1);

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log(`Updating subscription for user ${userData.email} (id: ${userData.id}) to ${plan}`);

    // Update user's subscription plan with verification
    const updateResult = await db
      .update(user)
      .set({ 
        subscription: plan,
        updatedAt: new Date()
      })
      .where(eq(user.id, userData.id))
      .returning({
        id: user.id,
        email: user.email,
        subscription: user.subscription,
        updatedAt: user.updatedAt,
      });

    console.log('Update result array:', updateResult);
    console.log('Update result length:', updateResult?.length);
    console.log('Update result [0]:', {
      id: updateResult?.[0]?.id,
      email: updateResult?.[0]?.email,
      subscription: updateResult?.[0]?.subscription,
      subscriptionType: typeof updateResult?.[0]?.subscription,
      updatedAt: updateResult?.[0]?.updatedAt,
    });
    
    const updatedUser = updateResult?.[0];

    if (!updatedUser) {
      console.error(`Failed to update subscription for user ${userData.email}. Update result:`, updateResult);
      return NextResponse.json({ error: "Failed to update plan" }, { status: 500 });
    }

    console.log(`Successfully updated subscription for user ${updatedUser.email} (id: ${updatedUser.id}) to ${updatedUser.subscription}`);

    return NextResponse.json({ plan: updatedUser.subscription }, { status: 200 });
  } catch (error) {
    console.error("Error updating user plan:", error);
    return NextResponse.json({ error: "Failed to update plan" }, { status: 500 });
  }
}
