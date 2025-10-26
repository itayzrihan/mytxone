"use client";

import { useEffect, useRef, useState } from "react";

interface CountdownRecorderProps {
  onCountdownComplete: () => void;
  isActive: boolean;
}

export function CountdownRecorder({ onCountdownComplete, isActive }: CountdownRecorderProps) {
  const [count, setCount] = useState<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const countdownTimeoutRef = useRef<NodeJS.Timeout>();
  const soundsRef = useRef<{ [key: number]: OscillatorNode[] }>({});

  // Play beep sound for each number
  const playBeep = (frequency: number = 440, duration: number = 200) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = "sine";
      oscillator.frequency.value = frequency;

      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration / 1000);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration / 1000);

      return oscillator;
    } catch (error) {
      console.error("Error playing beep:", error);
      return null;
    }
  };

  // Final beep with double tone for "Go!"
  const playGoSound = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const ctx = audioContextRef.current;
      
      // First beep
      let osc = ctx.createOscillator();
      let gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.value = 600;
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.1);

      // Second beep slightly higher
      osc = ctx.createOscillator();
      gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.value = 800;
      gain.gain.setValueAtTime(0.3, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start(ctx.currentTime + 0.1);
      osc.stop(ctx.currentTime + 0.3);
    } catch (error) {
      console.error("Error playing go sound:", error);
    }
  };

  useEffect(() => {
    if (!isActive) {
      setCount(null);
      return;
    }

    // Start countdown from 5
    setCount(5);

    const startCountdown = (currentCount: number) => {
      if (currentCount === 0) {
        playGoSound();
        setCount(0);
        countdownTimeoutRef.current = setTimeout(() => {
          setCount(null);
          onCountdownComplete();
        }, 300);
      } else {
        playBeep(440 + currentCount * 40, 200);
        setCount(currentCount);
        countdownTimeoutRef.current = setTimeout(() => {
          startCountdown(currentCount - 1);
        }, 1000);
      }
    };

    startCountdown(5);

    return () => {
      if (countdownTimeoutRef.current) {
        clearTimeout(countdownTimeoutRef.current);
      }
    };
  }, [isActive, onCountdownComplete]);

  if (count === null) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Glow background effect */}
      <div className="absolute inset-0 bg-gradient-to-center from-transparent via-cyan-500/10 to-transparent animate-pulse" />

      {/* Main countdown number with massive glow */}
      <div className="relative">
        {/* Multiple glow layers */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Outer glow */}
          <div
            className="absolute rounded-full blur-3xl"
            style={{
              width: "300px",
              height: "300px",
              background: "radial-gradient(circle, rgba(34, 211, 238, 0.8) 0%, rgba(34, 211, 238, 0.3) 40%, transparent 70%)",
              animation: "pulse 1s ease-in-out"
            }}
          />
          {/* Middle glow */}
          <div
            className="absolute rounded-full blur-2xl"
            style={{
              width: "240px",
              height: "240px",
              background: "radial-gradient(circle, rgba(59, 130, 246, 0.6) 0%, rgba(59, 130, 246, 0.2) 50%, transparent 80%)",
              animation: "pulse 1s ease-in-out 0.1s both"
            }}
          />
          {/* Inner glow */}
          <div
            className="absolute rounded-full blur-xl"
            style={{
              width: "180px",
              height: "180px",
              background: "radial-gradient(circle, rgba(99, 102, 241, 0.5) 0%, rgba(99, 102, 241, 0.1) 60%, transparent 90%)",
              animation: "pulse 1s ease-in-out 0.2s both"
            }}
          />
        </div>

        {/* Number display */}
        <div
          className="relative text-white font-black text-center"
          style={{
            fontSize: count === 0 ? "180px" : "200px",
            lineHeight: "1",
            textShadow: `
              0 0 20px rgba(34, 211, 238, 0.8),
              0 0 40px rgba(59, 130, 246, 0.6),
              0 0 60px rgba(99, 102, 241, 0.4),
              0 0 80px rgba(34, 211, 238, 0.2)
            `,
            animation: count === 0 ? "countdownEnd 0.5s ease-out" : "countdownPulse 0.8s ease-out",
            transform: count === 0 ? "scale(0.8)" : "scale(1)"
          }}
        >
          {count === 0 ? "GO!" : count}
        </div>

        {/* Pulsing rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute rounded-full border-2 border-cyan-400"
              style={{
                width: `${200 + i * 80}px`,
                height: `${200 + i * 80}px`,
                animation: `countdownRing 1s ease-out`,
                animationDelay: `${i * 0.2}s`,
                opacity: 0.6 - i * 0.15
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes countdownPulse {
          0% {
            transform: scale(1.2);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes countdownEnd {
          0% {
            transform: scale(1.1);
            opacity: 1;
          }
          100% {
            transform: scale(0.8);
            opacity: 0.9;
          }
        }

        @keyframes countdownRing {
          0% {
            transform: scale(0.8);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.3);
            opacity: 0;
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
