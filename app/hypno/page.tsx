"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://dg.mytx.co";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "חוו את כוח ההיפנוזה | MyTx One",
  description: "הצטרפו לתוכנית ההיפנוזה שלנו וגלו את הפוטנציאל הלא מודע שלכם. סשנים מקצועיים של היפנוטראפיה שעוצבו לתמורה אישית וגדילה.",
  keywords: "היפנוזה, היפנוטראפיה, התפתחות אישית, שיפור עצמי",
  openGraph: {
    title: "חוו את כוח ההיפנוזה | MyTx One",
    description: "הצטרפו לתוכנית ההיפנוזה שלנו וגלו את הפוטנציאל הלא מודע שלכם. סשנים מקצועיים של היפנוטראפיה שעוצבו לתמורה אישית וגדילה.",
    locale: "he_IL",
    images: [
      {
        url: `${baseUrl}/thumbails/hyno/hypno.jpg`,
        width: 1200,
        height: 630,
        alt: "היפנוזה - תוכנית התפתחות אישית",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "חוו את כוח ההיפנוזה | MyTx One",
    description: "הצטרפו לתוכנית ההיפנוזה שלנו וגלו את הפוטנציאל הלא מודע שלכם.",
    images: [`${baseUrl}/thumbails/hyno/hypno.jpg`],
  },
};

interface FormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  allowCommunication: boolean;
}

const HypnoLandingPage = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phoneNumber: "",
    allowCommunication: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [submitMessage, setSubmitMessage] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const formRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Track mouse position for mystical effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/hypnosis/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus("success");
        setSubmitMessage(
          data.message || "🎆 Your free e-book awaits! Check your email..."
        );
        setFormData({
          fullName: "",
          email: "",
          phoneNumber: "",
          allowCommunication: true,
        });
        
        // Redirect to e-book download page after 2 seconds
        setTimeout(() => {
          router.push("/hypno/ebook1");
        }, 2000);
      } else {
        setSubmitStatus("error");
        setSubmitMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setSubmitStatus("error");
      setSubmitMessage("Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
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

        {/* Cursor glow effect */}
        <motion.div
          className="absolute w-32 h-32 bg-pink-500 rounded-full blur-2xl opacity-10"
          animate={{
            x: mousePosition.x - 64,
            y: mousePosition.y - 64,
          }}
          transition={{ type: "spring", damping: 30, stiffness: 200 }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8">
        {/* Header Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-black text-white mb-4 drop-shadow-2xl font-serif">
            להפנט את היקום
          </h1>
          <p className="text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 font-light mb-2">
            Hypnotize the Universe
          </p>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto font-light">
            מאת: איתי זריהן
          </p>
        </motion.div>

        {/* Main Content Container */}
        <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center">
          {/* Left Column - Book Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-gray-200 space-y-6"
          >
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-white">
                פתחו את עולמכם לאפשרויות אינסופיות
              </h2>
              <p className="text-gray-300 leading-relaxed">
                גלו את העולם הנסתר שקיים מעבר לפיזי. למדו את הסודות העמוקים של ההיפנוזה, 
                התודעה, והכוח הגדול שטמון בתוככם.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-1 bg-gradient-to-b from-pink-500 to-purple-600"></div>
                <div>
                  <h3 className="font-bold text-white mb-1">הבנת ההיפנוזה</h3>
                  <p className="text-sm text-gray-400">
                    היפנוזה אינה מה שאתם חושבים שהיא. גילוי האמת שמוסתרת מעיניכם.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-1 bg-gradient-to-b from-purple-500 to-indigo-600"></div>
                <div>
                  <h3 className="font-bold text-white mb-1">ידע אתי ואחראי</h3>
                  <p className="text-sm text-gray-400">
                    למדו כיצד להגן על עצמכם ולהשתמש בכוחות אלה למטרות הטובות.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-1 bg-gradient-to-b from-indigo-500 to-pink-600"></div>
                <div>
                  <h3 className="font-bold text-white mb-1">שנו את המציאות שלכם</h3>
                  <p className="text-sm text-gray-400">
                    אם לא תבינו את הכוחות הללו, לא תוכלו לשלוט בחייכם. זה הזמן להשתנות.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Form */}
          <motion.div
            ref={formRef}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            {/* Form Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-600/20 to-purple-600/20 rounded-2xl blur-xl"></div>

            {/* Form Container */}
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6">
                קבלו את הספר במתנה!
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    שם מלא *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    placeholder="שם מלא"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:bg-white/15 transition"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    כתובת אימייל *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:bg-white/15 transition"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    מספר טלפון *
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                    placeholder="050-000-0000"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:bg-white/15 transition"
                  />
                </div>

                {/* Checkbox */}
                <div className="space-y-3 pt-2">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      name="allowCommunication"
                      checked={formData.allowCommunication}
                      onChange={handleInputChange}
                      className="mt-1 w-5 h-5 accent-pink-500 rounded cursor-pointer"
                    />
                    <span className="text-sm text-gray-300 group-hover:text-white transition">
                      יש לכם אישור ממני לשלוח לי את הספר וקבל עדכונים ותוכן אקסקלוסיבי שיווקי בנושא היפנוזה וידע רוחני
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-6 py-3 px-6 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      בטעינה...
                    </span>
                  ) : (
                    "פתח את הספר החינם 🔓"
                  )}
                </button>

                {/* Status Messages */}
                {submitStatus === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-200 text-sm text-center"
                  >
                    ✨ {submitMessage}
                  </motion.div>
                )}

                {submitStatus === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center flex items-center gap-2 justify-center"
                  >
                    <AlertCircle size={16} /> {submitMessage}
                  </motion.div>
                )}
              </form>

              <p className="text-xs text-gray-500 text-center mt-6">
                הפרטיות שלך קדושה. אנו מכבדים את התודעה שלך.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section - Benefits */}
        <motion.div
          className="mt-16 w-full max-w-5xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "100% חינם", desc: "ללא תשלומים נסתרים, לחלוטין חינם" },
              { title: "גישה מיידית", desc: "קבלו את הספר בתוך דקות לאימייל שלכם" },
              { title: "שינוי חיים", desc: "שנו את ההבנה שלכם על התודעה" },
            ].map((item, i) => (
              <div
                key={i}
                className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-lg text-center hover:bg-white/10 transition"
              >
                <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Mystical Quote */}
        <motion.div
          className="mt-16 text-center max-w-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.8 }}
        >
          <p className="text-gray-400 italic text-lg leading-relaxed">
            &quot;כשיש לך את הידע הזה, העולם משתנה. לא המציאות משתנה, אלא תפיסתך שלה.&quot;
          </p>
          <p className="text-gray-500 text-sm mt-4">— איתי זריהן</p>
        </motion.div>
      </div>
    </div>
  );
};

export default HypnoLandingPage;
