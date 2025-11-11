"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Trophy, Medal, Award, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CommunityLeaderboardProps {
  communityId: string;
}

export function CommunityLeaderboard({ communityId }: CommunityLeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const response = await fetch(`/api/communities/${communityId}/leaderboard`);
        if (response.ok) {
          const data = await response.json();
          setLeaderboard(data);
        }
      } catch (error) {
        console.error("Error loading leaderboard:", error);
        toast.error("Failed to load leaderboard");
      } finally {
        setIsLoading(false);
      }
    };

    loadLeaderboard();
  }, [communityId]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-orange-600" />;
      default:
        return <span className="text-2xl font-bold text-zinc-500">#{rank}</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <div className="text-center py-12">
        <Trophy className="h-16 w-16 text-zinc-600 mx-auto mb-4" />
        <p className="text-zinc-400 text-lg">No leaderboard data yet</p>
        <p className="text-zinc-500 text-sm mt-2">Start engaging to earn points!</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="space-y-3">
        {leaderboard.map((entry, index) => {
          const rank = index + 1;
          const isTopThree = rank <= 3;

          return (
            <Card
              key={entry.id}
              className={`bg-zinc-900/50 border-white/10 p-4 ${
                isTopThree ? "border-2 border-cyan-500/50" : ""
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Rank */}
                <div className="flex-shrink-0 w-16 flex items-center justify-center">
                  {getRankIcon(rank)}
                </div>

                {/* User Info */}
                <div className="flex-1 flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold">
                    {entry.userFullName?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{entry.userFullName || "User"}</h3>
                    <div className="flex items-center gap-4 text-xs text-zinc-400 mt-1">
                      <span>{entry.postsCount} posts</span>
                      <span>{entry.commentsCount} comments</span>
                      <span>{entry.reactionsReceived} reactions</span>
                    </div>
                  </div>
                </div>

                {/* Points */}
                <div className="text-right">
                  <div className="text-2xl font-bold text-cyan-400">{entry.points}</div>
                  <div className="text-xs text-zinc-400">points</div>
                </div>
              </div>

              {/* Badges */}
              {entry.badges && entry.badges.length > 0 && (
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/10">
                  {entry.badges.map((badge: any, idx: number) => (
                    <div
                      key={idx}
                      className="px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 rounded-full text-xs text-cyan-400"
                    >
                      {badge.name}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
