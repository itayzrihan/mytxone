"use client";

import { Community } from "@/db/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MessageCircle, Bell } from "lucide-react";
import { useSession } from "next-auth/react";

interface CommunityHeaderProps {
  community: Community & {
    memberCount: number;
  };
}

export function CommunityHeader({ community }: CommunityHeaderProps) {
  const { data: session } = useSession();

  return (
    <div className="w-full bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 backdrop-blur-xl border-b border-white/10">
      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Logo and Community Name */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-white/20">
              <AvatarImage src={community.imageUrl || undefined} alt={community.title} />
              <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-cyan-500 to-blue-600">
                {community.title.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-white">{community.title}</h1>
              <p className="text-sm text-zinc-400">
                {community.memberCount} {community.memberCount === 1 ? "member" : "members"}
              </p>
            </div>
          </div>

          {/* Center: Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
            <Input
              placeholder="Search in community..."
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:bg-white/10"
            />
          </div>

          {/* Right: Chat, Notifications, Profile */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-white/10 text-white"
            >
              <MessageCircle className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-white/10 text-white"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
            </Button>
            <Avatar className="h-9 w-9 border border-white/20 cursor-pointer hover:border-white/40 transition">
              <AvatarImage 
                src={session?.user?.image || undefined} 
                alt={session?.user?.name || "User"} 
              />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-600 text-white text-sm">
                {session?.user?.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden mt-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
          <Input
            placeholder="Search in community..."
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:bg-white/10"
          />
        </div>
      </div>
    </div>
  );
}
