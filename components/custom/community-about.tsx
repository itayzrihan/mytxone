"use client";

import { Community } from "@/db/schema";
import { Card } from "@/components/ui/card";
import { Calendar, Users, Globe, Lock, Tag } from "lucide-react";
import { format } from "date-fns";

interface CommunityAboutProps {
  community: Community & {
    memberCount: number;
  };
}

export function CommunityAbout({ community }: CommunityAboutProps) {
  const tags = community.tags as string[] | null;
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="space-y-6">
        {/* Description */}
        <Card className="bg-zinc-900/50 border-white/10 p-6">
          <h2 className="text-xl font-bold text-white mb-4">About This Community</h2>
          <p className="text-zinc-300 whitespace-pre-wrap">
            {community.description || "No description available."}
          </p>
        </Card>

        {/* Details */}
        <Card className="bg-zinc-900/50 border-white/10 p-6">
          <h2 className="text-xl font-bold text-white mb-4">Community Details</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-zinc-300">
              <Users className="h-5 w-5 text-cyan-500" />
              <div>
                <div className="font-semibold">Members</div>
                <div className="text-sm text-zinc-400">
                  {community.memberCount} {community.memberCount === 1 ? "member" : "members"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-zinc-300">
              {community.isPublic ? (
                <Globe className="h-5 w-5 text-cyan-500" />
              ) : (
                <Lock className="h-5 w-5 text-cyan-500" />
              )}
              <div>
                <div className="font-semibold">Privacy</div>
                <div className="text-sm text-zinc-400">
                  {community.isPublic ? "Public community" : "Private community"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-zinc-300">
              <Calendar className="h-5 w-5 text-cyan-500" />
              <div>
                <div className="font-semibold">Created</div>
                <div className="text-sm text-zinc-400">
                  {format(new Date(community.createdAt), "MMMM dd, yyyy")}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-zinc-300">
              <Tag className="h-5 w-5 text-cyan-500" />
              <div>
                <div className="font-semibold">Category</div>
                <div className="text-sm text-zinc-400 capitalize">
                  {community.category} - {community.communityType}
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <Card className="bg-zinc-900/50 border-white/10 p-6">
            <h2 className="text-xl font-bold text-white mb-4">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-zinc-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Card>
        )}

        {/* Rules */}
        <Card className="bg-zinc-900/50 border-white/10 p-6">
          <h2 className="text-xl font-bold text-white mb-4">Community Rules</h2>
          <ol className="space-y-3 text-zinc-300 list-decimal list-inside">
            <li>Be respectful and kind to all members</li>
            <li>No spam, advertising, or self-promotion</li>
            <li>Keep discussions relevant to the community topic</li>
            <li>No harassment, hate speech, or discrimination</li>
            <li>Respect privacy and confidentiality</li>
          </ol>
        </Card>
      </div>
    </div>
  );
}
