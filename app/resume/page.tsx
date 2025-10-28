'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, ExternalLink, Download, Github, Linkedin } from 'lucide-react';

export default function ResumePage() {
  const [scrollY, setScrollY] = useState(0);
  const [activeTab, setActiveTab] = useState('profile');
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const skills = {
    frontend: ['React', 'React Native', 'TypeScript', 'Next.js', 'Figma', 'UI/UX Design'],
    backend: ['Node.js', 'Python (Flask, FastAPI)', 'Golang', 'Rust'],
    data: ['SQL', 'MongoDB', 'Pandas', 'Data Modeling', 'Machine Learning', 'AI Integrations'],
    devops: ['AWS', 'Docker', 'Git', 'CI/CD', 'Cloud Deployment'],
    security: ['API Security', 'Encryption', 'Access Control', 'Linux', 'GDPR'],
    media: ['Video Editing', 'Photoshop', 'Illustrator', 'Animation'],
  };

  const experiences = [
    {
      title: 'Full-Stack Developer',
      description: 'בפרויקטים שונים בתחומי EdTech ופתרונות דיגיטליים',
      highlights: [
        'פיתוח וניהול מערכות Frontend/Backend בעזרת React/Node.js/Python',
        'בניית אלגוריתמים אדפטיביים וסקורינג',
        'עיבוד וניתוח נתונים ודאש-בורדים',
        'עמידה בתקני פרטיות (GDPR)',
      ],
    },
    {
      title: 'יזם מומחה דיגיטל',
      period: '2017–2025',
      description: 'בעסק עצמאי וייעוץ בתחום הדיגיטל',
      highlights: [
        'פיתוח אתרים ואפליקציות מלאות (React Native/Flutter)',
        'ארכיטקטורה תוכנה ותכנון מערכות',
        'עיצוב UI/UX דגוש חוויית משתמש',
        'ניהול פרויקטים וצוותים, יעוץ עסקי',
        'שיווק דיגיטלי, SEO, ואוטומציות',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden font-['Assistant',_'Rubik',_system-ui,_-apple-system,_sans-serif]" dir="rtl">
      {/* Animated Background Elements with Parallax */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Floating shapes */}
        <div
          className="absolute top-10 right-10 w-96 h-96 bg-gradient-to-br from-cyan-400/30 to-blue-400/20 rounded-full blur-3xl"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        />
        <div
          className="absolute top-1/3 left-10 w-80 h-80 bg-gradient-to-br from-purple-400/30 to-pink-400/20 rounded-full blur-3xl"
          style={{ transform: `translateY(${scrollY * -0.08}px)` }}
        />
        <div
          className="absolute bottom-10 left-1/2 w-96 h-96 bg-gradient-to-br from-emerald-400/30 to-cyan-400/20 rounded-full blur-3xl"
          style={{ transform: `translateY(${scrollY * 0.12}px)` }}
        />
        <div
          className="absolute top-1/2 right-1/4 w-72 h-72 bg-gradient-to-br from-amber-400/30 to-orange-400/20 rounded-full blur-3xl"
          style={{ transform: `translateY(${scrollY * 0.15}px)` }}
        />

        {/* Animated shapes */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="2" fill="#06b6d4" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="min-h-screen flex items-center justify-center px-4 pt-20 pb-0">
          <div className="max-w-4xl mx-auto text-center">
    

            {/* Hero Section */}
            <div className="space-y-6 mb-0">
              <div className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/40 backdrop-blur-sm">
                <span className="text-cyan-600 font-semibold">💻 Full-Stack Developer</span>
              </div>

              <h1 className="text-6xl md:text-7xl font-bold">
                <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  איתי דילן זיונץ זריהן
                </span>
              </h1>


              {/* Contact Info */}
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <a
                  href="tel:0515511581"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500/10 to-blue-500/10 hover:from-cyan-500/20 hover:to-blue-500/20 border border-cyan-400/30 transition-all duration-300 text-gray-700 hover:text-gray-900 group"
                >
                  <Phone className="w-4 h-4 group-hover:text-cyan-500" />
                  <span className="text-sm">0515511581</span>
                </a>
                <a
                  href="mailto:sales.growth.digital@gmail.com"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500/10 to-blue-500/10 hover:from-cyan-500/20 hover:to-blue-500/20 border border-cyan-400/30 transition-all duration-300 text-gray-700 hover:text-gray-900 group"
                >
                  <Mail className="w-4 h-4 group-hover:text-cyan-500" />
                  <span className="text-sm">sales.growth.digital@gmail.com</span>
                </a>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-400/30 text-gray-700">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm">חיפה | גיל 30</span>
                </div>
              </div>
            </div>
            {/* Scroll Down Indicator */}
            <div className="mt-12 flex justify-center">
              <div className="animate-bounce">
                <svg
                  className="w-8 h-8 text-cyan-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </div>
            </div>
          </div>
        </header>

        {/* Synergy Animation Section */}
        <div className="max-w-6xl mx-auto px-4 -mt-32 justify-center flex mb-20">
          <div className="flex justify-center">
            <div className="relative py-2" dir="ltr">
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-4 text-5xl font-bold">
                  <span className="synergy-item opacity-0 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">1</span>
                  <span className="synergy-item opacity-0 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">+</span>
                  <span className="synergy-item opacity-0 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">1</span>
                  <span className="synergy-item opacity-0 bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">=</span>
                  <span className="synergy-item opacity-0 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">3</span>
                </div>
                <div className="synergy-item opacity-0 text-xl font-semibold text-gray-700">
                  (סינרגיה)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Sections */}
        <div className="max-w-6xl mx-auto px-4 pb-20">
          {/* Professional Profile Section */}
          <section className="mb-20">
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
              <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl p-8 md:p-12 hover:border-gray-300 transition-all duration-300 shadow-lg">
                <h2 className="text-3xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                    פרופיל מקצועי
                  </span>
                </h2>
                <p className="text-gray-800 leading-relaxed text-lg">
                  מפתח Full-stack עם ניסיון של מעל 10 שנים בפיתוח מערכות מובייל ואפליקציות חכמות, כולל בניית אלגוריתמים אדפטיביים, עיבוד נתונים, ומערכות AI ובינה מלאכותית LLM + ML.
                </p>
                <p className="text-gray-700 leading-relaxed text-base mt-4">
                  משלב יכולת טכנית גבוהה עם הבנה עמוקה של חוויית משתמש וחשיבה יצירתית. מומחה בשלל תחומי דיגיטל כולל עיצוב, וידאו, UI/UX. מחוקר בתחום פסיכולוגיה, פילוסופיה ושפה עם יכולות תקשורת גבוהות ניסיון בהקמה וניהול צוותים.
                </p>
              </div>
            </div>
          </section>

          {/* Experience Section */}
          <section className="mb-20">
            <h2 className="text-4xl font-bold mb-12">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                ניסיון מקצועי
              </span>
            </h2>
            <div className="grid gap-6 md:gap-8">
              {experiences.map((exp, idx) => (
                <div
                  key={idx}
                  className="group relative"
                  style={{
                    animation: `slideInUp 0.6s ease-out ${idx * 0.1}s both`,
                  }}
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                  <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl p-8 hover:border-gray-300 transition-all duration-300 shadow-lg">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-cyan-600">{exp.title}</h3>
                        <p className="text-gray-600 text-sm mt-1">{exp.period}</p>
                      </div>
                      <div className="text-4xl opacity-20">💼</div>
                    </div>
                    <p className="text-gray-800 mb-6">{exp.description}</p>
                    <ul className="space-y-3">
                      {exp.highlights.map((highlight, i) => (
                        <li key={i} className="flex items-start gap-3 text-gray-700">
                          <span className="text-emerald-500 font-bold mt-1">✓</span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Skills Section */}
          <section className="mb-20">
            <h2 className="text-4xl font-bold mb-12">
              <span className="bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                כישורים וטכנולוגיות
              </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(skills).map(([category, items], idx) => (
                <div
                  key={category}
                  className="group relative"
                  style={{
                    animation: `slideInUp 0.6s ease-out ${idx * 0.1}s both`,
                  }}
                >
                  <div className="absolute -inset-1 bg-gradient-to-br from-cyan-600 to-emerald-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                  <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-all duration-300 h-full shadow-lg">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 capitalize">
                      {category === 'frontend' && '🎨 Frontend'}
                      {category === 'backend' && '⚙️ Backend'}
                      {category === 'data' && '📊 Data & AI'}
                      {category === 'devops' && '🚀 DevOps'}
                      {category === 'security' && '🔒 Security'}
                      {category === 'media' && '🎬 Media & Design'}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {items.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/50 text-gray-800 text-sm hover:border-cyan-500 transition-all duration-300 cursor-default"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Languages Section */}
          <section className="mb-20">
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
              <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl p-8 md:p-12 hover:border-gray-300 transition-all duration-300 shadow-lg">
                <h3 className="text-2xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    🌍 שפות
                  </span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl text-gray-900">🇮🇱</span>
                    <div>
                      <p className="text-gray-900 font-semibold">עברית</p>
                      <p className="text-gray-600 text-sm">שפת אם</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-3xl text-gray-900">🇬🇧</span>
                    <div>
                      <p className="text-gray-900 font-semibold">English</p>
                      <p className="text-gray-600 text-sm">Fluent - Advanced</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Additional Strengths */}
          <section className="mb-20">
            <h2 className="text-4xl font-bold mb-12">
              <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                🎯 יתרונות נוספים
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: 'EdTech & Gamification', desc: 'ניסיון עמוק בפלטפורמות למידה ותכנון משחקים חינוכיים' },
                { title: 'Cognitive Science', desc: 'הבנה מעמיקה של קוגניטיביות ופסיכולוגיה אדם' },
                { title: 'Self-Learning', desc: 'כל המיומנויות שלי למדתי בעצמי דרך המחשב' },
                { title: 'Mentoring', desc: 'עזרה לסטודנטים למדעי המחשב בעיקרי הפיתוח' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="group relative"
                  style={{
                    animation: `slideInUp 0.6s ease-out ${idx * 0.1}s both`,
                  }}
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                  <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-all duration-300 shadow-lg">
                    <h3 className="text-lg font-bold text-amber-600 mb-2">{item.title}</h3>
                    <p className="text-gray-700 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Personal Touch Section */}
          <section className="mb-20">
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-rose-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
              <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl p-8 md:p-12 hover:border-gray-300 transition-all duration-300 shadow-lg">
                <h2 className="text-3xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                    פנייה אישית
                  </span>
                </h2>
                <div className="space-y-4 text-gray-800 leading-relaxed">
                  <p>
זו הפעם הראשונה מזה עשור שאני מכין קורות חיים 🙂
                  </p>
                  <p>
וזה משום שהפרויקט שלכם נשמע מעניין במיוחד ויש לי תשוקה רבה לתחום!
                  </p>
                  <p>
בין אם נתקדם לעבוד יחד או לא, אלו ההמלצות שלי: 
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Recommendations Section */}
          <section className="mb-20">
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
              <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl p-8 md:p-12 hover:border-gray-300 transition-all duration-300 shadow-lg">
                <h2 className="text-3xl font-bold mb-8">
                  <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                    💡 המלצות טכניות
                  </span>
                </h2>
                <div className="space-y-6">
                  {[
                    {
                      title: 'Front-End',
                      items: [
                        'מומחה ב-Expo / React Native - קוד אחיד ל-iOS, Android ו-Web',
                        
                        'מסגרת המאפשרת פיתוח קוד אחיד לשלושת הפלטפורמות המובילות - IOS | Android | Web',
                      ],
                    },
                    {
                      title: 'Back-End',
                      items: [
                        'מומחה ב-Rust, Golang, Python',
                        'ניסיון עמוק בסייבר, אבטחת מידע וניהול שרתים',
                      ],
                    },
                    {
                      title: 'Algorithms',
                      items: [
                        'Golang - אידיאלי לאלגוריתמים דורשי מהירות ויעילות',
                        'Python - עדיף ל-ML/Data Science',
                        'Rust - שלמות וביצועים קיצוניים',
                      ],
                    },
                    {
                      title: 'Game Development',
                      items: [
                        'מומחה Unity, Unreal, Godot',
                        'ניסיון בתלת מימד ו-Blender',
                      ],
                    },
                  ].map((section, idx) => (
                    <div key={idx}>
                      <h3 className="text-lg font-bold text-emerald-600 mb-3">{section.title}</h3>
                      <ul className="space-y-2">
                        {section.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-gray-700">
                            <span className="text-cyan-600 font-bold mt-0.5">▸</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          
          {/* Personal Touch Section */}
          <section className="mb-20">
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-rose-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
              <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl p-8 md:p-12 hover:border-gray-300 transition-all duration-300 shadow-lg">
                <h2 className="text-3xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                    ✨ קצת עלי
                  </span>
                </h2>
                <div className="space-y-4 text-gray-800 leading-relaxed">
                  <p>
                    גדלתי בתוך המסך מחשב 99% מהחיים ואין דבר שאני לא מסוגל ליישם או לספק בדיגיטל. היתרון שאני מביא לפרויקט הזה הוא היכולת שלי להיכנס לראש של משתמשים ובמיוחד כשמדובר בגיימינג, כראוי לילד שגדל בתוך המחשב, ולמד את כל מה שהוא יודע דרך המחשב, הכל התחיל בגיימינג.
                  </p>
                  <p>
                    דרך משחק אונליין אחד מיוחד, למדתי אנגלית, מתמטיקה, מכירות, משא ומתן, התמדה, ניהול הון, השקעות, ופיתוח תוכנה. אותו משחק היה הדחיפה הראשונה שלי ללמוד את יסודות המחשב.
                  </p>
                  <p>
                    לכן היכולת שלי לתרום לפרויקט היא הרבה מעבר לפיתוח עצמו, אלא גם בישום דרך ראיית העולם שקיבלתי. כל מה שאני יודע למדתי בעצמי דרך המחשב, והיום סטודנטים למדעי המחשב נעזרים בי כשיש צורך.
                  </p>
                  <p>
                    מעבר לכך אני מומחה בינה מלאכותית, פיתוח ארכיטקטורת תוכנה, ויצא לי המון פעמים לבצע אפיון עסקי אפיון מוצרים ואפיון טכנולוגי לעסקים.
                  </p>
                </div>
              </div>
            </div>
          </section>


          {/* Final CTA */}
          <section className="mb-20 text-center">
            <div className="group relative inline-block w-full">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000 animate-pulse" />
              <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl p-12 hover:border-gray-300 transition-all duration-300 shadow-lg">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">מוכנים לשיתוף פעולה?</h2>
                <p className="text-gray-700 mb-8">בואו לנו נבנה משהו מדהים ביחד</p>
                <div className="flex flex-wrap justify-center gap-4">
                  <a
                    href="mailto:sales.growth.digital@gmail.com"
                    className="px-8 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105"
                  >
                    צרו קשר
                  </a>
                  <a
                    href="tel:0515511581"
                    className="px-8 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-800 font-semibold transition-all duration-300"
                  >
                    התקשרו עכשיו
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            opacity: 0.1;
          }
          50% {
            opacity: 0.3;
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes synergySequence {
          0% {
            opacity: 0;
            filter: drop-shadow(0 0 0px rgba(6, 182, 212, 0));
          }
          8% {
            opacity: 1;
            filter: drop-shadow(0 0 0px rgba(6, 182, 212, 0));
          }
          45% {
            opacity: 1;
            filter: drop-shadow(0 0 20px rgba(6, 182, 212, 0.8));
          }
          70% {
            opacity: 1;
            filter: drop-shadow(0 0 20px rgba(6, 182, 212, 0.8));
          }
          78% {
            opacity: 0;
            filter: drop-shadow(0 0 0px rgba(6, 182, 212, 0));
          }
          100% {
            opacity: 0;
            filter: drop-shadow(0 0 0px rgba(6, 182, 212, 0));
          }
        }

        .synergy-item {
          animation: synergySequence 10s infinite;
        }

        .synergy-item:nth-child(1) {
          animation-delay: 0s;
        }

        .synergy-item:nth-child(2) {
          animation-delay: 0.6s;
        }

        .synergy-item:nth-child(3) {
          animation-delay: 1.2s;
        }

        .synergy-item:nth-child(4) {
          animation-delay: 1.8s;
        }

        .synergy-item:nth-child(5) {
          animation-delay: 2.4s;
        }

        .synergy-item:last-child {
          animation-delay: 3s;
        }
      `}</style>
    </div>
  );
}
