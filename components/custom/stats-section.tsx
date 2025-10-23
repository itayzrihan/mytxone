export function StatsSection() {
  const stats = [
    { number: "500+", label: "Projects Completed", icon: "🚀" },
    { number: "50+", label: "Service Categories", icon: "🎯" },
    { number: "24/7", label: "Support Available", icon: "🛡️" },
    { number: "100%", label: "Client Satisfaction", icon: "⭐" },
    { number: "15+", label: "Years Experience", icon: "🏆" },
    { number: "Global", label: "Reach Worldwide", icon: "🌍" }
  ];

  return (
    <div className="py-16 bg-gradient-to-r from-cyan-500/5 to-purple-500/5">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Trusted by Industry Leaders
          </h2>
          <p className="text-zinc-300">
            Our track record speaks for itself
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold text-cyan-400 mb-2">{stat.number}</div>
                <div className="text-sm text-zinc-400">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}