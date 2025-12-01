'use client';

import { motion } from 'framer-motion';
import { HelpCircle, Package, Server, Shield, CheckSquare } from 'lucide-react';

interface SlideProps {
  slideNumber: number;
  totalSlides: number;
}

export default function Slide3Questions({ slideNumber, totalSlides }: SlideProps) {
  const questionCategories = [
    {
      title: 'מקור התוסף',
      icon: Package,
      color: 'from-blue-400 to-cyan-400',
      questions: [
        'תוסף שפותח פנימית? חיצוני? AppSource? גרסה?',
      ],
    },
    {
      title: 'אופן הפריסה',
      icon: Server,
      color: 'from-purple-400 to-pink-400',
      questions: [
        'דרך Admin Center?',
        'פריסה ידנית?',
        'Sideloading?',
      ],
    },
    {
      title: 'אופן השימוש',
      icon: CheckSquare,
      color: 'from-emerald-400 to-teal-400',
      questions: [
        'Outlook Desktop Classic?',
        'New Outlook?',
        'OWA?',
        'גרסאות Office?',
      ],
    },
    {
      title: 'שאלות IT',
      icon: Shield,
      color: 'from-amber-400 to-orange-400',
      questions: [
        'האם קיימות הגבלות רשת/Firewall על Azure?',
        'האם WebView2 מאופשר (לתוספים מודרניים)?',
        'האם קיימות Group Policies שחוסמות Add-ins?',
        'האם הארגון תומך ב-Centralized Deployment?',
      ],
    },
    {
      title: 'שאלות Azure',
      icon: Server,
      color: 'from-blue-400 to-indigo-400',
      questions: [
        'היכן מאוחסן ה-manifest?',
        'האם יש בעיות CORS / SSL / Redirects?',
        'האם ל-Prod יש גישה מלאה לשירותי Azure?',
      ],
    },
    {
      title: 'שאלות Pinning',
      icon: CheckSquare,
      color: 'from-pink-400 to-rose-400',
      questions: [
        'האם התוסף מוגדר כ-Taskpane Add-in?',
        'האם משתמשים בגרסה של Outlook שתומכת ב-Pinning?',
        'האם הפיצ\'ר זמין ב-Production למשתמשים אחרים?',
      ],
    },
  ];

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex flex-col p-12 relative overflow-hidden font-heebo" dir="rtl">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-3xl"
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
             שאלות חשובות לבירור המצב הנוכחי
          </motion.h2>
          <motion.p
            className="text-lg text-slate-400"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            שאלות בסיס: מה אנחנו בכלל בודקים?
          </motion.p>
        </div>

        {/* Questions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {questionCategories.map((category, idx) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={idx}
                className="bg-slate-800/50 border border-slate-700 rounded-lg p-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${category.color} p-0.5`}>
                    <div className="w-full h-full bg-slate-900 rounded-[6px] flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <h3 className="font-bold text-white">{category.title}</h3>
                </div>
                <ul className="space-y-2">
                  {category.questions.map((q, qidx) => (
                    <li key={qidx} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="text-blue-400 flex-shrink-0 mt-1"></span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Slide Counter */}
      <div className="text-right text-sm text-slate-500 pt-6 border-t border-slate-700/50">
        Slide {slideNumber} / {totalSlides}
      </div>
    </div>
  );
}
