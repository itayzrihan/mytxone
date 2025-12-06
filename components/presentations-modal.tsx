'use client';

import { useState } from 'react';

interface PresentationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PresentationsModal({ isOpen, onClose }: PresentationsModalProps) {
  const [activeTab, setActiveTab] = useState<'main' | 'video1' | 'video2' | 'video3'>('main');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">מצגות ומצגים</h2>
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
                ? 'text-purple-600 border-b-2 border-purple-600 bg-white'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            תוכן עיקרי
          </button>
          <button
            onClick={() => setActiveTab('video1')}
            className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
              activeTab === 'video1'
                ? 'text-purple-600 border-b-2 border-purple-600 bg-white'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            וידאו 1
          </button>
          <button
            onClick={() => setActiveTab('video2')}
            className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
              activeTab === 'video2'
                ? 'text-purple-600 border-b-2 border-purple-600 bg-white'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            וידאו 2
          </button>
          <button
            onClick={() => setActiveTab('video3')}
            className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
              activeTab === 'video3'
                ? 'text-purple-600 border-b-2 border-purple-600 bg-white'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            וידאו 3
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[60vh]">
          {activeTab === 'main' && (
            <div className="space-y-6">
              {/* Video */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="aspect-video w-full">
                  <iframe
                    width="560"
                    height="315"
                    src="https://www.youtube.com/embed/FHIo77y12gA?si=IoM41rFwR8twBEHA"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className="w-full h-full rounded-lg"
                  ></iframe>
                </div>
              </div>

              <div className="prose prose-lg max-w-none">
                <h3 className="text-2xl font-bold text-purple-600 mb-4">העיקרון המכונן והחשיבות של זיכרון:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• כשאדם מדבר, חשוב לשאול האם אנשים זוכרים אותו והאם הוא בלתי נשכח או נשכח.</li>
                  <li>• חוסר היכולת לזכור מידע יכול להיות בעל השלכות משמעותיות; אדם שהשתתף במצגת של שעה על התמודדות עם חרדת דיבור לא הצליח ליישם אף אחת מ-17 הטכניקות שנלמדו 10 דקות לאחר סיום המצגת, מכיוון שלא זכר אותן.</li>
                  <li>• הלקח החשוב ביותר הוא: &quot;זה לא מה שאתה אומר, זה מה שהם זוכרים&quot;.</li>
                  <li>• אם אתה לא בלתי נשכח, אינך יכול להיות בעל ערך.</li>
                  <li>• אנשים אינם יכולים לעקוב אחר משהו שהם שוכחים.</li>
                  <li>• מצגת, שיעור או שיחה שאדם בקושי זוכר למחרת הם בזבוז מוחלט וטרגי של זמן ומאמץ.</li>
                  <li>• הדובר רצה להיות בעל ערך ולכלול כמה שיותר מידע, אך הבין שאי אפשר להיות בעל ערך אם לא זוכרים אותך.</li>
                  <li>• היכולת לדבר באופן בלתי נשכח היא מיומנות ששווה להחזיק בה, במיוחד בראיונות עבודה, פגישה עם &quot;נפש תאומה&quot;, או מתן עצות לילדים.</li>
                </ul>

                <h3 className="text-2xl font-bold text-purple-600 mb-4 mt-8">חמשת הדרכים להיות בלתי נשכח (ראשי התיבות SHARE):</h3>
                <p className="text-gray-700 mb-4">חמשת האלמנטים הללו ניתנים לזכירה באמצעות המילה SHARE (רשום אותה).</p>

                <h4 className="text-xl font-semibold text-pink-600 mb-2">1. S - Stand Out (להתבלט):</h4>
                <ul className="space-y-2 text-gray-700 mb-4">
                  <li>• שיחות יום-יומיות רגילות כוללות את אותן שאלות ותגובות זהות, מה שגורם למוח להתייחס אליהן כלא חשובות ולשכוח אותן.</li>
                  <li>• אם משהו בולט או שונה, זוכרים אותו.</li>
                  <li>• דוגמה להתבלטות: קבלה פשוטה לשאלה &quot;מה שלומך היום?&quot; בתשובה &quot;פנומנלי בהחלט&quot; במקום &quot;טוב&quot;, יצרה שיחה בלתי נשכחת שנזכרה גם 12 שנים מאוחר יותר.</li>
                  <li>• המטרה היא לומר משהו קצת שונה שיתבלט כך שאנשים יזכרו.</li>
                </ul>

                <h4 className="text-xl font-semibold text-pink-600 mb-2">2. H - Highlight What&apos;s Important (להדגיש מה שחשוב):</h4>
                <ul className="space-y-2 text-gray-700 mb-4">
                  <li>• צריך להימנע ממצב שבו המאזין תוהה מה הנקודה העיקרית בסיפור של 18 דקות, או במצגת שיש בה 85 שקפים ו-10 נקודות תבליט.</li>
                  <li>• משל עטיפת המתנה: מנהל בכיר השווה מצגת לא מוצלחת למתנה עטופה: הדובר נתן את השקפים, המידע וה&quot;פלוּף&quot; (עטיפת המתנה), אבל לא את הדבר החשוב באמת (המתנה).</li>
                  <li>• אנשים לא זוכרים את כל מה שנאמר, אלא את מה שאתה רוצה שהם יזכרו.</li>
                  <li>• יש לומר לאנשים במפורש מה חשוב, ולומר להם &quot;זה חשוב, שימו לב&quot; או &quot;כתבו את זה&quot;.</li>
                </ul>

                <h4 className="text-xl font-semibold text-pink-600 mb-2">3. A - Address Them (לפנות אליהם/לגעת בהם):</h4>
                <ul className="space-y-2 text-gray-700 mb-4">
                  <li>• כאשר נושא מסוים נוגע למאזינים באופן אישי, סביר יותר שהם יזכרו אותו.</li>
                  <li>• אם הדובר מדבר על נושא לא רלוונטי (כמו שיעורי מס ביפן), המוח נוטה להתעלם ממנו.</li>
                  <li>• ציטוט של דייל קארנגי: &quot;הדבר האחד שאנשים אוהבים יותר מלדבר על עצמם הוא לשמוע על עצמם&quot;.</li>
                  <li>• דוגמה: שימוש בביטוי &quot;אתה יודע מה שמתי לב בך?&quot; גרם לאנשים ברשתות חברתיות להקשיב ולהתרגש, גם כאשר הניחוש לגבי עיסוקם היה שגוי.</li>
                  <li>• יש להשתמש במילה &quot;אתה&quot; ולגרום לתוכן להיות רלוונטי למאזינים.</li>
                </ul>

                <h4 className="text-xl font-semibold text-pink-600 mb-2">4. R - Be Repeatable (להיות ניתן לחזרה):</h4>
                <ul className="space-y-2 text-gray-700 mb-4">
                  <li>• האם המאזין יכול לזכור את הנאמר מספיק כדי לחזור עליו בראשו או לספר אותו לאנשים אחרים?.</li>
                  <li>• כאשר צופים בסרט טוב, אפשר לחזור על כל העלילה בפני מישהו אחר מכיוון שזוכרים אותה וניתן לחזור עליה.</li>
                  <li>• דוגמה: מועמד לעבודה בשם סם, בעל הניסיון המועט ביותר, סיפק סיפור בלתי נשכח על הסיבה שבגללה הגיש מועמדות (שם את כל הביצים בסל אחד, עבר למדינה אחרת, עבד עם יועץ הגירה, וחיפש רק את החברה הזו בשל התמקדותה בקיימות וסביבה).</li>
                  <li>• הדובר יכול היה לחזור על סיפורו של סם בפני המנהלת המגייסת, וזה הוביל לקבלתו לעבודה.</li>
                  <li>• ניתן להפוך דברים לניתנים לחזרה על ידי שימוש בסיפורים, ביטויים, אנלוגיות ומטאפורות, מכיוון שהם קלים לזכירה וחזרה.</li>
                </ul>

                <h4 className="text-xl font-semibold text-pink-600 mb-2">5. E - Emotion (רגש):</h4>
                <ul className="space-y-2 text-gray-700 mb-4">
                  <li>• אם אנשים מרגישים את זה, הם מאמינים בזה.</li>
                  <li>• חוסר רגש עלול לגרום להתנצלות להישמע לא כנה.</li>
                  <li>• דוגמה: חברה בילדות גרמה לדובר לחוש רגש עז של בושה כאשר אמרה שהתחפש לארנב באגס בגלל &quot;שתי שיניו הקדמיות הגדולות והמכוערות&quot;; הדובר זוכר את התחושה הזו, שהייתה כמו &quot;פגיון בלב&quot;, גם עשרות שנים מאחר מכן.</li>
                  <li>• משפט בודד יכול לעורר רגש עז אם הוא &quot;משולב ברגש&quot;.</li>
                  <li>• יש לדבר באופן שמעורר השראה, מניע, מרגש או גורם לאנשים להרגיש משהו.</li>
                </ul>

                <h3 className="text-2xl font-bold text-purple-600 mb-4 mt-8">הוכחת הרעיון בחיים האישיים:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• שנים רבות לאחר המקרה המביך בילדותו, קופאית בסופר שינתה את חייו של הדובר.</li>
                  <li>• הקופאית אמרה לו חמש מילים: &quot;הא, יש לך קול טוב&quot;.</li>
                  <li>• חמש מילים אלה כללו את כל חמשת האלמנטים של SHARE: הן התבלטו, הדגישו משהו חשוב, פנו אליו, היו ניתנות לחזרה (&quot;האם יש לי קול טוב?&quot;), וגרמו לו להרגיש רגש.</li>
                  <li>• הערה זו גרמה לדובר לחשוב האם עליו לדבר יותר ולעשות יותר מצגות.</li>
                  <li>• הדובר מייחס את הצלחתו הנוכחית כנואם מקצועי וכמאמן של מנכ&quot;לים ומנהיגים מצליחים בעולם לאותן חמש מילים.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'video1' && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="aspect-video w-full">
                  <iframe
                    width="560"
                    height="315"
                    src="https://www.youtube.com/embed/BHirkuL7p5o?si=TXqWl4mq1saILpUp"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className="w-full h-full rounded-lg"
                  ></iframe>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'video2' && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="aspect-video w-full">
                  <iframe
                    width="560"
                    height="315"
                    src="https://www.youtube.com/embed/gksrPjA2nY4?si=JnsJy224dct6YnL_"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className="w-full h-full rounded-lg"
                  ></iframe>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'video3' && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="aspect-video w-full">
                  <iframe
                    width="560"
                    height="315"
                    src="https://www.youtube.com/embed/rOwbFY6LT_Y?si=fsIWGCh58nARFWI0"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className="w-full h-full rounded-lg"
                  ></iframe>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}