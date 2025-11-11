import { ArrowRight, Search, Lightbulb, Code, Rocket, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "גילוי ותכנון",
    description: "אנו מנתחים את הדרישות, המטרות והאתגרים שלכם כדי ליצור אסטרטגיה מקיפה.",
    step: "01"
  },
  {
    icon: Lightbulb,
    title: "עיצוב ואסטרטגיה",
    description: "המומחים שלנו מעצבים פתרונות חדשניים ומפתחים מפות דרכים מפורטות לפרויקט.",
    step: "02"
  },
  {
    icon: Code,
    title: "פיתוח והטמעה",
    description: "אנו בונים את הפתרון שלכם תוך שימוש בטכנולוגיות חדשניות ושיטות עבודה מומלצות.",
    step: "03"
  },
  {
    icon: Rocket,
    title: "בדיקות והטמעה",
    description: "בדיקות קפדניות מבטיחות איכות לפני הטמעה חלקה לסביבת הייצור.",
    step: "04"
  },
  {
    icon: CheckCircle,
    title: "תמיכה ואופטימיזציה",
    description: "תמיכה שוטפת, מעקב ואופטימיזציה מתמשכת לביצועים מיטביים.",
    step: "05"
  }
];

export function ProcessSection() {
  return (
    <div className="py-16" dir="rtl">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            התהליך המוכח שלנו
          </h2>
          <p className="text-zinc-300 max-w-2xl mx-auto">
            גישה שיטתית שמספקת תוצאות יוצאות דופן בכל פעם
          </p>
        </div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-l from-cyan-500/20 via-blue-500/20 to-purple-500/20"></div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 h-full">
                    <div className="text-center mb-4">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-cyan-500/20 border border-cyan-500/30 rounded-full mb-4">
                        <Icon className="w-6 h-6 text-cyan-400" />
                      </div>
                      <div className="text-sm font-bold text-cyan-400 mb-2">שלב {step.step}</div>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-3 text-center">
                      {step.title}
                    </h3>
                    <p className="text-zinc-400 text-center leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Arrow for desktop - reversed for RTL */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-24 -left-4 z-10">
                      <ArrowRight className="w-8 h-8 text-cyan-400 rotate-180" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}