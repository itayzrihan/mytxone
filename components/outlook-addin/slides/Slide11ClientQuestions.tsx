'use client';

import { motion } from 'framer-motion';

interface SlideProps {
  slideNumber: number;
  totalSlides: number;
}

const yourQuestions = [
  'מה היתה הציפייה שלכם מהפגישה הזו?',
  'אילו סוגי עזרה אתם צריכים הכי הרבה?',
  'יש לכם Deadline ספציפי לפתרון?',
  'מה ה-Impact בעדרון Pinning על העבודה היומית?',
  'האם יש Risk של switching ל-System אחר אם לא נפתור?',
  'מה Budget שלכם עבור הפתרון?',
  'מי יהיה Point of Contact בכל שאלה טכנית?',
];

export default function Slide11ClientQuestions({ slideNumber, totalSlides }: SlideProps) {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex flex-col p-12 relative overflow-hidden font-heebo" dir="rtl">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
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
        <div className="mb-8">
          <motion.h2
            className="text-5xl font-bold text-white mb-3"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            ❓ בואו נשמע מכם
          </motion.h2>
          <motion.p
            className="text-lg text-slate-400"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            זה הזמן של אתכם - ספרו לנו את הצרכים והחזון שלכם
          </motion.p>
        </div>

        {/* Questions List */}
        <div className="flex-1 space-y-3 mb-8">
          {yourQuestions.map((question, idx) => (
            <motion.div
              key={idx}
              className="group"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              whileHover={{ x: 10 }}
            >
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 group-hover:border-purple-400/50 rounded-lg p-5 transition-all">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-200 font-medium group-hover:text-white transition-colors">
                      {question}
                    </p>
                  </div>
                  <motion.div
                    className="text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    →
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Discussion Section */}
        <motion.div
          className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-purple-500/30 rounded-lg p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="flex items-start gap-4 mb-6">
            <span className="text-3xl">💬</span>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Open Discussion</h3>
              <p className="text-slate-400">
                נוזלי לשמוע כל עניין שלא הוזכר, כל חשש, או כל דבר שחשוב לכם בתהליך הזה
              </p>
            </div>
          </div>

          {/* Interactive Notes Area */}
          <div className="bg-slate-900/50 border border-slate-700 rounded p-4 min-h-24">
            <p className="text-xs text-slate-500 mb-2">📝 Notes from your feedback:</p>
            <div className="text-slate-400 text-sm space-y-1">
              <p className="text-slate-500">• _________________________</p>
              <p className="text-slate-500">• _________________________</p>
              <p className="text-slate-500">• _________________________</p>
              <p className="text-slate-500">• _________________________</p>
            </div>
          </div>
        </motion.div>

        {/* Bottom Notes */}
        <motion.div
          className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-700/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <div className="text-center">
            <div className="text-2xl mb-1">👂</div>
            <p className="text-xs text-slate-400">We're listening</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">💡</div>
            <p className="text-xs text-slate-400">All ideas welcome</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">🎯</div>
            <p className="text-xs text-slate-400">Your goals matter</p>
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
