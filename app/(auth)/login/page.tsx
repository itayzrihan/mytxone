"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

import { AuthForm } from "@/components/custom/auth-form";
import { SubmitButton } from "@/components/custom/submit-button";
import { TwoFAVerificationForm } from "@/components/custom/two-fa-verification-form";

import { login, LoginActionState } from "../actions";
import { usernameToEmail } from "@/lib/username-utils";

export default function Page() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show2FA, setShow2FA] = useState(false);

  const [state, formAction] = useActionState<LoginActionState, FormData>(
    login,
    {
      status: "idle",
    },
  );

  useEffect(() => {
    if (state.status === "failed") {
      toast.error(state.error || "Invalid credentials!");
    } else if (state.status === "invalid_data") {
      toast.error("Failed validating your submission!");
    } else if (state.status === "2fa_required") {
      // Show 2FA verification form
      setShow2FA(true);
      toast.info("Enter your 2FA code from your authenticator app");
    } else if (state.status === "success" || state.status === "2fa_verified") {
      router.refresh();
    }
  }, [state, router]);

  const handleSubmit = (formData: FormData) => {
    const formUsername = formData.get("username") as string;
    const formPassword = formData.get("password") as string;
    setUsername(formUsername);
    setPassword(formPassword);
    formAction(formData);
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <div className="w-full max-w-md overflow-hidden rounded-2xl flex flex-col gap-12">
        {show2FA ? (
          <>
            <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
              <h3 className="text-xl font-semibold dark:text-zinc-50">Verify 2FA Code</h3>
              <p className="text-sm text-gray-500 dark:text-zinc-400">
                Enter the 8-digit code from your authenticator
              </p>
            </div>
            <TwoFAVerificationForm 
              email={usernameToEmail(username)}
              password={password}
              onSuccess={() => {
                toast.success("Successfully logged in!");
                router.push("/");
              }}
            />
          </>
        ) : (
          <>
            <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
              <h3 className="text-xl font-semibold dark:text-zinc-50">Sign In</h3>
              <p className="text-sm text-gray-500 dark:text-zinc-400">
                Use your username and password to sign in
              </p>
            </div>
            <AuthForm action={handleSubmit} defaultUsername={username}>
              <SubmitButton>Sign in</SubmitButton>
              <p className="text-center text-sm text-gray-600 mt-4 dark:text-zinc-400">
                {"Don't have an account? "}
                <Link
                  href="/register"
                  className="font-semibold text-gray-800 hover:underline dark:text-zinc-200"
                >
                  Sign up
                </Link>
                {" for free."}
              </p>
            </AuthForm>
          </>
        )}
      </div>
    </div>
  );
}
