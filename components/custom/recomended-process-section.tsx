import { ArrowRight, Search, Lightbulb, Code, Rocket, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "בירור צרכים",
    description: "אנו מנתחים בעומק את הצרכים, הישימות של הרעיון והשוק כדי להגיד לכם אם זה ניתן להפוך לעסק.",
    step: "01"
  },
  {
    icon: Lightbulb,
    title: "אפיון",
    description: "פירוט מלא של הפונקציונליות, התכונות והממשק של המוצר שלכם עם וריאציות עיצוב.",
    step: "02"
  },
  {
    icon: Code,
    title: "פיתוח אבטיפוס",
    description: "בנייה של גרסה ראשונה פעולה של המוצר כדי לבדוק את הרעיון ולהציג למשקיעים.",
    step: "03"
  },
  {
    icon: Rocket,
    title: "המשך פיתוח או ישירות למשקיעים",
    description: "החלטה האם להמשיך לפיתוח מלא או להגיש את האבטיפוס למשקיעים חיצוניים.",
    step: "04"
  },
  {
    icon: CheckCircle,
    title: "MVP מוכן והשמיים הם הגבול",
    description: "שחרור הגרסה הראשונה שלכם לשוק וההתחלה של כל דבר אחר. העסק שלכם בדרך לייצור בסדרה.",
    step: "05"
  }
];

export function RecomendedProcessSection() {
  return (
    <div className="py-16" dir="rtl">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            התהליך המומלץ שלי
          </h2>
          <p className="text-zinc-300 max-w-2xl mx-auto">
            מרעיון למוצר בשוק - בחמש שלבים פשוטים וברורים
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