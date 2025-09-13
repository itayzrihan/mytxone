import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "@/components/custom/icons";

export default function CreateMeetingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Main Card with Glassmorphism */}
        <div className="relative">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl shadow-black/20"></div>
          <div className="relative p-12 space-y-8">
            {/* Icon */}
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl flex items-center justify-center">
              <CalendarIcon size={40} />
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-white">
                Create New Meeting
              </h1>
              <p className="text-xl text-zinc-300">
                Start building your community landing page
              </p>
            </div>

            {/* Feature Preview */}
            <div className="relative">
              <div className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-xl border border-white/10"></div>
              <div className="relative p-6 text-left">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Coming Soon Features:
                </h3>
                <ul className="space-y-3 text-zinc-300">
                  <li className="flex items-start space-x-3">
                    <span className="text-cyan-400">✨</span>
                    <span>Custom meeting page URLs</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-cyan-400">✨</span>
                    <span>Glassmorphism landing page templates</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-cyan-400">✨</span>
                    <span>Member management dashboard</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-cyan-400">✨</span>
                    <span>Video integration and previews</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-cyan-400">✨</span>
                    <span>Real-time member statistics</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <Button 
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 text-lg"
                disabled
              >
                Get Early Access (Coming Soon)
              </Button>
              
              <Link href="/">
                <Button 
                  variant="outline" 
                  className="w-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white transition-all duration-300"
                >
                  ← Back to Meetings
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Preview Example */}
        <div className="relative">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-xl border border-white/10"></div>
          <div className="relative p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Preview: Your meeting page will look like
            </h3>
            <div className="space-y-3">
              <Link href="/mytx/example">
                <Button 
                  variant="outline" 
                  className="w-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-cyan-400 transition-all duration-300"
                >
                  View Example: Tech Innovators Hub →
                </Button>
              </Link>
              <Link href="/mytx/mandarin-blueprint-lite">
                <Button 
                  variant="outline" 
                  className="w-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-purple-400 transition-all duration-300"
                >
                  View Example: Mandarin Blueprint Lite →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}