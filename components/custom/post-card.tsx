"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThumbsUp, MessageCircle, Share2, MoreHorizontal, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

interface Post {
  id: string;
  content: string;
  mediaUrls: string[] | null;
  mediaTypes: string[] | null;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  isPinned: boolean;
  isEdited: boolean;
  createdAt: string;
  userFullName: string | null;
  userProfileImage: string | null;
  userEmail: string;
}

interface Comment {
  id: string;
  content: string;
  likeCount: number;
  createdAt: string;
  userFullName: string | null;
  userProfileImage: string | null;
  replies?: Comment[];
}

interface PostCardProps {
  post: Post;
  communityId: string;
  onUpdate: () => void;
}

export function PostCard({ post, communityId, onUpdate }: PostCardProps) {
  const { data: session } = useSession();
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const loadComments = async () => {
    if (comments.length > 0) {
      setShowComments(!showComments);
      return;
    }

    setIsLoadingComments(true);
    try {
      const response = await fetch(
        `/api/communities/${communityId}/posts/${post.id}/comments`
      );
      if (response.ok) {
        const data = await response.json();
        setComments(data);
        setShowComments(true);
      }
    } catch (error) {
      console.error("Error loading comments:", error);
      toast.error("Failed to load comments");
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleLike = async () => {
    try {
      const response = await fetch(
        `/api/communities/${communityId}/posts/${post.id}/reactions`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reactionType: "like" }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setIsLiked(data.action === "added");
        onUpdate();
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("Failed to update reaction");
    }
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;

    try {
      const response = await fetch(
        `/api/communities/${communityId}/posts/${post.id}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: commentText.trim() }),
        }
      );

      if (response.ok) {
        const newComment = await response.json();
        setComments([...comments, newComment]);
        setCommentText("");
        onUpdate();
        toast.success("Comment added");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    }
  };

  return (
    <Card className="bg-zinc-900/50 border-white/10 p-4 mb-4">
      {/* Post Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold flex-shrink-0">
            {post.userFullName?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <h3 className="font-semibold text-white">{post.userFullName || "User"}</h3>
            <p className="text-xs text-zinc-400">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              {post.isEdited && " (edited)"}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <p className="text-white whitespace-pre-wrap">{post.content}</p>
      </div>

      {/* Media */}
      {post.mediaUrls && post.mediaUrls.length > 0 && (
        <div className={`grid gap-2 mb-4 ${post.mediaUrls.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
          {post.mediaUrls.map((url, index) => (
            <div key={index} className="rounded-lg overflow-hidden">
              {post.mediaTypes?.[index] === "video" ? (
                <video src={url} controls className="w-full max-h-96 object-cover" />
              ) : (
                <img src={url} alt={`Media ${index + 1}`} className="w-full max-h-96 object-cover" />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Engagement Stats */}
      <div className="flex items-center justify-between py-2 border-y border-white/10 text-sm text-zinc-400">
        <span>{post.likeCount} likes</span>
        <div className="flex gap-3">
          <span>{post.commentCount} comments</span>
          <span>{post.shareCount} shares</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 mt-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          className={`flex-1 ${isLiked ? "text-cyan-400" : "text-zinc-400"} hover:text-cyan-400`}
        >
          <ThumbsUp className={`h-5 w-5 mr-2 ${isLiked ? "fill-current" : ""}`} />
          Like
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={loadComments}
          className="flex-1 text-zinc-400 hover:text-cyan-400"
        >
          <MessageCircle className="h-5 w-5 mr-2" />
          Comment
        </Button>
        <Button variant="ghost" size="sm" className="flex-1 text-zinc-400 hover:text-cyan-400">
          <Share2 className="h-5 w-5 mr-2" />
          Share
        </Button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-white/10">
          {/* Add Comment */}
          {session && (
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleComment()}
                className="bg-white/5 border-white/10 text-white placeholder:text-zinc-500"
              />
              <Button
                onClick={handleComment}
                size="icon"
                className="bg-cyan-500 hover:bg-cyan-600"
                disabled={!commentText.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Comments List */}
          {isLoadingComments ? (
            <p className="text-zinc-400 text-center py-4">Loading comments...</p>
          ) : (
            <div className="space-y-3">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {comment.userFullName?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="flex-1">
                    <div className="bg-white/5 rounded-lg p-3">
                      <h4 className="font-semibold text-white text-sm">
                        {comment.userFullName || "User"}
                      </h4>
                      <p className="text-zinc-300 text-sm mt-1">{comment.content}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-1 ml-3 text-xs text-zinc-400">
                      <button className="hover:text-cyan-400">Like</button>
                      <button className="hover:text-cyan-400">Reply</button>
                      <span>{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
