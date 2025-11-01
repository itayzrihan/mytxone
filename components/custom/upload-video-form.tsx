"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CloudUploadIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  LoaderIcon,
} from "lucide-react";

interface UploadVideoFormProps {
  onSuccess?: (data: {
    fileId: string;
    driveLink: string;
    downloadLink: string;
    title: string;
    caption: string;
  }) => void;
  onError?: (error: string) => void;
}

export function UploadVideoForm({ onSuccess, onError }: UploadVideoFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      const droppedFile = droppedFiles[0];
      if (droppedFile.type.startsWith("video/")) {
        setFile(droppedFile);
        toast.success(`Video selected: ${droppedFile.name}`);
      } else {
        toast.error("Please drop a video file");
      }
    }
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        if (selectedFile.type.startsWith("video/")) {
          setFile(selectedFile);
          toast.success(`Video selected: ${selectedFile.name}`);
        } else {
          toast.error("Please select a video file");
        }
      }
    },
    []
  );

  const handleUpload = async () => {
    if (!file || !title || !caption) {
      toast.error("Please fill in all fields and select a video");
      return;
    }

    setIsLoading(true);
    setUploadStatus("uploading");
    setUploadProgress(0);

    const toastId = toast.loading(
      `Uploading video to Google Drive (0%)...`
    );

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("caption", caption);
      formData.append("fileName", file.name);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) return 90;
          return prev + Math.random() * 20;
        });
      }, 500);

      const response = await fetch("/api/social/upload-to-drive", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }

      const data = await response.json();

      setUploadStatus("success");
      toast.success(
        "Video uploaded to Google Drive successfully!",
        { id: toastId }
      );

      if (onSuccess) {
        onSuccess({
          fileId: data.fileId,
          driveLink: data.driveLink,
          downloadLink: data.downloadLink,
          title: data.title,
          caption: data.caption,
        });
      }

      // Reset form
      setTimeout(() => {
        setFile(null);
        setTitle("");
        setCaption("");
        setUploadProgress(0);
        setUploadStatus("idle");
      }, 2000);
    } catch (error) {
      setUploadStatus("error");
      const errorMessage =
        error instanceof Error ? error.message : "Upload failed";
      toast.error(errorMessage, { id: toastId });
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Drag and Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 ${
          isDragging
            ? "border-cyan-400 bg-cyan-400/10"
            : "border-white/20 bg-white/5 hover:bg-white/10"
        }`}
      >
        <div className="text-center">
          <CloudUploadIcon
            className={`w-12 h-12 mx-auto mb-4 transition-colors ${
              isDragging ? "text-cyan-400" : "text-zinc-400"
            }`}
          />
          <h3 className="text-lg font-semibold text-white mb-2">
            Upload Your Video
          </h3>
          <p className="text-sm text-zinc-400 mb-4">
            Drag and drop your video here or click to browse
          </p>

          <input
            type="file"
            accept="video/*"
            onChange={handleFileSelect}
            className="hidden"
            id="video-input"
            disabled={isLoading}
          />

          <label htmlFor="video-input">
            <Button
              type="button"
              asChild
              className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/30"
              disabled={isLoading}
            >
              <span>Browse Files</span>
            </Button>
          </label>

          {file && (
            <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
              <p className="text-sm text-green-300 flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4" />
                {file.name}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Upload Progress */}
      {uploadStatus === "uploading" && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-300">Uploading to Google Drive...</span>
            <span className="text-cyan-400 font-semibold">
              {Math.round(uploadProgress)}%
            </span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Form Fields */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Video Title
          </label>
          <Input
            type="text"
            placeholder="Enter video title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isLoading}
            className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500"
          />
          <p className="text-xs text-zinc-400 mt-1">
            This will appear as the title on all platforms
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Video Caption
          </label>
          <textarea
            placeholder="Enter video caption/description..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            disabled={isLoading}
            rows={4}
            className="w-full bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 rounded-lg p-3 focus:outline-none focus:border-cyan-400/50 transition-colors"
          />
          <p className="text-xs text-zinc-400 mt-1">
            Description shown with your video
          </p>
        </div>
      </div>

      {/* Upload Button */}
      <Button
        onClick={handleUpload}
        disabled={!file || !title || !caption || isLoading}
        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium"
      >
        {isLoading ? (
          <>
            <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
            Uploading to Google Drive...
          </>
        ) : uploadStatus === "success" ? (
          <>
            <CheckCircleIcon className="w-4 h-4 mr-2" />
            Upload Complete
          </>
        ) : (
          <>
            <CloudUploadIcon className="w-4 h-4 mr-2" />
            Upload to Google Drive
          </>
        )}
      </Button>

      {/* Status Messages */}
      {uploadStatus === "error" && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-2">
          <AlertCircleIcon className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-red-300">
            <p className="font-medium">Upload failed</p>
            <p className="text-xs">Please check your file and try again</p>
          </div>
        </div>
      )}

      {uploadStatus === "success" && (
        <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-start gap-2">
          <CheckCircleIcon className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-green-300">
            <p className="font-medium">Video uploaded successfully!</p>
            <p className="text-xs">
              Your video is ready to be posted to social media
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
