"use client";

import { useState, useEffect } from "react";
import { SearchBar } from "./search-bar";

interface NavbarSearchProps {
  onMobileSearchToggle?: (isOpen: boolean) => void;
  isMobileSearchOpen?: boolean;
}

export function NavbarSearch({ onMobileSearchToggle, isMobileSearchOpen = false }: NavbarSearchProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Check if the main search bar is out of view
      const scrollY = window.scrollY;
      const threshold = 150;
      
      setIsVisible(scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMobileSearchToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newState = !isMobileSearchOpen;
    onMobileSearchToggle?.(newState);
  };

  return (
    <>
      {/* Desktop: Compact search bar */}
      <div 
        className={`hidden md:block transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <SearchBar variant="compact" />
      </div>

      {/* Mobile: Search icon only */}
      <div 
        className={`md:hidden transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <button
          onClick={handleMobileSearchToggle}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-200 touch-manipulation"
          type="button"
        >
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </div>
    </>
  );
}

// Mobile search overlay component
export function MobileSearchOverlay({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
}) {
  if (!isOpen) return null;

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  };

  return (
    <div className="md:hidden fixed top-0 left-0 w-full h-12 bg-black z-40 border-b border-white/10 shadow-sm shadow-cyan-400/20">
      <div className="flex items-center h-full px-3 gap-2">
        {/* Back button */}
        <button
          onClick={handleClose}
          className="p-1 rounded-lg hover:bg-white/10 transition-colors duration-200 touch-manipulation"
          type="button"
        >
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        
        {/* Mobile search bar */}
        <div className="flex-1">
          <SearchBar variant="mobile" />
        </div>
      </div>
    </div>
  );
}