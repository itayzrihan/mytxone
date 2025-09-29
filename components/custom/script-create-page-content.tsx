"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "next-auth";
import { Button } from "@/components/ui/button";
import { VIDEO_HOOKS, VIDEO_LANGUAGES, MAIN_CONTENT_TYPES, VIDEO_STATUS, SCRIPT_LENGTHS, getContentTypesByCategory, CATEGORY_CONFIG, type CustomHook, type CustomContentType } from "@/lib/video-script-constants";
import { CustomItemModal } from "@/components/custom/custom-item-modal";
import { Plus } from "lucide-react";

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
  contentFolderLink: string;
  productionVideoLink: string;
  uploadedVideoLinks: string;
  status: string;
  content: string;
  tags: string;
  isPublic: boolean;
}

export function ScriptCreatePageContent({ user }: ScriptCreatePageContentProps) {
  const router = useRouter();
  
  const getInitialLanguage = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("preferred-language") || "hebrew";
    }
    return "hebrew";
  };

  const getInitialHookType = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("preferred-hook-type") || "blue-ball";
    }
    return "blue-ball";
  };

  const getInitialContentType = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("preferred-content-type") || "storytelling";
    }
    return "storytelling";
  };

  const getInitialScriptLength = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("preferred-script-length") || "60";
    }
    return "60";
  };

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    language: getInitialLanguage(),
    hookType: getInitialHookType(),
    mainContentType: getInitialContentType(),
    scriptLength: getInitialScriptLength(),
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
  const [isHookPreviewExpanded, setIsHookPreviewExpanded] = useState(false);
  const [isContentTypePreviewExpanded, setIsContentTypePreviewExpanded] = useState(false);
  
  // Custom items state
  const [customHooks, setCustomHooks] = useState<CustomHook[]>([]);
  const [customContentTypes, setCustomContentTypes] = useState<CustomContentType[]>([]);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customModalType, setCustomModalType] = useState<'hook' | 'contentType'>('hook');

  // Update form data with saved preferences after component mounts (for hydration safety)
  useEffect(() => {
    if (typeof window !== "undefined") {
      setFormData(prev => ({
        ...prev,
        language: localStorage.getItem("preferred-language") || "hebrew",
        hookType: localStorage.getItem("preferred-hook-type") || "blue-ball",
        mainContentType: localStorage.getItem("preferred-content-type") || "storytelling",
        scriptLength: localStorage.getItem("preferred-script-length") || "60"
      }));
    }
  }, []);

  // Save preferences to localStorage when form data changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("preferred-language", formData.language);
      localStorage.setItem("preferred-hook-type", formData.hookType);
      localStorage.setItem("preferred-content-type", formData.mainContentType);
      localStorage.setItem("preferred-script-length", formData.scriptLength);
    }
  }, [formData.language, formData.hookType, formData.mainContentType, formData.scriptLength]);

  // Load custom items from database
  useEffect(() => {
    loadCustomItems();
  }, []);

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
    } catch (error) {
      console.error("Error loading custom items:", error);
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

  const generateScript = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      alert("Please fill in both title and description before generating a script.");
      return;
    }

    setIsGeneratingScript(true);

    try {
      console.log("Starting script generation with params:", {
        title: formData.title,
        description: formData.description,
        language: formData.language,
        hookType: formData.hookType,
        contentType: formData.mainContentType,
        scriptLength: formData.scriptLength
      });

      const response = await fetch('/api/generate-video-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          language: formData.language,
          hookType: formData.hookType,
          contentType: formData.mainContentType,
          scriptLength: formData.scriptLength,
        }),
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        console.error("Failed to generate script:", result.error || result);
        console.error("Full response:", result);
        alert(`Failed to generate script: ${result.error || result.details || 'Unknown error'}. Please try again.`);
        return;
      }

      // Use the generated script directly - it's already a complete, flowing script
      const generatedScript = result.script;

      // Update the form data with the generated script and suggested title
      setFormData(prev => ({
        ...prev,
        title: result.suggestedTitle || prev.title,
        content: generatedScript
      }));

      // Show success message
      alert("🎉 Viral video script generated successfully! Check the content field below.");

    } catch (error) {
      console.error("Error generating script:", error);
      alert("Failed to generate script. Please try again.");
    } finally {
      setIsGeneratingScript(false);
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
    <div className="flex flex-col min-h-screen p-4 pt-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Create New Video Script</h1>
        
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
                  {VIDEO_HOOKS.map((hook) => (
                    <option key={hook.id} value={hook.id} className="bg-gray-800 text-white hover:bg-gray-700">
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
                  const contentTypesByCategory = getContentTypesByCategory();
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

          {/* Hook Preview */}
          {selectedHook && (
            <div className="p-4 bg-cyan-500/10 border border-cyan-400/20 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="text-lg font-medium text-cyan-300">
                  {'name' in selectedHook ? selectedHook.name : selectedHook.label}
                  {'isPublic' in selectedHook && !selectedHook.isPublic && (
                    <span className="ml-2 text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                      Private
                    </span>
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
                    "{selectedHook.example}"
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
                    "{selectedContentType.example}"
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
              <Button
                type="button"
                onClick={generateScript}
                disabled={isGeneratingScript || !formData.title.trim() || !formData.description.trim()}
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

          {/* Tags */}
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
          <div className="flex gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="bg-white/10 backdrop-blur-md text-white border-white/20 hover:bg-white/20"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-cyan-500/20 backdrop-blur-md border border-cyan-400/30 hover:bg-cyan-500/30 transition-all duration-300 text-white"
            >
              {isSubmitting ? "Creating..." : "Create Video Script"}
            </Button>
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