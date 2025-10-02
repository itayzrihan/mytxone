"use client";

import UpgradePlanWall from "@/components/custom/upgrade-plan-wall";
import { useSubscription, isUserPaidSubscriber } from "@/lib/use-subscription";

// Placeholder component for actual meeting creation
function CreateMeetingForm() {
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
              Create a Meeting
            </h1>
            <p className="text-xl text-white/80 leading-relaxed max-w-2xl mx-auto">
              Here you would soon be able to create meetings with advanced features, 
              scheduling, and collaboration tools.
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">HD Video Calls</h3>
              <p className="text-white/60 text-sm">Crystal clear video quality for professional meetings</p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10"></div>
            <div className="relative p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl mb-4 mx-auto flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Team Collaboration</h3>
              <p className="text-white/60 text-sm">Share screens, files, and collaborate in real-time</p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10"></div>
            <div className="relative p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl mb-4 mx-auto flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Smart Scheduling</h3>
              <p className="text-white/60 text-sm">AI-powered scheduling that works across time zones</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CreateMeetingPage() {
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

  // Show upgrade plan wall for free users, direct access for paid users
  if (!subscription || !isUserPaidSubscriber(subscription)) {
    // Create a minimal user object for the upgrade wall
    const userForWall = isAuthenticated ? { subscription } : null;
    return <UpgradePlanWall type="meeting" user={userForWall} />;
  }

  // Show actual meeting creation form for paid users
  return <CreateMeetingForm />;
}