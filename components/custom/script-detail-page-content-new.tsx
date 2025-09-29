"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "next-auth";
import Link from "next/link";
import { Script } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { PencilEditIcon, TrashIcon } from "./icons";
import { VIDEO_HOOKS, VIDEO_LANGUAGES, getHookById, getLanguageLabel } from "@/lib/video-script-constants";

interface ScriptDetailPageContentProps {
  scriptId: string;
  user: User;
}

export function ScriptDetailPageContent({ scriptId, user }: ScriptDetailPageContentProps) {
  const [script, setScript] = useState<Script | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchScript = async () => {
      try {
        const response = await fetch(`/api/scripts/${scriptId}`);
        if (response.ok) {
          const data = await response.json();
          setScript(data);
        } else {
          router.push("/scripts");
        }
      } catch (error) {
        console.error("Failed to fetch script:", error);
        router.push("/scripts");
      } finally {
        setLoading(false);
      }
    };

    fetchScript();
  }, [scriptId, router]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this script?")) {
      return;
    }

    try {
      const response = await fetch(`/api/scripts/${scriptId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/scripts");
      }
    } catch (error) {
      console.error("Failed to delete script:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Loading script...</div>
      </div>
    );
  }

  if (!script) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Script not found</div>
      </div>
    );
  }

  const canEdit = script.userId === user.id;
  const tags = Array.isArray(script.tags)
    ? (script.tags as unknown[]).filter((tag): tag is string => typeof tag === "string")
    : [];

  return (
    <div className="flex flex-col min-h-screen p-4 pt-16">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/scripts"
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            ←
            Back to Scripts
          </Link>
          
          <div className="flex gap-2">
            {/* Teleprompter button available to everyone */}
            <Button
              onClick={() => router.push(`/scripts/${scriptId}/teleprompter`)}
              className="bg-purple-500/20 backdrop-blur-md border border-purple-400/30 hover:bg-purple-500/30 transition-all duration-300 text-white"
            >
              📺
              Teleprompter
            </Button>
            
            {/* Edit/Delete buttons only for owners */}
            {canEdit && (
              <>
                <Button
                  onClick={() => {
                    // Build edit URL with all script data
                    const params = new URLSearchParams({
                      editId: script.id,
                      title: script.title,
                      description: script.description || '',
                      content: script.content,
                      language: (script as any).language || 'hebrew',
                      hookType: (script as any).hookType || 'blue-ball',
                      contentType: (script as any).mainContentType || 'storytelling',
                      scriptLength: (script as any).scriptLength || '60',
                      motif: (script as any).motif || '',
                      strongReferenceId: (script as any).strongReferenceId || '',
                      contentFolderLink: (script as any).contentFolderLink || '',
                      productionVideoLink: (script as any).productionVideoLink || '',
                      uploadedVideoLinks: Array.isArray((script as any).uploadedVideoLinks)
                        ? (script as any).uploadedVideoLinks.join(',')
                        : (script as any).uploadedVideoLinks || '',
                      tags: tags.join(','),
                      status: script.status,
                      isPublic: script.isPublic.toString()
                    });
                    router.push(`/scripts/create?${params.toString()}`);
                  }}
                  className="bg-blue-500/20 backdrop-blur-md border border-blue-400/30 hover:bg-blue-500/30 transition-all duration-300 text-white"
                >
                  <PencilEditIcon size={16} />
                  Edit
                </Button>
                <Button
                  onClick={handleDelete}
                  className="bg-red-500/20 backdrop-blur-md border border-red-400/30 hover:bg-red-500/30 transition-all duration-300 text-white"
                >
                  <TrashIcon size={16} />
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Script Content */}
        <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden">
          {/* Title Section */}
          <div className="p-6 border-b border-white/10">
            <h1 className="text-2xl font-bold text-white mb-2">{script.title}</h1>
            {script.description && (
              <p className="text-zinc-300">{script.description}</p>
            )}
          </div>

          {/* Metadata */}
          <div className="p-6 border-b border-white/10 bg-white/5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="text-sm font-medium text-zinc-400 mb-1">Language</h3>
                <p className="text-white">
                  {getLanguageLabel((script as any).language) || 'Not specified'}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-zinc-400 mb-1">Hook Type</h3>
                <p className="text-white">
                  {getHookById((script as any).hookType)?.name || (script as any).hookType || 'Not specified'}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-zinc-400 mb-1">Status</h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  script.status === 'ready' 
                    ? 'bg-green-500/20 text-green-300' 
                    : 'bg-yellow-500/20 text-yellow-300'
                }`}>
                  {script.status === 'ready' ? 'Ready' : 'In Progress'}
                </span>
              </div>
            </div>

       
            {tags.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-zinc-400 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 text-zinc-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Script Content</h3>
            <div className="bg-black/20 rounded-lg p-4 border border-white/10">
              <pre className="text-white whitespace-pre-wrap font-mono text-sm leading-relaxed">
                {script.content}
              </pre>
            </div>
          </div>

          {/* Links Section */}
          {((script as any).contentFolderLink || (script as any).productionVideoLink || (script as any).uploadedVideoLinks) && (
            <div className="p-6 border-t border-white/10 bg-white/5">
              <h3 className="text-lg font-semibold text-white mb-4">Links</h3>
              <div className="space-y-2">
                {(script as any).contentFolderLink && (
                  <div>
                    <span className="text-sm text-zinc-400">Content Folder: </span>
                    <a 
                      href={(script as any).contentFolderLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 underline"
                    >
                      {(script as any).contentFolderLink}
                    </a>
                  </div>
                )}
                {(script as any).productionVideoLink && (
                  <div>
                    <span className="text-sm text-zinc-400">Production Video: </span>
                    <a 
                      href={(script as any).productionVideoLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 underline"
                    >
                      {(script as any).productionVideoLink}
                    </a>
                  </div>
                )}
                {(script as any).uploadedVideoLinks && Array.isArray((script as any).uploadedVideoLinks) && (script as any).uploadedVideoLinks.length > 0 && (
                  <div>
                    <span className="text-sm text-zinc-400">Uploaded Videos: </span>
                    <div className="mt-1 space-y-1">
                      {((script as any).uploadedVideoLinks as string[]).map((link, index) => (
                        <div key={index}>
                          <a 
                            href={link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:text-cyan-300 underline block"
                          >
                            {link}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="p-6 border-t border-white/10 bg-white/5">
            <div className="flex items-center justify-between text-sm text-zinc-400">
              <span>Created: {new Date(script.createdAt).toLocaleDateString()}</span>
              <span>Updated: {new Date(script.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}