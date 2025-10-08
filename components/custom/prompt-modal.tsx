"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Prompt } from "@/db/schema";

interface PromptModalProps {
  prompt?: Prompt;
  onSave: (data: {
    title: string;
    description: string;
    promptText: string;
    category: string;
    tags: string[];
    isFavorite: boolean;
    isPublic: boolean;
  }) => Promise<void>;
  trigger?: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const PROMPT_CATEGORIES = [
  { value: "general", label: "General" },
  { value: "writing", label: "Writing" },
  { value: "coding", label: "Coding" },
  { value: "analysis", label: "Analysis" },
  { value: "creative", label: "Creative" },
  { value: "business", label: "Business" },
  { value: "education", label: "Education" },
  { value: "research", label: "Research" },
];

export function PromptModal({ prompt, onSave, trigger, isOpen, onOpenChange }: PromptModalProps) {
  const [title, setTitle] = useState(prompt?.title || "");
  const [description, setDescription] = useState(prompt?.description || "");
  const [promptText, setPromptText] = useState(prompt?.promptText || "");
  const [category, setCategory] = useState(prompt?.category || "general");
  const [tagsInput, setTagsInput] = useState(
    Array.isArray(prompt?.tags) ? (prompt.tags as string[]).join(", ") : ""
  );
  const [isFavorite, setIsFavorite] = useState(prompt?.isFavorite || false);
  const [isPublic, setIsPublic] = useState(prompt?.isPublic || false);
  const [isSaving, setIsSaving] = useState(false);
  const [open, setOpen] = useState(false);

  const dialogOpen = isOpen !== undefined ? isOpen : open;
  const setDialogOpen = onOpenChange || setOpen;

  useEffect(() => {
    if (prompt) {
      setTitle(prompt.title);
      setDescription(prompt.description || "");
      setPromptText(prompt.promptText);
      setCategory(prompt.category);
      setTagsInput(Array.isArray(prompt.tags) ? (prompt.tags as string[]).join(", ") : "");
      setIsFavorite(prompt.isFavorite);
      setIsPublic(prompt.isPublic);
    }
  }, [prompt]);

  const handleSave = async () => {
    if (!title.trim() || !promptText.trim()) {
      alert("Please enter a title and prompt text");
      return;
    }

    setIsSaving(true);
    try {
      const tags = tagsInput
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      await onSave({
        title: title.trim(),
        description: description.trim(),
        promptText: promptText.trim(),
        category,
        tags,
        isFavorite,
        isPublic,
      });
      
      if (!prompt) {
        // Reset form for new prompts
        setTitle("");
        setDescription("");
        setPromptText("");
        setCategory("general");
        setTagsInput("");
        setIsFavorite(false);
        setIsPublic(false);
      }
      
      setDialogOpen(false);
    } catch (error) {
      console.error("Failed to save prompt:", error);
      alert("Failed to save prompt. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="bg-gray-900/95 backdrop-blur-lg border border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white text-2xl">
            {prompt ? "Edit Prompt" : "Create New Prompt"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          {/* Title */}
          <div>
            <label htmlFor="prompt-title" className="block text-sm font-medium text-white mb-2">
              Title *
            </label>
            <input
              id="prompt-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-zinc-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
              placeholder="e.g., Email Writer, Code Reviewer, Story Generator"
              maxLength={200}
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="prompt-description" className="block text-sm font-medium text-white mb-2">
              Description (Optional)
            </label>
            <textarea
              id="prompt-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-zinc-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 min-h-[60px] resize-y"
              placeholder="Brief description of what this prompt does..."
              maxLength={500}
            />
          </div>

          {/* Prompt Text */}
          <div>
            <label htmlFor="prompt-text" className="block text-sm font-medium text-white mb-2">
              Prompt Text *
            </label>
            <textarea
              id="prompt-text"
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              className="w-full p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-zinc-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 min-h-[200px] resize-y font-mono text-sm"
              placeholder="Enter your prompt here... Use {variables} for placeholders if needed."
            />
            <p className="text-xs text-zinc-400 mt-1">
              {promptText.length} characters • Tip: Use {'{{variable}}'} syntax for dynamic content
            </p>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="prompt-category" className="block text-sm font-medium text-white mb-2">
              Category
            </label>
            <select
              id="prompt-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
            >
              {PROMPT_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value} className="bg-gray-800">
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="prompt-tags" className="block text-sm font-medium text-white mb-2">
              Tags (comma-separated)
            </label>
            <input
              id="prompt-tags"
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-zinc-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
              placeholder="e.g., email, professional, formal"
            />
          </div>

          {/* Checkboxes */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isFavorite}
                onChange={(e) => setIsFavorite(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-white/10 text-cyan-500 focus:ring-cyan-400"
              />
              <span className="text-sm text-white">⭐ Mark as Favorite</span>
            </label>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-white/10 text-cyan-500 focus:ring-cyan-400"
              />
              <span className="text-sm text-white">🌍 Make Public</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 bg-cyan-500/20 backdrop-blur-md border border-cyan-400/30 hover:bg-cyan-500/30 transition-all duration-300 text-white font-medium"
            >
              {isSaving ? "Saving..." : prompt ? "Update Prompt" : "Create Prompt"}
            </Button>
            <Button
              onClick={() => setDialogOpen(false)}
              variant="outline"
              className="flex-1 bg-white/10 border-white/20 hover:bg-white/20 text-white"
              disabled={isSaving}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
