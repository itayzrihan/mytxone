"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Image, Video, Smile, Send, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface CreatePostProps {
  communityId: string;
  onPostCreated: () => void;
}

export function CreatePost({ communityId, onPostCreated }: CreatePostProps) {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Limit to 5 files
    if (mediaFiles.length + files.length > 5) {
      toast.error("You can upload maximum 5 files");
      return;
    }

    // Create previews
    const newPreviews: string[] = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === files.length) {
          setMediaPreviews([...mediaPreviews, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });

    setMediaFiles([...mediaFiles, ...files]);
  };

  const removeMedia = (index: number) => {
    setMediaFiles(mediaFiles.filter((_, i) => i !== index));
    setMediaPreviews(mediaPreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!content.trim() && mediaFiles.length === 0) {
      toast.error("Please add some content or media");
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload media files first if any
      let mediaUrls: string[] = [];
      let mediaTypes: string[] = [];

      if (mediaFiles.length > 0) {
        const uploadPromises = mediaFiles.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("type", "community-post");

          const uploadRes = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (!uploadRes.ok) throw new Error("Failed to upload media");

          const data = await uploadRes.json();
          return { url: data.url, type: file.type.startsWith("video") ? "video" : "image" };
        });

        const uploadedMedia = await Promise.all(uploadPromises);
        mediaUrls = uploadedMedia.map((m) => m.url);
        mediaTypes = uploadedMedia.map((m) => m.type);
      }

      // Create post
      const response = await fetch(`/api/communities/${communityId}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: content.trim(),
          mediaUrls: mediaUrls.length > 0 ? mediaUrls : null,
          mediaTypes: mediaTypes.length > 0 ? mediaTypes : null,
        }),
      });

      if (!response.ok) throw new Error("Failed to create post");

      toast.success("Post created successfully!");
      setContent("");
      setMediaFiles([]);
      setMediaPreviews([]);
      onPostCreated();
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) return null;

  return (
    <Card className="bg-zinc-900/50 border-white/10 p-4 mb-6">
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold">
            {session.user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
        </div>

        <div className="flex-1">
          <Textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px] bg-white/5 border-white/10 text-white placeholder:text-zinc-500 resize-none"
          />

          {/* Media Previews */}
          {mediaPreviews.length > 0 && (
            <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2">
              {mediaPreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  {mediaFiles[index]?.type.startsWith("video") ? (
                    <video
                      src={preview}
                      className="w-full h-32 object-cover rounded-lg"
                      controls
                    />
                  ) : (
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  )}
                  <button
                    onClick={() => removeMedia(index)}
                    className="absolute top-2 right-2 p-1 bg-black/70 rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2">
              <label htmlFor="image-upload">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-zinc-400 hover:text-cyan-400"
                  onClick={() => document.getElementById("image-upload")?.click()}
                >
                  <Image className="h-5 w-5 mr-2" />
                  Photo
                </Button>
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileSelect}
              />

              <label htmlFor="video-upload">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-zinc-400 hover:text-cyan-400"
                  onClick={() => document.getElementById("video-upload")?.click()}
                >
                  <Video className="h-5 w-5 mr-2" />
                  Video
                </Button>
              </label>
              <input
                id="video-upload"
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleFileSelect}
              />

              <Button
                variant="ghost"
                size="sm"
                className="text-zinc-400 hover:text-cyan-400"
              >
                <Smile className="h-5 w-5 mr-2" />
                Emoji
              </Button>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || (!content.trim() && mediaFiles.length === 0)}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
            >
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? "Posting..." : "Post"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
