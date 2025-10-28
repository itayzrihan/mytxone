"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAuth } from "@/components/custom/auth-context";

export default function Page() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { openAuthModal, isAuthModalOpen } = useAuth();

  // Redirect to root if already logged in
  useEffect(() => {
    if (status === "authenticated" && session) {
      router.push("/");
    }
  }, [status, session, router]);

  useEffect(() => {
    // Open the auth modal in register mode when the page loads (only if not authenticated)
    if (status === "unauthenticated" && !isAuthModalOpen) {
      openAuthModal("register");
    }
  }, [openAuthModal, isAuthModalOpen, status]);

  // Show loading or empty page while checking auth status
  if (status === "loading") {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        {/* Loading... */}
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      {/* Empty page - auth modal will handle everything */}
    </div>
  );
}
