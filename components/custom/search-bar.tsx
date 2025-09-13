"use client";

interface SearchBarProps {
  variant?: 'full' | 'compact' | 'mobile';
  className?: string;
}

export function SearchBar({ variant = 'full', className = '' }: SearchBarProps) {
  const baseClasses = "bg-transparent text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all duration-300";
  
  const variantClasses = {
    full: "pl-12 pr-4 py-4 rounded-2xl w-full",
    compact: "pl-8 pr-3 py-2 rounded-xl w-64",
    mobile: "pl-6 pr-2 py-1 rounded-md w-full text-sm"
  };

  const iconClasses = {
    full: "absolute left-4 h-5 w-5 text-zinc-400",
    compact: "absolute left-2.5 h-4 w-4 text-zinc-400",
    mobile: "absolute left-2 h-3.5 w-3.5 text-zinc-400"
  };

  const containerClasses = {
    full: "relative max-w-md mx-auto",
    compact: "relative",
    mobile: "relative"
  };

  return (
    <div className={`${containerClasses[variant]} ${className}`}>
      {variant === 'full' && (
        <div className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl shadow-black/20"></div>
      )}
      {variant === 'compact' && (
        <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-xl border border-white/20"></div>
      )}
      {variant === 'mobile' && (
        <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-lg border border-white/20"></div>
      )}
      <div className="relative flex items-center">
        <svg
          className={iconClasses[variant]}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder={
            variant === 'full' 
              ? "Search for people or meetings..." 
              : variant === 'mobile'
              ? "Search..."
              : "Search..."
          }
          className={`${baseClasses} ${variantClasses[variant]}`}
        />
      </div>
    </div>
  );
}