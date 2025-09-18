"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

import { History } from "./history";
import { SlashIcon } from "./icons";
import { UserMenu } from "./user-menu";
import { Button } from "../ui/button";
import { NavbarSearch, MobileSearchOverlay } from "./navbar-search";
import { SearchBar } from "./search-bar";
import { useAuth } from "./auth-context";

interface NavbarProps {
  session?: any;
}

export const Navbar = ({ session }: NavbarProps) => {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { openAuthModal } = useAuth();
  const pathname = usePathname();

  // Hide navbar on specific routes
  const shouldHideNavbar = pathname === "/mytx/create";

  // Prevent hydration mismatch by only rendering session-dependent UI on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleMobileSearchToggle = (isOpen: boolean) => {
    setIsMobileSearchOpen(isOpen);
  };

  const handleAuthClick = () => {
    openAuthModal("login");
  };

  // Don't render navbar on certain pages
  if (shouldHideNavbar) {
    return null;
  }

  return (
    <>
      <div className="fixed top-0 left-0 w-full py-2 z-30">
        <div className="max-w-6xl mx-auto px-4 py-2 relative">
          <div className="glass-container glass-container--rounded glass-container--large">
            <div className="glass-filter"></div>
            <div className="glass-overlay"></div>
            <div className="glass-specular"></div>
            <div className="glass-content">
              {/* Mobile Search State - Replace entire content */}
              {isMobileSearchOpen ? (
                <div className="flex flex-row items-center w-full gap-3">
                  {/* Back button */}
                  <button
                    onClick={() => setIsMobileSearchOpen(false)}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-200 touch-manipulation flex-shrink-0"
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
              ) : (
                /* Normal navbar content */
                <div className="flex flex-row items-center w-full">
                  <div className="flex flex-row gap-3 items-center">
                    <History user={session?.user} />
                    <div className="flex flex-row gap-2 items-center">
                      <Link href="/" className="text-lg font-bold hover:opacity-80 transition-opacity duration-200">
                        <span className="text-cyan-400">MYT</span>
                        <span className="text-white">X</span>
                      </Link>
                    </div>
                  </div>

                  {/* Desktop search - Absolutely centered */}
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden md:block">
                    <NavbarSearch 
                      onMobileSearchToggle={handleMobileSearchToggle} 
                      isMobileSearchOpen={isMobileSearchOpen}
                    />
                  </div>

                  <div className="ml-auto flex items-center gap-3">
                    {/* Mobile Search Icon */}
                    <div className="md:hidden">
                      <NavbarSearch 
                        onMobileSearchToggle={handleMobileSearchToggle} 
                        isMobileSearchOpen={isMobileSearchOpen}
                      />
                    </div>
                    
                    
                    {isClient ? (
                      session ? (
                        <UserMenu session={session} />
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleAuthClick}
                          className="
                            bg-white/10 backdrop-blur-md 
                            text-white border border-white/20
                            hover:bg-white/20 hover:border-white/30
                            shadow-lg shadow-black/20
                            transition-all duration-300
                            hover:shadow-xl hover:shadow-black/30
                          "
                        >
                          Login
                        </Button>
                      )
                    ) : (
                      // Placeholder during hydration to prevent layout shift
                      <div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SVG Filter for Glass Effect */}
      <svg xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', width: 0, height: 0, visibility: 'hidden' }}>
        <defs>
          <filter id="lensFilter" x="-50%" y="-50%" width="200%" height="200%" filterUnits="objectBoundingBox">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
            <feDisplacementMap in="SourceGraphic" in2="blur" scale="8" xChannelSelector="A" yChannelSelector="A" />
          </filter>
        </defs>
      </svg>
    </>
  );
};
