'use client';

import { motion } from 'framer-motion';

interface SlideProps {
  slideNumber: number;
  totalSlides: number;
}

export default function Slide6_5Implementation({ slideNumber, totalSlides }: SlideProps) {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex flex-col p-12 relative overflow-hidden font-heebo" dir="rtl">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 flex-1 flex flex-col"
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
            🚀 סדר הפעלה <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text">(Implementation Order)</span>
          </motion.h2>
          <motion.p
            className="text-lg text-slate-400"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            הצעדים המדויקים להפעלת Pinning ב-Production
          </motion.p>
        </div>

        {/* Deployment Flow */}
        <motion.div
          className="bg-slate-800/50 border border-slate-700 rounded-lg p-10 flex-1"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="space-y-6">
            {[
              { step: 1, title: 'Manifest Update', desc: 'הוסף pinning configuration ל-XML', icon: '📝' },
              { step: 2, title: 'IT Approval', desc: 'אישור IT - בדוק security settings', icon: '✅' },
              {
                step: 3,
                title: 'Deploy to Production',
                desc: 'Upload ל-Exchange Admin Center',
                icon: '☁️',
              },
              { step: 4, title: 'User Testing', desc: 'אמת pinning מופיע ותומך', icon: '🧪' },
              { step: 5, title: 'Full Rollout', desc: 'deploy לכל המשתמשים', icon: '🎯' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className="flex items-start gap-6 pb-6 border-b border-slate-700/50 last:border-0"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + idx * 0.1 }}
                whileHover={{ x: 10 }}
              >
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-3xl">{item.icon}</span>
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                      {item.step}
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-semibold text-white mb-2">{item.title}</h4>
                  <p className="text-base text-slate-300">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Key Points */}
        <motion.div
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <h4 className="font-semibold text-blue-300 mb-2">⏱️ Timing</h4>
            <p className="text-sm text-slate-400">תהליך של 2-3 שבועות בממוצע</p>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
            <h4 className="font-semibold text-purple-300 mb-2">👥 Coordination</h4>
            <p className="text-sm text-slate-400">עבודה עם IT + Development teams</p>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
            <h4 className="font-semibold text-emerald-300 mb-2">📊 Success</h4>
            <p className="text-sm text-slate-400">קצב אימוץ של 80-90%</p>
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
