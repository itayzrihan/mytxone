'use client';

import { motion } from 'framer-motion';

interface SlideProps {
  slideNumber: number;
  totalSlides: number;
}

const questions = [
  {
    category: 'סביבה ותשתית',
    items: [
      {
        q: 'מהו ה-Outlook Version על המחשבים?',
        why: 'כל גרסה תומכת בפיצ\'רים שונים',
        options: [
          'Outlook Desktop 2016',
          'Outlook Desktop 2019',
          'Outlook Desktop 2021',
          'Outlook Desktop (365 Subscription)',
          'Outlook Web Access (OWA)',
        ],
      },
      {
        q: 'מי ה-IT Admin שלכם ומהי ההוצאה הטכנית?',
        why: 'זה ישפיע על מהירות ההטמעה',
      },
      {
        q: 'האם יש GPO שעשויים לחסום Addins?',
        why: 'אם ה-GPO חוסם, צריך אישור מנהל',
      },
    ],
  },
  {
    category: 'המשתמשים',
    items: [
      {
        q: 'כמה משתמשים מעורבים?',
        why: 'קנה מידה מחייב strategy שונה',
      },
      {
        q: 'מה ה-Technical Background?',
        why: 'דוקומנטציה צריכה להשתנות',
      },
    ],
  },
  {
    category: 'Addin עצמו',
    items: [
      {
        q: 'מהו השימוש העיקרי?',
        why: 'עוזר להבין את ה-Priority',
      },
      {
        q: 'אילו תכונות משתמשים כרגע?',
        why: 'Pinning עובד רק בחלקים מסוימים',
      },
    ],
  },
  {
    category: 'בעיות עכשוויות',
    items: [
      {
        q: 'כיצד אתם מטפלים בPinning כרגע?',
        why: 'יעזור להבין את ה-Current State',
      },
      {
        q: 'אילו שגיאות אתם נתקלים בהן?',
        why: 'כל בעיה דורשת debugging שונה',
      },
      {
        q: 'האם יש DevTools/Logger מופעל?',
        why: 'Debugging בלי logs = לנסוע בלי אור',
      },
    ],
  },
];

export default function Slide10Questions({ slideNumber, totalSlides }: SlideProps) {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex flex-col p-12 relative overflow-hidden font-heebo" dir="rtl">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          className="absolute top-1/3 right-1/3 w-96 h-96 bg-blue-500 rounded-full blur-3xl"
          animate={{ y: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
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
        <div className="mb-8">
          <motion.h2
            className="text-5xl font-bold text-white mb-3"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            🤔 שאלות קריטיות
          </motion.h2>
          <motion.p
            className="text-lg text-slate-400"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            10 שאלות חכמות שנצטרך לדעת מה התשובות
          </motion.p>
        </div>

        {/* Questions Grid */}
        <div className="flex-1 overflow-y-auto scrollbar-hide pr-4 space-y-6">
          {questions.map((section, sidx) => (
            <motion.div
              key={sidx}
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: sidx * 0.1 }}
            >
              {/* Section Title */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-6 bg-gradient-to-b from-blue-400 to-cyan-400 rounded-full"></div>
                <h3 className="text-lg font-bold text-white">{section.category}</h3>
              </div>

              {/* Questions */}
              <div className="space-y-3 pl-4">
                {section.items.map((item, qidx) => (
                  <motion.div
                    key={qidx}
                    className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:bg-slate-800/70 transition-all"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: sidx * 0.1 + qidx * 0.06 }}
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 text-xl">❓</div>
                      <div className="flex-1">
                        <p className="font-semibold text-blue-300 mb-2">{item.q}</p>
                        <p className="text-xs text-slate-400 mb-3">
                          <strong>למה זה חשוב:</strong> {item.why}
                        </p>
                        {item.options && (
                          <div className="space-y-1 bg-slate-900/50 rounded p-2">
                            {item.options.map((opt, oidx) => (
                              <label
                                key={oidx}
                                className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-300 cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  className="w-3 h-3 rounded accent-blue-400"
                                />
                                {opt}
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Stats */}
        <motion.div
          className="flex gap-8 pt-8 border-t border-slate-700/50 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="flex-1">
            <div className="text-3xl font-bold text-blue-300 mb-1">10</div>
            <p className="text-sm text-slate-400">שאלות חכמות</p>
          </div>
          <div className="flex-1">
            <div className="text-3xl font-bold text-cyan-300 mb-1">4</div>
            <p className="text-sm text-slate-400">קטגוריות</p>
          </div>
          <div className="flex-1">
            <div className="text-3xl font-bold text-purple-300 mb-1">15 min</div>
            <p className="text-sm text-slate-400">משך הדיוק</p>
          </div>
          <div className="flex-1">
            <div className="text-3xl font-bold text-emerald-300 mb-1">100%</div>
            <p className="text-sm text-slate-400">critical info</p>
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
