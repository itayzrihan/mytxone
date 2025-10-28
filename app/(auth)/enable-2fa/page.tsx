"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { TwoFASetupModal } from "@/components/custom/two-fa-setup-modal";

export default function Enable2FAPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isPolling, setIsPolling] = useState(false);

  useEffect(() => {
    // Get user session to retrieve email
    const fetchUserEmail = async () => {
      try {
        const response = await fetch("/api/auth/session");
        const session = await response.json();
        
        if (!session?.user?.email) {
          toast.error("You must be logged in to enable 2FA");
          router.push("/login");
          return;
        }

        setUserEmail(session.user.email);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching session:", error);
        toast.error("Failed to load user session");
        router.push("/login");
      }
    };

    fetchUserEmail();
  }, [router]);

  // Poll for 2FA status after user opens the setup window
  useEffect(() => {
    if (!userEmail || isLoading) return;

    // Start polling after 3 seconds (gives user time to complete setup)
    const pollTimer = setTimeout(() => {
      setIsPolling(true);
    }, 3000);

    return () => clearTimeout(pollTimer);
  }, [userEmail, isLoading]);

  useEffect(() => {
    if (!isPolling) return;

    const checkInterval = setInterval(async () => {
      try {
        const response = await fetch("/api/auth/check-2fa-status");
        if (!response.ok) return;

        const data = await response.json();
        
        if (data.totpEnabled) {
          console.log("[ENABLE_2FA] 2FA setup detected, redirecting to home");
          toast.success("2FA setup complete! Welcome to the app.");
          clearInterval(checkInterval);
          
          // Reload to refresh session and bypass guard
          window.location.href = "/";
        }
      } catch (error) {
        console.error("Error polling 2FA status:", error);
      }
    }, 2000); // Check every 2 seconds

    return () => clearInterval(checkInterval);
  }, [isPolling, router]);

  const handle2FAComplete = () => {
    // This is called when modal is closed, but we rely on polling
    // to detect when 2FA is actually enabled
    toast.info("Complete the setup in the new window");
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-16 w-16">
            <div className="absolute inset-0 rounded-full border-4 border-blue-200 dark:border-slate-600"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 dark:border-t-blue-400 animate-spin"></div>
          </div>
          <p className="text-sm text-gray-500 dark:text-zinc-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <div className="w-full max-w-md overflow-hidden rounded-2xl gap-12 flex flex-col">
        <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
          <h3 className="text-xl font-semibold dark:text-zinc-50">Enable Two-Factor Authentication</h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400">
            You must enable 2FA to secure your account and access the app.
          </p>
        </div>
        
        <TwoFASetupModal 
          isOpen={true}
          userEmail={userEmail}
          isMandatory={true}
          onClose={handle2FAComplete}
        />
        
        <div className="px-4 text-center space-y-2">
          <p className="text-xs text-gray-500 dark:text-zinc-400">
            Complete 2FA setup in the new window. Once complete, close the window and you&apos;ll be redirected automatically.
          </p>
          {isPolling && (
            <p className="text-xs text-blue-500 dark:text-blue-400 animate-pulse">
              ⏳ Waiting for setup completion...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
