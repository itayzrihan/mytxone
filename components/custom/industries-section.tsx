const industries = [
  { name: "Technology", icon: "💻", description: "SaaS, FinTech, HealthTech" },
  { name: "E-commerce", icon: "🛒", description: "Retail, Marketplace, B2B" },
  { name: "Healthcare", icon: "🏥", description: "Medical, Telehealth, Biotech" },
  { name: "Finance", icon: "💰", description: "Banking, Insurance, Trading" },
  { name: "Education", icon: "🎓", description: "EdTech, Learning Platforms" },
  { name: "Manufacturing", icon: "🏭", description: "Industry 4.0, IoT, Automation" },
  { name: "Real Estate", icon: "🏢", description: "PropTech, Smart Buildings" },
  { name: "Entertainment", icon: "🎬", description: "Gaming, Media, Streaming" },
  { name: "Logistics", icon: "🚚", description: "Supply Chain, Transportation" },
  { name: "Agriculture", icon: "🌾", description: "AgTech, Smart Farming" },
  { name: "Energy", icon: "⚡", description: "Renewables, Smart Grid" },
  { name: "Government", icon: "🏛️", description: "Public Sector, Civic Tech" }
];

export function IndustriesSection() {
  return (
    <div className="py-16 bg-gradient-to-br from-blue-500/5 to-cyan-500/5">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Industries We Serve
          </h2>
          <p className="text-zinc-300 max-w-2xl mx-auto">
            Comprehensive digital solutions across all major industries
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {industries.map((industry, index) => (
            <div key={index} className="backdrop-blur-md bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105 text-center group">
              <div className="text-2xl mb-2">{industry.icon}</div>
              <h3 className="text-sm font-semibold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                {industry.name}
              </h3>
              <p className="text-xs text-zinc-400 leading-tight">
                {industry.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-zinc-400">
            Don&apos;t see your industry? We work with businesses of all types and sizes.
          </p>
        </div>
      </div>
    </div>
  );
}