"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";

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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 pt-8 pb-20">
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
                  onClick={() => setShowPricing(true)}
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

                    <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
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

                    <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
                      TRY FOR FREE
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}