"use client";

import UpgradePlanWall from "@/components/custom/upgrade-plan-wall";
import { useSubscription, isUserPaidSubscriber } from "@/lib/use-subscription";
import { useUserPlan } from "@/components/custom/user-plan-context";
import { getLimitForPlan } from "@/lib/plan-utils";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CreateCommunityPage() {
  const { subscription, isLoading, error, isAuthenticated, user } = useSubscription();
  const { userPlan, communityCount, isLoading: isPlanLoading } = useUserPlan();
  const router = useRouter();

  // Check if user can create communities directly
  useEffect(() => {
    // Don't redirect while loading
    if (isLoading || isPlanLoading) {
      return;
    }

    // Only redirect if user is authenticated and has paid subscription
    if (isAuthenticated && userPlan && isUserPaidSubscriber(userPlan)) {
      const communityLimit = getLimitForPlan(userPlan);
      
      // If user hasn't reached their limit, navigate to owned communities page
      if (communityCount < communityLimit) {
        router.push('/owned-communities');
        return;
      }
    }
  }, [isLoading, isPlanLoading, isAuthenticated, userPlan, communityCount, router]);

  // Show loading state while checking subscription
  if (isLoading || isPlanLoading) {
    return (
      <>
        {/* Hide navbar and footer during loading */}
        <style jsx global>{`
          .navbar-container,
          .footer-container {
            display: none !important;
          }
        `}</style>
        
        <div className="min-h-screen flex flex-col items-center justify-center px-4 pt-8 pb-20">
          <div className="text-center">
            <div className="text-4xl font-bold mb-4">
              <span className="text-cyan-400">MYT</span>
              <span className="text-white">X</span>
            </div>
            <div className="text-white/60">Loading...</div>
          </div>
        </div>
      </>
    );
  }

  // Show error state if subscription check failed
  if (error) {
    return (
      <>
        {/* Hide navbar and footer during error */}
        <style jsx global>{`
          .navbar-container,
          .footer-container {
            display: none !important;
          }
        `}</style>
        
        <div className="min-h-screen flex flex-col items-center justify-center px-4 pt-8 pb-20">
          <div className="text-center">
            <div className="text-4xl font-bold mb-4">
              <span className="text-cyan-400">MYT</span>
              <span className="text-white">X</span>
            </div>
            <div className="text-red-400">Error: {error}</div>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600"
            >
              Retry
            </button>
          </div>
        </div>
      </>
    );
  }

  // Show upgrade plan wall for users without paid subscription or who have reached their limit
  return <UpgradePlanWall type="community" user={isAuthenticated ? { ...user, subscription } : null} />;
}