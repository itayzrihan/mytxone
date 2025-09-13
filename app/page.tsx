import { auth } from "@/app/(auth)/auth";
import { generateUUID } from "@/lib/utils";
import { CategoryCapsules } from "@/components/custom/category-capsules";
import { MeetingCards } from "@/components/custom/meeting-cards";

export default async function Page() {
  const session = await auth();

  return (
    <div className="flex flex-col min-h-screen p-4 pt-16">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-white mb-2">
          Meet new people
        </h1>
        <p className="text-lg mb-8">
          <span className="text-zinc-300">or </span>
          <span className="text-cyan-400">create a new meeting</span>
        </p>
        
        {/* Search Bar with Glass Morphism */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl shadow-black/20"></div>
            <div className="relative flex items-center">
              <svg
                className="absolute left-4 h-5 w-5 text-zinc-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search for people or meetings..."
                className="w-full bg-transparent text-white placeholder-zinc-400 pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all duration-300"
              />
            </div>
          </div>
        </div>
        
        <CategoryCapsules />
      </div>
      
      {/* Meeting Cards - Full width on desktop */}
      <div className="w-full max-w-6xl mx-auto px-4">
        <MeetingCards />
      </div>
      
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-lg text-zinc-300 mb-8">
          Your intelligent assistant for chat, tasks, flights, and more
        </p>
        {session ? (
          <div className="space-y-4 text-center">
            <p className="text-zinc-400">
              Welcome back, {session.user?.email}!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/aichat"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Start New Chat
              </a>
              <a
                href="/infographic"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Create Infographic
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-center">
            <p className="text-zinc-400 mb-6">
              Please sign in to access all features
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Sign In
              </a>
              <a
                href="/register"
                className="bg-zinc-600 hover:bg-zinc-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Sign Up
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}