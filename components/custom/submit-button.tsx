"use client";

import { useFormStatus } from "react-dom";

import { LoaderIcon } from "@/components/custom/icons";

import { Button } from "../ui/button";

export function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type={pending ? "button" : "submit"}
      aria-disabled={pending}
      className="relative text-white bg-gradient-to-r from-cyan-500 to-cyan-600 border-cyan-400/50 hover:from-cyan-400 hover:to-cyan-500 hover:border-cyan-300/50 shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-400/30 backdrop-blur-sm"
    >
      {children}
      {pending && (
        <span className="animate-spin absolute right-4">
          <LoaderIcon />
        </span>
      )}
      <span aria-live="polite" className="sr-only" role="status">
        {pending ? "Loading" : "Submit form"}
      </span>
    </Button>
  );
}
