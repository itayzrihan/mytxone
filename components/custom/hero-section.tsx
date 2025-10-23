import { SearchBar } from "@/components/custom/search-bar";

export function HeroSection() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10" />

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              mytx.one
            </span>
          </h1>
          <p className="text-2xl md:text-3xl text-zinc-300 mb-8 font-light">
            One Place for the Whole Digital World
          </p>
          <p className="text-lg md:text-xl text-zinc-400 max-w-4xl mx-auto leading-relaxed">
            Comprehensive 360° digital services covering everything from video production and app development
            to cybersecurity, hardware solutions, cloud infrastructure, and beyond. Your complete digital ecosystem.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <SearchBar variant="full" />
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="text-3xl font-bold text-cyan-400 mb-2">500+</div>
            <div className="text-sm text-zinc-400">Projects Completed</div>
          </div>
          <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="text-3xl font-bold text-cyan-400 mb-2">50+</div>
            <div className="text-sm text-zinc-400">Service Categories</div>
          </div>
          <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="text-3xl font-bold text-cyan-400 mb-2">24/7</div>
            <div className="text-sm text-zinc-400">Expert Support</div>
          </div>
          <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="text-3xl font-bold text-cyan-400 mb-2">100%</div>
            <div className="text-sm text-zinc-400">Client Satisfaction</div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-zinc-400">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-sm">ISO 27001 Certified</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span className="text-sm">GDPR Compliant</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            <span className="text-sm">SOC 2 Type II</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <span className="text-sm">99.9% Uptime SLA</span>
          </div>
        </div>
      </div>
    </div>
  );
}