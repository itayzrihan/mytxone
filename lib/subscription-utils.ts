// Utility function to check user subscription status
// NOTE: This is deprecated in favor of useSubscription hook
// which properly checks the database via API
export function getUserSubscriptionTier(user: any): 'free' | 'basic' | 'pro' {
  if (!user) return 'free';
  
  // Check the database subscription field (this is the primary source of truth)
  if (user.subscription === 'pro') return 'pro';
  if (user.subscription === 'basic') return 'basic';
  if (user.subscription === 'free') return 'free';
  
  // Fallback for legacy compatibility
  if (user.subscriptionTier === 'pro' || user.plan === 'pro') return 'pro';
  if (user.subscriptionTier === 'basic' || user.plan === 'basic') return 'basic';
  
  // Default to free
  return 'free';
}

export function isUserPaidSubscriber(user: any): boolean {
  const tier = getUserSubscriptionTier(user);
  return tier === 'basic' || tier === 'pro';
}