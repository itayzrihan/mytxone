"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  isAuthModalOpen: boolean;
  authMode: "login" | "register";
  openAuthModal: (mode?: "login" | "register") => void;
  closeAuthModal: () => void;
  switchAuthMode: (mode: "login" | "register") => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  const openAuthModal = (mode: "login" | "register" = "login") => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const switchAuthMode = (mode: "login" | "register") => {
    setAuthMode(mode);
  };

  return (
    <AuthContext.Provider value={{
      isAuthModalOpen,
      authMode,
      openAuthModal,
      closeAuthModal,
      switchAuthMode,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}