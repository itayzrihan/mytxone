'use client';

import { motion } from 'framer-motion';
import { Mail, Zap, CheckCircle2 } from 'lucide-react';

interface SlideProps {
  slideNumber: number;
  totalSlides: number;
  onNavigateToSlide?: (slideIndex: number) => void;
}

export default function Slide1Welcome({ slideNumber, totalSlides, onNavigateToSlide }: SlideProps) {
  const handleStartPresentation = () => {
    if (onNavigateToSlide) {
      onNavigateToSlide(1); // Navigate to slide 2 (index 1)
    }
  };

  const agendaItems = [
    'הצגת הצדדים',
    'הבנת מצב קיים',
    'שאלות קריטיות לבירור',
    'סיבות נפוצות לתקלות / חסמים',
    'גיבוש צעדים הבאים',
    'החלטה על מסמכי המשך ו-POC',
  ];

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-12 relative overflow-hidden font-heebo" dir="rtl">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full blur-3xl"
          animate={{ y: [0, 30, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-72 h-72 bg-cyan-500 rounded-full blur-3xl"
          animate={{ y: [0, -30, 0] }}
          transition={{ duration: 6, repeat: Infinity, delay: 1 }}
        />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 text-center max-w-5xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
      >
        {/* Logo/Icon */}
        <motion.div
          className="flex justify-center mb-8"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 blur-xl opacity-50"></div>
            <div className="relative bg-gradient-to-br from-blue-600 to-cyan-600 p-6 rounded-2xl">
              <Mail className="w-16 h-16 text-white" />
            </div>
          </div>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          הטמעת Add-In ל-Outlook<br />
          <span className="text-transparent bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-300 bg-clip-text">
            המאוחסן ב-Azure
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-xl md:text-2xl text-slate-300 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          בירור מעמיק וגיבוש תוכנית פעולה
        </motion.p>

        {/* Agenda */}
        <motion.div
          className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-blue-300 mb-6 flex items-center justify-center gap-2">
            <Zap className="w-6 h-6" />
            אג&apos;נדה
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
            {agendaItems.map((item, idx) => (
              <motion.div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-all"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + idx * 0.1 }}
              >
                <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-200">{item}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="flex gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <button 
            onClick={handleStartPresentation}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-xl hover:shadow-blue-500/50 transition-all transform hover:scale-105"
          >
            התחל הצגה
          </button>
        </motion.div>

        {/* Footer Info */}
        <motion.div
          className="mt-12 pt-6 border-t border-slate-700/50 text-sm text-slate-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.4 }}
        >
          <span>Slide {slideNumber} / {totalSlides}</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
