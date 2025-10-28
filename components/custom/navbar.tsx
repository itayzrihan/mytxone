"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Shield, Eye } from "lucide-react";

import { History } from "./history";
import { SlashIcon } from "./icons";
import { UserMenu } from "./user-menu";
import { Button } from "../ui/button";
import { NavbarSearch, MobileSearchOverlay } from "./navbar-search";
import { SearchBar } from "./search-bar";
import { useAuth } from "./auth-context";
import { GlassBackground } from "./glass-background";
import { useAdminStatus } from "@/hooks/use-admin-status";

interface NavbarProps {
  session?: any;
}

export const Navbar = ({ session }: NavbarProps) => {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { openAuthModal } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Use the centralized admin status hook
  const { shouldShowAdminElements, shouldShowViewModeToggle, viewMode, isLoading: isCheckingAdmin } = useAdminStatus(session?.user?.id);

  // Handle view mode toggle events
  useEffect(() => {
    const handleToggleViewMode = async () => {
      try {
        const newMode = viewMode === 'admin' ? 'user' : 'admin';

        const response = await fetch('/api/auth/view-mode', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mode: newMode }),
        });

        if (!response.ok) {
          console.error('Failed to toggle view mode');
          return;
        }

        // Parse response and dispatch an event so hooks/components can update immediately
        try {
          const data = await response.json();
          const updatedMode = data.viewMode || newMode;
          window.dispatchEvent(new CustomEvent('view-mode-updated', { detail: updatedMode }));
        } catch (err) {
          // Fallback: still notify listeners without detail
          window.dispatchEvent(new CustomEvent('view-mode-updated'));
        }
      } catch (error) {
        console.error('Error toggling view mode:', error);
      }
    };

    window.addEventListener('toggle-view-mode', handleToggleViewMode);
    return () => window.removeEventListener('toggle-view-mode', handleToggleViewMode);
  }, [viewMode]);

  // Hide navbar on specific routes
  const shouldHideNavbar = pathname.includes("/teleprompter") || 
                           pathname.includes("/create-meeting") || 
                           pathname.includes("/create-community") || 
                           pathname.includes("/resume");

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
      <div className="navbar-container fixed top-0 left-0 w-full py-2 z-30">
        <div className="max-w-6xl mx-auto px-4 py-2 relative">
          <div className="glass-container glass-container--rounded glass-container--large">
            {/* Apply new glass background effect that adapts to container shape */}
            <GlassBackground 
              chromaticAberration={0.5}
              strength={30}
              depth={8}
              blur={5}
              brightness={0.8}
              saturation={1.3}
              contrast={1.1}
              opacity={0.01}
              redMultiplier={3}
              greenMultiplier={1.5}
              blueMultiplier={0.8}
              noiseIntensity={0}
              distortionScale={0.5}
              distortionSmoothness={0.1}
              prismaIntensity={1.5}
              glowIntensity={0.2}
              glowSpread={6}
              edgeSharpness={0.8}
              refractionIndex={1.8}
              surfaceRoughness={1}
              liquidFlow={1}
            />
            
            {/* Keep original glass-content with exact same styling */}
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
                    
                    {/* Admin Dashboard Button - Only show for admin users in admin view mode */}
                    {isClient && session && !isCheckingAdmin && shouldShowAdminElements && (
                      <Button
                        className={`
                          backdrop-blur-md 
                          border
                          shadow-lg shadow-black/20
                          transition-all duration-300
                          hover:shadow-xl
                          flex items-center gap-2
                          ${viewMode === 'admin' 
                            ? 'bg-red-500/20 text-red-300 border-red-400/30 hover:bg-red-500/30 hover:border-red-400/50 hover:shadow-red-500/20'
                            : 'bg-blue-500/20 text-blue-300 border-blue-400/30 hover:bg-blue-500/30 hover:border-blue-400/50 hover:shadow-blue-500/20'
                          }
                        `}
                        size="sm"
                        onClick={() => router.push('/admin')}
                      >
                        {viewMode === 'admin' ? (
                          <>
                            <Shield className="w-4 h-4" />
                            <span className="hidden sm:inline">Admin</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4" />
                            <span className="hidden sm:inline">User View</span>
                          </>
                        )}
                      </Button>
                    )}
                    
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
    </>
  );
};
