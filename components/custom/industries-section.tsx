const industries = [
  { name: "טכנולוגיה", icon: "💻", description: "SaaS, פינטק, הלת'טק" },
  { name: "מסחר אלקטרוני", icon: "🛒", description: "קמעונאות, שוק, B2B" },
  { name: "בריאות", icon: "🏥", description: "רפואה, טלרפואה, ביוטכנולוגיה" },
  { name: "פיננסים", icon: "💰", description: "בנקאות, ביטוח, מסחר" },
  { name: "חינוך", icon: "🎓", description: "אדטק, פלטפורמות למידה" },
  { name: "ייצור", icon: "🏭", description: "תעשייה 4.0, IoT, אוטומציה" },
  { name: "נדל״ן", icon: "🏢", description: "פרופטק, בניינים חכמים" },
  { name: "בידור", icon: "🎬", description: "גיימינג, מדיה, סטרימינג" },
  { name: "לוגיסטיקה", icon: "🚚", description: "שרשרת אספקה, תחבורה" },
  { name: "חקלאות", icon: "🌾", description: "אגרוטכנולוגיה, חקלאות חכמה" },
  { name: "אנרגיה", icon: "⚡", description: "אנרגיות מתחדשות, רשת חכמה" },
  { name: "ממשלה", icon: "🏛️", description: "מגזר ציבורי, סיביק-טק" }
];

export function IndustriesSection() {
  return (
    <div className="py-16 bg-gradient-to-br from-blue-500/5 to-cyan-500/5" dir="rtl">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            תעשיות שאנו משרתים
          </h2>
          <p className="text-zinc-300 max-w-2xl mx-auto">
            פתרונות דיגיטליים מקיפים בכל התעשיות העיקריות
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
            לא רואים את התעשייה שלכם? אנו עובדים עם עסקים מכל הסוגים והגדלים.
          </p>
        </div>
      </div>
    </div>
  );
}