"use client";

import { AuthProvider } from "./auth-context";
import { AuthModal } from "./auth-modal";
import { useAuth } from "./auth-context";

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
      {children}
      <AuthModalRenderer />
    </AuthProvider>
  );
}