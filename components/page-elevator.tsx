'use client';

import React, { useState } from 'react';

interface ElevatorItem {
  id: string;
  label: string;
  icon: string;
  color: string;
  section: string;
}

const ELEVATOR_ITEMS: ElevatorItem[] = [
  { id: 'intro', label: 'הקדמה', icon: '📖', color: 'from-cyan-600 to-blue-600', section: 'introduction' },
  { id: 'morning', label: 'בוקר', icon: '🌅', color: 'from-purple-600 to-pink-600', section: 'morning' },
  { id: 'body', label: 'גוף', icon: '🏃', color: 'from-emerald-600 to-cyan-600', section: 'body' },
  { id: 'mind', label: 'נפש', icon: '💭', color: 'from-blue-600 to-purple-600', section: 'mind' },
  { id: 'memory', label: 'זיכרון', icon: '🧠', color: 'from-blue-600 to-purple-600', section: 'memory' },
  { id: 'practice', label: 'פרקטיקה', icon: '🧠', color: 'from-indigo-600 to-blue-600', section: 'practice' },
  { id: 'relations', label: 'יחסים', icon: '💞', color: 'from-pink-600 to-rose-600', section: 'relations' },
  { id: 'evening', label: 'ערב', icon: '🌙', color: 'from-amber-600 to-orange-600', section: 'evening' },
  { id: 'brain', label: 'אימון', icon: '🧩', color: 'from-teal-600 to-cyan-600', section: 'brain' },
  { id: 'reality', label: 'מציאות', icon: '⚡', color: 'from-indigo-600 to-purple-600', section: 'reality' },
];

interface PageElevatorProps {
  onDelete?: (sectionId: string) => void;
  onNavigate?: (sectionId: string) => void;
}

export default function PageElevator({ onDelete, onNavigate }: PageElevatorProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleScroll = (sectionId: string) => {
    onNavigate?.(sectionId);
  };

  return (
    <>
      {/* Elevator Panel */}
      <div className={`fixed right-6 z-40 flex flex-col items-center gap-1 px-3 py-4 bg-white/40 backdrop-blur-sm border border-white/30 rounded-2xl shadow-2xl overflow-y-auto overflow-x-hidden w-20 transition-all duration-300 ${
        isExpanded ? 'top-1/2 -translate-y-1/2' : 'top-6'
      }`}>
        {/* Collapse/Expand Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-600 text-white hover:shadow-lg transition-all duration-300 flex items-center justify-center text-lg font-bold"
        >
          {isExpanded ? '✕' : '☰'}
        </button>

        {/* Elevator Items - Collapse/Expand */}
        {isExpanded && (
          <div className="flex flex-col gap-2 w-full items-center">
            {ELEVATOR_ITEMS.map((item) => (
              <div
                key={item.id}
                className="group relative w-12"
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Main Button */}
                <button
                  onClick={() => handleScroll(item.id)}
                  className={`relative flex flex-col items-center justify-center w-12 h-10 rounded-lg transition-all duration-300 bg-gradient-to-br ${item.color} text-white hover:shadow-lg group/btn text-xs`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span className="text-[10px] font-semibold leading-tight text-white">
                    {item.label}
                  </span>
                </button>

                {/* Tooltip Label */}
                {hoveredId === item.id && (
                  <div className="absolute -left-28 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-2 py-1 rounded-lg text-xs whitespace-nowrap shadow-lg pointer-events-none">
                    {item.label}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1.5 w-0 h-0 border-l-8 border-l-gray-900 border-y-4 border-y-transparent" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Info Box (Mobile Responsive) */}
      <div className="fixed bottom-8 right-8 z-30 md:hidden">
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-lg">
          👈 שימוש במעלית
        </div>
      </div>
    </>
  );
}
