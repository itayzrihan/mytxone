"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScriptSeries } from "@/db/schema";

interface SeriesModalProps {
  series?: ScriptSeries;
  onSave: (data: { name: string; description: string }) => Promise<void>;
  trigger?: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function SeriesModal({ series, onSave, trigger, isOpen, onOpenChange }: SeriesModalProps) {
  const [name, setName] = useState(series?.name || "");
  const [description, setDescription] = useState(series?.description || "");
  const [isSaving, setIsSaving] = useState(false);
  const [open, setOpen] = useState(false);

  const dialogOpen = isOpen !== undefined ? isOpen : open;
  const setDialogOpen = onOpenChange || setOpen;

  const handleSave = async () => {
    if (!name.trim()) {
      alert("Please enter a series name");
      return;
    }

    setIsSaving(true);
    try {
      await onSave({ name: name.trim(), description: description.trim() });
      setName("");
      setDescription("");
      setDialogOpen(false);
    } catch (error) {
      console.error("Failed to save series:", error);
      alert("Failed to save series. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="bg-gray-900/95 backdrop-blur-lg border border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white text-2xl">
            {series ? "Edit Series" : "Create New Series"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div>
            <label htmlFor="series-name" className="block text-sm font-medium text-white mb-2">
              Series Name *
            </label>
            <input
              id="series-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-zinc-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
              placeholder="e.g., Product Launch Series"
              maxLength={100}
            />
          </div>

          <div>
            <label htmlFor="series-description" className="block text-sm font-medium text-white mb-2">
              Description (Optional)
            </label>
            <textarea
              id="series-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-zinc-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 min-h-[100px] resize-y"
              placeholder="Describe the purpose of this series..."
              maxLength={500}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 bg-cyan-500/20 backdrop-blur-md border border-cyan-400/30 hover:bg-cyan-500/30 transition-all duration-300 text-white font-medium"
            >
              {isSaving ? "Saving..." : series ? "Update Series" : "Create Series"}
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
