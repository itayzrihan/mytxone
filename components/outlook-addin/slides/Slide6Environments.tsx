'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface SlideProps {
  slideNumber: number;
  totalSlides: number;
}

export default function Slide6Environments({ slideNumber, totalSlides }: SlideProps) {
  const environments = [
    {
      name: 'Development',
      icon: '🧪',
      description: 'סביבת בדיקה ופיתוח',
      color: 'from-blue-400 to-cyan-400',
      features: [
        { label: 'סביבה', value: 'Outlook Web Access' },
        { label: 'חשבון', value: 'Premium (בדיקה)' },
        { label: 'Pinning', value: '✅ עובד מצוין' },
        { label: 'הגדרות IT', value: 'להגדיר' },
        { label: 'גישה', value: 'פתוחה בדיקה' },
      ],
    },
    {
      name: 'Production',
      icon: '🚀',
      description: 'סביבה אמיתית לעובדים',
      color: 'from-amber-400 to-orange-400',
      features: [
        { label: 'סביבה', value: 'Outlook Classic' },
        { label: 'חשבון', value: 'בדיקה מוגבלת' },
        { label: 'Pinning', value: '❓ בהתחקירות' },
        { label: 'הגדרות IT', value: 'צריך אישור' },
        { label: 'גישה', value: 'סגורה + IT Policy' },
      ],
    },
  ];

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-950 via-amber-950 to-slate-900 flex flex-col p-12 relative overflow-hidden font-heebo" dir="rtl">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-amber-500 rounded-full blur-3xl"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
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
        <div className="mb-6">
          <motion.h2
            className="text-5xl font-bold text-white mb-3"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            🏗️ ההבדל בין סביבות
          </motion.h2>
          <motion.p
            className="text-lg text-slate-400"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Development vs Production - מה ההבדל וכיצד זה משפיע
          </motion.p>
        </div>

        {/* Environments Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 mb-6">
          {environments.map((env, idx) => (
            <motion.div
              key={idx}
              className="group"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              whileHover={{ y: -5 }}
            >
              <div className={`h-full relative rounded-2xl bg-gradient-to-br ${env.color} p-0.5`}>
                <div className="relative rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 group-hover:border-slate-600 transition-all h-full p-8">
                  {/* Header */}
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-4xl">{env.icon}</span>
                      <div>
                        <h3 className="text-2xl font-bold text-white">{env.name}</h3>
                        <p className="text-sm text-slate-400">{env.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-4">
                    {env.features.map((feature, fidx) => (
                      <motion.div
                        key={fidx}
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: idx * 0.2 + fidx * 0.1 }}
                      >
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                            {feature.label}
                          </p>
                          <p className="text-sm text-slate-200">{feature.value}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Arrow showing flow */}
        <motion.div
          className="flex items-center justify-center gap-4 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="flex-1 h-0.5 bg-gradient-to-l from-transparent to-amber-500/50"></div>
          <motion.div
            animate={{ x: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ArrowRight className="w-6 h-6 text-amber-400 rotate-180" />
          </motion.div>
          <div className="flex-1 h-0.5 bg-gradient-to-r from-transparent to-amber-500/50"></div>
        </motion.div>

        {/* Key Challenge */}
        <motion.div
          className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h4 className="font-semibold text-red-300 mb-2">האתגר המרכזי</h4>
              <p className="text-slate-300">
                ב-Development הכל עובד בצוות, אבל ב-Production יש הגדרות IT סגורות שלא תמיד מתאימות. 
                ה-Pinning יכול לא להופיע אם ה-IT Policy לא מוגדר נכון.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Solution Path */}
        <motion.div
          className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <h4 className="font-semibold text-emerald-300 mb-2">הפתרון</h4>
              <p className="text-slate-300">
                עם ההגדרות הנכונות ב-IT, אפשר להציג Pinning גם ב-Production. 
                זה דורש ליווי מקצועי, אבל זה בהחלט אפשרי וזה בדיוק למה אנחנו כאן.
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
