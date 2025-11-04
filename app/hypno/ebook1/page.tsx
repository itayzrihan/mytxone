"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Download, CheckCircle, BookOpen, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dg.mytx.co";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "להיפנוטיז את היקום | ספר אלקטרוני חינם | MyTx One",
  description: "הורידו את ספר האלקטרוני הבלעדי שלנו 'להיפנוטיז את היקום' - למדו טכניקות היפנוזה מתקדמות וגלו את כוח המוח שלכם. הורדה חינמית זמינה כעת.",
  keywords: "היפנוזה, ספר אלקטרוני, התפתחות אישית, כוח המוח, תת-הכרה",
  openGraph: {
    title: "להיפנוטיז את היקום | ספר אלקטרוני חינם | MyTx One",
    description: "הורידו את ספר האלקטרוני הבלעדי שלנו 'להיפנוטיז את היקום' - למדו טכניקות היפנוזה מתקדמות.",
    type: "article",
    locale: "he_IL",
    images: [
      {
        url: `${baseUrl}/thumbails/hyno/hypno.jpg`,
        width: 1200,
        height: 630,
        alt: "להיפנוטיז את היקום - ספר אלקטרוני",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "להיפנוטיז את היקום | ספר אלקטרוני חינם",
    description: "הורידו ספר אלקטרוני בלעדי של היפנוזה עם טכניקות מתקדמות.",
    images: [`${baseUrl}/thumbails/hyno/hypno.jpg`],
  },
};

const EbookDownloadPage = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    
    try {
      // Simulate a brief delay for UX feedback
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Trigger download
      const link = document.createElement("a");
      link.href = "/files/ebooks/to-hyno-the-universe.pdf.pdf";
      link.download = "להפנט את היקום - To Hypnotize the Universe.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setDownloadComplete(true);
      setIsDownloading(false);
    } catch (error) {
      console.error("Download error:", error);
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden relative bg-gradient-to-br from-slate-950 via-purple-900 to-slate-950" dir="rtl" lang="he">
      {/* Mystical Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Animated orbs */}
        <motion.div
          className="absolute w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-20"
          animate={{
            x: [0, 100, -100, 0],
            y: [0, -100, 100, 0],
          }}
          transition={{ duration: 15, repeat: Infinity }}
          style={{ top: "10%", left: "10%" }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-indigo-600 rounded-full blur-3xl opacity-20"
          animate={{
            x: [0, -100, 100, 0],
            y: [0, 100, -100, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, delay: 2 }}
          style={{ bottom: "10%", right: "10%" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8">
        {/* Back Button */}
        <motion.div
          className="absolute top-8 left-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/hypno"
            className="flex items-center gap-2 text-gray-300 hover:text-white transition group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition" />
            <span className="text-sm">חזור</span>
          </Link>
        </motion.div>

        {/* Main Container */}
        <motion.div
          className="w-full max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Success Message */}
          <div className="text-center mb-12">
            <motion.div
              className="inline-block mb-6"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <CheckCircle className="w-20 h-20 text-green-400" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 drop-shadow-2xl font-serif">
              🎉 ברוכים הבאים, מחפשי הידע
            </h1>
            <p className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 mb-3">
              המסע שלכם לתודעה מתחיל עכשיו
            </p>
            <p className="text-gray-300 text-lg">
              הספר החינם שלכם מוכן להורדה
            </p>
          </div>

          {/* E-Book Info Card */}
          <motion.div
            className="relative mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Card Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-600/20 to-purple-600/20 rounded-2xl blur-xl"></div>

            {/* Card Container */}
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-10 shadow-2xl">
              <div className="flex gap-6 items-start">
                {/* Book Icon */}
                <motion.div
                  className="flex-shrink-0"
                  animate={{ rotateZ: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <BookOpen className="w-16 h-16 text-purple-400" />
                </motion.div>

                {/* Book Details */}
                <div className="flex-1">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    להפנט את היקום
                  </h2>
                  <p className="text-lg text-gray-300 mb-1">
                    Hypnotize the Universe
                  </p>
                  <p className="text-gray-400 mb-4">
                    מאת איתי זריהן (Itay Zrihan)
                  </p>
                  <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                    גלה את העולם הנסתר מעבר לפיזי. למד את הסודות העמוקים של ההיפנוזה, התודעה, והכוח העצום שטמון בתוכך. מדריך משנה חיים זה חוקק ידע אתי שישנה לחלוטין את הדרך שבה אתה רואה מציאות.
                  </p>
                </div>
              </div>

              {/* Features */}
              <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-400 mb-1">פורמט</p>
                  <p className="text-white font-semibold">PDF</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-400 mb-1">שפה</p>
                  <p className="text-white font-semibold">עברית ואנגלית</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-400 mb-1">גישה</p>
                  <p className="text-white font-semibold">לכל החיים</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Download Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-8"
          >
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="w-full py-4 px-8 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-lg rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95"
            >
              {isDownloading ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  בהכנה להורדה...
                </span>
              ) : downloadComplete ? (
                <span className="flex items-center justify-center gap-2">
                  <CheckCircle size={24} />
                  ההורדה התחילה! ✨
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Download size={24} />
                  הורד את הספר עכשיו
                </span>
              )}
            </button>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="space-y-4"
          >
            <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
              <p className="text-sm text-gray-300">
                <span className="font-semibold text-white">📧 משלוח בדוא&quot;ל:</span> הספר נשלח גם לכתובת הדוא&quot;ל שלכם כדי שתוכלו לשמור עליו.
              </p>
            </div>

            <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
              <p className="text-sm text-gray-300">
                <span className="font-semibold text-white">🔐 הפרטיות שלכם:</span> אנחנו מכבדים את התודעה שלכם. המידע שלכם ישמש רק למטרות שהסכמתם להן.
              </p>
            </div>

            <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
              <p className="text-sm text-gray-300">
                <span className="font-semibold text-white">✨ המסע שלכם:</span> פתחו את הספר כאשר אתם מוכנים. אין שום חיפזון. הידע יחכה לכם.
              </p>
            </div>
          </motion.div>

          {/* Mystical Quote */}
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <p className="text-gray-400 italic text-lg leading-relaxed mb-2">
              &quot;The universe hypnotizes you every moment. Now, learn to hypnotize it back.&quot;
            </p>
            <p className="text-gray-500 text-sm">
              — From your e-book
            </p>
          </motion.div>
        </motion.div>

        {/* Footer CTA */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <p className="text-gray-400 mb-4">
            יש לכם שאלות או רוצים לשתף את החוויה שלכם?
          </p>
          <a
            href="mailto:hello@mytx.one"
            className="inline-block text-pink-300 hover:text-pink-200 transition font-semibold"
          >
            יצרו קשר ←
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default EbookDownloadPage;
