'use client';

import { motion } from 'framer-motion';
import { ListChecks, Search, Wrench, Cloud, FileSearch, Rocket, CheckCircle2 } from 'lucide-react';

interface SlideProps {
  slideNumber: number;
  totalSlides: number;
}

export default function Slide5PinningFeature({ slideNumber, totalSlides }: SlideProps) {
  const steps = [
    {
      number: 1,
      title: 'איסוף מידע',
      icon: Search,
      color: 'from-blue-400 to-cyan-400',
      tasks: [
        'להגדיר מענה על כל השאלות משקופית 3',
        'להבין מקור התוסף',
        'לאסוף URLs, manifest, גרסאות Outlook',
      ],
    },
    {
      number: 2,
      title: 'בדיקה טכנית',
      icon: Wrench,
      color: 'from-purple-400 to-pink-400',
      tasks: [
        'בדיקת ה-manifest',
        'בדיקת פריסה בפועל ב-Prod',
        'בדיקת Permissions ו-GPO',
        'בדיקת הגדרת Taskpane (ל-Pinning)',
        'בחינת התנהגות התוסף בדיבוג',
      ],
    },
    {
      number: 3,
      title: 'בדיקות Azure',
      icon: Cloud,
      color: 'from-emerald-400 to-teal-400',
      tasks: [
        'גישה ל-URLs',
        'בדיקת תעודות / HTTPS',
        'בדיקת אפליקציות Azure AD',
        'בדיקת קונפיגורציית Authentication',
      ],
    },
    {
      number: 4,
      title: 'סגירת פערים',
      icon: FileSearch,
      color: 'from-amber-400 to-orange-400',
      tasks: [
        'לייצר מסמך GAP Analysis',
        'לפרט את החסמים המדויקים',
        'לאפשר Quick Wins / תיקונים מיידיים',
      ],
    },
    {
      number: 5,
      title: 'Pilot / POC',
      icon: Rocket,
      color: 'from-indigo-400 to-purple-400',
      tasks: [
        'לנסות התקנה נקייה ב-Prod לאחר תיקונים',
        'בדיקת Pinning',
        'בדיקת Login / Authentication',
      ],
    },
    {
      number: 6,
      title: 'מעבר ל-Go-Live',
      icon: CheckCircle2,
      color: 'from-green-400 to-emerald-400',
      tasks: [
        'פריסה מלאה',
        'בדיקות משתמשים',
        'תיעוד והעברת תוצר מלא',
      ],
    },
  ];

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex flex-col p-12 relative overflow-hidden font-heebo" dir="rtl">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
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
          <motion.div
            className="flex items-center gap-3 mb-3"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ListChecks className="w-12 h-12 text-indigo-400" />
            <h2 className="text-5xl font-bold text-white">
              הצעה לצעדים הבאים
            </h2>
          </motion.div>
          <motion.p
            className="text-lg text-slate-400 mr-14"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            תוכנית עבודה שיטתית לפתרון הבעיה
          </motion.p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-indigo-500/50 transition-all"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${step.color} p-0.5`}>
                    <div className="w-full h-full bg-slate-900 rounded-[7px] flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium">שלב {step.number}</div>
                    <h3 className="font-bold text-lg text-white">{step.title}</h3>
                  </div>
                </div>
                <ul className="space-y-2.5">
                  {step.tasks.map((task, taskIdx) => (
                    <li key={taskIdx} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="text-indigo-400 flex-shrink-0 mt-0.5">✓</span>
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* Timeline Visualization */}
        <motion.div
          className="bg-gradient-to-r from-indigo-500/10 to-blue-500/10 border border-indigo-500/30 rounded-lg p-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-xl text-indigo-300">📊 Timeline משוער</h4>
          </div>
          <div className="relative">
            {/* Timeline Bar */}
            <div className="absolute top-8 left-0 right-0 h-1 bg-slate-700 rounded-full">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 2, delay: 0.8 }}
              />
            </div>

            {/* Steps on timeline */}
            <div className="grid grid-cols-6 gap-2 relative">
              {steps.map((step, idx) => (
                <motion.div
                  key={idx}
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.9 + idx * 0.1 }}
                >
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-white text-sm font-bold mb-2 z-10`}>
                    {step.number}
                  </div>
                  <div className="text-xs text-slate-400 text-center">{step.title}</div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-indigo-500/20">
            <p className="text-sm text-slate-300">
              <strong className="text-indigo-300">משך זמן משוער:</strong> 2-4 שבועות, תלוי במורכבות הבעיה ובזמינות הצוותים
            </p>
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
