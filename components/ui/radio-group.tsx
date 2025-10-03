"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface RadioGroupContextValue {
  value: string;
  onChange: (value: string) => void;
  name: string;
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(null);

interface RadioGroupProps {
  value: string;
  onValueChange: (value: string) => void;
  name?: string;
  children: React.ReactNode;
  className?: string;
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ value, onValueChange, name = "radio-group", children, className, ...props }, ref) => {
    return (
      <RadioGroupContext.Provider value={{ value, onChange: onValueChange, name }}>
        <div
          ref={ref}
          className={cn("grid gap-2", className)}
          role="radiogroup"
          {...props}
        >
          {children}
        </div>
      </RadioGroupContext.Provider>
    );
  }
);

RadioGroup.displayName = "RadioGroup";

interface RadioGroupItemProps {
  value: string;
  id?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ value, id, disabled, children, className, ...props }, ref) => {
    const context = React.useContext(RadioGroupContext);
    
    if (!context) {
      throw new Error("RadioGroupItem must be used within a RadioGroup");
    }

    const { value: groupValue, onChange, name } = context;
    const isChecked = groupValue === value;
    const itemId = id || `${name}-${value}`;

    return (
      <div className={cn("flex items-center space-x-3", className)}>
        <div className="relative">
          <input
            ref={ref}
            type="radio"
            id={itemId}
            name={name}
            value={value}
            checked={isChecked}
            disabled={disabled}
            onChange={() => onChange(value)}
            className="
              h-5 w-5 rounded-full border-2 border-white/30 
              bg-transparent
              text-cyan-400 
              focus:ring-2 focus:ring-cyan-400/50 focus:ring-offset-0
              disabled:opacity-50 disabled:cursor-not-allowed
              cursor-pointer
              appearance-none
              transition-all duration-200
              hover:border-cyan-400/50
            "
            {...props}
          />
          {isChecked && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full transition-all duration-200"></div>
            </div>
          )}
        </div>
        {children && (
          <label
            htmlFor={itemId}
            className="text-sm font-medium text-white cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 select-none"
          >
            {children}
          </label>
        )}
      </div>
    );
  }
);

RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };