"use client";

import { useState, useEffect, JSX } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Script } from "@/db/schema";
import { FileIcon } from "./icons";
import { getLanguageLabel, getHookById } from "@/lib/video-script-constants";
import { Button } from "@/components/ui/button";

interface ScriptCardsProps {
  userId: string;
}

export function ScriptCards({ userId }: ScriptCardsProps) {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchScripts = async () => {
      try {
        const response = await fetch(`/api/scripts?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          setScripts(data);
        }
      } catch (error) {
        console.error("Failed to fetch scripts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScripts();
  }, [userId]);

  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      english: "from-blue-400/20 to-blue-600/20",
      spanish: "from-red-400/20 to-red-600/20",
      french: "from-purple-400/20 to-purple-600/20",
      german: "from-gray-400/20 to-gray-600/20",
      italian: "from-green-400/20 to-green-600/20",
      portuguese: "from-yellow-400/20 to-yellow-600/20",
      russian: "from-red-500/20 to-red-700/20",
      japanese: "from-pink-400/20 to-pink-600/20",
      korean: "from-indigo-400/20 to-indigo-600/20",
      arabic: "from-amber-400/20 to-amber-600/20",
      hebrew: "from-teal-400/20 to-teal-600/20",
      default: "from-cyan-400/20 to-blue-600/20"
    };
    return colors[language.toLowerCase()] || colors.default;
  };

  const getLanguageIcon = (language: string) => {
    // Flag/culture icons for different languages
    const icons: Record<string, string> = {
      english: "🇺🇸",
      spanish: "🇪🇸", 
      french: "🇫🇷",
      german: "🇩🇪",
      italian: "🇮🇹",
      portuguese: "🇵🇹",
      russian: "🇷🇺",
      japanese: "🇯🇵",
      korean: "🇰🇷",
      arabic: "🇸�",
      hebrew: "🇮�",
      default: "🎬"
    };
    return icons[language.toLowerCase()] || icons.default;
  };

    const getHookDisplayName = (script: any): string => {
    return String(getHookById(script.hookType)?.name || script.hookType || 'Unknown Hook');
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const toggleStatus = async (scriptId: string, currentStatus: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newStatus = currentStatus === "ready" ? "in-progress" : "ready";
    setUpdatingStatus(scriptId);

    try {
      // Get the current script data first
      const currentScript = scripts.find(s => s.id === scriptId);
      if (!currentScript) return;

      const response = await fetch(`/api/scripts/${scriptId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          ...currentScript,
          status: newStatus 
        }),
      });

      if (response.ok) {
        setScripts(scripts.map(script => 
          script.id === scriptId 
            ? { ...script, status: newStatus }
            : script
        ));
      } else {
        console.error("Failed to update script status");
      }
    } catch (error) {
      console.error("Error updating script status:", error);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const createSimilar = (script: Script, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Build the URL with all the script parameters as search params
    const params = new URLSearchParams({
      title: `${script.title} - Similar`,
      description: script.description || '',
      language: (script as any).language || 'hebrew',
      hookType: (script as any).hookType || 'blue-ball',
      contentType: (script as any).mainContentType || 'storytelling',
      scriptLength: (script as any).scriptLength || '60',
      motif: (script as any).motif || '',
      strongReferenceId: script.id,
    });
    
    router.push(`/scripts/create?${params.toString()}`);
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

  if (scripts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🎬</div>
        <h3 className="text-2xl font-semibold text-white mb-2">No video scripts yet</h3>
        <p className="text-zinc-400 mb-6">
          Create your first video script with engaging hooks to captivate your audience.
        </p>
        <Link
          href="/scripts/create"
          className="inline-flex items-center gap-2 bg-cyan-500/20 backdrop-blur-md border border-cyan-400/30 hover:bg-cyan-500/30 transition-all duration-300 text-white font-medium px-6 py-3 rounded-lg"
        >
          <FileIcon size={16} />
          Create Your First Video Script
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {scripts.map((script) => (
        <div
          key={script.id}
          className="block bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-300 group shadow-lg shadow-black/20"
        >
          {/* Clickable area for navigation */}
          <Link href={`/scripts/${script.id}`} className="block">
            {/* Language Header */}
            <div className={`relative h-32 bg-gradient-to-br ${getLanguageColor((script as any).language || 'default')} flex items-center justify-center`}>
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div className="text-4xl">{getLanguageIcon((script as any).language || 'default')}</div>
                <div className="text-white/80 text-sm font-medium uppercase tracking-wider">
                  {getLanguageLabel((script as any).language || 'default')}
                </div>
              </div>
              {/* Script visibility badge */}
              {script.isPublic && (
                <div className="absolute top-3 right-3 bg-green-500/20 backdrop-blur-sm rounded-lg px-2 py-1 text-green-300 text-xs font-medium">
                  Public
                </div>
              )}
              {/* Status badge */}
              <div className="absolute top-3 left-3">
                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                  script.status === 'ready' 
                    ? 'bg-green-500/20 text-green-300' 
                    : 'bg-yellow-500/20 text-yellow-300'
                }`}>
                  {script.status === 'ready' ? 'Ready' : 'Pending'}
                </span>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-4">
              {/* Title */}
              <h3 className="text-white font-semibold text-lg leading-tight group-hover:text-cyan-400 transition-colors duration-300 mb-2">
                {script.title}
              </h3>

              {/* Hook Type Badge */}
              <div className="mb-3">
                <span className="inline-block bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full text-xs font-medium">
                  {getHookDisplayName(script)}
                </span>
              </div>

              {/* Description */}
              {script.description && (
                <div className="mb-4 h-12 overflow-hidden">
                  <p className="text-zinc-300 text-sm leading-relaxed">
                    {script.description.length > 80 
                      ? `${script.description.substring(0, 80)}...` 
                      : script.description}
                  </p>
                </div>
              )}

              {/* Tags */}
              {script.tags && Array.isArray(script.tags) && script.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {(script.tags as string[]).slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs bg-white/10 text-zinc-300 px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {(script.tags as string[]).length > 3 && (
                    <span className="text-xs text-zinc-400 px-2 py-1">
                      +{(script.tags as string[]).length - 3} more
                    </span>
                  )}
                </div>
              )}

              {/* Footer: Date */}
              <div className="flex items-center justify-between text-xs text-zinc-400 mb-3">
                <span>Created {formatDate(script.createdAt.toString())}</span>
                <span>Updated {formatDate(script.updatedAt.toString())}</span>
              </div>
            </div>
          </Link>

          {/* Action buttons outside the link */}
          <div className="px-4 pb-4 space-y-2">
            {/* First row: Main actions */}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => createSimilar(script, e)}
                className="flex-1 bg-blue-500/10 border-blue-400/30 text-blue-300 hover:bg-blue-500/20 hover:border-blue-400/50 text-xs"
              >
                Create Similar
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  router.push(`/scripts/${script.id}/teleprompter`);
                }}
                className="flex-1 bg-purple-500/10 border-purple-400/30 text-purple-300 hover:bg-purple-500/20 hover:border-purple-400/50 text-xs"
              >
                📺 Teleprompter
              </Button>
            </div>
            {/* Second row: Status toggle */}
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => toggleStatus(script.id, script.status, e)}
              disabled={updatingStatus === script.id}
              className={`w-full text-xs ${
                script.status === 'ready'
                  ? 'bg-yellow-500/10 border-yellow-400/30 text-yellow-300 hover:bg-yellow-500/20 hover:border-yellow-400/50'
                  : 'bg-green-500/10 border-green-400/30 text-green-300 hover:bg-green-500/20 hover:border-green-400/50'
              }`}
            >
              {updatingStatus === script.id 
                ? 'Updating...' 
                : script.status === 'ready' 
                  ? 'Mark as Pending' 
                  : 'Mark as Ready'
              }
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}