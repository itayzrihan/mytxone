"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { toast } from "sonner";
import { GlassModal } from "./glass-modal";
import { AuthForm } from "./auth-form";
import { SubmitButton } from "./submit-button";
import { login, register, LoginActionState, RegisterActionState } from "@/app/(auth)/actions";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "login" | "register";
  onSwitchMode: (mode: "login" | "register") => void;
}

export function AuthModal({ isOpen, onClose, mode, onSwitchMode }: AuthModalProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const hasRefreshedRef = useRef(false);

  const [loginState, loginAction] = useActionState<LoginActionState, FormData>(
    login,
    { status: "idle" }
  );

  const [registerState, registerAction] = useActionState<RegisterActionState, FormData>(
    register,
    { status: "idle" }
  );

  const currentState = mode === "login" ? loginState : registerState;

  // Reset the refresh flag when modal opens/closes or mode changes
  useEffect(() => {
    hasRefreshedRef.current = false;
  }, [isOpen, mode]);

  useEffect(() => {
    if (currentState.status === "failed") {
      toast.error(mode === "login" ? "Invalid credentials!" : "Failed to create account");
    } else if (currentState.status === "invalid_data") {
      toast.error("Failed validating your submission!");
    } else if (currentState.status === "user_exists") {
      toast.error("Account already exists");
    } else if (currentState.status === "success" && !hasRefreshedRef.current) {
      // Only refresh once per successful login/register
      hasRefreshedRef.current = true;
      
      if (mode === "register") {
        toast.success("Account created successfully");
      }
      
      router.refresh();
      onClose();
    }
  }, [currentState.status, router, onClose, mode]);

  const handleSubmit = (formData: FormData) => {
    setEmail(formData.get("email") as string);
    if (mode === "login") {
      loginAction(formData);
    } else {
      registerAction(formData);
    }
  };

  return (
    <GlassModal 
      isOpen={isOpen} 
      onClose={onClose}
      title={mode === "login" ? "Sign In" : "Sign Up"}
      size="md"
    >
      <div className="flex flex-col gap-6">
        <p className="text-center text-sm text-zinc-400">
          {mode === "login" 
            ? "Use your email and password to sign in"
            : "Create an account with your email and password"
          }
        </p>

        <AuthForm action={handleSubmit} defaultEmail={email}>
          <SubmitButton>
            {mode === "login" ? "Sign in" : "Sign Up"}
          </SubmitButton>
          
          <p className="text-center text-sm text-zinc-400 mt-4">
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => onSwitchMode(mode === "login" ? "register" : "login")}
              className="font-semibold text-cyan-300 hover:text-cyan-200 underline"
            >
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
            {mode === "login" ? " for free." : " instead."}
          </p>
        </AuthForm>
      </div>
    </GlassModal>
  );
}