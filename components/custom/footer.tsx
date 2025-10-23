"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();

  // Hide footer on specific routes
  const shouldHideFooter = pathname.includes("/teleprompter");

  // Don't render footer on certain pages
  if (shouldHideFooter) {
    return null;
  }

  return (
    <footer className="footer-container mt-auto border-t border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
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