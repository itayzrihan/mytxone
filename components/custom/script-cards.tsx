"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Script } from "@/db/schema";
import { FileIcon } from "./icons";
import { getLanguageLabel, getHookById } from "@/lib/video-script-constants";

interface ScriptCardsProps {
  userId: string;
}

export function ScriptCards({ userId }: ScriptCardsProps) {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [loading, setLoading] = useState(true);

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
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
        <Link
          key={script.id}
          href={`/scripts/${script.id}`}
          className="block bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-300 group shadow-lg shadow-black/20"
        >
          {/* Language Header */}
          <div className={`relative h-32 bg-gradient-to-br ${getLanguageColor(script.language)} flex items-center justify-center`}>
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="text-4xl">{getLanguageIcon(script.language)}</div>
              <div className="text-white/80 text-sm font-medium uppercase tracking-wider">
                {getLanguageLabel(script.language)}
              </div>
            </div>
            {/* Script visibility badge */}
            {script.isPublic && (
              <div className="absolute top-3 right-3 bg-green-500/20 backdrop-blur-sm rounded-lg px-2 py-1 text-green-300 text-xs font-medium">
                Public
              </div>
            )}
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
                {getHookById((script as any).hookType)?.name || (script as any).hookType}
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
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span>Created {formatDate(script.createdAt.toString())}</span>
              <span>Updated {formatDate(script.updatedAt.toString())}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}