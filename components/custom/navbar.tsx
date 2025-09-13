"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

import { History } from "./history";
import { SlashIcon } from "./icons";
import { UserMenu } from "./user-menu";
import { Button } from "../ui/button";
import { NavbarSearch, MobileSearchOverlay } from "./navbar-search";
import { useAuth } from "./auth-context";

interface NavbarProps {
  session?: any;
}

export const Navbar = ({ session }: NavbarProps) => {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { openAuthModal } = useAuth();

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

  return (
    <>
      <div className="bg-black fixed top-0 left-0 w-full py-2 z-30 border-b border-white/10 shadow-sm shadow-cyan-400/20">
        <div className="max-w-6xl mx-auto px-4 relative flex flex-row items-center">
          <div className="flex flex-row gap-3 items-center">
            <History user={session?.user} />
            <div className="flex flex-row gap-2 items-center">

              <div className="text-lg font-bold">
                <span className="text-cyan-400">MYT</span>
                <span className="text-white">X</span>
              </div>
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
                    bg-gradient-to-r from-cyan-500 to-cyan-600 
                    text-white border-cyan-400/50
                    hover:from-cyan-400 hover:to-cyan-500 
                    hover:border-cyan-300/50
                    shadow-lg shadow-cyan-500/20
                    transition-all duration-300
                    hover:shadow-xl hover:shadow-cyan-400/30
                    backdrop-blur-sm
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
      </div>

      {/* Mobile Search Overlay */}
      <MobileSearchOverlay 
        isOpen={isMobileSearchOpen}
        onClose={() => setIsMobileSearchOpen(false)}
      />
    </>
  );
};
