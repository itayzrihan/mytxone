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
          <p className="text-2xl text-cyan-400 font-semibold mb-4">
            הדרך להפוך רעיון למוצר חי
          </p>
        </div>

        {/* Problem Statement */}
        <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-2xl p-8 mb-12">
          <p className="text-zinc-300 text-lg leading-relaxed text-right mb-4">
            רוב הרעיונות הטובים נתקעים בשלב הדמיון.
          </p>
          <p className="text-zinc-300 text-lg leading-relaxed text-right">
            המטרה שלי היא לעזור לך להפוך אותם למציאות — בצורה חכמה, מדורגת וחסכונית.
          </p>
        </div>

        {/* Mission */}
        <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-8 mb-16">
          <h3 className="text-2xl font-bold text-white mb-6 text-right">
            המשימה שלי
          </h3>
          <p className="text-zinc-300 text-lg leading-relaxed text-right mb-4">
            אני מלווה יזמים, בעלי עסקים וסטארטאפים משלב הרעיון ועד לאפליקציה מוכנה להשקה.
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
                  <div className="flex items-center justify-end mb-4 gap-3">
                    <h4 className="text-xl font-bold text-white text-right">
                      {section.title}
                    </h4>
                    <div className="p-3 bg-cyan-500/20 border border-cyan-500/30 rounded-lg flex-shrink-0">
                      <Icon className="w-6 h-6 text-cyan-400" />
                    </div>
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

          <p className="text-zinc-300 text-lg leading-relaxed text-right mb-6 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-6">
            אני לא רק "מפתח אפליקציות", אלא <span className="text-yellow-400 font-semibold">שותף תהליכי</span> שמלווה אותך מהחזון ועד הביצוע — כולל אפיון, עיצוב UX/UI, בניית אסטרטגיה עסקית והכוונה בשיווק והשקה.
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
