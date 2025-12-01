'use client';

import { motion } from 'framer-motion';
import { Clock, CheckCircle2 } from 'lucide-react';

interface SlideProps {
  slideNumber: number;
  totalSlides: number;
}

export default function Slide2Agenda({ slideNumber, totalSlides }: SlideProps) {
  const agendaItems = [
    { time: '5 דקות', title: 'הכירות הדדית', icon: '👋', color: 'from-blue-400 to-cyan-400', num: '1️⃣' },
    {
      time: '5 דקות',
      title: 'פתיחה - מה נכסה',
      icon: '🎬',
      color: 'from-cyan-400 to-emerald-400',
      num: '2️⃣',
    },
    {
      time: '15-20 דקות',
      title: 'חלק אינפורמטיבי',
      icon: '📚',
      color: 'from-emerald-400 to-teal-400',
      num: '3️⃣',
    },
    {
      time: '10 דקות',
      title: 'שאלות מצדי',
      icon: '🤔',
      color: 'from-teal-400 to-blue-400',
      num: '4️⃣',
    },
    { time: '10-15 דקות', title: 'שאלות מצידכם', icon: '❓', color: 'from-blue-400 to-purple-400', num: '5️⃣' },
    { time: '10 דקות', title: 'הבהרה עמוקה', icon: '🎯', color: 'from-purple-400 to-pink-400', num: '6️⃣' },
    { time: '5 דקות', title: 'סיכום & הצעות', icon: '📝', color: 'from-pink-400 to-red-400', num: '7️⃣' },
  ];

  const totalMinutes = [5, 5, 20, 10, 15, 10, 5].reduce((a, b) => a + b, 0);

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex flex-col p-12 relative overflow-hidden font-heebo" dir="rtl">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          className="absolute top-10 right-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
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
        <div className="mb-12">
          <motion.h2
            className="text-5xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent mb-2"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            סדר היום
          </motion.h2>
          <motion.p
            className="text-slate-400 text-lg"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            60 דקות של עבודה פרודוקטיבית וממוקדת
          </motion.p>
        </div>

        {/* Timeline */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {agendaItems.map((item, idx) => (
            <motion.div
              key={idx}
              className="group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              whileHover={{ y: -5 }}
            >
              <div className={`relative p-0.5 rounded-xl bg-gradient-to-br ${item.color} group-hover:opacity-100 transition-all`}>
                <div className="relative rounded-[10px] bg-slate-900 border border-white/20 group-hover:border-white/40 transition-all p-6">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl flex-shrink-0">{item.num}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <span className="text-sm font-medium text-slate-400">{item.time}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-slate-100 transition-colors break-words">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Stats */}
        <motion.div
          className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-700/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-300 mb-1">{agendaItems.length}</div>
            <p className="text-sm text-slate-400">חלקים בהצגה</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-300 mb-1">{totalMinutes}</div>
            <p className="text-sm text-slate-400">דקות בסך הכל</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-pink-300 mb-1">100%</div>
            <p className="text-sm text-slate-400">עומק כיסוי</p>
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
