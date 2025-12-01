'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Phone, Mail, Calendar } from 'lucide-react';

interface SlideProps {
  slideNumber: number;
  totalSlides: number;
}

export default function Slide12Summary({ slideNumber, totalSlides }: SlideProps) {
  const actionItems = [
    { icon: ' yours', text: 'IT contact + technical details', time: 'בתוך יום' },
    { icon: 'ours', text: 'Send documentation + config files', time: 'תוך 48 שעות' },
    { icon: 'ours', text: 'Weekly check-in calls', time: 'כל שני' },
    { icon: 'yours', text: 'Authorize test deployment', time: 'בתוך 3 ימים' },
    { icon: 'ours', text: 'Deploy to test group', time: 'Week 1' },
    { icon: 'yours', text: 'Feedback & go/no-go decision', time: 'Week 2' },
    { icon: 'ours', text: 'Production rollout', time: 'Week 2-3' },
  ];

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 flex flex-col p-12 relative overflow-hidden font-heebo" dir="rtl">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-emerald-500/20 to-transparent"
          animate={{ opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 4, repeat: Infinity }}
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
            ✅ סיכום & הצעות
          </motion.h2>
          <motion.p
            className="text-lg text-slate-400"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            מה שדיברנו היום וכיצד נמשיך משכאן
          </motion.p>
        </div>

        {/* What We Covered */}
        <motion.div
          className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-lg font-bold text-emerald-300 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6" />
            Covered Today
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-300">
            {[
              '✓ Outlook Addin basics & Pinning importance',
              '✓ Development vs Production environments',
              '✓ Required IT configurations',
              '✓ Implementation timeline (1-4 weeks)',
              '✓ Your specific technical setup',
              '✓ Current blockers & challenges',
              '✓ Success metrics & ROI',
              '✓ Your vision & requirements',
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + idx * 0.05 }}
              >
                {item}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Key Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div
            className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h4 className="font-bold text-blue-300 mb-3">🎯 Key Insights</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>✓ Pinning is possible in Production with proper IT setup</li>
              <li>✓ Most issues are configuration, not technical</li>
              <li>✓ Timeline: 2-3 weeks with active IT support</li>
              <li>✓ Success requires IT collaboration & clear docs</li>
            </ul>
          </motion.div>

          <motion.div
            className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-6"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h4 className="font-bold text-amber-300 mb-3">💡 Next Steps</h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>✓ Send IT contact information</li>
              <li>✓ Review technical details</li>
              <li>✓ Schedule next meeting</li>
              <li>✓ Begin UAT preparation</li>
            </ul>
          </motion.div>
        </div>

        {/* Action Items Timeline */}
        <motion.div
          className="bg-slate-800/50 border border-slate-700 rounded-lg p-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h3 className="text-lg font-bold text-white mb-4">📋 Action Items & Timeline</h3>

          <div className="space-y-2">
            {actionItems.map((item, idx) => (
              <motion.div
                key={idx}
                className={`flex items-center gap-4 p-3 rounded-lg ${
                  item.icon === 'ours'
                    ? 'bg-blue-500/10 border border-blue-500/20'
                    : 'bg-amber-500/10 border border-amber-500/20'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + idx * 0.05 }}
              >
                <span className={`text-lg ${item.icon === 'ours' ? '🔵' : '🟠'}`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-200">{item.text}</p>
                </div>
                <div className="text-xs text-slate-500 whitespace-nowrap">{item.time}</div>
              </motion.div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-700 flex justify-between text-xs text-slate-500">
            <span>🔵 = Our responsibility</span>
            <span>🟠 = Your responsibility</span>
          </div>
        </motion.div>

        {/* Bottom Contact Info */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 text-center">
            <Phone className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-400 mb-1">Phone</p>
            <p className="text-sm text-slate-300">[Your Phone]</p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 text-center">
            <Mail className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-400 mb-1">Email</p>
            <p className="text-sm text-slate-300">[Your Email]</p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 text-center">
            <Calendar className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-400 mb-1">Next Meeting</p>
            <p className="text-sm text-slate-300">[Proposed Date]</p>
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/50 rounded-lg p-8 mt-8 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h3 className="text-2xl font-bold text-white mb-3">מוכנים להמשיך?</h3>
          <p className="text-slate-300 mb-6">
            יש לנו את הניסיון, הכלים, והמוטיבציה להסיע את הפרויקט לסיום מוצלח
          </p>
          <div className="flex gap-4 justify-center">
            <button className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-semibold hover:shadow-xl hover:shadow-emerald-500/50 transition-all transform hover:scale-105">
              בואו נתחיל
            </button>
            <button className="px-8 py-3 bg-slate-700/50 text-white rounded-lg font-semibold hover:bg-slate-600/50 transition-all border border-slate-600">
              תוכנית פגישה הבאה
            </button>
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
