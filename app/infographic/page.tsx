"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ModeToggle } from "@/components/infographic/mode-toggle";
import { CountdownControls } from "@/components/infographic/countdown-controls";
import { CustomAnimationControls } from "@/components/infographic/custom-animation-controls";
import { PreviewArea } from "@/components/infographic/preview-area";
import { ProgressIndicator } from "@/components/infographic/progress-indicator";
import { useInfographicState } from "@/components/infographic/hooks/use-infographic-state";

export default function InfographicPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  const {
    mode,
    setMode,
    countdownSettings,
    setCountdownSettings,
    customSettings,
    setCustomSettings,
    progressState,
    setProgressState,
  } = useInfographicState();

  // Simple auth check - in a real app this would use your auth system
  useEffect(() => {
    // For now, we'll assume the user is authenticated
    // You can integrate this with your existing auth system
    setIsAuthenticated(true);
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-purple-700">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-purple-700 p-5">
      <h1 className="text-center text-white text-4xl mb-8 font-semibold text-shadow-lg">
        🎨 Infogmaker - Create Stunning Infographics & Animations
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8 max-w-7xl mx-auto">
        {/* Controls Panel */}
        <div className="bg-white/95 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/20">
          <h2 className="text-gray-700 text-2xl mb-6 text-center font-semibold">
            🎬 Creation Mode
          </h2>
          
          <ModeToggle mode={mode} onModeChange={setMode} />
          
          {mode === 'countdown' ? (
            <CountdownControls
              settings={countdownSettings}
              onSettingsChange={setCountdownSettings}
              progressState={progressState}
              onProgressChange={setProgressState}
            />
          ) : (
            <CustomAnimationControls
              settings={customSettings}
              onSettingsChange={setCustomSettings}
              progressState={progressState}
              onProgressChange={setProgressState}
            />
          )}
          
          <ProgressIndicator progressState={progressState} />
        </div>

        {/* Preview Panel */}
        <PreviewArea
          mode={mode}
          countdownSettings={countdownSettings}
          customSettings={customSettings}
        />
      </div>
    </div>
  );
}
