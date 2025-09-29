"use client";

import { useState } from "react";
import Link from "next/link";
import { User } from "next-auth";
import { Button } from "@/components/ui/button";
import { ScriptCards } from "./script-cards";
import { PlusIcon } from "./icons";

interface ScriptsPageContentProps {
  user: User;
}

export function ScriptsPageContent({ user }: ScriptsPageContentProps) {
  return (
    <div className="flex flex-col min-h-screen p-4 pt-16">
      <div className="max-w-6xl mx-auto w-full">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Your Video Scripts
          </h1>
          <p className="text-lg mb-8">
            <span className="text-zinc-300">Create engaging video content with </span>
            <span className="text-cyan-400">powerful hooks and compelling scripts</span>
          </p>
          
          {/* Add New Script Button */}
          <div className="mb-8">
            <Button
              className="bg-cyan-500/20 backdrop-blur-md border border-cyan-400/30 hover:bg-cyan-500/30 transition-all duration-300 text-white font-medium px-6 py-3 rounded-lg text-lg shadow-lg shadow-cyan-500/10"
              asChild
            >
              <Link href="/scripts/create">
                <PlusIcon size={20} />
                <span className="ml-2">Add New Video Script</span>
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Scripts Cards Section */}
        <div className="w-full">
          <ScriptCards userId={user.id} />
        </div>
      </div>
    </div>
  );
}