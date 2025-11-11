const technologies = {
  frontend: [
    { name: "React", icon: "⚛️" },
    { name: "Next.js", icon: "▲" },
    { name: "Vue.js", icon: "💚" },
    { name: "Angular", icon: "🅰️" },
    { name: "TypeScript", icon: "🔷" },
    { name: "Tailwind CSS", icon: "🎨" }
  ],
  backend: [
    { name: "Node.js", icon: "🟢" },
    { name: "Python", icon: "🐍" },
    { name: "Go", icon: "🐹" },
    { name: "Java", icon: "☕" },
    { name: "PHP", icon: "🐘" },
    { name: ".NET", icon: "🔵" }
  ],
  cloud: [
    { name: "AWS", icon: "☁️" },
    { name: "Azure", icon: "🔷" },
    { name: "GCP", icon: "🌐" },
    { name: "Docker", icon: "🐳" },
    { name: "Kubernetes", icon: "⚓" },
    { name: "Terraform", icon: "🏗️" }
  ],
  databases: [
    { name: "PostgreSQL", icon: "🐘" },
    { name: "MongoDB", icon: "🍃" },
    { name: "Redis", icon: "🔴" },
    { name: "MySQL", icon: "🟡" },
    { name: "Elasticsearch", icon: "🔍" },
    { name: "DynamoDB", icon: "📊" }
  ],
  ai: [
    { name: "OpenAI", icon: "🤖" },
    { name: "TensorFlow", icon: "🧠" },
    { name: "PyTorch", icon: "🔥" },
    { name: "Hugging Face", icon: "🤗" },
    { name: "LangChain", icon: "⛓️" },
    { name: "Anthropic", icon: "🧑‍💻" }
  ]
};

export function TechStackSection() {
  const categories = [
    { key: "frontend", title: "פרונט-אנד", data: technologies.frontend },
    { key: "backend", title: "בק-אנד", data: technologies.backend },
    { key: "cloud", title: "ענן ו-DevOps", data: technologies.cloud },
    { key: "databases", title: "מסדי נתונים", data: technologies.databases },
    { key: "ai", title: "AI ולמידת מכונה", data: technologies.ai }
  ];

  return (
    <div className="py-16" dir="rtl" id="tech-stack">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            ערימת הטכנולוגיה
          </h2>
          <p className="text-zinc-300 max-w-2xl mx-auto">
            אנו ממנפים את הטכנולוגיות והמסגרות העדכניות ביותר כדי לבנות פתרונות חזקים וניתנים להרחבה
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {categories.map((category, index) => (
            <div key={index} className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 text-center">
                {category.title}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {category.data.map((tech, techIndex) => (
                  <div key={techIndex} className="flex flex-col items-center text-center group">
                    <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">
                      {tech.icon}
                    </div>
                    <span className="text-xs text-zinc-400 group-hover:text-cyan-400 transition-colors">
                      {tech.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}