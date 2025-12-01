import React from 'react';
import { X } from 'lucide-react';

interface FieldContainerProps {
  title: string;
  description: string;
  color: string;
}

const FieldContainer: React.FC<FieldContainerProps> = ({ title, description, color }) => (
  <div className={`bg-gradient-to-br ${color} border border-gray-200 rounded-lg p-4 mb-4`}>
    <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-700 text-sm leading-relaxed">{description}</p>
  </div>
);

interface EnergyTypesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EnergyTypesModal: React.FC<EnergyTypesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const energyTypes = [
    {
      title: "🌙 טמס (Tamas) - אנרגיית החושך",
      description: "אנרגיית הכבדות, הקיפאון והחושך. מביאה לעצלות, בלבול וחוסר מוטיבציה. מתבטאת בחוסר תנועה, שינה מוגזמת, דיכאון וחוסר בהירות. האנרגיה הזו מושכת אותנו כלפי מטה, אל הרגלים רעים והתנהגויות הרסניות.",
      color: "from-gray-100 to-gray-200"
    },
    {
      title: "🔥 רג'ס (Rajas) - אנרגיית הפעולה",
      description: "אנרגיית התנועה, התשוקה והפעילות. מביאה לרצון עז להשיג, תחרותיות, כעס ותאוות. מתבטאת בחוסר שקט, קבלת החלטות מהירה מדי, וחיפוש מתמיד אחר סיפוקים. זו אנרגיה דינמית שמניעה לפעולה אך יכולה להיות הרסנית אם לא מאוזנת.",
      color: "from-red-100 to-orange-200"
    },
    {
      title: "☀️ סטווה (Sattva) - אנרגיית הטוהר",
      description: "אנרגיית האור, ההרמוניה והחכמה. מביאה לשלווה פנימית, בהירות מחשבתית, אהבה וחמלה. מתבטאת ברוגע, איזון, בריאות טובה וחיבור רוחני. זו האנרגיה הגבוהה ביותר שמובילה לצמיחה רוחנית, בריאות ואושר אמיתי.",
      color: "from-yellow-100 to-green-200"
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl overflow-hidden">
          <div className="sticky top-0 bg-white/95 backdrop-blur-xl border-b border-purple-200 p-6 flex items-center justify-between z-10">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                שלושת סוגי האנרגיה - טמס, רג&apos;ס, סטווה
              </h2>
              <p className="text-purple-600 mt-1">הגונות - איכויות האנרגיה שמניעות את העולם</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-purple-100 rounded-lg transition-colors duration-200"
            >
              <X className="w-6 h-6 text-purple-600" />
            </button>
          </div>

          <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="p-6">
              <div className="grid grid-cols-1 gap-6">
                {energyTypes.map((energy, index) => (
                  <FieldContainer
                    key={index}
                    title={energy.title}
                    description={energy.description}
                    color={energy.color}
                  />
                ))}
              </div>

              <div className="mt-8 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-6">
                <h3 className="text-xl font-bold text-purple-700 mb-4">איך לאזן את האנרגיות</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold text-purple-600 mb-2">לצמצם טמס:</h4>
                    <ul className="text-purple-800 space-y-1">
                      <li>• תנועה גופנית קבועה</li>
                      <li>• שינה מסודרת ומאוזנת</li>
                      <li>• מזון טבעי ובריא</li>
                      <li>• חשיפה לאור שמש</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-purple-600 mb-2">לרסן רג&apos;ס:</h4>
                    <ul className="text-purple-800 space-y-1">
                      <li>• מדיטציה והתבוננות</li>
                      <li>• נשימות עמוקות</li>
                      <li>• הפסקות מהטכנולוגיה</li>
                      <li>• בחירה מודעת של פעילויות</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-purple-600 mb-2">לפתח סטווה:</h4>
                    <ul className="text-purple-800 space-y-1">
                      <li>• תרגול יוגה ומדיטציה</li>
                      <li>• קריאה רוחנית</li>
                      <li>• התנדבות ועזרה לאחרים</li>
                      <li>• שהייה בטבע</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-6">
                <h3 className="text-xl font-bold text-indigo-700 mb-4">המסע הרוחני</h3>
                <p className="text-indigo-800 leading-relaxed">
                  המטרה היא להגיע לאיזון בין שלוש האנרגיות, עם דגש על פיתוח סטווה - אנרגיית הטוהר והחכמה.
                  ככל שאנחנו מתקדמים רוחנית, אנחנו לומדים לזהות איזו אנרגיה דומיננטית בנו בכל רגע,
                  ולבחור מודע את הפעולות שיקדמו אותנו לעבר האור וההרמוניה.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnergyTypesModal;