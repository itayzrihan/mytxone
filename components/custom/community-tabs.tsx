"use client";

import { cn } from "@/lib/utils";
import { Home, BookOpen, Calendar, Users, Trophy, Info } from "lucide-react";

export type CommunityTab = "feed" | "courses" | "calendar" | "members" | "leaderboard" | "about";

interface CommunityTabsProps {
  activeTab: CommunityTab;
  onTabChange: (tab: CommunityTab) => void;
}

export function CommunityTabs({ activeTab, onTabChange }: CommunityTabsProps) {
  const tabs = [
    { id: "feed" as CommunityTab, label: "Community", icon: Home },
    { id: "courses" as CommunityTab, label: "Courses", icon: BookOpen },
    { id: "calendar" as CommunityTab, label: "Calendar", icon: Calendar },
    { id: "members" as CommunityTab, label: "Members", icon: Users },
    { id: "leaderboard" as CommunityTab, label: "Leaderboard", icon: Trophy },
    { id: "about" as CommunityTab, label: "About", icon: Info },
  ];

  return (
    <div className="w-full bg-zinc-900/50 backdrop-blur-sm border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all whitespace-nowrap",
                  "border-b-2 hover:bg-white/5",
                  isActive
                    ? "border-cyan-500 text-cyan-400"
                    : "border-transparent text-zinc-400 hover:text-white"
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
