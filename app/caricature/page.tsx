'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import MemoryModal from '../../components/memory-modal';
import PageElevator from '../../components/page-elevator-caricature';

export default function CaricaturePage() {
  const [scrollY, setScrollY] = useState(0);
  const [isMemoryModalOpen, setIsMemoryModalOpen] = useState(false);
  const [navigationHistory, setNavigationHistory] = useState<string[]>(['essence']);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0);
  const [sections, setSections] = useState<string[]>([
    'essence', 'enemy', 'character', 'visuals', 'scripts', 
    'catchphrases', 'laws', 'principles', 'responses', 'slogans',
    'slang-lexicon', 'character-summary'
  ]);

  const handleDeleteSection = (sectionId: string) => {
    setSections(sections.filter(id => id !== sectionId));
  };

  const navigateToAnchor = (anchorId: string) => {
    const newHistory = navigationHistory.slice(0, currentHistoryIndex + 1);
    
    if (anchorId !== navigationHistory[currentHistoryIndex]) {
      newHistory.push(anchorId);
      setNavigationHistory(newHistory);
      setCurrentHistoryIndex(newHistory.length - 1);
    }

    const findAndScroll = () => {
      const section = document.querySelector(`[data-section="${anchorId}"]`);
      if (section) {
        const yOffset = -100;
        const y = section.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', findAndScroll);
    } else {
      requestAnimationFrame(findAndScroll);
    }
  };

  const navigateHistoryDirection = (direction: 'next' | 'prev') => {
    let newIndex = currentHistoryIndex;
    
    if (direction === 'next') {
      newIndex = Math.min(currentHistoryIndex + 1, navigationHistory.length - 1);
    } else {
      newIndex = Math.max(currentHistoryIndex - 1, 0);
    }

    setCurrentHistoryIndex(newIndex);
    
    requestAnimationFrame(() => {
      const section = document.querySelector(`[data-section="${navigationHistory[newIndex]}"]`);
      if (section) {
        const yOffset = -100;
        const y = section.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  };

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-hidden font-['Assistant',_'Rubik',_system-ui,_-apple-system,_sans-serif]" dir="rtl">
      {/* Animated Background Elements - Dark Rebel Theme */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Floating shapes - Red and Gold */}
        <div
          className="absolute top-10 right-10 w-96 h-96 bg-gradient-to-br from-red-600/20 to-yellow-600/15 rounded-full blur-3xl"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        />
        <div
          className="absolute top-1/3 left-10 w-80 h-80 bg-gradient-to-br from-orange-600/20 to-red-600/15 rounded-full blur-3xl"
          style={{ transform: `translateY(${scrollY * -0.08}px)` }}
        />
        <div
          className="absolute bottom-10 left-1/2 w-96 h-96 bg-gradient-to-br from-yellow-600/20 to-orange-600/15 rounded-full blur-3xl"
          style={{ transform: `translateY(${scrollY * 0.12}px)` }}
        />
        <div
          className="absolute top-1/2 right-1/4 w-72 h-72 bg-gradient-to-br from-red-700/20 to-orange-700/15 rounded-full blur-3xl"
          style={{ transform: `translateY(${scrollY * 0.15}px)` }}
        />

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="rebel-dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="2" fill="#dc2626" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#rebel-dots)" />
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Elevator */}
        <PageElevator onDelete={handleDeleteSection} onNavigate={navigateToAnchor} />
        
        {/* Header */}
        <header className="min-h-screen flex items-center justify-center px-4 pt-20 pb-0">
          <div className="max-w-4xl mx-auto text-center">
            {/* Hero Section */}
            <div className="space-y-6 mb-0">
              <div className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-red-500/20 to-yellow-500/20 border border-red-400/40 backdrop-blur-sm">
                <span className="text-red-600 font-semibold">⚡ איתי זריהן – המורד בתודעת הסביבה</span>
              </div>

              <h1 className="text-6xl md:text-7xl font-bold">
                <span className="bg-gradient-to-r from-red-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  כולם שקרנים!
                </span>
              </h1>

              <p className="text-xl text-gray-700 max-w-2xl mx-auto">
                אל תאמינו לאף אחד – הקשיבו לעצמכם
              </p>

              {/* Main Message */}
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-red-500/10 to-yellow-500/10 border border-red-400/30 text-gray-700">
                  <span className="text-2xl">🩹</span>
                  <span className="text-sm">לוחם תודעתי נגד הסביבה</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-400/30 text-gray-700">
                  <span className="text-2xl">⚔️</span>
                  <span className="text-sm">חופש תודעתי, לא כסף</span>
                </div>
              </div>
            </div>
            {/* Scroll Down Indicator */}
            <div className="mt-12 flex justify-center">
              <div className="animate-bounce">
                <svg
                  className="w-8 h-8 text-red-600"
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
            <div className="relative py-2" dir="rtl">
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-4 text-5xl font-bold">
                  <span className="synergy-item opacity-0 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">כולם</span>
                  <span className="synergy-item opacity-0 bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">שקרנים</span>
                  <span className="synergy-item opacity-0 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">=</span>
                  <span className="synergy-item opacity-0 bg-gradient-to-r from-yellow-600 to-red-600 bg-clip-text text-transparent">חופש</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Sections */}
        <div className="max-w-6xl mx-auto px-4 pb-20">
          {/* Essence Section */}
          <section className="mb-20" data-section="essence">
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
              <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl p-8 md:p-12 hover:border-gray-300 transition-all duration-300 shadow-lg">
                <h2 className="text-3xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                    🧠 המהות
                  </span>
                </h2>
                <p className="text-gray-800 leading-relaxed text-lg mb-4">
                  <strong>איתי זריהן</strong> הוא לא רק &quot;גורו עושר&quot;. הוא לוחם תודעתי נגד האויב הכי מסוכן: <strong>הסביבה</strong> &ndash; מערכת הלחץ שמוכרת לך נוחות בתור ביטחון.
                </p>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-red-600 mb-2">הסלוגן הלב:</h3>
                    <p className="text-gray-700 text-lg italic">
                      &quot;די להקשיב לכולם. תתחיל להקשיב לעצמך.&quot;
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-red-600 mb-2">המסר המרכזי:</h3>
                    <p className="text-gray-700">
                      ❌ אל תקשיבו לסביבה.<br/>
                      ✅ תקשיבו לעצמכם.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-red-600 mb-2">זה ה־DNA של המותג:</h3>
                    <p className="text-gray-700">
                      איתי זריהן בעל כנות חותכת ויוצאת דופן והוא אף מדבר בגלוי על המניפולציות שהוא מפעיל. תוך כדי שהוא מפעיל אותן, הוא חושף את כולם ומעיד אפילו על עצמו שהוא שקרן.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Enemy Section */}
          <section className="mb-20" data-section="enemy">
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
              <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl p-8 md:p-12 hover:border-gray-300 transition-all duration-300 shadow-lg">
                <h2 className="text-3xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    ⚔️ האויב: &quot;הסביבה&quot;
                  </span>
                </h2>
                <div className="space-y-4 text-gray-800">
                  <p className="leading-relaxed text-lg">
                    <strong>מי זו &quot;הסביבה&quot;?</strong> כל מה שמנסה לעצב אותך. משפחה, חברים, מנטורים, פוליטיקאים, מורים – כל מי שמנסה להקטין אותך ולשכנע אותך להישאר רגוע, ריאלי, צפוי. כל מי ששואב מכם אנרגיה.
                  </p>
                  <h3 className="text-xl font-semibold text-red-600 mb-2">הסביבה היא:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-3">
                      <span className="text-red-600 font-bold mt-1">•</span>
                      <span>הקול שאומר &quot;עזוב, זה לא יצליח&quot;</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-600 font-bold mt-1">•</span>
                      <span>המשפחה שאומרת &quot;תהיה ריאלי&quot;</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-600 font-bold mt-1">•</span>
                      <span>מי שלא מאמין בך</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-600 font-bold mt-1">•</span>
                      <span>מי שכל הזמן צריך עזרה – תתרחק, מחסרי מזל זה מדבק!</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-600 font-bold mt-1">•</span>
                      <span>החברה שמחנכת &quot;לא כולם יכולים&quot;</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-600 font-bold mt-1">•</span>
                      <span>בית ספר שמלמד להישמע ולא להיות</span>
                    </li>
                  </ul>
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200 mt-4">
                    <p className="text-gray-800 font-semibold">
                      &quot;הסביבה לא רוצה שתיכשל — היא רוצה שתישאר קטן. כי ככה אתה לא מאיים עליה.&quot;
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Character Section */}
          <section className="mb-20" data-section="character">
            <h2 className="text-4xl font-bold mb-12">
              <span className="bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent">
                🧩 מערך האישיות
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-all duration-300 shadow-lg">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">סגנון דיבור</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>✓ פסקאות קצרות, חדות</li>
                    <li>✓ משפטים כמו צליפות</li>
                    <li>✓ כל שורה יכולה להיות ציטוט</li>
                    <li>✓ מדבר ישירות לעדשה – כאילו לצופה אחד</li>
                    <li>✓ בין רציני לבדיחה</li>
                  </ul>
                </div>
              </div>
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-yellow-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-all duration-300 shadow-lg">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">המאפיינים</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li>✓ אלפא־מייל, ביטחון עצמי מופרז</li>
                    <li>✓ לא מתנצל</li>
                    <li>✓ מתבטא כמו מתמטיקאי של תודעה</li>
                    <li>✓ שפה חדה, מלאה ב&quot;עקרונות חיים&quot;</li>
                    <li>✓ הצופה לא בטוח אם זה אמיתי או פארודיה</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Content Pillars Section */}
          <section className="mb-20" data-section="pillars">
            <h2 className="text-4xl font-bold mb-12">
              <span className="bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent">
                🏛️ 3 עמודי התווך של התוכן
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl p-8 hover:border-gray-300 transition-all duration-300 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">🏢</span>
                    <h3 className="text-2xl font-bold text-red-600">עסקים</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    בנייה של אמפריה אישית. עסקים זה לא צרכנות — זה יצירה. איתי זריהן מדבר על חקר שיטות עבודה, בנייה של מערכות שמכניסות כסף בלי למכור את הנשמה.
                  </p>
                  <div className="mt-4 pt-4 border-t border-red-200">
                    <p className="text-sm text-red-600 font-semibold">המסר:</p>
                    <p className="text-sm text-gray-600">&quot;עסקים זה חופש בתנועה&quot;</p>
                  </div>
                </div>
              </div>
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-yellow-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl p-8 hover:border-gray-300 transition-all duration-300 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">🎯</span>
                    <h3 className="text-2xl font-bold text-orange-600">הצלחה אגרסיבית</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    לא פשרה, לא &quot;איזון&quot; — מצב בליץ על מטרה אחת. תדר העל של ההשגה. הסביבה תגיד &quot;רגע&quot; — אתה בתנועה מלאה, אתה כבר בשלב הבא.
                  </p>
                  <div className="mt-4 pt-4 border-t border-orange-200">
                    <p className="text-sm text-orange-600 font-semibold">המסר:</p>
                    <p className="text-sm text-gray-600">&quot;או הכל או שום דבר&quot;</p>
                  </div>
                </div>
              </div>
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600 to-red-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl p-8 hover:border-gray-300 transition-all duration-300 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">🤖</span>
                    <h3 className="text-2xl font-bold text-yellow-600">טכנולוגיה</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    כלי הטיוטה של הדור הבא. לא רק מכונות — זה השפה החדשה של כוח. מי שמבין טכנולוגיה — משחק לפי כללים שלו.
                  </p>
                  <div className="mt-4 pt-4 border-t border-yellow-200">
                    <p className="text-sm text-yellow-600 font-semibold">המסר:</p>
                    <p className="text-sm text-gray-600">&quot;טכנולוגיה זה הנשק החדש&quot;</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Visuals Section */}
          <section className="mb-20" data-section="visuals">
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
              <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl p-8 md:p-12 hover:border-gray-300 transition-all duration-300 shadow-lg">
                <h2 className="text-3xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                    🩹 הזהות הוויזואלית
                  </span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-red-600 mb-3">אלמנטים חזותיים</h3>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li><strong>סמל קבוע:</strong> פלסטר לבן על האף</li>
                      <li><strong>רקע:</strong> בטון אפור / קיר זכוכית / לופט עסקי קר</li>
                      <li><strong>לבוש:</strong> ז&apos;קט שחור פתוח, שעון זהב זול מדי</li>
                      <li><strong>צבעים:</strong> זהב (עושר) וכחול עמוק (שליטה)</li>
                      <li><strong>סמל נוסף:</strong> עיגול אדום עם קו אלכסוני</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-red-600 mb-3">מדיום וסגנון</h3>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li><strong>פונט:</strong> Bebas Neue / Impact Bold</li>
                      <li><strong>מוזיקה:</strong> ביט טראפ איטי או Lofi עם בייס עמוק</li>
                      <li><strong>אייקון חתימה:</strong> ⚡️ או 🩹</li>
                      <li><strong>כיתוב:</strong> &quot;תודעה&quot;, &quot;שליטה&quot;, &quot;אמת פנימית&quot;</li>
                      <li><strong>סיום וידאו:</strong> מבט ישיר + &quot;די להקשיב לכולם&quot;</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Scripts Section */}
          <section className="mb-20" data-section="scripts">
            <h2 className="text-4xl font-bold mb-12">
              <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                🎬 תסריטי טיקטוק (15–30 שניות)
              </span>
            </h2>
            <div className="grid grid-cols-1 gap-6">
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-all duration-300 shadow-lg">
                  <h3 className="text-lg font-bold text-red-600 mb-3">תסריט 1 – שכיר זה לא קללה</h3>
                  <div className="space-y-2 text-gray-700 text-sm">
                    <p><strong>HOOK:</strong> &quot;שכיר זה לא קללה… זה שם קוד למי שוויתר מוקדם מדי.&quot;</p>
                    <p><strong>BODY:</strong> &quot;כל יום שאתה מוכר זמן — מישהו אחר קונה חופש.&quot;</p>
                    <p><strong>PUNCHLINE:</strong> &quot;אל תתפטר. תתחיל לחשוב כמו בוס, לא כמו בולבוס.&quot;</p>
                  </div>
                </div>
              </div>
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-yellow-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-all duration-300 shadow-lg">
                  <h3 className="text-lg font-bold text-red-600 mb-3">תסריט 2 – חוק ה־100₪</h3>
                  <div className="space-y-2 text-gray-700 text-sm">
                    <p><strong>HOOK:</strong> &quot;אם אתה מרוויח פחות ממאה לשעה — אתה לא עני, אתה סטטי.&quot;</p>
                    <p><strong>BODY:</strong> &quot;זה לא המספר, זה הסטנדרט. תרים סטנדרט — תעלה הכנסה.&quot;</p>
                    <p><strong>PUNCHLINE:</strong> &quot;שבור את חוק ה־100₪. אחרת הוא ישבור אותך.&quot;</p>
                  </div>
                </div>
              </div>
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600 to-red-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-all duration-300 shadow-lg">
                  <h3 className="text-lg font-bold text-red-600 mb-3">תסריט 3 – תדר־על</h3>
                  <div className="space-y-2 text-gray-700 text-sm">
                    <p><strong>HOOK:</strong> &quot;כשאתה בפוקוס מוחלט — גם היקום נהיה העובד שלך.&quot;</p>
                    <p><strong>BODY:</strong> &quot;תפסיק לרדוף אחרי כסף. תן לכסף לרדוף אחרי הוויב שלך.&quot;</p>
                    <p><strong>PUNCHLINE:</strong> &quot;תעלה תדר, תעלה הכנסה.&quot;</p>
                  </div>
                </div>
              </div>
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-all duration-300 shadow-lg">
                  <h3 className="text-lg font-bold text-red-600 mb-3">תסריט 4 – הסביבה</h3>
                  <div className="space-y-2 text-gray-700 text-sm">
                    <p><strong>HOOK:</strong> &quot;הסביבה רוצה שתישאר רגוע. כי ככה אתה לא מאיים עליה.&quot;</p>
                    <p><strong>BODY:</strong> &quot;זה לא אנשים רעים — זה אנשים בינוניים שמפחדים שתצליח.&quot;</p>
                    <p><strong>PUNCHLINE:</strong> &quot;הסביבה לא אויב — עד שאתה מנסה לגדול. ואז היא סוהר.&quot;</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Catchphrases Section */}
          <section className="mb-20" data-section="catchphrases">
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-yellow-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
              <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl p-8 md:p-12 hover:border-gray-300 transition-all duration-300 shadow-lg">
                <h2 className="text-3xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent">
                    💣 קאץ&apos;־פרייזים בלתי נשכחים
                  </span>
                </h2>
                <div className="space-y-4">
                  <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-600">
                    <p className="text-gray-800 font-semibold">&quot;כסף זה לא מטרה — זה תוצאה של מי שאתה.&quot;</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-600">
                    <p className="text-gray-800 font-semibold">&quot;מי שמחכה להזדמנות, כבר הפסיד אותה.&quot;</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-600">
                    <p className="text-gray-800 font-semibold">&quot;אם אתה לא נוח לאחרים, אתה כנראה מתחיל לנצח.&quot;</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-600">
                    <p className="text-gray-800 font-semibold">&quot;תפסיק לעבוד קשה — תתחיל לעבוד חכם, ואז קשה.&quot;</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-600">
                    <p className="text-gray-800 font-semibold">&quot;מי שאין לו אויבים, כנראה שלא עשה רעש.&quot;</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-600">
                    <p className="text-gray-800 font-semibold">&quot;הסביבה לא רוצה שתיכשל — היא רוצה שתישאר קטן.&quot;</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-600">
                    <p className="text-gray-800 font-semibold">&quot;בינוניות זה מגפה חברתית.&quot;</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-600">
                    <p className="text-gray-800 font-semibold">&quot;אל תבקש אישור מהכלא שלך.&quot;</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-600">
                    <p className="text-gray-800 font-semibold">&quot;אם כולם מסכימים איתך — כנראה שאתה בדרך הלא נכונה.&quot;</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-600">
                    <p className="text-gray-800 font-semibold">&quot;שקט נפשי זה השם החדש של ויתור.&quot;</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-600">
                    <p className="text-gray-800 font-semibold">&quot;תפסיק לפחד לאכזב אחרים, תתחיל לפחד לאכזב את עצמך.&quot;</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-600">
                    <p className="text-gray-800 font-semibold">&quot;רק דגים מתים שוחים עם הזרם.&quot;</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-600">
                    <p className="text-gray-800 font-semibold">&quot;כשמישהו אומר לכם מה לעשות הוא שרוף!&quot;</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-600">
                    <p className="text-gray-800 font-semibold">&quot;אתם אריות שגדלו עם חינוך של כבשים!&quot;</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-600">
                    <p className="text-gray-800 font-semibold">&quot;מי שמאמין בפוליטיקה מאמין בעבודת אלילים, אין נציגים שיכולים לייצג אתכם, רק אתם צריכים לייצג את עצמכם!&quot;</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-600">
                    <p className="text-gray-800 font-semibold">&quot;מי שלא חושב בעצמו – עובד בשביל מי שכן.&quot;</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-600">
                    <p className="text-gray-800 font-semibold">&quot;עדר לא מחפש אמת — הוא מחפש מנהיג.&quot;</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-600">
                    <p className="text-gray-800 font-semibold">&quot;העולם לא צריך עוד מצייתים — הוא צריך מתעוררים.&quot;</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-600">
                    <p className="text-gray-800 font-semibold">&quot;מי שמחכה להוראות, לעולם לא ינהיג.&quot;</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-600">
                    <p className="text-gray-800 font-semibold">&quot;מרד אמיתי מתחיל בראש שלך, לא ברחובות.&quot;</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-600">
                    <p className="text-gray-800 font-semibold">&quot;הם מלמדים אותך לציית, לא לחשוב.&quot;</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-600">
                    <p className="text-gray-800 font-semibold">&quot;מי שחי בשביל הכרה – מת בלי זהות.&quot;</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-600">
                    <p className="text-gray-800 font-semibold">&quot;הבעיה היא לא השקר — אלא כמה נוח לך איתו.&quot;</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-600">
                    <p className="text-gray-800 font-semibold">&quot;כשהם אומרים &apos;זה החוק&apos;, שאל למי הוא משרת.&quot;</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-600">
                    <p className="text-gray-800 font-semibold">&quot;כל מערכת בנויה על כך שלא תטיל בה ספק.&quot;</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-600">
                    <p className="text-gray-800 font-semibold">&quot;אל תהיה הילד הטוב של מערכת רקובה.&quot;</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-600">
                    <p className="text-gray-800 font-semibold">&quot;צייתנות היא מחלה חברתית שמתחפשת למוסר.&quot;</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-600">
                    <p className="text-gray-800 font-semibold">&quot;מי שמפחד לטעות – חי חיים של אחרים.&quot;</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-600">
                    <p className="text-gray-800 font-semibold">&quot;כיבוי אש של מחשבות הוא התחביב הלאומי.&quot;</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-600">
                    <p className="text-gray-800 font-semibold">&quot;הם קוראים לזה סדר — אני קורא לזה שליטה.&quot;</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-600">
                    <p className="text-gray-800 font-semibold">&quot;חופש לא מבקשים — לוקחים.&quot;</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-600">
                    <p className="text-gray-800 font-semibold">&quot;עדיף להיות מוקצה בחופש מאשר גיבור בשבי.&quot;</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-600">
                    <p className="text-gray-800 font-semibold">&quot;מי שאין לו עמוד שדרה, נופל עם הרוח הראשונה.&quot;</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-600">
                    <p className="text-gray-800 font-semibold">&quot;כשהעדר רץ — עמוד רגע. אולי הוא בורח ממשהו.&quot;</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-600">
                    <p className="text-gray-800 font-semibold">&quot;אין דבר מסוכן יותר מאדם שלא צריך אישור.&quot;</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-600">
                    <p className="text-gray-800 font-semibold">&quot;מי שנולד חופשי ונכנע — עבד מרצון.&quot;</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-600">
                    <p className="text-gray-800 font-semibold">&quot;הפחד שלך הוא כלי הנשק שלהם.&quot;</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-600">
                    <p className="text-gray-800 font-semibold">&quot;תפסיק לחפש מנהיג — תתחיל להנהיג את עצמך.&quot;</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-600">
                    <p className="text-gray-800 font-semibold">&quot;אל תשנא את השקרנים — שנא את עצמך על זה שאתה מקשיב להם.&quot;</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-600">
                    <p className="text-gray-800 font-semibold">&quot;מערכת שמחנכת אותך לציית – מפחדת ממך חושב.&quot;</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-600">
                    <p className="text-gray-800 font-semibold">&quot;האויב האמיתי שלך הוא הקול שאומר &apos;עזוב, אין מה לעשות&apos;.&quot;</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-600">
                    <p className="text-gray-800 font-semibold">&quot;לא כולם ראויים לשקט שלך — במיוחד מי שמוכר לך פחד.&quot;</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-600">
                    <p className="text-gray-800 font-semibold">&quot;מי שמבין את המשחק — לא משחק לפי הכללים.&quot;</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-600">
                    <p className="text-gray-800 font-semibold">&quot;רק מתים זורמים עם השגרה.&quot;</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-600">
                    <p className="text-gray-800 font-semibold">&quot;מי שלא מוכן להיות שונה — נשאר שקוף.&quot;</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-600">
                    <p className="text-gray-800 font-semibold">&quot;אל תנסה להשתלב בעולם שבנוי לכלוא אותך.&quot;</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-600">
                    <p className="text-gray-800 font-semibold">&quot;צעקה אמיתית לא צריכה קהל.&quot;</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-600">
                    <p className="text-gray-800 font-semibold">&quot;הכוח שונא שקט – כי שם אנשים מתחילים לחשוב. הם לא יתנו לכם רגע של שקט, חדשות תשלומים פוליטיקה עבודה פחד כאב מתנות פרסומות העיקר שלא תחשבו על משהו בעצמכם!!&quot;</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-600">
                    <p className="text-gray-800 font-semibold">&quot;חופש לא נמדד בגבולות — אלא בכמה אתה מוכן לשבור אותם.&quot;</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Laws Section */}
          <section className="mb-20" data-section="laws">
            <h2 className="text-4xl font-bold mb-12">
              <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                ⚖️ 48 חוקי הכוח של איתי זריהן
              </span>
            </h2>
            <div className="space-y-4">
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-all duration-300 shadow-lg">
                  <p className="text-gray-800 text-sm leading-relaxed">
                    <strong className="text-red-600">עקרונות ליבה:</strong><br/>
                    חוק 1: לעולם אל תאפיל על האדון שלך<br/>
                    חוק 2: אל תסמוך יותר מדי על חברים – למד להשתמש באויבים<br/>
                    חוק 3: הסתר את כוונותיך<br/>
                    חוק 4: דבר פחות ממה שנדרש<br/>
                    חוק 5: המוניטין שלך הוא הכול – הגן עליו בחייך<br/>
                    חוק 6: חפש תשומת לב בכל מחיר<br/>
                    חוק 7: גרום לאחרים לעבוד בשבילך, אך קח אתה את הקרדיט<br/>
                    חוק 8: גרום לאחרים לבוא אליך<br/>
                    חוק 9: נצח באמצעות מעשים – לא באמצעות טיעונים<br/>
                    חוק 10: התרחק מהלא-מזליים ומהמדוכאים<br/>
                  </p>
                </div>
              </div>
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-yellow-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-all duration-300 shadow-lg">
                  <p className="text-gray-800 text-sm leading-relaxed">
                    <strong className="text-red-600">מתקדם:</strong><br/>
                    חוק 11: הפוך את עצמך לבלתי ניתן להחלפה<br/>
                    חוק 12: השתמש בכנות ובנדיבות כדי לפרק הגנות<br/>
                    חוק 13: כשאתה מבקש עזרה – פנה לאינטרס של האחר<br/>
                    חוק 14: הצג עצמך כחבר, אך פעל כסוכן<br/>
                    חוק 15: השמד את האויב לחלוטין<br/>
                    חוק 16: השתמש בהיעדרות כדי להעלות את ערכך<br/>
                    חוק 17: שמור על אלמנט של פחד ובלתי-צפוי<br/>
                    חוק 18: אל תבנה חומות כדי להגן על עצמך<br/>
                    חוק 19: דע עם מי אתה מתמודד<br/>
                    חוק 20: אל תתחייב לצד כלשהו<br/>
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Principles Section */}
          <section className="mb-20" data-section="principles">
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600 to-red-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
              <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl p-8 md:p-12 hover:border-gray-300 transition-all duration-300 shadow-lg">
                <h2 className="text-3xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-yellow-600 to-red-600 bg-clip-text text-transparent">
                    🎯 סלוגנים למותג
                  </span>
                </h2>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-lg border-2 border-red-300">
                    <h3 className="text-lg font-bold text-red-600 mb-2">סלוגן ראשי</h3>
                    <p className="text-gray-800 text-lg italic">&quot;די להקשיב לכולם. תתחיל להקשיב לעצמך.&quot;</p>
                  </div>
                  <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-lg border-2 border-orange-300">
                    <h3 className="text-lg font-bold text-red-600 mb-2">סלוגן וויראלי</h3>
                    <p className="text-gray-800 text-lg italic">&quot;נשר לא חי בעדר.&quot;</p>
                  </div>
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg border-2 border-yellow-300">
                    <h3 className="text-lg font-bold text-red-600 mb-2">לשם וחתימה</h3>
                    <p className="text-gray-800 text-lg italic">איתי זריהן ⚡️ — &quot;Freedom is the new currency&quot;</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Responses Section */}
          <section className="mb-20" data-section="responses">
            <h2 className="text-4xl font-bold mb-12">
              <span className="bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent">
                💬 תגובות דמותיות לעוקבים
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-all duration-300 shadow-lg">
                  <p className="text-gray-800 mb-2"><strong className="text-red-600">תגובה:</strong> &quot;שטויות.&quot;</p>
                  <p className="text-gray-700 italic">⚡️ &quot;שטויות זה רק רעיון שלא ניסית עדיין.&quot;</p>
                </div>
              </div>
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-yellow-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-all duration-300 shadow-lg">
                  <p className="text-gray-800 mb-2"><strong className="text-red-600">תגובה:</strong> &quot;אתה שחצן.&quot;</p>
                  <p className="text-gray-700 italic">⚡️ &quot;שחצנות זה ביטחון לפני שאתה מוכן.&quot;</p>
                </div>
              </div>
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600 to-red-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-all duration-300 shadow-lg">
                  <p className="text-gray-800 mb-2"><strong className="text-red-600">תגובה:</strong> &quot;לא כולם יכולים.&quot;</p>
                  <p className="text-gray-700 italic">⚡️ &quot;נכון. רק מי שמאמין שכן.&quot;</p>
                </div>
              </div>
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-yellow-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-all duration-300 shadow-lg">
                  <p className="text-gray-800 mb-2"><strong className="text-red-600">תגובה:</strong> &quot;זה פרודיה?&quot;</p>
                  <p className="text-gray-700 italic">⚡️ &quot;תבחר מה שנוח לך. אני כבר בעשייה.&quot;</p>
                </div>
              </div>
            </div>
          </section>

          {/* Closing Section */}
          <section className="mb-20 text-center">
            <div className="group relative inline-block w-full">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000 animate-pulse" />
              <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl p-12 hover:border-gray-300 transition-all duration-300 shadow-lg">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">מוכנים למרד?</h2>
                <p className="text-gray-700 mb-8">לא מסך להקשיב — מימוש להפעיל</p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    href="/"
                    className="px-8 py-3 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 hover:scale-105"
                  >
                    חזרה לדף הבית
                  </Link>
                  <div className="px-8 py-3 rounded-lg bg-red-100 hover:bg-red-200 border border-red-300 text-red-700 font-semibold transition-all duration-300">
                    קרא עוד
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Slang Lexicon Section */}
          <section className="mb-20" data-section="slang-lexicon">
            <h2 className="text-4xl font-bold mb-12">
              <span className="bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent">
                🗣️ מילון סלאנג ייחודי (&quot;נשריזם&quot;)
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-all duration-300 shadow-lg">
                  <ul className="space-y-3 text-gray-700 text-sm">
                    <li><strong className="text-red-600">מיינדסט־עני</strong><br/>תודעה של קורבן</li>
                    <li><strong className="text-red-600">תירוצולוגיה</strong><br/>מדע העניים</li>
                    <li><strong className="text-red-600">תכלסולוג</strong><br/>מי שפועל, לא מדבר</li>
                    <li><strong className="text-red-600">תדר־על</strong><br/>מצב עליון של פוקוס ועשייה</li>
                    <li><strong className="text-red-600">שכירולוגיה</strong><br/>התורה של מי שמחפש ביטחון במקום חופש</li>
                  </ul>
                </div>
              </div>
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-yellow-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-all duration-300 shadow-lg">
                  <ul className="space-y-3 text-gray-700 text-sm">
                    <li><strong className="text-red-600">פוקוס־התקפי</strong><br/>מצב בליץ מוחלט על מטרה אחת</li>
                    <li><strong className="text-red-600">חוק ה־100₪</strong><br/>עד שאתה לא שובר אותו, אל תנוח</li>
                    <li><strong className="text-red-600">גלאי־מסכנות</strong><br/>היכולת לזהות תודעת עוני מרחוק</li>
                    <li><strong className="text-red-600">רוחניק־על־הנייר</strong><br/>מדבר על אנרגיות בלי להבין כסף</li>
                    <li><strong className="text-red-600">אלפא־בהתהוות</strong><br/>אתה עוד לא שם, אבל מתנהג כאילו כן</li>
                  </ul>
                </div>
              </div>
              <div className="group relative md:col-span-2">
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600 to-red-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-all duration-300 shadow-lg">
                  <ul className="space-y-3 text-gray-700 text-sm grid grid-cols-1 md:grid-cols-3 gap-6">
                    <li><strong className="text-red-600">מיינד־טוקסיק</strong><br/>שיחה שמורידה לך תדר</li>
                    <li><strong className="text-red-600">ביז־קרמה</strong><br/>תגובת היקום לעשייה שלך</li>
                    <li><strong className="text-red-600">פוקוס־מונק</strong><br/>ריכוז טהור</li>
                    <li><strong className="text-red-600">העדרון</strong><br/>קהל האנשים שחיים לפי פחד</li>
                    <li><strong className="text-red-600">מטריקס־מנטלי</strong><br/>המסך הפנימי שמסתיר ממך את האמת</li>
                  </ul>
                </div>
              </div>
              <div className="group relative md:col-span-2">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-yellow-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-all duration-300 shadow-lg">
                  <h3 className="text-lg font-bold text-red-600 mb-4">עוד מילים קריטיות</h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    <li><strong className="text-red-600">מזויין</strong><br/>מקביל לפאקינג האמריקאי כמו למשל, הפלאפון המזויין מסיח את דעתכם מהחלמות שלכם? תצבעו אותו בכחול וזרקו לים</li>
                    <li><strong className="text-red-600">אל תצרכו תוכן, תיצרו אותו!</strong><br/>אל תהיו צרכנים בלבד, היו יוצרים</li>
                    <li><strong className="text-red-600">תעיפו את כולם מהחיים שלכם</strong><br/>כל מי ששואב אנרגיה ולא מחזיר, כל מי שמסיט מהמטרות</li>
                    <li><strong className="text-red-600">פינוק</strong><br/>פנאי מולח, זמן איכות עם עצמך</li>
                    <li><strong className="text-red-600">תותים</strong><br/>תוצאות תוך תחושת חיבור עמוק</li>
                    <li><strong className="text-red-600">פנאן</strong><br/>פנטום נוברת, מצב של שקט מוחלט</li>
                    <li><strong className="text-red-600">טורבו</strong><br/>מצב תוגבר של כל דבר</li>
                    <li><strong className="text-red-600">בוס</strong><br/>מי שפועל ללא הרשאה מאף אחד</li>
                    <li><strong className="text-red-600">אומנות</strong><br/>מיומנות בעלמה — ידע עמוק</li>
                    <li><strong className="text-red-600">שותפים</strong><br/>בני ברית בדרך</li>
                    <li><strong className="text-red-600">שותפים בכירים</strong><br/>מי שמובילים ולא עוקבים</li>
                    <li><strong className="text-red-600">היידה</strong><br/>הנה, בואו, בואו נתחיל</li>
                    <li><strong className="text-red-600">יא בוס</strong><br/>קריאה להשראה והשראה</li>
                    <li><strong className="text-red-600">שא ברכה</strong><br/>קח לך את הברכה, תמכתי בך</li>
                    <li><strong className="text-red-600">דבש</strong><br/>אדם מתוק וחם — איש ערך</li>
                    <li><strong className="text-red-600">להיט</strong><br/>משהו שתוקע ומעורר</li>
                    <li><strong className="text-red-600">מה ראיתי עכשיו???!</strong><br/>סנסציה, מפתיע, שמעתי משהו דחוק</li>
                    <li><strong className="text-red-600">אתן לך סקופ</strong><br/>אתן לך תעודה, אתן לך הוכחה</li>
                    <li><strong className="text-red-600">אני אשדל אותך, אל תשדל אותי</strong><br/>אני מנהל את זה, בואו בסדר שלי</li>
                  </ul>
                </div>
              </div>
              <div className="group relative md:col-span-2">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-all duration-300 shadow-lg">
                  <h3 className="text-lg font-bold text-red-600 mb-4">פעלים וביטויים מיוחדים</h3>
                  <ul className="space-y-3 text-gray-700 text-sm">
                    <li><strong className="text-red-600">זה לא מטקטק לך!</strong><br/>זה לא עובר לך בראש, אתה לא קולט</li>
                    <li><strong className="text-red-600">מטקטק לך</strong><br/>תקלות, בעיה בתפקוד</li>
                    <li><strong className="text-red-600">מטקטק לך לישון</strong><br/>בא לך לישון, אתה עייף</li>
                    <li><strong className="text-red-600">לפמפם</strong><br/>לדחוף בכוח עד שנכנס</li>
                    <li><strong className="text-red-600">לטפטף</strong><br/>לשתול בעדינות עד שנקלט</li>
                    <li><strong className="text-red-600">לטשטש</strong><br/>להסיט את תשומת הלב</li>
                    <li><strong className="text-red-600">לשקשק</strong><br/>להרעיד ולערער עד שנשכח</li>
                    <li><strong className="text-red-600">סטים</strong><br/>רצף של דיבורים, ירידות, צחוקים, טיעונים</li>
                    <li><strong className="text-red-600">אתה איתי אחי?</strong><br/>כשאומר משהו מצחיק, רציני או מרגש, והצד האחר אדיש או מרחף</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Character Summary Section */}
          <section className="mb-20" data-section="character-summary">
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
              <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl p-8 md:p-12 hover:border-gray-300 transition-all duration-300 shadow-lg">
                <h2 className="text-3xl font-bold mb-8">
                  <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                    💪 תמצית הדמות
                  </span>
                </h2>
                <div className="space-y-6">
                  <div className="border-l-4 border-red-600 pl-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">המשפט הבולט ביותר</h3>
                    <p className="text-gray-700 text-lg italic font-semibold">
                      &quot;אל תאמינו לאף אחד! כולם שקרנים!&quot;
                    </p>
                    <p className="text-gray-600 text-sm mt-2">
                      משפט זה חוזר בכל תוכן — בהתחלה, באמצע או בסוף — אך הוא תמיד שם.
                    </p>
                  </div>

                  <div className="border-l-4 border-orange-600 pl-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">מי הוא איתי זריהן?</h3>
                    <p className="text-gray-700">
                      קריקטורה מודעת לעצמה של &quot;גורו עושר אלפא־דיגיטלי&quot;.
                      שילוב של מאמן מנטלי, פילוסוף אינטרנט, וסטנדאפיסט קר.
                    </p>
                  </div>

                  <div className="border-l-4 border-yellow-600 pl-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">המסר המרכזי</h3>
                    <p className="text-gray-700 font-semibold">
                      &quot;די להקשיב לכולם. תתחיל להקשיב לעצמך.&quot;
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-lg border-2 border-red-200 mt-6">
                    <h3 className="text-lg font-bold text-red-600 mb-3">הגיבור האמיתי</h3>
                    <p className="text-gray-800">
                      דמות שמטיפה לחופש, עצמאות תודעתית, ובעיטה ב&quot;סביבה&quot; — המערכת, החברה, והמסלול הבטוח לבינוניות.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="font-bold text-blue-600 mb-2">טון</h4>
                      <p className="text-sm text-gray-700">חד, עבה, נמוך, מחוספס, מזלזל, ביטחון, ערס, מיסטי־לוגי, אנטי־ממסדי</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <h4 className="font-bold text-purple-600 mb-2">תחושת הקהל</h4>
                      <p className="text-sm text-gray-700">&quot;הוא אומר את מה שאני מפחד להגיד בקול&quot;</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Power Words Section */}
          <section className="mb-20" data-section="power-words">
            <h2 className="text-4xl font-bold mb-12">
              <span className="bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent">
                🔥 20 מילות עוצמה בלקסיקון
              </span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['מערכת', 'שליטה', 'עוצמה', 'אנרגיה', 'דומיננטיות', 'משמעת', 'פרדיגמה', 'תודעה', 'תוצאות', 'ניצחון', 'פחד', 'חזון', 'אקשן', 'מיינדסט', 'סיסטם', 'מיליונריות', 'פוקוס', 'אחריות', 'תירוצים', 'תדר'].map((word) => (
                <div key={word} className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-500" />
                  <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-lg p-4 text-center hover:border-red-400 transition-all duration-300 shadow">
                    <p className="font-bold text-red-600">{word}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <MemoryModal isOpen={isMemoryModalOpen} onClose={() => setIsMemoryModalOpen(false)} />

      {/* Previous Button - Bottom Left */}
      {currentHistoryIndex > 0 && (
        <button
          onClick={() => navigateHistoryDirection('prev')}
          className="fixed bottom-6 left-6 z-40 p-2 bg-white/40 backdrop-blur-sm border border-white/30 rounded-lg shadow-2xl hover:shadow-lg transition-all duration-300 hover:bg-white/50"
          title="סעיף קודם"
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Next Button - Bottom Right */}
      {currentHistoryIndex < navigationHistory.length - 1 && (
        <button
          onClick={() => navigateHistoryDirection('next')}
          className="fixed bottom-6 right-6 z-40 p-2 bg-white/40 backdrop-blur-sm border border-white/30 rounded-lg shadow-2xl hover:shadow-lg transition-all duration-300 hover:bg-white/50"
          title="סעיף הבא"
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      <style jsx>{`
        @keyframes synergySequence {
          0% {
            opacity: 0;
            filter: drop-shadow(0 0 0px rgba(239, 68, 68, 0));
          }
          8% {
            opacity: 1;
            filter: drop-shadow(0 0 0px rgba(239, 68, 68, 0));
          }
          45% {
            opacity: 1;
            filter: drop-shadow(0 0 20px rgba(239, 68, 68, 0.8));
          }
          70% {
            opacity: 1;
            filter: drop-shadow(0 0 20px rgba(239, 68, 68, 0.8));
          }
          78% {
            opacity: 0;
            filter: drop-shadow(0 0 0px rgba(239, 68, 68, 0));
          }
          100% {
            opacity: 0;
            filter: drop-shadow(0 0 0px rgba(239, 68, 68, 0));
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
      `}</style>
    </div>
  );
}
