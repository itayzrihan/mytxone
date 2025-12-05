'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import MemoryModal from '../../components/memory-modal';
import StorytellingModal from '../../components/storytelling-modal';
import MBTIModal from '../../components/mbti-modal';
import ProfileModal from '../../components/profile-modal';
import InitialsModal from '../../components/initials-modal';
import AlphaBossModal from '../../components/alpha-boss-modal';
import EnergyTypesModal from '../../components/energy-types-modal';
import PrinciplesModal from '../../components/principles-modal';
import PageElevator from '../../components/page-elevator';

export default function ODHPage() {
  const [scrollY, setScrollY] = useState(0);
  const [isMemoryModalOpen, setIsMemoryModalOpen] = useState(false);
  const [isStorytellingModalOpen, setIsStorytellingModalOpen] = useState(false);
  const [isMBTIModalOpen, setIsMBTIModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isInitialsModalOpen, setIsInitialsModalOpen] = useState(false);
  const [isAlphaBossModalOpen, setIsAlphaBossModalOpen] = useState(false);
  const [isEnergyTypesModalOpen, setIsEnergyTypesModalOpen] = useState(false);
  const [isPrinciplesModalOpen, setIsPrinciplesModalOpen] = useState(false);
  const [principlesModalTab, setPrinciplesModalTab] = useState<'micro' | 'macro' | 'domino'>('micro');
  const [navigationHistory, setNavigationHistory] = useState<string[]>(['introduction']);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0);
  const [sections, setSections] = useState<string[]>([
    'introduction', 'principles', 'morning', 'body', 'mind', 'memory', 
    'practice', 'relations', 'evening', 'brain', 'reality'
  ]);

  const handleDeleteSection = (sectionId: string) => {
    setSections(sections.filter(id => id !== sectionId));
  };

  const navigateToAnchor = (anchorId: string) => {
    // Remove any history items after current index (when going to a new section)
    const newHistory = navigationHistory.slice(0, currentHistoryIndex + 1);
    
    // Add new anchor if it's different from the current one
    if (anchorId !== navigationHistory[currentHistoryIndex]) {
      newHistory.push(anchorId);
      setNavigationHistory(newHistory);
      setCurrentHistoryIndex(newHistory.length - 1);
    }

    // Always scroll to section (even if same section)
    // Try to find the section and scroll to it
    const findAndScroll = () => {
      const section = document.querySelector(`[data-section="${anchorId}"]`);
      if (section) {
        // Get the section's position and scroll to it
        const yOffset = -100; // offset for header
        const y = section.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    };

    // Use requestAnimationFrame to ensure DOM is ready
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
    
    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      const section = document.querySelector(`[data-section="${navigationHistory[newIndex]}"]`);
      if (section) {
        const yOffset = -100; // offset for header
        const y = section.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  };

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
        {/* Elevator */}
        <PageElevator onDelete={handleDeleteSection} onNavigate={navigateToAnchor} />
        {/* Header */}
        <header className="min-h-screen flex items-center justify-center px-4 pt-20 pb-0">
          <div className="max-w-4xl mx-auto text-center">
    

            {/* Hero Section */}
            <div className="space-y-6 mb-0">
              <div className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/40 backdrop-blur-sm">
                <span className="text-cyan-600 font-semibold">�️ One Day Handbook</span>
              </div>

              <h1 className="text-6xl md:text-7xl font-bold">
                <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  המדריך לחיות את היום
                </span>
              </h1>

              <p className="text-xl text-gray-700 max-w-2xl mx-auto">
                מסע של נוכחות, תנועה וחיבור עצמי – יום אחד בכל פעם
              </p>

              {/* Contact Info */}
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-400/30 text-gray-700">
                  <span className="text-2xl">📖</span>
                  <span className="text-sm">ספר זה אינו מדריך תיאורטי</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/30 text-gray-700">
                  <span className="text-2xl">🕊️</span>
                  <span className="text-sm">הזמנה למסע יומי של חיים שלמים</span>
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
            <div className="relative py-2" dir="rtl">
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-4 text-5xl font-bold">
                  <span className="synergy-item opacity-0 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">יום</span>
                  <span className="synergy-item opacity-0 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">אחד</span>
                  <span className="synergy-item opacity-0 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">=</span>
                  <span className="synergy-item opacity-0 bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">חיים</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Sections */}
        <div className="max-w-6xl mx-auto px-4 pb-20">
          {/* Introduction Section */}
          <section className="mb-20" data-section="introduction">
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
              <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl p-8 md:p-12 hover:border-gray-300 transition-all duration-300 shadow-lg">
                <h2 className="text-3xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                    הקדמה
                  </span>
                </h2>
                <p className="text-gray-800 leading-relaxed text-lg">
                  ספר זה אינו מדריך תיאורטי, אלא הזמנה למסע יומי של חיים שלמים – יום אחד בכל פעם. הוא נועד להזכיר שהאושר, הבריאות והבהירות אינם יעד עתידי, אלא פרקטיקה מתמדת שנבנית מהרגע הזה.
                </p>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-cyan-600 mb-2">למה &quot;יום אחד&quot;?</h3>
                    <p className="text-gray-700">כי כל החיים הם אוסף של &quot;ימים אחדים&quot;. וכשאנחנו חיים כל יום במלואו – בכוונה, נוכחות ואהבה – אנחנו בונים חיים שלמים בלי לרדוף אחריהם.</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-cyan-600 mb-2">עקרון ההתחלה מחדש</h3>
                    <p className="text-gray-700">כל בוקר הוא לידתו של עולם חדש. לא משנה מה קרה אתמול, היום הוא דף ריק, הזדמנות להתחיל מחדש.</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-cyan-600 mb-2">איך להשתמש בספר הזה</h3>
                    <p className="text-gray-700">זה לא ספר לקרוא — זה ספר לחיות. בחר פרק אחד בכל יום, או קרא לפי הסדר של היום: בוקר – תנועה – תודעה – יחסים – ערב.</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-cyan-600 mb-2">מה זה אומר &quot;לחיות את היום&quot;</h3>
                    <p className="text-gray-700">לחיות את היום פירושו להיות בתוך הרגע עם לב פתוח. לא לתכנן את כל הדרך — רק את הצעד הבא. להקשיב לגוף, לנפש, ולרוח, ולתת לכל רגע להיות מה שהוא. כשאתה באמת כאן, אפילו הדברים הפשוטים — נשימה, חיוך, מבט — הופכים לקדושים.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Principles Section */}
          <section className="mb-20" data-section="principles">
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
              <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl p-8 md:p-12 hover:border-gray-300 transition-all duration-300 shadow-lg">
                <h2 className="text-3xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    📚 עקרונות ומונחים בסיסיים
                  </span>
                </h2>
                <p className="text-gray-800 leading-relaxed text-lg mb-8">
                  מושגים יסודיים שכדאי לשנן ולהפנים. לחץ על כל כרטיסיה כדי ללמוד עמוק יותר על העיקרון.
                </p>
                <div className="grid md:grid-cols-3 gap-6">
                  <div
                    onClick={() => {
                      setPrinciplesModalTab('micro');
                      setIsPrinciplesModalOpen(true);
                    }}
                    className="group/card relative bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer"
                  >
                    <div className="text-4xl mb-4">🎯</div>
                    <h3 className="text-xl font-bold text-cyan-600 mb-2">מיקרו - המטרה</h3>
                    <p className="text-gray-700 text-sm">הפוקוס על הצעד הקטן והמטרה המיידית</p>
                    <div className="absolute inset-0 bg-cyan-500/5 rounded-xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div
                    onClick={() => {
                      setPrinciplesModalTab('macro');
                      setIsPrinciplesModalOpen(true);
                    }}
                    className="group/card relative bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer"
                  >
                    <div className="text-4xl mb-4">🌍</div>
                    <h3 className="text-xl font-bold text-blue-600 mb-2">מאקרו - התמונה הגדולה</h3>
                    <p className="text-gray-700 text-sm">החזון הרחב והכיוון הארוך טווח</p>
                    <div className="absolute inset-0 bg-blue-500/5 rounded-xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div
                    onClick={() => {
                      setPrinciplesModalTab('domino');
                      setIsPrinciplesModalOpen(true);
                    }}
                    className="group/card relative bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer"
                  >
                    <div className="text-4xl mb-4">🎲</div>
                    <h3 className="text-xl font-bold text-purple-600 mb-2">אפקט דומינו</h3>
                    <p className="text-gray-700 text-sm">איך פעולה קטנה יוצרת שרשרת גדולה</p>
                    <div className="absolute inset-0 bg-purple-500/5 rounded-xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Morning Section */}
          <section className="mb-20" data-section="morning">
            <h2 className="text-4xl font-bold mb-12">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                🌅 חלק ראשון – תחילת היום: חיבור, כוונה, נשימה
              </span>
            </h2>
            <div className="grid gap-6 md:gap-8">
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl p-8 hover:border-gray-300 transition-all duration-300 shadow-lg">
                  <h3 className="text-2xl font-bold text-cyan-600 mb-4">תפילת הבוקר</h3>
                  <p className="text-gray-800 mb-4">משמעות התפילה האישית – הודיה כמצב תודעה</p>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg font-semibold text-purple-600 mb-2">דוגמה לתפילת פתיחה יומית</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700 italic">מודה אני על האור שזורח בי ועל הנשימה שניתנה לי שוב. יהי רצון שיום זה יהיה כלי של אהבה, חמלה וחכמה...</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-purple-600 mb-2">הודיה כמצב תודעה</h4>
                      <p className="text-gray-700">התפילה היא לא רק מילים, אלא מצב תודעה של הכרת טובה. היא מחברת אותנו למקור החיים ומזכירה שהכל מתחיל מהודיה.</p>
                      <button
                        onClick={() => navigateToAnchor('reality')}
                        className="mt-4 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold hover:shadow-lg transition-all duration-300"
                      >
                        → קרא על תפילת הרוח בתורת המציאות
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl p-8 hover:border-gray-300 transition-all duration-300 shadow-lg">
                  <h3 className="text-2xl font-bold text-cyan-600 mb-4">אפירמציות – מילים שמעצבות תודעה</h3>
                  <p className="text-gray-800 mb-4">כוחן של מילים – איך לבנות אפירמציות נכונות</p>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg font-semibold text-purple-600 mb-2">רשימת אפירמציות יומיות לחיזוק פנימי</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-3 text-gray-700">
                          <span className="text-emerald-500 font-bold mt-1">✓</span>
                          <span>אני נושם – אני חי – אני שלם.</span>
                        </li>
                        <li className="flex items-start gap-3 text-gray-700">
                          <span className="text-emerald-500 font-bold mt-1">✓</span>
                          <span>אני חלק מהזרימה הגדולה של החיים.</span>
                        </li>
                        <li className="flex items-start gap-3 text-gray-700">
                          <span className="text-emerald-500 font-bold mt-1">✓</span>
                          <span>כל נשימה היא התחלה חדשה.</span>
                        </li>
                        <li className="flex items-start gap-3 text-gray-700">
                          <span className="text-emerald-500 font-bold mt-1">✓</span>
                          <span>אני שומע את קול הנשמה שבתוכי ומקשיב לה.</span>
                        </li>
                        <li className="flex items-start gap-3 text-gray-700">
                          <span className="text-emerald-500 font-bold mt-1">✓</span>
                          <span>אני בוחר בחמלה, ביושר ובאהבה היום.</span>
                        </li>
                        <li className="flex items-start gap-3 text-gray-700">
                          <span className="text-emerald-500 font-bold mt-1">✓</span>
                          <span>כל דבר שאני עושה אני ניגש בידעה מוחלטת שאצליח</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-purple-600 mb-2">איך לבנות אפירמציות נכונות</h4>
                      <p className="text-gray-700">אפירמציות צריכות להיות חיוביות, בהווה, ומותאמות למציאות הפנימית שלך. הן מעצבות את התודעה יום אחר יום.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl p-8 hover:border-gray-300 transition-all duration-300 shadow-lg">
                  <h3 className="text-2xl font-bold text-cyan-600 mb-4">מדיטציה קצרה לפתיחת היום</h3>
                  <p className="text-gray-800 mb-4">שלושה סוגי מדיטציה בוקרית – נשימה, התבוננות ושחרור</p>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg font-semibold text-purple-600 mb-2">&quot;חמש דקות של נוכחות&quot; – תרגול יומי</h4>
                      <p className="text-gray-700">שב בשקט, סגור עיניים, התמקד בנשימה. בכל שאיפה – אור נכנס. בכל נשיפה – כל מה שמיותר יוצא. היום נולד. ואני נולד איתו.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Body Section */}
          <section className="mb-20" data-section="body">
            <h2 className="text-4xl font-bold mb-12">
              <span className="bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                🏃‍♂️ חלק שני – הגוף כמרחב של תודעה
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-br from-cyan-600 to-emerald-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-all duration-300 h-full shadow-lg">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">ספורט יומי מינימלי ותנועה</h3>
                  <p className="text-gray-700 text-sm mb-4">עיקרון ה־Minimal Move – תנועה כתפילה גופנית</p>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-semibold text-emerald-600 mb-1">תרגילי מיקרו־תנועה שאפשר לעשות בכל מקום</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• מתיחות צוואר – 30 שניות לכל צד</li>
                        <li>• סקוואטים נגד הקיר – 10 חזרות</li>
                        <li>• הליכה במקום עם הרמת ברכיים</li>
                      </ul>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li>• טאי צ&apos;י של בוקר – 15 דקות</li>
                      <li>• הליכה יומית – 4000 צעדים</li>
                      <li>• תרגילי כוח פשוטים – 5 דקות</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-br from-cyan-600 to-emerald-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-all duration-300 h-full shadow-lg">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">תזונה בריאה לגוף</h3>
                  <p className="text-gray-700 text-sm mb-4">הקשבה לגוף כמערכת חכמה – עקרונות התזונה הפשוטה</p>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-semibold text-emerald-600 mb-1">אכילה מודעת</h4>
                      <p className="text-gray-600 text-sm">אוכל בנשימה, בלי מסכים. הפסקה של 10 דקות נשימה אחרי הארוחה.</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-emerald-600 mb-1">מים, נשימה, ואנרגיה תאית</h4>
                      <p className="text-gray-600 text-sm">מים הם הדלק של הגוף. שתה לאורך היום. נשימה עמוקה לפני ואחרי האוכל.</p>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li>• אוכל אמיתי – כמה שפחות מעובד</li>
                      <li>• רוב הצלחת – ירקות, עלים, קטניות</li>
                      <li>• אכילה מודעת – בנשימה, בלי מסכים</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Mind Section */}
          <section className="mb-20" data-section="mind">
            <h2 className="text-4xl font-bold mb-12">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                💭 חלק שלישי – תזונה בריאה לנפש
              </span>
            </h2>
            <div className="grid grid-cols-1 gap-6">
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-all duration-300 shadow-lg">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">תזונה בריאה לנפש</h3>
                  <p className="text-gray-700 text-sm">&quot;מה אני צורך?&quot; – בחירה במידע, אנשים ותדרים</p>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-semibold text-blue-600 mb-1">ניקוי רעשים תודעתיים</h4>
                      <p className="text-gray-600 text-sm">הרגלים שמחזקים שקט פנימי: הפסקת צריכת חדשות לפני השינה, מדיטציה יומית, בחירה במידע חיובי.</p>
                    </div>
                    <p className="text-gray-600 text-sm mt-2">ניקוי רעשים תודעתיים – הרגלים שמחזקים שקט פנימי</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Memorization Section */}
          <section className="mb-20" data-section="memory">
            <h2 className="text-4xl font-bold mb-12">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                💭 חלק רביעי – דברים שחשוב לשנן
              </span>
            </h2>
            <div className="grid grid-cols-1 gap-6">
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-all duration-300 shadow-lg">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">דברים שחשוב לשנן</h3>
                  <p className="text-gray-700 text-sm">מנטרות ומשפטי חיים – כתיבת &quot;ספר האמיתות האישיות&quot;</p>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-semibold text-blue-600 mb-1">כרטיס כיס</h4>
                      <p className="text-gray-600 text-sm italic">אני מאושר שאני בריא, עשיר, מנהיג, מנטליסט ומפורסם. איזה כיף שכאשר רואים אותי ישר חושבים על כסף, כריזמה, שכל, כוח, הצלחה.</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-blue-600 mb-1">משפטי כוח מנטליים</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• אני שולט בתגובה שלי — לא במציאות.</li>
                        <li>• אני בוחר תודעה, לא רק פעולה.</li>
                        <li>• חוסר נוחות הוא אות לצמיחה, לא סכנה.</li>
                        <li>• אני לומד מכל סיטואציה, גם מהכואבות ביותר.</li>
                        <li>• כל החלטה שאני דוחה — מישהו אחר יקבל בשבילי.</li>
                        <li>• פחד הוא אנרגיה לא ממומשת. אני הופך אותו לתנועה.</li>
                        <li>• המוח עובד בשבילי — לא נגדי.</li>
                        <li>• אני מתאמן על שקט, לא על שלמות.</li>
                        <li>• אנרגיה הולכת אחרי כוונה.</li>
                        <li>• משמעת היא החופש האמיתי.</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-blue-600 mb-1">רצפים חשובים</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                        <div className="group relative">
                          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                          <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-all duration-300 shadow-sm cursor-pointer" onClick={() => setIsMemoryModalOpen(true)}>
                            <h5 className="text-sm font-bold text-blue-600 mb-2">52 חוקים, דמויות, מקומות</h5>
                          </div>
                        </div>
                        <div className="group relative">
                          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                          <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-all duration-300 shadow-sm">
                            <h5 className="text-sm font-bold text-blue-600 mb-2">לוח הכפל</h5>
                          </div>
                        </div>
                        <div className="group relative">
                          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                          <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-all duration-300 shadow-sm">
                            <h5 className="text-sm font-bold text-blue-600 mb-2">10 עקרונות האלוף</h5>
                          </div>
                        </div>
                        <div className="group relative">
                          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                          <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-all duration-300 shadow-sm">
                            <h5 className="text-sm font-bold text-blue-600 mb-2">22 חוקי הומור</h5>
                          </div>
                        </div>
                        <div className="group relative">
                          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                          <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-all duration-300 shadow-sm">
                            <h5 className="text-sm font-bold text-blue-600 mb-2">12 מזלות</h5>
                          </div>
                        </div>
                        <div className="group relative">
                          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                          <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-all duration-300 shadow-sm">
                            <h5 className="text-sm font-bold text-blue-600 mb-2">9 השפעות השפע</h5>
                          </div>
                        </div>
                        <div className="group relative">
                          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                          <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-all duration-300 shadow-sm">
                            <h5 className="text-sm font-bold text-blue-600 mb-2">72 שמות השם</h5>
                          </div>
                        </div>
                        <div className="group relative">
                          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                          <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-all duration-300 shadow-sm">
                            <h5 className="text-sm font-bold text-blue-600 mb-2">5 חוקי היסוד</h5>
                          </div>
                        </div>
                        <div className="group relative">
                          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                          <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-all duration-300 shadow-sm">
                            <h5 className="text-sm font-bold text-blue-600 mb-2">2 התפלגויות המזל</h5>
                          </div>
                        </div>
                        <div className="group relative">
                          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                          <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-all duration-300 shadow-sm">
                            <h5 className="text-sm font-bold text-blue-600 mb-2">8 שפות הגוף</h5>
                          </div>
                        </div>
                        <div className="group relative">
                          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                          <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-all duration-300 shadow-sm">
                            <h5 className="text-sm font-bold text-blue-600 mb-2">10 הספירות</h5>
                          </div>
                        </div>
                        <div className="group relative">
                          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                          <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-all duration-300 shadow-sm">
                            <h5 className="text-sm font-bold text-blue-600 mb-2">8 הצ׳קרות</h5>
                          </div>
                        </div>
                        <div className="group relative">
                          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                          <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-all duration-300 shadow-sm">
                            <h5 className="text-sm font-bold text-blue-600 mb-2">3 יסודות הגוף הסיניים</h5>
                          </div>
                        </div>
                        <div className="group relative">
                          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                          <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-all duration-300 shadow-sm">
                            <h5 className="text-sm font-bold text-blue-600 mb-2">3 יסודות הגוף הסיניים</h5>
                          </div>
                        </div>
                        <div className="group relative">
                          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                          <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-all duration-300 shadow-sm cursor-pointer" onClick={() => setIsStorytellingModalOpen(true)}>
                            <h5 className="text-sm font-bold text-blue-600 mb-2">Storytelling</h5>
                          </div>
                        </div>
                        <div className="group relative">
                          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                          <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-all duration-300 shadow-sm cursor-pointer" onClick={() => setIsProfileModalOpen(true)}>
                            <h5 className="text-sm font-bold text-blue-600 mb-2">פרופיל אישי</h5>
                          </div>
                        </div>
                                                <div className="group relative">
                          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                          <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-all duration-300 shadow-sm cursor-pointer" onClick={() => setIsMBTIModalOpen(true)}>
                            <h5 className="text-sm font-bold text-blue-600 mb-2">MBTI</h5>
                          </div>
                        </div>
                        <div className="group relative">
                          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                          <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-all duration-300 shadow-sm cursor-pointer" onClick={() => setIsInitialsModalOpen(true)}>
                            <h5 className="text-sm font-bold text-emerald-600 mb-2">ראשי תיבות</h5>
                          </div>
                        </div>
                        <div className="group relative">
                          <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                          <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-all duration-300 shadow-sm cursor-pointer" onClick={() => setIsAlphaBossModalOpen(true)}>
                            <h5 className="text-sm font-bold text-red-600 mb-2">ALPHA BOSS - JOKER</h5>
                          </div>
                        </div>
                        <div className="group relative">
                          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                          <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-all duration-300 shadow-sm cursor-pointer" onClick={() => setIsEnergyTypesModalOpen(true)}>
                            <h5 className="text-sm font-bold text-purple-600 mb-2">3 סוגי אנרגיה</h5>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-blue-600 mb-1">איך לשנן</h4>
                      <p className="text-gray-600 text-sm">בכל בוקר בחר שלושה משפטים, אמור אותם בקול מול עצמך. לאט, עם נשימה ותחושת נוכחות. החזרה בונה חיווט חדש במוח — וכך יום אחר יום, אתה מתאמן להיות האדם שאתה כבר רואה בעיני רוחך.</p>
                    </div>
                    <p className="text-gray-600 text-sm mt-2">כיצד להשתמש בשינון כתודעת עוגן</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Practice Section */}
          <section className="mb-20" data-section="practice">
            <h2 className="text-4xl font-bold mb-12">
              <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                🧠 חלק חמישי – התבוננות ופרקטיקה
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-all duration-300 shadow-lg">
                  <h3 className="text-lg font-bold text-emerald-600 mb-2">פרוטוקולים לעבודה</h3>
                  <p className="text-gray-700 text-sm">ניתוח עצמי ופרופילאות – מבנה ניתוח יומי</p>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-semibold text-indigo-600 mb-1">מבנה ניתוח יומי: &quot;מה קרה בי היום?&quot;</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• מה הרגשתי באמת?</li>
                        <li>• מתי איבדתי מיקוד או שלווה?</li>
                        <li>• מה גרם לי לחזור לעצמי?</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-indigo-600 mb-1">ניתוח תגובה ורגש</h4>
                      <p className="text-gray-600 text-sm">לפני שאתה מגיב – עצור. שאל: &quot;מה אני מרגיש עכשיו, ומה אני באמת רוצה להשיג?&quot;</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-indigo-600 mb-1">קריאת סיטואציות ואנשים</h4>
                      <p className="text-gray-600 text-sm">התבונן במבטים, בקול, בקצב הדיבור ובשפת הגוף. שאל את עצמך: &quot;מה האדם הזה באמת מרגיש?&quot;</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-indigo-600 mb-1">איך להבחין בין תחושה לאמת</h4>
                      <p className="text-gray-600 text-sm">האם זו עובדה או תחושה? מה אני יודע, ומה אני מדמיין?</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-all duration-300 shadow-lg">
                  <h3 className="text-lg font-bold text-emerald-600 mb-2">זמן שקט והתבוננות</h3>
                  <p className="text-gray-700 text-sm">אמנות ההאטה – התבוננות כמדיטציה יומיומית</p>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-semibold text-indigo-600 mb-1">תרגילי ראייה ללא שיפוט</h4>
                      <p className="text-gray-600 text-sm">שב בשקט וצפה במחשבות ללא שיפוט. רק התבונן ותן להן לעבור.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-all duration-300 shadow-lg">
                  <h3 className="text-lg font-bold text-emerald-600 mb-2">מיקוד ומטרה יומית</h3>
                  <p className="text-gray-700 text-sm">קביעת כוונת לב – טקס ההצבה היומית</p>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-semibold text-indigo-600 mb-1">איך לבחור ערך להוביל את היום</h4>
                      <p className="text-gray-600 text-sm">בחר ערך כמו הקשבה, יציבות, נדיבות. קבע כוונה אחת ביום.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Relationships Section */}
          <section className="mb-20" data-section="relations">
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-rose-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl p-8 md:p-12 hover:border-gray-300 transition-all duration-300 shadow-lg">
                <h2 className="text-3xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                    💞 חלק שישי – יחסים ונוכחות בעולם
                  </span>
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-800 leading-relaxed text-lg">
                    מערכות יחסים ונוכחות חברתית – תקשורת מודעת, הקשבה אמפתית, גבולות בריאים ורגישות אנרגטית. חיבור מבלי לאבד את המרכז.
                  </p>
                  <div>
                    <h3 className="text-xl font-semibold text-pink-600 mb-2">מערכות יחסים ונוכחות חברתית</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• תקשורת מודעת</li>
                      <li>• הקשבה אמפתית</li>
                      <li>• גבולות בריאים ורגישות אנרגטית</li>
                      <li>• חיבור מבלי לאבד את המרכז</li>
                      <li>• לשמור על קשר עם אנשים - לדבר ולזכור מה הם ספרו לי</li>
                      <li>• להתעניין ולשאול שאלות</li>
                      <li>• להיות המרכז - להזמין וליזום אירועים</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Evening Section */}
          <section className="mb-20" data-section="evening">
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
              <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl p-8 md:p-12 hover:border-gray-300 transition-all duration-300 shadow-lg">
                <h2 className="text-3xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    🌙 חלק שביעי – סיום היום ושחרור
                  </span>
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-800 leading-relaxed text-lg">
                    טקס ערב – סגירת מעגל היום, כתיבת הודיה ורפלקציה, נשימות להרפיה. הכנה לשינה כמעשה ריפוי.
                  </p>
                  <div>
                    <h3 className="text-xl font-semibold text-amber-600 mb-2">טקס ערב</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• סגירת מעגל היום</li>
                      <li>• כתיבת הודיה ורפלקציה</li>
                      <li>• נשימות להרפיה</li>
                      <li>• הכנה לשינה כמעשה ריפוי</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          
          {/* Afterword Section */}
          <section className="mb-20">
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
              <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl p-8 md:p-12 hover:border-gray-300 transition-all duration-300 shadow-lg">
                <h2 className="text-3xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                    💫 אחרית דבר
                  </span>
                </h2>
                <div className="space-y-4 text-gray-800 leading-relaxed">
                  <p>אין ימים רגילים – רק הזדמנויות חדשות.</p>
                  <p>איך להפוך את ה־One Day לתרגול מתמשך.</p>
                  <p>חיבור בין הימים: החיים כמסע מעגלי.</p>
                  <p>One Day Handbook הוא לא ספר לקרוא — הוא ספר לחיות. כל פרק הוא תרגול קטן שנועד להפוך את היום שלך לשלם, מחובר ובריא יותר. המדריך מציע מסע מעגלי — בוקר, תנועה, תודעה, יחסים, לילה — וחוזר חלילה. חיים של נוכחות אחת בכל פעם.</p>
                </div>
              </div>
            </div>
          </section>


          <section className="mb-20">
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
              <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl p-8 md:p-12 hover:border-gray-300 transition-all duration-300 shadow-lg">
                <h2 className="text-3xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    📜 נספחים (לא חובה, אך מומלץ)
                  </span>
                </h2>
                <div className="space-y-4 text-gray-800 leading-relaxed">
                  <p>• לוח אפירמציות חודשי</p>
                  <p>• תבנית לכתיבת ניתוח יומי</p>
                  <p>• רשימת תרגולי מדיטציה ונשימה</p>
                  <p>• רשימת בקרים וערבים לדפוס קבוע</p>
                </div>
              </div>
            </div>
          </section>
          <section className="mb-20" data-section="brain">
            <h2 className="text-4xl font-bold mb-12">
              <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                🧩 חלק שמיני – אימון מוחי: הרחבת התודעה והחדות
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-all duration-300 shadow-lg">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">מהו אימון מוחי</h3>
                  <p className="text-gray-700 text-sm">איך המוח לומד ומתרגל – החיבור בין גמישות מחשבתית לנפש שקטה</p>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-semibold text-teal-600 mb-1">המוח ככלי ליצירה ולא רק לזיכרון</h4>
                      <p className="text-gray-600 text-sm">אימון מוחי מפתח גמישות מחשבתית, זיכרון, יצירתיות וקשב.</p>
                    </div>
                    <p className="text-gray-600 text-sm mt-2">המוח ככלי ליצירה ולא רק לזיכרון</p>
                  </div>
                </div>
              </div>
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-all duration-300 shadow-lg">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">עשרה תרגילים יומיים</h3>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• 🧱 רצף שמות – תרגול זיכרון אסוציאטיבי</li>
                    <li>• 🔢 רצף מספרים – חיזוק זיכרון עבודה וריכוז</li>
                    <li>• 📚 קריאה מודעת – פיתוח הבנה והשהייה</li>
                    <li>• ✍️ כתיבה חופשית – זרם תודעה לחיזוק יצירתיות</li>
                    <li>• 🎯 מיקוד חמש דקות – תרגול ריכוז חד באובייקט אחד</li>
                    <li>• 🧩 פתרון בעיה יומית – גירוי חשיבה אנליטית</li>
                    <li>• 🪞 היפוך מחשבתי – לראות דבר מזווית חדשה</li>
                    <li>• 💭 ויזואליזציה של תהליך – אימון מוח־דמיון</li>
                    <li>• 🎵 הקשבה מודעת – חידוד קליטה חושית וזיכרון שמיעתי</li>
                    <li>• 🌐 תרגול הקשרים – יצירת קשרים בין רעיונות שונים</li>
                  </ul>
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-teal-600 mb-2">בניית רוטינת אימון מוח יומית</h4>
                    <p className="text-gray-600 text-sm">איך לשלב תרגילי מוח ביומיום. שילוב בין גירוי מוחי למנוחה מנטלית. איזון בין זיכרון, יצירתיות וקשב.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="mb-20" data-section="reality">
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
              <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl p-8 md:p-12 hover:border-gray-300 transition-all duration-300 shadow-lg">
                <h2 className="text-3xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    תורת המציאות
                  </span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                    <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-all duration-300 shadow-lg">
                      <h3 className="text-lg font-bold text-indigo-600 mb-4">הרוח</h3>
                      <p className="text-gray-700 text-sm">הכול מתחיל ונגמר ברוח. הרוח נושבת עמוק פנימה והחוצה, מובילה את הדרך.</p>
                    </div>
                  </div>
                  <div className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                    <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-all duration-300 shadow-lg">
                      <h3 className="text-lg font-bold text-indigo-600 mb-4">הזיכרון</h3>
                      <p className="text-gray-700 text-sm">זוכר אני חסד וזכות להיות. הזיכרון הוא עוצמתי יציב ושלם, הוא מורכב חלקיקי דעת החושים והוא גמיש כמי האוקיינוס המקושרים זה לזה בתנועה מתמדת.</p>
                    </div>
                  </div>
                  <div className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                    <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-all duration-300 shadow-lg">
                      <h3 className="text-lg font-bold text-indigo-600 mb-4">הכישרון</h3>
                      <p className="text-gray-700 text-sm">ההכשרה כחרב חורצת גורל, אך גם יכולת לייצר אנרגיה חדשה של כוח עליון על פני האדמה.</p>
                    </div>
                  </div>
                  <div className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                    <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-all duration-300 shadow-lg">
                      <h3 className="text-lg font-bold text-indigo-600 mb-4">הכוח</h3>
                      <p className="text-gray-700 text-sm">חוק הכוח הינו נפח כוחו העצום ביותר של העולם. מתמלא ומתרוקן כירח, בוהק כמו אור השמש.</p>
                    </div>
                  </div>
                  <div className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                    <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-all duration-300 shadow-lg">
                      <h3 className="text-lg font-bold text-indigo-600 mb-4">המוח</h3>
                      <p className="text-gray-700 text-sm">ממחשבה למחשבה, חשבון הנפש הוא דבר חדש על ציר זמן הרוח והחיים. צעד אחר צעד מוביל לתוצאה אחד תוצאה כתשובה המובילה לשאלה.</p>
                    </div>
                  </div>
                  <div className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                    <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-all duration-300 shadow-lg">
                      <h3 className="text-lg font-bold text-indigo-600 mb-4">הרעב</h3>
                      <p className="text-gray-700 text-sm">יצר הרעב מריץ את ההנהגה לרצות ולהזין את הקרקע עליה מתבססת הרוח. זה נכון לכל אדם ולכל חי בעולם. גודל יצר הרעב כגודל הזנתו.</p>
                    </div>
                  </div>
                  <div className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                    <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-all duration-300 shadow-lg">
                      <h3 className="text-lg font-bold text-indigo-600 mb-4">המהות</h3>
                      <p className="text-gray-700 text-sm">מהות החיים היא היכולת להאמין ולקבל את הלא נודע כמרכיב העיקרי של הקיום. תהום עמוקה יותר מזו של חור שחור. האמונה כאומנות אימון נאום ה׳.</p>
                    </div>
                  </div>
                  <div className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                    <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-all duration-300 shadow-lg">
                      <h3 className="text-lg font-bold text-indigo-600 mb-4">האופי</h3>
                      <p className="text-gray-700 text-sm">אופי רוח ההתנהגות, הוא בעיקר המדד המרכזי לאופי מדעי התודעה הנפש והגוף.</p>
                    </div>
                  </div>
                  <div className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                    <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-all duration-300 shadow-lg">
                      <h3 className="text-lg font-bold text-indigo-600 mb-4">השפע</h3>
                      <p className="text-gray-700 text-sm">עושר בעל עשר קצוותיו של שפע ה׳. למעלה, למטה, ימין, שמאל, קדימה, אחורה, מקיף אופקי, מקיף אנכי, מקיף ספרי ומרכז. לב ליבו הפנימי פועם בכל קצוות גופו ומשפיע על הכל.</p>
                    </div>
                  </div>
                  <div className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                    <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-all duration-300 shadow-lg">
                      <h3 className="text-lg font-bold text-indigo-600 mb-4">השקט</h3>
                      <p className="text-gray-700 text-sm">השקט אינו אלא רוח יציבה וחזקה מאוד של עקביות, שלווה ובהירות על ציר זמן מסוים.</p>
                    </div>
                  </div>
                  <div className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                    <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-all duration-300 shadow-lg">
                      <h3 className="text-lg font-bold text-indigo-600 mb-4">סיכום</h3>
                      <p className="text-gray-700 text-sm">רוח זיכרון כישרון כוח המוח הרעב למהות אופי שופע שקט.</p>
                    </div>
                  </div>
                  <div className="group relative col-span-1 md:col-span-2">
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                    <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-all duration-300 shadow-lg">
                      <h3 className="text-lg font-bold text-indigo-600 mb-4">תפילה</h3>
                      <p className="text-gray-700 text-sm">הרוח. מודה אני לפניך מלך חי וקיים שהחזרת בי נשמתי בחמלה רבה אמונתך בכל רגע ורגע, שמע ישראל אדוני אלוהינו אדוני אחד.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="mb-20 text-center">
            <div className="group relative inline-block w-full">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000 animate-pulse" />
              <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl p-12 hover:border-gray-300 transition-all duration-300 shadow-lg">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">מוכנים למסע?</h2>
                <p className="text-gray-700 mb-8">הזמנה למסע יומי של חיים שלמים – יום אחד בכל פעם</p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    href="/"
                    className="px-8 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105"
                  >
                    חזרה לדף הבית
                  </Link>
                  <div className="px-8 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-800 font-semibold transition-all duration-300">
                    המשך לקרוא
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <MemoryModal isOpen={isMemoryModalOpen} onClose={() => setIsMemoryModalOpen(false)} />
      <StorytellingModal isOpen={isStorytellingModalOpen} onClose={() => setIsStorytellingModalOpen(false)} />
      <MBTIModal isOpen={isMBTIModalOpen} onClose={() => setIsMBTIModalOpen(false)} />
      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
      <InitialsModal isOpen={isInitialsModalOpen} onClose={() => setIsInitialsModalOpen(false)} />
      <AlphaBossModal isOpen={isAlphaBossModalOpen} onClose={() => setIsAlphaBossModalOpen(false)} />
      <EnergyTypesModal isOpen={isEnergyTypesModalOpen} onClose={() => setIsEnergyTypesModalOpen(false)} />
      <PrinciplesModal isOpen={isPrinciplesModalOpen} onClose={() => setIsPrinciplesModalOpen(false)} initialTab={principlesModalTab} />

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
