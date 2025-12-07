import { useState } from 'react';

interface StorytellingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ModuleItem {
  number: number;
  title: string;
  description: string;
  details?: string[];
}

const storytellingParts = [
  {
    part: 1,
    title: 'יסודות הסיפור הבסיסיים',
    modules: [
      { number: 1, title: 'הסיטואציה', description: 'תיאור הרקע והמצב ההתחלתי של הסיפור', details: [] as string[] },
      { number: 2, title: 'הרצון', description: 'המטרה או הצורך המניע את הסיפור', details: [] as string[] },
      { number: 3, title: 'הקונפליקט', description: 'המכשול או המתח המקשה על השגת הרצון', details: [] as string[] },
      { number: 4, title: 'השינוי', description: 'נקודת מפנה שמשנה את הכל (תובנה או פעולה)', details: [] as string[] },
      { number: 5, title: 'התוצאה', description: 'המציאות החדשה והסיום, המראה כיצד העולם שונה', details: [] as string[] },
      {
        number: 6,
        title: 'דוגמה 1: מלך האריות (The Lion King)',
        description: 'פירוק סרט הוליוודי בחמישה קווים - המדגים כיצד סיפור מורכב מאוד ניתן לצמצם לליבה הרגשית שלו.',
        details: [
          '1. הסיטואציה: סימבה הוא נסיך צעיר, נרגש לקראת היום שבו ימלוך על אדמות הגאווה.',
          '2. הרצון: הוא רוצה להוכיח שהוא אמיץ וראוי להיות מלך.',
          '3. הקונפליקט: לאחר מות אביו, סימבה בורח, מתבייש וחושש להתמודד עם עברו.',
          '4. השינוי: סימבה גדל, ובעזרת חבריו וחזון מאביו, הוא חוזר להתעמת עם סקאר ולתפוס את מקומו כמלך.',
          '5. התוצאה: הוא משיב את האיזון לאדמות הגאווה ונכנס במלואו לתפקיד של מי שנועד להיות.',
          'הערה: למרות שפרטים רבים חסרים כדי להעשיר את הסיפור, חמשת הקווים תופסים את הסיפור כולו.'
        ]
      },
      {
        number: 7,
        title: 'דוגמה 2: סרטון יוטיוב אישי',
        description: 'יצירת סיפור אישי באמצעות חמישה קווים - המדגים כיצד סרטון בן 8+ דקות מצטמצם לחמישה קווים בלבד.',
        details: [
          '1. הסיטואציה: אני יוצר סרטים מהולנד ותמיד אהבתי ליצור סרטונים מאז שהייתי ילד.',
          '2. הרצון: החלום שלי היה להיות יוטיובר ולשתף סיפורים מהלב, ולא רק עבור לקוחות.',
          '3. הקונפליקט: בכל פעם שניסיתי להתחיל, ספק עצמי וחשיבת יתר משכו אותי לאחור.',
          '4. השינוי: כאשר ויתרתי על חלום היוטיוב הגדול, הבנתי שאני מתמקד בסיבות הלא נכונות ורציתי פשוט ליצור ולחלוק סיפורים.',
          '5. התוצאה: התיישבתי והתחלתי, והצעד הראשון זה דחף אותי "ללכת עד הסוף" במסע היוטיוב הזה.',
          'הדגמת הרחבה: ניתן להרחיב את חמשת הקווים לעשרה קווים להוסיף עושר ופרטים, אך ליבת הסיפור אינה משתנה.'
        ]
      },
      {
        number: 8,
        title: 'אנקדוטת הקשיים טרם השיטה (הרקע לשימושיות)',
        description: 'האנקדוטה החשובה ביותר המסבירה מדוע שיטת חמשת הקווים היא כל כך שימושית ומאירת.',
        details: [
          'הבעיה הקודמת: בזבוז שעות בניסיון לתכנן סרטון, אך עדיין לא ברור מה הסיפור הוא מנסה להגיד.',
          'התוצאה: הוא היה מכין מתווה, כותב מחדש, זורק ומתחיל מחדש - או צולם בתקווה להבין במהלך העריכה.',
          'הסכנה: "ציר זמן מבולגן" ללא מושג מה הסיפור אמור להיות, עקב "חשיבה יתר" והלוכדות בפרטים.',
          'הפתרון: כשהחל להשתמש בשיטה "טיפשית כל כך ופשוטה" - חמשת הקווים - כל סיפור "הסתדר" בבת אחת.',
          'הכוח: חמשת הקווים עוזרים לראות את הסיפור כולו לפני שמתחילים להיות מוסחים על ידי ציוד, עריכה או קריינות.',
          'היישום: התייחסו לחמשת הקווים בכל שלב בפרויקט, במיוחד כאשר הוא הופך למכריע, כדי לוודא שכל המרכיבים עדיין מתחברים לאחד מחמשת הקווים.'
        ]
      }
    ]
  },
  {
    part: 2,
    title: 'אלמנטים מתקדמים של סיפור',
    modules: [
      {
        number: 1,
        title: 'הריקוד (The Dance)',
        description: 'זהו ריקוד מתמיד בין הקשר (Context) לבין קונפליקט. כל סיפור נהדר הוא כמו ריקוד זה. אתם נותנים מעט הקשר (הדמות במשימה), ואז מופיע קונפליקט ("או, הו לא"). לאחר פתרון הקונפליקט הראשון, ניתן עוד קצת הקשר, ואז מגיע קונפליקט נוסף. ריקוד זה שומר על הצופה נעול בסיפור.',
        details: [
          'מנגנון פסיכולוגי: קונפליקטים יוצרים לולאות פתוחות במוח, וההקשר מסייע לסגור לולאות אלו.',
          'יישום טקטי: השתמשו באופן עקבי במילים "אבל" ו"לכן" (therefore) בין כל \'מכה\' (Beat) בעלילה, במקום להשתמש ב"ואז" (and then).'
        ]
      },
      {
        number: 2,
        title: 'קצב (Rhythm)',
        description: 'קצב ופעימה תת-מודעים וטבעיים שמרגיעים את המוח (כמו "גאות ושפל טבעיים"). כאשר כל המשפטים הם באותו אורך, זה יוצר מונוטוניות וצפויוּת, שבאופן תת-מודע מרחיקים אנשים.',
        details: [
          'יישום טקטי: כיתבו עם שילוב של משפטים קצרים, בינוניים וארוכים. המטרה היא ליצור צליל שנעים לאוזנו של הקורא.',
          'ניתן לבדוק זאת על ידי כתיבת כל משפט בשורה נפרדת בתסריט; אם המסמך נראה עם קצה משונן (Jagged Edge) כשמסתכלים עליו מלמעלה למטה, זה מאשר שמשתמשים באורכי משפטים מגוונים.'
        ]
      },
      {
        number: 3,
        title: 'טון (Tone)',
        description: 'טון שיחתי (Conversational Tone) שיוצר תחושה כאילו הצופה נמצא ממש בחדר עם היוצר. טון שיחתי שובר את המחסום המודע של הזהות האישית.',
        details: [
          'יישום טקטי: כיתבו וצלמו את הסרטונים כאילו אתם מדברים עם חבר קרוב אחד.',
          'אפשר להדפיס תמונה של אותו חבר ולהדביק אותה מתחת לעדשת המצלמה, או לכתוב את התסריט כאילו מדובר בהודעת טקסט או בהקלטת אודיו המופנית ישירות אליו.'
        ]
      },
      {
        number: 4,
        title: 'כיוון (Direction)',
        description: 'הדרך הטובה ביותר להתחיל בכתיבת סיפור היא דווקא בסוף שלו, ואז לעבוד לאחור. צריך להבין לאן רוצים לקחת את הצופה, ומה הדבר האחרון שרוצים שהוא ישמע.',
        details: [
          'חשיבות בוידאו קצר: בסרטוני וידאו קצרים המיועדים ללופ, השורה האחרונה היא למעשה הכנה לשורות הראשונות כשהסרטון מתנגן מחדש.',
          'יישום טקטי: כתבו את השורה הראשונה והאחרונה בתסריט, צרו רווח גדול ביניהן, ואז מלאו את החלק האמצעי.'
        ]
      },
      {
        number: 5,
        title: 'עדשות סיפור (Story Lenses)',
        description: 'הזווית הייחודית או ה"ספין" שלכם על סיפור מסוים. זהו ה"טביעת אצבע הייחודית" שלכם לאופן שבו אתם מספרים את הסיפור.',
        details: [
          'בעידן הנוכחי, מציאת נושא מגניב אינה מספיקה כשלעצמה, שכן סביר להניח שיש עשרות אנשים אחרים המדברים על אותו נושא.',
          'עדשת הסיפור מבדלת את התוכן שלכם. דמיינו קרן אור חשופה (הנושא) שכולם רואים באותו אופן.',
          'יישום טקטי: בחרו עדשה שהיא פחות נפוצה. לדוגמה, במקום לדבר על מה שאישה לבשה במשחק ספורט, ניתן לבחור לדבר על ההשפעה העסקית שהיא יצרה על ליגת הספורט.'
        ]
      },
      {
        number: 6,
        title: 'ההוק (The Hook - הוו)',
        description: 'השורה או הרגע הראשונים של הסרטון שנועדו לתפוס את הצופה באופן מיידי. ההוק הוא קריטי, כיוון שאם אנשים עוזבים בשלב זה, שאר הדברים שדוברו עליהם אינם משנים.',
        details: [
          'יישום טקטי מילולי: השורה הראשונה צריכה להיות קולעת ככל האפשר ומעידה על העלילה.',
          'יישום טקטי חזותי: הוקים ויזואליים יעילים פי 10 מהוקים המבוססים על אודיו בלבד. הצג בזמן שאתה מספר (Show while you tell).'
        ]
      }
    ]
  },
  {
    part: 3,
    title: 'סיפור פונקציונלי והורמונים',
    modules: [
      {
        number: 1,
        title: 'מחקר "החפץ המשמעותי" (Significant Object Study)',
        description: 'אנקדוטה שמטרתה להוכיח את כוחו העצום של הסיפור כאמצעי החזק ביותר. הזמן והיוזם: 2009, העיתונאי רוב ווקר.',
        details: [
          'הניסוי: ווקר רכש 200 חפצים מ-eBay. המחיר הממוצע לחפץ היה כדולר אחד.',
          'עלות כוללת: רכישת 200 החפצים עלתה בסך הכל 129 דולר.',
          'מכירה כוללת: החפצים נמכרו בסך הכל תמורת 8,000 דולר.',
          'דוגמה ספציפית: ראש סוס יפהפה. נרכש ב-99 סנט. נמכר לאחר הוספת הסיפור ב-$62.95.',
          'העלייה באחוזים: עלייה קלה של 6395%.',
          'מתי להשתמש: כאשר יש צורך להוכיח באופן מובהק את ערך הסיפור או כוחה של ההשקעה הרגשית.'
        ]
      },
      {
        number: 2,
        title: 'אנקדוטת ג\'יימס בונד והשעון (השקעה רגשית)',
        description: 'דוגמה שמטרתה להסביר כיצד סיפורים "מרמים" אותנו, ומדוע אנו מוכנים להשקיע סכומי כסף עצומים בדברים לא מציאותיים.',
        details: [
          'התופעה: אנשים משלמים כסף טוב כדי לצפות בסרטים כמו ג\'יימס בונד, שהם אבסולוטית לא מציאותיים.',
          'ההשלכה: אנשים רוצים להיות יותר כמו בונד (ללכת ולדבר כמוהו).',
          'העלות האישית: אדם מוכן לשלם 10,000 דולר כדי לשים על פרק ידו שעון אומגה הדומה לזה שבונד ענד.',
          'הנתון הכלכלי (PQ Media): 10.5 מיליארד דולר מופעלים כהכנסות ממיקום מוצר מדי שנה.',
          'הטיפ המקצועי: ככל שאתה מושקע רגשית יותר, אתה הופך לפחות ביקורתי ופחות אובייקטיבי.',
          'מתי להשתמש: כדי להסביר את כוחה של ההשקעה הרגשית ואת הקשר שלה לקבלת החלטות.'
        ]
      },
      {
        number: 3,
        title: 'אנקדוטת הפגישה הגרועה (דופמין)',
        description: 'סיפור אישי זה משמש כדי להגביר באופן קיצוני את רמות הדופמין במוח הקהל. ההורמון המיועד: דופמין.',
        details: [
          'הזמן והנסיבות: לפני כשש שנים. קיבל שיחת טלפון מחברה המייצגת אחת מחברות ההדרכה הגדולות בסקנדינביה.',
          'האתגר: הגיע לפגישה בסטוקהולם. ליאנה אמרה לו שהוא לא נפגש איתה אלא עם שלושה ג\'נטלמנים שהם בעלי רוב בחברה.',
          'המידע הקריטי: הג\'נטלמנים הם בעלי רקע צבאי לשעבר, ואף אחד מהם לא רוצה את ההכשרה.',
          'השפעות הדופמין: יותר מיקוד, יותר מוטיבציה וזכירת דברים בצורה טובה יותר.',
          'הטיפ המקצועי: בניית מתח (suspense) ושיגור קליף-האנגר (cliffhanger).',
          'מתי להשתמש: כאשר רוצים להגביר את הקשב והמיקוד של הקהל, במיוחד בהתחלה.'
        ]
      },
      {
        number: 4,
        title: 'אנקדוטת הלידה הקיסרית המתוכננת (אוקסיטוצין)',
        description: 'סיפור אישי קשה זה משמש כדי לעורר רמות גבוהות של אוקסיטוצין. ההורמון המיועד: אוקסיטוצין.',
        details: [
          'הנסיבות: לפני תשע שנים. מדובר בלידה קיסרית מתוכננת לאחר תשעה חודשים.',
          'המעורבים: הילד הגדול, בן 5, ציפה בהתרגשות להיות אח גדול.',
          'האירוע: יומיים לפני הניתוח המתוכנן, משהו לא הרגיש כשורה. יום לפני כן, לא הייתה תנועה או דופק בבטן.',
          'התוצאה: ההורים מיהרו לבית החולים. הרופא אישר שהלב הפסיק לפעום.',
          'השפעות האוקסיטוצין: הופכים לנדיבים יותר, בוטחים יותר בדובר ומתחברים אליו.',
          'הטיפ המקצועי: בסיפורים, עליך ליצור אמפתיה (empathy) לדמות או לסיטואציה.',
          'מתי להשתמש: כאשר רוצים ליצור חיבור, אמון וקרבה עם הקהל.'
        ]
      },
      {
        number: 5,
        title: 'אנקדוטת סרטון החתונה (אנדורפין)',
        description: 'דוגמה זו משמשת כדי לעורר צחוק ובכך לשחרר אנדורפינים. ההורמון המיועד: אנדורפין.',
        details: [
          'האירוע: סרטון המציג אישה צוחקת ללא שליטה במהלך טקס חתונתה כשהיא חוזרת על דברי הכומר.',
          'השפעות האנדורפין: הקהל הופך ליותר יצירתי, יותר נינוח ויותר ממוקד.',
          'הטיפ המקצועי: גרום לאנשים לצחוק.',
          'המבנה: שימוש בהומור, אפילו הומור "נמוך" כדי לעורר תגובה פיזית של צחוק.',
          'מתי להשתמש: כאשר יש צורך להפחית מתח או לשפר את יכולות היצירתיות והקשב של הקהל.'
        ]
      },
      {
        number: 6,
        title: 'סיכום: סיפור פונקציונלי וקוקטייל המלאכים',
        description: 'הטיפ המקצועי המרכזי הוא השימוש ב"סיפור פונקציונלי" (Functional Storytelling) כדי לעורר תגובה הורמונלית ספציפית.',
        details: [
          'הבנה בסיסית: אינך צריך להיות זקן מזוקן ליד האח עם קול עמוק כדי להיות מסַפר סיפורים נהדר.',
          'כתיבה: כתוב את הסיפורים שלך; תגלה שיש לך פי שלושה עד ארבעה יותר סיפורים ממה שחשבת.',
          'אינדוקס: מַפְתֵּחַ את הסיפורים על פי ההורמון שהם יוצרים (צחוק = אנדורפינים; אמפתיה = אוקסיטוצין).',
          'שימוש ממוקד: בחר את הסיפור המתאים כדי לשחרר את ההורמון הרצוי.',
          'קוקטייל המלאכים: דופמין, אוקסיטוצין, אנדורפינים להתמודדות מול קוקטייל השטן (קורטיזול ואדרנלין).',
          'מטאפורה: אם הסיפורים הם המטבע החדש של תקשורת, אז ההורמונים הם שער החליפין.'
        ]
      }
    ]
  }
];

