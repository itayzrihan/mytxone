"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { User } from "next-auth";
import { Button } from "@/components/ui/button";
import { VIDEO_HOOKS, VIDEO_LANGUAGES, MAIN_CONTENT_TYPES, VIDEO_STATUS, SCRIPT_LENGTHS, VIDEO_MOTIFS, MOTIF_CATEGORIES, getContentTypesByCategory, CATEGORY_CONFIG, getContentTypesWithFavorites, getHooksWithFavorites, type CustomHook, type CustomContentType, type Motif, type ContentType, type Hook } from "@/lib/video-script-constants";
import { CustomItemModal } from "@/components/custom/custom-item-modal";
import { Plus, Star } from "lucide-react";

interface ScriptCreatePageContentProps {
  user: User;
}

interface FormData {
  title: string;
  description: string;
  language: string;
  hookType: string;
  mainContentType: string;
  scriptLength: string;
  motif: string;
  strongReferenceId: string;
  contentFolderLink: string;
  productionVideoLink: string;
  uploadedVideoLinks: string;
  status: string;
  content: string;
  tags: string;
  isPublic: boolean;
}

interface UserScript {
  id: string;
  title: string;
  description: string | null;
  content: string;
  hookType: string;
  mainContentType: string;
  createdAt: Date;
  status: string;
}

const SCRIPT_START_MARKER = "SCRIPT_START";
const SCRIPT_END_MARKER = "SCRIPT_END";
const TITLE_MARKER = "SUGGESTED_TITLE:";

interface StreamedScriptState {
  script: string;
  hasStarted: boolean;
  hasEnded: boolean;
  title: string;
}

const parseStreamedScriptState = (buffer: string): StreamedScriptState => {
  const startIndex = buffer.indexOf(SCRIPT_START_MARKER);
  if (startIndex === -1) {
    return { script: "", hasStarted: false, hasEnded: false, title: "" };
  }

  const afterStart = buffer.slice(startIndex + SCRIPT_START_MARKER.length);
  const endIndex = afterStart.indexOf(SCRIPT_END_MARKER);
  const hasEnded = endIndex !== -1;
  const scriptSection = hasEnded ? afterStart.slice(0, endIndex) : afterStart;

  const normalizedScript = scriptSection.replace(/\r/g, "");
  const script = normalizedScript.replace(/^[\s\n]+/, "").replace(/[\s\n]+$/, "");

  let title = "";
  if (hasEnded) {
    const afterEnd = afterStart.slice(endIndex + SCRIPT_END_MARKER.length);
    const titleIndex = afterEnd.indexOf(TITLE_MARKER);
    if (titleIndex !== -1) {
      title = afterEnd.slice(titleIndex + TITLE_MARKER.length).trim();
    }
  }

  return {
    script,
    hasStarted: true,
    hasEnded,
    title,
  };
};

