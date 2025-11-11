import { CheckCircle, Clock, Users, Award, ShieldCheck, Rocket } from "lucide-react";

const features = [
  {
    icon: CheckCircle,
    title: "פתרונות מקצה לקצה",
    description: "ניהול מלא של מחזור חיי הפרויקט מהרעיון ועד להטמעה ותחזוקה."
  },
  {
    icon: Clock,
    title: "תמיכה 24/7",
    description: "תמיכה טכנית ומעקב מסביב לשעון לכל השירותים הדיגיטליים שלכם."
  },
  {
    icon: Users,
    title: "צוות מומחים",
    description: "אנשי מקצוע מיומנים עם שנים של ניסיון בטכנולוגיות מגוונות."
  },
  {
    icon: Award,
    title: "אבטחת איכות",
    description: "תהליכי בדיקה ובקרת איכות קפדניים למסירות אמינות."
  },
  {
    icon: ShieldCheck,
    title: "אבטחה קודם כל",
    description: "אמצעי אבטחה ברמה ארגונית ועמידה בתקני התעשייה."
  },
  {
    icon: Rocket,
    title: "פתרונות ניתנים להרחבה",
    description: "ארכיטקטורות עמידות לעתיד שגדלות עם צרכי העסק שלכם."
  }
];

export function FeaturesGrid() {
  return (
    <div className="py-16" dir="rtl">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">
          למה לבחור בי ?
        </h2>
        <p className="text-zinc-300 max-w-2xl mx-auto">
          אני משלב מומחיות, חדשנות ואמינות כדי לספק פתרונות דיגיטליים יוצאי דופן
          שמניעים את העסק שלכם קדימה.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div key={index} className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-start space-x-4 space-x-reverse">
                <div className="flex-shrink-0">
                  <div className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30">
                    <Icon className="w-6 h-6 text-cyan-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2 text-right">
                    {feature.title}
                  </h3>
                  <p className="text-zinc-400 leading-relaxed text-right">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}