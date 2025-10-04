"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ScriptSeries, Script } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { FolderIcon, Trash2, Edit2, ChevronDown, ChevronUp } from "lucide-react";
import { SeriesModal } from "./series-modal";

interface SeriesCardsProps {
  userId: string;
}

export function SeriesCards({ userId }: SeriesCardsProps) {
  const [series, setSeries] = useState<ScriptSeries[]>([]);
  const [expandedSeries, setExpandedSeries] = useState<string | null>(null);
  const [seriesScripts, setSeriesScripts] = useState<Record<string, Script[]>>({});
  const [loading, setLoading] = useState(true);
  const [editingSeries, setEditingSeries] = useState<ScriptSeries | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchSeries();
  }, [userId]);

  const fetchSeries = async () => {
    try {
      const response = await fetch(`/api/series?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setSeries(data);
      }
    } catch (error) {
      console.error("Failed to fetch series:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSeriesScripts = async (seriesId: string) => {
    if (seriesScripts[seriesId]) {
      return; // Already loaded
    }

    try {
      const response = await fetch(`/api/series/${seriesId}/scripts`);
      if (response.ok) {
        const data = await response.json();
        setSeriesScripts(prev => ({ ...prev, [seriesId]: data }));
      }
    } catch (error) {
      console.error("Failed to fetch series scripts:", error);
    }
  };

  const toggleExpand = async (seriesId: string) => {
    if (expandedSeries === seriesId) {
      setExpandedSeries(null);
    } else {
      setExpandedSeries(seriesId);
      await fetchSeriesScripts(seriesId);
    }
  };

  const handleDeleteSeries = async (seriesId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm("Are you sure you want to delete this series? Scripts in this series will not be deleted.")) {
      return;
    }

    try {
      const response = await fetch(`/api/series/${seriesId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSeries(series.filter(s => s.id !== seriesId));
      } else {
        alert("Failed to delete series");
      }
    } catch (error) {
      console.error("Error deleting series:", error);
      alert("Failed to delete series");
    }
  };

  const handleUpdateSeries = async (seriesId: string, data: { name: string; description: string }) => {
    try {
      const response = await fetch(`/api/series/${seriesId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const updatedSeries = await response.json();
        setSeries(series.map(s => s.id === seriesId ? updatedSeries : s));
        setEditingSeries(null);
      } else {
        throw new Error("Failed to update series");
      }
    } catch (error) {
      console.error("Error updating series:", error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 h-32 p-4">
              <div className="bg-gray-200 dark:bg-gray-700 h-6 rounded w-3/4 mb-3"></div>
              <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded w-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (series.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📁</div>
        <h3 className="text-2xl font-semibold text-white mb-2">No series yet</h3>
        <p className="text-zinc-400 mb-6">
          Create your first series to organize your scripts into collections.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {series.map((seriesItem) => {
          const scripts = seriesScripts[seriesItem.id] || [];
          const isExpanded = expandedSeries === seriesItem.id;

          return (
            <div
              key={seriesItem.id}
              className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-300 group shadow-lg shadow-black/20"
            >
              {/* Series Header */}
              <div
                className="p-4 cursor-pointer"
                onClick={() => toggleExpand(seriesItem.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 flex-1">
                    <FolderIcon className="text-cyan-400" size={24} />
                    <h3 className="text-white font-semibold text-lg leading-tight group-hover:text-cyan-400 transition-colors duration-300">
                      {seriesItem.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white/60 hover:text-white hover:bg-white/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingSeries(seriesItem);
                      }}
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white/60 hover:text-red-400 hover:bg-white/10"
                      onClick={(e) => handleDeleteSeries(seriesItem.id, e)}
                    >
                      <Trash2 size={16} />
                    </Button>
                    {isExpanded ? (
                      <ChevronUp className="text-white/60" size={20} />
                    ) : (
                      <ChevronDown className="text-white/60" size={20} />
                    )}
                  </div>
                </div>

                {seriesItem.description && (
                  <p className="text-zinc-400 text-sm mb-2">
                    {seriesItem.description}
                  </p>
                )}

                <div className="text-xs text-zinc-500">
                  {scripts.length} {scripts.length === 1 ? "script" : "scripts"}
                </div>
              </div>

              {/* Expanded Scripts List */}
              {isExpanded && (
                <div className="border-t border-white/10 bg-black/20 p-4">
                  {scripts.length === 0 ? (
                    <p className="text-zinc-500 text-sm text-center py-4">
                      No scripts in this series yet
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {scripts.map((script) => (
                        <Link
                          key={script.id}
                          href={`/scripts/${script.id}`}
                          className="block p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-200"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <h4 className="text-white text-sm font-medium truncate">
                                {script.title}
                              </h4>
                              <p className="text-zinc-400 text-xs truncate">
                                {(script as any).language} • {script.status}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Edit Series Modal */}
      {editingSeries && (
        <SeriesModal
          series={editingSeries}
          onSave={(data) => handleUpdateSeries(editingSeries.id, data)}
          isOpen={!!editingSeries}
          onOpenChange={(open) => !open && setEditingSeries(null)}
        />
      )}
    </>
  );
}
