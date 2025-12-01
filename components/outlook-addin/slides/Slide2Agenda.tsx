'use client';

import { motion } from 'framer-motion';
import { Users, Building2, AlertCircle } from 'lucide-react';

interface SlideProps {
  slideNumber: number;
  totalSlides: number;
}

export default function Slide2TeamIntroduction({ slideNumber, totalSlides }: SlideProps) {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex flex-col p-12 relative overflow-hidden font-heebo" dir="rtl">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 flex-1 flex flex-col overflow-y-auto scrollbar-hide"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="mb-10">
          <motion.h2
            className="text-5xl font-bold text-white mb-3"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
             הצגת הצדדים
          </motion.h2>
          <motion.p
            className="text-lg text-slate-400"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            מי אנחנו ומי אתם
          </motion.p>
        </div>

        {/* Two Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 mb-10">
          {/* Us */}
          <motion.div
            className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Building2 className="w-8 h-8 text-blue-400" />
              <h3 className="text-2xl font-bold text-blue-300">אנחנו</h3>
            </div>
            <div className="space-y-4 text-slate-300">
              <div>
                <p className="font-semibold text-blue-200 mb-2"> מפתח פול סטאק</p>
                <p className="text-sm">אפיון, אינטגרציה ופתרון ל-Outlook Add-ins</p>
              </div>
              <div>
                <p className="font-semibold text-blue-200 mb-2"> המטרה שלי</p>
                <p className="text-sm">להבין לעומק את הבעיה ולייצר תוכנית פעולה ברורה ומעשית</p>
              </div>
              <div>
                <p className="font-semibold text-blue-200 mb-2"> תחומי מומחיות</p>
                <p className="text-sm">ניסיון עבר עם ידע בנושאים: Outlook, Azure, IT, Pinning</p>
              </div>
            </div>
          </motion.div>

          {/* Client */}
          <motion.div
            className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-8 h-8 text-emerald-400" />
              <h3 className="text-2xl font-bold text-emerald-300">אתם</h3>
            </div>
            <div className="space-y-4 text-slate-300">
              <div>
                <p className="font-semibold text-emerald-200 mb-2"> בעל תוסף</p>
                <p className="text-sm">Add-In ל-Outlook המאוחסן ב-Azure</p>
              </div>
              <div>
                <p className="font-semibold text-emerald-200 mb-2"> שתי סביבות פעילות</p>
                <ul className="text-sm space-y-1 mr-4">
                  <li> <strong>פיתוח (Premium)</strong>  Pinning עובד</li>
                  <li> <strong>Production</strong>  סביבה סגורה, Pinning לא זמין</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-emerald-200 mb-2"> עדיין לא ברור</p>
                <ul className="text-sm space-y-1 mr-4">
                  <li> מקור התוסף (פיתוח/רכישה/AppSource)</li>
                  <li> אילו חסמי IT קיימים</li>
                  <li> מבנה ה-Azure</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Key Challenge */}
        <motion.div
          className="bg-red-500/10 border border-red-500/30 rounded-lg p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-start gap-4">
            <AlertCircle className="w-8 h-8 text-red-400 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-red-300 mb-2"> האתגר המרכזי</h4>
              <p className="text-slate-300">
                ב-Development הכל עובד בצורה, אבל ב-Production יש בעיות. חסמי IT, הגדרות Azure, קונפיגורציות Outlook שונות עלולים למנוע את כל Pinning מלעבוד אם לא נבדוק את כל הזרימה הזו היטב.
              </p>
              <p className="text-slate-300 mt-3">
                <strong>הישיבה הזו היום:</strong> לאסוף מידע מלא ולבנות תוכנית קדימה.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Slide Counter */}
      <div className="text-right text-sm text-slate-500 pt-6 border-t border-slate-700/50">
        Slide {slideNumber} / {totalSlides}
      </div>
    </div>
  );
}
