"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useAuth } from "@/components/custom/auth-context";

// Sample thumbnails for the carousel
const carouselThumbnails = [
  {
    id: 1,
    title: "Weekly Team Sync",
    label: "Premium Community",
    image: "/images/meeting-thumb-1.jpg",
    bgColor: "from-blue-500 to-purple-600"
  },
  {
    id: 2,
    title: "MYTX Community Hub",
    label: "Free Access",
    image: "/images/meeting-thumb-2.jpg", 
    bgColor: "from-orange-500 to-red-600"
  },
  {
    id: 3,
    title: "Growth Academy",
    label: "Business Network",
    image: "/images/meeting-thumb-3.jpg",
    bgColor: "from-green-500 to-teal-600"
  },
  {
    id: 4,
    title: "Future Builders",
    label: "Startup Community",
    image: "/images/meeting-thumb-4.jpg",
    bgColor: "from-purple-500 to-pink-600"
  },
  {
    id: 5,
    title: "Innovation Hub",
    label: "Tech Meetup",
    image: "/images/meeting-thumb-5.jpg",
    bgColor: "from-cyan-500 to-blue-600"
  }
];

export default function CreateMeetingPage() {
  const [selectedThumbnail, setSelectedThumbnail] = useState(1);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [showPricing, setShowPricing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('basic'); // 'basic' or 'pro'
  const [showModal, setShowModal] = useState(false);
  const [modalPlan, setModalPlan] = useState('basic'); // Plan selected in modal
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { openAuthModal, isAuthModalOpen } = useAuth();
  const [formData, setFormData] = useState({
    communityName: '',
    cardNumber: '',
    expiryDate: '',
    csv: ''
  });

  // Check user authentication status - only once on mount
  useEffect(() => {
    let isMounted = true;
    
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        if (response.ok && isMounted) {
          const sessionData = await response.json();
          setUser(sessionData?.user || null);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    checkAuth();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Handle create meeting button click - simplified
  const handleCreateMeeting = () => {
    if (!user) {
      openAuthModal('login');
    } else {
      setShowPricing(true);
    }
  };

  // Simple check after auth modal closes - no polling
  useEffect(() => {
    if (!isAuthModalOpen && !user) {
      const recheckAuth = async () => {
        try {
          const response = await fetch('/api/auth/session', {
            cache: 'no-store',
            headers: {
              'Cache-Control': 'no-cache'
            }
          });
          if (response.ok) {
            const sessionData = await response.json();
            if (sessionData?.user) {
              setUser(sessionData.user);
              // Don't automatically show pricing, let user click again
            }
          }
        } catch (error) {
          // Silent fail
        }
      };
      
      const timeoutId = setTimeout(recheckAuth, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [isAuthModalOpen]);

  // Handle touch start
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  // Handle touch move
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  // Handle touch end - determine swipe direction
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      // Swipe left - go to next
      const nextId = selectedThumbnail < carouselThumbnails.length ? selectedThumbnail + 1 : 1;
      setSelectedThumbnail(nextId);
    }

    if (isRightSwipe) {
      // Swipe right - go to previous
      const prevId = selectedThumbnail > 1 ? selectedThumbnail - 1 : carouselThumbnails.length;
      setSelectedThumbnail(prevId);
    }
  };

  // Handle expiry date formatting
  const handleExpiryDateChange = (value: string) => {
    // Remove all non-digit characters
    const digitsOnly = value.replace(/\D/g, '');
    
    // Format as MM/YY
    let formatted = digitsOnly;
    if (digitsOnly.length >= 2) {
      formatted = digitsOnly.slice(0, 2) + '/' + digitsOnly.slice(2, 4);
    }
    
    // Update state
    setFormData(prev => ({ ...prev, expiryDate: formatted }));
  };

  // Handle card number formatting with visual spaces
  const handleCardNumberChange = (value: string) => {
    // Remove all non-digit characters
    const digitsOnly = value.replace(/\D/g, '');
    
    // Format with spaces every 4 digits
    const formatted = digitsOnly.replace(/(\d{4})(?=\d)/g, '$1 ');
    
    // Update state
    setFormData(prev => ({ ...prev, cardNumber: formatted }));
  };

  // PayPal Integration Effect
  useEffect(() => {
    if (showModal && typeof window !== 'undefined') {
      // Load PayPal SDK dynamically
      const script = document.createElement('script');
      script.src = modalPlan === 'basic' 
        ? "https://www.paypal.com/sdk/js?client-id=ARMvBbzMghnZIpuJv0MUfhxI2cAMK8-Bhk-DIganTEWt1qJRbFCPuQx6VKZcKahdjOooF9NOz7KTL5vy&vault=true&intent=subscription"
        : "https://www.paypal.com/sdk/js?client-id=AfpHnFO-NEeZ8gF4IaICl8rjlpEw7WNeUKkPcpMvbQ1V3cgjzJjAsO-V2JA4XLRiUiJE5Ch0eLClAPhv&vault=true&intent=subscription";
      
      script.onload = () => {
        // Initialize PayPal button
        const containerId = modalPlan === 'basic' 
          ? 'paypal-button-container-P-5LP69495C05013828NDDAIUY'
          : 'paypal-button-container-P-59286886LU147733XNDDAKDQ';
        
        const planId = modalPlan === 'basic' 
          ? 'P-5LP69495C05013828NDDAIUY'
          : 'P-59286886LU147733XNDDAKDQ';

        // Clear existing button
        const container = document.getElementById(containerId);
        if (container) {
          container.innerHTML = '';
          
          // Check if required fields are filled
          const isFormValid = user?.email && formData.communityName;
          
          if (!isFormValid) {
            container.innerHTML = '<div class="text-center py-4 text-gray-500 text-sm">Please fill in all required fields above</div>';
            return;
          }
          
          // Render PayPal button
          (window as any).paypal.Buttons({
            style: {
              shape: 'pill',
              color: 'blue',
              layout: 'vertical',
              label: 'subscribe'
            },
            createSubscription: function(data: any, actions: any) {
              return actions.subscription.create({
                plan_id: planId,
                custom_id: user?.email, // Store email as custom ID for tracking
                subscriber: {
                  email_address: user?.email,
                  name: {
                    given_name: formData.communityName || 'Community Admin'
                  }
                },
                application_context: {
                  brand_name: 'MYTX',
                  user_action: 'SUBSCRIBE_NOW'
                }
              });
            },
            onApprove: function(data: any, actions: any) {
              alert(`Subscription created: ${data.subscriptionID}`);
              // You can add success handling here
              setShowModal(false);
            }
          }).render(`#${containerId}`);
        }
      };

      document.head.appendChild(script);

      // Cleanup function
      return () => {
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      };
    }
  }, [showModal, modalPlan, user?.email, formData.communityName]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 pt-8 pb-20">
      {isLoading ? (
        <div className="text-center">
          <div className="text-4xl font-bold mb-4">
            <span className="text-cyan-400">MYT</span>
            <span className="text-white">X</span>
          </div>
          <div className="text-white/60">Loading...</div>
        </div>
      ) : (
        <>
          <div className="max-w-4xl mx-auto text-center space-y-3">
        
        {/* MYTX Logo - Smaller and with more space above */}
        <div className="text-4xl font-bold">
          <span className="text-cyan-400">MYT</span>
          <span className="text-white">X</span>
        </div>

        {/* Inspirational Statement or What's best for you */}
        {!showPricing ? (
          <div className="max-w-3xl mx-auto">
            <p className="text-2xl text-white leading-relaxed">
              Build, connect, and grow with{" "}
              <span className="text-cyan-400">tomorrow's community leaders.</span>
            </p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl text-white leading-relaxed">
              What's best for you?
            </h2>
          </div>
        )}

        {/* Carousel or Pricing Plans */}
        {!showPricing ? (
          /* Glassmorphism Card with Carousel */
          <div className="relative">
            <div className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl shadow-black/20"></div>
            <div className="relative p-6 space-y-1 overflow-hidden">
              
              {/* Carousel Container - with overflow hidden */}
              <div 
                className="relative h-36 flex items-center justify-center overflow-hidden" 
                style={{ perspective: '1000px' }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                
                {/* Show only previous, current, and next thumbnails */}
                {carouselThumbnails.map((thumb, index) => {
                  const isSelected = thumb.id === selectedThumbnail;
                  const selectedIndex = carouselThumbnails.findIndex(t => t.id === selectedThumbnail);
                  
                  // Only show current, previous, and next
                  const isPrevious = index === selectedIndex - 1;
                  const isNext = index === selectedIndex + 1;
                  
                  // Don't render if not in visible range
                  if (!isSelected && !isPrevious && !isNext) {
                    return null;
                  }
                  
                  let transform = '';
                  let zIndex = 10;
                  let opacity = 0.6;
                  let scale = 0.8;
                  let blur = 'blur(0px)';
                  
                  if (isSelected) {
                    transform = 'translateX(0px) translateZ(0px) rotateY(0deg)';
                    zIndex = 30;
                    opacity = 1;
                    scale = 1;
                    blur = 'blur(0px)';
                  } else if (isPrevious) {
                    transform = 'translateX(-80px) translateZ(-100px) rotateY(-25deg)';
                    zIndex = 20;
                    opacity = 0.7;
                    scale = 0.85;
                    blur = 'blur(0px)';
                  } else if (isNext) {
                    transform = 'translateX(80px) translateZ(-100px) rotateY(25deg)';
                    zIndex = 20;
                    opacity = 0.7;
                    scale = 0.85;
                    blur = 'blur(0px)';
                  }

                  return (
                    <div
                      key={thumb.id}
                      className="absolute transition-all duration-700 ease-out cursor-pointer"
                      style={{
                        transform: `${transform} scale(${scale})`,
                        zIndex,
                        opacity,
                        filter: blur,
                        transformStyle: 'preserve-3d'
                      }}
                      onClick={() => setSelectedThumbnail(thumb.id)}
                    >
                      <div className="relative w-56 h-36 rounded-2xl overflow-hidden">
                        <div className={`absolute inset-0 bg-gradient-to-br ${thumb.bgColor}`}></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <h3 className="text-white font-bold text-lg text-center px-4">
                            {thumb.title}
                          </h3>
                        </div>
                        <div className="absolute top-3 right-3">
                          <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                            {thumb.label}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Carousel Navigation Dots - Much closer to carousel */}
              <div className="flex justify-center space-x-2 -mt-6">
                {carouselThumbnails.map((thumb) => (
                  <button
                    key={thumb.id}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      thumb.id === selectedThumbnail
                        ? 'bg-cyan-400'
                        : 'bg-white/30 hover:bg-white/50'
                    }`}
                    onClick={() => setSelectedThumbnail(thumb.id)}
                  />
                ))}
              </div>

              {/* Create New Meeting Button */}
              <div className="pt-6">
                <Button 
                  onClick={handleCreateMeeting}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-4 px-12 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 text-lg"
                >
                  CREATE A MEETING
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* Pricing Plans */
          <div className="w-full max-w-4xl mx-auto">
            {/* Mobile Tabs */}
            <div className="md:hidden mb-6">
              <div className="flex bg-white/10 backdrop-blur-md rounded-2xl p-1 border border-white/20">
                <button
                  onClick={() => setSelectedPlan('basic')}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    selectedPlan === 'basic'
                      ? 'bg-white text-black shadow-lg'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  Basic
                </button>
                <button
                  onClick={() => setSelectedPlan('pro')}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    selectedPlan === 'pro'
                      ? 'bg-white text-black shadow-lg'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  Pro
                </button>
              </div>
            </div>

            {/* Desktop Side by Side / Mobile Single Card */}
            <div className="md:grid md:grid-cols-2 md:gap-6">
              {/* Basic Plan */}
              <div className={`${selectedPlan === 'basic' ? 'block' : 'hidden'} md:block`}>
                <div className="relative">
                  <div className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl shadow-black/20"></div>
                  <div className="relative p-8 text-center space-y-6">
                    <div>
                      <div className="text-4xl font-bold text-white mb-2">
                        <span className="text-3xl">$</span>5<span className="text-lg">/month</span>
                      </div>
                      <h3 className="text-xl font-semibold text-white">Basic</h3>
                    </div>
                    
                    <div className="space-y-4 text-left">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-white">All features</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-white">Up to 50 members</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-white">Basic courses</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-white">5% transaction fee</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-gray-500 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-white/60">Custom URL</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-gray-500 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-white/60">Priority support</span>
                      </div>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl"
                      onClick={() => {
                        setModalPlan('basic');
                        setShowModal(true);
                      }}
                    >
                      TRY FOR FREE
                    </Button>
                  </div>
                </div>
              </div>

              {/* Pro Plan */}
              <div className={`${selectedPlan === 'pro' ? 'block' : 'hidden'} md:block`}>
                <div className="relative">
                  <div className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl shadow-black/20"></div>
                  <div className="relative p-8 text-center space-y-6">
                    <div>
                      <div className="text-4xl font-bold text-white mb-2">
                        <span className="text-3xl">$</span>20<span className="text-lg">/month</span>
                      </div>
                      <h3 className="text-xl font-semibold text-white">Pro</h3>
                    </div>
                    
                    <div className="space-y-4 text-left">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-white">All features</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-white">Unlimited members</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-white">Premium courses</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-white">2% transaction fee</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-white">Custom URL</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-white">Priority support</span>
                      </div>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl"
                      onClick={() => {
                        setModalPlan('pro');
                        setShowModal(true);
                      }}
                    >
                      TRY FOR FREE
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-lg flex items-center justify-center p-3 z-50">
          <div className="relative w-full max-w-md mx-auto">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl shadow-black/30"></div>
            <div className="relative p-6 space-y-6 max-h-[90vh] overflow-y-auto">
              
              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all duration-200 z-10"
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
                <h2 className="text-xl font-semibold text-white">Create a Meeting</h2>
                <div className="text-cyan-400 font-medium">7 day free trial</div>
                {user?.email && (
                  <div className="text-white/60 text-sm">
                    Creating for: {user.email}
                  </div>
                )}
              </div>

              {/* Plan Selection Tabs */}
              <div className="space-y-4">
                <div className="flex bg-white/10 backdrop-blur-md rounded-xl p-1 border border-white/20">
                  <button
                    onClick={() => setModalPlan('basic')}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-300 ${
                      modalPlan === 'basic'
                        ? 'bg-white text-black shadow-lg'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    Basic - $5/month
                  </button>
                  <button
                    onClick={() => setModalPlan('pro')}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-300 ${
                      modalPlan === 'pro'
                        ? 'bg-white text-black shadow-lg'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    Pro - $20/month
                  </button>
                </div>
              </div>

              {/* Form Inputs */}
              <div className="space-y-4">
                {/* Community Name */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Community Name
                  </label>
                  <input
                    type="text"
                    value={formData.communityName}
                    onChange={(e) => setFormData(prev => ({ ...prev, communityName: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur-sm"
                    placeholder="Enter your community name"
                  />
                </div>

                {/* IDEAL UI - Credit Card Fields (Commented Out) */}
                {/* 
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Card Details
                  </label>
                  <div className="flex bg-white/10 border border-white/20 rounded-xl backdrop-blur-sm overflow-hidden">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={formData.cardNumber}
                        onChange={(e) => handleCardNumberChange(e.target.value)}
                        className="w-full px-3 py-3 bg-transparent text-white placeholder-white/50 focus:outline-none focus:ring-0 border-0"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                    </div>
                    <div className="w-px bg-white/20"></div>
                    <div className="w-16">
                      <input
                        type="text"
                        value={formData.expiryDate}
                        onChange={(e) => handleExpiryDateChange(e.target.value)}
                        className="w-full px-1 py-3 bg-transparent text-white placeholder-white/50 focus:outline-none focus:ring-0 border-0 text-center"
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </div>
                    <div className="w-px bg-white/20"></div>
                    <div className="w-12">
                      <input
                        type="text"
                        value={formData.csv}
                        onChange={(e) => setFormData(prev => ({ ...prev, csv: e.target.value }))}
                        className="w-full px-1 py-3 bg-transparent text-white placeholder-white/50 focus:outline-none focus:ring-0 border-0 text-center"
                        placeholder="CVC"
                        maxLength={4}
                      />
                    </div>
                  </div>
                </div>
                */}

                {/* PayPal Subscription Integration */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Payment Method
                  </label>
                  <div 
                    id={modalPlan === 'basic' ? 'paypal-button-container-P-5LP69495C05013828NDDAIUY' : 'paypal-button-container-P-59286886LU147733XNDDAKDQ'}
                    className="bg-white border border-white/20 rounded-2xl p-6 backdrop-blur-sm"
                  ></div>
                </div>
              </div>

              {/* PayPal integration handles subscription creation dynamically */}

              {/* Disclaimer */}
              <div className="text-center">
                <p className="text-white/60 text-xs leading-relaxed">
                  We would not charge you unless you continue with the plan after September 21, 2025 and we will notify you before. 
                  Also you can cancel anytime. <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">Terms & Conditions</a>
                </p>
              </div>

            </div>
          </div>
        </div>
      )}
      </>
      )}
    </div>
  );
}