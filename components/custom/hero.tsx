"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import Image from "next/image";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero.webp"
          alt="mytx.one digital services"
          fill
          priority
          className="w-full h-full object-cover"
        />
        {/* Dark gradient filter - darker on left, transparent on right */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent opacity-80" />
        {/* Additional dark overlay for bottom fade */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background/80" />
      </div>

      {/* Content */}
      <div className="container relative z-10 px-6 md:px-8 lg:px-12">
        <div className="max-w-3xl animate-fade-in">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight drop-shadow-2xl">
            Your Complete
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary" style={{
              mixBlendMode: 'screen',
              filter: 'brightness(2) saturate(1.3)'
            }}>
              Digital Ecosystem
            </span>
          </h1>

          <div className="h-[25vh]" />

          <div className="flex flex-col sm:flex-row gap-4 animate-slide-up">
            <Button 
              variant="default" 
              size="lg" 
              className="group bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-shadow"
            >
              Explore Services
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="group backdrop-blur-md bg-white/10 border border-primary/50 text-primary hover:bg-primary/20 hover:border-primary transition-all shadow-lg"
            >
              <Play className="mr-2 group-hover:scale-110 transition-transform" />
              Watch Demo
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