const FieldContainer = ({ label, value, details }: { label: string; value: string; details?: string[] }) => (
  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
    <div className="text-sm font-semibold text-gray-500 uppercase mb-2">{label}</div>
    <div className="text-sm font-semibold text-gray-800 mb-3">{value}</div>
    {details && details.length > 0 && (
      <div className="space-y-2">
        {details.map((detail, index) => (
          <div key={index} className="text-xs text-gray-600 bg-white p-2 rounded border-l-2 border-blue-200">
            • {detail}
          </div>
        ))}
      </div>
    )}
  </div>
);

export default function StorytellingModal({ isOpen, onClose }: StorytellingModalProps) {
  const [activePart, setActivePart] = useState(1);
  const [activeTab, setActiveTab] = useState<'content' | 'dopamine'>('content');

  if (!isOpen) return null;

  const currentPart = storytellingParts.find(part => part.part === activePart);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Storytelling - מודול סיפור מתקדם</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
          
          {/* Main Tabs */}
          <div className="flex gap-2 mt-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('content')}
              className={`px-6 py-3 font-semibold transition-all ${
                activeTab === 'content'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              תוכן סיפור
            </button>
            <button
              onClick={() => setActiveTab('dopamine')}
              className={`px-6 py-3 font-semibold transition-all ${
                activeTab === 'dopamine'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              סולם הדופמין
            </button>
          </div>

          {activeTab === 'content' && (
            <div className="flex gap-2 mt-4">
              {storytellingParts.map((part) => (
                <button
                  key={part.part}
                  onClick={() => setActivePart(part.part)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activePart === part.part
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  חלק {part.part}: {part.title}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">{activeTab === 'content' ? (
          <>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{currentPart?.title}</h3>
              <p className="text-gray-600">לחץ על כל מודול לפרטים נוספים</p>
            </div>

          {activePart === 1 && (
            <div className="mb-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-lg font-bold text-blue-800 mb-3">🎥 סרטון הדרכה: יסודות הסיפור בחמישה קווים</h4>
                <div className="aspect-video w-full max-w-2xl mx-auto">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/NeTJRCycYXQ?si=8VHMBrehMHrBZ5lT"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className="rounded-lg"
                  ></iframe>
                </div>
                <p className="text-sm text-blue-600 mt-2 text-center">
                  צפה בסרטון זה ללמידה על מבנה חמשת הקווים הבסיסי של הסיפור
                </p>
              </div>
            </div>
          )}

          {activePart === 2 && (
            <div className="mb-6">
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg p-4">
                <h4 className="text-lg font-bold text-red-800 mb-3">🎥 סרטון הדרכה: Storytelling מתקדם</h4>
                <div className="aspect-video w-full max-w-2xl mx-auto">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/t5Z-Q1bg1tU?si=DvIT5I0lmyqg3J-z"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className="rounded-lg"
                  ></iframe>
                </div>
                <p className="text-sm text-red-600 mt-2 text-center">
                  צפה בסרטון זה ללמידה מעמיקה על טכניקות סיפור מתקדמות
                </p>
              </div>
            </div>
          )}

          {activePart === 3 && (
            <div className="mb-6">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                <h4 className="text-lg font-bold text-green-800 mb-3">🎥 סרטון הדרכה: סיפור פונקציונלי והורמונים</h4>
                <div className="aspect-video w-full max-w-2xl mx-auto">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/Nj-hdQMa3uA?si=41ljYUJXdj_a3jug"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className="rounded-lg"
                  ></iframe>
                </div>
                <p className="text-sm text-green-600 mt-2 text-center">
                  צפה בסרטון זה ללמידה על סיפור פונקציונלי והשפעת ההורמונים
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            {currentPart?.modules.map((module) => (
              <div
                key={module.number}
                className="border border-gray-300 rounded-lg overflow-hidden shadow-md flex flex-col bg-gradient-to-br from-white via-blue-100 to-purple-100"
              >
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-3 flex justify-between items-center">
                  <div className="text-lg font-bold">#{module.number}</div>
                  <div className="text-lg font-bold">{module.title}</div>
                </div>
                <div className="p-4">
                  <FieldContainer
                    label="תיאור"
                    value={module.description}
                    details={module.details}
                  />
                </div>
              </div>
            ))}
          </div>
          </>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">🧠</div>
              <h3 className="text-3xl font-bold text-blue-600 mb-4">סולם הדופמין</h3>
            </div>

            {/* Video */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
              <div className="aspect-video w-full max-w-2xl mx-auto">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/jtmstMt4WLc"
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
            <div className="bg-blue-50 p-6 rounded-xl">
              <p className="text-lg text-gray-800 leading-relaxed">
                מסגרת &quot;סולם הדופמין&quot; היא טכניקה שנועדה לגרום לצופים להתמכר לצפייה בתוכן על ידי שחרור כמויות הולכות וגדלות של דופמין במהלך צפייתם. אם משתמש התוכן מצליח להעביר את הצופה בהצלחה דרך כל ששת השלבים של הסולם, הצופה ישלים את הצפייה בסרטון וירצה לחזור לצפות בתוכן נוסף.
              </p>
            </div>

            {/* Steps */}
            <div className="space-y-4">
              <div className="bg-white border border-blue-200 rounded-lg p-5">
                <h4 className="text-xl font-bold text-blue-600 mb-3">1. גירוי (Stimulation)</h4>
                <p className="text-gray-700 mb-2">
                  השלב הראשון והקצר ביותר בסולם הדופמין, המתרחש בתוך שנייה עד שתיים הראשונות של הסרטון.
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1 mr-4">
                  <li>שימוש בצבעים, תנועה ובהירות לגרום למישהו לעצור ולהתמקד</li>
                  <li>עיבוד &quot;מלמטה למעלה&quot; - תהליך תת-מודע ומהיר מאוד</li>
                  <li>שחרור דופמין חלש אך חיוני כמבשר לשלבים הבאים</li>
                </ul>
              </div>

              <div className="bg-white border border-purple-200 rounded-lg p-5">
                <h4 className="text-xl font-bold text-purple-600 mb-3">2. שבייה (Captivation)</h4>
                <p className="text-gray-700 mb-2">
                  שלב הסקרנות - הסרטון מוביל לשאלה פתוחה שהצופה שואל בראשו, ויוצר &quot;לולאת סקרנות&quot;.
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1 mr-4">
                  <li>המוח האנושי הוא מכונת פתרון בעיות</li>
                  <li>שאלות מורכבות ורלוונטיות משחררות דופמין</li>
                  <li>שימוש בניגודיות או הנחת יסוד מטלטלת</li>
                </ul>
              </div>

              <div className="bg-white border border-pink-200 rounded-lg p-5">
                <h4 className="text-xl font-bold text-pink-600 mb-3">3. צפייה מוקדמת (Anticipation)</h4>
                <p className="text-gray-700 mb-2">
                  הצופה מתחיל לנחש בראשו מה עשויה להיות התשובה לשאלה שהוצגה בשלב 2.
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1 mr-4">
                  <li>&quot;בלשנות תת-מודעת&quot; המתנהלת בזמן אמת</li>
                  <li>רמת הדופמין הגבוהה ביותר רגע לפני חשיפת התשובה</li>
                  <li>בניית מתח וסקרנות באמצעות פרטים ברורים</li>
                </ul>
              </div>

              <div className="bg-white border border-indigo-200 rounded-lg p-5">
                <h4 className="text-xl font-bold text-indigo-600 mb-3">4. אימות (Validation)</h4>
                <p className="text-gray-700 mb-2">
                  מתן התשובה לשאלה שנשאלה בשלב 2 - סגירת הלולאה.
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1 mr-4">
                  <li>תגמול הצופה בתשובה לא ברורה מאליה או בלתי צפויה</li>
                  <li>בתוכן בידורי: פתרון העלילה</li>
                  <li>בתוכן חינוכי: טיפ או המלצה בעלי ערך קונקרטי</li>
                </ul>
              </div>

              <div className="bg-white border border-emerald-200 rounded-lg p-5">
                <h4 className="text-xl font-bold text-emerald-600 mb-3">5. חיבה (Affection)</h4>
                <p className="text-gray-700 mb-2">
                  עלייה מעבר לסיפור האישי והתמקדות ביוצר עצמו - &quot;השליח&quot;.
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1 mr-4">
                  <li>הצופה מתחיל לחבב ולבטוח ביוצר</li>
                  <li>ארבע דרכים: אטרקטיביות, אווירה כללית, חיוך, פתרון בעיות</li>
                  <li>תוכן ללא פנים מתקשה להגיע לפסגה הפבלוביאנית</li>
                </ul>
              </div>

              <div className="bg-white border border-orange-200 rounded-lg p-5">
                <h4 className="text-xl font-bold text-orange-600 mb-3">6. גילוי (Revelation)</h4>
                <p className="text-gray-700 mb-2">
                  השלב האחרון שבו תגובת פבלוב מתחילה באמת.
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1 mr-4">
                  <li>הצופה מגיע להכרה שהיוצר הוא מקור קבוע ומתמשך לערך</li>
                  <li>ראיית היוצר משחררת דופמין מקסימלי</li>
                  <li>הצופה &quot;מנצח&quot; את משחק הקשב</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-6 rounded-xl">
              <h4 className="font-bold text-blue-800 mb-2">🎯 המטרה האולטימטיבית:</h4>
              <p className="text-blue-700">
                יצירת &quot;אפקט פבלוביאני&quot; – מצב שבו ראיית שם היוצר או פניו בלבד משחררת דופמין במוחו של הצופה, והופכת אותו ל&quot;סופר מעריץ&quot; שיצפה בכל מה שהיוצר מייצר.
              </p>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}