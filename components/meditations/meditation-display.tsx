import { useChat } from "ai/react";
import { Clock, Heart, Save, Play, Pause, Loader2, Volume2 } from "lucide-react";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface MeditationDisplayProps {
  type: string;
  title: string;
  content: string;
  duration?: string;
  keyBenefits?: string[];
  chatId?: string;
}

export function MeditationDisplay({ 
  type, 
  title, 
  content, 
  duration, 
  keyBenefits, 
  chatId 
}: MeditationDisplayProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  
  const chat = useChat({
    id: chatId || 'default-id',
    body: chatId ? { id: chatId } : undefined,
    maxSteps: 5,
  });

  const hasChatId = Boolean(chatId);

  useEffect(() => {
    if (isGeneratingAudio) {
      const interval = setInterval(() => {
        setAudioProgress((prev) => {
          const newProgress = prev + 10;
          if (newProgress >= 100) {
            setIsGeneratingAudio(false);
            clearInterval(interval);
            return 100;
          }
          return newProgress;
        });
      }, 1000); // Update every second (10 seconds total)
      
      return () => clearInterval(interval);
    }
  }, [isGeneratingAudio]);

  const handleSaveMeditation = () => {
    if (hasChatId && chat) {
      chat.append({
        role: "user",
        content: `Please save this ${type} meditation titled "${title}" for me.`,
      });
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      if (!isGeneratingAudio && audioProgress < 100) {
        // Start audio generation simulation
        setIsGeneratingAudio(true);
        setAudioProgress(0);
      } else {
        // If audio is already generated, just play it
        setIsPlaying(true);
      }
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Heart className="mr-2 size-6 text-purple-500" />
            {title}
          </div>
          <div className="flex items-center space-x-2">
            {duration && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="mr-1 size-4" />
                {duration}
              </div>
            )}
          </div>
        </CardTitle>
        <CardDescription>
          {type.charAt(0).toUpperCase() + type.slice(1)} Meditation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Benefits */}
        {keyBenefits && keyBenefits.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Key Benefits:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              {keyBenefits.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Meditation Content */}
        <div className="prose prose-sm max-w-none">
          <div className="whitespace-pre-wrap text-sm leading-relaxed">
            {content}
          </div>
        </div>        {/* Audio Generation Progress */}
        {(isGeneratingAudio || audioProgress > 0) && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                {isGeneratingAudio ? (
                  <>
                    <Loader2 className="size-4 text-primary animate-spin" />
                    <span className="text-muted-foreground">Generating audio...</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="size-4 text-primary" />
                    <span className="text-muted-foreground">Audio ready</span>
                  </>
                )}
              </div>
              <span className="text-muted-foreground">{audioProgress}%</span>
            </div>
            <Progress value={audioProgress} max={100} className="h-1" />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePlayPause}
            disabled={isGeneratingAudio}
            className="flex items-center space-x-2"
          >
            {isPlaying ? (
              <>
                <Pause className="size-4" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="size-4" />
                <span>{audioProgress === 100 ? "Listen" : "Generate Audio"}</span>
              </>
            )}
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={handleSaveMeditation}
            className="flex items-center space-x-2"
          >
            <Save className="size-4" />
            <span>Save Meditation</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
