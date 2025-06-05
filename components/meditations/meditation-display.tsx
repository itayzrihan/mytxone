import { useChat } from "ai/react";
import { Clock, Heart, Save, Play, Pause, Loader2, Volume2, Settings } from "lucide-react";
import { useState, useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface MeditationSegment {
  timestamp: string;
  text: string;
  timing: number;
  audioUrl?: string;
  isGenerating?: boolean;
}

interface MeditationDisplayProps {
  type: string;
  title: string;
  content: string;
  duration?: string;
  keyBenefits?: string[];
  chatId?: string;
}

// Available meditation voices with their characteristics
const MEDITATION_VOICES = [
  { name: 'Enceladus', description: 'Breathy, calming' },
  { name: 'Callirrhoe', description: 'Easy-going, gentle' },
  { name: 'Vindemiatrix', description: 'Gentle, warm' },
  { name: 'Sulafat', description: 'Warm, soothing' },
  { name: 'Aoede', description: 'Breezy, peaceful' },
];

type VoiceName = typeof MEDITATION_VOICES[number]['name'];

export function MeditationDisplay({ 
  type, 
  title, 
  content, 
  duration, 
  keyBenefits, 
  chatId 
}: MeditationDisplayProps) {  const [isPlaying, setIsPlaying] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [segments, setSegments] = useState<MeditationSegment[]>([]);
  const [currentSegment, setCurrentSegment] = useState<number>(-1);
  const [selectedVoice, setSelectedVoice] = useState<VoiceName>('Enceladus');
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [generatedSegments, setGeneratedSegments] = useState<number>(0);
  const [playingSegment, setPlayingSegment] = useState<number>(-1);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const segmentAudioRefs = useRef<{ [key: number]: HTMLAudioElement }>({});
  
  const chat = useChat({
    id: chatId || 'default-id',
    body: chatId ? { id: chatId } : undefined,
    maxSteps: 5,
  });

  const hasChatId = Boolean(chatId);

  // Parse meditation content into segments
  useEffect(() => {
    const parseSegments = () => {
      const lines = content.split('\n').filter(line => line.trim());
      const parsedSegments: MeditationSegment[] = [];
      
      for (const line of lines) {
        const timestampMatch = line.match(/\[(\d{2}):(\d{2})\]\s*(.+)/);
        if (timestampMatch) {
          const [, minutes, seconds, text] = timestampMatch;
          const timing = parseInt(minutes) * 60 + parseInt(seconds);
          parsedSegments.push({
            timestamp: `${minutes}:${seconds}`,
            text: text.trim(),
            timing
          });
        }
      }
      
      setSegments(parsedSegments);
    };

    parseSegments();
  }, [content]);

  // Audio time tracking
  useEffect(() => {
    if (audioRef.current && isPlaying) {
      const audio = audioRef.current;
      
      const updateCurrentSegment = () => {
        const currentTime = audio.currentTime;
        let activeSegment = -1;
        
        for (let i = 0; i < segments.length; i++) {
          if (currentTime >= segments[i].timing) {
            activeSegment = i;
          } else {
            break;
          }
        }
        
        setCurrentSegment(activeSegment);
      };

      audio.addEventListener('timeupdate', updateCurrentSegment);
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        setCurrentSegment(-1);
      });

      return () => {
        audio.removeEventListener('timeupdate', updateCurrentSegment);
        audio.removeEventListener('ended', () => {
          setIsPlaying(false);
          setCurrentSegment(-1);
        });
      };
    }
  }, [isPlaying, segments]);
  const generateAudio = async () => {
    if (isGeneratingAudio) return;
    
    setIsGeneratingAudio(true);
    setAudioProgress(0);
    setErrorMessage(null);
    
    try {
      console.log('Starting TTS generation with voice:', selectedVoice);
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setAudioProgress(prev => {
          const newProgress = prev + 3; // Slower progress for more realistic feel
          return newProgress >= 95 ? 95 : newProgress;
        });
      }, 800);

      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          meditationId: `meditation_${Date.now()}`,
          voiceName: selectedVoice
        }),
      });      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        
        // Handle rate limit errors specially
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. The free TTS tier allows only 3 requests per minute. Please wait and try again.');
        }
        
        throw new Error(errorData.details || errorData.error || 'Failed to generate audio');
      }

      const data = await response.json();
      setAudioUrl(data.audioUrl);
      setAudioProgress(100);
      
      console.log('TTS generation completed successfully');
      
    } catch (error) {
      console.error('Error generating audio:', error);
      setAudioProgress(0);
      
      // Provide user-friendly error messages
      if (error instanceof Error) {
        if (error.message.includes('Rate limit') || error.message.includes('quota')) {
          setErrorMessage('⏱️ Rate limit reached. Please wait a minute and try again, or try a shorter meditation.');
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          setErrorMessage('🌐 Network error. Please check your connection and try again.');
        } else {
          setErrorMessage(`❌ ${error.message}`);
        }
      } else {
        setErrorMessage('❌ Failed to generate audio. Please try again.');
      }
    } finally {
      setIsGeneratingAudio(false);
    }
  };
  const generateSegmentAudio = async (segmentIndex: number) => {
    const segment = segments[segmentIndex];
    if (!segment || segment.isGenerating || segment.audioUrl) return;

    // Update segment state to show it's generating
    setSegments(prev => prev.map((seg, idx) => 
      idx === segmentIndex ? { ...seg, isGenerating: true } : seg
    ));

    try {
      console.log(`Generating audio for segment ${segmentIndex + 1}: ${segment.timestamp}`);
      
      const response = await fetch('/api/tts/segment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: segment.text,
          segmentId: `${Date.now()}_segment_${segmentIndex}`,
          voiceName: selectedVoice
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to generate segment audio');
      }

      const data = await response.json();
      
      // Update segment with audio URL
      setSegments(prev => prev.map((seg, idx) => 
        idx === segmentIndex ? { 
          ...seg, 
          audioUrl: data.audioUrl, 
          isGenerating: false 
        } : seg
      ));

      setGeneratedSegments(prev => prev + 1);
      
    } catch (error) {
      console.error(`Error generating segment ${segmentIndex} audio:`, error);
      
      // Reset segment generating state
      setSegments(prev => prev.map((seg, idx) => 
        idx === segmentIndex ? { ...seg, isGenerating: false } : seg
      ));
      
      if (error instanceof Error && error.message.includes('Rate limit')) {
        setErrorMessage('⏱️ Rate limit reached. Please wait before generating more segments.');
      }
    }
  };

  const playSegment = (segmentIndex: number) => {
    const segment = segments[segmentIndex];
    if (!segment.audioUrl) return;

    // Stop any currently playing segment
    if (playingSegment !== -1 && segmentAudioRefs.current[playingSegment]) {
      segmentAudioRefs.current[playingSegment].pause();
    }

    // Stop main audio if playing
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }

    if (playingSegment === segmentIndex) {
      // Stop current segment
      setPlayingSegment(-1);
    } else {
      // Play new segment
      const audio = new Audio(segment.audioUrl);
      segmentAudioRefs.current[segmentIndex] = audio;
      
      audio.addEventListener('ended', () => {
        setPlayingSegment(-1);
      });
      
      audio.play();
      setPlayingSegment(segmentIndex);
    }
  };

  const generateAllSegmentsAudio = async () => {
    if (isGeneratingAudio || segments.length === 0) return;
    
    setIsGeneratingAudio(true);
    setErrorMessage(null);
    setGeneratedSegments(0);
    
    try {
      // Generate each segment individually with rate limiting
      for (let i = 0; i < segments.length; i++) {
        if (segments[i].audioUrl) {
          setGeneratedSegments(prev => prev + 1);
          continue; // Skip if already generated
        }
        
        await generateSegmentAudio(i);
        
        // Add delay between segments to respect rate limits
        if (i < segments.length - 1) {
          console.log('Waiting before next segment...');
          await new Promise(resolve => setTimeout(resolve, 22000)); // 22 seconds
        }
      }
      
      console.log('All segments generated successfully');
      
    } catch (error) {
      console.error('Error generating all segments:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to generate all segments');
    } finally {
      setIsGeneratingAudio(false);
    }
  };
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
      if (audioRef.current) {
        audioRef.current.pause();
      }
    } else {
      if (audioUrl && audioRef.current) {
        setIsPlaying(true);
        audioRef.current.play();
      } else if (!isGeneratingAudio && audioProgress < 100) {
        generateAudio();
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
        )}        {/* Voice Settings */}
        {showVoiceSettings && (
          <div className="p-4 bg-gray-50 rounded-lg space-y-3">
            <h4 className="font-medium text-sm">Choose Meditation Voice:</h4>
            <div className="grid grid-cols-1 gap-2">
              {MEDITATION_VOICES.map((voice) => (
                <button
                  key={voice.name}
                  onClick={() => {
                    setSelectedVoice(voice.name);
                    setAudioUrl(null); // Reset audio when voice changes
                    setAudioProgress(0);
                  }}
                  className={`p-3 text-left rounded border transition-colors ${
                    selectedVoice === voice.name 
                      ? 'bg-purple-100 border-purple-300 text-purple-900' 
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium text-sm">{voice.name}</div>
                  <div className="text-xs text-gray-600">{voice.description}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{errorMessage}</p>
          </div>
        )}        {/* Meditation Content - Display each segment in its own container */}
        <div className="space-y-4">
          <h4 className="font-medium mb-3">Meditation Guide:</h4>
          {segments.map((segment, index) => (
            <div 
              key={index}
              className={`p-4 rounded-lg border transition-all duration-300 ${
                currentSegment === index 
                  ? 'bg-purple-50 border-purple-200 shadow-sm' 
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`flex-shrink-0 px-2 py-1 rounded text-xs font-mono ${
                  currentSegment === index 
                    ? 'bg-purple-200 text-purple-800' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {segment.timestamp}
                </div>
                <div className={`flex-1 text-sm leading-relaxed ${
                  currentSegment === index ? 'text-gray-900 font-medium' : 'text-gray-700'
                }`}>
                  {segment.text}
                </div>
                <div className="flex-shrink-0 flex items-center space-x-2">
                  {/* Individual segment play button */}
                  {segment.audioUrl ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => playSegment(index)}
                      className="h-8 w-8 p-0"
                      title={playingSegment === index ? "Stop segment" : "Play segment"}
                    >
                      {playingSegment === index ? (
                        <Pause className="size-3" />
                      ) : (
                        <Play className="size-3" />
                      )}
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => generateSegmentAudio(index)}
                      disabled={segment.isGenerating}
                      className="h-8 px-3"
                      title="Generate audio for this segment"
                    >
                      {segment.isGenerating ? (
                        <Loader2 className="size-3 animate-spin" />
                      ) : (
                        <Volume2 className="size-3" />
                      )}
                    </Button>
                  )}
                  
                  {/* Status indicator */}
                  <div className="flex items-center">
                    {segment.isGenerating && (
                      <div className="text-xs text-orange-600">Generating...</div>
                    )}
                    {segment.audioUrl && !segment.isGenerating && (
                      <div className="text-xs text-green-600">Ready</div>
                    )}
                    {!segment.audioUrl && !segment.isGenerating && (
                      <div className="text-xs text-gray-400">Pending</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {segments.length === 0 && (
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {content}
              </div>
            </div>
          )}
        </div>        {/* Audio Generation Progress */}
        {(isGeneratingAudio || generatedSegments > 0) && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                {isGeneratingAudio ? (
                  <>
                    <Loader2 className="size-4 text-primary animate-spin" />
                    <span className="text-muted-foreground">
                      Generating meditation audio with Gemini TTS...
                    </span>
                  </>
                ) : (
                  <>
                    <Volume2 className="size-4 text-primary" />
                    <span className="text-muted-foreground">
                      {generatedSegments === segments.length 
                        ? 'All segments ready' 
                        : `${generatedSegments}/${segments.length} segments generated`}
                    </span>
                  </>
                )}
              </div>
              <span className="text-muted-foreground">
                {segments.length > 0 ? `${generatedSegments}/${segments.length}` : '0/0'}
              </span>
            </div>
            <Progress 
              value={segments.length > 0 ? (generatedSegments / segments.length) * 100 : 0} 
              max={100} 
              className="h-2" 
            />
          </div>
        )}

        {/* Hidden audio element */}
        {audioUrl && (
          <audio
            ref={audioRef}
            src={audioUrl}
            preload="metadata"
            className="hidden"
          />
        )}        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePlayPause}
            disabled={isGeneratingAudio}
            className="flex items-center space-x-2"
          >            {isPlaying ? (
              <>
                <Pause className="size-4" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="size-4" />
                <span>
                  {audioUrl ? "Play Meditation" : "Play Full Audio"}
                </span>
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={generateAllSegmentsAudio}
            disabled={isGeneratingAudio || segments.length === 0}
            className="flex items-center space-x-2"
          >
            {isGeneratingAudio ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Volume2 className="size-4" />
                <span>
                  {generatedSegments === segments.length 
                    ? "All Ready" 
                    : `Generate All (${generatedSegments}/${segments.length})`}
                </span>
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowVoiceSettings(!showVoiceSettings)}
            className="flex items-center space-x-2"
          >
            <Settings className="size-4" />
            <span>Voice ({selectedVoice})</span>
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
