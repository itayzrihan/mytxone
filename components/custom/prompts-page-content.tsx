"use client";

import { useState } from "react";
import { User } from "next-auth";
import { Button } from "@/components/ui/button";
import { PromptCards } from "./prompt-cards";
import { PromptModal } from "./prompt-modal";
import { PlusIcon } from "./icons";

interface PromptsPageContentProps {
  user: User;
}

export function PromptsPageContent({ user }: PromptsPageContentProps) {
  const [isCreatingPromptModalOpen, setIsCreatingPromptModalOpen] = useState(false);

  const handleCreatePrompt = async (data: {
    title: string;
    description: string;
    promptText: string;
    category: string;
    tags: string[];
    isFavorite: boolean;
    isPublic: boolean;
  }) => {
    try {
      const response = await fetch("/api/prompts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create prompt");
      }
      
      // Refresh the page to show the new prompt
      window.location.reload();
    } catch (error) {
      console.error("Error creating prompt:", error);
      throw error;
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-4 pt-16">
      <div className="max-w-6xl mx-auto w-full">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Prompt Engineering
          </h1>
          <p className="text-lg mb-8">
            <span className="text-zinc-300">Save and manage your </span>
            <span className="text-cyan-400">AI prompts for future interactions</span>
          </p>
          
          {/* Action Button */}
          <div className="mb-8">
            <Button
              className="bg-cyan-500/20 backdrop-blur-md border border-cyan-400/30 hover:bg-cyan-500/30 transition-all duration-300 text-white font-medium px-6 py-3 rounded-lg text-lg shadow-lg shadow-cyan-500/10"
              onClick={() => setIsCreatingPromptModalOpen(true)}
            >
              <PlusIcon size={20} />
              <span className="ml-2">Create New Prompt</span>
            </Button>
          </div>
        </div>
        
        {/* Prompts Cards Section */}
        <div className="w-full">
          {user.id && <PromptCards userId={user.id} />}
        </div>
      </div>

      {/* Create Prompt Modal */}
      <PromptModal
        onSave={handleCreatePrompt}
        isOpen={isCreatingPromptModalOpen}
        onOpenChange={setIsCreatingPromptModalOpen}
      />
    </div>
  );
}
