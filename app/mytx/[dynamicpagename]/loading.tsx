export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        {/* Loading Card with Glassmorphism */}
        <div className="relative max-w-md mx-auto">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl shadow-black/20"></div>
          <div className="relative p-8 space-y-6">
            {/* Loading Icon */}
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>

            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-white">
                Loading Meeting...
              </h1>
              <p className="text-zinc-300">
                Preparing your community experience
              </p>
            </div>

            {/* Loading Skeleton */}
            <div className="space-y-3">
              <div className="h-4 bg-white/10 rounded animate-pulse"></div>
              <div className="h-4 bg-white/10 rounded animate-pulse w-3/4"></div>
              <div className="h-4 bg-white/10 rounded animate-pulse w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}