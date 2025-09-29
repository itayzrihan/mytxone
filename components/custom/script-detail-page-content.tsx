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
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    content: "",
    language: "",
    hookType: "",
    tags: [] as string[],
    isPublic: false,
  });
  const router = useRouter();

  useEffect(() => {
    const fetchScript = async () => {
      try {
        const response = await fetch(`/api/scripts/${scriptId}`);
        if (response.ok) {
          const data = await response.json();
          setScript(data);
          setEditForm({
            title: data.title,
            description: data.description || "",
            content: data.content,
            language: data.language,
            hookType: (data as any).hookType || "",
            tags: Array.isArray(data.tags) ? data.tags : [],
            isPublic: data.isPublic,
          });
        } else if (response.status === 404) {
          router.push("/scripts");
        }
      } catch (error) {
        console.error("Failed to fetch script:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScript();
  }, [scriptId, router]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/scripts/${scriptId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        const updatedScript = await response.json();
        setScript(updatedScript);
        setEditing(false);
      }
    } catch (error) {
      console.error("Failed to save script:", error);
    } finally {
      setSaving(false);
    }
  };

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

  const handleTagsChange = (value: string) => {
    const tags = value.split(",").map(tag => tag.trim()).filter(tag => tag);
    setEditForm({ ...editForm, tags });
  };

  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      javascript: "from-yellow-400/20 to-yellow-600/20",
      typescript: "from-blue-400/20 to-blue-600/20",
      python: "from-green-400/20 to-green-600/20",
      html: "from-orange-400/20 to-orange-600/20",
      css: "from-purple-400/20 to-purple-600/20",
      default: "from-cyan-400/20 to-blue-600/20"
    };
    return colors[language?.toLowerCase()] || colors.default;
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen p-4 pt-16">
        <div className="max-w-4xl mx-auto w-full">
          <div className="animate-pulse space-y-6">
            <div className="bg-gray-200 dark:bg-gray-700 h-8 rounded w-1/3"></div>
            <div className="bg-gray-200 dark:bg-gray-700 h-64 rounded"></div>
            <div className="bg-gray-200 dark:bg-gray-700 h-32 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!script) {
    return (
      <div className="flex flex-col min-h-screen p-4 pt-16">
        <div className="max-w-4xl mx-auto w-full text-center py-16">
          <h1 className="text-2xl font-bold text-white mb-4">Script not found</h1>
          <Link
            href="/scripts"
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300"
          >
            ←
            Back to Scripts
          </Link>
        </div>
      </div>
    );
  }

  const canEdit = script.userId === user.id;

  return (
    <div className="flex flex-col min-h-screen p-4 pt-16">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/scripts"
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            ←
            Back to Scripts
          </Link>
          
          {canEdit && (
            <div className="flex gap-2">
              {editing ? (
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-green-500/20 backdrop-blur-md border border-green-400/30 hover:bg-green-500/30 transition-all duration-300 text-white"
                >
                  💾
                  {saving ? "Saving..." : "Save"}
                </Button>
              ) : (
                <Button
                  onClick={() => setEditing(true)}
                  className="bg-blue-500/20 backdrop-blur-md border border-blue-400/30 hover:bg-blue-500/30 transition-all duration-300 text-white"
                >
                  <PencilEditIcon size={16} />
                  Edit
                </Button>
              )}
              <Button
                onClick={handleDelete}
                className="bg-red-500/20 backdrop-blur-md border border-red-400/30 hover:bg-red-500/30 transition-all duration-300 text-white"
              >
                <TrashIcon size={16} />
                Delete
              </Button>
            </div>
          )}
        </div>

        {/* Script Content */}
        <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden">
          {/* Language Header */}
          <div className={`h-24 bg-gradient-to-br ${getLanguageColor(script.language)} flex items-center justify-between px-6`}>
            <div className="flex items-center gap-4">
              <div className="text-2xl">
                {script.language === 'javascript' && '🟨'}
                {script.language === 'typescript' && '🔷'}
                {script.language === 'python' && '🐍'}
                {script.language === 'html' && '🌐'}
                {script.language === 'css' && '🎨'}
                {!['javascript', 'typescript', 'python', 'html', 'css'].includes(script.language) && '📄'}
              </div>
              <div>
                <div className="text-white/80 text-sm font-medium uppercase tracking-wider">
                  {script.language}
                </div>
                <div className="text-white/60 text-xs">
                  {new Date(script.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            {script.isPublic && (
              <div className="bg-green-500/20 backdrop-blur-sm rounded-lg px-3 py-1 text-green-300 text-sm font-medium">
                Public
              </div>
            )}
          </div>

          <div className="p-6 space-y-6">
            {/* Title */}
            {editing ? (
              <Input
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="text-2xl font-bold bg-white/5 border-white/20 text-white"
                placeholder="Script title"
              />
            ) : (
              <h1 className="text-2xl font-bold text-white">{script.title}</h1>
            )}

            {/* Description */}
            {editing ? (
              <Textarea
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="bg-white/5 border-white/20 text-white"
                placeholder="Script description (optional)"
                rows={3}
              />
            ) : script.description ? (
              <p className="text-zinc-300 text-lg">{script.description}</p>
            ) : null}

            {/* Tags */}
            {editing ? (
              <Input
                value={Array.isArray(editForm.tags) ? editForm.tags.join(", ") : ""}
                onChange={(e) => handleTagsChange(e.target.value)}
                className="bg-white/5 border-white/20 text-white"
                placeholder="Tags (comma-separated)"
              />
            ) : script.tags && Array.isArray(script.tags) && script.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {(script.tags as string[]).map((tag, index) => (
                  <span
                    key={index}
                    className="bg-white/10 text-zinc-300 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            {/* Code Content */}
            <div className="bg-black/30 rounded-lg p-4 font-mono text-sm overflow-x-auto">
              {editing ? (
                <Textarea
                  value={editForm.content}
                  onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                  className="bg-transparent border-none text-green-300 font-mono text-sm resize-none min-h-[300px] w-full"
                  placeholder="// Your script code here"
                />
              ) : (
                <pre className="text-green-300 whitespace-pre-wrap break-words">
                  {script.content}
                </pre>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}