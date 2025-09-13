"use client";

import { useState, useRef, useEffect, ReactNode } from "react";

interface HorizontalScrollGalleryProps {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  itemsClassName?: string;
}

export function HorizontalScrollGallery({ 
  children, 
  className = "",
  containerClassName = "",
  itemsClassName = ""
}: HorizontalScrollGalleryProps) {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check scroll position and update scroll indicators
  const checkScrollPosition = () => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  // Auto scroll function - only for desktop (non-touch devices)
  const startAutoScroll = (direction: 'left' | 'right') => {
    // Check if device supports touch (mobile)
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      return; // Don't auto-scroll on touch devices
    }
    
    if (!scrollContainerRef.current) return;
    
    scrollIntervalRef.current = setInterval(() => {
      if (!scrollContainerRef.current) return;
      
      const scrollAmount = direction === 'left' ? -3 : 3;
      scrollContainerRef.current.scrollLeft += scrollAmount;
    }, 16); // ~60fps
  };

  const stopAutoScroll = () => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  };

  // Check scroll position on mount and scroll
  useEffect(() => {
    checkScrollPosition();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      return () => container.removeEventListener('scroll', checkScrollPosition);
    }
  }, []);

  // Cleanup scroll interval on unmount
  useEffect(() => {
    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className={`w-screen relative -mx-4 md:w-full md:mx-0 ${className}`}>
      {/* Left Scroll Overlay */}
      <div 
        className={`absolute left-0 md:left-0 top-0 h-full w-6 md:w-8 z-10 pointer-events-none md:pointer-events-auto rounded-l-xl bg-white/5 backdrop-blur-md border-l border-t border-b border-white/10 transition-opacity duration-300 ${
          canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onMouseEnter={() => startAutoScroll('left')}
        onMouseLeave={stopAutoScroll}
        onTouchStart={(e) => e.preventDefault()}
        onTouchEnd={(e) => e.preventDefault()}
      >
        <div className="flex items-center justify-center h-full">
          <svg className="w-3 md:w-4 h-3 md:h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </div>
      </div>

      {/* Right Scroll Overlay */}
      <div 
        className={`absolute right-0 md:right-0 top-0 h-full w-6 md:w-8 z-10 pointer-events-none md:pointer-events-auto rounded-r-xl bg-white/5 backdrop-blur-md border-r border-t border-b border-white/10 transition-opacity duration-300 ${
          canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onMouseEnter={() => startAutoScroll('right')}
        onMouseLeave={stopAutoScroll}
        onTouchStart={(e) => e.preventDefault()}
        onTouchEnd={(e) => e.preventDefault()}
      >
        <div className="flex items-center justify-center h-full">
          <svg className="w-3 md:w-4 h-3 md:h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {/* Horizontally scrollable container */}
      <div 
        ref={scrollContainerRef}
        className={`overflow-x-auto scrollbar-hide px-4 md:px-0 rounded-xl ${containerClassName}`}
      >
        <div className={`flex gap-3 min-w-fit pb-2 ${itemsClassName}`}>
          {children}
        </div>
      </div>
    </div>
  );
}