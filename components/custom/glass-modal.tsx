"use client";

import { ReactNode } from "react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface GlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function GlassModal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  className = "",
  size = "md"
}: GlassModalProps) {
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md", 
    lg: "max-w-lg",
    xl: "max-w-xl"
  };

  return (
    <>
      <DialogPrimitive.Root open={isOpen} onOpenChange={onClose}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-300" />
          <DialogPrimitive.Content
            className={cn(
              "fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-300 ease-out",
              sizeClasses[size],
              "p-0 border-none bg-transparent shadow-none",
              className
            )}
          >
            {/* Glass Container */}
            <div className="glass-container glass-container--rounded glass-container--large relative">
              <div className="glass-filter"></div>
              <div className="glass-overlay"></div>
              <div className="glass-specular"></div>
              
              {/* Custom Close Button with Higher Z-Index */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 z-50 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 disabled:pointer-events-none bg-white/10 text-white hover:bg-white/20 p-1"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="sr-only">Close</span>
              </button>
              
              {/* Glass Content */}
              <div className="glass-content p-6">
                {title && (
                  <div className="mb-6 w-full text-center">
                    <h2 className="text-xl font-semibold text-cyan-300">
                      {title}
                    </h2>
                  </div>
                )}
                
                <VisuallyHidden.Root>
                  <DialogHeader>
                    <DialogTitle>{title || "Modal"}</DialogTitle>
                  </DialogHeader>
                </VisuallyHidden.Root>
                
                {children}
              </div>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>

      {/* SVG Filter for Glass Effect - Only render when modal is open */}
      {isOpen && (
        <svg className="absolute pointer-events-none opacity-0 w-0 h-0" aria-hidden="true">
          <defs>
            <filter id="glass-blur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur"/>
              <feColorMatrix in="blur" type="saturate" values="1.2"/>
              <feComponentTransfer in="saturate">
                <feFuncA type="discrete" tableValues="0.8"/>
              </feComponentTransfer>
            </filter>
            
            <filter id="glass-noise" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence baseFrequency="0.9" numOctaves="3" result="noise"/>
              <feColorMatrix in="noise" type="saturate" values="0" result="desaturated"/>
              <feComponentTransfer in="desaturated" result="opacity">
                <feFuncA type="discrete" tableValues="0.05"/>
              </feComponentTransfer>
              <feBlend in="opacity" in2="SourceGraphic" mode="overlay"/>
            </filter>
          </defs>
        </svg>
      )}
    </>
  );
}