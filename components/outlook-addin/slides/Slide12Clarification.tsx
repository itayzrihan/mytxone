'use client';

import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react';

interface SlideProps {
  slideNumber: number;
  totalSlides: number;
}

const issues = [
  {
    title: 'Manifest XML Syntax Error',
    icon: '❌',
    problem: 'Missing closing tags or malformed XML structure',
    solution: 'Validate XML syntax, check all tags are properly closed',
    code: '<Host xsi:type="MailHost"> <!-- Missing closing tag -->',
    codeCorrect: '<Host xsi:type="MailHost"><!-- content --></Host>',
  },
  {
    title: 'Pinning Configuration Missing',
    icon: '⚙️',
    problem: 'Manifest exists but pinning settings not configured',
    solution: 'Add pinning: true and defaultSettings to config',
    code: '{ "addInName": "MyAddin" } // Missing pinning config',
    codeCorrect: '{ "addInName": "MyAddin", "pinning": true, "defaultSettings": { "pinned": true } }',
  },
  {
    title: 'IT Policy Blocking',
    icon: '🚫',
    problem: 'AllowOrgAddins = FALSE or Addin in blacklist',
    solution: 'Update Exchange settings: AllowOrgAddins = TRUE',
    code: 'AllowOrgAddins = FALSE ❌',
    codeCorrect: 'AllowOrgAddins = TRUE ✅',
  },
];

export default function Slide12Clarification({ slideNumber, totalSlides }: SlideProps) {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-950 via-red-950 to-slate-900 flex flex-col p-12 relative overflow-hidden font-heebo" dir="rtl">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500 rounded-full blur-3xl"
          animate={{ y: [0, 30, 0] }}
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
            🎯 הבהרה עמוקה של הצרכים
          </motion.h2>
          <motion.p
            className="text-lg text-slate-400"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            סוגיות נפוצות שראינו בעבר ואיך אנחנו פותרים אותן
          </motion.p>
        </div>

        {/* Issues */}
        <div className="flex-1 overflow-y-auto scrollbar-hide pr-4 space-y-4">
          {issues.map((issue, idx) => (
            <motion.div
              key={idx}
              className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-3"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              {/* Title */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{issue.icon}</span>
                <h3 className="text-lg font-bold text-white">{issue.title}</h3>
              </div>

              {/* Problem & Solution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-red-500/10 border border-red-500/30 rounded p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span className="text-xs font-semibold text-red-300">PROBLEM</span>
                  </div>
                  <p className="text-sm text-slate-300">{issue.problem}</p>
                </div>

                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-semibold text-emerald-300">SOLUTION</span>
                  </div>
                  <p className="text-sm text-slate-300">{issue.solution}</p>
                </div>
              </div>

              {/* Code Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900/80 border border-red-500/20 rounded p-3 font-mono text-xs overflow-x-auto">
                  <div className="text-red-400 mb-1">❌ Before</div>
                  <code className="text-slate-300">{issue.code}</code>
                </div>

                <div className="bg-slate-900/80 border border-emerald-500/20 rounded p-3 font-mono text-xs overflow-x-auto">
                  <div className="text-emerald-400 mb-1">✅ After</div>
                  <code className="text-slate-300">{issue.codeCorrect}</code>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom - Debugging Guide */}
        <motion.div
          className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-6 mt-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-start gap-3 mb-4">
            <span className="text-2xl">🔍</span>
            <h3 className="text-lg font-bold text-white">Debugging Methodology</h3>
          </div>

          <div className="space-y-2 text-sm text-slate-300">
            <p>
              <strong className="text-purple-300">1. Can you see the Addin at all?</strong> → If NO, check server-level issues. If YES, proceed to step 2.
            </p>
            <p>
              <strong className="text-purple-300">2. Is Pinning toggle visible?</strong> → If NO, UI rendering issue. If YES, proceed to step 3.
            </p>
            <p>
              <strong className="text-purple-300">3. Does click persist?</strong> → If NO, browser cache issue. If YES, config persistence problem.
            </p>
            <p>
              <strong className="text-purple-300">4. Check logs</strong> → Export dev console logs and share with us immediately.
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
