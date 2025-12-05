'use client';

import { useState, useEffect } from 'react';

interface PrinciplesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'micro' | 'macro' | 'domino';
}

export default function PrinciplesModal({ isOpen, onClose, initialTab = 'micro' }: PrinciplesModalProps) {
  const [activeTab, setActiveTab] = useState<'micro' | 'macro' | 'domino'>(initialTab);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">עקרונות ומונחים בסיסיים</h2>
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
            onClick={() => setActiveTab('micro')}
            className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
              activeTab === 'micro'
                ? 'text-cyan-600 border-b-2 border-cyan-600 bg-white'
                : 'text-gray-600 hover:text-cyan-600'
            }`}
          >
            מיקרו - המטרה
          </button>
          <button
            onClick={() => setActiveTab('macro')}
            className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
              activeTab === 'macro'
                ? 'text-cyan-600 border-b-2 border-cyan-600 bg-white'
                : 'text-gray-600 hover:text-cyan-600'
            }`}
          >
            מאקרו - התמונה הגדולה
          </button>
          <button
            onClick={() => setActiveTab('domino')}
            className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
              activeTab === 'domino'
                ? 'text-cyan-600 border-b-2 border-cyan-600 bg-white'
                : 'text-gray-600 hover:text-cyan-600'
            }`}
          >
            אפקט דומינו
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[60vh]">
          {activeTab === 'micro' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-3xl font-bold text-cyan-600 mb-4">מיקרו - המטרה</h3>
              </div>
              <div className="bg-cyan-50 p-6 rounded-xl">
                <p className="text-lg text-gray-800 leading-relaxed">
                  המיקרו הוא הפוקוס על הרגע הנוכחי והמטרה הקטנה. זה הצעד הקטן שאנחנו לוקחים עכשיו,
                  ההחלטה הפשוטה, הפעולה המינימלית שמחברת אותנו לחזון הגדול.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-cyan-200 rounded-lg p-4">
                  <h4 className="font-semibold text-cyan-600 mb-2">דוגמאות למיקרו:</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• נשימה עמוקה לפני החלטה</li>
                    <li>• חיוך לאדם זר</li>
                    <li>• כתיבת משפט אחד ביומן</li>
                    <li>• שתיית כוס מים</li>
                    <li>• מתיחה של 30 שניות</li>
                  </ul>
                </div>
                <div className="bg-white border border-cyan-200 rounded-lg p-4">
                  <h4 className="font-semibold text-cyan-600 mb-2">למה זה חשוב:</h4>
                  <p className="text-gray-700">
                    המיקרו הוא הגשר בין הרצון לבין הפעולה. הוא הופך את הבלתי אפשרי לאפשרי,
                    כי כל דבר גדול מתחיל בקטן.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'macro' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-6xl mb-4">🌍</div>
                <h3 className="text-3xl font-bold text-blue-600 mb-4">מאקרו - התמונה הגדולה</h3>
              </div>
              <div className="bg-blue-50 p-6 rounded-xl">
                <p className="text-lg text-gray-800 leading-relaxed">
                  המאקרו הוא החזון הרחב, התמונה הגדולה של החיים. זה הכיוון הכללי,
                  היעד הרחוק, החלום הגדול שאנחנו שואפים אליו. הוא נותן משמעות לכל הצעדים הקטנים.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-600 mb-2">איך לבנות מאקרו:</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• הגדרת ערכים אישיים</li>
                    <li>• חזון לטווח ארוך</li>
                    <li>• מטרות שנוגעות בלב</li>
                    <li>• תמונה של חיים מלאים</li>
                    <li>• השפעה על העולם</li>
                  </ul>
                </div>
                <div className="bg-white border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-600 mb-2">הקשר למיקרו:</h4>
                  <p className="text-gray-700">
                    המאקרו הוא המצפן שמנחה את המיקרו. בלי תמונה גדולה,
                    הצעדים הקטנים הופכים לחסרי כיוון.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'domino' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-6xl mb-4">🎲</div>
                <h3 className="text-3xl font-bold text-purple-600 mb-4">אפקט דומינו</h3>
              </div>
              <div className="bg-purple-50 p-6 rounded-xl">
                <p className="text-lg text-gray-800 leading-relaxed">
                  פעולה קטנה או בקשה קטנה יכולים להוביל לרצף שרשרת אדיר.
                  כמו בדומינו - דחיפה קלה על הקובייה הראשונה מפילה את כל השורה.
                  כך גם בחיים: החלטה קטנה יכולה לשנות הכל.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-purple-200 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-600 mb-2">דוגמאות לאפקט דומינו:</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• בקשה קטנה להלוואה → קריירה חדשה</li>
                    <li>• שיחה עם אדם זר → חברות לכל החיים</li>
                    <li>• הרגל קטן → שינוי אורח חיים</li>
                    <li>• מחשבה חיובית → מציאות חדשה</li>
                    <li>• צעד קטן → מסע גדול</li>
                  </ul>
                </div>
                <div className="bg-white border border-purple-200 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-600 mb-2">איך להשתמש בכוח הזה:</h4>
                  <p className="text-gray-700">
                    התחל בקטן. אל תחכה ל"רגע הנכון". כל התחלה קטנה יכולה להפוך לגדולה.
                    האפקט הדומינו עובד גם הפוך - הרגלים רעים יכולים להרוס הכל.
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-xl">
                <h4 className="font-bold text-purple-800 mb-2">המסר החשוב:</h4>
                <p className="text-purple-700">
                  אל תזלזל בכוח של הצעד הקטן. הוא יכול להיות ההתחלה של שרשרת שתשנה את חייך ואת חיי אחרים.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}