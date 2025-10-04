"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Script, ScriptSeries } from "@/db/schema";
import { FileIcon } from "./icons";
import { getLanguageLabel, getHookById } from "@/lib/video-script-constants";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { FolderPlus, FolderMinus } from "lucide-react";

interface ScriptCardsProps {
  userId: string;
}

export function ScriptCards({ userId }: ScriptCardsProps) {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [allSeries, setAllSeries] = useState<ScriptSeries[]>([]);
  const [scriptSeries, setScriptSeries] = useState<Record<string, string[]>>({});
  const router = useRouter();

  useEffect(() => {
    const fetchScripts = async () => {
      try {
        const response = await fetch(`/api/scripts?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          setScripts(data);
          
          // Fetch series relationships for each script
          const seriesMap: Record<string, string[]> = {};
          await Promise.all(
            data.map(async (script: Script) => {
              try {
                const seriesResponse = await fetch(`/api/scripts/${script.id}/series`);
                if (seriesResponse.ok) {
                  const scriptSeriesData = await seriesResponse.json();
                  seriesMap[script.id] = scriptSeriesData.map((s: any) => s.id);
                }
              } catch (error) {
                console.error(`Failed to fetch series for script ${script.id}:`, error);
              }
            })
          );
          setScriptSeries(seriesMap);
        }
      } catch (error) {
        console.error("Failed to fetch scripts:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchSeries = async () => {
      try {
        const response = await fetch(`/api/series?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          setAllSeries(data);
        }
      } catch (error) {
        console.error("Failed to fetch series:", error);
      }
    };

    fetchScripts();
    fetchSeries();
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

  const renderDescription = (description: string | null): React.ReactNode => {
    if (!description) return null;
    return (
      <div className="mb-4 h-12 overflow-hidden">
        <p className="text-zinc-300 text-sm leading-relaxed">
          {description.length > 80 
            ? `${description.substring(0, 80)}...` 
            : description}
        </p>
      </div>
    );
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
    
    const description = typeof script.description === "string" ? script.description : "";

    // Build the URL with all the script parameters as search params
    const params = new URLSearchParams({
      title: `${script.title} - Similar`,
      description,
      language: (script as any).language || 'hebrew',
      hookType: (script as any).hookType || 'blue-ball',
      contentType: (script as any).mainContentType || 'storytelling',
      scriptLength: (script as any).scriptLength || '60',
      motif: (script as any).motif || '',
      strongReferenceId: script.id,
    });
    
    router.push(`/scripts/create?${params.toString()}`);
  };

  const addScriptToSeries = async (scriptId: string, seriesId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const response = await fetch(`/api/series/${seriesId}/scripts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ scriptId }),
      });

      if (response.ok) {
        // Update local state
        setScriptSeries(prev => ({
          ...prev,
          [scriptId]: [...(prev[scriptId] || []), seriesId],
        }));
      } else {
        alert("Failed to add script to series");
      }
    } catch (error) {
      console.error("Error adding script to series:", error);
      alert("Failed to add script to series");
    }
  };

  const removeScriptFromSeries = async (scriptId: string, seriesId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const response = await fetch(`/api/series/${seriesId}/scripts?scriptId=${scriptId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Update local state
        setScriptSeries(prev => ({
          ...prev,
          [scriptId]: (prev[scriptId] || []).filter(id => id !== seriesId),
        }));
      } else {
        alert("Failed to remove script from series");
      }
    } catch (error) {
      console.error("Error removing script from series:", error);
      alert("Failed to remove script from series");
    }
  };

  const isScriptInSeries = (scriptId: string, seriesId: string): boolean => {
    return (scriptSeries[scriptId] || []).includes(seriesId);
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
      {scripts.map((script) => {
        const description = typeof script.description === "string" ? script.description : null;
        const displayTags = Array.isArray(script.tags)
          ? (script.tags as unknown[]).filter((tag): tag is string => typeof tag === "string")
          : [];

        return (
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

              <div className="mb-3">
                <span className="inline-block bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full text-xs font-medium">
                  {getHookDisplayName(script)}
                </span>
              </div>
                
              {renderDescription(description)}

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
                      +{displayTags.length - 3} more
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
            {/* Second row: Status and Series */}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => toggleStatus(script.id, script.status, e)}
                disabled={updatingStatus === script.id}
                className={`flex-1 text-xs ${
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
              
              {/* Series Dropdown */}
              {allSeries.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      className="flex-1 bg-purple-500/10 border-purple-400/30 text-purple-300 hover:bg-purple-500/20 hover:border-purple-400/50 text-xs"
                    >
                      <FolderPlus size={14} className="mr-1" />
                      Series
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    className="bg-gray-900/95 backdrop-blur-lg border border-gray-700 text-white"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    {allSeries.map((series) => (
                      <DropdownMenuItem
                        key={series.id}
                        onClick={(e) => {
                          if (isScriptInSeries(script.id, series.id)) {
                            removeScriptFromSeries(script.id, series.id, e);
                          } else {
                            addScriptToSeries(script.id, series.id, e);
                          }
                        }}
                        className="cursor-pointer hover:bg-white/10 text-white"
                      >
                        <span className="flex items-center gap-2">
                          {isScriptInSeries(script.id, series.id) ? (
                            <>
                              <FolderMinus size={14} className="text-red-400" />
                              <span className="text-red-300">Remove from {series.name}</span>
                            </>
                          ) : (
                            <>
                              <FolderPlus size={14} className="text-green-400" />
                              <span className="text-green-300">Add to {series.name}</span>
                            </>
                          )}
                        </span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
        );
      })}
    </div>
  );
}