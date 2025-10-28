"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function TOTPConfirmationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Processing your 2FA setup...");

  useEffect(() => {
    async function handleCallback() {
      try {
        const success = searchParams.get("success") === "true";
        const regToken = searchParams.get("regToken");
        const seed = searchParams.get("seed");
        const seedId = searchParams.get("seedId");
        const code = searchParams.get("code");
        const timestamp = searchParams.get("timestamp");
        const error = searchParams.get("error");

        if (!success) {
          setStatus("error");
          setMessage(error || "2FA setup was cancelled. Please try again.");
          toast.error(message);
          return;
        }

        // Call the confirmation API to process and store the TOTP secret
        const response = await fetch("/api/auth/totp-confirmation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            regToken,
            seed,
            seedId,
            code,
            timestamp,
            success: true,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to confirm 2FA setup");
        }

        const data = await response.json();

        setStatus("success");
        setMessage("2FA setup successful! Redirecting...");
        toast.success("2FA enabled successfully!");

        // Auto-redirect to home page
        setTimeout(() => {
          router.push("/");
        }, 1500);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error occurred";
        setStatus("error");
        setMessage(message);
        toast.error(message);
      }
    }

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white p-8 shadow-2xl dark:bg-slate-800">
        <div className="flex flex-col items-center gap-6">
          {/* Status Icon */}
          {status === "loading" && (
            <div className="flex flex-col items-center gap-4">
              <div className="relative h-16 w-16">
                <div className="absolute inset-0 rounded-full border-4 border-blue-200 dark:border-slate-600"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 dark:border-t-blue-400 animate-spin"></div>
              </div>
              <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                Processing...
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
                <svg
                  className="h-8 w-8 text-green-600 dark:text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-bold text-green-600 dark:text-green-400">
                  ✓ Setup Successful
                </h1>
                <p className="mt-2 text-slate-600 dark:text-slate-400">
                  Your 2FA authentication has been enabled!
                </p>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/30">
                <svg
                  className="h-8 w-8 text-red-600 dark:text-red-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-bold text-red-600 dark:text-red-400">
                  Setup Failed
                </h1>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  {message}
                </p>
              </div>
            </div>
          )}

          {/* Message */}
          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            {message}
          </p>

          {/* Redirect Notice */}
          {status === "success" && (
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Redirecting in a moment...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
