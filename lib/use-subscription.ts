import { useState, useEffect } from 'react';

export type SubscriptionTier = 'free' | 'basic' | 'pro';

interface UseSubscriptionResult {
  subscription: SubscriptionTier | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  user: any; // User object with email and other fields
}

export function useSubscription(): UseSubscriptionResult {
  const [subscription, setSubscription] = useState<SubscriptionTier | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // First check if user is authenticated
        const authResponse = await fetch('/api/auth/session', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });

        if (!authResponse.ok) {
          // User not authenticated
          setIsAuthenticated(false);
          setSubscription('free');
          setUser(null);
          return;
        }

        const authData = await authResponse.json();
        if (!authData?.user?.id) {
          // User not authenticated
          setIsAuthenticated(false);
          setSubscription('free');
          setUser(null);
          return;
        }

        setIsAuthenticated(true);
        setUser(authData.user); // Store the full user object including email

        // Now check subscription status from database
        const subscriptionResponse = await fetch('/api/user/subscription', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });

        if (!subscriptionResponse.ok) {
          throw new Error('Failed to fetch subscription status');
        }

        const subscriptionData = await subscriptionResponse.json();
        const userSubscription = subscriptionData.subscription as SubscriptionTier;
        
        // DEBUG: For testing different subscription states, uncomment one of these:
        // const userSubscription = 'basic' as SubscriptionTier; // Test basic subscription
        // const userSubscription = 'pro' as SubscriptionTier;   // Test pro subscription
        
        // Validate subscription value
        if (!['free', 'basic', 'pro'].includes(userSubscription)) {
          console.warn('Invalid subscription value:', userSubscription);
          setSubscription('free');
        } else {
          setSubscription(userSubscription);
        }

      } catch (err) {
        console.error('Error checking subscription:', err);
        setError('Failed to check subscription status');
        // Default to free on error
        setSubscription('free');
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSubscription();
  }, []);

  return {
    subscription,
    isLoading,
    error,
    isAuthenticated,
    user
  };
}

export function isUserPaidSubscriber(subscription: SubscriptionTier | null): boolean {
  return subscription === 'basic' || subscription === 'pro';
}