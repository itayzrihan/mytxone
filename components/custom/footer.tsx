"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAdmin } from "@/contexts/admin-context";
import { Button } from "../ui/button";
import path from "path";

export function Footer() {
  const pathname = usePathname();

  // Hide footer on specific routes
  const shouldHideFooter = pathname.includes("/teleprompter") || 
                           pathname.includes("/create-meeting") || 
                           pathname.includes("/create-community") || 
                           pathname.includes("/resume") ||
                           pathname.includes("/caricature") ||
                           pathname.includes("/odh") ||
                           pathname.includes("/hypno") ||
                           pathname.startsWith("/communities/") && pathname !== "/communities";

  // Admin context - provides centralized admin state for the entire app
  const { shouldShowAdminElements, viewMode } = useAdmin();

  // Admin-only buttons


  const footerLinks = [
    { name: "Make Money", href: "/make-money" },
    { name: "Community", href: "/community" },
    { name: "Support", href: "/support" },
    { name: "Careers", href: "/careers" },
    { name: "Merch", href: "/merch" },
    { name: "Pricing", href: "/pricing" },
    { name: "Privacy", href: "/privacy" },
  ];

  // Don't render footer on certain pages
  if (shouldHideFooter) {
    return null;
  }

  return (
    <footer className="footer-container mt-auto border-t border-white/10 bg-black/80 backdrop-blur-xl">
      
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        {/* Render footer links + admin buttons only if user is admin and in admin view mode */}
        {shouldShowAdminElements && viewMode === "admin" && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6 mb-8">
            {/* Admin-only top row (spans all columns) */}

            {/* Footer links */}
            {footerLinks.map((link) => (
              <div key={link.name} className="group">
                <Link
                  href={link.href}
                  className="block p-4 rounded-lg bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 text-center"
                >
                  <div className="text-white font-medium text-sm group-hover:text-cyan-300 transition-colors duration-200">
                    {link.name}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          {/* Contact Section */}
          <div className="md:col-span-3 flex flex-col gap-4 items-center md:items-center text-center">
            <h3 className="text-base font-semibold text-white">Contact</h3>
            <div className="flex flex-col gap-3 text-zinc-400">
              <a 
                href="tel:0515511591" 
                className="hover:text-cyan-400 transition-colors duration-200"
              >
                0515511591
              </a>
              <a 
                href="mailto:mytxone@gmail.com" 
                className="hover:text-cyan-400 transition-colors duration-200"
              >
                mytxone@gmail.com
              </a>
            </div>
          </div>

          {/* Terms & Policies Section */}
          <div className="md:col-span-5 flex flex-col gap-4 items-center md:items-center text-center">
            <h3 className="text-base font-semibold text-white">Terms & Policies</h3>
            <div className="flex flex-col gap-3 text-zinc-400">
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
                <Link 
                  href="/terms" 
                  className="hover:text-cyan-400 transition-colors duration-200"
                >
                  Terms of Use
                </Link>
                <Link 
                  href="/privacy" 
                  className="hover:text-cyan-400 transition-colors duration-200"
                >
                  Privacy Policy
                </Link>
                <Link 
                  href="/accessibility" 
                  className="hover:text-cyan-400 transition-colors duration-200"
                >
                  Accessibility
                </Link>
              </div>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
                <Link 
                  href="/refunds" 
                  className="hover:text-cyan-400 transition-colors duration-200"
                >
                  Refunds
                </Link>
              </div>
            </div>
          </div>

          {/* Logo & Copyright Section */}
          <div className="md:col-span-4 flex flex-col items-center justify-center gap-6">
            <div className="relative w-24 h-24">
              <Image
                src="/images/LOGO-APP-ORIGINAL.webp"
                alt="MYTX.one"
                width={96}
                height={96}
                className="object-contain"
              />
            </div>
            <p className="text-sm text-zinc-400 text-center">
              ©2025 MYTX. All rights reserved
            </p>
          </div>
        </div>
     
      </div>
    </footer>
  );
}