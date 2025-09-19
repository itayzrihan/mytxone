"use client";

import { GlassBackground, withGlassBackground } from "./glass-background";

// Example 1: Manual application
function ExampleCard() {
  return (
    <div className="relative p-6 rounded-xl border border-white/20 max-w-md">
      {/* Apply glass background */}
      <GlassBackground 
        chromaticAberration={8}
        strength={80}
        depth={12}
        blur={2}
      />
      
      {/* Your existing content - shape unchanged */}
      <div className="relative z-10">
        <h3 className="text-xl font-bold text-white mb-4">Card Title</h3>
        <p className="text-gray-300">
          This card has the liquid glass background applied without changing its shape or layout.
        </p>
        <button className="mt-4 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600">
          Button
        </button>
      </div>
    </div>
  );
}

// Example 2: HOC application
const SimpleDiv = ({ children }: { children: React.ReactNode }) => (
  <div className="p-4 rounded-lg border border-white/30 m-4">
    {children}
  </div>
);

const GlassDiv = withGlassBackground(SimpleDiv, {
  chromaticAberration: 5,
  strength: 60,
  depth: 8
});

// Example 3: Apply to navbar-like component
function ExampleNavbar() {
  return (
    <nav className="relative w-full py-4 px-8 rounded-2xl border border-white/20">
      <GlassBackground 
        chromaticAberration={3}
        strength={50}
        depth={8}
        blur={2}
      />
      
      <div className="relative z-10 flex items-center justify-between">
        <div className="text-white font-bold text-lg">Logo</div>
        <div className="flex gap-6">
          <a href="#" className="text-white hover:text-cyan-300">Home</a>
          <a href="#" className="text-white hover:text-cyan-300">About</a>
          <a href="#" className="text-white hover:text-cyan-300">Contact</a>
        </div>
        <button className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30">
          Login
        </button>
      </div>
    </nav>
  );
}

export { ExampleCard, GlassDiv, ExampleNavbar };