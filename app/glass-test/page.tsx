"use client";

import { TestShapes } from "@/components/custom/test-shapes";

export default function GlassTestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 relative overflow-hidden">
      {/* Background content to test the glass effect */}
      <div className="absolute inset-0 p-8">
        <div className="grid grid-cols-3 gap-8 h-full">
          {/* Left column */}
          <div className="space-y-8">
            <div className="bg-yellow-400 h-32 rounded-lg flex items-center justify-center">
              <h2 className="text-2xl font-bold text-black">Hello</h2>
            </div>
            <div className="bg-green-400 h-24 rounded-lg flex items-center justify-center">
              <p className="text-lg text-black">World</p>
            </div>
            <div className="bg-orange-400 h-40 rounded-lg flex items-center justify-center">
              <p className="text-xl text-black">Testing</p>
            </div>
          </div>

          {/* Center column */}
          <div className="space-y-8">
            <div className="bg-red-400 h-28 rounded-lg flex items-center justify-center">
              <h3 className="text-lg font-semibold text-white">Glass</h3>
            </div>
            <div className="bg-blue-400 h-36 rounded-lg flex items-center justify-center">
              <p className="text-lg text-white">Effect</p>
            </div>
            <div className="bg-purple-400 h-32 rounded-lg flex items-center justify-center">
              <p className="text-lg text-white">Demo</p>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-8">
            <div className="bg-pink-400 h-24 rounded-lg flex items-center justify-center">
              <p className="text-lg text-black">Content</p>
            </div>
            <div className="bg-indigo-400 h-40 rounded-lg flex items-center justify-center">
              <p className="text-lg text-white">Behind</p>
            </div>
            <div className="bg-teal-400 h-28 rounded-lg flex items-center justify-center">
              <p className="text-lg text-black">Shapes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Test shapes overlay */}
      <TestShapes />
    </div>
  );
}