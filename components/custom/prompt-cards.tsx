"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Prompt } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { Copy, Star, Edit2, Trash2, TrendingUp } from "lucide-react";
import { PromptModal } from "./prompt-modal";

interface PromptCardsProps {
  userId: string;
}

export function PromptCards({ userId }: PromptCardsProps) {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchPrompts();
  }, [userId]);

  const fetchPrompts = async () => {
    try {
      const response = await fetch(`/api/prompts?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setPrompts(data);
      }
    } catch (error) {
      console.error("Failed to fetch prompts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPrompt = async (prompt: Prompt, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await navigator.clipboard.writeText(prompt.promptText);
      setCopiedId(prompt.id);
      
      // Increment usage count
      await fetch(`/api/prompts/${prompt.id}?action=use`, {
        method: "PATCH",
      });
      
      // Update local state
      setPrompts(prompts.map(p => 
        p.id === prompt.id 
          ? { ...p, usageCount: p.usageCount + 1 }
          : p
      ));

      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error("Failed to copy prompt:", error);
      alert("Failed to copy prompt to clipboard");
    }
  };

  const handleToggleFavorite = async (prompt: Prompt, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const response = await fetch(`/api/prompts/${prompt.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...prompt,
          isFavorite: !prompt.isFavorite,
          tags: Array.isArray(prompt.tags) ? prompt.tags : [],
        }),
      });

      if (response.ok) {
        setPrompts(prompts.map(p =>
          p.id === prompt.id
            ? { ...p, isFavorite: !p.isFavorite }
            : p
        ));
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  const handleDeletePrompt = async (promptId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm("Are you sure you want to delete this prompt?")) {
      return;
    }

    try {
      const response = await fetch(`/api/prompts/${promptId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPrompts(prompts.filter(p => p.id !== promptId));
      } else {
        alert("Failed to delete prompt");
      }
    } catch (error) {
      console.error("Error deleting prompt:", error);
      alert("Failed to delete prompt");
    }
  };

  const handleUpdatePrompt = async (promptId: string, data: any) => {
    try {
      const response = await fetch(`/api/prompts/${promptId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const updatedPrompt = await response.json();
        setPrompts(prompts.map(p => p.id === promptId ? updatedPrompt : p));
        setEditingPrompt(null);
      } else {
        throw new Error("Failed to update prompt");
      }
    } catch (error) {
      console.error("Error updating prompt:", error);
      throw error;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      general: "from-gray-400/20 to-gray-600/20",
      writing: "from-blue-400/20 to-blue-600/20",
      coding: "from-green-400/20 to-green-600/20",
      analysis: "from-purple-400/20 to-purple-600/20",
      creative: "from-pink-400/20 to-pink-600/20",
      business: "from-yellow-400/20 to-yellow-600/20",
      education: "from-indigo-400/20 to-indigo-600/20",
      research: "from-red-400/20 to-red-600/20",
    };
    return colors[category] || colors.general;
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      general: "💬",
      writing: "✍️",
      coding: "💻",
      analysis: "📊",
      creative: "🎨",
      business: "💼",
      education: "📚",
      research: "🔬",
    };
    return icons[category] || icons.general;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden h-64">
              <div className="bg-gray-200 dark:bg-gray-700 h-32 rounded-t-xl"></div>
              <div className="p-4 space-y-3">
                <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded w-3/4"></div>
                <div className="bg-gray-200 dark:bg-gray-700 h-3 rounded w-full"></div>
                <div className="bg-gray-200 dark:bg-gray-700 h-3 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (prompts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">💡</div>
        <h3 className="text-2xl font-semibold text-white mb-2">No prompts yet</h3>
        <p className="text-zinc-400 mb-6">
          Create your first prompt to save and reuse AI instructions.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prompts.map((prompt) => {
          const displayTags = Array.isArray(prompt.tags)
            ? (prompt.tags as unknown[]).filter((tag): tag is string => typeof tag === "string")
            : [];

          return (
            <div
              key={prompt.id}
              className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-300 group shadow-lg shadow-black/20 flex flex-col"
            >
              {/* Category Header */}
              <div className={`relative h-24 bg-gradient-to-br ${getCategoryColor(prompt.category)} flex items-center justify-center`}>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
                <div className="relative z-10 flex flex-col items-center gap-1">
                  <div className="text-3xl">{getCategoryIcon(prompt.category)}</div>
                  <div className="text-white/80 text-xs font-medium uppercase tracking-wider">
                    {prompt.category}
                  </div>
                </div>
                {/* Favorite badge */}
                {prompt.isFavorite && (
                  <div className="absolute top-2 right-2 bg-yellow-500/20 backdrop-blur-sm rounded-lg px-2 py-1">
                    <Star size={14} className="text-yellow-300 fill-yellow-300" />
                  </div>
                )}
                {/* Public badge */}
                {prompt.isPublic && (
                  <div className="absolute top-2 left-2 bg-green-500/20 backdrop-blur-sm rounded-lg px-2 py-1 text-green-300 text-xs font-medium">
                    Public
                  </div>
                )}
              </div>

              {/* Card Content */}
              <div className="p-4 flex-1 flex flex-col">
                {/* Title */}
                <h3 className="text-white font-semibold text-lg leading-tight mb-2">
                  {prompt.title}
                </h3>

                {/* Description */}
                {prompt.description && (
                  <p className="text-zinc-400 text-sm mb-3 line-clamp-2">
                    {prompt.description}
                  </p>
                )}

                {/* Prompt Preview */}
                <div className="mb-3 flex-1">
                  <div className="bg-black/20 rounded-lg p-2 border border-white/5">
                    <p className="text-zinc-300 text-xs font-mono line-clamp-3">
                      {prompt.promptText}
                    </p>
                  </div>
                </div>

                {/* Tags */}
                {displayTags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {displayTags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs bg-white/10 text-zinc-300 px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {displayTags.length > 3 && (
                      <span className="text-xs text-zinc-400 px-2 py-1">
                        +{displayTags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Stats */}
                <div className="flex items-center justify-between text-xs text-zinc-400 mb-3">
                  <span className="flex items-center gap-1">
                    <TrendingUp size={12} />
                    Used {prompt.usageCount} times
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => handleCopyPrompt(prompt, e)}
                      className="flex-1 bg-cyan-500/10 border-cyan-400/30 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400/50 text-xs"
                    >
                      <Copy size={14} className="mr-1" />
                      {copiedId === prompt.id ? "Copied!" : "Copy"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => handleToggleFavorite(prompt, e)}
                      className={`flex-1 text-xs ${
                        prompt.isFavorite
                          ? "bg-yellow-500/10 border-yellow-400/30 text-yellow-300 hover:bg-yellow-500/20"
                          : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                      }`}
                    >
                      <Star size={14} className={`mr-1 ${prompt.isFavorite ? "fill-yellow-300" : ""}`} />
                      {prompt.isFavorite ? "Unfavorite" : "Favorite"}
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setEditingPrompt(prompt);
                      }}
                      className="flex-1 bg-blue-500/10 border-blue-400/30 text-blue-300 hover:bg-blue-500/20 hover:border-blue-400/50 text-xs"
                    >
                      <Edit2 size={14} className="mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => handleDeletePrompt(prompt.id, e)}
                      className="flex-1 bg-red-500/10 border-red-400/30 text-red-300 hover:bg-red-500/20 hover:border-red-400/50 text-xs"
                    >
                      <Trash2 size={14} className="mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Prompt Modal */}
      {editingPrompt && (
        <PromptModal
          prompt={editingPrompt}
          onSave={(data) => handleUpdatePrompt(editingPrompt.id, data)}
          isOpen={!!editingPrompt}
          onOpenChange={(open) => !open && setEditingPrompt(null)}
        />
      )}
    </>
  );
}
