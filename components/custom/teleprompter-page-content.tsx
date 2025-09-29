"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { User } from "next-auth";
import { Script } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Maximize, 
  Minimize,
  Settings,
  ArrowLeft,
  Plus,
  Minus,
  SkipBack,
  SkipForward
} from "lucide-react";

interface TeleprompterPageContentProps {
  scriptId: string;
  user: User;
}

export function TeleprompterPageContent({ scriptId, user }: TeleprompterPageContentProps) {
  const [script, setScript] = useState<Script | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(2); // pixels per frame
  const [fontSize, setFontSize] = useState(48);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [position, setPosition] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const hideControlsTimeoutRef = useRef<NodeJS.Timeout>();
  
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

  // Auto-scroll functionality
  useEffect(() => {
    const animate = () => {
      if (isPlaying && contentRef.current && containerRef.current) {
        setPosition(prev => {
          const newPosition = prev + speed;
          const maxScroll = contentRef.current!.scrollHeight - containerRef.current!.clientHeight;
          
          if (newPosition >= maxScroll) {
            setIsPlaying(false);
            return maxScroll;
          }
          
          containerRef.current!.scrollTop = newPosition;
          return newPosition;
        });
      }
      
      if (isPlaying) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, speed]);

  // Fullscreen handling
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Auto-hide controls in fullscreen
  useEffect(() => {
    const resetHideTimer = () => {
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current);
      }
      
      setShowControls(true);
      
      if (isFullscreen) {
        hideControlsTimeoutRef.current = setTimeout(() => {
          setShowControls(false);
        }, 3000);
      }
    };

    const handleMouseMove = () => resetHideTimer();
    
    if (isFullscreen) {
      document.addEventListener('mousemove', handleMouseMove);
      resetHideTimer();
    } else {
      setShowControls(true);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current);
      }
    };
  }, [isFullscreen]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const resetPosition = () => {
    setPosition(0);
    setIsPlaying(false);
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  };

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  };

  const adjustSpeed = (delta: number) => {
    setSpeed(prev => Math.max(0.5, Math.min(10, prev + delta)));
  };

  const adjustFontSize = (delta: number) => {
    setFontSize(prev => Math.max(24, Math.min(96, prev + delta)));
  };

  const skipPosition = (seconds: number) => {
    const pixelsPerSecond = 60; // Approximate based on reading speed
    const deltaPixels = seconds * pixelsPerSecond;
    
    setPosition(prev => {
      const newPosition = Math.max(0, prev + deltaPixels);
      const maxScroll = contentRef.current!.scrollHeight - containerRef.current!.clientHeight;
      const finalPosition = Math.min(newPosition, maxScroll);
      
      if (containerRef.current) {
        containerRef.current.scrollTop = finalPosition;
      }
      
      return finalPosition;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-white text-xl">Loading teleprompter...</div>
      </div>
    );
  }

  if (!script) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-white text-xl">Script not found</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Main Content Area */}
      <div 
        ref={containerRef}
        className="h-screen overflow-hidden relative"
        style={{ cursor: isFullscreen && !showControls ? 'none' : 'default' }}
      >
        {/* Script Content */}
        <div 
          ref={contentRef}
          className="px-8 py-16 leading-relaxed text-center max-w-4xl mx-auto"
          style={{ 
            fontSize: `${fontSize}px`,
            lineHeight: '1.6',
            paddingBottom: '100vh' // Extra space at the end
          }}
        >
          {script.content.split('\n').map((paragraph, index) => (
            <div key={index} className="mb-8">
              {paragraph.trim() && (
                <p className="text-white font-medium">
                  {paragraph}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Reading Guide Line */}
        <div 
          className="fixed left-0 right-0 z-10 border-t-2 border-cyan-400 opacity-50"
          style={{ top: '45%' }}
        />
      </div>

      {/* Controls */}
      <div 
        className={`fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md border-t border-white/20 transition-all duration-300 ${
          showControls ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="max-w-6xl mx-auto p-4">
          {/* Settings Panel */}
          {showSettings && (
            <div className="mb-4 p-4 bg-white/10 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Speed Control */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Speed: {speed.toFixed(1)}x
                  </label>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => adjustSpeed(-0.5)}
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <Minus size={16} />
                    </Button>
                    <div className="flex-1 text-center text-sm">
                      {speed.toFixed(1)} px/frame
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => adjustSpeed(0.5)}
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                </div>

                {/* Font Size Control */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Font Size: {fontSize}px
                  </label>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => adjustFontSize(-4)}
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <Minus size={16} />
                    </Button>
                    <div className="flex-1 text-center text-sm">
                      {fontSize}px
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => adjustFontSize(4)}
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                </div>

                {/* Quick Presets */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Quick Presets
                  </label>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => { setSpeed(1); setFontSize(36); }}
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs"
                    >
                      Slow
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => { setSpeed(2); setFontSize(48); }}
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs"
                    >
                      Normal
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => { setSpeed(3.5); setFontSize(56); }}
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs"
                    >
                      Fast
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Controls */}
          <div className="flex items-center justify-between">
            {/* Left: Navigation */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <ArrowLeft size={20} />
                <span className="ml-2 hidden sm:inline">Back</span>
              </Button>
            </div>

            {/* Center: Playback Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => skipPosition(-10)}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <SkipBack size={20} />
                <span className="ml-1 text-sm hidden sm:inline">10s</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={resetPosition}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <RotateCcw size={20} />
              </Button>

              <Button
                onClick={togglePlay}
                className="bg-cyan-500/20 border border-cyan-400/30 hover:bg-cyan-500/30 text-white px-6"
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </Button>

              <Button
                variant="outline"
                onClick={() => skipPosition(10)}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <SkipForward size={20} />
                <span className="ml-1 text-sm hidden sm:inline">10s</span>
              </Button>
            </div>

            {/* Right: View Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setShowSettings(!showSettings)}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Settings size={20} />
                <span className="ml-2 hidden sm:inline">Settings</span>
              </Button>

              <Button
                variant="outline"
                onClick={toggleFullscreen}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                <span className="ml-2 hidden sm:inline">
                  {isFullscreen ? 'Exit' : 'Fullscreen'}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Script Info Overlay */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
        <div className="bg-black/50 backdrop-blur-md rounded-lg p-3 max-w-md">
          <h1 className="text-white font-semibold text-lg">{script.title}</h1>
          {script.description && (
            <p className="text-gray-300 text-sm mt-1">{script.description}</p>
          )}
        </div>
        
        <div className="bg-black/50 backdrop-blur-md rounded-lg p-2 text-center">
          <div className="text-cyan-400 font-semibold">📺</div>
          <div className="text-white text-xs">Teleprompter</div>
        </div>
      </div>
    </div>
  );
}