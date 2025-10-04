"use client";

import { useState } from "react";
import Link from "next/link";
import { User } from "next-auth";
import { Button } from "@/components/ui/button";
import { ScriptCards } from "./script-cards";
import { SeriesCards } from "./series-cards";
import { SeriesModal } from "./series-modal";
import { PlusIcon } from "./icons";
import { FolderPlus } from "lucide-react";

interface ScriptsPageContentProps {
  user: User;
}

type ViewMode = "latest" | "series";

export function ScriptsPageContent({ user }: ScriptsPageContentProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("latest");
  const [isCreatingSeriesModalOpen, setIsCreatingSeriesModalOpen] = useState(false);

  const handleCreateSeries = async (data: { name: string; description: string }) => {
    try {
      const response = await fetch("/api/series", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Refresh the series view
        setViewMode("series");
      } else {
        throw new Error("Failed to create series");
      }
    } catch (error) {
      console.error("Error creating series:", error);
      throw error;
    }
  };

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
          
          {/* Action Buttons */}
          <div className="mb-8 flex gap-4 justify-center flex-wrap">
            <Button
              className="bg-cyan-500/20 backdrop-blur-md border border-cyan-400/30 hover:bg-cyan-500/30 transition-all duration-300 text-white font-medium px-6 py-3 rounded-lg text-lg shadow-lg shadow-cyan-500/10"
              asChild
            >
              <Link href="/scripts/create">
                <PlusIcon size={20} />
                <span className="ml-2">Add New Video Script</span>
              </Link>
            </Button>
            
            <Button
              className="bg-purple-500/20 backdrop-blur-md border border-purple-400/30 hover:bg-purple-500/30 transition-all duration-300 text-white font-medium px-6 py-3 rounded-lg text-lg shadow-lg shadow-purple-500/10"
              onClick={() => setIsCreatingSeriesModalOpen(true)}
            >
              <FolderPlus size={20} />
              <span className="ml-2">Create New Series</span>
            </Button>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex bg-white/5 backdrop-blur-md rounded-lg p-1 border border-white/10">
            <button
              onClick={() => setViewMode("latest")}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                viewMode === "latest"
                  ? "bg-cyan-500/30 text-white shadow-lg"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Latest
            </button>
            <button
              onClick={() => setViewMode("series")}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                viewMode === "series"
                  ? "bg-cyan-500/30 text-white shadow-lg"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              By Series
            </button>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="w-full">
          {user.id && (
            viewMode === "latest" ? (
              <ScriptCards userId={user.id} />
            ) : (
              <SeriesCards userId={user.id} />
            )
          )}
        </div>
      </div>

      {/* Create Series Modal */}
      <SeriesModal
        onSave={handleCreateSeries}
        isOpen={isCreatingSeriesModalOpen}
        onOpenChange={setIsCreatingSeriesModalOpen}
      />
    </div>
  );
}