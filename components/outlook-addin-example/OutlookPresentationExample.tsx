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
import Slide4PinningFeature from './slides/Slide4PinningFeature';
import Slide5Environments from './slides/Slide5Environments';
import Slide6Configuration from './slides/Slide6Configuration';
import Slide6_5Implementation from './slides/Slide6_5Implementation';
import Slide7Implementation from './slides/Slide7Implementation';
import Slide8Statistics from './slides/Slide8Statistics';
import Slide9Questions from './slides/Slide9Questions';
import Slide10ClientQuestions from './slides/Slide10ClientQuestions';
import Slide11Clarification from './slides/Slide11Clarification';
import Slide12Summary from './slides/Slide12Summary';

const slides = [
  { id: 1, title: 'Welcome', component: Slide1Welcome },
  { id: 2, title: 'Agenda', component: Slide2Agenda },
  { id: 3, title: 'What is Addin', component: Slide3WhatIsAddin },
  { id: 4, title: 'Pinning Feature', component: Slide4PinningFeature },
  { id: 5, title: 'Environments', component: Slide5Environments },
  { id: 6, title: 'Configuration', component: Slide6Configuration },
  { id: 6.5, title: 'Implementation Order', component: Slide6_5Implementation },
  { id: 7, title: 'Implementation', component: Slide7Implementation },
  { id: 8, title: 'Statistics', component: Slide8Statistics },
  { id: 9, title: 'Our Questions', component: Slide9Questions },
  { id: 10, title: 'Your Questions', component: Slide10ClientQuestions },
  { id: 11, title: 'Clarification', component: Slide11Clarification },
  { id: 12, title: 'Summary', component: Slide12Summary },
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
