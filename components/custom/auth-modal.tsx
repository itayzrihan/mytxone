"use client";

import { useState, useEffect, useRef, useActionState } from "react";
import { useRouter } from "next/navigation";
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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
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

  // Reset all states when modal opens/closes or mode changes
  useEffect(() => {
    if (!isOpen) {
      // Reset everything when modal closes
      hasRefreshedRef.current = false;
      setUsername("");
      setPassword("");
      setCurrentStep(0);
    }
  }, [isOpen]);

  // Reset step when switching between login/register
  useEffect(() => {
    setCurrentStep(0);
  }, [mode]);

  useEffect(() => {
    if (mode === "login") {
      // Handle login states
      if (loginState.status === "failed") {
        toast.error(loginState.error || "Invalid credentials!");
      } else if (loginState.status === "invalid_data") {
        toast.error("Failed validating your submission!");
      } else if ((loginState.status === "success") && !hasRefreshedRef.current) {
        hasRefreshedRef.current = true;
        toast.success("Successfully logged in!");
        router.refresh();
        onClose();
      }
    } else {
      // Handle register states
      if (registerState.status === "user_exists") {
        toast.error("Username already exists");
      } else if (registerState.status === "failed") {
        toast.error(registerState.error || "Failed to create account");
      } else if (registerState.status === "invalid_data") {
        toast.error("Failed validating your submission!");
      } else if (registerState.status === "success" && !hasRefreshedRef.current) {
        hasRefreshedRef.current = true;
        // Account created successfully
        toast.success("Account created successfully!");
        // Switch to login mode
        onSwitchMode("login");
      }
    }
  }, [loginState.status, registerState.status, router, onClose, mode, onSwitchMode]);

  const handleSubmit = (formData: FormData) => {
    const formUsername = formData.get("username") as string;
    const formPassword = formData.get("password") as string;
    setUsername(formUsername);
    setPassword(formPassword);
    
    if (mode === "login") {
      loginAction(formData);
    } else {
      registerAction(formData);
    }
  };

  const handleClose = () => {
    // Reset all states before closing
    hasRefreshedRef.current = false;
    onClose();
    
    // Navigate back or to root
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <GlassModal 
      isOpen={isOpen} 
      onClose={handleClose}
      title={mode === "login" ? "Sign In" : "Sign Up"}
      size="md"
    >
      <div className="flex flex-col gap-6">
        <p className="text-center text-sm text-zinc-400">
          {mode === "login" 
            ? "Use your username and password to sign in"
            : "Create an account with your username and password"
          }
        </p>

        <AuthForm 
          action={handleSubmit} 
          defaultUsername={username} 
          includeProfileFields={mode === "register"} 
          isModal={true}
          onStepChange={setCurrentStep}
        >
          {mode === "login" || (mode === "register" && currentStep === 2) ? (
            <>
              <SubmitButton>
                {mode === "login" ? "Sign in" : "Sign Up"}
              </SubmitButton>
              
              <p className="text-center text-sm text-zinc-400 mt-4">
                {mode === "login" 
                  ? "Don't have an account? " 
                  : "Already have an account? "
                }
                <button
                  type="button"
                  onClick={() => {
                    if (mode === "login") {
                      onSwitchMode("register");
                    } else {
                      onSwitchMode("login");
                    }
                  }}
                  className="font-semibold text-cyan-300 hover:text-cyan-200 underline"
                >
                  {mode === "login" ? "Sign up" : "Sign in"}
                </button>
                {mode === "login" ? " for free." : " instead."}
              </p>
            </>
          ) : null}
        </AuthForm>
      </div>
    </GlassModal>
  );
}
