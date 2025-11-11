/**
 * GET /api/paypal/subscription/check
 * 
 * Checks the current subscription status from PayPal API
 * Does NOT modify the database - purely for reading current status
 * 
 * Returns: Current plan tier based on PayPal status
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';
import { getDb } from '@/db/queries';
import { user as userTable, meeting, community } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { checkPayPalSubscriptionStatus, isPaidTier } from '@/lib/paypal-subscription-check';

export async function GET(request: NextRequest) {
  try {
    // Get authenticated session
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user from database to find PayPal subscription ID
    const db = getDb();
    const dbUser = await db
      .select()
      .from(userTable)
      .where(eq(userTable.id, session.user.id))
      .then((rows: any[]) => rows[0]);

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // TODO: Get PayPal subscription ID from user metadata or separate table
    // For now, we'll need to store it in the User model
    const paypalSubscriptionId = dbUser.paypalSubscriptionId || undefined;
    
    const paypalStatus = await checkPayPalSubscriptionStatus(
      session.user.id,
      paypalSubscriptionId
    );

    // Get meeting and community counts for resource limit checking
    let meetingCount = 0;
    let communityCount = 0;
    
    try {
      const meetingResult = await db
        .select()
        .from(meeting)
        .where(eq(meeting.userId, session.user.id));
      meetingCount = meetingResult.length;
    } catch (error) {
      console.error('Error fetching meeting count:', error instanceof Error ? error.message : error);
    }

    try {
      const communityResult = await db
        .select()
        .from(community)
        .where(eq(community.userId, session.user.id));
      communityCount = communityResult.length;
    } catch (error) {
      console.error('Error fetching community count:', error instanceof Error ? error.message : error);
    }

    // Return the current PayPal-based plan
    return NextResponse.json({
      subscription: paypalStatus.tier,
      isActive: paypalStatus.isActive,
      isPaid: isPaidTier(paypalStatus.tier),
      paypalStatus: {
        subscriptionId: paypalStatus.subscriptionId,
        status: paypalStatus.status,
        planId: paypalStatus.planId,
      },
      lastVerified: paypalStatus.lastVerified,
      // Also return database value for comparison (optional)
      databaseSubscription: dbUser.subscription,
      // Include resource counts for limit checking
      meetingCount,
      communityCount,
    });
  } catch (error) {
    console.error('[Check Subscription] Error:', error);
    return NextResponse.json(
      { error: 'Failed to check subscription status' },
      { status: 500 }
    );
  }
}
