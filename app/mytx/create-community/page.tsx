"use client";

import UpgradePlanWall from "@/components/custom/upgrade-plan-wall";
import { useSubscription, isUserPaidSubscriber } from "@/lib/use-subscription";

// Placeholder component for actual community creation
function CreateCommunityForm() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 pt-8 pb-20">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        
        {/* MYTX Logo */}
        <div className="text-4xl font-bold">
          <span className="text-cyan-400">MYT</span>
          <span className="text-white">X</span>
        </div>

        {/* Coming Soon Message */}
        <div className="relative">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl shadow-black/20"></div>
          <div className="relative p-12 space-y-6">
            <h1 className="text-3xl font-bold text-white mb-4">
              Create a Community
            </h1>
            <p className="text-xl text-white/80 leading-relaxed max-w-2xl mx-auto">
              Here you would soon be able to create communities with member management, 
              discussion forums, and engagement tools.
            </p>
            <div className="mt-8">
              <div className="inline-flex items-center px-6 py-3 bg-cyan-500/20 border border-cyan-400/30 rounded-full">
                <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3 animate-pulse"></div>
                <span className="text-cyan-300 font-medium">Coming Soon</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Preview */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="relative">
            <div className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10"></div>
            <div className="relative p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl mb-4 mx-auto flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Member Management</h3>
              <p className="text-white/60 text-sm">Advanced tools to manage and engage your community</p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10"></div>
            <div className="relative p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl mb-4 mx-auto flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Discussion Forums</h3>
              <p className="text-white/60 text-sm">Create topics, moderate discussions, and build engagement</p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10"></div>
            <div className="relative p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl mb-4 mx-auto flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Analytics & Insights</h3>
              <p className="text-white/60 text-sm">Track engagement, growth, and community health metrics</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CreateCommunityPage() {
  const { subscription, isLoading, error, isAuthenticated } = useSubscription();

  // Show loading state while checking subscription
  if (isLoading) {
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
            <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
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

  // Show upgrade plan wall for free users, direct access for paid users
  if (!subscription || !isUserPaidSubscriber(subscription)) {
    // Create a minimal user object for the upgrade wall
    const userForWall = isAuthenticated ? { subscription } : null;
    return <UpgradePlanWall type="community" user={userForWall} />;
  }

  // Show actual community creation form for paid users
  return <CreateCommunityForm />;
}