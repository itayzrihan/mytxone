import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "שרה ג'ונסון",
    position: "מנהלת טכנולוגיות",
    industry: "פלטפורמת SaaS",
    content: "mytx.one שינתה את כל התשתית הדיגיטלית שלנו. הגישה של 360° שלהם כיסתה הכל מפיתוח אפליקציות ועד להעברה לענן. התוצאות עברו את הציפיות שלנו.",
    rating: 5,
    avatar: "ש"
  },
  {
    name: "מיכאל צ'ן",
    position: "מנכ״ל",
    industry: "סטארטאפ AI",
    content: "המומחיות באבטחת סייבר ו-AI ב-mytx.one אין שני לה. הם אבטחו את הפלטפורמה שלנו והטמיעו תכונות ML חדשניות שהכפילו פי שלושה את המעורבות של המשתמשים.",
    rating: 5,
    avatar: "מ"
  },
  {
    name: "אמילי רודריגז",
    position: "מנהלת",
    industry: "פלטפורמת SaaS",
    content: "mytx.one עזרה לנו לבנות פלטפורמת SaaS סקלבילית עם ממשק משתמש מרהיב וארכיטקטורת ענן חזקה. הצוות שלהם הבין את הצרכים הייחודיים של תעשיית SaaS והציע פתרונות שיצאו מהדופן.",
    rating: 5,
    avatar: "א"
  },
  {
    name: "דיוויד פארק",
    position: "מייסד",
    industry: "פלטפורמת מסחר אלקטרוני",
    content: "שירותי הפקת הווידאו ופיתוח האתרים יצרו נוכחות מותגית מרהיבה. הגישה המקיפה של mytx.one חסכה לנו זמן וסיפקה איכות יוצאת דופן.",
    rating: 5,
    avatar: "ד"
  },
  {
    name: "ליסה תומפסון",
    position: "סגנית מנהל הנדסה",
    industry: "אנליטיקת ביג דאטה",
    content: "ארכיטקטורת הענן ופתרונות ניהול המידע שלהם הגדילו את הפלטפורמה שלנו לטיפול במיליוני משתמשים. שירותי התמיכה 24/7 והאופטימיזציה הם בעלי ערך רב.",
    rating: 5,
    avatar: "ל"
  },
  {
    name: "ג'יימס ווילסון",
    position: "מנהל מוצר",
    industry: "פלטפורמת SaaS",
    content: "עבדנו עם mytx.one על שדרוג מלא של המערכת שלנו. הם סיפקו פתרון SaaS מודרני עם תכונות עדכניות, אינטגרציות חיצוניות וביטחון מעולה. השירות והתמיכה שלהם לא מעולים.",
    rating: 5,
    avatar: "ג"
  }
];

export function TestimonialsSection() {
  return (
    <div className="py-16 bg-gradient-to-r from-purple-500/5 to-pink-500/5" dir="rtl">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            מה הלקוחות שלי אומרים
          </h2>
          <p className="text-zinc-300 max-w-2xl mx-auto">
             על ידי עסקים ברחבי העולם למתן פתרונות דיגיטליים יוצאי דופן
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center mb-4 justify-end">
                <div className="flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-cyan-400 ml-2" />
              </div>

              <p className="text-zinc-300 mb-6 leading-relaxed italic text-right">
                &quot;{testimonial.content}&quot;
              </p>

              <div className="flex items-center flex-row-reverse gap-4 justify-end">
                <div className="w-10 h-10 bg-cyan-500/20 border border-cyan-500/30 rounded-full flex items-center justify-center text-cyan-400 font-semibold flex-shrink-0">
                  {testimonial.avatar}
                </div>
                <div className="text-right ml-auto">
                  <div className="text-white font-semibold">{testimonial.name}</div>
                  <div className="text-zinc-400 text-sm">{testimonial.position}</div>
                  <div className="text-cyan-400 text-xs">{testimonial.industry}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-1 space-x-reverse">
            <span className="text-yellow-400">★★★★★</span>
            <span className="text-zinc-400 mr-2">דירוג ממוצע של 4.9/5 מלמעלה מ-200 ביקורות</span>
          </div>
        </div>
      </div>
    </div>
  );
}