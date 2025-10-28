"use client";

import { AuthProvider, useAuth } from "./auth-context";
import { AuthModal } from "./auth-modal";
import { TwoFAGuard } from "./two-fa-guard";

function AuthModalRenderer() {
  const { isAuthModalOpen, authMode, closeAuthModal, switchAuthMode } = useAuth();
  
  return (
    <AuthModal
      isOpen={isAuthModalOpen}
      onClose={closeAuthModal}
      mode={authMode}
      onSwitchMode={switchAuthMode}
    />
  );
}

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <TwoFAGuard>
        {children}
        <AuthModalRenderer />
      </TwoFAGuard>
    </AuthProvider>
  );
}