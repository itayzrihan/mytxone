import { useState } from 'react';

interface MBTIModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const mbtiDichotomies = [
  {
    letter: 'I/E',
    name: 'Introversion/Extraversion',
    description: 'האם אתה מקבל אנרגיה מבפנים (I) או מבחוץ (E)?',
    question: 'האם אתה מעדיף לבלות זמן לבד או עם אנשים?',
    options: ['לבד (I)', 'עם אנשים (E)']
  },
  {
    letter: 'S/N',
    name: 'Sensing/Intuition',
    description: 'האם אתה מתמקד בעובדות (S) או באפשרויות (N)?',
    question: 'האם אתה מתמקד בפרטים קונקרטיים או ברעיונות גדולים?',
    options: ['פרטים (S)', 'רעיונות (N)']
  },
  {
    letter: 'T/F',
    name: 'Thinking/Feeling',
    description: 'האם אתה מחליט על בסיס לוגיקה (T) או רגשות (F)?',
    question: 'האם אתה מעדיף החלטות לוגיות או התחשבות ברגשות?',
    options: ['לוגיקה (T)', 'רגשות (F)']
  },
  {
    letter: 'J/P',
    name: 'Judging/Perceiving',
    description: 'האם אתה מעדיף סדר (J) או גמישות (P)?',
    question: 'האם אתה אוהב תכנון מראש או התאמה למצבים?',
    options: ['תכנון (J)', 'גמישות (P)']
  }
];

const mbtiTypes = [
  { code: 'ISTJ', name: 'המפקח', summary: 'אמין, מעשי, מתמקד בעובדות וסדר' },
  { code: 'ISFJ', name: 'המטפל', summary: 'דואג לאחרים, מסור, מעריך הרמוניה' },
  { code: 'INFJ', name: 'היועץ', summary: 'אידיאליסטי, חזוני, מבין אנשים עמוקות' },
  { code: 'INTJ', name: 'הארכיטקט', summary: 'אסטרטגי, עצמאי, מחפש ידע וחידושים' },
  { code: 'ISTP', name: 'החוקר', summary: 'גמיש, מעשי, אוהב פתרון בעיות' },
  { code: 'ISFP', name: 'האמן', summary: 'רגיש, יצירתי, חי ברגע' },
  { code: 'INFP', name: 'המתווך', summary: 'אידיאליסטי, פתוח, מחפש משמעות' },
  { code: 'INTP', name: 'ההוגה', summary: 'אנליטי, סקרן, אוהב תיאוריות' },
  { code: 'ESTP', name: 'היזם', summary: 'אנרגטי, מעשי, אוהב אתגרים' },
  { code: 'ESFP', name: 'הבדרן', summary: 'חברותי, חי ברגע, אוהב בידור' },
  { code: 'ENFP', name: 'החזאי', summary: 'יצירתי, אנרגטי, אוהב רעיונות חדשים' },
  { code: 'ENTP', name: 'הדיונן', summary: 'חדשני, סקרן, אוהב דיונים' },
  { code: 'ESTJ', name: 'המנהל', summary: 'ארגוני, מעשי, מוביל' },
  { code: 'ESFJ', name: 'השגריר', summary: 'חברותי, דואג, יוצר הרמוניה' },
  { code: 'ENFJ', name: 'הגיבור', summary: 'כריזמטי, מוטיבציה, עוזר לאחרים' },
  { code: 'ENTJ', name: 'המפקד', summary: 'אסטרטגי, מוביל, יעיל' }
];

const FieldContainer = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 shadow-sm">
    <div className="text-xs font-semibold text-gray-500 uppercase mb-1">{label}</div>
    <div className="text-sm font-semibold text-gray-800">{value}</div>
  </div>
);

export default function MBTIModal({ isOpen, onClose }: MBTIModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">MBTI - Myers-Briggs Type Indicator</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Dichotomies */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-blue-600 mb-4">4 הגדרות - דיכוטומיות</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mbtiDichotomies.map((dichotomy) => (
                <div key={dichotomy.letter} className="border border-gray-300 rounded-lg p-4 shadow-md bg-gradient-to-br from-white via-green-100 to-blue-100">
                  <div className="text-lg font-bold text-blue-600 mb-2">{dichotomy.letter} - {dichotomy.name}</div>
                  <FieldContainer label="הגדרה" value={dichotomy.description} />
                  <FieldContainer label="שאלה לדוגמה" value={dichotomy.question} />
                  <div className="mt-3">
                    <div className="text-xs font-semibold text-gray-500 uppercase mb-2">אפשרויות בינאריות</div>
                    <div className="flex gap-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">{dichotomy.options[0]}</span>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">{dichotomy.options[1]}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Types */}
          <div>
            <h3 className="text-xl font-bold text-purple-600 mb-4">16 סוגי האישיות</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {mbtiTypes.map((type) => (
                <div key={type.code} className="border border-gray-300 rounded-lg overflow-hidden shadow-md bg-gradient-to-br from-white via-purple-100 to-pink-100">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-2 text-center">
                    <div className="font-bold text-lg">{type.code}</div>
                    <div className="text-sm">{type.name}</div>
                  </div>
                  <div className="p-3">
                    <FieldContainer label="תיאור קצר" value={type.summary} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}