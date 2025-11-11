import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';
import { getDb } from '@/db/queries';
import { user } from '@/db/schema';
import { eq } from 'drizzle-orm';

/**
 * POST /api/paypal/subscription
 * Handles PayPal subscription approval
 * Verifies the subscription with PayPal and updates user's subscription in database
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { subscriptionId, planType } = body;

    if (!subscriptionId || !planType) {
      return NextResponse.json(
        { error: 'Missing required fields: subscriptionId or planType' },
        { status: 400 }
      );
    }

    // Validate plan type
    if (!['basic', 'pro'].includes(planType)) {
      return NextResponse.json(
        { error: 'Invalid plan type' },
        { status: 400 }
      );
    }

    // Get PayPal API credentials from environment
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    const isSandbox = process.env.NEXT_PUBLIC_PAYPAL_MODE === 'sandbox';
    const baseUrl = isSandbox 
      ? 'https://api.sandbox.paypal.com'
      : 'https://api.paypal.com';

    if (!clientId || !clientSecret) {
      console.error('Missing PayPal credentials');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Step 1: Get PayPal access token
    let accessToken: string;
    try {
      const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
      const tokenResponse = await fetch(`${baseUrl}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Accept': 'application/json',
          'Accept-Language': 'en_US',
        },
        body: 'grant_type=client_credentials',
      });

      if (!tokenResponse.ok) {
        console.error('PayPal token error:', tokenResponse.status, await tokenResponse.text());
        return NextResponse.json(
          { error: 'Failed to authenticate with PayPal' },
          { status: 500 }
        );
      }

      const tokenData = await tokenResponse.json();
      accessToken = tokenData.access_token;
    } catch (error) {
      console.error('Error getting PayPal access token:', error);
      return NextResponse.json(
        { error: 'Failed to authenticate with PayPal' },
        { status: 500 }
      );
    }

    // Step 2: Verify subscription with PayPal
    let subscriptionDetails: any;
    try {
      const subscriptionResponse = await fetch(
        `${baseUrl}/v1/billing/subscriptions/${subscriptionId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!subscriptionResponse.ok) {
        console.error(
          'PayPal subscription verification error:',
          subscriptionResponse.status,
          await subscriptionResponse.text()
        );
        return NextResponse.json(
          { error: 'Subscription not found or invalid' },
          { status: 400 }
        );
      }

      subscriptionDetails = await subscriptionResponse.json();
    } catch (error) {
      console.error('Error verifying subscription with PayPal:', error);
      return NextResponse.json(
        { error: 'Failed to verify subscription' },
        { status: 500 }
      );
    }

    // Step 3: Check subscription status
    const status = subscriptionDetails.status?.toUpperCase();
    console.log(`PayPal subscription ${subscriptionId} status: ${status}`);

    // Only accept ACTIVE subscriptions (APPROVAL_PENDING means it needs confirmation)
    const isValidStatus = ['ACTIVE'].includes(status);
    
    if (!isValidStatus) {
      console.warn(`Subscription status not valid for activation: ${status}`);
      return NextResponse.json(
        {
          error: `Subscription status is ${status}. Please wait for PayPal to activate it.`,
          subscriptionId,
          status,
        },
        { status: 400 }
      );
    }

    // Step 4: Update user's subscription in database
    const db = getDb();
    
    const updateResult = await db
      .update(user)
      .set({
        subscription: planType,
        paypalSubscriptionId: subscriptionId, // Store PayPal subscription ID
        updatedAt: new Date(),
      })
      .where(eq(user.id, session.user.id))
      .returning({
        id: user.id,
        email: user.email,
        subscription: user.subscription,
        paypalSubscriptionId: user.paypalSubscriptionId,
        updatedAt: user.updatedAt,
      });

    const updatedUser = updateResult?.[0];

    if (!updatedUser) {
      console.error(
        `Failed to update subscription for user ${session.user.id}. Update result:`,
        updateResult
      );
      return NextResponse.json(
        { error: 'Failed to save subscription' },
        { status: 500 }
      );
    }

    console.log(
      `Successfully activated ${planType} subscription for user ${updatedUser.email} (id: ${updatedUser.id}). PayPal subscription ID: ${subscriptionId}`
    );

    return NextResponse.json(
      {
        success: true,
        subscription: {
          id: updatedUser.id,
          email: updatedUser.email,
          plan: updatedUser.subscription,
          paypalSubscriptionId: subscriptionId,
          activatedAt: updatedUser.updatedAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing PayPal subscription approval:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/paypal/subscription?subscriptionId=xxxxx
 * Check the status of a PayPal subscription
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const subscriptionId = searchParams.get('subscriptionId');

    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'Missing subscriptionId parameter' },
        { status: 400 }
      );
    }

    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    const isSandbox = process.env.NEXT_PUBLIC_PAYPAL_MODE === 'sandbox';
    const baseUrl = isSandbox 
      ? 'https://api.sandbox.paypal.com'
      : 'https://api.paypal.com';

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Get access token
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const tokenResponse = await fetch(`${baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Accept': 'application/json',
      },
      body: 'grant_type=client_credentials',
    });

    if (!tokenResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to authenticate with PayPal' },
        { status: 500 }
      );
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Get subscription details
    const subscriptionResponse = await fetch(
      `${baseUrl}/v1/billing/subscriptions/${subscriptionId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!subscriptionResponse.ok) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    const subscriptionDetails = await subscriptionResponse.json();

    return NextResponse.json(
      {
        subscriptionId,
        status: subscriptionDetails.status,
        planId: subscriptionDetails.plan_id,
        customId: subscriptionDetails.custom_id,
        startTime: subscriptionDetails.start_time,
        nextBillingTime: subscriptionDetails.billing_cycles?.[0]?.pricing_scheme?.next_billing_cycle_time,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error checking PayPal subscription status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
