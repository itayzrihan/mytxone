'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface SlideProps {
  slideNumber: number;
  totalSlides: number;
}

export default function Slide7Configuration({ slideNumber, totalSlides }: SlideProps) {
  const configurations = [
    {
      title: 'Exchange Policy',
      icon: '⚙️',
      items: ['AllowOrgAddins = True', 'DisabledAddins = []', 'Tenant-wide settings'],
      color: 'from-blue-400 to-cyan-400',
    },
    {
      title: 'Manifest Configuration',
      icon: '📄',
      items: ['Pinning = Enabled', 'DefaultSettings { pinned: true }', 'Security headers'],
      color: 'from-purple-400 to-pink-400',
    },
    {
      title: 'User Permissions',
      icon: '👤',
      items: ['Addin Rights = Full', 'Manifest Access = Allowed', 'Group Policy'],
      color: 'from-emerald-400 to-teal-400',
    },
    {
      title: 'Browser Support',
      icon: '🌐',
      items: ['Edge/Chrome: Version 90+', 'IE11 Mode: Not Supported', 'Cache clearing'],
      color: 'from-amber-400 to-orange-400',
    },
  ];

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex flex-col p-12 relative overflow-hidden font-heebo" dir="rtl">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1] }}
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
        <div className="mb-10">
          <motion.h2
            className="text-5xl font-bold text-white mb-3"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            ⚙️ ההגדרות הטכניות הנדרשות
          </motion.h2>
          <motion.p
            className="text-lg text-slate-400"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            מה צריך להיות מוגדר כדי שהכל יעבוד
          </motion.p>
        </div>

        {/* Configuration Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 mb-10">
          {configurations.map((config, idx) => (
            <motion.div
              key={idx}
              className="group"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className={`h-full rounded-xl bg-gradient-to-br ${config.color} p-0.5`}>
                <div className="relative rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 group-hover:border-slate-600 transition-all h-full p-6 flex flex-col">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-3xl">{config.icon}</span>
                    <h3 className="text-lg font-bold text-white">{config.title}</h3>
                  </div>

                  <div className="space-y-3 flex-1">
                    {config.items.map((item, iidx) => (
                      <motion.div
                        key={iidx}
                        className="flex items-start gap-3 p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-all"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: idx * 0.1 + iidx * 0.08 }}
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <code className="text-xs text-slate-300 font-mono">{item}</code>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Slide Counter */}
      <div className="text-right text-sm text-slate-500 pt-6 border-t border-slate-700/50">
        Slide {slideNumber} / {totalSlides}
      </div>
    </div>
  );
}
