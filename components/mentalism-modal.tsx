'use client';

import { useState } from 'react';

interface MentalismModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MentalismModal({ isOpen, onClose }: MentalismModalProps) {
  const [activeTab, setActiveTab] = useState<'main' | 'influence'>('main');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">מנטליזם - קריאת אנשים</h2>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white text-2xl font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          <button
            onClick={() => setActiveTab('main')}
            className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
              activeTab === 'main'
                ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white'
                : 'text-gray-600 hover:text-indigo-600'
            }`}
          >
            קריאת מחשבות
          </button>
          <button
            onClick={() => setActiveTab('influence')}
            className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
              activeTab === 'influence'
                ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white'
                : 'text-gray-600 hover:text-indigo-600'
            }`}
          >
            אמנות ההשפעה
          </button>
        </div>

        {activeTab === 'main' ? (
          <>
            {/* Video */}
            <div className="p-6 bg-gray-50">
              <div className="flex justify-center">
                <iframe
                  width="560"
                  height="315"
                  src="https://www.youtube.com/embed/h3M00JI8Iwo"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="rounded-lg"
                ></iframe>
              </div>
            </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[60vh] space-y-6">
          <div className="prose prose-lg max-w-none">
            <div className="bg-indigo-50 p-6 rounded-xl mb-6">
              <h3 className="text-2xl font-bold text-indigo-600 mb-4">אוז פרלמן - קורא אנשים, לא מחשבות</h3>
              <p className="text-gray-800 leading-relaxed">
                אוז פרלמן, המכונה &quot;קורא המחשבות הגדול בעולם&quot;, מבהיר כי <strong>הוא אינו קורא מחשבות, אלא קורא אנשים</strong>. 
                הוא מדגיש כי אין לו כוחות על-טבעיים, וכי זוהי מיומנות נרכשת שפיתח במשך כשלושה עשורים על ידי &quot;הנדסה לאחור של המוח האנושי&quot;.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-indigo-600 mb-4">הדגמות קריאת אנשים</h3>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white border border-indigo-200 rounded-lg p-5">
                <h4 className="text-xl font-bold text-indigo-600 mb-3">🎭 איאן (האדם המת)</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• <strong>רמזים פיזיים:</strong> זיהוי אם האדם חי (חום, חיוך, אושר) או מת (צמרמורת, &quot;ויברציות של אדם מת&quot;)</li>
                  <li>• <strong>זיהוי מגדר:</strong> ידיים בכיסים = גבר</li>
                  <li>• <strong>שם:</strong> בלבול לגבי שם המשפחה + שם פרטי ארוך</li>
                  <li>• <strong>תוצאה:</strong> אלכסנדר הגדול ✓</li>
                </ul>
              </div>

              <div className="bg-white border border-purple-200 rounded-lg p-5">
                <h4 className="text-xl font-bold text-purple-600 mb-3">🎤 ננג&apos;רה (האדם החי)</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• <strong>רמזים פיזיים:</strong> הסמקת לחיים וזיעה קלה = אדם חי</li>
                  <li>• <strong>שינוי מחשבה:</strong> תזוזת עיניים (&quot;גישת הדשא של השכן ירוק יותר&quot;)</li>
                  <li>• <strong>תשובה ראשונה:</strong> בוב דילן</li>
                  <li>• <strong>תשובה אמיתית:</strong> טרבור נואה ✓</li>
                </ul>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-indigo-600 mb-4 mt-8">כוח-העל לזכירת שמות: הקשב, חזור, השב</h3>
            
            <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-6 rounded-xl mb-6">
              <p className="text-lg text-gray-800 leading-relaxed mb-4">
                פרלמן מציע &quot;כוח-על&quot; לזכירת שמות המבוסס על שלושה עקרונות פשוטים. 
                הוא מסביר ששכחת שמות <strong>אינה בעיית זיכרון</strong> - השם פשוט מעולם לא נקלט באמת.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-white border-r-4 border-indigo-500 p-5 shadow-sm">
                <h4 className="text-xl font-bold text-indigo-600 mb-3">1️⃣ הקשב (Listen)</h4>
                <p className="text-gray-700 mb-2">
                  ברגע שהאדם אומר את שמו, רוקן את המוח לשתי שניות והקשב באמת.
                </p>
                <div className="bg-indigo-50 p-3 rounded-lg mt-3">
                  <p className="text-sm text-indigo-700">
                    💡 <strong>טיפ:</strong> אל תחשוב על מה להגיד בתגובה - רק הקשב
                  </p>
                </div>
              </div>

              <div className="bg-white border-r-4 border-purple-500 p-5 shadow-sm">
                <h4 className="text-xl font-bold text-purple-600 mb-3">2️⃣ חזור (Repeat)</h4>
                <p className="text-gray-700 mb-2">
                  חזור על השם פעמיים לאדם. זה מקבע את השם בזיכרון ומוודא הגייה נכונה.
                </p>
                <div className="bg-purple-50 p-3 rounded-lg mt-3">
                  <p className="text-sm text-purple-700">
                    💬 <strong>דוגמה:</strong> &quot;אשלי, זה נכון? נעים להכיר אותך, אשלי&quot;
                  </p>
                </div>
              </div>

              <div className="bg-white border-r-4 border-pink-500 p-5 shadow-sm">
                <h4 className="text-xl font-bold text-pink-600 mb-3">3️⃣ השב (Reply)</h4>
                <p className="text-gray-700 mb-2">
                  שלב זה מקבע לחלוטין את השם. ניתן להשיב בשלוש דרכים:
                </p>
                <ul className="space-y-3 mt-3">
                  <li className="bg-pink-50 p-3 rounded-lg">
                    <strong className="text-pink-700">מחמאה:</strong>
                    <p className="text-sm text-gray-700 mt-1">&quot;אשלי, אני אוהב את העגילים האלה, אשלי&quot; - יוצר קישור ויזואלי</p>
                  </li>
                  <li className="bg-pink-50 p-3 rounded-lg">
                    <strong className="text-pink-700">איות:</strong>
                    <p className="text-sm text-gray-700 mt-1">&quot;האם מאייתים את זה אשלי עם EIGH או EY?&quot;</p>
                  </li>
                  <li className="bg-pink-50 p-3 rounded-lg">
                    <strong className="text-pink-700">קשר אישי:</strong>
                    <p className="text-sm text-gray-700 mt-1">&quot;בן הדוד שלי נשוי לאשלי&quot; - אפילו אם לא נכון, זה מחזק את הזיכרון</p>
                  </li>
                </ul>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-indigo-600 mb-4 mt-8">הגורם מספר 1 להצלחה</h3>
            
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-xl">
              <h4 className="text-2xl font-bold mb-3">🎯 אמונה בלתי מעורערת</h4>
              <p className="text-lg leading-relaxed">
                פרלמן מצהיר כי <strong>הגורם החשוב ביותר להצלחה</strong> (על הבמה ובכל תחומי החיים) 
                <strong> הוא אמונה בלתי מעורערת בכך שזה יעבוד</strong>. 
                זוהי נבואה המגשימה את עצמה.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-indigo-600 mb-4 mt-8">ההדגמה הסופית</h3>
            
            <div className="bg-white border border-purple-200 rounded-lg p-5">
              <p className="text-gray-700 mb-3">
                בהדגמה הסופית, פרלמן בוחר משתתף אקראי <strong>(ברט)</strong> מהקהל, שלא פגש את המשתתף <strong>ג&apos;ף</strong>, 
                כדי לקרוא את מחשבותיו של ג&apos;ף.
              </p>
              <ul className="space-y-2 text-gray-700 mr-4">
                <li>• ברט התבקש לעצום את עיניו</li>
                <li>• &quot;להסתכל לתוך נשמתו&quot; של ג&apos;ף</li>
                <li>• ברט ניחש נכונה: <strong className="text-indigo-600">ברק אובמה</strong> ✓</li>
              </ul>
            </div>

            <h3 className="text-2xl font-bold text-indigo-600 mb-4 mt-8">נקודות מפתח</h3>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-indigo-50 p-4 rounded-lg">
                <div className="text-3xl mb-2">🧠</div>
                <h5 className="font-bold text-indigo-700 mb-2">לא כוחות על-טבעיים</h5>
                <p className="text-sm text-gray-700">מיומנות נרכשת שכל אחד יכול לפתח</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-3xl mb-2">🔍</div>
                <h5 className="font-bold text-purple-700 mb-2">פירוק אפשרויות</h5>
                <p className="text-sm text-gray-700">לקיחת משהו בלתי מוגבל ופירוקו לחלקים</p>
              </div>
              
              <div className="bg-pink-50 p-4 rounded-lg">
                <div className="text-3xl mb-2">💪</div>
                <h5 className="font-bold text-pink-700 mb-2">אמונה = הצלחה</h5>
                <p className="text-sm text-gray-700">אמונה בלתי מעורערת היא המפתח</p>
              </div>
            </div>
          </div>
        </div>
        </>
        ) : (
          <>
            {/* Video */}
            <div className="p-6 bg-gray-50">
              <div className="flex justify-center">
                <iframe
                  width="560"
                  height="315"
                  src="https://www.youtube.com/embed/4qfxHfBJ3Mw?start=424"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="rounded-lg"
                ></iframe>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 overflow-y-auto max-h-[60vh] space-y-6">
              <div className="prose prose-lg max-w-none">
                <div className="bg-indigo-50 p-6 rounded-xl mb-6">
                  <h3 className="text-2xl font-bold text-indigo-600 mb-4">אמנות קריאת המחשבות וההשפעה</h3>
                  <p className="text-gray-800 leading-relaxed">
                    אוז פרלמן, מנטליסט לשעבר בוול סטריט, מציג תובנות מתוך ניסיונו של שלושה עשורים ב&quot;הנדסה לאחור&quot; 
                    של המוח האנושי כדי ללמד מיומנויות להצלחה בחיים האישיים והמקצועיים.
                  </p>
                </div>

                <h3 className="text-2xl font-bold text-indigo-600 mb-4">1. העיקרון המרכזי: הפרדוקס של דברים קטנים</h3>
                
                <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-6 rounded-xl mb-6">
                  <h4 className="text-xl font-bold text-indigo-700 mb-3">🎯 הסוד מספר 1 להצלחה</h4>
                  <p className="text-lg text-gray-800 leading-relaxed">
                    <strong>הכל עוסק באדם שמולך, לא בך.</strong> כל הפעולות מכוונות לגרום לאדם האחר להיראות טוב, 
                    להרגיש מיוחד, ולהפוך אותו לכוכב.
                  </p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="bg-white border-r-4 border-indigo-500 p-5 shadow-sm">
                    <h4 className="text-lg font-bold text-indigo-600 mb-3">💎 כוחם של פרטים קטנים</h4>
                    <p className="text-gray-700 mb-3">
                      זכירת פרטים קטנים ואישיים (שמות ילדים, פרטים משפחתיים) יוצרת תחושה <strong>&quot;כמו זכייה בלוטו&quot;</strong> 
                      - הם ידברו על הרגע הזה במשך שנים.
                    </p>
                    <div className="bg-indigo-50 p-3 rounded-lg">
                      <p className="text-sm text-indigo-700">
                        💡 <strong>הפרדוקס:</strong> רוב האנשים מתעלמים מפרטים אלה כי הם חושבים שהם חסרי חשיבות
                      </p>
                    </div>
                  </div>

                  <div className="bg-white border-r-4 border-purple-500 p-5 shadow-sm">
                    <h4 className="text-lg font-bold text-purple-600 mb-3">📊 מידע הוא כוח</h4>
                    <p className="text-gray-700">
                      פרלמן מתעד כל אינטראקציה ופרט באופן מיידי. ככל שמידע נשמר זמן רב יותר 
                      (שנתיים במקום יום אחד), כך הוא מרשים יותר כשמוגש מחדש.
                    </p>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-indigo-600 mb-4 mt-8">2. שיפור הזיכרון והקשבה פעילה</h3>
                
                <div className="bg-purple-50 p-6 rounded-xl mb-6">
                  <p className="text-lg text-gray-800 leading-relaxed">
                    <strong>שיפור הזיכרון הוא סוד עצום להצלחה</strong> בעולם שבו אנשים תלויים בטלפונים שלהם.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="bg-white border-r-4 border-indigo-500 p-5 shadow-sm">
                    <h4 className="text-xl font-bold text-indigo-600 mb-3">1️⃣ הקשב (Listen)</h4>
                    <p className="text-gray-700 mb-2">
                      <strong>95% מהאנשים נכשלים כאן.</strong> המוח עסוק בתכנון התגובה הבאה.
                    </p>
                    <div className="bg-indigo-50 p-3 rounded-lg mt-3">
                      <p className="text-sm text-indigo-700">
                        💡 <strong>טיפ:</strong> השתק את המחשבות שלך - המוח לא יכול לקרוא ולכתוב בו זמנית
                      </p>
                    </div>
                  </div>

                  <div className="bg-white border-r-4 border-purple-500 p-5 shadow-sm">
                    <h4 className="text-xl font-bold text-purple-600 mb-3">2️⃣ חזור (Repeat)</h4>
                    <p className="text-gray-700">
                      חזור על השם מיד כדי לוודא שנקלט בזיכרון.
                    </p>
                  </div>

                  <div className="bg-white border-r-4 border-pink-500 p-5 shadow-sm">
                    <h4 className="text-xl font-bold text-pink-600 mb-3">3️⃣ השב (Reply)</h4>
                    <p className="text-gray-700 mb-3">שלוש טקטיקות:</p>
                    <ul className="space-y-2 text-gray-700 mr-4">
                      <li>• <strong>איות:</strong> &quot;סטיבן עם V או PH?&quot;</li>
                      <li>• <strong>וו ויזואלי:</strong> מחמיאים על חולצה/עגילים</li>
                      <li>• <strong>קישור לאדם:</strong> &quot;בן הדוד שלי גם קוראים לו ככה&quot;</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-xl mt-6">
                  <h4 className="text-xl font-bold text-purple-700 mb-3">🌟 האדם המעניין ביותר</h4>
                  <p className="text-purple-800 leading-relaxed">
                    <strong>&quot;האדם המעניין ביותר בחדר נוטה להיות האדם הכי מעוניין בחדר&quot;</strong>
                  </p>
                  <p className="text-sm text-purple-700 mt-2">
                    הקשבה פעילה: קשר עין, שאלות שאינן &quot;כן/לא&quot;, הוצאה מ&quot;טייס אוטומטי&quot;
                  </p>
                </div>

                <h3 className="text-2xl font-bold text-indigo-600 mb-4 mt-8">3. התגברות על פחד ופרוקראסטינציה</h3>
                
                <div className="space-y-4">
                  <div className="bg-white border border-red-200 rounded-lg p-5">
                    <h4 className="text-xl font-bold text-red-600 mb-3">⚠️ פחד מדחייה</h4>
                    <p className="text-gray-700">
                      <strong>הגורם מספר 1 שמפריד בין כישלון להצלחה.</strong> רוב האנשים נמנעים מלנסות להשיג מטרותיהם 
                      בשל חשש מכישלון.
                    </p>
                  </div>

                  <div className="bg-white border border-emerald-200 rounded-lg p-5">
                    <h4 className="text-xl font-bold text-emerald-600 mb-3">⏰ טריק ה&quot;מחר&quot;</h4>
                    <p className="text-gray-700 mb-3">
                      כדי להתגבר על דחיינות, שאל: <strong>&quot;איך ארגיש לגבי זה מחר?&quot;</strong>
                    </p>
                    <div className="bg-emerald-50 p-3 rounded-lg">
                      <p className="text-sm text-emerald-700">
                        📊 רמת החרדה יורדת ממחרת מ-8-10 ל-2-3
                      </p>
                    </div>
                  </div>

                  <div className="bg-white border border-blue-200 rounded-lg p-5">
                    <h4 className="text-xl font-bold text-blue-600 mb-3">🎭 יצירת פרסונה נפרדת</h4>
                    <p className="text-gray-700">
                      פרלמן יצר &quot;אוז המבדר&quot; - אישיות נפרדת. כשנדחה, הוא ייחס את הכאב לאותה דמות, 
                      לא לעצמו.
                    </p>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-indigo-600 mb-4 mt-8">4. נקיטת פעולה ואחריות</h3>
                
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-xl mb-6">
                  <h4 className="text-2xl font-bold mb-3">⚡ השראה ומוטיבציה הן &quot;זבל&quot;</h4>
                  <p className="text-lg leading-relaxed">
                    <strong>הדבר החשוב הוא פעולה (Action)</strong>
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="bg-white border-r-4 border-indigo-500 p-5 shadow-sm">
                    <h4 className="text-lg font-bold text-indigo-600 mb-3">📋 מטרות ניתנות לכימות</h4>
                    <p className="text-gray-700 mb-3">
                      הגדר יעדים מדידים והשתמש במנגנוני אחריות:
                    </p>
                    <div className="bg-indigo-50 p-3 rounded-lg">
                      <p className="text-sm text-indigo-700">
                        💡 <strong>דוגמה:</strong> רוצה לרוץ 10K? שתף 10 אנשים - פחד מביוש ישמש מוטיבציה
                      </p>
                    </div>
                  </div>

                  <div className="bg-white border-r-4 border-purple-500 p-5 shadow-sm">
                    <h4 className="text-lg font-bold text-purple-600 mb-3">📝 הכנה מראש</h4>
                    <p className="text-gray-700">
                      התכונן לכל תרחיש אפשרי - תוכניות A עד Z. 
                      איש מכירות צריך לכתוב מראש את כל ההתנגדויות האפשריות ולהתכונן לנטרל אותן.
                    </p>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-indigo-600 mb-4 mt-8">הליבה: מיקוד הקשב</h3>
                
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-xl">
                  <p className="text-lg text-gray-800 leading-relaxed">
                    <strong>מיקוד הקשב שלך הוא שמניע את המיקוד של האחר.</strong> כשם שמנטליסט משתמש בהסחת דעת 
                    כדי לשתול זיכרון, כך בחיי היומיום, הדרך שבה אתה מתמקד ופועל מכוונת את הזיכרון והתפיסה של האדם שמולך.
                  </p>
                </div>

                <h3 className="text-2xl font-bold text-indigo-600 mb-4 mt-8">סיכום הנקודות החזקות</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <div className="text-3xl mb-2">👤</div>
                    <h5 className="font-bold text-indigo-700 mb-2">התמקד באחרים</h5>
                    <p className="text-sm text-gray-700">פרטים קטנים = השפעה גדולה</p>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-3xl mb-2">👂</div>
                    <h5 className="font-bold text-purple-700 mb-2">הקשב באמת</h5>
                    <p className="text-sm text-gray-700">95% נכשלים בשלב זה</p>
                  </div>
                  
                  <div className="bg-pink-50 p-4 rounded-lg">
                    <div className="text-3xl mb-2">🚫</div>
                    <h5 className="font-bold text-pink-700 mb-2">נצח את הפחד</h5>
                    <p className="text-sm text-gray-700">דחייה = הגורם מספר 1 לכישלון</p>
                  </div>
                  
                  <div className="bg-emerald-50 p-4 rounded-lg">
                    <div className="text-3xl mb-2">⚡</div>
                    <h5 className="font-bold text-emerald-700 mb-2">פעולה &gt; השראה</h5>
                    <p className="text-sm text-gray-700">מוטיבציה היא זבל - פעל!</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
