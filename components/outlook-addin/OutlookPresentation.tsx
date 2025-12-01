'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  ChevronLeft,
  Play,
  Zap,
  BarChart3,
  Users,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  TrendingUp,
  Shield,
  Smartphone,
  Cable,
  Settings,
  Lock,
} from 'lucide-react';
import Slide1Welcome from './slides/Slide1Welcome';
import Slide2Agenda from './slides/Slide2Agenda';
import Slide3WhatIsAddin from './slides/Slide3WhatIsAddin';
import Slide4CommonIssues from './slides/Slide4CommonIssues';
import Slide5PinningFeature from './slides/Slide5PinningFeature';
import Slide6Environments from './slides/Slide6Environments';
import Slide7Configuration from './slides/Slide7Configuration';
import Slide7_5Implementation from './slides/Slide7_5Implementation';
import Slide8Implementation from './slides/Slide8Implementation';
import Slide9Statistics from './slides/Slide9Statistics';
import Slide10Questions from './slides/Slide10Questions';
import Slide11ClientQuestions from './slides/Slide11ClientQuestions';
import Slide12Clarification from './slides/Slide12Clarification';
import Slide13Summary from './slides/Slide13Summary';

const slides = [
  { id: 1, title: 'Welcome', component: Slide1Welcome },
  { id: 2, title: 'הצגת הצדדים', component: Slide2Agenda },
  { id: 3, title: 'שאלות חשובות', component: Slide3WhatIsAddin },
  { id: 4, title: 'סיבות נפוצות לבעיות', component: Slide4CommonIssues },
  { id: 5, title: 'הצעה לצעדים הבאים', component: Slide5PinningFeature },
  { id: 6, title: 'Environments', component: Slide6Environments },
  { id: 7, title: 'Configuration', component: Slide7Configuration },
  { id: 7.5, title: 'Implementation Order', component: Slide7_5Implementation },
  { id: 8, title: 'Implementation', component: Slide8Implementation },
  { id: 9, title: 'Statistics', component: Slide9Statistics },
  { id: 10, title: 'Our Questions', component: Slide10Questions },
  { id: 11, title: 'Your Questions', component: Slide11ClientQuestions },
  { id: 12, title: 'Clarification', component: Slide12Clarification },
  { id: 13, title: 'Summary', component: Slide13Summary },
];

export default function OutlookPresentation() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(false);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    if (!isAutoplay) return;

    const timer = setTimeout(() => {
      handleNext();
    }, 5000);

    return () => clearTimeout(timer);
  }, [isAutoplay, currentSlide]);

  const handleNext = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const CurrentSlide = slides[currentSlide].component;

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <div className="w-full min-h-screen flex flex-col font-heebo">
      {/* Main Presentation Area */}
      <div className="flex-1 relative overflow-hidden" dir="rtl">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.5 },
            }}
            className="absolute inset-0 w-full h-full"
          >
            <CurrentSlide 
              slideNumber={currentSlide + 1} 
              totalSlides={slides.length}
              onNavigateToSlide={(slideIndex: number) => {
                setDirection(slideIndex > currentSlide ? 1 : -1);
                setCurrentSlide(slideIndex);
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation Bar - LTR */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-t border-blue-500/30 px-6 py-4 flex items-center justify-between" dir="ltr">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={handlePrev}
            disabled={currentSlide === 0}
            className="p-2 rounded-lg hover:bg-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-6 h-6 text-blue-400" />
          </button>

          {/* Slide Indicator */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-blue-300">
              {currentSlide + 1} / {slides.length}
            </span>
            <div className="h-1 bg-slate-700 rounded-full w-24 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-400 to-cyan-400"
                initial={{ width: 0 }}
                animate={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          <button
            onClick={handleNext}
            disabled={currentSlide === slides.length - 1}
            className="p-2 rounded-lg hover:bg-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-6 h-6 text-blue-400" />
          </button>
        </div>

        {/* Center Section - Slide Title */}
        <div className="text-center flex-1 mx-6">
          <p className="text-sm font-semibold text-blue-300">
            {slides[currentSlide].title}
          </p>
        </div>

        {/* Right Section - Autoplay Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAutoplay(!isAutoplay)}
            className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-all ${
              isAutoplay
                ? 'bg-blue-500/30 text-blue-300'
                : 'bg-slate-700/50 text-slate-400 hover:bg-slate-600/50'
            }`}
          >
            <Play className="w-4 h-4" />
            <span className="text-xs font-medium">{isAutoplay ? 'Playing' : 'Play'}</span>
          </button>
        </div>
      </div>

      {/* Slide Thumbnails at Bottom */}
      <div className="bg-slate-900 border-t border-slate-700 px-6 py-3 overflow-x-auto" dir="ltr">
        <div className="flex gap-2 min-w-max">
          {slides.map((slide, idx) => (
            <motion.button
              key={idx}
              onClick={() => {
                setDirection(idx > currentSlide ? 1 : -1);
                setCurrentSlide(idx);
              }}
              whileHover={{ scale: 1.05 }}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                idx === currentSlide
                  ? 'bg-blue-500/50 text-white border border-blue-400'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
              }`}
            >
              {idx + 1}. {slide.title}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
