"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "next-auth";
import { Script } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  SkipForward,
  Video,
  Mic,
  Square,
  Download,
  Trash2,
  Calendar,
  Eye,
  X
} from "lucide-react";

interface TeleprompterPageContentProps {
  scriptId: string;
  user: User;
}

interface Recording {
  id: string;
  name: string;
  blob: Blob;
  timestamp: number;
  duration: number;
  type: 'video' | 'audio';
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
  
  // Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingType, setRecordingType] = useState<'video' | 'audio'>('video');
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [showRecordings, setShowRecordings] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordingStartTime, setRecordingStartTime] = useState<number>(0);
  const [previewRecording, setPreviewRecording] = useState<Recording | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const hideControlsTimeoutRef = useRef<NodeJS.Timeout>();
  const videoRef = useRef<HTMLVideoElement>(null);
  
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

  // Load recordings from localStorage
  useEffect(() => {
    const loadRecordings = () => {
      try {
        const savedRecordings = localStorage.getItem(`teleprompter-recordings-${scriptId}`);
        if (savedRecordings) {
          const parsed = JSON.parse(savedRecordings);
          // Convert stored blob data back to Blob objects
          const recordingsWithBlobs = parsed.map((recording: any) => ({
            ...recording,
            blob: new Blob([new Uint8Array(recording.blobData)], { type: recording.mimeType })
          }));
          setRecordings(recordingsWithBlobs);
        }
      } catch (error) {
        console.error('Error loading recordings:', error);
      }
    };

    loadRecordings();
  }, [scriptId]);

  // Save recordings to localStorage
  const saveRecordings = async (newRecordings: Recording[]) => {
    try {
      // Convert Blob objects to arrays for storage
      const recordingsForStorage = await Promise.all(
        newRecordings.map(async (recording) => {
          const arrayBuffer = await recording.blob.arrayBuffer();
          return {
            ...recording,
            blobData: Array.from(new Uint8Array(arrayBuffer)),
            mimeType: recording.blob.type,
            blob: undefined // Remove blob object for storage
          };
        })
      );
      
      localStorage.setItem(`teleprompter-recordings-${scriptId}`, JSON.stringify(recordingsForStorage));
    } catch (error) {
      console.error('Error saving recordings:', error);
    }
  };

  // Simple auto-scroll effect
  useEffect(() => {
    if (!isPlaying) return;

    let lastTime = 0;
    const animate = (currentTime: number) => {
      if (!lastTime) lastTime = currentTime;
      const deltaTime = currentTime - lastTime;
      
      if (containerRef.current && contentRef.current && deltaTime > 0) {
        const container = containerRef.current;
        const maxScroll = contentRef.current.scrollHeight - container.clientHeight;
        const currentScroll = container.scrollTop;
        
        // Speed is likely in pixels per frame or small increments
        // Convert to smooth movement: speed * frames per second
        // At 60fps, deltaTime is ~16.67ms, so multiply by appropriate factor
        const pixelsToMove = speed * (deltaTime / 16.67); // Normalize to 60fps
        const newScroll = currentScroll + pixelsToMove;

        if (newScroll >= maxScroll) {
          setIsPlaying(false);
          setIsRecording(false);
          container.scrollTop = maxScroll;
          setPosition(maxScroll);
          
          // Reset to beginning after reaching end
          setTimeout(() => {
            container.scrollTop = 0;
            setPosition(0);
          }, 1000);
        } else {
          container.scrollTop = newScroll;
          setPosition(newScroll);
        }
      }
      
      lastTime = currentTime;
      if (isPlaying) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, speed]);

  // Simple scroll tracking - only when not playing
  useEffect(() => {
    if (isPlaying) return; // Don't interfere during auto-scroll

    const handleScroll = () => {
      if (containerRef.current) {
        setPosition(containerRef.current.scrollTop);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [isPlaying]);

  // Simple wheel handling
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Don't interfere during auto-scroll
      if (isPlaying) return;
      
      e.preventDefault();
      if (containerRef.current) {
        const delta = e.deltaY;
        const currentScroll = containerRef.current.scrollTop;
        const newScroll = Math.max(0, currentScroll + delta);
        const maxScroll = contentRef.current!.scrollHeight - containerRef.current!.clientHeight;
        const finalScroll = Math.min(newScroll, maxScroll);
        
        containerRef.current.scrollTop = finalScroll;
        setPosition(finalScroll);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, [isPlaying]);

  // Fullscreen handling
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Auto-hide controls in fullscreen - but keep them visible longer
  useEffect(() => {
    const resetHideTimer = () => {
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current);
      }
      
      setShowControls(true);
      
      // Only hide controls after extended inactivity in fullscreen
      if (isFullscreen) {
        hideControlsTimeoutRef.current = setTimeout(() => {
          setShowControls(false);
        }, 10000); // 10 seconds of inactivity
      }
    };

    const handleMouseMove = () => resetHideTimer();
    const handleKeyPress = () => resetHideTimer();
    const handleClick = () => resetHideTimer();
    
    if (isFullscreen) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('keydown', handleKeyPress);
      document.addEventListener('click', handleClick);
      resetHideTimer();
    } else {
      setShowControls(true);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('click', handleClick);
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current);
      }
    };
  }, [isFullscreen]);

  const togglePlay = useCallback(() => {
    if (!isPlaying && containerRef.current) {
      const currentPosition = containerRef.current.scrollTop;
      const maxScroll = containerRef.current.scrollHeight - containerRef.current.clientHeight;
      
      // If we're at the end, reset to beginning
      if (currentPosition >= maxScroll - 10) {
        setPosition(0);
        containerRef.current.scrollTop = 0;
      }
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);
  
  const resetPosition = useCallback(() => {
    setPosition(0);
    setIsPlaying(false);
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, []);

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

  const skipPosition = useCallback((seconds: number) => {
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
  }, []);

  // Add keyboard navigation for scroll control - works during playback
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!showSettings) { // Only when settings panel is not open
        switch (e.key) {
          case ' ': // Spacebar for play/pause
            e.preventDefault();
            togglePlay();
            break;
          case 'ArrowUp':
            e.preventDefault();
            if (!isPlaying) {
              skipPosition(-2);
            }
            break;
          case 'ArrowDown':
            e.preventDefault();
            if (!isPlaying) {
              skipPosition(2);
            }
            break;
          case 'Home':
            e.preventDefault();
            resetPosition();
            break;
          case 'End':
            e.preventDefault();
            if (!isPlaying && containerRef.current && contentRef.current) {
              const maxScroll = contentRef.current.scrollHeight - containerRef.current.clientHeight;
              setPosition(maxScroll);
              containerRef.current.scrollTop = maxScroll;
            } else if (containerRef.current && contentRef.current) {
              const maxScroll = contentRef.current.scrollHeight - containerRef.current.clientHeight;
              setPosition(maxScroll);
              containerRef.current.scrollTop = maxScroll;
            }
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, showSettings, togglePlay, skipPosition, resetPosition]);

  // Prevent body scrolling when teleprompter is active
  useEffect(() => {
    // Disable body scrolling
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      // Re-enable body scrolling when component unmounts
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  // Touch/swipe support for mobile scrolling - works during playback
  useEffect(() => {
    let startY = 0;
    let isScrolling = false;

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      isScrolling = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isScrolling && containerRef.current && !isPlaying) {
        const currentY = e.touches[0].clientY;
        const deltaY = startY - currentY;
        
        const currentScroll = containerRef.current.scrollTop;
        const newScroll = Math.max(0, currentScroll + deltaY);
        const maxScroll = contentRef.current!.scrollHeight - containerRef.current!.clientHeight;
        const finalScroll = Math.min(newScroll, maxScroll);
        
        containerRef.current.scrollTop = finalScroll;
        setPosition(finalScroll);
        
        startY = currentY;
      }
    };

    const handleTouchEnd = () => {
      isScrolling = false;
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('touchstart', handleTouchStart, { passive: true });
      container.addEventListener('touchmove', handleTouchMove, { passive: true });
      container.addEventListener('touchend', handleTouchEnd, { passive: true });
      
      return () => {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
        container.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isPlaying]);

  // Recording functions
  const startRecording = async () => {
    try {
      // Check if MediaDevices API is available
      if (!navigator.mediaDevices) {
        throw new Error('MediaDevices API not supported. This feature requires HTTPS and a modern browser.');
      }

      if (!navigator.mediaDevices.getUserMedia) {
        throw new Error('getUserMedia not supported. Please use a modern browser (Chrome, Firefox, Safari, Edge).');
      }

      // Check if we're on mobile and request permissions explicitly
      if (navigator.permissions) {
        try {
          const cameraPermission = await navigator.permissions.query({ name: 'camera' as PermissionName });
          const micPermission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
          
          console.log('Camera permission:', cameraPermission.state);
          console.log('Microphone permission:', micPermission.state);
        } catch (permError) {
          console.log('Permission query not supported:', permError);
        }
      }

      const constraints = recordingType === 'video' 
        ? { 
            video: { 
              width: { ideal: 1280, max: 1920 }, 
              height: { ideal: 720, max: 1080 },
              facingMode: 'user' // Use front camera on mobile
            }, 
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              sampleRate: 44100
            }
          }
        : { 
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              sampleRate: 44100
            }
          };
      
      console.log('Requesting media with constraints:', constraints);
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      console.log('Media stream obtained:', stream);
      console.log('Video tracks:', stream.getVideoTracks());
      console.log('Audio tracks:', stream.getAudioTracks());
      
      if (recordingType === 'video' && videoRef.current) {
        videoRef.current.srcObject = stream;
        // Ensure video plays
        try {
          await videoRef.current.play();
          console.log('Video preview started successfully');
        } catch (playError) {
          console.log('Video play error (this is normal on some browsers):', playError);
        }
      }
      
      // Check MediaRecorder support
      if (!window.MediaRecorder) {
        throw new Error('MediaRecorder not supported. Please use a modern browser.');
      }
      
      // Choose the best mime type
      let mimeType = '';
      if (recordingType === 'video') {
        if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')) {
          mimeType = 'video/webm;codecs=vp9,opus';
        } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')) {
          mimeType = 'video/webm;codecs=vp8,opus';
        } else if (MediaRecorder.isTypeSupported('video/webm')) {
          mimeType = 'video/webm';
        } else if (MediaRecorder.isTypeSupported('video/mp4')) {
          mimeType = 'video/mp4';
        }
      } else {
        if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
          mimeType = 'audio/webm;codecs=opus';
        } else if (MediaRecorder.isTypeSupported('audio/webm')) {
          mimeType = 'audio/webm';
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
        }
      }
      
      console.log('Using mime type:', mimeType);
      
      const recorder = mimeType 
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);
        
      const chunks: BlobPart[] = [];
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
          console.log('Data chunk received:', event.data.size, 'bytes');
        }
      };
      
      recorder.onstop = () => {
        console.log('Recording stopped, creating blob...');
        const blob = new Blob(chunks, { 
          type: mimeType || (recordingType === 'video' ? 'video/webm' : 'audio/webm')
        });
        
        console.log('Blob created:', blob.size, 'bytes');
        
        const duration = Date.now() - recordingStartTime;
        const newRecording: Recording = {
          id: Date.now().toString(),
          name: `${recordingType === 'video' ? 'Video' : 'Audio'} Recording ${new Date().toLocaleString()}`,
          blob,
          timestamp: Date.now(),
          duration,
          type: recordingType
        };
        
        const updatedRecordings = [...recordings, newRecording];
        setRecordings(updatedRecordings);
        saveRecordings(updatedRecordings);
        
        // Stop all tracks
        stream.getTracks().forEach(track => {
          track.stop();
          console.log('Stopped track:', track.kind);
        });
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      };
      
      recorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
      };
      
      setMediaRecorder(recorder);
      setRecordingStartTime(Date.now());
      recorder.start(1000); // Record in 1-second chunks for better mobile compatibility
      setIsRecording(true);
      
      console.log('Recording started successfully');
    } catch (error) {
      console.error('Error starting recording:', error);
      
      let errorMessage = 'Error starting recording. ';
      
      if (error instanceof Error) {
        if (error.message.includes('MediaDevices') || error.message.includes('getUserMedia') || error.message.includes('MediaRecorder')) {
          errorMessage += 'Recording is not supported on this browser or connection. Please ensure you are using HTTPS and a modern browser (Chrome, Firefox, Safari, Edge).';
        } else if (error.name === 'NotAllowedError') {
          errorMessage += 'Please allow camera and microphone permissions when prompted. You may need to refresh the page and try again.';
        } else if (error.name === 'NotFoundError') {
          errorMessage += 'No camera or microphone found. Please ensure your device has the required hardware.';
        } else if (error.name === 'NotSupportedError') {
          errorMessage += 'Recording is not supported on this device or browser.';
        } else if (error.name === 'NotReadableError') {
          errorMessage += 'Camera or microphone is already in use by another application.';
        } else if (error.name === 'SecurityError') {
          errorMessage += 'Security error: Please ensure you are accessing this page via HTTPS.';
        } else {
          errorMessage += `${error.message}`;
        }
      } else {
        errorMessage += 'Unknown error. Please ensure you are using HTTPS and a modern browser.';
      }
      
      alert(errorMessage);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  const downloadRecording = (recording: Recording) => {
    const url = URL.createObjectURL(recording.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${recording.name}.${recording.type === 'video' ? 'webm' : 'webm'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const previewRecordingFile = (recording: Recording) => {
    setPreviewRecording(recording);
  };

  const closePreview = () => {
    setPreviewRecording(null);
  };

  const deleteRecording = (recordingId: string) => {
    const updatedRecordings = recordings.filter(r => r.id !== recordingId);
    setRecordings(updatedRecordings);
    saveRecordings(updatedRecordings);
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Check permissions function
  const checkPermissions = async () => {
    try {
      // Check if MediaDevices API is available
      if (!navigator.mediaDevices) {
        throw new Error('MediaDevices API not supported. Please use HTTPS or a modern browser.');
      }

      if (!navigator.mediaDevices.getUserMedia) {
        throw new Error('getUserMedia not supported. Please use a modern browser.');
      }

      // Request permissions explicitly
      const constraints = recordingType === 'video' 
        ? { video: true, audio: true }
        : { audio: true };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // Test successful, stop the stream
      stream.getTracks().forEach(track => track.stop());
      
      alert(`${recordingType === 'video' ? 'Camera and microphone' : 'Microphone'} permissions granted successfully! You can now start recording.`);
      
      return true;
    } catch (error) {
      console.error('Permission check failed:', error);
      
      let errorMessage = 'Permission request failed. ';
      
      if (error instanceof Error) {
        if (error.message.includes('MediaDevices') || error.message.includes('getUserMedia')) {
          errorMessage += 'Your browser or connection does not support media recording. Please ensure you are using HTTPS and a modern browser (Chrome, Firefox, Safari, Edge).';
        } else if (error.name === 'NotAllowedError') {
          errorMessage += 'Please allow camera and microphone permissions when prompted. You may need to refresh the page and try again.';
        } else if (error.name === 'NotFoundError') {
          errorMessage += 'No camera or microphone found on this device.';
        } else if (error.name === 'NotSupportedError') {
          errorMessage += 'Media recording is not supported on this device or browser.';
        } else if (error.name === 'SecurityError') {
          errorMessage += 'Security error: Please ensure you are using HTTPS and try again.';
        } else {
          errorMessage += error.message;
        }
      } else {
        errorMessage += 'Unknown error occurred. Please ensure you are using HTTPS and a modern browser.';
      }
      
      alert(errorMessage);
      return false;
    }
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
    <div className="fixed inset-0 bg-black text-white overflow-hidden">
      {/* Video Preview for Recording */}
      {isRecording && recordingType === 'video' && (
        <video
          ref={videoRef}
          className="fixed top-4 right-4 w-48 h-36 rounded-lg border-2 border-red-500 bg-black z-20"
          muted
          playsInline
          autoPlay
        />
      )}

      {/* Recording Indicator */}
      {isRecording && (
        <div className="fixed top-4 left-4 z-20 bg-red-500/90 backdrop-blur-md rounded-lg px-3 py-2 flex items-center gap-2">
          <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
          <span className="text-white font-medium">
            Recording {recordingType === 'video' ? 'Video' : 'Audio'}
          </span>
        </div>
      )}

      {/* Main Content Area */}
      <div 
        ref={containerRef}
        className="h-screen overflow-y-auto overflow-x-hidden relative scroll-smooth"
        style={{ 
          cursor: isFullscreen && !showControls ? 'none' : 'default',
          scrollBehavior: isPlaying ? 'auto' : 'smooth' // Smooth scrolling when manually scrolling, auto when playing
        }}
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
              
              {/* Progress Indicator */}
              <div className="mt-4 pt-4 border-t border-white/20">
                <div className="flex items-center justify-between text-sm text-zinc-400 mb-2">
                  <span>Progress</span>
                  <span>
                    {containerRef.current && contentRef.current ? 
                      Math.round((position / Math.max(1, contentRef.current.scrollHeight - containerRef.current.clientHeight)) * 100) : 0}%
                    </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-cyan-400 h-2 rounded-full transition-all duration-200"
                    style={{ 
                      width: `${containerRef.current && contentRef.current ? 
                        Math.round((position / Math.max(1, contentRef.current.scrollHeight - containerRef.current.clientHeight)) * 100) : 0}%` 
                    }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-zinc-500 mt-1">
                  <span>Scroll to navigate • Arrow keys • Mouse wheel</span>
                  <span>
                    {!isPlaying ? 'Manual control' : 'Auto-scrolling with manual adjustment'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Main Controls */}
          <div className="flex items-center justify-between gap-4 overflow-x-auto pb-2 min-w-0">
            {/* Left: Navigation */}
            <div className="flex items-center gap-2 flex-shrink-0">
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
            <div className="flex items-center gap-2 flex-shrink-0">
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
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Recording Controls */}
              <div className="flex items-center gap-1 mr-2">
                {/* Permission Check Button - shown when no recordings exist */}
                {recordings.length === 0 && !isRecording && (
                  <Button
                    onClick={checkPermissions}
                    className="bg-yellow-500/20 border border-yellow-400/30 hover:bg-yellow-500/30 text-white"
                    size="sm"
                    title="Test camera/microphone permissions"
                  >
                    🔐
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  onClick={() => setRecordingType(recordingType === 'video' ? 'audio' : 'video')}
                  className={`bg-white/10 border-white/20 text-white hover:bg-white/20 ${
                    !isRecording ? '' : 'opacity-50 cursor-not-allowed'
                  }`}
                  disabled={isRecording}
                  size="sm"
                  title={`Switch to ${recordingType === 'video' ? 'audio' : 'video'} recording`}
                >
                  {recordingType === 'video' ? <Video size={16} /> : <Mic size={16} />}
                </Button>
                
                <Button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`${
                    isRecording 
                      ? 'bg-red-500/30 border border-red-400/50 hover:bg-red-500/40' 
                      : 'bg-green-500/30 border border-green-400/50 hover:bg-green-500/40'
                  } text-white`}
                  size="sm"
                  title={isRecording ? 'Stop recording' : `Start ${recordingType} recording`}
                >
                  {isRecording ? <Square size={16} /> : (recordingType === 'video' ? <Video size={16} /> : <Mic size={16} />)}
                </Button>
              </div>

              {/* Recordings Modal */}
              {recordings.length > 0 && (
                <Dialog open={showRecordings} onOpenChange={setShowRecordings}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      size="sm"
                    >
                      <Download size={16} />
                      <span className="ml-1 text-xs">({recordings.length})</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-black/90 backdrop-blur-md border border-white/20 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-white">Recordings for {script?.title}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 mt-4">
                      {recordings.map((recording) => (
                        <div key={recording.id} className="bg-white/10 rounded-lg p-4 flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-white">{recording.name}</h3>
                            <div className="flex items-center gap-4 text-sm text-zinc-400 mt-1">
                              <span className="flex items-center gap-1">
                                {recording.type === 'video' ? <Video size={14} /> : <Mic size={14} />}
                                {recording.type === 'video' ? 'Video' : 'Audio'}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar size={14} />
                                {new Date(recording.timestamp).toLocaleDateString()}
                              </span>
                              <span>Duration: {formatDuration(recording.duration)}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() => previewRecordingFile(recording)}
                              className="bg-blue-500/20 border border-blue-400/30 hover:bg-blue-500/30 text-white"
                              size="sm"
                            >
                              <Eye size={16} />
                            </Button>
                            <Button
                              onClick={() => downloadRecording(recording)}
                              className="bg-green-500/20 border border-green-400/30 hover:bg-green-500/30 text-white"
                              size="sm"
                            >
                              <Download size={16} />
                            </Button>
                            <Button
                              onClick={() => deleteRecording(recording.id)}
                              className="bg-red-500/20 border border-red-400/30 hover:bg-red-500/30 text-white"
                              size="sm"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              )}

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

      {/* Preview Modal */}
      {previewRecording && (
        <Dialog open={!!previewRecording} onOpenChange={closePreview}>
          <DialogContent className="bg-black/95 backdrop-blur-md border border-white/20 text-white max-w-4xl max-h-[90vh]">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-white">{previewRecording.name}</DialogTitle>
                <Button
                  onClick={closePreview}
                  variant="outline"
                  size="sm"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <X size={16} />
                </Button>
              </div>
            </DialogHeader>
            <div className="mt-4">
              {previewRecording.type === 'video' ? (
                <video
                  src={URL.createObjectURL(previewRecording.blob)}
                  controls
                  className="w-full max-h-[60vh] rounded-lg bg-black"
                  preload="metadata"
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="bg-white/10 rounded-lg p-8 text-center">
                  <Mic size={48} className="mx-auto mb-4 text-cyan-400" />
                  <h3 className="text-lg font-medium mb-4">Audio Recording</h3>
                  <audio
                    src={URL.createObjectURL(previewRecording.blob)}
                    controls
                    className="w-full"
                    preload="metadata"
                  >
                    Your browser does not support the audio tag.
                  </audio>
                </div>
              )}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/20">
                <div className="text-sm text-zinc-400">
                  <span className="flex items-center gap-2">
                    <Calendar size={14} />
                    {new Date(previewRecording.timestamp).toLocaleString()}
                  </span>
                  <span className="mt-1 block">Duration: {formatDuration(previewRecording.duration)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => downloadRecording(previewRecording)}
                    className="bg-green-500/20 border border-green-400/30 hover:bg-green-500/30 text-white"
                  >
                    <Download size={16} className="mr-2" />
                    Download
                  </Button>
                  <Button
                    onClick={() => {
                      deleteRecording(previewRecording.id);
                      closePreview();
                    }}
                    className="bg-red-500/20 border border-red-400/30 hover:bg-red-500/30 text-white"
                  >
                    <Trash2 size={16} className="mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}