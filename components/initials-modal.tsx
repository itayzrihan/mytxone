import { useState } from 'react';

interface InitialsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const initialsData = [
  {
    initial: 'שחקן',
    fullName: 'שחקן',
    description: 'מי שמשחק תפקידים שונים בחיים, מתאים את עצמו למצבים שונים ומשתמש בגמישות כדי להשיג מטרות.'
  },
  {
    initial: 'שמחה',
    fullName: 'שמחה',
    description: 'מצב תודעה של אושר ואופטימיות, מקור אנרגיה פנימי שמאפשר התמודדות עם אתגרים בחיוביות.'
  },
  {
    initial: 'חיבור',
    fullName: 'חיבור',
    description: 'יצירת קשרים עמוקים עם אנשים, מקומות ואנרגיות. היכולת ליצור רשתות תמיכה והשפעה.'
  },
  {
    initial: 'קו ישר',
    fullName: 'קו ישר',
    description: 'גישה ישירה ובלתי מתפשרת. הליכה בדרך הישרה ללא עקיפות או פשרות מיותרות.'
  },
  {
    initial: 'נינוחות',
    fullName: 'נינוחות',
    description: 'מצב של רוגע פנימי ושלווה. היכולת להרפות מהמתח ולקבל את הרגע כפי שהוא.'
  },
  {
    initial: 'דנא',
    fullName: 'דנא',
    description: 'הקוד הגנטי של האישיות - התכונות הבסיסיות שנולדנו איתן והשפעתן על התנהגותנו.'
  },
  {
    initial: 'דציבל',
    fullName: 'דציבל נחישות אסרטיביות',
    description: 'רמת העוצמה של הנחישות והאסרטיביות. כמה חזק אנחנו מבטאים את רצונותינו ומגנים על גבולותינו.'
  },
  {
    initial: 'נמרה',
    fullName: 'נמרה',
    description: 'חיה טורפת חזקה וגמישה. מייצגת כוח, זריזות ואלגנטיות בלתי צפויה.'
  },
  {
    initial: 'נרטיב',
    fullName: 'נרטיב מחשבה רגש התנהגות',
    description: 'הסיפור הפנימי שמנחה את המחשבות, הרגשות וההתנהגויות שלנו. האופן שבו אנחנו מספרים לעצמנו את סיפור חיינו.'
  }
];

const FieldContainer = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
    <div className="text-sm font-semibold text-gray-500 uppercase mb-2">{label}</div>
    <div className="text-sm font-semibold text-gray-800">{value}</div>
  </div>
);

export default function InitialsModal({ isOpen, onClose }: InitialsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">ראשי תיבות - מושגי יסוד</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
          <p className="text-gray-600 mt-2">אוסף של מושגי יסוד וראשי תיבות שמייצגים תכונות וארכיטיפים באישיות</p>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {initialsData.map((item, index) => (
              <div key={index} className="border border-gray-300 rounded-lg overflow-hidden shadow-md bg-gradient-to-br from-white via-emerald-100 to-teal-100">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-3 text-center">
                  <div className="font-bold text-lg">{item.initial}</div>
                  <div className="text-sm">{item.fullName}</div>
                </div>
                <div className="p-4">
                  <FieldContainer label="תיאור" value={item.description} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}