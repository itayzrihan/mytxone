import { auth } from "@/app/(auth)/auth";
import { generateUUID } from "@/lib/utils";

export default async function Page() {
  const session = await auth();

  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-4">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">
          Welcome to MyTX AI
        </h1>
        <p className="text-lg text-zinc-300 mb-8">
          Your intelligent assistant for chat, tasks, flights, and more
        </p>
        {session ? (
          <div className="space-y-4">
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
          <div className="space-y-4">
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