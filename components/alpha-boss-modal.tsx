import React from 'react';
import { X } from 'lucide-react';

interface FieldContainerProps {
  title: string;
  description: string;
}

const FieldContainer: React.FC<FieldContainerProps> = ({ title, description }) => (
  <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-lg p-4 mb-4">
    <h3 className="text-lg font-bold text-red-700 mb-2">{title}</h3>
    <p className="text-red-800 text-sm leading-relaxed">{description}</p>
  </div>
);

interface AlphaBossModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AlphaBossModal: React.FC<AlphaBossModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const principles = [
    {
      title: "😀 חיוך",
      description: "תמיד לשמור על חיוך בין אם הוא ענק - מינימלי או פנימי בלתי נראה"
    },
    {
      title: "🔩 משחקי טון",
      description: "בין נמוך ולבינוני - אף פעם לא להיות מקובע, אך לא להגיע לטון גבוהה, רק במקרים קיצוניים של משחק או הומור הטון הראשי הוא נמוך"
    },
    {
      title: "📏 עמידה זקופה וקו ירוק",
      description: "לא להתכופף בפני שום דבר ואף אחד תמיד לשמור על ראש מורם, ראיית משחק, גם מול הפלאפון בגובה העיניים, לא להישען על שום דבר."
    },
    {
      title: "🎌 חזה פתוח",
      description: "שפת גוף פתוחה - לשמור על חזה פתוח שפת גוף פתוחה."
    },
    {
      title: "🦿 לא לדחוף ולא למשוך",
      description: "מה שדוחפים חוזר מה שמושכים בורח - להתקדם ממוקד למטרה ולא לדחוף או למשוך דברים בדרך שאינם נחוצים מה שאנחנו דוחפים חוזר אלינו מה שאנחנו מושכים בורח מאיתנו, פשוט להיות בקו ישר למטרה ללא הסחות דעת"
    },
    {
      title: "🍃 נשימה עמוקה וקצב איטי",
      description: "מודעות לנשימה – תמיד לשמור על נשימה עמוקה, איטית ושלווה. זה משדר ביטחון, שקט פנימי ושליטה, וגם עוזר בפועל להרגיש יותר ממוקד ורגוע. זה משלים את העקרונות הקיימים שלך: תומך בחיוך ובשפת גוף רגועה. עוזר לשמור על טון דיבור יציב ונמוך. תורם לעמידה זקופה ולאנרגיה ממוקדת."
    },
    {
      title: "🐢 תנועה איטית ומדויקת",
      description: "אין לחץ, אין דרמה - שליטה בזמן לזוז רק כשצריך, באיטיות, עם שליטה. לא למהר, לא לקפוץ. מי שבטוח בעצמו לא מגיב מהר – הוא יוזם."
    },
    {
      title: "🔘 כל פעולה היא בחירה",
      description: "לא תגובה - שליטה בבחירה אל תיכנס למוד של \"להגיב למה שקורה\". אתה בוחר. אתה מוביל. גם אם יש גירוי – אתה לא מגיב אוטומטית. אתה בוחר מתי ואיך לפעול."
    },
    {
      title: "🪨 שקט פנימי",
      description: "לא להסביר, לא להצדיק - שקט עוצמתי אין צורך לשכנע, להצדיק או להסביר את עצמך כל הזמן. דבר רק כשצריך, ולעניין. השתיקה שלך שווה יותר מהמילים של אחרים."
    },
    {
      title: "👁️‍🗨️ עיניי צייד",
      description: "לראות הכל ושלא יראו את העיניים שלי, נראות סגורות אך רואות הכל"
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl overflow-hidden">
          <div className="sticky top-0 bg-white/95 backdrop-blur-xl border-b border-red-200 p-6 flex items-center justify-between z-10">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                עקרונות הריז של ALPHA BOSS - JOKER
              </h2>
              <p className="text-red-600 mt-1">עקרונות לנוכחות דומיננטית וביטחון עצמי</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-red-100 rounded-lg transition-colors duration-200"
            >
              <X className="w-6 h-6 text-red-600" />
            </button>
          </div>

          <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {principles.map((principle, index) => (
                  <FieldContainer
                    key={index}
                    title={principle.title}
                    description={principle.description}
                  />
                ))}
              </div>

              <div className="mt-8 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-xl font-bold text-red-700 mb-4">סיכום העקרונות</h3>
                <p className="text-red-800 leading-relaxed">
                  עקרונות אלו מייצגים את הדרך של האלפא בוס - שילוב של ביטחון עצמי, נוכחות דומיננטית ושליטה מלאה במצבים.
                  כל עיקרון תומך באחרים ומחזק את האנרגיה הכוללת של מנהיגות טבעית ושקטה.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlphaBossModal;