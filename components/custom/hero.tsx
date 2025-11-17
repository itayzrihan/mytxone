"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

const Hero = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden" dir="rtl">
      {/* Background Image with Gradient Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{ transform: `translateY(${scrollY * 0.5}px)` }}
      >
        <Image
          src="/images/hero.webp"
          alt="שירותים דיגיטליים mytx.one"
          fill
          priority
          className="w-full h-full object-cover"
        />
        {/* Dark gradient filter - darker on right, transparent on left for RTL */}
        <div className="absolute inset-0 bg-gradient-to-l from-black via-black/70 to-transparent opacity-80" />
        {/* Additional dark overlay for bottom fade */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background/80" />
        
      </div>

      {/* Content */}
      <div className="container relative z-10 px-6 md:px-8 lg:px-12 pt-20 flex flex-col justify-between flex-1 mx-auto">
        <div className="max-w-100xl animate-fade-in mx-auto">
          <span 
            className="text-lg md:text-xl lg:text-2xl font-medium text-muted-foreground block text-center"
            style={{
              background: 'linear-gradient(90deg, #808080 0%, #ffffff 50%, #808080 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 0 10px rgba(156, 163, 175, 0.2)',
              transform: `translateY(${scrollY * 0.1}px)`
            }}
          >
            איתי דילן זריהן זיונץ
          </span>


          {/* Tagline above container in gray */}
          <div className="w-full">
            <p 
            className="text-3xl md:text-6xl font-regular mt-8 mb-1 text-center leading-tight block text-center"
            style={{
              background: 'linear-gradient(90deg, #808080 0%, #ffffff 50%, #808080 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 0 10px rgba(156, 163, 175, 0.2)',
              transform: `translateY(${scrollY * 0.1}px)`
            }}
            >
              יש דיגיטל שדורש 
                          </p>

            <p 
            className="text-4xl md:text-8xl font-bold mt-1 mb-1 text-center leading-tight block text-center"
            style={{
              background: 'linear-gradient(90deg, #808080 0%, #ffffff 50%, #808080 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 0 10px rgba(156, 163, 175, 0.2)',
              transform: `translateY(${scrollY * 0.1}px)`
            }}
            >
מכם הוצאה כספית                          
</p>

            <p 
            className="text-3xl md:text-6xl font-regular mt-1 mb-4 text-center leading-tight block text-center"
            style={{
              background: 'linear-gradient(90deg, #808080 0%, #ffffff 50%, #808080 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 0 10px rgba(156, 163, 175, 0.2)',
              transform: `translateY(${scrollY * 0.1}px)`
            }}
            >
              ויש דיגיטל ששווה לכם
                          </p>
          </div>

          {/* Tilted Steel-Effect Container */}
          <div 
            className="relative mt-6 mb-12 perspective" 
            style={{ 
              transform: `translateY(${scrollY * -0.1}px) rotateY(-2deg) rotateX(2deg)` 
            }}
          >
            {/* Radial gradient background for steel effect */}
            <div 
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at 40% 30%, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 20%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.6) 100%)`,
                filter: 'blur(1px)'
              }}
            />
            
            {/* Gradient border */}
            <div 
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                background: `linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 25%, rgba(0,0,0,0.2) 75%, rgba(0,0,0,0.5) 100%)`,
                padding: '2px',
                borderRadius: '1rem',
                mask: 'linear-gradient(transparent 0%, transparent calc(100% - 2px), black calc(100% - 2px), black 100%), linear-gradient(90deg, transparent 0%, transparent calc(100% - 2px), black calc(100% - 2px), black 100%)',
                WebkitMask: 'linear-gradient(transparent 0%, transparent calc(100% - 2px), black calc(100% - 2px), black 100%), linear-gradient(90deg, transparent 0%, transparent calc(100% - 2px), black calc(100% - 2px), black 100%)',
                maskComposite: 'intersect',
                WebkitMaskComposite: 'source-in',
              }}
            />

              {/* Main content container */}
                <div className="relative backdrop-blur-md bg-gradient-to-br from-slate-900/60 via-slate-800/50 to-slate-900/60 border border-slate-700/40 rounded-2xl p-4 md:p-8" style={{ transform: 'rotate(3deg)' }}>
                <div className="absolute top-4 right-4 w-4 h-4 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 shadow-lg shadow-gray-500/50 flex items-center justify-center">
                  <span className="text-gray-700 text-lg font-bold" style={{ transform: 'rotate(0deg)' }}>+</span>
                </div>
                <div className="absolute top-4 left-4 w-4 h-4 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 shadow-lg shadow-gray-500/50 flex items-center justify-center">
                  <span className="text-gray-700 text-lg font-bold" style={{ transform: 'rotate(75deg)' }}>+</span>
                </div>
                <div className="absolute bottom-4 right-4 w-4 h-4 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 shadow-lg shadow-gray-500/50 flex items-center justify-center">
                  <span className="text-gray-700 text-lg font-bold" style={{ transform: 'rotate(97deg)' }}>+</span>
                </div>
                <div className="absolute bottom-4 left-4 w-4 h-4 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 shadow-lg shadow-gray-500/50 flex items-center justify-center">
                  <span className="text-gray-700 text-lg font-bold" style={{ transform: 'rotate(125deg)' }}>+</span>
                </div>

                {/* Subtitle */}
                <p className="text-6xl md:text-7xl font-bold mt-1 mb-4 text-center leading-tight block text-center"
                style={{
                  background: 'linear-gradient(90deg, #808080 0%, #ffffff 50%, #808080 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: '0 0 1px rgba(156, 163, 175, 0.2)',
                }}
                >
המון כסף
</p>
              </div>
          </div>
        </div>

          <div 
            className="flex flex-col sm:flex-row-reverse gap-4 animate-slide-up justify-center pb-32"
            style={{ transform: `translateY(${scrollY * -0.2}px)` }}
          >
            <a 
              href="#services"
              className="group bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-shadow px-8 py-3 rounded-lg text-lg font-semibold flex items-center justify-center gap-2"
            >
              השירות שלי
              <ArrowRight className="mr-2 group-hover:-translate-x-1 transition-transform rotate-180" />
            </a>
            <a 
              href="#portfolio"
              className="group backdrop-blur-md bg-white/10 border border-primary/50 text-primary hover:bg-primary/20 hover:border-primary transition-all shadow-lg px-8 py-3 rounded-lg text-lg font-semibold flex items-center justify-center gap-2"
            >
              <Play className="ml-2 group-hover:scale-110 transition-transform" />
              צפו בדוגמאות
            </a>
          </div>
      </div>

      {/* Scroll Indicator */}
      <div 
        className="absolute bottom-16 left-1/2 -translate-x-1/2 animate-bounce"
        style={{ transform: `translateY(${scrollY * -0.3}px) translateX(-50%)` }}
      >
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
