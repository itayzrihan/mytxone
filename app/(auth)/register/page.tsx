"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

import { AuthForm } from "@/components/custom/auth-form";
import { SubmitButton } from "@/components/custom/submit-button";
import { TwoFASetupModal } from "@/components/custom/two-fa-setup-modal";

import { register, RegisterActionState } from "../actions";

export default function Page() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [hasPendingRegistration, setHasPendingRegistration] = useState(false);

  const [state, formAction] = useActionState<RegisterActionState, FormData>(
    register,
    {
      status: "idle",
    },
  );

  useEffect(() => {
    if (state.status === "user_exists") {
      toast.error("Account already exists");
    } else if (state.status === "failed") {
      toast.error(state.error || "Failed to create account");
    } else if (state.status === "invalid_data") {
      toast.error("Failed validating your submission!");
    } else if (state.status === "success") {
      toast.success("Account created successfully!");
      // Show 2FA setup modal (mandatory - user has now been created but not logged in)
      setEmail(state.data?.email ?? email);
      setHasPendingRegistration(true);
      setShow2FASetup(true);
    }
  }, [state, router, email]);

  const handleSubmit = (formData: FormData) => {
    setEmail(formData.get("email") as string);
    formAction(formData);
  };

  const handle2FAComplete = () => {
    // After 2FA setup completes, redirect to login
    setShow2FASetup(false);
    setHasPendingRegistration(false);
    toast.success("2FA setup complete! You can now log in.");
    router.push("/login");
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <div className="w-full max-w-md overflow-hidden rounded-2xl gap-12 flex flex-col">
        {show2FASetup && hasPendingRegistration ? (
          <>
            <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
              <h3 className="text-xl font-semibold dark:text-zinc-50">Set Up 2FA</h3>
              <p className="text-sm text-gray-500 dark:text-zinc-400">
                Your account has been created. Now secure it with 2FA.
              </p>
            </div>
            <TwoFASetupModal 
              isOpen={show2FASetup}
              userEmail={email}
              isMandatory={true}
              onClose={() => {
                // Cannot close - mandatory
                // User must complete setup
              }}
            />
            <div className="px-4 text-center text-xs text-gray-500 dark:text-zinc-400">
              Complete 2FA setup in the new window, then close it to continue.
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
              <h3 className="text-xl font-semibold dark:text-zinc-50">Sign Up</h3>
              <p className="text-sm text-gray-500 dark:text-zinc-400">
                Create an account with your email and password
              </p>
            </div>
            <AuthForm action={handleSubmit} defaultEmail={email}>
              <SubmitButton>Sign Up</SubmitButton>
              <p className="text-center text-sm text-gray-600 mt-4 dark:text-zinc-400">
                {"Already have an account? "}
                <Link
                  href="/login"
                  className="font-semibold text-gray-800 hover:underline dark:text-zinc-200"
                >
                  Sign in
                </Link>
                {" instead."}
              </p>
            </AuthForm>
          </>
        )}
      </div>
    </div>
  );
}
