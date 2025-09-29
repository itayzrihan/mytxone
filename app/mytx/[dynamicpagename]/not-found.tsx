import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        {/* Main Card with Glassmorphism */}
        <div className="relative max-w-md mx-auto">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl shadow-black/20"></div>
          <div className="relative p-8 space-y-6">
            {/* 404 Icon */}
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
              </svg>
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-white">
                Meeting Not Found
              </h1>
              <p className="text-lg text-zinc-300">
                The meeting page you&apos;re looking for doesn&apos;t exist or has been moved.
              </p>
            </div>

            <div className="space-y-3">
              <Link href="/">
                <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  Browse All Meetings
                </Button>
              </Link>
              
              <Link href="/mytx/create">
                <Button 
                  variant="outline" 
                  className="w-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white transition-all duration-300"
                >
                  Create Your Own Meeting
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Suggestions */}
        <div className="relative max-w-lg mx-auto">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-xl border border-white/10"></div>
          <div className="relative p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              What you can do:
            </h3>
            <ul className="space-y-2 text-sm text-zinc-300 text-left">
              <li className="flex items-center space-x-2">
                <span className="text-cyan-400">•</span>
                <span>Check the URL for typos</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-cyan-400">•</span>
                <span>Browse existing meetings on the main page</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-cyan-400">•</span>
                <span>Create a new meeting if you&apos;re looking to start one</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-cyan-400">•</span>
                <span>Contact support if you believe this is an error</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}