export function ScriptCreatePageContent({ user }: ScriptCreatePageContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Check if we're in edit mode
  const editId = searchParams?.get('editId');
  const isEditMode = !!editId;
  
  // Default values that will be used for both server and initial client render
  const getInitialLanguage = () => "hebrew";
  const getInitialHookType = () => "blue-ball";
  const getInitialContentType = () => "storytelling";
  const getInitialScriptLength = () => "60";
  const getInitialMotif = () => "";

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    language: getInitialLanguage(),
    hookType: getInitialHookType(),
    mainContentType: getInitialContentType(),
    scriptLength: getInitialScriptLength(),
    motif: getInitialMotif(),
    strongReferenceId: "",
    contentFolderLink: "",
    productionVideoLink: "",
    uploadedVideoLinks: "",
    status: "in-progress",
    content: "",
    tags: "",
    isPublic: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [isSavingAndGenerating, setIsSavingAndGenerating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isHookPreviewExpanded, setIsHookPreviewExpanded] = useState(false);
  const [isContentTypePreviewExpanded, setIsContentTypePreviewExpanded] = useState(false);
  
  // Custom items state
  const [customHooks, setCustomHooks] = useState<CustomHook[]>([]);
  const [customContentTypes, setCustomContentTypes] = useState<CustomContentType[]>([]);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customModalType, setCustomModalType] = useState<'hook' | 'contentType'>('hook');
  
  // Favorites state
  const [favoriteContentTypes, setFavoriteContentTypes] = useState<string[]>([]);
  const [favoriteHooks, setFavoriteHooks] = useState<string[]>([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(true);
  
  // User scripts for strong reference
  const [userScripts, setUserScripts] = useState<UserScript[]>([]);
  const [isLoadingScripts, setIsLoadingScripts] = useState(false);
  
  // Subscription state
  const [userSubscription, setUserSubscription] = useState<'free' | 'basic' | 'pro' | null>(null);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(true);
  
  // Hydration state
  const [isHydrated, setIsHydrated] = useState(false);

  // Update form data with saved preferences after component mounts (for hydration safety)
  useEffect(() => {
    setIsHydrated(true);
    if (typeof window !== "undefined") {
      setFormData(prev => ({
        ...prev,
        language: localStorage.getItem("preferred-language") || "hebrew",
        hookType: localStorage.getItem("preferred-hook-type") || "blue-ball",
        mainContentType: localStorage.getItem("preferred-content-type") || "storytelling",
        scriptLength: localStorage.getItem("preferred-script-length") || "60",
        motif: localStorage.getItem("preferred-motif") || ""
      }));
    }
  }, []);

  // Handle URL parameters for "Create Similar" functionality and Edit mode
  useEffect(() => {
    if (searchParams) {
      const title = searchParams.get('title');
      const description = searchParams.get('description');
      const content = searchParams.get('content');
      const language = searchParams.get('language');
      const hookType = searchParams.get('hookType');
      const contentType = searchParams.get('contentType');
      const scriptLength = searchParams.get('scriptLength');
      const motif = searchParams.get('motif');
      const strongReferenceId = searchParams.get('strongReferenceId');
      const contentFolderLink = searchParams.get('contentFolderLink');
      const productionVideoLink = searchParams.get('productionVideoLink');
      const uploadedVideoLinks = searchParams.get('uploadedVideoLinks');
      const tags = searchParams.get('tags');
      const status = searchParams.get('status');
      const isPublic = searchParams.get('isPublic');

      if (title || description || language || hookType || contentType || strongReferenceId || editId) {
        setFormData(prev => ({
          ...prev,
          title: title || prev.title,
          description: description || prev.description,
          content: content || (isEditMode ? (content || "") : ""), // Keep content in edit mode, clear for "create similar"
          language: language || prev.language,
          hookType: hookType || prev.hookType,
          mainContentType: contentType || prev.mainContentType,
          scriptLength: scriptLength || prev.scriptLength,
          motif: motif || prev.motif,
          strongReferenceId: strongReferenceId || prev.strongReferenceId,
          contentFolderLink: contentFolderLink || prev.contentFolderLink,
          productionVideoLink: productionVideoLink || prev.productionVideoLink,
          uploadedVideoLinks: uploadedVideoLinks || prev.uploadedVideoLinks,
          tags: tags || prev.tags,
          status: status || prev.status,
          isPublic: isPublic ? isPublic === 'true' : prev.isPublic,
        }));
      }
    }
  }, [searchParams, editId, isEditMode]);

  // Save preferences to localStorage when form data changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("preferred-language", formData.language);
      localStorage.setItem("preferred-hook-type", formData.hookType);
      localStorage.setItem("preferred-content-type", formData.mainContentType);
      localStorage.setItem("preferred-script-length", formData.scriptLength);
      if (formData.motif) {
        localStorage.setItem("preferred-motif", formData.motif);
      }
    }
  }, [formData.language, formData.hookType, formData.mainContentType, formData.scriptLength, formData.motif]);

  // Load custom items from database
  useEffect(() => {
    loadCustomItems();
    loadFavorites();
    loadUserSubscription();
  }, []);

  const loadFavorites = async () => {
    try {
      setIsLoadingFavorites(true);
      const response = await fetch('/api/favorites');
      if (response.ok) {
        const data = await response.json();
        const contentTypeFavorites = data.favorites
          .filter((fav: any) => fav.favoriteType === 'content_type')
          .map((fav: any) => fav.favoriteId);
        const hookFavorites = data.favorites
          .filter((fav: any) => fav.favoriteType === 'hook')
          .map((fav: any) => fav.favoriteId);
        
        setFavoriteContentTypes(contentTypeFavorites);
        setFavoriteHooks(hookFavorites);
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    } finally {
      setIsLoadingFavorites(false);
    }
  };

  const toggleFavorite = async (type: 'content_type' | 'hook', id: string) => {
    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          favoriteType: type,
          favoriteId: id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        if (type === 'content_type') {
          if (data.isFavorite) {
            setFavoriteContentTypes([...favoriteContentTypes, id]);
          } else {
            setFavoriteContentTypes(favoriteContentTypes.filter(fav => fav !== id));
          }
        } else {
          if (data.isFavorite) {
            setFavoriteHooks([...favoriteHooks, id]);
          } else {
            setFavoriteHooks(favoriteHooks.filter(fav => fav !== id));
          }
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const loadCustomItems = async () => {
    try {
      // Load custom hooks
      const hooksResponse = await fetch('/api/custom-hooks');
      if (hooksResponse.ok) {
        const hooksData = await hooksResponse.json();
        setCustomHooks(hooksData.customHooks || []);
      }

      // Load custom content types
      const contentTypesResponse = await fetch('/api/custom-content-types');
      if (contentTypesResponse.ok) {
        const contentTypesData = await contentTypesResponse.json();
        setCustomContentTypes(contentTypesData.customContentTypes || []);
      }

      // Load user scripts for strong reference
      setIsLoadingScripts(true);
      const scriptsResponse = await fetch('/api/user-scripts');
      if (scriptsResponse.ok) {
        const scriptsData = await scriptsResponse.json();
        setUserScripts(scriptsData.scripts || []);
      }
      setIsLoadingScripts(false);
    } catch (error) {
      console.error("Error loading custom items:", error);
      setIsLoadingScripts(false);
    }
  };

  // Load user subscription status
  const loadUserSubscription = async () => {
    try {
      setIsLoadingSubscription(true);
      const response = await fetch('/api/user/subscription');
      if (response.ok) {
        const data = await response.json();
        setUserSubscription(data.subscription);
      } else {
        console.error('Failed to fetch user subscription');
        setUserSubscription('free'); // Default to free on error
      }
    } catch (error) {
      console.error("Error loading user subscription:", error);
      setUserSubscription('free'); // Default to free on error
    } finally {
      setIsLoadingSubscription(false);
    }
  };

  // Handle saving custom items
  const handleSaveCustomItem = (item: Partial<CustomHook> | Partial<CustomContentType>, type: 'hook' | 'contentType') => {
    if (type === 'hook') {
      const newHook = item as CustomHook;
      const updatedHooks = [...customHooks, newHook];
      setCustomHooks(updatedHooks);
      
      // Auto-select the new hook
      setFormData(prev => ({ ...prev, hookType: newHook.value }));
    } else {
      const newContentType = item as CustomContentType;
      const updatedContentTypes = [...customContentTypes, newContentType];
      setCustomContentTypes(updatedContentTypes);
      
      // Auto-select the new content type
      setFormData(prev => ({ ...prev, mainContentType: newContentType.value }));
    }
  };

  const openCustomModal = (type: 'hook' | 'contentType') => {
    setCustomModalType(type);
    setIsCustomModalOpen(true);
  };

  const streamScriptGeneration = useCallback(
    async (
      body: Record<string, unknown>,
      onScriptUpdate?: (script: string) => void,
    ) => {
      const response = await fetch('/api/generate-video-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to initiate script generation.';
        try {
          const errorData = await response.json();
          errorMessage = errorData?.error || errorData?.details || errorMessage;
        } catch (parseError) {
          console.error('Failed to parse error response from script generation:', parseError);
        }
        throw new Error(errorMessage);
      }

      if (!response.body) {
        throw new Error('Streaming not supported in this environment.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let aggregated = '';
      let latestScript = '';
      let finalTitle = '';
      let lastEmittedScript = '';

      const emitUpdate = (scriptValue: string) => {
        if (!scriptValue.length || scriptValue === lastEmittedScript) {
          return;
        }
        lastEmittedScript = scriptValue;
        latestScript = scriptValue;
        onScriptUpdate?.(scriptValue);
      };

      const processEvent = (eventType: string, data: unknown) => {
        if (eventType === 'chunk') {
          const content = typeof (data as { content?: unknown })?.content === 'string'
            ? (data as { content?: string }).content
            : '';

          if (!content) {
            return;
          }

          aggregated += content;
          const state = parseStreamedScriptState(aggregated);

          if (state.hasStarted) {
            emitUpdate(state.script);
            if (state.hasEnded && state.title) {
              finalTitle = state.title;
            }
          }
        } else if (eventType === 'complete') {
          const scriptField = (data as { script?: unknown })?.script;
          const titleField = (data as { suggestedTitle?: unknown })?.suggestedTitle;
          const scriptValue = typeof scriptField === 'string' ? scriptField.trim() : '';
          const titleValue = typeof titleField === 'string' ? titleField.trim() : '';

          if (scriptValue) {
            emitUpdate(scriptValue);
          }

          if (titleValue) {
            finalTitle = titleValue;
          }
        } else if (eventType === 'error') {
          const message = typeof (data as { message?: unknown })?.message === 'string'
            ? (data as { message?: string }).message
            : 'Failed to generate script.';
          throw new Error(message);
        }
      };

      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            break;
          }

          buffer += decoder.decode(value, { stream: true });

          let delimiterIndex: number;
          while ((delimiterIndex = buffer.indexOf('\n\n')) !== -1) {
            const eventBlock = buffer.slice(0, delimiterIndex);
            buffer = buffer.slice(delimiterIndex + 2);

            if (!eventBlock.trim()) {
              continue;
            }

            const lines = eventBlock.split('\n');
            let eventType = 'message';
            let dataPayload = '';

            for (const line of lines) {
              if (line.startsWith('event:')) {
                eventType = line.slice(6).trim();
              } else if (line.startsWith('data:')) {
                const payloadLine = line.slice(5).trim();
                dataPayload += dataPayload ? `\n${payloadLine}` : payloadLine;
              }
            }

            if (!dataPayload) {
              continue;
            }

            let parsedData: unknown;
            try {
              parsedData = JSON.parse(dataPayload);
            } catch (parseError) {
              console.error('Failed to parse SSE payload:', parseError, { dataPayload });
              continue;
            }

            try {
              processEvent(eventType, parsedData);
            } catch (streamError) {
              if (streamError instanceof Error) {
                throw streamError;
              }
              throw new Error('Failed to process script generation stream.');
            }
          }
        }
      } catch (streamError) {
        if (streamError instanceof Error) {
          throw streamError;
        }
        throw new Error('Unknown error during script streaming.');
      }

      if (!latestScript) {
        const fallbackState = parseStreamedScriptState(aggregated);
        if (fallbackState.script) {
          emitUpdate(fallbackState.script);
        }
        if (!finalTitle && fallbackState.title) {
          finalTitle = fallbackState.title.trim();
        }
      }

      if (!latestScript) {
        throw new Error('No script content received from the stream.');
      }

      return {
        script: latestScript.trim(),
        suggestedTitle: finalTitle.trim(),
      };
    },
    [],
  );

  const generateScript = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      alert("Please fill in both title and description before generating a script.");
      return;
    }

    setIsGeneratingScript(true);

    const previousContent = formData.content;

    try {
      console.log("Starting script generation with params:", {
        title: formData.title,
        description: formData.description,
        language: formData.language,
        hookType: formData.hookType,
        contentType: formData.mainContentType,
        scriptLength: formData.scriptLength
      });

      setFormData(prev => ({ ...prev, content: '' }));

      const { script, suggestedTitle } = await streamScriptGeneration(
        {
          title: formData.title,
          description: formData.description,
          language: formData.language,
          hookType: formData.hookType,
          contentType: formData.mainContentType,
          scriptLength: formData.scriptLength,
          motif: formData.motif,
          strongReferenceId: formData.strongReferenceId,
        },
        (partialScript) => {
          setFormData(prev => ({ ...prev, content: partialScript }));
        },
      );

      setFormData(prev => ({
        ...prev,
        title: suggestedTitle || prev.title,
        content: script,
      }));

      alert("🎉 Viral video script generated successfully! Check the content field below.");

    } catch (error) {
      console.error("Error generating script:", error);
      setFormData(prev => ({ ...prev, content: previousContent }));
      const message = error instanceof Error ? error.message : 'Failed to generate script. Please try again.';
      alert(`Failed to generate script: ${message}`);
    } finally {
      setIsGeneratingScript(false);
    }
  };

  const handleSaveAndGenerateAnother = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim() || !formData.content.trim()) {
      alert("Please ensure you have a title, description, and generated content before saving.");
      return;
    }

    setIsSavingAndGenerating(true);

    try {
      // First, save the current script
      const saveResponse = await fetch("/api/scripts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
          uploadedVideoLinks: formData.uploadedVideoLinks.split(",").map((link) => link.trim()).filter(Boolean),
        }),
      });

      if (!saveResponse.ok) {
        console.error("Failed to save script");
        alert("Failed to save the current script. Please try again.");
        return;
      }

      const savedScript = await saveResponse.json();
      console.log("Script saved successfully:", savedScript.id);

      if (typeof window !== "undefined") {
        localStorage.setItem("lastVideoScriptLanguage", formData.language);
        localStorage.setItem("lastVideoScriptHookType", formData.hookType);
        localStorage.setItem("lastVideoScriptContentType", formData.mainContentType);
      }

      const previousContent = formData.content;
      const previousTitle = formData.title;

      setFormData(prev => ({ ...prev, content: '' }));

      try {
        const { script, suggestedTitle } = await streamScriptGeneration(
          {
            title: formData.title,
            description: formData.description,
            language: formData.language,
            hookType: formData.hookType,
            contentType: formData.mainContentType,
            scriptLength: formData.scriptLength,
            motif: formData.motif,
            strongReferenceId: formData.strongReferenceId,
          },
          (partialScript) => {
            setFormData(prev => ({ ...prev, content: partialScript }));
          },
        );

        setFormData(prev => ({
          ...prev,
          title: suggestedTitle || `${previousTitle} - New Variation`,
          content: script,
          contentFolderLink: "",
          productionVideoLink: "",
          uploadedVideoLinks: "",
          tags: "",
        }));

        alert(`🎉 Script saved successfully! New script generated and ready for editing. Check the content field below.`);
      } catch (streamError) {
        console.error("Failed to stream new script:", streamError);
        setFormData(prev => ({ ...prev, content: previousContent }));
        const message = streamError instanceof Error ? streamError.message : 'Unknown error';
        alert(`Script saved successfully! However, failed to generate new script: ${message}. You can generate manually or try again.`);
      }

    } catch (error) {
      console.error("Error in save and generate another:", error);
      alert("An error occurred while saving and generating. Please try again.");
    } finally {
      setIsSavingAndGenerating(false);
    }
  };

  const handleUpdateCurrent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editId) {
      alert("No script ID found for updating.");
      return;
    }
    
    if (!formData.title.trim() || !formData.description.trim()) {
      alert("Please fill in both title and description.");
      return;
    }

    setIsUpdating(true);

    try {
      const response = await fetch(`/api/scripts/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
          uploadedVideoLinks: formData.uploadedVideoLinks.split(",").map((link) => link.trim()).filter(Boolean),
        }),
      });

      if (response.ok) {
        const updatedScript = await response.json();
        
        // Save user's preferences to localStorage for next time
        if (typeof window !== "undefined") {
          localStorage.setItem("lastVideoScriptLanguage", formData.language);
          localStorage.setItem("lastVideoScriptHookType", formData.hookType);
          localStorage.setItem("lastVideoScriptContentType", formData.mainContentType);
        }
        
        // Navigate back to the updated script
        router.push(`/scripts/${editId}`);
      } else {
        console.error("Failed to update script");
        alert("Failed to update script. Please try again.");
      }
    } catch (error) {
      console.error("Error updating script:", error);
      alert("Error updating script. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/scripts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
          uploadedVideoLinks: formData.uploadedVideoLinks.split(",").map((link) => link.trim()).filter(Boolean),
        }),
      });

      if (response.ok) {
        const script = await response.json();
        
        // Save user's preferences to localStorage for next time
        if (typeof window !== "undefined") {
          localStorage.setItem("lastVideoScriptLanguage", formData.language);
          localStorage.setItem("lastVideoScriptHookType", formData.hookType);
          localStorage.setItem("lastVideoScriptContentType", formData.mainContentType);
        }
        
        router.push(`/scripts/${script.id}`);
      } else {
        console.error("Failed to create script");
      }
    } catch (error) {
      console.error("Error creating script:", error);
    } finally {
      setIsSubmitting(false);
    }
  };



  // Get selected hook (built-in or custom)
  const selectedHook = VIDEO_HOOKS.find(hook => hook.id === formData.hookType) || 
                      customHooks.find(hook => hook.value === formData.hookType);
  
  // Get selected content type (built-in or custom)  
  const selectedContentType = MAIN_CONTENT_TYPES.find(type => type.value === formData.mainContentType) ||
                              customContentTypes.find(type => type.value === formData.mainContentType);

  return (
    <div className="flex flex-col min-h-screen p-4 pt-16 ">
      <div className="max-w-4xl mx-auto bg-gray-900/50 backdrop-blur-lg p-8 rounded-2xl shadow-lg border border-gray-700">
        <h1 className="text-3xl font-bold text-white mb-8">
          {isEditMode ? "Edit Video Script" : "Create New Video Script"}
        </h1>
        
        {isEditMode && (
          <div className="mb-6 p-4 bg-blue-500/10 border border-blue-400/30 rounded-lg">
            <p className="text-blue-300 text-sm">
              📝 You&apos;re editing an existing script. You can update the current script, save it as a new script, or save and generate another variation.
            </p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-white mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-zinc-400 focus:border-cyan-400 focus:outline-none"
              placeholder="Enter video script title"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-white mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-zinc-400 focus:border-cyan-400 focus:outline-none resize-none"
              placeholder="Describe your video script"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Language */}
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-white mb-2">
                Language *
              </label>
              <select
                id="language"
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="w-full p-3 bg-gray-500/20 backdrop-blur-lg border border-gray-400/30 rounded-xl text-white focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 shadow-lg transition-all duration-300 hover:bg-gray-500/30"
                required
              >
                <option value="" className="bg-gray-800 text-gray-300">Select language</option>
                {VIDEO_LANGUAGES.map((lang) => (
                  <option key={lang.value} value={lang.value} className="bg-gray-800 text-white hover:bg-gray-700">
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Hook Type */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="hookType" className="block text-sm font-medium text-white">
                  Hook Type *
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => openCustomModal('hook')}
                  className="h-7 px-2 text-xs bg-white/5 border-white/20 hover:bg-white/10 text-white"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Create Custom
                </Button>
              </div>
              <select
                id="hookType"
                value={formData.hookType}
                onChange={(e) => setFormData({ ...formData, hookType: e.target.value })}
                className="w-full p-3 bg-gray-500/20 backdrop-blur-lg border border-gray-400/30 rounded-xl text-white focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 shadow-lg transition-all duration-300 hover:bg-gray-500/30"
                required
              >
                <option value="" className="bg-gray-800 text-gray-300">Select hook type</option>
                
                {/* Built-in hooks */}
                <optgroup label="📚 Built-in Hooks" className="bg-gray-700 text-cyan-300 font-semibold">
                  {getHooksWithFavorites(favoriteHooks).map((hook) => (
                    <option key={hook.id} value={hook.id} className="bg-gray-800 text-white hover:bg-gray-700 relative">
                      {hook.isFavorite ? "⭐ " : ""}
                      {hook.name}
                    </option>
                  ))}
                </optgroup>

                {/* Custom hooks */}
                {customHooks.length > 0 && (
                  <optgroup label="⭐ Custom Hooks" className="bg-gray-700 text-purple-300 font-semibold">
                    {customHooks.map((hook) => (
                      <option key={hook.id} value={hook.value} className="bg-gray-800 text-white hover:bg-gray-700">
                        🔧 {hook.label} {!hook.isPublic && '🔒'}
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
            </div>

            {/* Main Content Type */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="mainContentType" className="block text-sm font-medium text-white">
                  Main Content Type *
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => openCustomModal('contentType')}
                  className="h-7 px-2 text-xs bg-white/5 border-white/20 hover:bg-white/10 text-white"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Create Custom
                </Button>
              </div>
              <select
                id="mainContentType"
                value={formData.mainContentType}
                onChange={(e) => setFormData({ ...formData, mainContentType: e.target.value })}
                className="w-full p-3 bg-gray-500/20 backdrop-blur-lg border border-gray-400/30 rounded-xl text-white focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 shadow-lg transition-all duration-300 hover:bg-gray-500/30"
                required
              >
                <option value="" className="bg-gray-800 text-gray-300">Select content type</option>
                
                {/* Built-in content types */}
                {(() => {
                  const contentTypesWithFavorites = getContentTypesWithFavorites(favoriteContentTypes);
                  const contentTypesByCategory = contentTypesWithFavorites.reduce((acc, type) => {
                    const category = type.category || "Other";
                    if (!acc[category]) acc[category] = [];
                    acc[category].push(type);
                    return acc;
                  }, {} as Record<string, ContentType[]>);
                  
                  const sortedCategories = Object.keys(contentTypesByCategory).sort((a, b) => {
                    const orderA = CATEGORY_CONFIG[a as keyof typeof CATEGORY_CONFIG]?.order || 999;
                    const orderB = CATEGORY_CONFIG[b as keyof typeof CATEGORY_CONFIG]?.order || 999;
                    return orderA - orderB;
                  });

                  return sortedCategories.map((category) => [
                    <optgroup key={`category-${category}`} label={`${CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG]?.icon || "📝"} ${category}`} className="bg-gray-700 text-cyan-300 font-semibold">
                      {contentTypesByCategory[category].map((type) => (
                        <option 
                          key={type.value} 
                          value={type.value} 
                          className="bg-gray-800 text-white hover:bg-gray-700 pl-4"
                          title={type.description}
                        >
                          {type.isFavorite ? "⭐ " : ""}
                          {type.isTrending ? "🔥 " : ""}
                          {type.isPowerful ? "⚡ " : ""}
                          {type.isAuthorityBuilding ? "👑 " : ""}
                          {type.label}
                          {type.isTrending ? " (Trending)" : ""}
                        </option>
                      ))}
                    </optgroup>
                  ]).flat();
                })()}

                {/* Custom content types */}
                {customContentTypes.length > 0 && (() => {
                  const customTypesByCategory = customContentTypes.reduce((acc, type) => {
                    if (!acc[type.category]) acc[type.category] = [];
                    acc[type.category].push(type);
                    return acc;
                  }, {} as Record<string, CustomContentType[]>);

                  return Object.keys(customTypesByCategory).map((category) => (
                    <optgroup key={`custom-${category}`} label={`⭐ Custom: ${category}`} className="bg-gray-700 text-purple-300 font-semibold">
                      {customTypesByCategory[category].map((type) => (
                        <option 
                          key={type.id} 
                          value={type.value} 
                          className="bg-gray-800 text-white hover:bg-gray-700 pl-4"
                          title={type.description}
                        >
                          🔧 {type.label} {!type.isPublic && '🔒'}
                        </option>
                      ))}
                    </optgroup>
                  ));
                })()}
              </select>
            </div>

            {/* Script Length */}
            <div>
              <label htmlFor="scriptLength" className="block text-sm font-medium text-white mb-2">
                Script Length *
              </label>
              <select
                id="scriptLength"
                value={formData.scriptLength}
                onChange={(e) => {
                  const newLength = e.target.value;
                  setFormData({ ...formData, scriptLength: newLength });
                  localStorage.setItem("preferred-script-length", newLength);
                }}
                className="w-full p-3 bg-gray-500/20 backdrop-blur-lg border border-gray-400/30 rounded-xl text-white focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 shadow-lg transition-all duration-300 hover:bg-gray-500/30"
                required
              >
                {SCRIPT_LENGTHS.map((length) => (
                  <option key={length.value} value={length.value} className="bg-gray-800 text-white">
                    {length.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Motif and Strong Reference Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Motif */}
            <div>
              <label htmlFor="motif" className="block text-sm font-medium text-white mb-2">
                Motif/Emotional Tone
              </label>
              <select
                id="motif"
                value={formData.motif}
                onChange={(e) => {
                  const newMotif = e.target.value;
                  setFormData({ ...formData, motif: newMotif });
                  if (typeof window !== "undefined") {
                    if (newMotif) {
                      localStorage.setItem("preferred-motif", newMotif);
                    } else {
                      localStorage.removeItem("preferred-motif");
                    }
                  }
                }}
                className="w-full p-3 bg-gray-500/20 backdrop-blur-lg border border-gray-400/30 rounded-xl text-white focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 shadow-lg transition-all duration-300 hover:bg-gray-500/30"
              >
                <option value="" className="bg-gray-800 text-gray-300">No specific motif</option>
                {(() => {
                  const motifsByCategory = VIDEO_MOTIFS.reduce((acc, motif) => {
                    if (!acc[motif.category]) acc[motif.category] = [];
                    acc[motif.category].push(motif);
                    return acc;
                  }, {} as Record<string, Motif[]>);

                  const sortedCategories = Object.keys(motifsByCategory).sort((a, b) => {
                    const orderA = MOTIF_CATEGORIES[a as keyof typeof MOTIF_CATEGORIES]?.order || 999;
                    const orderB = MOTIF_CATEGORIES[b as keyof typeof MOTIF_CATEGORIES]?.order || 999;
                    return orderA - orderB;
                  });

                  return sortedCategories.map((category) => (
                    <optgroup key={`motif-${category}`} label={`${MOTIF_CATEGORIES[category as keyof typeof MOTIF_CATEGORIES]?.icon || "🎭"} ${category}`} className="bg-gray-700 text-cyan-300 font-semibold">
                      {motifsByCategory[category].map((motif) => (
                        <option 
                          key={motif.value} 
                          value={motif.value} 
                          className="bg-gray-800 text-white hover:bg-gray-700 pl-4"
                          title={motif.description}
                        >
                          {motif.icon} {motif.label}
                        </option>
                      ))}
                    </optgroup>
                  ));
                })()}
              </select>
            </div>

            {/* Strong Reference */}
            <div>
              <label htmlFor="strongReference" className="block text-sm font-medium text-white mb-2">
                Strong Reference Script
              </label>
              <select
                id="strongReference"
                value={formData.strongReferenceId}
                onChange={(e) => setFormData({ ...formData, strongReferenceId: e.target.value })}
                className="w-full p-3 bg-gray-500/20 backdrop-blur-lg border border-gray-400/30 rounded-xl text-white focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 shadow-lg transition-all duration-300 hover:bg-gray-500/30"
                disabled={isLoadingScripts}
              >
                <option value="" className="bg-gray-800 text-gray-300">
                  {isLoadingScripts ? "Loading scripts..." : "No strong reference"}
                </option>
                {userScripts.map((script) => (
                  <option 
                    key={script.id} 
                    value={script.id} 
                    className="bg-gray-800 text-white hover:bg-gray-700"
                    title={script.description || script.title}
                  >
                    📝 {script.title} ({script.status})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Motif Preview */}
          {formData.motif && (() => {
            const selectedMotif = VIDEO_MOTIFS.find(motif => motif.value === formData.motif);
            return selectedMotif && (
              <div className="p-4 bg-purple-500/10 border border-purple-400/20 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{selectedMotif.icon}</span>
                  <div className="text-lg font-medium text-purple-300">
                    {selectedMotif.label}
                  </div>
                  <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
                    {selectedMotif.category}
                  </span>
                </div>
                <div className="text-sm text-zinc-300">
                  {selectedMotif.description}
                </div>
              </div>
            );
          })()}

          {/* Strong Reference Preview */}
          {formData.strongReferenceId && (() => {
            const selectedScript = userScripts.find(script => script.id === formData.strongReferenceId);
            return selectedScript && (
              <div className="p-4 bg-green-500/10 border border-green-400/20 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">⭐</span>
                  <div className="text-lg font-medium text-green-300">
                    Strong Reference: {selectedScript.title}
                  </div>
                  <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full">
                    {selectedScript.status}
                  </span>
                </div>
                {selectedScript.description && (
                  <div className="text-sm text-zinc-300 mb-2">
                    {selectedScript.description}
                  </div>
                )}
                <div className="text-xs text-zinc-400">
                  Hook: {selectedScript.hookType} | Content: {selectedScript.mainContentType}
                </div>
              </div>
            );
          })()}

          {/* Hook Preview */}
          {selectedHook && (
            <div className="p-4 bg-cyan-500/10 border border-cyan-400/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="text-lg font-medium text-cyan-300">
                    {'name' in selectedHook ? selectedHook.name : selectedHook.label}
                    {'isPublic' in selectedHook && !selectedHook.isPublic && (
                      <span className="ml-2 text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                        Private
                      </span>
                    )}
                  </div>
                  {/* Favorite Button for Hooks */}
                  {'id' in selectedHook && (
                    <button
                      type="button"
                      onClick={() => toggleFavorite('hook', selectedHook.id)}
                      className={`p-2 rounded-full transition-all ${
                        favoriteHooks.includes(selectedHook.id)
                          ? 'text-yellow-400 hover:text-yellow-300 bg-yellow-400/10'
                          : 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10'
                      }`}
                      title={favoriteHooks.includes(selectedHook.id) ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Star 
                        className={`w-4 h-4 ${favoriteHooks.includes(selectedHook.id) ? 'fill-current' : ''}`}
                      />
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setIsHookPreviewExpanded(!isHookPreviewExpanded)}
                  className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <span>{isHookPreviewExpanded ? 'Hide Details' : 'Show Details'}</span>
                  <svg 
                    className={`w-4 h-4 transition-transform ${isHookPreviewExpanded ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              <div className="text-sm text-zinc-300 mb-3">
                {selectedHook.description}
              </div>
              {isHookPreviewExpanded && (
                <>
                  <div className="text-sm text-zinc-400 mb-2 font-semibold">
                    Structure:
                  </div>
                  <div className="text-sm text-zinc-300 font-mono bg-black/20 p-2 rounded mb-3">
                    {selectedHook.structure}
                  </div>
                  <div className="text-sm text-zinc-400 mb-2 font-semibold">
                    Example:
                  </div>
                  <div className="text-sm text-zinc-300 italic bg-black/20 p-2 rounded">
                    &quot;{selectedHook.example}&quot;
                  </div>
                </>
              )}
            </div>
          )}

          {/* Content Type Preview */}
          {selectedContentType && (
            <div className="p-4 bg-purple-500/10 border border-purple-400/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="text-lg font-medium text-purple-300">
                    {'isTrending' in selectedContentType && selectedContentType.isTrending && "🔥 "}
                    {'isPowerful' in selectedContentType && selectedContentType.isPowerful && "⚡ "}
                    {'isAuthorityBuilding' in selectedContentType && selectedContentType.isAuthorityBuilding && "👑 "}
                    {selectedContentType.label}
                  </div>
                  {'isTrending' in selectedContentType && selectedContentType.isTrending && (
                    <span className="text-xs bg-orange-500/20 text-orange-300 px-2 py-1 rounded-full border border-orange-400/30">
                      TRENDING
                    </span>
                  )}
                  {'isPowerful' in selectedContentType && selectedContentType.isPowerful && (
                    <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full border border-yellow-400/30">
                      POWERFUL
                    </span>
                  )}
                  {'isAuthorityBuilding' in selectedContentType && selectedContentType.isAuthorityBuilding && (
                    <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-1 rounded-full border border-amber-400/30">
                      AUTHORITY
                    </span>
                  )}
                  {'isPublic' in selectedContentType && !selectedContentType.isPublic && (
                    <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full border border-purple-400/30">
                      PRIVATE
                    </span>
                  )}
                  {/* Favorite Button for Content Types */}
                  {'value' in selectedContentType && (
                    <button
                      type="button"
                      onClick={() => toggleFavorite('content_type', selectedContentType.value)}
                      className={`p-2 rounded-full transition-all ${
                        favoriteContentTypes.includes(selectedContentType.value)
                          ? 'text-yellow-400 hover:text-yellow-300 bg-yellow-400/10'
                          : 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10'
                      }`}
                      title={favoriteContentTypes.includes(selectedContentType.value) ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Star 
                        className={`w-4 h-4 ${favoriteContentTypes.includes(selectedContentType.value) ? 'fill-current' : ''}`}
                      />
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setIsContentTypePreviewExpanded(!isContentTypePreviewExpanded)}
                  className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <span>{isContentTypePreviewExpanded ? 'Hide Details' : 'Show Details'}</span>
                  <svg 
                    className={`w-4 h-4 transition-transform ${isContentTypePreviewExpanded ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              <div className="text-sm text-zinc-300 mb-3">
                {selectedContentType.description}
              </div>
              {selectedContentType.category && (
                <div className="mb-3 text-xs text-zinc-400">
                  Category: <span className="text-purple-300">{CATEGORY_CONFIG[selectedContentType.category as keyof typeof CATEGORY_CONFIG]?.icon} {selectedContentType.category}</span>
                </div>
              )}
              {isContentTypePreviewExpanded && (
                <>
                  <div className="text-sm text-zinc-400 mb-2 font-semibold">
                    Structure:
                  </div>
                  <div className="text-sm text-zinc-300 font-mono bg-black/20 p-2 rounded mb-3">
                    {selectedContentType.structure}
                  </div>
                  <div className="text-sm text-zinc-400 mb-2 font-semibold">
                    Example:
                  </div>
                  <div className="text-sm text-zinc-300 italic bg-black/20 p-2 rounded">
                    &quot;{selectedContentType.example}&quot;
                  </div>
                </>
              )}
            </div>
          )}

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-white mb-2">
              Script Content *
            </label>
            <textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={12}
              className="w-full p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-zinc-400 focus:border-cyan-400 focus:outline-none resize-none font-mono text-sm"
              placeholder="Write your video script content here..."
              required
            />
            
            {/* Generate Script Button */}
            <div className="mt-3 flex justify-center">
              {userSubscription === 'free' ? (
                <Button
                  type="button"
                  onClick={() => alert('Upgrade to Basic or Pro plan to use AI script generation!')}
                  className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-medium px-6 py-2 rounded-lg transition-all duration-200"
                >
                  🔒 Upgrade to Use AI Generate
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={generateScript}
                  disabled={isGeneratingScript || !formData.title.trim() || !formData.description.trim() || isLoadingSubscription}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium px-6 py-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGeneratingScript ? (
                    <>
                      <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Generating Viral Script...
                    </>
                  ) : (
                    <>
                      ✨ Generate Viral Script with AI
                    </>
                  )}
                </Button>
              )}
            </div>
            
            {(!formData.title.trim() || !formData.description.trim()) && (
              <p className="text-sm text-yellow-400 text-center mt-2">
                💡 Please fill in the title and description above to generate a viral script
              </p>
            )}
          </div>

          {/* Links Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Video Links</h3>
            
            {/* Content Folder Link */}
            <div>
              <label htmlFor="contentFolderLink" className="block text-sm font-medium text-white mb-2">
                Content Folder Link
              </label>
              <input
                type="url"
                id="contentFolderLink"
                value={formData.contentFolderLink}
                onChange={(e) => setFormData({ ...formData, contentFolderLink: e.target.value })}
                className="w-full p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-zinc-400 focus:border-cyan-400 focus:outline-none"
                placeholder="Link to folder with editing content"
              />
            </div>

            {/* Production Video Link */}
            <div>
              <label htmlFor="productionVideoLink" className="block text-sm font-medium text-white mb-2">
                Production Ready Video Link
              </label>
              <input
                type="url"
                id="productionVideoLink"
                value={formData.productionVideoLink}
                onChange={(e) => setFormData({ ...formData, productionVideoLink: e.target.value })}
                className="w-full p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-zinc-400 focus:border-cyan-400 focus:outline-none"
                placeholder="Link to production ready video"
              />
            </div>

            {/* Uploaded Video Links */}
            <div>
              <label htmlFor="uploadedVideoLinks" className="block text-sm font-medium text-white mb-2">
                Uploaded Video Links (comma-separated)
              </label>
              <input
                type="text"
                id="uploadedVideoLinks"
                value={formData.uploadedVideoLinks}
                onChange={(e) => setFormData({ ...formData, uploadedVideoLinks: e.target.value })}
                className="w-full p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-zinc-400 focus:border-cyan-400 focus:outline-none"
                placeholder="Links to uploaded videos (comma-separated)"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-white mb-2">
              Status
            </label>
            <div className="flex items-center gap-4">
              {VIDEO_STATUS.map((statusOption) => (
                <label key={statusOption.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value={statusOption.value}
                    checked={formData.status === statusOption.value}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    formData.status === statusOption.value 
                      ? statusOption.color === 'red' 
                        ? 'border-red-400 bg-red-500' 
                        : 'border-green-400 bg-green-500'
                      : 'border-white/40'
                  }`}>
                    {formData.status === statusOption.value && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <span className="text-white">{statusOption.label}</span>
                </label>
              ))}
            </div>
          </div>

 
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-white mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-zinc-400 focus:border-cyan-400 focus:outline-none"
              placeholder="e.g., marketing, tutorial, product-review"
            />
          </div>

          {/* Public */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isPublic"
              checked={formData.isPublic}
              onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
              className="w-4 h-4 text-cyan-400 bg-white/10 border-white/20 rounded focus:ring-cyan-400 focus:ring-2"
            />
            <label htmlFor="isPublic" className="text-sm text-white">
              Make this script public (others can view it)
            </label>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="bg-white/10 backdrop-blur-md text-white border-white/20 hover:bg-white/20"
            >
              Cancel
            </Button>
            
            {isEditMode ? (
              <>
                {/* Update Current Script Button */}
                <Button
                  type="button"
                  onClick={handleUpdateCurrent}
                  disabled={isUpdating || isSubmitting || isSavingAndGenerating}
                  className="bg-orange-500/20 backdrop-blur-md border border-orange-400/30 hover:bg-orange-500/30 transition-all duration-300 text-white"
                >
                  {isUpdating ? "Updating..." : "Update Current Script"}
                </Button>
                
                {/* Save as New Script Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting || isUpdating || isSavingAndGenerating}
                  className="bg-cyan-500/20 backdrop-blur-md border border-cyan-400/30 hover:bg-cyan-500/30 transition-all duration-300 text-white"
                >
                  {isSubmitting ? "Creating..." : "Save as New Script"}
                </Button>
                
                {/* Save & Generate Another Button */}
                {formData.content.trim() && (
                  <Button
                    type="button"
                    onClick={handleSaveAndGenerateAnother}
                    disabled={isSubmitting || isSavingAndGenerating || isGeneratingScript || isUpdating}
                    className="bg-green-500/20 backdrop-blur-md border border-green-400/30 hover:bg-green-500/30 transition-all duration-300 text-white"
                  >
                    {isSavingAndGenerating ? "Saving & Generating..." : "Save & Generate Another"}
                  </Button>
                )}
              </>
            ) : (
              <>
                {/* Create New Script Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting || isSavingAndGenerating}
                  className="bg-cyan-500/20 backdrop-blur-md border border-cyan-400/30 hover:bg-cyan-500/30 transition-all duration-300 text-white"
                >
                  {isSubmitting ? "Creating..." : "Create Video Script"}
                </Button>
                
                {/* Save & Generate Another Button */}
                {formData.content.trim() && (
                  <Button
                    type="button"
                    onClick={handleSaveAndGenerateAnother}
                    disabled={isSubmitting || isSavingAndGenerating || isGeneratingScript}
                    className="bg-green-500/20 backdrop-blur-md border border-green-400/30 hover:bg-green-500/30 transition-all duration-300 text-white"
                  >
                    {isSavingAndGenerating ? "Saving & Generating..." : "Save & Generate Another"}
                  </Button>
                )}
              </>
            )}
          </div>
        </form>

        {/* Custom Item Modal */}
        <CustomItemModal
          isOpen={isCustomModalOpen}
          onClose={() => setIsCustomModalOpen(false)}
          onSave={handleSaveCustomItem}
          type={customModalType}
        />
      </div>
    </div>
  );
}