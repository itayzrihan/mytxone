"use client";

import { Lightbulb, Zap, Users, Code, Target, ArrowRight } from "lucide-react";

const aboutSections = [
  {
    icon: Lightbulb,
    title: "אב־טיפוס (Prototype)",
    description: "נבנה גרסה אינטראקטיבית שממחישה את הרעיון שלך, נראית כמו הדבר האמיתי ונותנת לך כלי להצגה בפני שותפים או משקיעים."
  },
  {
    icon: Zap,
    title: "MVP (מוצר מינימלי עובד)",
    description: "נפתח גרסה התחלתית של האפליקציה, שמאפשרת לבדוק את השוק ולראות תגובות אמיתיות מהשטח."
  },
  {
    icon: Target,
    title: "הפיתוח המלא",
    description: "לאחר שאישרנו את הכיוון, נתקדם לגרסה מלאה, עם כל הפונקציות, העיצוב והיכולות שצריך כדי לצאת לשוק."
  }
];

const strengths = [
  { label: "Full-Stack Developer", icon: Code },
  { label: "טכנולוג יזם", icon: Target },
  { label: "UX/UI Design", icon: Zap },
  { label: "עסקי אסטרטגיה", icon: Users }
];

export function AboutSection() {
  return (
    <section className="py-24 px-6 md:px-8 lg:px-12" dir="rtl" id="about">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
            אודות
          </h2>

        </div>

        {/* Unique Value Proposition */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Card 1 - Who I Am */}
          <div className="bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-cyan-500/30 rounded-2xl p-8 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/20">
            <div className="flex items-center justify-end mb-4">
              <h3 className="text-2xl font-bold text-white text-right">מי אני באמת</h3>
              <div className="mr-3 p-2 bg-cyan-500/20 rounded-lg">
                <Zap className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
            <p className="text-zinc-300 text-lg leading-relaxed text-right">
              אני מומחה טכנולוגי עם ראש יצירתי במיוחד ויכולת נדירה גם להוביל חזון גדול וגם לצלול עד לרמת הבורג הקטן ביותר.
            </p>
            <div className="mt-6 h-1 w-full bg-gradient-to-l from-cyan-500/50 to-transparent rounded-full"></div>
          </div>

          {/* Card 2 - All in One */}
          <div className="bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-red-500/10 border border-purple-500/30 rounded-2xl p-8 hover:border-purple-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20">
            <div className="flex items-center justify-end mb-4">
              <h3 className="text-2xl font-bold text-white text-right">הכל באחד</h3>
              <div className="mr-3 p-2 bg-purple-500/20 rounded-lg">
                <Target className="w-6 h-6 text-purple-400" />
              </div>
            </div>
            <p className="text-zinc-300 text-lg leading-relaxed text-right">
              מי שמדבר איתי מקבל שילוב חד־פעמי של אסטרטג, מפתח, משווק, מעצב ומנהל מערכות – הכל באדם אחד, שמחובר עד הסוף לתוצאות.
            </p>
            <div className="mt-6 h-1 w-full bg-gradient-to-l from-purple-500/50 to-transparent rounded-full"></div>
          </div>
        </div>

        {/* Main Value Statement */}
        <div className="bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-500/30 rounded-2xl p-8 mb-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10">
            <p className="text-zinc-200 text-xl leading-relaxed text-right mb-4">
              במקום לרדוף אחרי חמישה ספקים שונים, אתם מקבלים <span className="text-orange-400 font-bold">כתובת אחת</span> שחושבת הוליסטית על העסק שלכם:
            </p>
            <p className="text-zinc-300 text-lg leading-relaxed text-right">
              מהמסר השיווקי, דרך החוויה הדיגיטלית ועד לאוטומציה שמייצרת לכם כסף בזמן שאתם ישנים.
            </p>
          </div>
        </div>

        {/* Expertise Cards */}
        <div className="mb-12">
          <h3 className="text-3xl font-bold text-white mb-2 text-right">
            מה אני מביא לשולחן
          </h3>
          <p className="text-zinc-500 text-lg mb-6 text-right">
            ושהופך את זה למאוד קשה לוותר עליו
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "שיווק ואסטרטגיות צמיחה", desc: "בניית אסטרטגיה שמחברת בין המסר הנכון, לקהל הנכון, בזמן הנכון – כדי להפוך מתעניינים ללקוחות משלמים.", color: "from-blue-500/20 to-cyan-500/20", borderColor: "border-blue-500/30" },
              { title: "פיתוח Fullstack", desc: "תכנון ובנייה של מערכות, אתרים, מערכות SaaS וממשקים מורכבים, מקצה לקצה, עם דגש על ביצועים, יציבות וסקייל.", color: "from-green-500/20 to-emerald-500/20", borderColor: "border-green-500/30" },
              { title: "ניהול שרתים ופריסת מערכות", desc: "הקמה ותחזוקה של תשתיות יציבות, מאובטחות ומוכנות לצמיחה, בלי \"הפתעות\" באמצע הלילה.", color: "from-purple-500/20 to-pink-500/20", borderColor: "border-purple-500/30" },
              { title: "אבטחת סייבר", desc: "תכנון ובקרה שמגנים על הנתונים, הנכסים הדיגיטליים והלקוחות שלכם בסביבה דיגיטלית מאתגרת.", color: "from-slate-500/20 to-gray-500/20", borderColor: "border-slate-500/30" },
              { title: "ניתוח תהליכי מכירה וחוויית לקוח", desc: "מיפוי והאצת המסע של הלקוח, משלב החשיפה ועד הסגירה – כדי שלא תאבדו כסף בדרך.", color: "from-violet-500/20 to-indigo-500/20", borderColor: "border-violet-500/30" },
              { title: "עיצוב גרפי ו-UI/UX", desc: "חוויות דיגיטליות שמרגישות טוב בעין, עובדות מעולה ביד, ומייצרות אמון והמרות.", color: "from-pink-500/20 to-rose-500/20", borderColor: "border-pink-500/30" },
              { title: "עריכת וידאו ותוכן דיגיטלי", desc: "יצירת נכסים שיווקיים חדים, מרגשים ו\"עוצרים גלילה\" שמתורגמים במדויק למטרות העסקיות.", color: "from-indigo-500/20 to-blue-500/20", borderColor: "border-indigo-500/30" },
              { title: "אוטומציות מורכבות", desc: "חיבור המערכות שמאחורי הקלעים כך שהעסק יעבוד בשבילכם, ולא להפך – פחות עבודת יד, יותר תוצאות.", color: "from-cyan-500/20 to-teal-500/20", borderColor: "border-cyan-500/30" },
              { title: "בינה מלאכותית (AI)", desc: "שילוב חכם של פתרונות AI בתהליכים קיימים: חיסכון בזמן, שיפור ביצועים ויצירת יתרון תחרותי אמיתי.", color: "from-violet-500/20 to-purple-500/20", borderColor: "border-violet-500/30" },
              { title: "כתיבה שיווקית", desc: "ניסוח מדויק של מסרים שקולעים לבטן הרכה של הלקוח והופכים \"נשמע מעניין\" ל\"אני בפנים\".", color: "from-emerald-500/20 to-teal-500/20", borderColor: "border-emerald-500/30" }
            ].map((skill, index) => (
              <div
                key={index}
                className={`backdrop-blur-md bg-gradient-to-br ${skill.color} border ${skill.borderColor} rounded-xl p-6 hover:scale-105 transition-all duration-300 hover:shadow-lg`}
              >
                <h4 className="text-lg font-bold text-white mb-3 text-right">
                  {skill.title}
                </h4>
                <p className="text-zinc-300 text-sm leading-relaxed text-right">
                  {skill.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-zinc-400 text-lg italic">
              וזה באמת רק קצה המזלג.
            </p>
          </div>
        </div>

        {/* Final Statement */}
        <div className="bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border-2 border-cyan-500/40 rounded-2xl p-10 mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <p className="text-zinc-200 text-xl leading-relaxed text-right">
              אם אתם רוצים מישהו שחושב על העסק שלכם כמו על שלו – ומסוגל גם <span className="text-cyan-400 font-bold">לחלום בגדול</span> וגם <span className="text-purple-400 font-bold">לבצע עד רמת הפיקסל וה־log</span> – זה הרגע שבו אתם מבינים:
            </p>
            <p className="text-white text-2xl font-bold text-right mt-4">
              זה בדיוק מה שחיפשתם, גם אם עדיין לא ידעתם את זה.
            </p>
          </div>
        </div>

        {/* Mission */}
        <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-8 mb-16">
          <h3 className="text-2xl font-bold text-white mb-6 text-right">
            המשימה שלי
          </h3>
          <p className="text-zinc-300 text-lg leading-relaxed text-right mb-4">
            אני מלווה יזמים, בעלי עסקים וסטארטאפים משלב הרעיון ועד לאפליקציה מוכנה להשקה. כולל ליווי מלא לאחר מכן בשיווק אסטרטגיות, ניהול מוצר והרחבות עתידיות.
          </p>
          <p className="text-zinc-300 text-lg leading-relaxed text-right">
            התהליך שאני מוביל מאפשר לך לבדוק את הכיוון, לגייס משקיעים ולבנות מוצר אמיתי בלי לקחת סיכונים מיותרים.
          </p>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-white mb-4 text-right">
            איך זה עובד?
          </h3>
          <p className="text-zinc-300 text-lg mb-8 text-right">
            אנחנו נתקדם במדרגות חכמות של פיתוח, שמאפשרות לך לראות תוצאות כבר מהשלב הראשון:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {aboutSections.map((section, index) => {
              const Icon = section.icon;
              return (
                <div
                  key={index}
                  className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-cyan-500/20 border border-cyan-500/30 rounded-lg flex-shrink-0">
                      <Icon className="w-6 h-6 text-cyan-400" />
                    </div>
                    <h4 className="text-xl font-bold text-white text-right flex-1 mr-3">
                      {section.title}
                    </h4>
                  </div>
                  <p className="text-zinc-300 leading-relaxed text-right">
                    {section.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Technology Stack Highlight */}
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-8 mb-16">
          <h3 className="text-2xl font-bold text-white mb-4 text-right">
            הטכנולוגיה שלי
          </h3>
          <p className="text-zinc-300 text-lg leading-relaxed text-right">
            הכול נעשה בטכנולוגיה אחת חכמה 
          </p>

                    <p className="text-zinc-300 text-lg leading-relaxed text-right">
           <span className="text-cyan-400 font-semibold">(React Native / Expo)</span>
          </p>
          
                    <p className="text-zinc-300 text-lg leading-relaxed text-right">
        שמאפשרת לך להגיע בקלות ל־
          </p>
                              <p className="text-zinc-300 text-lg leading-relaxed text-right">
        <span className="text-cyan-400 font-semibold">iOS, Android וה־Web</span>
                  </p>

                                        <p className="text-zinc-300 text-lg leading-relaxed text-right">
       תוך שמירה על קוד אחיד, יעיל ונקי.
          </p>
        </div>

        {/* About Me */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-white mb-8 text-right">
            מי אני
          </h3>

          <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
            <p className="text-zinc-300 text-lg leading-relaxed text-right mb-6">
              <span className="text-cyan-400 font-semibold">נעים מאוד, אני איתי זריהן</span> — מפתח Full-Stack ויזם טכנולוגי.
            </p>
            <p className="text-zinc-300 text-lg leading-relaxed text-right mb-6">
              עם ניסיון של שנים בפיתוח מערכות ואפליקציות מורכבות, אני משלב בין הבנה עסקית עמוקה לחשיבה הנדסית ויצירתית.
            </p>
            <p className="text-zinc-300 text-lg leading-relaxed text-right">
              המומחיות שלי היא לקחת רעיון ולתרגם אותו למוצר עובד — כזה שאפשר להציג, לבדוק, ולבסוף להשיק לשוק.
            </p>
          </div>

          {/* Expertise */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {strengths.map((strength, index) => {
              const Icon = strength.icon;
              return (
                <div
                  key={index}
                  className="backdrop-blur-md bg-white/5 border border-white/10 rounded-lg p-4 text-center hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex justify-center mb-2">
                    <Icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <p className="text-sm font-semibold text-white">{strength.label}</p>
                </div>
              );
            })}
          </div>

          <p className="text-zinc-300 text-lg leading-relaxed text-right mb-6 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl p-6">
            אני לא רק &quot;מפתח אפליקציות&quot;, אלא <span className="text-cyan-400 font-semibold">שותף תהליכי</span> שמלווה אותך מהחזון ועד הביצוע — כולל אפיון, עיצוב UX/UI, בניית אסטרטגיה עסקית והכוונה בשיווק והשקה.
          </p>

          <p className="text-zinc-300 text-lg leading-relaxed text-right bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6">
            במקום שתבזבז עשרות אלפי שקלים על פיתוח לא-בדוק,
            אני עוזר לך לבנות חכמה – צעד אחרי צעד, עם בסיס אמיתי שיכול להפוך לסטארטאפ רווחי.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-6">
            רוצה להפוך את הרעיון שלך למוצר חי?
          </h3>
          <p className="text-zinc-300 text-lg mb-8">
            דבר איתי, ונבנה יחד את הצעד הראשון שלך לעולם הדיגיטלי.
          </p>
          <div className="flex flex-col sm:flex-col gap-4 items-center justify-center">
            <a
              href="https://wa.me/972515511581?text=שלום אתיי, אני מעוניין לדבר על הרעיון שלי"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/50"
            >
              <span>📞 051-5511581</span>
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
