// Utility function to check user subscription status
export function getUserSubscriptionTier(user: any): 'free' | 'basic' | 'pro' {
  // For now, return 'free' as default
  // In a real implementation, this would check the user's subscription status
  // You can extend this logic based on your user schema
  
  if (!user) return 'free';
  
  // Example logic - you would replace this with actual subscription check
  if (user.subscription === 'pro') return 'pro';
  if (user.subscription === 'basic') return 'basic';
  
  return 'free';
}

export function isUserPaidSubscriber(user: any): boolean {
  const tier = getUserSubscriptionTier(user);
  return tier === 'basic' || tier === 'pro';
}