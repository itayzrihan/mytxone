'use client';

import { motion } from 'framer-motion';
import { Package, Layers, Zap, Lock } from 'lucide-react';

interface SlideProps {
  slideNumber: number;
  totalSlides: number;
}

export default function Slide3WhatIsAddin({ slideNumber, totalSlides }: SlideProps) {
  const features = [
    {
      icon: Package,
      title: 'קוד שרץ בתוך Outlook',
      description: 'Extension שמאפשר פונקציונליות חדשה',
      color: 'from-blue-400 to-cyan-400',
    },
    {
      icon: Layers,
      title: 'מרחיב פונקציונליות',
      description: 'הוסף תכונות וכלים חדשים',
      color: 'from-cyan-400 to-teal-400',
    },
    {
      icon: Zap,
      title: 'עובד ברכיבי UI וData',
      description: 'ממשק משתמש ואינטגרציה נתונים',
      color: 'from-teal-400 to-emerald-400',
    },
    {
      icon: Lock,
      title: 'דורש הרשאות וקונפיגורציה',
      description: 'ביטחון והגדרות מנהל',
      color: 'from-emerald-400 to-blue-400',
    },
  ];

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex flex-col p-12 relative overflow-hidden font-heebo" dir="rtl">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500 rounded-full blur-3xl"
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
        <div className="mb-12">
          <motion.h2
            className="text-5xl font-bold text-white mb-3"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            מה זה <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text">Outlook Addin</span>?
          </motion.h2>
          <motion.div
            className="h-1 w-24 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
        </div>

        {/* Main Content - Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 flex-1">
          {/* Left - Features Grid */}
          <div className="space-y-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  className="group"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ x: 10 }}
                >
                  <div className="flex gap-4 p-4 rounded-lg bg-slate-800/50 group-hover:bg-slate-800/80 transition-all border border-slate-700/50 group-hover:border-slate-600">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} p-0.5`}>
                      <div className="w-full h-full bg-slate-900 rounded-[6px] flex items-center justify-center">
                        <Icon className="w-6 h-6 text-slate-100" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                      <p className="text-sm text-slate-400">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right - Visual Representation */}
          <motion.div
            className="flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative w-full h-80">
              {/* Outlook Window */}
              <div className="absolute inset-0 rounded-xl border-2 border-blue-500/50 bg-gradient-to-br from-slate-800 to-slate-900 p-4 overflow-hidden">
                {/* Title Bar */}
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-700">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <span className="text-xs text-slate-400 ml-2">Outlook</span>
                </div>

                {/* Fake Email Content */}
                <div className="space-y-3">
                  <div className="h-4 bg-slate-700/50 rounded w-1/3"></div>
                  <div className="h-3 bg-slate-700/30 rounded w-full"></div>
                  <div className="h-3 bg-slate-700/30 rounded w-5/6"></div>
                </div>

                {/* Addin Indicator */}
                <motion.div
                  className="absolute bottom-4 right-4 px-3 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-semibold rounded-lg"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  📌 Addin
                </motion.div>
              </div>

              {/* Floating Code Snippet */}
              <motion.div
                className="absolute bottom-20 left-4 bg-slate-900/80 border border-blue-500/50 rounded-lg p-3 text-xs text-slate-300 font-mono max-w-xs"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              >
                <div>&lt;manifest&gt;</div>
                <div className="text-blue-400">&nbsp;&nbsp;&lt;addin&gt;</div>
                <div className="text-cyan-400">&nbsp;&nbsp;&nbsp;&nbsp;Pinning</div>
                <div className="text-blue-400">&nbsp;&nbsp;&lt;/addin&gt;</div>
                <div>&lt;/manifest&gt;</div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Bottom - Key Insight */}
        <motion.div
          className="mt-12 pt-8 border-t border-slate-700/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6 flex items-start gap-4">
            <div className="text-2xl">💡</div>
            <div>
              <h4 className="font-semibold text-blue-300 mb-2">Key Insight</h4>
              <p className="text-slate-300">
                Outlook Addin הוא קוד שרץ בתוך Outlook ויכול להוסיף דברים מוגבלים או מתקדמים לפי צרכים.
                הוא דורש הרשאות, קונפיגורציה, ובמקרים מסוימים - אישור מנהל ה-IT.
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
