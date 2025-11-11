/**
 * Utility functions to check subscription status
 * Can be used in console for debugging
 */

export async function checkMySubscription() {
  try {
    const response = await fetch('/api/user/subscription', {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache'
      }
    });

    if (!response.ok) {
      console.error('Error checking subscription:', response.status);
      return null;
    }

    const data = await response.json();
    console.log('=== Current Subscription Status ===');
    console.log(`Email: ${data.email}`);
    console.log(`Plan: ${data.subscription}`);
    console.log(`Is Active: ${data.isActive}`);
    console.log(`User ID: ${data.userId}`);
    console.log(`Created At: ${data.createdAt}`);
    console.log(`Updated At: ${data.updatedAt}`);
    console.log('===================================');
    
    return data;
  } catch (error) {
    console.error('Failed to check subscription:', error);
    return null;
  }
}

export async function checkPayPalSubscription(subscriptionId: string) {
  try {
    const response = await fetch(`/api/paypal/subscription?subscriptionId=${subscriptionId}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache'
      }
    });

    if (!response.ok) {
      console.error('Error checking PayPal subscription:', response.status);
      return null;
    }

    const data = await response.json();
    console.log('=== PayPal Subscription Status ===');
    console.log(`Subscription ID: ${data.subscriptionId}`);
    console.log(`Status: ${data.status}`);
    console.log(`Plan ID: ${data.planId}`);
    console.log(`Start Time: ${data.startTime}`);
    console.log(`Next Billing: ${data.nextBillingTime}`);
    console.log('===================================');
    
    return data;
  } catch (error) {
    console.error('Failed to check PayPal subscription:', error);
    return null;
  }
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  (window as any).checkMySubscription = checkMySubscription;
  (window as any).checkPayPalSubscription = checkPayPalSubscription;
  console.log('Subscription debug utilities loaded. Use:');
  console.log('  checkMySubscription() - Check your current subscription');
  console.log('  checkPayPalSubscription(subscriptionId) - Check a PayPal subscription');
}
