import { useState } from 'react';

interface Card {
  number: number;
  pokerCard: string;
  name: string;
  place: string;
  object: string;
  powerLaw: string;
}

interface MemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}


export const cards: Card[] = [
 { number: 1, pokerCard: 'A♦️', name: 'אנה', place: 'מזרקה', object: 'צל', powerLaw: 'חוק 1 – "אל תצלח את המאסטר"' },
 { number: 2, pokerCard: 'A♥️', name: 'צ׳יצ׳י', place: 'כיכר הדרקון', object: 'מטבע', powerLaw: 'חוק 2 – "אל תסמוך יותר מידי על חברים, למד לנצל אויבים"' },
 { number: 3, pokerCard: 'A♠️', name: 'גוקו', place: 'קרקס', object: 'מסכה', powerLaw: 'חוק 3 – "הסתר את כוונותיך"' },
 { number: 4, pokerCard: 'A♣️', name: 'יו', place: 'מצפור', object: 'ספר סגור', powerLaw: 'חוק 4 – "אמור פחות ממה שנדרש"' },
 { number: 5, pokerCard: '2♦️', name: 'בובספוג', place: 'חללית', object: 'מדליה', powerLaw: 'חוק 5 – "שמור על שמך – כל תלוי בו"' },
 { number: 6, pokerCard: '2♥️', name: 'קירבי', place: 'מחסן סודי', object: 'לב', powerLaw: 'חוק 6 – "חפש תשומת לב בכל מחיר"' },
 { number: 7, pokerCard: '2♠️', name: 'סליים', place: 'עץ מייפל', object: 'יהלום', powerLaw: 'חוק 7 – "תן לאחרים לעשות את העבודה, אך קח את הכבוד"' },
 { number: 8, pokerCard: '2♣️', name: 'קלאנק', place: 'מוזיאון', object: 'מגנט', powerLaw: 'חוק 8 – "הכרח אחרים להגיע אליך – השתמש בטרפה"' },
 { number: 9, pokerCard: '3♦️', name: 'פיקצ׳ו', place: 'משולש ברמודה', object: 'חרב', powerLaw: 'חוק 9 – "נצח במעשים, לא בוויכוחים"' },
 { number: 10, pokerCard: '3♥️', name: 'פטריק', place: 'שבשבת', object: 'פרח', powerLaw: 'חוק 10 – "הזדהם עם רעים – הימנע מהאחרים"' },
 { number: 11, pokerCard: '3♠️', name: 'פלינט', place: 'מחשב', object: 'שרשרת', powerLaw: 'חוק 11 – "למד לגרום לאנשים להיות תלויים בך"' },
 { number: 12, pokerCard: '3♣️', name: 'סוניק', place: 'בוץ', object: 'מתנת הפתעה', powerLaw: 'חוק 12 – "השתמש בכנות סלקטיבית ובנדיבות כדי לשחרר את יריבך"' },
 { number: 13, pokerCard: '4♦️', name: 'קיוביקס', place: 'קיר סגול', object: 'מפתח', powerLaw: 'חוק 13 – "כשאתה מבקש עזרה, פנה לאינטרס האישי של האחר"' },
 { number: 14, pokerCard: '4♥️', name: 'אגומון', place: 'איגלו', object: 'תבלין', powerLaw: 'חוק 14 – "התבטא כחבר, פעל כמרגל"' },
 { number: 15, pokerCard: '4♠️', name: 'סימבה', place: 'הצדפה', object: 'כותש', powerLaw: 'חוק 15 – "מחץ את אויבך לחלוטין"' },
 { number: 16, pokerCard: '4♣️', name: 'ארטור', place: 'מגדלור', object: 'דלת', powerLaw: 'חוק 16 – "השתמש בהיעדרות כדי להגביר כבוד"' },
 { number: 17, pokerCard: '5♦️', name: 'יוגי', place: 'בית נטוש', object: 'קובייה הונגרית', powerLaw: 'חוק 17 – "השאר אחרים במתח – טיפח אווירת חוסר צפיות"' },
 { number: 18, pokerCard: '5♥️', name: 'אנג', place: 'גבעת הפסל העגל עץ', object: 'גשר', powerLaw: 'חוק 18 – "אל תבנה מבצרים להגן על עצמך – בידוד מסוכן"' },
 { number: 19, pokerCard: '5♠️', name: 'הרקולס', place: 'יוון ליד שד', object: 'זכוכית מגדלת', powerLaw: 'חוק 19 – "דע עם מי אתה מתמודד – אל תעליב את הלא נכון"' },
 { number: 20, pokerCard: '5♣️', name: 'אלאדין', place: 'סוס טרויאני מעופף', object: 'מטוס', powerLaw: 'חוק 20 – "אל תתחייב לאף אחד"' },
 { number: 21, pokerCard: '6♦️', name: 'מיסטי', place: 'מתנה', object: 'שבלול', powerLaw: 'חוק 21 – "שחק כאילו אתה מטופל – תן לעצמך להיראות טיפש"' },
 { number: 22, pokerCard: '6♥️', name: 'פיונה', place: 'ירח', object: 'בועה', powerLaw: 'חוק 22 – "השתמש בטקטיקת כניעה – הפוך חולשה לכוח"' },
 { number: 23, pokerCard: '6♠️', name: 'קטרה', place: 'מגדל הזמן', object: 'לייזר', powerLaw: 'חוק 23 – "רכז את כוחותיך"' },
 { number: 24, pokerCard: '6♣️', name: 'ג׳יין', place: 'יונה בגבהה', object: 'כתר', powerLaw: 'חוק 24 – "שחק את הדיפלומט המושלם"' },
 { number: 25, pokerCard: '7♦️', name: 'מימי', place: 'צוללת חללית', object: 'פלסטלינה', powerLaw: 'חוק 25 – "התחדש – צור את עצמך מחדש"' },
 { number: 26, pokerCard: '7♥️', name: 'אפריל', place: 'חבית', object: 'כפפה לבנה', powerLaw: 'חוק 26 – "שמור על ידיים נקיות"' },
 { number: 27, pokerCard: '7♠️', name: 'וידאל', place: 'מנורת לבה', object: 'נר', powerLaw: 'חוק 27 – "נצל את הצורך להאמין – צור עוקב כמעט דתי"' },
 { number: 28, pokerCard: '7♣️', name: 'בילבי', place: 'שלט דייג', object: 'נשר', powerLaw: 'חוק 28 – "פעל באומץ"' },
 { number: 29, pokerCard: '8♦️', name: 'ספיידרמן', place: 'בקטת הוויקינגים', object: 'תוכנית בניה', powerLaw: 'חוק 29 – "תכנן את כל הדרך עד הסוף"' },
{ number: 30, pokerCard: '8♥️', name: 'סדריק', place: 'מגדל עתידני', object: 'מפל', powerLaw: 'חוק 30 – "הפוך את הישגיך ללא מאמץ"' },
 { number: 31, pokerCard: '8♠️', name: 'ונום', place: 'כיפה אדומה', object: 'שלט', powerLaw: 'חוק 31 – "שלוט באפשרויות – גרום לאחרים לשחק עם הקלפים שלך"' },
 { number: 32, pokerCard: '8♣️', name: 'סקווידוויד', place: 'משאית', object: 'קשת בענן', powerLaw: 'חוק 32 – "שחק על הפנטזיות של אנשים"' },
 { number: 33, pokerCard: '9♦️', name: 'גרפילד', place: 'מדרגות', object: 'פנס', powerLaw: 'חוק 33 – "גלה את נקודת הכאב של כל אדם"' },
 { number: 34, pokerCard: '9♥️', name: 'ראטצט', place: 'מפרס פיראטים', object: 'כיסא מלך', powerLaw: 'חוק 34 – "התנהג במלכותיות – פעל כמו מלך"' },
 { number: 35, pokerCard: '9♠️', name: 'ניינטיילס', place: 'פתית שלג', object: 'שעון חול', powerLaw: 'חוק 35 – "שלוט באמנות התזמון"' },
 { number: 36, pokerCard: '9♣️', name: 'תום', place: 'פעמון', object: 'מדף', powerLaw: 'חוק 36 – "זלזל בדברים שאינך יכול לקבל – התעלם מהם"' },
{ number: 37, pokerCard: '10♦️', name: 'סם', place: 'עוגן', object: 'זיקוקים', powerLaw: 'חוק 37 – "צור מראות מרהיבות"' },
 { number: 38, pokerCard: '10♥️', name: 'צ׳ן', place: 'מלון לאונרדו', object: 'פסל', powerLaw: 'חוק 38 – "חשוב כרצונך אך התנהג כמו כולם"' },
{ number: 39, pokerCard: '10♠️', name: 'בורמה', place: 'כספת', object: 'בלנדר', powerLaw: 'חוק 39 – "ערבב את המים כדי ללכוד את הדגים"' },
 { number: 40, pokerCard: '10♣️', name: 'יסמין', place: 'קקטוס פלאמון', object: 'תג מחיר', powerLaw: 'חוק 40 – "זלזל בארוחה חינם"' },
 { number: 41, pokerCard: 'J♦️', name: 'רן', place: 'גביע האש', object: 'תמונה ציור', powerLaw: 'חוק 41 – "הימנע מלהיכנס לצליים – אל תצעד בעקבות ענקים"' },
 { number: 42, pokerCard: 'J♥️', name: 'שרק', place: 'כדור פורח', object: 'גרזן', powerLaw: 'חוק 42 – "הכה את הרועה והכבשים יתפזרו"' },
 { number: 43, pokerCard: 'J♠️', name: 'אש', place: 'ספסליקו', object: 'מראה', powerLaw: 'חוק 43 – "עבוד על לבם ומוחם של אחרים"' },
 { number: 44, pokerCard: 'J♣️', name: 'טרזן', place: 'מגדל עץ', object: 'פאזל', powerLaw: 'חוק 44 – "נדהם את יריביך עם אפקט המראה"' },
 { number: 45, pokerCard: 'Q♦️', name: 'סאקורה', place: 'מפל מים', object: 'חרסינה שבורה', powerLaw: 'חוק 45 – "הטמע את הצורך בשינוי, אך אל תחדש יותר מידי"' },
 { number: 46, pokerCard: 'Q♥️', name: 'אנדרואיד', place: 'לפיד הטיימרים', object: 'מסילת רכבת', powerLaw: 'חוק 46 – "אל תיראה מושלם מדי"' },
 { number: 47, pokerCard: 'Q♠️', name: 'אריאל', place: 'הר חרמון', object: 'רכב', powerLaw: 'חוק 47 – "אל תעבור את המטרה – למד מתי להפסיק"' },
 { number: 48, pokerCard: 'Q♣️', name: 'בלום', place: 'בתי זיקוק', object: 'טבעת', powerLaw: 'חוק 48 – "התאפס, היה ללא צורה"' },
 { number: 49, pokerCard: 'K♦️', name: 'דונטלו', place: 'פיצריה עגבניה', object: 'רכב', powerLaw: 'חוק 49 – "לשים לב לטייס האוטומטי"' },
 { number: 50, pokerCard: 'K♥️', name: 'שנרון', place: 'מעל מגדל רפונזל', object: 'טבעת', powerLaw: 'חוק 50 – "לקחת הכל בערבון מוגבל - סיפוק הוא מות התשוקה"' },
 { number: 51, pokerCard: 'K♠️', name: 'גוהן', place: 'זירת הקרב של סל', object: 'כוכב', powerLaw: 'חוק 51 – "שמור על העיניים ומה שאתה סופג, אל תיזון אחר עיניך - כוכב קטן הוא שמש"' },
 { number: 52, pokerCard: 'K♣️', name: 'טור', place: 'מגדל האופל', object: 'עץ', powerLaw: 'חוק 52 – "אמן - אימון אמונה היא אומנות - הדבר היחיד שקיים הוא מה שאתה מאמין בו"' },
];

