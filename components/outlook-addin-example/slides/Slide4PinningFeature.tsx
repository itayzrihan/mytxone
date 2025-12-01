'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface SlideProps {
  slideNumber: number;
  totalSlides: number;
}

export default function Slide4PinningFeature({ slideNumber, totalSlides }: SlideProps) {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 flex flex-col p-12 relative overflow-hidden font-heebo" dir="rtl">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          className="absolute top-1/3 left-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-3xl"
          animate={{ y: [0, 40, 0] }}
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
            🔍 הבנת <span className="text-transparent bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text">Pinning Feature</span>
          </motion.h2>
          <motion.p
            className="text-lg text-slate-400"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            יכולת לנעל משהו בחלק הגלוי של Outlook - תמיד נגיש וגלוי
          </motion.p>
        </div>

        {/* Main Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 mb-12">
          {/* Without Pinning */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 p-6">
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <TrendingDown className="w-6 h-6 text-red-400" />
                  <h3 className="text-2xl font-bold text-red-300">בלי Pinning ❌</h3>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="flex items-start gap-2">
                    <span className="text-2xl flex-shrink-0">📁</span>
                    <div>
                      <p className="text-white font-medium">מוסתר במקום עמוק</p>
                      <p className="text-xs text-slate-400">צריך לחפש בתפריט</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-2xl flex-shrink-0">😟</span>
                    <div>
                      <p className="text-white font-medium">משתמשים שוכחים</p>
                      <p className="text-xs text-slate-400">No visibility = no usage</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-2xl flex-shrink-0">⚙️</span>
                    <div>
                      <p className="text-white font-medium">עומס עבודה מיותר</p>
                      <p className="text-xs text-slate-400">צריך ללמד משתמשים</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-2xl flex-shrink-0">📊</span>
                    <div>
                      <p className="text-white font-medium">אימוץ נמוך</p>
                      <p className="text-xs text-slate-400">10-20% משתמשים</p>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-8 pt-6 border-t border-red-500/20">
                  <div className="text-3xl font-bold text-red-400">-60%</div>
                  <p className="text-sm text-slate-400">נמוך אימוץ משתמש</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* With Pinning */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 p-6">
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <TrendingUp className="w-6 h-6 text-emerald-400" />
                  <h3 className="text-2xl font-bold text-emerald-300">עם Pinning ✅</h3>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="flex items-start gap-2">
                    <span className="text-2xl flex-shrink-0">📌</span>
                    <div>
                      <p className="text-white font-medium">תמיד נראה וגלוי</p>
                      <p className="text-xs text-slate-400">ממש בריבוט</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-2xl flex-shrink-0">😊</span>
                    <div>
                      <p className="text-white font-medium">חוויה משופרת</p>
                      <p className="text-xs text-slate-400">Easy access = high usage</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-2xl flex-shrink-0">🚀</span>
                    <div>
                      <p className="text-white font-medium">הפחתת עומס תמיכה</p>
                      <p className="text-xs text-slate-400">משתמשים יודעים איפה</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-2xl flex-shrink-0">📈</span>
                    <div>
                      <p className="text-white font-medium">אימוץ גבוה</p>
                      <p className="text-xs text-slate-400">75-90% משתמשים</p>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-8 pt-6 border-t border-emerald-500/20">
                  <div className="text-3xl font-bold text-emerald-400">+65%</div>
                  <p className="text-sm text-slate-400">גבוה אימוץ משתמש</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Visual Example */}
        <motion.div
          className="bg-slate-800/50 border border-slate-700 rounded-lg p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h4 className="text-lg font-semibold text-white mb-6">Outlook Interface Example</h4>

          <div className="space-y-4">
            {/* Pinned */}
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">📌</span>
                <span className="font-semibold text-emerald-300">Pinned Items</span>
              </div>
              <div className="space-y-2 pl-11 text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  Dashboard Addin
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  Quick Action Tool
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  Status Monitor
                </div>
              </div>
            </div>

            {/* Collapsed */}
            <div className="bg-slate-700/30 border border-slate-700 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">⬇️</span>
                <span className="font-semibold text-slate-400">Collapsed Items (צריך click לפתוח)</span>
              </div>
              <div className="space-y-2 pl-11 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                  Other Addins...
                </div>
              </div>
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
