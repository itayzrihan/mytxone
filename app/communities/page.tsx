"use client";

import { GlassCapsules } from "@/components/custom/glass-capsules";
import { CommunityCards } from "@/components/custom/community-cards";
import { SearchBar } from "@/components/custom/search-bar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useUserPlan } from "@/components/custom/user-plan-context";
import { useAdmin } from "@/contexts/admin-context";
import { useSearchParams } from "next/navigation";

export default function CommunitiesPage() {
  const { userPlan } = useUserPlan();
  const { shouldShowAdminElements, viewMode } = useAdmin();
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter");

  return (
    <div className="flex flex-col min-h-screen p-4 pt-32">
      <div className="max-w-2xl mx-auto text-center">

        <h1 className="text-4xl font-bold text-white mb-2">
          {filter === "owned" ? "My Communities" : "Join communities"}
        </h1>
        <p className="text-lg mb-6">
          <span className="text-zinc-300">or </span>
          <Link href="/mytx/create-community">
            <span className="text-cyan-400">
              {filter === "owned" ? "create another community" : "create a new community"}
            </span>
          </Link>
        </p>

        
        {/* Search Bar with Glass Morphism */}
        <div className="mb-8">
          <SearchBar variant="full" />
        </div>
        
        {filter !== "owned" && <GlassCapsules />}
      </div>
      
      {/* Community Cards - Full width on desktop */}
      <div className="w-full max-w-6xl mx-auto px-4 mb-8">
        <CommunityCards filter={filter || "public"} />
      </div>
    </div>
  );
}
