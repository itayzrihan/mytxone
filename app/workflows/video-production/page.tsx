"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeftIcon, 
  ArrowRightIcon, 
  PlayIcon,
  VideoIcon,
  FileTextIcon,
  LoaderIcon,
  CameraIcon,
  DownloadIcon,
  ClipboardIcon,
  UsersIcon,
  MicIcon
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface WorkflowState {
  step: number;
  mainSubject: string;
  tellMeMore: string;
  desiredCTA: string;
  scripts: string[];
  generatedTopics: string[];
  generatedScripts: { [key: number]: string };
  isGenerating: boolean;
  contentType: "influencer" | "faceless" | null;
}

export default function VideoProductionWorkflow() {
  const router = useRouter();
  const [state, setState] = useState<WorkflowState>({
    step: 1,
    mainSubject: "",
    tellMeMore: "",
    desiredCTA: "",
    scripts: [""],
    generatedTopics: [],
    generatedScripts: {},
    isGenerating: false,
    contentType: null
  });

  const totalSteps = 10; // Total workflow steps: 1-User Input, 2-Scripts, 3-Topics/Generation, 4-Filming, 5-Cutting, 6-Effects, 7-Naming, 8-Thumbnails, 9-Descriptions, 10-Organization
  const progressPercentage = (state.step / totalSteps) * 100;

  const handleNextStep = () => {
    setState(prev => ({ ...prev, step: prev.step + 1 }));
  };

  const handlePrevStep = () => {
    setState(prev => ({ ...prev, step: prev.step - 1 }));
  };

  const handleInputChange = (field: keyof WorkflowState, value: any) => {
    setState(prev => ({ ...prev, [field]: value }));
  };

  const addScript = () => {
    setState(prev => ({
      ...prev,
      scripts: [...prev.scripts, ""]
    }));
  };

  const updateScript = (index: number, value: string) => {
    setState(prev => ({
      ...prev,
      scripts: prev.scripts.map((script, i) => i === index ? value : script)
    }));
  };

  const removeScript = (index: number) => {
    setState(prev => ({
      ...prev,
      scripts: prev.scripts.filter((_, i) => i !== index)
    }));
  };

  const generateTopics = async () => {
    setState(prev => ({ ...prev, isGenerating: true }));
    
    try {
      const response = await fetch('/api/workflows/generate-topics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mainSubject: state.mainSubject,
          tellMeMore: state.tellMeMore,
          desiredCTA: state.desiredCTA,
          exampleScripts: state.scripts.filter(script => script.trim() !== "")
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setState(prev => ({ 
          ...prev, 
          generatedTopics: data.topics,
          isGenerating: false 
        }));
        handleNextStep();
      }
    } catch (error) {
      console.error('Error generating topics:', error);
      setState(prev => ({ ...prev, isGenerating: false }));
    }
  };

  const generateScript = async (topicIndex: number, topic: string) => {
    setState(prev => ({
      ...prev,
      generatedScripts: {
        ...prev.generatedScripts,
        [topicIndex]: "Generating..."
      }
    }));

    try {
      const response = await fetch('/api/workflows/generate-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: topic,
          mainSubject: state.mainSubject,
          tellMeMore: state.tellMeMore,
          desiredCTA: state.desiredCTA,
          exampleScripts: state.scripts.filter(script => script.trim() !== "")
        }),
      });

      if (response.ok) {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let script = "";

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunk = decoder.decode(value);
            
            // Handle AI SDK streaming format - extract content from numbered chunks
            const lines = chunk.split('\n');
            for (const line of lines) {
              if (line.startsWith('0:"')) {
                // Extract content from the streaming format: 0:"content"
                const match = line.match(/^0:"(.*)"/);
                if (match && match[1]) {
                  const content = match[1]
                    .replace(/\\n/g, '\n')
                    .replace(/\\"/g, '"')
                    .replace(/\\\\/g, '\\');
                  script += content;
                  
                  setState(prev => ({
                    ...prev,
                    generatedScripts: {
                      ...prev.generatedScripts,
                      [topicIndex]: script
                    }
                  }));
                }
              }
            }
          }
        }

        // Auto-save the script to database
        await saveScript(topicIndex, topic, script);
      }
    } catch (error) {
      console.error('Error generating script:', error);
      setState(prev => ({
        ...prev,
        generatedScripts: {
          ...prev.generatedScripts,
          [topicIndex]: "Error generating script. Please try again."
        }
      }));
    }
  };

  const saveScript = async (topicIndex: number, topic: string, content: string) => {
    try {
      await fetch('/api/workflows/save-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `Video ${topicIndex + 1}: ${topic}`,
          content: content,
          topic: topic,
          workflowId: "video-production-50",
          tags: ["50-videos-workflow", "viral-script", state.mainSubject]
        }),
      });
    } catch (error) {
      console.error('Error saving script:', error);
    }
  };

  const generateAllScripts = async () => {
    setState(prev => ({ ...prev, isGenerating: true }));
    
    for (let i = 0; i < state.generatedTopics.length; i++) {
      if (!state.generatedScripts[i] || state.generatedScripts[i] === "") {
        await generateScript(i, state.generatedTopics[i]);
        // Add a small delay between requests to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    setState(prev => ({ ...prev, isGenerating: false }));
  };

  // Download functions
  const downloadCombinedScript = () => {
    const combinedScript = state.generatedTopics.map((topic, index) => {
      const script = state.generatedScripts[index];
      if (script && script !== "Generating...") {
        return `=== Video ${index + 1}: ${topic} ===\n\n${script}\n\n[Clap twice for success, three times for failure]\n\n${"=".repeat(50)}\n\n`;
      }
      return "";
    }).filter(script => script !== "").join("");

    const blob = new Blob([combinedScript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.mainSubject.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_combined_scripts.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadIndividualScripts = () => {
    state.generatedTopics.forEach((topic, index) => {
      const script = state.generatedScripts[index];
      if (script && script !== "Generating...") {
        const content = `${topic}\n\n${script}`;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Video_${index + 1}_${topic.replace(/[^a-z0-9]/gi, '_').toLowerCase().substring(0, 30)}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Small delay between downloads
        setTimeout(() => {}, 100);
      }
    });
  };

  const openTeleprompter = () => {
    const combinedScript = state.generatedTopics.map((topic, index) => {
      const script = state.generatedScripts[index];
      if (script && script !== "Generating...") {
        return `${topic}\n\n${script}\n\n[Remember: Clap twice for success, three times for failure]\n\n---\n\n`;
      }
      return "";
    }).filter(script => script !== "").join("");

    // Store the script in localStorage for the teleprompter
    localStorage.setItem('workflowTeleprompterScript', combinedScript);
    
    // Open teleprompter in new tab
    window.open('/teleprompter', '_blank');
  };

  const canProceedStep1 = state.mainSubject.trim() && state.tellMeMore.trim() && state.desiredCTA.trim();
  const canProceedStep2 = state.scripts.some(script => script.trim() !== "");

  const renderStep = () => {
    switch (state.step) {
      case 1:
        return (
          <Card className="w-full max-w-2xl mx-auto bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-2">
                <VideoIcon className="w-6 h-6 text-cyan-400" />
                Step 1: Define Your Content Strategy
              </CardTitle>
              <CardDescription className="text-zinc-300">
                Tell us about your content goals and target audience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Main Subject *
                </label>
                <Input
                  placeholder="e.g., Personal Finance, Fitness, Business Tips..."
                  value={state.mainSubject}
                  onChange={(e) => handleInputChange('mainSubject', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-zinc-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Tell Me More *
                </label>
                <Textarea
                  placeholder="Elaborate on the content you want to produce. What's your reason, cause, principles, and values? What makes your approach unique?"
                  value={state.tellMeMore}
                  onChange={(e) => handleInputChange('tellMeMore', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-zinc-400 min-h-[120px]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Desired CTA *
                </label>
                <Input
                  placeholder="What do you want to achieve? (e.g., Subscribe, Visit website, Buy product...)"
                  value={state.desiredCTA}
                  onChange={(e) => handleInputChange('desiredCTA', e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-zinc-400"
                />
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card className="w-full max-w-4xl mx-auto bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-2">
                <FileTextIcon className="w-6 h-6 text-purple-400" />
                Step 2: Example Scripts for Learning
              </CardTitle>
              <CardDescription className="text-zinc-300">
                Paste 1-10 winning scripts for AI to learn from (your own or others in your niche)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {state.scripts.map((script, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-white">
                      Script {index + 1} {index === 0 && "*"}
                    </label>
                    {state.scripts.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeScript(index)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  <Textarea
                    placeholder="Paste your winning script here..."
                    value={script}
                    onChange={(e) => updateScript(index, e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-zinc-400 min-h-[100px]"
                  />
                </div>
              ))}
              
              {state.scripts.length < 10 && (
                <Button
                  variant="outline"
                  onClick={addScript}
                  className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  Add Another Script
                </Button>
              )}
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card className="w-full max-w-6xl mx-auto bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-2">
                <PlayIcon className="w-6 h-6 text-green-400" />
                Step 3: Generated Topics & Scripts
              </CardTitle>
              <CardDescription className="text-zinc-300">
                {state.isGenerating ? "Generating your 50 viral video topics..." : "Generate scripts for each topic"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {state.isGenerating ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <LoaderIcon className="w-8 h-8 animate-spin text-cyan-400 mb-4" />
                  <p className="text-white text-lg">Creating your viral topics...</p>
                  <p className="text-zinc-400 text-sm">This may take a few moments</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-white">
                      50 Viral Video Topics
                    </h3>
                    <Button
                      onClick={generateAllScripts}
                      disabled={state.isGenerating}
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 disabled:opacity-50"
                    >
                      {state.isGenerating ? (
                        <>
                          <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        "Generate All Scripts"
                      )}
                    </Button>
                  </div>
                  
                  <div className="grid gap-4">
                    {state.generatedTopics.map((topic, index) => (
                      <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="text-white font-medium">
                            {index + 1}. {topic}
                          </h4>
                          <Button
                            size="sm"
                            onClick={() => generateScript(index, topic)}
                            disabled={state.isGenerating || Boolean(state.generatedScripts[index] && state.generatedScripts[index].trim() !== "")}
                            className="bg-gradient-to-r from-purple-500 to-pink-600 hover:opacity-90 disabled:opacity-50"
                          >
                            {state.generatedScripts[index] && state.generatedScripts[index].trim() !== "" 
                              ? "Generated" 
                              : state.generatedScripts[index] === "Generating..." 
                                ? "Generating..." 
                                : "Generate Now"
                            }
                          </Button>
                        </div>
                        <Textarea
                          placeholder="Generated script will appear here..."
                          value={state.generatedScripts[index] || ""}
                          className="bg-white/10 border-white/20 text-white placeholder:text-zinc-400 min-h-[100px]"
                          readOnly
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card className="w-full max-w-4xl mx-auto bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-2">
                <CameraIcon className="w-6 h-6 text-orange-400" />
                Step 4: Filming Instructions
              </CardTitle>
              <CardDescription className="text-zinc-300">
                Choose your content creation method and get filming instructions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Influencer Option */}
                <div 
                  className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                    state.contentType === "influencer" 
                      ? "border-cyan-400 bg-cyan-400/10" 
                      : "border-white/20 bg-white/5 hover:border-white/30"
                  }`}
                  onClick={() => handleInputChange('contentType', 'influencer')}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <UsersIcon className="w-8 h-8 text-cyan-400" />
                    <h3 className="text-xl font-semibold text-white">For Influencers</h3>
                  </div>
                  <p className="text-zinc-300 mb-4">
                    Film all videos in one session using teleprompter
                  </p>
                  <ul className="text-sm text-zinc-400 space-y-1">
                    <li>• Use teleprompter for all scripts</li>
                    <li>• Film in one continuous session</li>
                    <li>• Clap twice after success</li>
                    <li>• Clap 3 times after failure</li>
                  </ul>
                </div>

                {/* Faceless Option */}
                <div 
                  className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                    state.contentType === "faceless" 
                      ? "border-purple-400 bg-purple-400/10" 
                      : "border-white/20 bg-white/5 hover:border-white/30"
                  }`}
                  onClick={() => handleInputChange('contentType', 'faceless')}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <MicIcon className="w-8 h-8 text-purple-400" />
                    <h3 className="text-xl font-semibold text-white">For Faceless</h3>
                  </div>
                  <p className="text-zinc-300 mb-4">
                    Create voice-overs for each script individually
                  </p>
                  <ul className="text-sm text-zinc-400 space-y-1">
                    <li>• Use ElevenLabs or record yourself</li>
                    <li>• Process scripts individually</li>
                    <li>• Download organized files</li>
                    <li>• Ready for video editing</li>
                  </ul>
                </div>
              </div>

              {/* Content Type Specific Instructions */}
              {state.contentType && (
                <div className="mt-8 p-6 bg-white/5 rounded-lg border border-white/10">
                  {state.contentType === "influencer" ? (
                    <div className="space-y-6">
                      <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                        <ClipboardIcon className="w-5 h-5 text-cyan-400" />
                        Teleprompter Session Setup
                      </h4>
                      
                      <div className="space-y-4">
                        <div className="p-4 bg-cyan-400/10 rounded-lg border border-cyan-400/30">
                          <h5 className="font-medium text-cyan-300 mb-2">Combined Script Ready</h5>
                          <p className="text-zinc-300 text-sm mb-3">
                            All your scripts have been combined into one teleprompter session. 
                            Remember to clap twice after each successful take, and three times after failures.
                          </p>
                          <div className="flex gap-3">
                            <Button 
                              className="bg-cyan-500 hover:bg-cyan-600 text-white"
                              onClick={openTeleprompter}
                            >
                              <PlayIcon className="w-4 h-4 mr-2" />
                              Open Teleprompter
                            </Button>
                            <Button 
                              variant="outline"
                              className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/10"
                              onClick={downloadCombinedScript}
                            >
                              <DownloadIcon className="w-4 h-4 mr-2" />
                              Download Script
                            </Button>
                          </div>
                        </div>

                        <div className="p-4 bg-orange-400/10 rounded-lg border border-orange-400/30">
                          <h5 className="font-medium text-orange-300 mb-2">Filming Tips</h5>
                          <ul className="text-sm text-zinc-300 space-y-1">
                            <li>• Set up good lighting and audio before starting</li>
                            <li>• Test teleprompter speed and positioning</li>
                            <li>• Have a clapper or use hand claps clearly</li>
                            <li>• Take breaks between every 10-15 videos</li>
                            <li>• Keep the same outfit and setup for consistency</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                        <DownloadIcon className="w-5 h-5 text-purple-400" />
                        Download Scripts
                      </h4>
                      
                      <div className="space-y-4">
                        <div className="p-4 bg-purple-400/10 rounded-lg border border-purple-400/30">
                          <h5 className="font-medium text-purple-300 mb-2">Individual Script Files</h5>
                          <p className="text-zinc-300 text-sm mb-3">
                            Download each script as a separate file for individual voice-over recording.
                          </p>
                          <div className="flex gap-3">
                            <Button 
                              className="bg-purple-500 hover:bg-purple-600 text-white"
                              onClick={downloadIndividualScripts}
                            >
                              <DownloadIcon className="w-4 h-4 mr-2" />
                              Download All (.txt)
                            </Button>
                            <Button 
                              variant="outline"
                              className="border-purple-400 text-purple-400 hover:bg-purple-400/10"
                              onClick={downloadIndividualScripts}
                            >
                              <DownloadIcon className="w-4 h-4 mr-2" />
                              Download All (.docx)
                            </Button>
                          </div>
                        </div>

                        <div className="p-4 bg-blue-400/10 rounded-lg border border-blue-400/30">
                          <h5 className="font-medium text-blue-300 mb-2">Voice-over Tips</h5>
                          <ul className="text-sm text-zinc-300 space-y-1">
                            <li>• Use consistent voice settings across all recordings</li>
                            <li>• Name files with video numbers for easy organization</li>
                            <li>• Test audio quality with first few scripts</li>
                            <li>• Keep recording environment consistent</li>
                            <li>• Save backups of your voice settings</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 5:
        return (
          <Card className="w-full max-w-2xl mx-auto bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-2">
                <VideoIcon className="w-6 h-6 text-orange-400" />
                Step 5: Video Cutting & Editing
              </CardTitle>
              <CardDescription className="text-zinc-300">
                Cut your long video into individual clips using claps as indicators
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-orange-400/10 rounded-lg border border-orange-400/30">
                <h4 className="font-medium text-orange-300 mb-3">Cutting Instructions</h4>
                <ul className="text-sm text-zinc-300 space-y-2">
                  <li>• Import your recorded video into your editing software</li>
                  <li>• Listen for the clapping sounds to identify each video segment</li>
                  <li>• Two claps = successful take (use this clip)</li>
                  <li>• Three claps = failed take (skip or re-record)</li>
                  <li>• Cut each successful segment into a separate video file</li>
                  <li>• Remove the clapping sounds from the beginning and end</li>
                </ul>
              </div>
              
              <div className="p-4 bg-blue-400/10 rounded-lg border border-blue-400/30">
                <h4 className="font-medium text-blue-300 mb-3">Recommended Editing Software</h4>
                <ul className="text-sm text-zinc-300 space-y-1">
                  <li>• <strong>Free:</strong> DaVinci Resolve, OpenShot, Shotcut</li>
                  <li>• <strong>Paid:</strong> Adobe Premiere Pro, Final Cut Pro, Filmora</li>
                  <li>• <strong>Online:</strong> Clipchamp, WeVideo, Kapwing</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        );

      case 6:
        return (
          <Card className="w-full max-w-2xl mx-auto bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-2">
                <VideoIcon className="w-6 h-6 text-purple-400" />
                Step 6: Add Effects & Animations
              </CardTitle>
              <CardDescription className="text-zinc-300">
                Apply consistent effects to make your videos more engaging
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-purple-400/10 rounded-lg border border-purple-400/30">
                <h4 className="font-medium text-purple-300 mb-3">Recommended Effects (Optional)</h4>
                <ul className="text-sm text-zinc-300 space-y-2">
                  <li>• <strong>Hook Animation:</strong> Slow zoom-in during the first 3 seconds</li>
                  <li>• <strong>Audio Riser:</strong> Add tension sound during the hook</li>
                  <li>• <strong>Punch Effect:</strong> Quick zoom or shake at key moments</li>
                  <li>• <strong>Ending:</strong> Zoom out to 100% scale for call-to-action</li>
                  <li>• <strong>Captions:</strong> Add auto-generated or manual subtitles</li>
                  <li>• <strong>Background Music:</strong> Light, non-competing background track</li>
                </ul>
              </div>
              
              <div className="p-4 bg-yellow-400/10 rounded-lg border border-yellow-400/30">
                <h4 className="font-medium text-yellow-300 mb-3">Effect Templates</h4>
                <p className="text-sm text-zinc-300 mb-2">
                  Create a template with your brand colors, fonts, and effects to apply consistently across all 50 videos.
                </p>
                <ul className="text-sm text-zinc-300 space-y-1">
                  <li>• Save as a preset in your editing software</li>
                  <li>• Use the same intro/outro for brand consistency</li>
                  <li>• Keep effect timings consistent (3s hook, 25s content, 2s CTA)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        );

      case 7:
        return (
          <Card className="w-full max-w-2xl mx-auto bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-2">
                <FileTextIcon className="w-6 h-6 text-green-400" />
                Step 7: Name & Organize Videos
              </CardTitle>
              <CardDescription className="text-zinc-300">
                Name each video file with its corresponding topic
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-green-400/10 rounded-lg border border-green-400/30">
                <h4 className="font-medium text-green-300 mb-3">Naming Convention</h4>
                <p className="text-sm text-zinc-300 mb-3">
                  Use this naming pattern for consistency and easy organization:
                </p>
                <div className="bg-black/30 p-3 rounded font-mono text-sm text-green-300">
                  Video_01_Topic_Name_Here.mp4<br/>
                  Video_02_Next_Topic_Name.mp4<br/>
                  Video_03_Another_Topic_Here.mp4
                </div>
              </div>
              
              <div className="p-4 bg-blue-400/10 rounded-lg border border-blue-400/30">
                <h4 className="font-medium text-blue-300 mb-3">Your Video Topics</h4>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {state.generatedTopics.map((topic, index) => (
                    <div key={index} className="text-sm text-zinc-300 p-2 bg-black/20 rounded">
                      <span className="text-blue-300 font-medium">Video_{String(index + 1).padStart(2, '0')}:</span> {topic}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 8:
        return (
          <Card className="w-full max-w-2xl mx-auto bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-2">
                <CameraIcon className="w-6 h-6 text-pink-400" />
                Step 8: Generate Thumbnails
              </CardTitle>
              <CardDescription className="text-zinc-300">
                Create eye-catching thumbnails for each video
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-pink-400/10 rounded-lg border border-pink-400/30">
                <h4 className="font-medium text-pink-300 mb-3">Thumbnail Options</h4>
                <ul className="text-sm text-zinc-300 space-y-2">
                  <li>• <strong>Auto-generate:</strong> Use AI tools like Canva, Thumbnail.ai</li>
                  <li>• <strong>Manual design:</strong> Create in Photoshop, GIMP, or Canva</li>
                  <li>• <strong>Template-based:</strong> Design one template, change text for each video</li>
                  <li>• <strong>Video frame:</strong> Use the best frame from each video as thumbnail</li>
                </ul>
              </div>
              
              <div className="p-4 bg-orange-400/10 rounded-lg border border-orange-400/30">
                <h4 className="font-medium text-orange-300 mb-3">Thumbnail Best Practices</h4>
                <ul className="text-sm text-zinc-300 space-y-1">
                  <li>• Use bright, contrasting colors</li>
                  <li>• Include readable text (40+ font size)</li>
                  <li>• Show clear facial expressions if using faces</li>
                  <li>• Keep design consistent across all videos</li>
                  <li>• Test visibility at small sizes</li>
                  <li>• Size: 1280x720px (16:9 ratio)</li>
                </ul>
              </div>
              
              <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90">
                <CameraIcon className="w-4 h-4 mr-2" />
                Bulk Generate Thumbnails (Coming Soon)
              </Button>
            </CardContent>
          </Card>
        );

      case 9:
        return (
          <Card className="w-full max-w-2xl mx-auto bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-2">
                <FileTextIcon className="w-6 h-6 text-cyan-400" />
                Step 9: Generate Descriptions
              </CardTitle>
              <CardDescription className="text-zinc-300">
                Create optimized descriptions and hashtags for each video
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-cyan-400/10 rounded-lg border border-cyan-400/30">
                <h4 className="font-medium text-cyan-300 mb-3">Description Template</h4>
                <div className="bg-black/30 p-3 rounded text-sm text-zinc-300">
                  <p className="text-cyan-300 font-medium mb-2">Standard Format:</p>
                  [Hook from the video]<br/><br/>
                  [Brief description of the content]<br/><br/>
                  [Call to action]<br/><br/>
                  #hashtag1 #hashtag2 #hashtag3 #viral #trending
                </div>
              </div>
              
              <div className="p-4 bg-purple-400/10 rounded-lg border border-purple-400/30">
                <h4 className="font-medium text-purple-300 mb-3">SEO Optimization</h4>
                <ul className="text-sm text-zinc-300 space-y-1">
                  <li>• Include relevant keywords from your niche</li>
                  <li>• Use trending hashtags (research current ones)</li>
                  <li>• Keep descriptions concise but informative</li>
                  <li>• Include your call-to-action from the video</li>
                  <li>• Add platform-specific hashtags</li>
                </ul>
              </div>
              
              <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90">
                <FileTextIcon className="w-4 h-4 mr-2" />
                Bulk Generate Descriptions (Coming Soon)
              </Button>
            </CardContent>
          </Card>
        );

      case 10:
        return (
          <Card className="w-full max-w-2xl mx-auto bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-2">
                <FileTextIcon className="w-6 h-6 text-green-400" />
                Step 10: Final Organization & Automation
              </CardTitle>
              <CardDescription className="text-zinc-300">
                Organize files and prepare for automated uploading
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-green-400/10 rounded-lg border border-green-400/30">
                <h4 className="font-medium text-green-300 mb-3">Folder Structure</h4>
                <div className="bg-black/30 p-3 rounded font-mono text-sm text-green-300">
                  📁 {state.mainSubject || "Your_Project"}_50_Videos/<br/>
                  &nbsp;&nbsp;📁 01_Raw_Footage/<br/>
                  &nbsp;&nbsp;📁 02_Edited_Videos/<br/>
                  &nbsp;&nbsp;📁 03_Thumbnails/<br/>
                  &nbsp;&nbsp;📁 04_Descriptions/<br/>
                  &nbsp;&nbsp;📁 05_Ready_To_Upload/<br/>
                  &nbsp;&nbsp;📄 Video_List.txt
                </div>
              </div>
              
              <div className="p-4 bg-blue-400/10 rounded-lg border border-blue-400/30">
                <h4 className="font-medium text-blue-300 mb-3">Upload Preparation</h4>
                <ul className="text-sm text-zinc-300 space-y-2">
                  <li>• Ensure all videos are in the correct format for your platform</li>
                  <li>• Match video files with their thumbnails and descriptions</li>
                  <li>• Create a schedule for posting (1-2 videos per day recommended)</li>
                  <li>• Backup all files before uploading</li>
                </ul>
              </div>
              
              <div className="p-4 bg-purple-400/10 rounded-lg border border-purple-400/30">
                <h4 className="font-medium text-purple-300 mb-3">Automation Setup</h4>
                <p className="text-sm text-zinc-300 mb-3">
                  Check if your files are properly organized in the automation folder:
                </p>
                <Button 
                  variant="outline" 
                  className="w-full border-purple-400 text-purple-400 hover:bg-purple-400/10"
                  disabled
                >
                  Check Automation Folder (Coming Soon)
                </Button>
              </div>
              
              <div className="p-4 bg-cyan-400/10 rounded-lg border border-cyan-400/30 text-center">
                <h4 className="font-medium text-cyan-300 mb-3">🎉 Congratulations!</h4>
                <p className="text-sm text-zinc-300 mb-3">
                  You've completed the 50 Videos Production Workflow! Your content is ready for the world.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button 
                    onClick={() => router.push('/workflows')}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90"
                  >
                    Back to Workflows
                  </Button>
                  <Button 
                    variant="outline"
                    className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/10"
                    disabled
                  >
                    Start New Automation (Soon)
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return (
          <Card className="w-full max-w-2xl mx-auto bg-white/5 border-white/10">
            <CardContent className="py-12 text-center">
              <h3 className="text-xl text-white mb-4">Workflow Complete!</h3>
              <p className="text-zinc-300">
                You've finished all the steps in the 50 Videos Production Workflow.
              </p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen p-4 pt-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/workflows')}
            className="mb-4 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Workflows
          </Button>
          
          <h1 className="text-3xl font-bold text-white mb-2">
            50 Videos Production Workflow
          </h1>
          <p className="text-zinc-300 max-w-2xl mx-auto">
            Create viral video content at scale with AI-powered script generation and production guidance
          </p>
        </div>

        {/* Progress Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-zinc-400">Progress</span>
            <span className="text-sm text-zinc-400">Step {state.step} of {totalSteps}</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Step Content */}
        <div className="backdrop-blur-sm bg-white/5 rounded-2xl border border-white/10">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8 max-w-2xl mx-auto">
          <Button
            variant="outline"
            onClick={handlePrevStep}
            disabled={state.step === 1}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 disabled:opacity-50"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {state.step === 2 ? (
            <Button
              onClick={generateTopics}
              disabled={!canProceedStep2 || state.isGenerating}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 disabled:opacity-50"
            >
              {state.isGenerating ? (
                <>
                  <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  Generate Topics
                  <ArrowRightIcon className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleNextStep}
              disabled={
                (state.step === 1 && !canProceedStep1) ||
                (state.step === 3 && state.generatedTopics.length === 0) ||
                (state.step === 4 && !state.contentType) ||
                state.step >= totalSteps
              }
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 disabled:opacity-50"
            >
              {state.step === totalSteps ? "Complete Workflow" : "Next Step"}
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}