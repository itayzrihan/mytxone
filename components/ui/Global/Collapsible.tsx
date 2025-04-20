import React, { PropsWithChildren, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Collapsible({ children, title, className }: PropsWithChildren & { title: string, className?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn("w-full", className)}>
      <button 
        className="flex w-full flex-row items-center justify-between py-2 text-left"
        onClick={() => setIsOpen((value) => !value)}
      >
        <span className="font-semibold text-lg">{title}</span>
        {isOpen ? 
          <ChevronDown className="h-5 w-5" /> : 
          <ChevronRight className="h-5 w-5" />
        }
      </button>
      
      {isOpen && (
        <div className="pl-4 py-2">
          {children}
        </div>
      )}
    </div>
  );
}
