"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassBackground } from "@/components/custom/glass-background";
import {
  CheckCircleIcon,
  LoaderIcon,
  AlertCircleIcon,
  ShareIcon,
  ArrowRightIcon,
} from "lucide-react";
import { toast } from "sonner";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
}

export default function HebrewSubscribePage() {
  const [showPricing, setShowPricing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('starter');
  const [showModal, setShowModal] = useState(false);
  const [modalPlan, setModalPlan] = useState('starter');
  const [isLoading, setIsLoading] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [selectedThumbnail, setSelectedThumbnail] = useState(1);

  // Plan configuration with pricing and details
  const plans = {
    starter: {
      name: 'בסיסי',
      price: 9,
      planId: process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID_STARTER || 'P-2A598482UX823801LNEE374Q',
      features: ['אחסון אתר 1', '500MB שטח דיסק (NVMe)', ' משאבים: 1 vCore (CPU)', ' משאבים: 1GB זיכרון (RAM)', 'משותף בין 60 אתרים']
    },
    plus: {
      name: 'פלוס',
      price: 19,
      planId: process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID_PLUS || 'P-2A945281JW5369441NEE4E6Y',
      features: ['אחסון עד 2 אתרים', '500MB שטח דיסק (NVMe)', ' משאבים: 1 vCore (CPU)', ' משאבים: 1GB זיכרון (RAM)', 'משותף בין 40 אתרים']
    },
    pro: {
      name: 'פרימיום',
      price: 29,
      planId: process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID_PRO || 'P-4YG398112W760284XNEE4GKQ',
      features: ['אחסון עד 2 אתרים', '500MB שטח דיסק (NVMe)', ' משאבים: 1 vCore (CPU)', ' משאבים: 1GB זיכרון (RAM)', 'משותף בין 20 אתרים']
    }
  };

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: ''
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  // Sample carousel items - Hosting Plans
  const carouselThumbnails = [
    {
      id: 1,
      title: "בסיסי",
      label: "₪9/חודש",
      bgColor: "from-blue-500 to-purple-600"
    },
    {
      id: 2,
      title: "פלוס",
      label: "₪19/חודש",
      bgColor: "from-orange-500 to-red-600"
    },
    {
      id: 3,
      title: "פרימיום",
      label: "₪29/חודש",
      bgColor: "from-green-500 to-teal-600"
    }
  ];

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'שם מלא נדרש';
    if (!formData.email.trim()) newErrors.email = 'דוא״ל נדרש';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'דוא״ל לא תקין';
    if (!formData.phone.trim()) newErrors.phone = 'טלפון נדרש';
    else if (!/^\d{10,}$/.test(formData.phone.replace(/\D/g, ''))) newErrors.phone = 'טלפון לא תקין';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle touch events for carousel
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      const nextId = selectedThumbnail < carouselThumbnails.length ? selectedThumbnail + 1 : 1;
      setSelectedThumbnail(nextId);
    }

    if (isRightSwipe) {
      const prevId = selectedThumbnail > 1 ? selectedThumbnail - 1 : carouselThumbnails.length;
      setSelectedThumbnail(prevId);
    }
  };

  // PayPal Integration Effect
  useEffect(() => {
    if (showModal && typeof window !== 'undefined') {
      const script = document.createElement('script');
      // Use sandbox environment for development
      const isSandbox = process.env.NEXT_PUBLIC_PAYPAL_MODE === 'sandbox' || !process.env.NEXT_PUBLIC_PAYPAL_MODE;
      const sdkUrl = isSandbox 
        ? `https://www.sandbox.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'AfpHnFO-NEeZ8gF4IaICl8rjlpEw7WNeUKkPcpMvbQ1V3cgjzJjAsO-V2JA4XLRiUiJE5Ch0eLClAPhv'}&vault=true&intent=subscription`
        : `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'AfpHnFO-NEeZ8gF4IaICl8rjlpEw7WNeUKkPcpMvbQ1V3cgjzJjAsO-V2JA4XLRiUiJE5Ch0eLClAPhv'}&vault=true&intent=subscription`;
      script.src = sdkUrl;
      
      script.onload = () => {
        const containerId = `paypal-button-container-he-${modalPlan}`;
        const planId = plans[modalPlan as keyof typeof plans].planId;

        const container = document.getElementById(containerId);
        if (container) {
          container.innerHTML = '';
          
          if (!formData.email || !formData.phone || !formData.fullName) {
            container.innerHTML = '<div class="text-center py-4 text-gray-500 text-sm">אנא מלא את כל השדות הנדרשים למעלה</div>';
            return;
          }
          
          try {
            (window as any).paypal.Buttons({
              style: {
                shape: 'pill',
                color: 'blue',
                layout: 'vertical',
                label: 'subscribe'
              },
              createSubscription: function(data: any, actions: any) {
                console.log('Creating subscription with plan_id:', planId);
                console.log('User data:', {
                  name: formData.fullName,
                  email: formData.email,
                  phone: formData.phone
                });
                
                // Parse the full name into first and last name
                const nameParts = formData.fullName.trim().split(' ');
                const givenName = nameParts[0];
                const surname = nameParts.slice(1).join(' ') || 'User';
                
                return actions.subscription.create({
                  plan_id: planId,
                  custom_id: formData.email,
                  subscriber: {
                    email_address: formData.email,
                    name: {
                      given_name: givenName,
                      surname: surname
                    },
                    phone: {
                      phone_number: {
                        national_number: formData.phone
                      }
                    }
                  },
                  application_context: {
                    brand_name: 'MYTX',
                    user_action: 'SUBSCRIBE_NOW',
                    locale: 'he-IL',
                    return_url: `${typeof window !== 'undefined' ? window.location.origin : ''}/mytx-hosting?success=true`,
                    cancel_url: `${typeof window !== 'undefined' ? window.location.origin : ''}/mytx-hosting?cancelled=true`
                  }
                });
              },
              onApprove: function(data: any, actions: any) {
                console.log('Subscription approved:', data);
                
                // Save subscription to localStorage
                const subscriptionData = {
                  subscriptionID: data.subscriptionID,
                  email: formData.email,
                  phone: formData.phone,
                  fullName: formData.fullName,
                  plan: modalPlan,
                  timestamp: new Date().toISOString()
                };
                
                localStorage.setItem('subscription_info', JSON.stringify(subscriptionData));
                
                // Optional: Send to backend API to store in database
                fetch('/api/subscriptions/create', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(subscriptionData)
                }).catch(err => console.error('Failed to save subscription to database:', err));
                
                toast.success(`מנוי נוצר בהצלחה: ${data.subscriptionID}`);
                
                setTimeout(() => {
                  setShowModal(false);
                  setFormData({ fullName: '', email: '', phone: '' });
                  toast.success('ברוכים הבאים ל-MYTX!');
                }, 2000);
              },
              onError: function(err: any) {
                console.error('PayPal button error:', err);
                toast.error('שגיאה בעיבוד המנוי. אנא נסה שוב.');
              }
            }).render(`#${containerId}`);
          } catch (error) {
            console.error('Error rendering PayPal button:', error);
            container.innerHTML = '<div class="text-center py-4 text-red-500 text-sm">שגיאה בטעינת כפתור התשלום. אנא רענן את הדף.</div>';
          }
        }
      };

      document.head.appendChild(script);

      return () => {
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      };
    }
  }, [showModal, modalPlan, formData.email, formData.phone, formData.fullName]);

  const handleSubscribeClick = () => {
    if (validateForm()) {
      setShowPricing(true);
    } else {
      toast.error('אנא מלא את כל השדות בתקינות');
    }
  };

  return (
    <>
      <style jsx global>{`
        .navbar-container,
        .footer-container {
          display: none !important;
        }
        html {
          direction: rtl;
          font-family: 'Rubik', 'Almarai', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        body {
          direction: rtl;
          font-family: 'Rubik', 'Almarai', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
      `}</style>

      <div className="min-h-screen flex flex-col items-center justify-center px-4 pt-8 pb-20" dir="rtl" style={{ fontFamily: "'Rubik', 'Almarai', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
        <div className="max-w-4xl mx-auto text-center space-y-3">

          {/* MYTX Logo */}
          <Link href="/" className="inline-block hover:opacity-80 transition-opacity duration-200">
            <div className="text-4xl font-bold">
              <span className="text-cyan-400">MYT</span>
              <span className="text-white">X</span>
            </div>
          </Link>

          {/* Main Title */}
          {!showPricing ? (
            <div className="max-w-3xl mx-auto">
              <p className="text-2xl text-white leading-relaxed font-bold">
                פיתוח, חיבורים וצמיחה עם{" "}
                <span className="text-cyan-400">חבילות האחסון של מיטיקס</span>
              </p>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl text-white leading-relaxed font-bold">
                מה מתאים לכם?
              </h2>
            </div>
          )}

          {/* Carousel or Pricing Plans */}
          {!showPricing ? (
            /* Carousel */
            <div className="relative">
              <div className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl shadow-black/20"></div>
              <div className="relative p-6 space-y-1 overflow-hidden">

                {/* Carousel Container */}
                <div 
                  className="relative h-36 flex items-center justify-center overflow-hidden" 
                  style={{ perspective: '1000px' }}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  {carouselThumbnails.map((thumb, index) => {
                    const isSelected = thumb.id === selectedThumbnail;
                    const selectedIndex = carouselThumbnails.findIndex(t => t.id === selectedThumbnail);
                    
                    const isPrevious = index === selectedIndex - 1;
                    const isNext = index === selectedIndex + 1;
                    
                    if (!isSelected && !isPrevious && !isNext) {
                      return null;
                    }
                    
                    let transform = '';
                    let zIndex = 10;
                    let opacity = 0.6;
                    let scale = 0.8;
                    
                    if (isSelected) {
                      transform = 'translateX(0px) translateZ(0px) rotateY(0deg)';
                      zIndex = 30;
                      opacity = 1;
                      scale = 1;
                    } else if (isPrevious) {
                      transform = 'translateX(80px) translateZ(-100px) rotateY(-25deg)';
                      zIndex = 20;
                      opacity = 0.7;
                      scale = 0.85;
                    } else if (isNext) {
                      transform = 'translateX(-80px) translateZ(-100px) rotateY(25deg)';
                      zIndex = 20;
                      opacity = 0.7;
                      scale = 0.85;
                    }

                    return (
                      <div
                        key={thumb.id}
                        className="absolute transition-all duration-700 ease-out cursor-pointer"
                        style={{
                          transform: `${transform} scale(${scale})`,
                          zIndex,
                          opacity,
                          transformStyle: 'preserve-3d'
                        }}
                        onClick={() => setSelectedThumbnail(thumb.id)}
                      >
                        <div className="relative w-56 h-36 rounded-2xl overflow-hidden">
                          <div className={`absolute inset-0 bg-gradient-to-br ${thumb.bgColor}`}></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center text-white">
                              <p className="font-bold text-lg">{thumb.title}</p>
                            </div>
                          </div>
                          <div className="absolute top-3 right-3">
                            <span className="text-xs bg-black/40 text-white px-2 py-1 rounded-full">
                              {thumb.label}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Carousel Dots */}
                <div className="flex justify-center gap-6 -mt-6">
                  {carouselThumbnails.map((thumb) => (
                    <button
                      key={thumb.id}
                      className={`w-4 h-4 rounded-full transition-all duration-300 ${
                        thumb.id === selectedThumbnail
                          ? 'bg-cyan-400'
                          : 'bg-white/30 hover:bg-white/50'
                      }`}
                      onClick={() => setSelectedThumbnail(thumb.id)}
                    />
                  ))}
                </div>

                {/* Information Section */}
                <div className="pt-8 space-y-4">
                  <div className="space-y-3 text-right">
                    <h3 className="text-xl font-bold text-white">קבלו גישה בשבוע הראשון בחינם</h3>
                    <p className="text-white/80 text-sm">
                     ביטול אפשרי בכל עת לפני תום השבוע ללא עלות. 
                    </p>
                              <p className="text-white/80 text-sm">
                     לאחר תחילת המנוי ניתן לבטל בכל עת
                    </p>
                  </div>

                  {/* Email, Phone, Name inputs */}
                  <div className="space-y-3 max-w-md mx-auto">
                    <div>
                      <label className="block text-white/80 text-xs font-medium mb-1 text-right">
                        שם מלא *
                      </label>
                      <input
                        type="text"
                        placeholder="הזינו את שמכם המלא"
                        value={formData.fullName}
                        onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                        className={`w-full px-3 py-2 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm ${
                          errors.fullName ? 'border-red-500' : 'border-white/20'
                        }`}
                        style={{ direction: 'rtl' }}
                      />
                      {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>}
                    </div>

                    <div>
                      <label className="block text-white/80 text-xs font-medium mb-1 text-right">
                        דוא״ל *
                      </label>
                      <input
                        type="email"
                        placeholder="הזינו את דוא״לכם"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className={`w-full px-3 py-2 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm ${
                          errors.email ? 'border-red-500' : 'border-white/20'
                        }`}
                        style={{ direction: 'ltr' }}
                      />
                      {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-white/80 text-xs font-medium mb-1 text-right">
                        טלפון *
                      </label>
                      <input
                        type="tel"
                        placeholder="הזינו את מספר הטלפון שלכם"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value.replace(/\D/g, '') }))}
                        className={`w-full px-3 py-2 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm ${
                          errors.phone ? 'border-red-500' : 'border-white/20'
                        }`}
                        style={{ direction: 'ltr' }}
                      />
                      {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  <Button 
                    onClick={handleSubscribeClick}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 px-12 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 text-base w-full max-w-md"
                  >
                    תצוגת תוכניות
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            /* Pricing Plans */
            <div className="w-full max-w-6xl mx-auto">
              {/* Mobile Tabs */}
              <div className="md:hidden mb-6">
                <div className="flex bg-white/10 backdrop-blur-md rounded-2xl p-1 border border-white/20 overflow-x-auto">
                  <button
                    onClick={() => setSelectedPlan('starter')}
                    className={`py-3 px-3 rounded-xl text-xs font-semibold transition-all duration-300 whitespace-nowrap ${
                      selectedPlan === 'starter'
                        ? 'bg-white text-black shadow-lg'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    בסיסי
                  </button>
                  <button
                    onClick={() => setSelectedPlan('plus')}
                    className={`py-3 px-3 rounded-xl text-xs font-semibold transition-all duration-300 whitespace-nowrap ${
                      selectedPlan === 'plus'
                        ? 'bg-white text-black shadow-lg'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    פלוס
                  </button>
                  <button
                    onClick={() => setSelectedPlan('pro')}
                    className={`py-3 px-3 rounded-xl text-xs font-semibold transition-all duration-300 whitespace-nowrap ${
                      selectedPlan === 'pro'
                        ? 'bg-white text-black shadow-lg'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    פרימיום
                  </button>
                </div>
              </div>

              {/* Desktop Grid - 3 Columns */}
              <div className="md:grid md:grid-cols-3 md:gap-6">

                {/* Starter Plan */}
                <div className={`${selectedPlan === 'starter' ? 'block' : 'hidden'} md:block mb-6 md:mb-0`}>
                  <div className="relative h-full">
                    <div className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl shadow-black/20"></div>
                    <div className="relative p-8 text-center space-y-6 h-full flex flex-col">
                      <div>
                        <div className="text-4xl font-bold text-white mb-2">
                          <span className="text-3xl">₪</span>{plans.starter.price}<span className="text-lg">/חודש</span>
                        </div>
                        <h3 className="text-xl font-semibold text-white">{plans.starter.name}</h3>
                      </div>
                      
                      <div className="space-y-3 flex-grow">
                        {plans.starter.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center justify-between gap-4" dir="rtl">
                            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <span className="text-white text-sm flex-grow">{feature}</span>
                          </div>
                        ))}
                      </div>

                      <Button 
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl"
                        onClick={() => {
                          setModalPlan('starter');
                          setShowModal(true);
                        }}
                      >
                        קבלו גישה
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Plus Plan */}
                <div className={`${selectedPlan === 'plus' ? 'block' : 'hidden'} md:block mb-6 md:mb-0`}>
                  <div className="relative h-full">
                    <div className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl shadow-black/20"></div>
                    <div className="relative p-8 text-center space-y-6 h-full flex flex-col">
                      <div>
                        <div className="text-4xl font-bold text-white mb-2">
                          <span className="text-3xl">₪</span>{plans.plus.price}<span className="text-lg">/חודש</span>
                        </div>
                        <h3 className="text-xl font-semibold text-white">{plans.plus.name}</h3>
                        <p className="text-xs text-cyan-400 mt-1">הבחירה הפופולרית</p>
                      </div>
                      
                      <div className="space-y-3 flex-grow">
                        {plans.plus.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center justify-between gap-4" dir="rtl">
                            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <span className="text-white text-sm flex-grow">{feature}</span>
                          </div>
                        ))}
                      </div>

                      <Button 
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl"
                        onClick={() => {
                          setModalPlan('plus');
                          setShowModal(true);
                        }}
                      >
                        קבלו גישה
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Pro Plan */}
                <div className={`${selectedPlan === 'pro' ? 'block' : 'hidden'} md:block`}>
                  <div className="relative h-full">
                    <div className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl shadow-black/20"></div>
                    <div className="relative p-8 text-center space-y-6 h-full flex flex-col">
                      <div>
                        <div className="text-4xl font-bold text-white mb-2">
                          <span className="text-3xl">₪</span>{plans.pro.price}<span className="text-lg">/חודש</span>
                        </div>
                        <h3 className="text-xl font-semibold text-white">{plans.pro.name}</h3>
                        <p className="text-xs text-cyan-400 mt-1">ביצועים מיטביים</p>
                      </div>
                      
                      <div className="space-y-3 flex-grow">
                        {plans.pro.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center justify-between gap-4" dir="rtl">
                            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <span className="text-white text-sm flex-grow">{feature}</span>
                          </div>
                        ))}
                      </div>

                      <Button 
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl"
                        onClick={() => {
                          setModalPlan('pro');
                          setShowModal(true);
                        }}
                      >
                        קבלו גישה
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-lg flex items-center justify-center p-3 z-50" dir="rtl">
            <div className="relative w-full max-w-md mx-auto">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl shadow-black/30"></div>
              <div className="relative p-6 space-y-6 max-h-[90vh] overflow-y-auto">

                {/* Close Button */}
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all duration-200 z-10"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* MYTX Logo */}
                <div className="text-center">
                  <div className="text-3xl font-bold mb-4">
                    <span className="text-cyan-400">MYT</span>
                    <span className="text-white">X</span>
                  </div>
                </div>

                {/* Title and Trial Info */}
                <div className="text-center space-y-2">
                  <h2 className="text-xl font-semibold text-white">השלימו את ההרשמה</h2>
                  <div className="text-cyan-400 font-medium">7 ימים חינם</div>
                </div>

                {/* Summary of Form Data */}
                <div className="space-y-2 p-3 bg-white/5 border border-white/10 rounded-lg text-right">
                  <div className="text-sm text-white/80">
                    <p><strong>שם:</strong> {formData.fullName}</p>
                    <p><strong>דוא״ל:</strong> {formData.email}</p>
                    <p><strong>טלפון:</strong> {formData.phone}</p>
                  </div>
                </div>

                {/* PayPal Container */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-3 text-right">
                    שיטת תשלום
                  </label>
                  <div 
                    id={`paypal-button-container-he-${modalPlan}`}
                    className="bg-white border border-white/20 rounded-2xl p-4 backdrop-blur-sm"
                  ></div>
                </div>

                {/* Disclaimer */}
                <div className="text-center">
                  <p className="text-white/60 text-xs leading-relaxed">
                    לא נחייב אותך אלא אם תמשיך עם התוכנית לאחר 7 ימים וניידיע לך מראש. אתה יכול לבטל בכל עת.{" "}
                    <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">תנאים ותביעות</a>
                  </p>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
