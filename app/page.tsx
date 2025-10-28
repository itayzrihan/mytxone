"use client";

import { auth } from "@/app/(auth)/auth";
import { generateUUID } from "@/lib/utils";
import { GlassCapsules } from "@/components/custom/glass-capsules";
import { MeetingCards } from "@/components/custom/meeting-cards";
import { SearchBar } from "@/components/custom/search-bar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useUserPlan } from "@/components/custom/user-plan-context";

export default function Page() {
  const { userPlan } = useUserPlan();

  return (
    <div className="flex flex-col min-h-screen p-4 pt-32">
      <div className="max-w-2xl mx-auto text-center">

        <h1 className="text-4xl font-bold text-white mb-2">
          Meet new people
        </h1>
        <p className="text-lg mb-6">
          <span className="text-zinc-300">or </span>
          <Link href={userPlan === "basic" || userPlan === "pro" ? "/owned-meetings" : "/mytx/create-meeting"}>
            <span className="text-cyan-400">create a new meeting</span>
          </Link>
        </p>

        
        {/* Search Bar with Glass Morphism */}
        <div className="mb-8">
          <SearchBar variant="full" />
        </div>
        
        <GlassCapsules />
      </div>
      
      {/* Meeting Cards - Full width on desktop */}
      <div className="w-full max-w-6xl mx-auto px-4 mb-8">
        <MeetingCards />
      </div>
    </div>
  );
}