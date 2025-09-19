"use client";

import { GlassBg } from "./glass-bg";

export function TestShapes() {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="flex gap-8 items-center">
        {/* Square with strong chromatic aberration */}
        <GlassBg 
          width={200}
          height={200}
          radius={50}
          depth={10}
          blur={1}
          chromaticAberration={15}
          strength={100}
          className="pointer-events-auto"
        >
          <span className="text-white text-sm font-medium">Square</span>
        </GlassBg>

        {/* Circle shape with medium chromatic aberration */}
        <GlassBg 
          width={200}
          height={200}
          radius={100}
          depth={10}
          blur={1}
          chromaticAberration={8}
          strength={100}
          className="pointer-events-auto"
        >
          <span className="text-white text-sm font-medium">Circle</span>
        </GlassBg>

        {/* Rounded rectangle with subtle chromatic aberration */}
        <GlassBg 
          width={200}
          height={200}
          radius={20}
          depth={10}
          blur={1}
          chromaticAberration={10}
          strength={100}
          className="pointer-events-auto"
        >
          <span className="text-white text-sm font-medium">Rectangle</span>
        </GlassBg>
      </div>
    </div>
  );
}