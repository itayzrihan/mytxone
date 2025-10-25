import { useState } from 'react';

export type InfographicMode = 'countdown' | 'custom';

export interface CountdownSettings {
  videoSize: 'horizontal' | 'vertical';
  countdown: number;
  generationMode: 'scheduled' | 'instant';
  font: string;
  textStyle: 'solid' | 'gradient';
  fontColor: string;
  textGradientStart: string;
  textGradientEnd: string;
  textGradientDirection: 'vertical' | 'horizontal' | 'diagonal';
  textOpacity: number;
  textBlendMode: string;
  shadowOffsetX: number;
  shadowOffsetY: number;
  shadowBlur: number;
  shadowColor: string;
  animationIn: string;
  animationOut: string;
  backgroundType: 'color' | 'gradient' | 'image' | 'transparent';
  backgroundColor: string;
  gradientType: 'linear' | 'radial';
  gradientDirection: 'diagonal' | 'horizontal' | 'vertical' | 'custom';
  gradientAngle: number;
  gradientColors: Array<{ color: string; position: number }>;
  backgroundImage: File | null;
}

export interface CustomSettings {
  orientation: 'horizontal' | 'vertical';
  animationDuration: number;
  unifiedCode: string;
}

export interface ProgressState {
  isVisible: boolean;
  current: number;
  total: number;
  message: string;
}

export function useInfographicState() {
  const [mode, setMode] = useState<InfographicMode>('countdown');
  
  const [countdownSettings, setCountdownSettings] = useState<CountdownSettings>({
    videoSize: 'horizontal',
    countdown: 10,
    generationMode: 'scheduled',
    font: 'Arial',
    textStyle: 'solid',
    fontColor: '#FFFFFF',
    textGradientStart: '#ff6b6b',
    textGradientEnd: '#4ecdc4',
    textGradientDirection: 'vertical',
    textOpacity: 100,
    textBlendMode: 'normal',
    shadowOffsetX: 5,
    shadowOffsetY: 5,
    shadowBlur: 5,
    shadowColor: '#000000',
    animationIn: 'fadeIn',
    animationOut: 'fadeOut',
    backgroundType: 'color',
    backgroundColor: '#333333',
    gradientType: 'linear',
    gradientDirection: 'diagonal',
    gradientAngle: 135,
    gradientColors: [
      { color: '#667eea', position: 0 },
      { color: '#764ba2', position: 1 }
    ],
    backgroundImage: null,
  });

  const [customSettings, setCustomSettings] = useState<CustomSettings>({
    orientation: 'horizontal',
    animationDuration: 5,
    unifiedCode: `<!-- HTML Structure -->
<div class="scene" id="scene">
  <div class="circle hero" id="hero"></div>
  <div class="platform" id="platform1"></div>
  <div class="platform" id="platform2"></div>
  <div class="platform" id="platform3"></div>
</div>

/* CSS Styles & Animations */
<style>
.scene {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, #87CEEB 0%, #98FB98 100%);
  transition: transform 0.3s ease;
}

.hero {
  width: 40px;
  height: 40px;
  background: radial-gradient(circle at 30% 30%, #ff6b6b, #e74c3c);
  border-radius: 50%;
  position: absolute;
  left: 50px;
  top: 340px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.platform {
  height: 15px;
  background: linear-gradient(180deg, #8B4513, #6533321);
  position: absolute;
  border-radius: 3px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

#platform1 { width: 80px; left: 150px; top: 350px; }
#platform2 { width: 90px; left: 280px; top: 280px; }
#platform3 { width: 100px; left: 420px; top: 210px; }

/* Physics-based animations */
@keyframes jump-to-platform1 {
  0% { left: 50px; top: 340px; transform: scale(1) scaleY(1); }
  25% { left: 100px; top: 300px; transform: scale(1.1) scaleY(0.9); }
  50% { left: 150px; top: 320px; transform: scale(0.9) scaleY(1.2); }
  75% { left: 150px; top: 340px; transform: scale(1.05) scaleY(0.95); }
  100% { left: 150px; top: 335px; transform: scale(1) scaleY(1); }
}

.jump1 { animation: jump-to-platform1 1s ease-out; }
</style>

// Animation Sequence
0s: Add 'jump1' class to #hero
1s: Remove 'jump1' class from #hero`,
  });

  const [progressState, setProgressState] = useState<ProgressState>({
    isVisible: false,
    current: 0,
    total: 100,
    message: '',
  });

  return {
    mode,
    setMode,
    countdownSettings,
    setCountdownSettings,
    customSettings,
    setCustomSettings,
    progressState,
    setProgressState,
  };
}
