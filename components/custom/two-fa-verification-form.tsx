"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";

interface TwoFAVerificationFormProps {
  onSuccess?: () => void;
  onVerificationComplete?: (verified: boolean) => void;
  email?: string;
  password?: string;
}

export function TwoFAVerificationForm({
  onSuccess,
  onVerificationComplete,
  email,
  password,
}: TwoFAVerificationFormProps) {
  const [totpCode, setTotpCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const popupRef = useRef<Window | null>(null);

  // Cleanup popup on unmount
  useEffect(() => {
    return () => {
      if (popupRef.current && !popupRef.current.closed) {
        popupRef.current.close();
      }
    };
  }, []);

  const handleOpenLegitate = () => {
    const width = 600;
    const height = 700;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    
    // Build the deep link with serviceName and accountIdentifier
    // Using the same serviceName and email (accountIdentifier) as registration
    const deepLink = `https://legitate.com/dashboard/simple-totp?serviceName=mytx.one&accountIdentifier=${encodeURIComponent(email || "")}`;
    
    popupRef.current = window.open(
      deepLink,
      'legitateTotp',
      `width=${width},height=${height},left=${left},top=${top},toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes`
    );

    if (!popupRef.current) {
      toast.error("Failed to open Legitate. Please check your popup blocker settings.");
      return;
    }

    toast.info("Legitate opened in popup. Get your code and paste it below.");
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!totpCode || totpCode.length < 6) {
      setError("TOTP code must be at least 6 digits");
      return;
    }

    if (!/^\d+$/.test(totpCode)) {
      setError("TOTP code must contain only numbers");
      return;
    }

    setIsLoading(true);

    try {
      // If email and password provided, use the login endpoint with verification
      if (email && password) {
        const response = await fetch("/api/auth/verify-2fa-internal", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, totpCode }),
        });

        const data = await response.json();

        if (!response.ok) {
          const errorMsg = data.error || "Verification failed";
          setError(errorMsg);
          toast.error(errorMsg);
          if (onVerificationComplete) {
            onVerificationComplete(false);
          }

          // Special handling for rate limiting
          if (response.status === 429) {
            setError("Too many attempts. Please try again in 15 minutes.");
          }
          return;
        }

        // TOTP verified, now complete login
        if (data.success) {
          // Sign in with the verified 2FA
          const loginResponse = await fetch("api/auth/signin-with-2fa", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });

          if (loginResponse.ok) {
            toast.success("Two-factor authentication verified!");
            if (onVerificationComplete) {
              onVerificationComplete(true);
            }
            if (onSuccess) {
              onSuccess();
            }
          } else {
            const errorMsg = "Login failed after 2FA verification";
            setError(errorMsg);
            toast.error(errorMsg);
          }
        }
      } else {
        // Fallback: Use the regular verified endpoint for authenticated sessions
        const response = await fetch("/api/auth/verify-2fa", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ totpCode }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          toast.success("Two-factor authentication verified!");
          if (onVerificationComplete) {
            onVerificationComplete(true);
          }
          if (onSuccess) {
            onSuccess();
          }
        } else {
          const errorMsg = data.error || "Verification failed";
          setError(errorMsg);
          toast.error(errorMsg);
          if (onVerificationComplete) {
            onVerificationComplete(false);
          }

          // Special handling for rate limiting
          if (response.status === 429) {
            setError("Too many attempts. Please try again in 15 minutes.");
          }
        }
      }
    } catch (err) {
      const errorMsg = "Failed to verify 2FA code";
      setError(errorMsg);
      toast.error(errorMsg);
      console.error("Error verifying 2FA:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const hasCode = totpCode.length >= 6;

  return (
    <Card className="w-full max-w-sm mx-auto p-6 bg-card border-border">
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-white">Verify 2FA</h2>
          <p className="text-sm text-zinc-400">
            Enter the code from your authenticator app
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="totp" className="text-sm font-medium text-white">
              Authentication Code
            </label>
            <Input
              id="totp"
              type="text"
              inputMode="numeric"
              maxLength={8}
              placeholder="00000000"
              value={totpCode}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setTotpCode(value);
                setError(null);
              }}
              disabled={isLoading}
              className="text-center text-lg tracking-widest bg-white/5 border-white/20 text-white placeholder:text-zinc-600"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            {!hasCode ? (
              <Button
                type="button"
                onClick={handleOpenLegitate}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Get Code from Legitate
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isLoading ? "Verifying..." : "Verify"}
              </Button>
            )}
          </div>
        </form>

        <div className="pt-4 border-t border-white/10 space-y-2">
          <p className="text-xs text-zinc-500 text-center">
            Code expires every 30 seconds
          </p>
        </div>
      </div>
    </Card>
  );
}
