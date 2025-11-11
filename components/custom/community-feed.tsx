"use client";

import { useState, useEffect } from "react";
import { CreatePost } from "./create-post";
import { PostCard } from "./post-card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CommunityFeedProps {
  communityId: string;
}

export function CommunityFeed({ communityId }: CommunityFeedProps) {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const loadPosts = async (offset = 0) => {
    try {
      const response = await fetch(
        `/api/communities/${communityId}/posts?limit=10&offset=${offset}`
      );
      
      if (!response.ok) throw new Error("Failed to load posts");
      
      const data = await response.json();
      
      if (offset === 0) {
        setPosts(data);
      } else {
        setPosts((prev) => [...prev, ...data]);
      }
      
      setHasMore(data.length === 10);
    } catch (error) {
      console.error("Error loading posts:", error);
      toast.error("Failed to load posts");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [communityId]);

  const handlePostCreated = () => {
    loadPosts(0); // Reload from beginning
  };

  const handleLoadMore = () => {
    const newPage = page + 1;
    setPage(newPage);
    loadPosts(newPage * 10);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <CreatePost communityId={communityId} onPostCreated={handlePostCreated} />

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-zinc-400 text-lg">No posts yet. Be the first to post!</p>
        </div>
      ) : (
        <>
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              communityId={communityId}
              onUpdate={() => loadPosts(0)}
            />
          ))}

          {hasMore && (
            <div className="text-center mt-6">
              <button
                onClick={handleLoadMore}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
