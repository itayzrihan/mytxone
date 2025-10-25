"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";

interface TwoFAVerificationFormProps {
  onSuccess?: () => void;
  onVerificationComplete?: (verified: boolean) => void;
}

export function TwoFAVerificationForm({
  onSuccess,
  onVerificationComplete,
}: TwoFAVerificationFormProps) {
  const [totpCode, setTotpCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!totpCode || totpCode.length !== 6) {
      setError("TOTP code must be 6 digits");
      return;
    }

    if (!/^\d{6}$/.test(totpCode)) {
      setError("TOTP code must contain only numbers");
      return;
    }

    setIsLoading(true);

    try {
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
    } catch (err) {
      const errorMsg = "Failed to verify 2FA code";
      setError(errorMsg);
      toast.error(errorMsg);
      console.error("Error verifying 2FA:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm mx-auto p-6 bg-card border-border">
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-white">Verify 2FA</h2>
          <p className="text-sm text-zinc-400">
            Enter the 6-digit code from your authenticator app
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
              maxLength={6}
              placeholder="000000"
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
            <Button
              type="submit"
              disabled={isLoading || totpCode.length !== 6}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isLoading ? "Verifying..." : "Verify"}
            </Button>
          </div>
        </form>

        <div className="pt-4 border-t border-white/10">
          <p className="text-xs text-zinc-500 text-center">
            Code expires every 30 seconds
          </p>
        </div>
      </div>
    </Card>
  );
}
