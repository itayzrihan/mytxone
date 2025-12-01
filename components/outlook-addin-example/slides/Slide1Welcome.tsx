'use client';

import { motion } from 'framer-motion';
import { Mail, Zap } from 'lucide-react';

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
        className="relative z-10 text-center max-w-4xl"
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
          className="text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Outlook Addin
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-2xl md:text-3xl text-slate-300 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          עמוד מוקדש לפתרון בעיות Pinning
        </motion.p>

        {/* Description */}
        <motion.p
          className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          פגישת הכירות, ניתוח צרכים, והסכמה על תוכנית קדימה לפתרון בעיית ה-Pinning ב-Outlook Addin
        </motion.p>

        {/* Features Pills */}
        <motion.div
          className="flex flex-wrap gap-4 justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {['Development', 'Production', 'Configuration', 'Implementation'].map(
            (feature, idx) => (
              <motion.div
                key={feature}
                className="px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/50 text-blue-300 text-sm font-medium"
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(59, 130, 246, 0.3)' }}
                transition={{ delay: idx * 0.1 }}
              >
                <Zap className="w-4 h-4 inline mr-2" />
                {feature}
              </motion.div>
            )
          )}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="flex gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
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
          className="mt-16 pt-8 border-t border-slate-700/50 flex justify-between items-center text-sm text-slate-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <span>1 שעה של פגישה מקצועית</span>
          <span>Slide {slideNumber} / {totalSlides}</span>
          <span>December 2025</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
