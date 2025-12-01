'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, Cloud, Shield, Network, Code } from 'lucide-react';

interface SlideProps {
  slideNumber: number;
  totalSlides: number;
}

export default function Slide4CommonIssues({ slideNumber, totalSlides }: SlideProps) {
  const issueCategories = [
    {
      title: 'תלויות ב-Outlook',
      icon: Code,
      color: 'from-blue-400 to-cyan-400',
      issues: [
        'גרסה ישנה של Outlook Classic',
        'שימוש ב-Outlook חדש ללא תמיכה מלאה',
        'Pinning לא זמין בגרסאות מסוימות או ברמת הפצה מסוימת',
      ],
    },
    {
      title: 'תלויות ב-Azure',
      icon: Cloud,
      color: 'from-purple-400 to-pink-400',
      issues: [
        'manifest לא נגיש / URL חסום',
        'בעיות CORS או HTTPS',
        'שירותי Azure לא זמינים ב-Prod',
      ],
    },
    {
      title: 'חסמי IT נפוצים',
      icon: Shield,
      color: 'from-red-400 to-orange-400',
      issues: [
        'Group Policies שחוסמות Add-ins',
        'Firewall חוסם קריאות ל-Azure',
        'חסימת WebView2',
        'AppLocker / WDAC חוסמים טעינת קבצים',
      ],
    },
    {
      title: 'פערים בין פיתוח לייצור',
      icon: Network,
      color: 'from-emerald-400 to-teal-400',
      issues: [
        'Dev עובד על פרופיל Premium',
        'Prod נמצא ברשת סגורה',
        'אין תאימות בין גרסאות/הגדרות',
        'התקנה לא זהה בין Dev ל-Prod',
      ],
    },
  ];

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-950 via-red-950 to-slate-900 flex flex-col p-12 relative overflow-hidden font-heebo" dir="rtl">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          className="absolute top-1/4 right-1/3 w-96 h-96 bg-red-500 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-orange-500 rounded-full blur-3xl"
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
            <AlertTriangle className="w-12 h-12 text-red-400" />
            <h2 className="text-5xl font-bold text-white">
              סיבות נפוצות לבעיות בתוסף Outlook
            </h2>
          </motion.div>
          <motion.p
            className="text-lg text-slate-400 mr-14"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            במיוחד Azure + Pinning
          </motion.p>
        </div>

        {/* Issues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {issueCategories.map((category, idx) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={idx}
                className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-red-500/50 transition-all"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${category.color} p-0.5`}>
                    <div className="w-full h-full bg-slate-900 rounded-[7px] flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className="font-bold text-xl text-white">{category.title}</h3>
                </div>
                <ul className="space-y-3">
                  {category.issues.map((issue, issueIdx) => (
                    <li key={issueIdx} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="text-red-400 flex-shrink-0 mt-1">⚠️</span>
                      <span>{issue}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* Key Insight Box */}
        <motion.div
          className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-lg p-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-8 h-8 text-red-400 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-xl text-red-300 mb-3">💡 תובנה מרכזית</h4>
              <p className="text-slate-300 leading-relaxed">
                רוב הבעיות נובעות מפער בין סביבת הפיתוח לסביבת הייצור. כאשר הכל עובד ב-Development אבל לא ב-Production, 
                הסיבה היא כמעט תמיד אחת מהבעיות לעיל. <strong className="text-white">חיוני לבדוק כל נקודה בשיטתיות</strong> 
                כדי לזהות את החסם המדויק.
              </p>
              <div className="mt-4 pt-4 border-t border-red-500/20">
                <p className="text-sm text-slate-400">
                  <strong className="text-red-300">שלב הבא:</strong> נעבור על שאלות ספציפיות שיעזרו לנו לזהות את הבעיה המדויקת במערכת שלכם
                </p>
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
