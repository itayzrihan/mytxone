/**
 * PayPal Subscription Checker
 * 
 * Verifies user's subscription status directly from PayPal API
 * This is the single source of truth for subscription plans.
 */

import { SubscriptionTier } from './use-subscription';

export interface PayPalSubscriptionStatus {
  subscriptionId: string | null;
  status: string | null;
  planId: string | null;
  tier: SubscriptionTier;
  isActive: boolean;
  lastVerified: Date;
}

/**
 * Map PayPal plan ID to our tier
 */
function getPlanTierFromPayPalPlanId(planId: string | null): SubscriptionTier {
  if (!planId) return 'free';
  
  // Match against environment variable plan IDs
  const basicPlanId = process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID_MEMBER_BASIC;
  const proPlanId = process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID_MEMBER_PRO;
  
  if (planId === proPlanId) return 'pro';
  if (planId === basicPlanId) return 'basic';
  
  // Unknown plan ID, treat as basic (safer default for paid)
  return 'basic';
}

/**
 * Map PayPal subscription status to our tier
 */
function getTierFromPayPalStatus(status: string | null, planId: string | null): SubscriptionTier {
  if (!status) return 'free';
  
  const normalizedStatus = status.toUpperCase();
  
  // Only ACTIVE subscriptions count as paid
  if (normalizedStatus === 'ACTIVE') {
    return getPlanTierFromPayPalPlanId(planId);
  }
  
  // Any other status (APPROVAL_PENDING, SUSPENDED, EXPIRED, CANCELLED, etc.)
  // = free tier
  return 'free';
}

/**
 * Check user's subscription status from PayPal API
 * 
 * @param userId - User ID from database
 * @param paypalSubscriptionId - PayPal subscription ID (if known)
 * @returns PayPal subscription status and mapped tier
 */
export async function checkPayPalSubscriptionStatus(
  userId: string,
  paypalSubscriptionId?: string
): Promise<PayPalSubscriptionStatus> {
  try {
    // If no subscription ID provided, return free tier
    if (!paypalSubscriptionId) {
      return {
        subscriptionId: null,
        status: null,
        planId: null,
        tier: 'free',
        isActive: false,
        lastVerified: new Date(),
      };
    }

    // Get PayPal API credentials
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    const mode = process.env.NEXT_PUBLIC_PAYPAL_MODE || 'sandbox';
    const baseUrl = mode === 'live' 
      ? 'https://api.paypal.com'
      : 'https://api.sandbox.paypal.com';

    if (!clientId || !clientSecret) {
      console.error('Missing PayPal API credentials');
      return {
        subscriptionId: paypalSubscriptionId,
        status: null,
        planId: null,
        tier: 'free',
        isActive: false,
        lastVerified: new Date(),
      };
    }

    // Step 1: Get access token
    const tokenResponse = await fetch(`${baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
      body: 'grant_type=client_credentials',
    });

    if (!tokenResponse.ok) {
      console.error('Failed to get PayPal access token:', tokenResponse.status);
      return {
        subscriptionId: paypalSubscriptionId,
        status: null,
        planId: null,
        tier: 'free',
        isActive: false,
        lastVerified: new Date(),
      };
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Step 2: Fetch subscription details
    const subscriptionResponse = await fetch(
      `${baseUrl}/v1/billing/subscriptions/${paypalSubscriptionId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!subscriptionResponse.ok) {
      console.warn(`Subscription not found or invalid: ${paypalSubscriptionId}`);
      return {
        subscriptionId: paypalSubscriptionId,
        status: null,
        planId: null,
        tier: 'free',
        isActive: false,
        lastVerified: new Date(),
      };
    }

    const subscriptionData = await subscriptionResponse.json();
    const status = subscriptionData.status?.toUpperCase() || null;
    const planId = subscriptionData.plan_id || null;

    // Step 3: Map to our tier
    const tier = getTierFromPayPalStatus(status, planId);
    const isActive = status === 'ACTIVE';

    console.log(`[PayPal Check] User ${userId}: subscription ${paypalSubscriptionId} status=${status}, tier=${tier}`);

    return {
      subscriptionId: paypalSubscriptionId,
      status,
      planId,
      tier,
      isActive,
      lastVerified: new Date(),
    };
  } catch (error) {
    console.error('[PayPal Check] Error checking subscription:', error);
    return {
      subscriptionId: paypalSubscriptionId || null,
      status: null,
      planId: null,
      tier: 'free',
      isActive: false,
      lastVerified: new Date(),
    };
  }
}

/**
 * Helper function to determine if a tier should have premium features
 */
export function isPaidTier(tier: SubscriptionTier): boolean {
  return tier === 'basic' || tier === 'pro';
}

/**
 * Helper function to get resource limit for a tier from PayPal perspective
 */
export function getResourceLimitForPayPalTier(tier: SubscriptionTier): number {
  if (tier === 'pro') return Infinity;
  if (tier === 'basic') return 3;
  return 1; // free
}
