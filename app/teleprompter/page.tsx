"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  PlayIcon, 
  PauseIcon, 
  RotateCcwIcon,
  SettingsIcon,
  ArrowLeftIcon
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function TeleprompterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState([2]);
  const [fontSize, setFontSize] = useState([24]);
  const [position, setPosition] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  // Get script content from URL params or localStorage
  const [scriptContent, setScriptContent] = useState("");

  useEffect(() => {
    // Check for script content in URL params or localStorage
    const urlScript = searchParams.get('script');
    const storedScript = localStorage.getItem('workflowTeleprompterScript');
    
    if (urlScript) {
      setScriptContent(decodeURIComponent(urlScript));
    } else if (storedScript) {
      setScriptContent(storedScript);
    } else {
      setScriptContent("No script content available. Please return to the workflow to load your scripts.");
    }
  }, [searchParams]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setPosition(prev => prev + speed[0]);
      }, 50);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, speed]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setPosition(0);
    setIsPlaying(false);
  };

  const handleSpeedChange = (value: number[]) => {
    setSpeed(value);
  };

  const handleFontSizeChange = (value: number[]) => {
    setFontSize(value);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-black/90 border-b border-white/10 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="text-white hover:bg-white/10"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to Workflow
        </Button>
        
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => setShowSettings(!showSettings)}
            className="text-white hover:bg-white/10"
          >
            <SettingsIcon className="w-4 h-4 mr-2" />
            Settings
          </Button>
          
          <Button
            onClick={handleReset}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <RotateCcwIcon className="w-4 h-4 mr-2" />
            Reset
          </Button>
          
          <Button
            onClick={handlePlayPause}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90"
          >
            {isPlaying ? (
              <>
                <PauseIcon className="w-4 h-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <PlayIcon className="w-4 h-4 mr-2" />
                Play
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <Card className="absolute top-20 right-4 z-10 w-80 bg-black/90 border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Teleprompter Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Speed: {speed[0]}
              </label>
              <Slider
                value={speed}
                onValueChange={handleSpeedChange}
                max={10}
                min={0.5}
                step={0.5}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Font Size: {fontSize[0]}px
              </label>
              <Slider
                value={fontSize}
                onValueChange={handleFontSizeChange}
                max={48}
                min={16}
                step={2}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Teleprompter Content */}
      <div className="relative h-screen overflow-hidden">
        <div 
          className="absolute inset-x-0 transition-transform duration-75 ease-linear"
          style={{ 
            transform: `translateY(${100 - position}vh)`,
            fontSize: `${fontSize[0]}px`,
            lineHeight: '1.6'
          }}
        >
          <div className="max-w-4xl mx-auto px-8 py-16">
            <div className="text-center whitespace-pre-wrap">
              {scriptContent}
            </div>
          </div>
        </div>
        
        {/* Reading line indicator */}
        <div className="absolute inset-x-0 top-1/2 h-px bg-cyan-500/50 pointer-events-none" />
      </div>
    </div>
  );
}