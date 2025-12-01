'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, Users } from 'lucide-react';

interface SlideProps {
  slideNumber: number;
  totalSlides: number;
}

export default function Slide7Implementation({ slideNumber, totalSlides }: SlideProps) {
  const timeline = [
    {
      phase: 'Phase 1',
      title: 'Immediate (48 hours)',
      icon: '⚡',
      tasks: ['Documentation ready', 'Configuration files', 'Deployment instructions'],
      duration: '48 שעות',
      color: 'from-red-400 to-orange-400',
    },
    {
      phase: 'Phase 2',
      title: 'UAT (1-2 weeks)',
      icon: '🧪',
      tasks: ['Deploy to test group', 'Verify Pinning works', 'Collect feedback'],
      duration: '1-2 שבועות',
      color: 'from-orange-400 to-amber-400',
    },
    {
      phase: 'Phase 3',
      title: 'Production (2-3 weeks)',
      icon: '🚀',
      tasks: ['Phased deployment', 'User training', 'Support monitoring'],
      duration: '2-3 שבועות',
      color: 'from-amber-400 to-emerald-400',
    },
  ];

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-950 via-red-950 to-slate-900 flex flex-col p-12 relative overflow-hidden font-heebo" dir="rtl">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-red-500 rounded-full blur-3xl"
          animate={{ y: [0, 50, 0] }}
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
            📅 תוכנית הטמעה
          </motion.h2>
          <motion.p
            className="text-lg text-slate-400"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Timeline כללי מ-Documentation עד Production Rollout
          </motion.p>
        </div>

        {/* Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 mb-10">
          {timeline.map((item, idx) => (
            <motion.div
              key={idx}
              className="group"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              whileHover={{ y: -10 }}
            >
              <div className={`h-full rounded-xl bg-gradient-to-br ${item.color} p-0.5`}>
                <div className="relative rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 group-hover:border-slate-600 transition-all h-full p-6 flex flex-col">
                  {/* Top Badge */}
                  <div className="mb-4 inline-flex w-fit px-3 py-1 rounded-full bg-slate-700/50 text-xs font-semibold text-slate-300">
                    {item.phase}
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-4xl">{item.icon}</span>
                    <div>
                      <h3 className="text-lg font-bold text-white">{item.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
                        <Clock className="w-3 h-3" />
                        {item.duration}
                      </div>
                    </div>
                  </div>

                  {/* Tasks */}
                  <div className="space-y-3 flex-1">
                    {item.tasks.map((task, tidx) => (
                      <motion.div
                        key={tidx}
                        className="flex items-start gap-3 p-3 rounded-lg bg-slate-700/20"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.15 + tidx * 0.08 }}
                      >
                        <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0 mt-1.5" />
                        <p className="text-sm text-slate-300">{task}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Arrow to next phase */}
            </motion.div>
          ))}
        </div>

        {/* Key Metrics */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {[
            { label: 'Total Timeline', value: '4-6 weeks', icon: '📅' },
            { label: 'Success Rate', value: '95%', icon: '✅' },
            { label: 'Support Hours', value: '8-10 hours', icon: '👨‍💼' },
          ].map((metric, idx) => (
            <motion.div
              key={idx}
              className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.5 + idx * 0.1 }}
            >
              <div className="text-3xl mb-2">{metric.icon}</div>
              <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
              <div className="text-sm text-slate-400">{metric.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Your Responsibilities vs Our Responsibilities */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {/* Ours */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
            <h4 className="font-semibold text-blue-300 mb-4 flex items-center gap-2">
              <span>💼</span> מצדנו
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>✅ Documentation מלא ומאורגן</li>
              <li>✅ Configuration files מוכנים</li>
              <li>✅ Weekly check-in calls</li>
              <li>✅ Technical guidance 24/7</li>
              <li>✅ Post-launch support 2 weeks</li>
            </ul>
          </div>

          {/* Theirs */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-6">
            <h4 className="font-semibold text-amber-300 mb-4 flex items-center gap-2">
              <span>🏢</span> מצידכם
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>✅ IT contact & technical details</li>
              <li>✅ Authorize test deployment</li>
              <li>✅ Assign test users for UAT</li>
              <li>✅ Feedback & go/no-go decision</li>
              <li>✅ User communication & training</li>
            </ul>
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
