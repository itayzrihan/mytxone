"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TwoFASetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  isMandatory?: boolean; // If true, user cannot close modal
}

export function TwoFASetupModal({
  isOpen,
  onClose,
  userEmail,
  isMandatory = false,
}: TwoFASetupModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const popupRef = useRef<Window | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup popup and poll on unmount
  useEffect(() => {
    return () => {
      if (popupRef.current && !popupRef.current.closed) {
        popupRef.current.close();
      }
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  const handleSetup2FA = async () => {
    setIsLoading(true);
    try {
      // Send email as identifier + use email as token for registration flow
      const response = await fetch("/api/auth/setup-2fa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          token: userEmail, // Simple token: just the email itself
        }),
      });

      const data = await response.json();

      if (response.status === 429) {
        toast.error("Too many 2FA setup attempts. Please try again later.");
      } else if (response.status === 401) {
        toast.error("Authentication failed. Please try logging in again.");
      } else if (data.deepLink) {
        // Open in popup window like PayPal or Google login
        const width = 600;
        const height = 700;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;
        
        popupRef.current = window.open(
          data.deepLink,
          "legitateSetup2FA",
          `width=${width},height=${height},left=${left},top=${top},toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes`
        );

        if (!popupRef.current) {
          toast.error("Failed to open 2FA setup window. Please check your popup blocker settings.");
          setIsLoading(false);
          return;
        }

        toast.info("Setting up 2FA in popup window...");

        // Poll to check if popup closed (user completed setup or cancelled)
        pollIntervalRef.current = setInterval(() => {
          if (popupRef.current && popupRef.current.closed) {
            if (pollIntervalRef.current) {
              clearInterval(pollIntervalRef.current);
            }
            // User closed the popup - check if setup was completed by querying the backend
            checkSetupStatus();
          }
        }, 500);
      } else {
        toast.error(data.error || "Failed to initialize 2FA setup");
      }
    } catch (error) {
      console.error("Error setting up 2FA:", error);
      toast.error("Failed to set up 2FA");
    } finally {
      setIsLoading(false);
    }
  };

  const checkSetupStatus = async () => {
    try {
      // Query the backend to check if 2FA setup was completed
      const response = await fetch("/api/auth/check-2fa-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userEmail }),
      });

      const data = await response.json();

      if (data.setupComplete) {
        toast.success("2FA setup completed successfully!");
        onClose();
      } else {
        toast.info("2FA setup not completed yet");
      }
    } catch (error) {
      console.error("Error checking 2FA status:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={isMandatory ? undefined : onClose}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={isMandatory ? (e) => e.preventDefault() : undefined}>
        <DialogHeader>
          <DialogTitle>
            {isMandatory ? "Enable Two-Factor Authentication (Required)" : "Enable Two-Factor Authentication"}
          </DialogTitle>
          <DialogDescription>
            {isMandatory 
              ? "You must enable 2FA to complete registration and access your account"
              : "Secure your account with two-factor authentication (2FA)"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-sm text-zinc-400">
            Two-factor authentication adds an extra layer of security to your account. You&apos;ll need an authenticator app like Google Authenticator, Authy, or Microsoft Authenticator.
          </p>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-sm text-blue-300">
            ℹ️ We use industry-standard TOTP (Time-based One-Time Password) technology with encryption.
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Steps to enable 2FA:</p>
            <ol className="list-decimal list-inside space-y-1 text-sm text-zinc-400">
              <li>Click the button below</li>
              <li>A secure popup window will open</li>
              <li>Scan the QR code with your authenticator app</li>
              <li>Complete the setup and close the window to continue</li>
            </ol>
          </div>

          <div className="flex gap-3 pt-4">
            {!isMandatory && (
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isLoading}
              >
                Cancel
              </Button>
            )}
            <Button
              onClick={handleSetup2FA}
              disabled={isLoading}
              className={isMandatory ? "w-full" : "flex-1"}
            >
              {isLoading ? "Opening setup..." : "Enable 2FA"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
