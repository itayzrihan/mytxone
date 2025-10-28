"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

/**
 * 2FA Guard Component
 * 
 * This component checks if the logged-in user has 2FA enabled.
 * If not, it redirects them to /enable-2fa page to force 2FA setup.
 * 
 * Excluded routes (where 2FA check is skipped):
 * - /login, /register (auth pages)
 * - /enable-2fa (the setup page itself)
 * - /auth/* (auth callback pages like totp-confirmation)
 * - /api/* (API routes)
 */
export function TwoFAGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [userHas2FA, setUserHas2FA] = useState<boolean | null>(null);

  useEffect(() => {
    const check2FAStatus = async () => {
      // Skip check for certain routes
      const excludedPaths = [
        "/login",
        "/register", 
        "/enable-2fa",
        "/auth/totp-confirmation"
      ];
      
      const isExcludedPath = excludedPaths.some(path => pathname?.startsWith(path));
      const isApiPath = pathname?.startsWith("/api/");
      
      if (isExcludedPath || isApiPath) {
        setIsChecking(false);
        return;
      }

      // Wait for session to load
      if (status === "loading") {
        return;
      }

      // If not authenticated, skip check (NextAuth will handle redirect)
      if (status === "unauthenticated" || !session?.user?.email) {
        setIsChecking(false);
        return;
      }

      // User is authenticated, check if they have 2FA enabled
      try {
        const response = await fetch("/api/auth/check-2fa-status");
        
        if (!response.ok) {
          console.error("Failed to check 2FA status");
          setIsChecking(false);
          return;
        }

        const data = await response.json();
        setUserHas2FA(data.totpEnabled);

        // If user doesn't have 2FA enabled, redirect to enable-2fa page
        if (!data.totpEnabled) {
          console.log("[2FA_GUARD] User doesn't have 2FA enabled, redirecting to /enable-2fa");
          router.push("/enable-2fa");
        } else {
          setIsChecking(false);
        }
      } catch (error) {
        console.error("[2FA_GUARD] Error checking 2FA status:", error);
        setIsChecking(false);
      }
    };

    check2FAStatus();
  }, [session, status, pathname, router]);

  // Show nothing while checking (to prevent flash of content)
  if (isChecking && status === "authenticated" && userHas2FA === false) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-16 w-16">
            <div className="absolute inset-0 rounded-full border-4 border-blue-200 dark:border-slate-600"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 dark:border-t-blue-400 animate-spin"></div>
          </div>
          <p className="text-sm text-gray-500 dark:text-zinc-400">Checking security settings...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
