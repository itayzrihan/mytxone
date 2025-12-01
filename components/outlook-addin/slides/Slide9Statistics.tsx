'use client';

import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users } from 'lucide-react';

interface SlideProps {
  slideNumber: number;
  totalSlides: number;
}

export default function Slide9Statistics({ slideNumber, totalSlides }: SlideProps) {
  const stats = [
    {
      title: 'Client Success Rate',
      value: '95%',
      icon: '✅',
      breakdown: [
        { label: 'Smooth Implementation', value: '75%' },
        { label: 'Minor IT Adjustments', value: '20%' },
        { label: 'Complex Scenarios', value: '5%' },
      ],
    },
    {
      title: 'Deployment Timeline',
      value: '2-3 weeks',
      icon: '⏱️',
      breakdown: [
        { label: 'With active IT support', value: '60%' },
        { label: 'With minor delays', value: '30%' },
        { label: 'With complex environment', value: '10%' },
      ],
    },
    {
      title: 'ROI Improvement',
      value: '+65%',
      icon: '📈',
      breakdown: [
        { label: 'User Adoption Increase', value: '+65%' },
        { label: 'Support Tickets Decrease', value: '-40%' },
        { label: 'Feature Usage Increase', value: '+75%' },
      ],
    },
  ];

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 flex flex-col p-12 relative overflow-hidden font-heebo" dir="rtl">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1], rotate: [0, 180, 0] }}
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
        <div className="mb-10">
          <motion.h2
            className="text-5xl font-bold text-white mb-3"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            📊 נתונים מחקירים דומים
          </motion.h2>
          <motion.p
            className="text-lg text-slate-400"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            מה קרה בפרויקטים דומים שלנו בעבר
          </motion.p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              className="group"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              whileHover={{ y: -5 }}
            >
              <div className="h-full rounded-xl bg-gradient-to-br from-emerald-400/10 to-teal-400/10 border border-emerald-500/30 group-hover:border-emerald-400/50 transition-all p-6 flex flex-col">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      {stat.title}
                    </p>
                    <motion.div
                      className="text-4xl font-bold text-emerald-300"
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: idx * 0.15 + 0.2 }}
                    >
                      {stat.value}
                    </motion.div>
                  </div>
                  <div className="text-3xl">{stat.icon}</div>
                </div>

                {/* Breakdown */}
                <div className="space-y-4 flex-1">
                  {stat.breakdown.map((item, bidx) => (
                    <motion.div
                      key={bidx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: idx * 0.15 + bidx * 0.1 }}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-slate-400">{item.label}</span>
                        <span className="text-sm font-semibold text-emerald-300">{item.value}</span>
                      </div>
                      <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                          initial={{ width: 0 }}
                          animate={{ width: item.value }}
                          transition={{ duration: 1, delay: idx * 0.15 + bidx * 0.1 + 0.3 }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Time Savings */}
          <motion.div
            className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-start gap-4">
              <span className="text-3xl">⏰</span>
              <div className="flex-1">
                <h4 className="font-semibold text-blue-300 mb-2">Time Saved Per User</h4>
                <p className="text-3xl font-bold text-white mb-2">~30 minutes</p>
                <p className="text-sm text-slate-400">per month with Pinning enabled</p>
                <p className="text-xs text-slate-500 mt-2">For 50 users = 25 hours/month saved</p>
              </div>
            </div>
          </motion.div>

          {/* Support Tickets */}
          <motion.div
            className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-6"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-start gap-4">
              <span className="text-3xl">📞</span>
              <div className="flex-1">
                <h4 className="font-semibold text-amber-300 mb-2">Support Tickets Reduction</h4>
                <p className="text-3xl font-bold text-white mb-2">-40%</p>
                <p className="text-sm text-slate-400">fewer "Where is the Addin?" questions</p>
                <p className="text-xs text-slate-500 mt-2">Better user experience = less support load</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Comparison Chart */}
        <motion.div
          className="bg-slate-800/50 border border-slate-700 rounded-lg p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h4 className="text-lg font-semibold text-white mb-8">Before vs After Comparison</h4>

          <div className="space-y-6">
            {[
              { metric: 'Feature Visibility', before: 20, after: 90 },
              { metric: 'User Adoption Rate', before: 15, after: 80 },
              { metric: 'Active Users', before: 30, after: 95 },
              { metric: 'User Satisfaction', before: 40, after: 92 },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 + idx * 0.1 }}
              >
                <div className="flex justify-between items-center mb-2 mb-3">
                  <span className="font-medium text-slate-300">{item.metric}</span>
                  <div className="flex gap-4 text-sm">
                    <span className="text-red-400">Before: {item.before}%</span>
                    <span className="text-emerald-400">After: {item.after}%</span>
                  </div>
                </div>

                <div className="h-2 bg-slate-700 rounded-full overflow-hidden flex">
                  <motion.div
                    className="bg-red-500/50"
                    initial={{ width: 0 }}
                    animate={{ width: `${item.before}%` }}
                    transition={{ duration: 0.8, delay: 0.5 + idx * 0.1 + 0.2 }}
                  />
                  <motion.div
                    className="bg-emerald-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${item.after - item.before}%` }}
                    transition={{ duration: 0.8, delay: 0.5 + idx * 0.1 + 0.4 }}
                  />
                </div>
              </motion.div>
            ))}
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
