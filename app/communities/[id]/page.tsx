"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { CommunityHeader } from "@/components/custom/community-header";
import { CommunityTabs, CommunityTab } from "@/components/custom/community-tabs";
import { CommunityFeed } from "@/components/custom/community-feed";
import { CommunityCourseList } from "@/components/custom/community-course-list";
import { CommunityCalendar } from "@/components/custom/community-calendar";
import { CommunityMembers } from "@/components/custom/community-members";
import { CommunityLeaderboard } from "@/components/custom/community-leaderboard";
import { CommunityAbout } from "@/components/custom/community-about";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function CommunityPage() {
  const params = useParams();
  const communityId = params.id as string;
  
  const [community, setCommunity] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<CommunityTab>("feed");

  useEffect(() => {
    const loadCommunity = async () => {
      try {
        const response = await fetch(`/api/communities/${communityId}`);
        if (!response.ok) throw new Error("Failed to load community");
        
        const data = await response.json();
        setCommunity(data);
      } catch (error) {
        console.error("Error loading community:", error);
        toast.error("Failed to load community");
      } finally {
        setIsLoading(false);
      }
    };

    if (communityId) {
      loadCommunity();
    }
  }, [communityId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-cyan-500" />
      </div>
    );
  }

  if (!community) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-white mb-4">Community Not Found</h1>
        <p className="text-zinc-400">The community you're looking for doesn't exist.</p>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "feed":
        return <CommunityFeed communityId={communityId} />;
      case "courses":
        return <CommunityCourseList communityId={communityId} />;
      case "calendar":
        return <CommunityCalendar communityId={communityId} />;
      case "members":
        return <CommunityMembers communityId={communityId} />;
      case "leaderboard":
        return <CommunityLeaderboard communityId={communityId} />;
      case "about":
        return <CommunityAbout community={community} />;
      default:
        return <CommunityFeed communityId={communityId} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black">
      <CommunityHeader community={community} />
      <CommunityTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="pb-12">{renderTabContent()}</div>
    </div>
  );
}
