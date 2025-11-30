import { useState } from 'react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Characteristic {
  hebrew: string;
  english: string;
  rating: number;
}

const profileTypes = [
  // מנהיג combinations
  { 
    zodiac: 'מנהיג', 
    style: 'מסתער', 
    name: 'מנהיג-מסתער: הקיסר הסוער', 
    description: 'מנהיג כריזמטי ותקיף שמוביל בהתלהבות ומהירות. שולט בסיטואציות עם אנרגיה בלתי ניתנת לעצירה, מושך אנשים בעוצמתו אך עלול להיות דומיננטי מדי.' 
  },
  { 
    zodiac: 'מנהיג', 
    style: 'מוכיח', 
    name: 'מנהיג-מוכיח: השליט החכם', 
    description: 'מנהיג מחושב ומדויק שמוביל בהיגיון ובסבלנות. בונה אימפריות עם תכנון קפדני, מעריך צדק ואמת, אך עלול להיות נוקשה מדי בדרישותיו.' 
  },
  { 
    zodiac: 'מנהיג', 
    style: 'בזק', 
    name: 'מנהיג-בזק: החזון המהיר', 
    description: 'מנהיג חדשני ויצירתי שרואה הזדמנויות לפני כולם. מוביל שינויים מהירים עם רעיונות מבריקים, אך עלול להתעייף מהר מהקצב.' 
  },
  { 
    zodiac: 'מנהיג', 
    style: 'חכם שקט', 
    name: 'מנהיג-שקט: המנטור העמוק', 
    description: 'מנהיג רגוע וחכם שמוביל בדוגמה אישית. בונה נאמנות ארוכת טווח דרך ידע והבנה עמוקה, אך עלול להיות מרוחק מדי.' 
  },
  
  // מאיר combinations
  { 
    zodiac: 'מאיר', 
    style: 'מסתער', 
    name: 'מאיר-מסתער: האור הסוער', 
    description: 'מאיר אנרגטי שמביא השראה בהתלהבות. מפיץ אור וחיוביות בעוצמה, מושך אנשים בחום שלו אך עלול להיות מתיש.' 
  },
  { 
    zodiac: 'מאיר', 
    style: 'מוכיח', 
    name: 'מאיר-מוכיח: המורה הצודק', 
    description: 'מאיר מתון שמלמד בחכמה ובסבלנות. בונה ידע עם דיוק והיגיון, יוצר תלמידים נאמנים אך עלול להיות ביקורתי מדי.' 
  },
  { 
    zodiac: 'מאיר', 
    style: 'בזק', 
    name: 'מאיר-בזק: ההשראה המהירה', 
    description: 'מאיר יצירתי שמביא רעיונות מבריקים. מעורר השראה בקצב מהיר, מושך חדשנים אך עלול להיות לא יציב.' 
  },
  { 
    zodiac: 'מאיר', 
    style: 'חכם שקט', 
    name: 'מאיר-שקט: הפילוסוף השליו', 
    description: 'מאיר עמוק שמשתף חכמה ברוגע. בונה הבנה עם התבוננות, יוצר חיבור עמוק אך עלול להיות מופשט מדי.' 
  },
  
  // קדוש combinations
  { 
    zodiac: 'קדוש', 
    style: 'מסתער', 
    name: 'קדוש-מסתער: הנביא הלוהט', 
    description: 'קדוש נלהב שמוביל ברוחניות בעוצמה. מביא מסרים אלוהיים בהתלהבות, מושך מאמינים אך עלול להיות אינטנסיבי מדי.' 
  },
  { 
    zodiac: 'קדוש', 
    style: 'מוכיח', 
    name: 'קדוש-מוכיח: הכוהן הצודק', 
    description: 'קדוש מסור ששומר על עקרונות. מוביל בקדושה עם דיוק מוסרי, בונה קהילות חזקות אך עלול להיות שיפוטי.' 
  },
  { 
    zodiac: 'קדוש', 
    style: 'בזק', 
    name: 'קדוש-בזק: המיסטיקן המהיר', 
    description: 'קדוש רוחני שמביא תובנות מהירות. מגלה סודות רוחניים בקצב, מושך מתעניינים אך עלול להיות לא מעמיק.' 
  },
  { 
    zodiac: 'קדוש', 
    style: 'חכם שקט', 
    name: 'קדוש-שקט: הנזיר החכם', 
    description: 'קדוש עמוק שחי ברוחניות שלווה. בונה קשר עם האלוהי ברוגע, יוצר השראה פנימית אך עלול להיות מנותק.' 
  },
  
  // לוחם combinations
  { 
    zodiac: 'לוחם', 
    style: 'מסתער', 
    name: 'לוחם-מסתער: הגלדיאטור הסוער', 
    description: 'לוחם אגרסיבי שמתמודד בעוצמה. נלחם למען צדק בהתלהבות, מושך לוחמים אך עלול להיות אלים מדי.' 
  },
  { 
    zodiac: 'לוחם', 
    style: 'מוכיח', 
    name: 'לוחם-מוכיח: האביר הצודק', 
    description: 'לוחם מתון שמתמודד בחכמה. מגן על החלשים בהיגיון, בונה כבוד אך עלול להיות נוקשה.' 
  },
  { 
    zodiac: 'לוחם', 
    style: 'בזק', 
    name: 'לוחם-בזק: הנינג׳ה המהיר', 
    description: 'לוחם חכם שפועל במהירות. מתמודד עם תחכום וקצב, מושך אסטרטגים אך עלול להיות חמקמק.' 
  },
  { 
    zodiac: 'לוחם', 
    style: 'חכם שקט', 
    name: 'לוחם-שקט: הסמוראי החכם', 
    description: 'לוחם מאוזן שמתמודד בחן. מגן ברוגע ובחכמה, יוצר הרמוניה אך עלול להיות פסיבי.' 
  },
  
  // שומר combinations
  { 
    zodiac: 'שומר', 
    style: 'מסתער', 
    name: 'שומר-מסתער: השומר הסוער', 
    description: 'שומר מגן שפועל בעוצמה. מגן על מה שיקר לו בהתלהבות, מושך מגנים אך עלול להיות מגונן מדי.' 
  },
  { 
    zodiac: 'שומר', 
    style: 'מוכיח', 
    name: 'שומר-מוכיח: השומר הצודק', 
    description: 'שומר אחראי ששומר בסבלנות. מגן על ערכים בהיגיון, בונה אמון אך עלול להיות חשדן.' 
  },
  { 
    zodiac: 'שומר', 
    style: 'בזק', 
    name: 'שומר-בזק: השומר המהיר', 
    description: 'שומר חכם שמגיב במהירות. מגן עם תחכום וקצב, מושך שומרים אך עלול להיות מתוח.' 
  },
  { 
    zodiac: 'שומר', 
    style: 'חכם שקט', 
    name: 'שומר-שקט: השומר השליו', 
    description: 'שומר רגוע ששומר ברוגע. מגן בעדינות ובחכמה, יוצר ביטחון אך עלול להיות רדום.' 
  },
  
  // עבד combinations
  { 
    zodiac: 'עבד', 
    style: 'מסתער', 
    name: 'עבד-מסתער: המשרת הנלהב', 
    description: 'עבד מסור שמשרת בעוצמה. נותן מעצמו בהתלהבות, מושך אדונים אך עלול להיות מתיש.' 
  },
  { 
    zodiac: 'עבד', 
    style: 'מוכיח', 
    name: 'עבד-מוכיח: המשרת הצודק', 
    description: 'עבד אמין שמשרת בהיגיון. נותן שירות עם דיוק, בונה נאמנות אך עלול להיות תובעני.' 
  },
  { 
    zodiac: 'עבד', 
    style: 'בזק', 
    name: 'עבד-בזק: המשרת המהיר', 
    description: 'עבד יעיל שמשרת במהירות. מספק שירות עם תחכום, מושך מעסיקים אך עלול להיות לחוץ.' 
  },
  { 
    zodiac: 'עבד', 
    style: 'חכם שקט', 
    name: 'עבד-שקט: המשרת השליו', 
    description: 'עבד רגוע שמשרת בחן. נותן שירות ברוגע, יוצר הרמוניה אך עלול להיות פסיבי.' 
  },
  
  // שליט combinations
  { 
    zodiac: 'שליט', 
    style: 'מסתער', 
    name: 'שליט-מסתער: הקיסר הסוער', 
    description: 'שליט דומיננטי שמושל בעוצמה. שולט בהתלהבות ותקיפות, מושך נתינים אך עלול להיות עריץ.' 
  },
  { 
    zodiac: 'שליט', 
    style: 'מוכיח', 
    name: 'שליט-מוכיח: המלך הצודק', 
    description: 'שליט הוגן שמושל בהיגיון. שולט עם צדק וסבלנות, בונה ממלכה אך עלול להיות נוקשה.' 
  },
  { 
    zodiac: 'שליט', 
    style: 'בזק', 
    name: 'שליט-בזק: הקיסר המהיר', 
    description: 'שליט חכם שמושל במהירות. שולט עם תחכום וקצב, מושך יועצים אך עלול להיות בלתי צפוי.' 
  },
  { 
    zodiac: 'שליט', 
    style: 'חכם שקט', 
    name: 'שליט-שקט: הפילוסוף המלך', 
    description: 'שליט עמוק שמושל בחכמה. שולט ברוגע ובתובנה, יוצר חוכמה אך עלול להיות מרוחק.' 
  },
  
  // מעשי combinations
  { 
    zodiac: 'מעשי', 
    style: 'מסתער', 
    name: 'מעשי-מסתער: הבנאי הסוער', 
    description: 'מעשי אנרגטי שיוצר בעוצמה. בונה פרויקטים בהתלהבות, מושך שותפים אך עלול להיות כאוטי.' 
  },
  { 
    zodiac: 'מעשי', 
    style: 'מוכיח', 
    name: 'מעשי-מוכיח: המהנדס הצודק', 
    description: 'מעשי מדויק שיוצר בהיגיון. בונה עם תכנון ודיוק, יוצר איכות אך עלול להיות איטי.' 
  },
  { 
    zodiac: 'מעשי', 
    style: 'בזק', 
    name: 'מעשי-בזק: הממציא המהיר', 
    description: 'מעשי יצירתי שיוצר במהירות. בונה רעיונות חדשים בקצב, מושך חדשנים אך עלול להיות לא מושלם.' 
  },
  { 
    zodiac: 'מעשי', 
    style: 'חכם שקט', 
    name: 'מעשי-שקט: האומן השליו', 
    description: 'מעשי עמוק שיוצר בחן. בונה עם הבנה והתבוננות, יוצר יופי אך עלול להיות איטי.' 
  },
  
  // מבצע combinations
  { 
    zodiac: 'מבצע', 
    style: 'מסתער', 
    name: 'מבצע-מסתער: המנהל הסוער', 
    description: 'מבצע אנרגטי שמבצע בעוצמה. מוביל צוותים בהתלהבות, מושך עובדים אך עלול להיות דורשני.' 
  },
  { 
    zodiac: 'מבצע', 
    style: 'מוכיח', 
    name: 'מבצע-מוכיח: המנהל הצודק', 
    description: 'מבצע הוגן שמבצע בהיגיון. מנהל עם צדק וסבלנות, בונה צוותים אך עלול להיות ביקורתי.' 
  },
  { 
    zodiac: 'מבצע', 
    style: 'בזק', 
    name: 'מבצע-בזק: המנהל המהיר', 
    description: 'מבצע יעיל שמבצע במהירות. מנהל עם תחכום וקצב, מושך פרויקטים אך עלול להיות מתוח.' 
  },
  { 
    zodiac: 'מבצע', 
    style: 'חכם שקט', 
    name: 'מבצע-שקט: המנטור השליו', 
    description: 'מבצע רגוע שמבצע בחכמה. מנהל ברוגע ובתובנה, יוצר צמיחה אך עלול להיות איטי.' 
  },
  
  // קשיח combinations
  { 
    zodiac: 'קשיח', 
    style: 'מסתער', 
    name: 'קשיח-מסתער: הלוחם הקשוח', 
    description: 'קשיח תקיף שמתמודד בעוצמה. עומד בפני קשיים בהתלהבות, מושך קשוחים אך עלול להיות אכזרי.' 
  },
  { 
    zodiac: 'קשיח', 
    style: 'מוכיח', 
    name: 'קשיח-מוכיח: השורד הצודק', 
    description: 'קשיח עמיד שמתמודד בהיגיון. שורד עם צדק וסבלנות, בונה עמידות אך עלול להיות קר.' 
  },
  { 
    zodiac: 'קשיח', 
    style: 'בזק', 
    name: 'קשיח-בזק: הנווד המהיר', 
    description: 'קשיח גמיש שמתמודד במהירות. שורד עם תחכום וקצב, מושך נוודים אך עלול להיות לא יציב.' 
  },
  { 
    zodiac: 'קשיח', 
    style: 'חכם שקט', 
    name: 'קשיח-שקט: הסטואיקן החכם', 
    description: 'קשיח מאוזן שמתמודד בחכמה. שורד ברוגע ובתובנה, יוצר עוצמה פנימית אך עלול להיות מרוחק.' 
  },
  
  // ספקן combinations
  { 
    zodiac: 'ספקן', 
    style: 'מסתער', 
    name: 'ספקן-מסתער: הבודק הסוער', 
    description: 'ספקן אנרגטי שמאתגר בעוצמה. בודק אמיתות בהתלהבות, מושך חוקרים אך עלול להיות מעצבן.' 
  },
  { 
    zodiac: 'ספקן', 
    style: 'מוכיח', 
    name: 'ספקן-מוכיח: החוקר הצודק', 
    description: 'ספקן מדויק שמאתגר בהיגיון. בודק עם דיוק וסבלנות, יוצר ידע אך עלול להיות ספקן מדי.' 
  },
  { 
    zodiac: 'ספקן', 
    style: 'בזק', 
    name: 'ספקן-בזק: הספקן המהיר', 
    description: 'ספקן חכם שמאתגר במהירות. בודק עם תחכום וקצב, מושך ספקנים אך עלול להיות חסר סבלנות.' 
  },
  { 
    zodiac: 'ספקן', 
    style: 'חכם שקט', 
    name: 'ספקן-שקט: הפילוסוף הספקן', 
    description: 'ספקן עמוק שמאתגר בחכמה. בודק ברוגע ובתובנה, יוצר הבנה אך עלול להיות ציני.' 
  },
  
  // נכנע combinations
  { 
    zodiac: 'נכנע', 
    style: 'מסתער', 
    name: 'נכנע-מסתער: המשרת הנלהב', 
    description: 'נכנע מסור שמשרת בעוצמה. נותן מעצמו בהתלהבות, מושך אדונים אך עלול להיות מתיש.' 
  },
  { 
    zodiac: 'נכנע', 
    style: 'מוכיח', 
    name: 'נכנע-מוכיח: המשרת הצודק', 
    description: 'נכנע אמין שמשרת בהיגיון. נותן שירות עם דיוק, בונה נאמנות אך עלול להיות תובעני.' 
  },
  { 
    zodiac: 'נכנע', 
    style: 'בזק', 
    name: 'נכנע-בזק: המשרת המהיר', 
    description: 'נכנע יעיל שמשרת במהירות. מספק שירות עם תחכום, מושך מעסיקים אך עלול להיות לחוץ.' 
  },
  { 
    zodiac: 'נכנע', 
    style: 'חכם שקט', 
    name: 'נכנע-שקט: המשרת השליו', 
    description: 'נכנע רגוע שמשרת בחן. נותן שירות ברוגע, יוצר הרמוניה אך עלול להיות פסיבי.' 
  },
  
  // עליון combinations
  { 
    zodiac: 'עליון', 
    style: 'מסתער', 
    name: 'עליון-מסתער: האל הסוער', 
    description: 'עליון כריזמטי שמוביל בעוצמה עליונה. משפיע על עולם בהתלהבות אלוהית, מושך מאמינים אך עלול להיות אינטנסיבי.' 
  },
  { 
    zodiac: 'עליון', 
    style: 'מוכיח', 
    name: 'עליון-מוכיח: הנביא הצודק', 
    description: 'עליון חכם שמוביל בחכמה עליונה. מוביל עם צדק אלוהי וסבלנות, בונה אמונה אך עלול להיות שיפוטי.' 
  },
  { 
    zodiac: 'עליון', 
    style: 'בזק', 
    name: 'עליון-בזק: המלאך המהיר', 
    description: 'עליון רוחני שפועל במהירות אלוהית. מביא השראה עם תחכום וקצב, מושך מתעניינים אך עלול להיות לא מעמיק.' 
  },
  { 
    zodiac: 'עליון', 
    style: 'חכם שקט', 
    name: 'עליון-שקט: הגורו השליו', 
    description: 'עליון עמוק שמוביל ברוחניות שלווה. מוביל עם חכמה אלוהית ורוגע, יוצר השראה פנימית אך עלול להיות מנותק.' 
  }
];
const profileTriangle = [
  {
    side: 'סגנון',
    title: 'Style',
    characteristics: [
      { hebrew: 'מאמין', english: 'Believer', rating: 5 },
      { hebrew: 'יצרן', english: 'Producer', rating: 5 },
      { hebrew: 'כוחני', english: 'Powerful', rating: 5 },
      { hebrew: 'חכם', english: 'Wise', rating: 5 },
      { hebrew: 'איטי', english: 'Slow', rating: 5 },
      { hebrew: 'שליטה גבוהה בעצמי', english: 'High self-control', rating: 5 },
      { hebrew: 'שולט בסיטואציות', english: 'Controls situations', rating: 5 },
      { hebrew: 'יודע להשפיע', english: 'Knows how to influence', rating: 5 },
      { hebrew: 'טוב במניפולציות', english: 'Good at manipulations', rating: 5 },
      { hebrew: 'לומד לעומק', english: 'Learns in depth', rating: 5 }
    ]
  },
  {
    side: 'מזל',
    title: 'Luck/Zodiac',
    characteristics: [
      { hebrew: 'חלק מהצירים אני באמצע', english: 'Some axes I\'m in the middle', rating: 5 },
      { hebrew: 'אנשים לא נמשכים אלי בצורה חזקה', english: 'People are not strongly attracted to me', rating: 5 },
      { hebrew: 'השפעה על גורל ומזל', english: 'Influence on fate and luck', rating: 5 },
      { hebrew: 'חיבור לכוכבים ואנרגיות', english: 'Connection to stars and energies', rating: 5 },
      { hebrew: 'זרימה עם הקוסמוס', english: 'Flow with the cosmos', rating: 5 }
    ]
  },
  {
    side: 'תדר',
    title: 'Frequency/Vibration',
    characteristics: [
      { hebrew: 'רמה אנרגטית', english: 'Energy level', rating: 5 },
      { hebrew: 'תדר רוחני', english: 'Spiritual frequency', rating: 5 },
      { hebrew: 'ויברציה אישית', english: 'Personal vibration', rating: 5 },
      { hebrew: 'השפעה על סביבה', english: 'Influence on environment', rating: 5 },
      { hebrew: 'חיבור לתודעה קולקטיבית', english: 'Connection to collective consciousness', rating: 5 }
    ]
  }
];

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const [ratings, setRatings] = useState<{[key: string]: number}>({});
  const [showResults, setShowResults] = useState(false);

  const handleRatingChange = (sideIndex: number, charIndex: number, rating: number) => {
    const key = `${sideIndex}-${charIndex}`;
    setRatings(prev => ({ ...prev, [key]: rating }));
  };

  const calculateResults = () => {
    const averages = profileTriangle.map((side, sideIndex) => {
      const sideRatings = side.characteristics.map((_, charIndex) => 
        ratings[`${sideIndex}-${charIndex}`] || 5
      );
      const average = sideRatings.reduce((a, b) => a + b, 0) / sideRatings.length;
      return { side: side.side, average: Math.round(average * 10) / 10 };
    });
    return averages;
  };

  const results = calculateResults();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">פרופיל אישי - המשולש</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
          <p className="text-gray-600 mt-2">אדם בנוי מ-3 צלעות: סגנון, מזל, תדר. יחד נוצר הפרופיל האישי</p>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {!showResults ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {profileTriangle.map((side, sideIndex) => (
                <div key={side.side} className="border border-gray-300 rounded-lg overflow-hidden shadow-md bg-gradient-to-br from-white via-indigo-100 to-purple-100">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-3 text-center">
                    <div className="font-bold text-lg">{side.side}</div>
                    <div className="text-sm">{side.title}</div>
                  </div>
                  <div className="p-4">
                    <div className="space-y-3">
                      {side.characteristics.map((char, charIndex) => (
                        <div key={charIndex} className="bg-white border border-gray-200 rounded-lg p-3">
                          <div className="text-sm font-semibold text-gray-800 mb-2">{char.hebrew}</div>
                          <div className="text-xs text-gray-600 mb-2">{char.english}</div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">1</span>
                            <input
                              type="range"
                              min="1"
                              max="10"
                              value={ratings[`${sideIndex}-${charIndex}`] || 5}
                              onChange={(e) => handleRatingChange(sideIndex, charIndex, parseInt(e.target.value))}
                              className="flex-1"
                            />
                            <span className="text-xs text-gray-500">10</span>
                            <span className="text-sm font-bold text-indigo-600 min-w-[2rem] text-center">
                              {ratings[`${sideIndex}-${charIndex}`] || 5}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center">
              <h3 className="text-2xl font-bold text-indigo-600 mb-6">הפרופיל שלך</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {results.map((result, index) => (
                  <div key={index} className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white p-6 rounded-lg">
                    <div className="text-xl font-bold mb-2">{result.side}</div>
                    <div className="text-3xl font-bold">{result.average}/10</div>
                  </div>
                ))}
              </div>
              <div className="bg-gray-100 p-6 rounded-lg">
                <h4 className="text-lg font-bold text-gray-800 mb-4">פירוש התוצאות</h4>
                <div className="text-gray-700 space-y-2">
                  <p><strong>סגנון:</strong> {results[0].average >= 7 ? 'חזק ומשפיע' : results[0].average >= 4 ? 'מאוזן' : 'זקוק לחיזוק'}</p>
                  <p><strong>מזל:</strong> {results[1].average >= 7 ? 'מחובר לקוסמוס' : results[1].average >= 4 ? 'בהרמוניה' : 'זקוק ליותר זרימה'}</p>
                  <p><strong>תדר:</strong> {results[2].average >= 7 ? 'אנרגטי ורוחני' : results[2].average >= 4 ? 'מאוזן' : 'זקוק להעלאת תדר'}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* 52 Profile Types Section */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-indigo-600 mb-6 text-center">52 סוגי הפרופילים</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {profileTypes.map((type, index) => (
                <div key={index} className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="text-sm font-bold text-indigo-800 mb-2">{type.name}</div>
                  <div className="text-xs text-gray-700 leading-relaxed">{type.description}</div>
                  <div className="text-xs text-gray-500 mt-2 border-t border-gray-200 pt-2">
                    {type.zodiac} × {type.style}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center text-sm text-gray-600">
              כל פרופיל הוא שילוב של מזל (13 סוגים) עם סגנון (4 סוגים) = 52 פרופילי־פרופיל ייחודיים
            </div>
          </div>
          
          <div className="mt-8 text-center">
            {!showResults ? (
              <button
                onClick={() => setShowResults(true)}
                className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-lg hover:shadow-lg transition-all duration-300"
              >
                חשב את הפרופיל שלי
              </button>
            ) : (
              <button
                onClick={() => setShowResults(false)}
                className="px-8 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-bold rounded-lg hover:shadow-lg transition-all duration-300"
              >
                ערוך מחדש
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}