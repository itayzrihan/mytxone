"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassBackground } from "@/components/custom/glass-background";
import { UploadVideoForm } from "@/components/custom/upload-video-form";
import {
  CloudUploadIcon,
  LinkIcon,
  CheckCircleIcon,
  LoaderIcon,
  AlertCircleIcon,
  ShareIcon,
  ArrowRightIcon,
} from "lucide-react";

export default function UploadVideoPage() {
  const [activeTab, setActiveTab] = useState<"upload" | "existing">("upload");
  const [existingLink, setExistingLink] = useState("");
  const [existingTitle, setExistingTitle] = useState("");
  const [existingCaption, setExistingCaption] = useState("");
  const [isPostingToSocial, setIsPostingToSocial] = useState(false);
  const [uploadedVideoData, setUploadedVideoData] = useState<{
    fileId: string;
    driveLink: string;
    downloadLink: string;
    title: string;
    caption: string;
  } | null>(null);
  const [postingStatus, setPostingStatus] = useState<
    "idle" | "posting" | "success" | "error"
  >("idle");

  const handleUploadSuccess = (data: {
    fileId: string;
    driveLink: string;
    downloadLink: string;
    title: string;
    caption: string;
  }) => {
    setUploadedVideoData(data);
    setActiveTab("upload");
  };

  const handlePostToSocial = async (
    driveLink: string,
    title: string,
    caption: string,
    source: "upload" | "existing"
  ) => {
    if (!driveLink || !title || !caption) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsPostingToSocial(true);
    setPostingStatus("posting");

    const toastId = toast.loading(
      "Sending your video to all social platforms..."
    );

    try {
      const response = await fetch("/api/social/post-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          driveLink,
          title,
          caption,
          source,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to post to social media");
      }

      const data = await response.json();

      setPostingStatus("success");
      toast.success("Video successfully sent to all platforms!", {
        id: toastId,
      });

      // Reset forms
      setTimeout(() => {
        setUploadedVideoData(null);
        setExistingLink("");
        setExistingTitle("");
        setExistingCaption("");
        setActiveTab("upload");
        setPostingStatus("idle");
      }, 3000);
    } catch (error) {
      setPostingStatus("error");
      const errorMessage =
        error instanceof Error ? error.message : "Posting failed";
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsPostingToSocial(false);
    }
  };

  return (
    <div className="min-h-screen p-4 pt-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <ShareIcon className="w-8 h-8 text-cyan-400" />
            <h1 className="text-4xl font-bold text-white">Social Media Manager</h1>
          </div>
          <p className="text-xl text-zinc-300">
            Upload videos to Google Drive and post to all your social media accounts instantly
          </p>
        </div>

        {/* Two Path System */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Path 1: Upload to Google Drive */}
          <div className="relative group">
            <div className="relative overflow-hidden rounded-2xl">
              <GlassBackground
                chromaticAberration={2}
                strength={40}
                depth={8}
                blur={3}
                brightness={0.9}
                saturation={1.2}
                contrast={1.1}
                opacity={0.02}
              />

              <div className="relative z-10 p-6 border border-white/10 hover:border-white/20 transition-all duration-300 rounded-2xl bg-white/5 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600">
                    <CloudUploadIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Path 1: Upload & Post
                    </h2>
                    <p className="text-sm text-zinc-400">Recommended</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-zinc-300 text-sm">
                    Upload your video directly to Google Drive and immediately post to all social platforms
                  </p>

                  <div className="space-y-3 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                    <div className="flex items-start gap-2">
                      <CheckCircleIcon className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-cyan-300">
                          Upload to Google Drive
                        </p>
                        <p className="text-xs text-zinc-400">
                          Your video is secured in Google Drive
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircleIcon className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-cyan-300">
                          Add Metadata
                        </p>
                        <p className="text-xs text-zinc-400">
                          Title and caption for all platforms
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircleIcon className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-cyan-300">
                          Post Instantly
                        </p>
                        <p className="text-xs text-zinc-400">
                          Goes to all 13+ social media accounts
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => setActiveTab("upload")}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 text-white font-medium"
                  >
                    {uploadedVideoData ? (
                      <>
                        <CheckCircleIcon className="w-4 h-4 mr-2" />
                        Video Ready to Post
                      </>
                    ) : (
                      <>
                        <CloudUploadIcon className="w-4 h-4 mr-2" />
                        Start Upload
                      </>
                    )}
                    <ArrowRightIcon className="w-4 h-4 ml-auto" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Path 2: Use Existing Google Drive Link */}
          <div className="relative group">
            <div className="relative overflow-hidden rounded-2xl">
              <GlassBackground
                chromaticAberration={2}
                strength={40}
                depth={8}
                blur={3}
                brightness={0.9}
                saturation={1.2}
                contrast={1.1}
                opacity={0.02}
              />

              <div className="relative z-10 p-6 border border-white/10 hover:border-white/20 transition-all duration-300 rounded-2xl bg-white/5 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
                    <LinkIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Path 2: Use Existing Link
                    </h2>
                    <p className="text-sm text-zinc-400">Quick</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-zinc-300 text-sm">
                    Already have a Google Drive link? Use it directly to post to all platforms
                  </p>

                  <div className="space-y-3 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                    <div className="flex items-start gap-2">
                      <CheckCircleIcon className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-purple-300">
                          Paste Google Drive Link
                        </p>
                        <p className="text-xs text-zinc-400">
                          Must be publicly accessible
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircleIcon className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-purple-300">
                          Add Metadata
                        </p>
                        <p className="text-xs text-zinc-400">
                          Title and caption for all platforms
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircleIcon className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-purple-300">
                          Post Instantly
                        </p>
                        <p className="text-xs text-zinc-400">
                          Goes to all 13+ social media accounts
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => setActiveTab("existing")}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:opacity-90 text-white font-medium"
                  >
                    <LinkIcon className="w-4 h-4 mr-2" />
                    Use Existing Link
                    <ArrowRightIcon className="w-4 h-4 ml-auto" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Panel */}
        <div className="relative overflow-hidden rounded-2xl mb-12">
          <GlassBackground
            chromaticAberration={2}
            strength={40}
            depth={8}
            blur={3}
            brightness={0.9}
            saturation={1.2}
            contrast={1.1}
            opacity={0.02}
          />

          <div className="relative z-10 p-8 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm">
            {activeTab === "upload" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Upload Your Video
                  </h3>
                  <p className="text-zinc-300">
                    Upload to Google Drive, add metadata, and post to all platforms
                  </p>
                </div>

                <UploadVideoForm
                  onSuccess={handleUploadSuccess}
                  onError={(error) => {
                    toast.error(error);
                  }}
                />

                {/* Post After Upload */}
                {uploadedVideoData && (
                  <div className="space-y-4 pt-6 border-t border-white/10">
                    <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <div className="flex items-start gap-3">
                        <CheckCircleIcon className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-green-300">
                            Video Ready!
                          </p>
                          <p className="text-sm text-green-200 mt-1">
                            Your video is uploaded to Google Drive. Now post it to all your social media accounts.
                          </p>
                          <div className="mt-2 space-y-1 text-sm text-green-200">
                            <p>📌 Title: {uploadedVideoData.title}</p>
                            <p>📝 Drive Link: {uploadedVideoData.driveLink.substring(0, 50)}...</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={() =>
                        handlePostToSocial(
                          uploadedVideoData.driveLink,
                          uploadedVideoData.title,
                          uploadedVideoData.caption,
                          "upload"
                        )
                      }
                      disabled={isPostingToSocial}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 disabled:opacity-50 text-white font-medium h-12"
                    >
                      {isPostingToSocial ? (
                        <>
                          <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
                          Posting to All Platforms...
                        </>
                      ) : postingStatus === "success" ? (
                        <>
                          <CheckCircleIcon className="w-4 h-4 mr-2" />
                          Posted Successfully!
                        </>
                      ) : (
                        <>
                          <ShareIcon className="w-4 h-4 mr-2" />
                          Post to 13+ Social Media Accounts
                        </>
                      )}
                    </Button>

                    {postingStatus === "success" && (
                      <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <div className="flex items-start gap-3">
                          <CheckCircleIcon className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                          <div className="text-sm text-blue-200">
                            <p className="font-semibold">Posting in Progress!</p>
                            <p className="mt-1">
                              Your video is now being posted to all platforms. Estimated time: 10-15 minutes
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === "existing" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Use Existing Google Drive Video
                  </h3>
                  <p className="text-zinc-300">
                    Paste a link to an existing video and post it to all platforms
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Google Drive Link *
                    </label>
                    <Input
                      type="url"
                      placeholder="https://drive.google.com/file/d/..."
                      value={existingLink}
                      onChange={(e) => setExistingLink(e.target.value)}
                      disabled={isPostingToSocial}
                      className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500"
                    />
                    <p className="text-xs text-zinc-400 mt-1">
                      Make sure the file is set to "Anyone with the link" access
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Video Title *
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter video title..."
                      value={existingTitle}
                      onChange={(e) => setExistingTitle(e.target.value)}
                      disabled={isPostingToSocial}
                      className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Video Caption *
                    </label>
                    <textarea
                      placeholder="Enter video caption/description..."
                      value={existingCaption}
                      onChange={(e) => setExistingCaption(e.target.value)}
                      disabled={isPostingToSocial}
                      rows={4}
                      className="w-full bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 rounded-lg p-3 focus:outline-none focus:border-cyan-400/50 transition-colors"
                    />
                  </div>
                </div>

                <Button
                  onClick={() =>
                    handlePostToSocial(
                      existingLink,
                      existingTitle,
                      existingCaption,
                      "existing"
                    )
                  }
                  disabled={!existingLink || !existingTitle || !existingCaption || isPostingToSocial}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:opacity-90 disabled:opacity-50 text-white font-medium h-12"
                >
                  {isPostingToSocial ? (
                    <>
                      <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
                      Posting to All Platforms...
                    </>
                  ) : postingStatus === "success" ? (
                    <>
                      <CheckCircleIcon className="w-4 h-4 mr-2" />
                      Posted Successfully!
                    </>
                  ) : (
                    <>
                      <ShareIcon className="w-4 h-4 mr-2" />
                      Post to 13+ Social Media Accounts
                    </>
                  )}
                </Button>

                {postingStatus === "success" && (
                  <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <div className="flex items-start gap-3">
                      <CheckCircleIcon className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-200">
                        <p className="font-semibold">Posting in Progress!</p>
                        <p className="mt-1">
                          Your video is now being posted to all platforms. Estimated time: 10-15 minutes
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {postingStatus === "error" && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertCircleIcon className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-red-200">
                        <p className="font-semibold">Error</p>
                        <p className="mt-1">
                          Failed to post video. Please check your Google Drive link and try again.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Supported Platforms */}
        <div className="relative overflow-hidden rounded-2xl">
          <GlassBackground
            chromaticAberration={1}
            strength={30}
            depth={6}
            blur={2}
          />

          <div className="relative z-10 p-8 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white mb-6">Supported Platforms</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "TikTok", count: 4 },
                { name: "Instagram", count: 4 },
                { name: "YouTube", count: 2 },
                { name: "LinkedIn", count: 1 },
                { name: "Facebook", count: 1 },
                { name: "Twitter/X", count: 1 },
                { name: "Threads", count: 1 },
              ].map((platform) => (
                <div
                  key={platform.name}
                  className="p-4 bg-white/5 border border-white/10 rounded-lg text-center hover:bg-white/10 transition-colors"
                >
                  <p className="font-semibold text-white">{platform.name}</p>
                  <p className="text-sm text-cyan-400">
                    {platform.count} {platform.count === 1 ? "account" : "accounts"}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-center text-zinc-300 mt-6 text-sm">
              💡 Each video is posted with a 1-2 minute staggered delay between platforms to prevent rate limiting
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