const FieldContainer = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 shadow-sm">
    <div className="text-xs font-semibold text-gray-500 uppercase mb-1">{label}</div>
    <div className="text-sm font-semibold text-gray-800">{value}</div>
  </div>
);

export default function MemoryModal({ isOpen, onClose }: MemoryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">52 חוקים, דמויות, מקומות</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card) => (
              <div
                key={card.number}
                className="border border-gray-300 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow flex flex-col bg-gradient-to-br from-white via-blue-100 to-purple-100"
              >
                {/* Poker Card Header */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-2 flex justify-between items-center">
                  <div className="text-md opacity-90">#{card.number}</div>
                  <div className="font-bold text-lg">{card.pokerCard}</div>
                </div>

                {/* Content - Each field in its own row */}
                <div className="p-3 space-y-2 flex-grow">
                  <FieldContainer label="שם" value={card.name} />
                  <FieldContainer label="מקום" value={card.place} />
                  <FieldContainer label="חפץ" value={card.object} />
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 shadow-sm">
                    <div className="text-xs font-semibold text-blue-600 uppercase mb-1">חוק</div>
                    <div className="text-xs font-semibold text-blue-900">{card.powerLaw}</div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-2 flex justify-between items-center">
                  <div className="font-bold text-lg">{card.pokerCard}</div>
                  <div className="text-md opacity-90">#{card.number}</div>
                </div>
              </div>
              
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}