import { CountdownSettings, ProgressState } from './hooks/use-infographic-state';
import { Button } from '@/components/ui/button';

interface CountdownControlsProps {
  settings: CountdownSettings;
  onSettingsChange: (settings: CountdownSettings) => void;
  progressState: ProgressState;
  onProgressChange: (state: ProgressState) => void;
}

export function CountdownControls({ 
  settings, 
  onSettingsChange, 
  progressState, 
  onProgressChange 
}: CountdownControlsProps) {
  
  const updateSetting = <K extends keyof CountdownSettings>(
    key: K, 
    value: CountdownSettings[K]
  ) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const handleGenerateVideo = async () => {
    onProgressChange({
      isVisible: true,
      current: 0,
      total: settings.countdown + 1,
      message: 'Starting video generation...'
    });

    // Simulate video generation process
    for (let i = 0; i <= settings.countdown; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onProgressChange({
        isVisible: true,
        current: i + 1,
        total: settings.countdown + 1,
        message: `Recording frame ${i + 1}/${settings.countdown + 1}`
      });
    }

    // Hide progress
    onProgressChange({
      isVisible: false,
      current: 0,
      total: 100,
      message: ''
    });
  };

  return (
    <div id="countdown-mode-controls">
      <h3 className="text-xl font-semibold mb-6 text-gray-700">⏱️ Countdown Settings</h3>
      
      {/* Video Configuration */}
      <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-200/50 mb-5">
        <label className="block mb-3 font-semibold text-gray-700">📱 Video Orientation:</label>
        <div className="space-y-2">
          <label className="flex items-center text-black">
            <input
              type="radio"
              name="video-size"
              value="horizontal"
              checked={settings.videoSize === 'horizontal'}
              onChange={(e) => updateSetting('videoSize', e.target.value as 'horizontal' | 'vertical')}
              className="mr-2 scale-110 accent-blue-500"
            />
            🖥️ Horizontal (1920×1080)
          </label>
            <label className="flex items-center text-black">
            <input
              type="radio"
              name="video-size"
              value="vertical"
              checked={settings.videoSize === 'vertical'}
              onChange={(e) => updateSetting('videoSize', e.target.value as 'horizontal' | 'vertical')}
              className="mr-2 scale-110 accent-blue-500"
            />
            📱 Vertical (1080×1920)
          </label>
        </div>
      </div>

      {/* Countdown Duration */}
      <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-200/50 mb-5">
        <label htmlFor="countdown" className="block mb-2 font-semibold text-gray-700">
          ⏱️ Countdown Duration (seconds):
        </label>
        <input
          type="number"
          id="countdown"
          value={settings.countdown}
          onChange={(e) => updateSetting('countdown', parseInt(e.target.value))}
          min="1"
          max="60"
          className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
          title="Choose between 1-60 seconds for your countdown"
        />
        <small className="text-gray-600 text-sm block mt-1">
          Recommended: 10-20 seconds for optimal viewer engagement
        </small>
      </div>

      {/* Generation Mode */}
      <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-200/50 mb-5">
        <label className="block mb-3 font-semibold text-gray-700">⚡ Generation Mode:</label>
        <div className="space-y-2">
          <label className="flex items-center text-black">
            <input
              type="radio"
              name="generation-mode"
              value="scheduled"
              checked={settings.generationMode === 'scheduled'}
              onChange={(e) => updateSetting('generationMode', e.target.value as 'scheduled' | 'instant')}
              className="mr-2 scale-110 accent-blue-500"
            />
            ⏱️ Scheduled (Real-time countdown)
          </label>
          <label className="flex items-center text-black">
            <input
              type="radio"
              name="generation-mode"
              value="instant"
              checked={settings.generationMode === 'instant'}
              onChange={(e) => updateSetting('generationMode', e.target.value as 'scheduled' | 'instant')}
              className="mr-2 scale-110 accent-blue-500"
            />
            🚀 Instant (No waiting)
          </label>
        </div>
        <small className="text-gray-600 text-sm block mt-1">
          Instant mode generates faster but may be less accurate
        </small>
      </div>

      {/* Typography Settings */}
      <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-200/50 mb-5">
        <label htmlFor="font" className="block mb-2 font-semibold text-gray-700">
          🔤 Font Family:
        </label>
        <select
          id="font"
          value={settings.font}
          onChange={(e) => updateSetting('font', e.target.value)}
          className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
        >
          <option value="Arial">Arial</option>
          <option value="Verdana">Verdana</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier New">Courier New</option>
          <option value="Georgia">Georgia</option>
          <option value="Impact">Impact</option>
          <option value="Trebuchet MS">Trebuchet MS</option>
          <option value="Comic Sans MS">Comic Sans MS</option>
        </select>
      </div>

      {/* Text Style */}
      <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-200/50 mb-5">
        <label className="block mb-3 font-semibold text-gray-700">🎨 Text Style:</label>
        <div className="space-y-2 mb-4">
          <label className="flex items-center text-black">
            <input
              type="radio"
              name="text-style"
              value="solid"
              checked={settings.textStyle === 'solid'}
              onChange={(e) => updateSetting('textStyle', e.target.value as 'solid' | 'gradient')}
              className="mr-2 scale-110 accent-blue-500"
            />
            🎨 Solid Color
          </label>
          <label className="flex items-center text-black">
            <input
              type="radio"
              name="text-style"
              value="gradient"
              checked={settings.textStyle === 'gradient'}
              onChange={(e) => updateSetting('textStyle', e.target.value as 'solid' | 'gradient')}
              className="mr-2 scale-110 accent-blue-500"
            />
            🌈 Gradient
          </label>
        </div>

        {/* Solid Text Color */}
        {settings.textStyle === 'solid' && (
          <div id="solid-text-controls">
            <label htmlFor="font-color" className="block mb-2 text-sm font-medium">Color:</label>
            <input
              type="color"
              id="font-color"
              value={settings.fontColor}
              onChange={(e) => updateSetting('fontColor', e.target.value)}
              className="w-full h-12 border-2 border-gray-200 rounded-xl cursor-pointer"
            />
          </div>
        )}

        {/* Gradient Text Controls */}
        {settings.textStyle === 'gradient' && (
          <div id="gradient-text-controls">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-sm font-medium mb-1">Start Color:</label>
                <input
                  type="color"
                  value={settings.textGradientStart}
                  onChange={(e) => updateSetting('textGradientStart', e.target.value)}
                  className="w-full h-12 border-2 border-gray-200 rounded-xl cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Color:</label>
                <input
                  type="color"
                  value={settings.textGradientEnd}
                  onChange={(e) => updateSetting('textGradientEnd', e.target.value)}
                  className="w-full h-12 border-2 border-gray-200 rounded-xl cursor-pointer"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Direction:</label>
              <select
                value={settings.textGradientDirection}
                onChange={(e) => updateSetting('textGradientDirection', e.target.value as 'vertical' | 'horizontal' | 'diagonal')}
                className="w-full p-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
              >
                <option value="vertical">↕️ Top to Bottom</option>
                <option value="horizontal">↔️ Left to Right</option>
                <option value="diagonal">🔄 Diagonal</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Text Effects */}
      <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-200/50 mb-5">
        <label className="block mb-3 font-semibold text-gray-700">✨ Text Effects:</label>
        <div className="mb-3">
          <label htmlFor="text-opacity" className="block text-sm font-medium mb-1">
            Opacity: {settings.textOpacity}%
          </label>
          <input
            type="range"
            id="text-opacity"
            min="0"
            max="100"
            value={settings.textOpacity}
            onChange={(e) => updateSetting('textOpacity', parseInt(e.target.value))}
            className="w-full accent-blue-500"
          />
        </div>
        <div>
          <label htmlFor="text-blend-mode" className="block text-sm font-medium mb-1">
            Blend Mode:
          </label>
          <select
            id="text-blend-mode"
            value={settings.textBlendMode}
            onChange={(e) => updateSetting('textBlendMode', e.target.value)}
            className="w-full p-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
          >
            <option value="normal">Normal</option>
            <option value="multiply">Multiply</option>
            <option value="screen">Screen</option>
            <option value="overlay">Overlay</option>
            <option value="darken">Darken</option>
            <option value="lighten">Lighten</option>
            <option value="color-dodge">Color Dodge</option>
            <option value="color-burn">Color Burn</option>
            <option value="hard-light">Hard Light</option>
            <option value="soft-light">Soft Light</option>
            <option value="difference">Difference</option>
            <option value="exclusion">Exclusion</option>
          </select>
        </div>
      </div>

      {/* Text Shadow Settings */}
      <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-200/50 mb-5">
        <label className="block mb-3 font-semibold text-gray-700">✨ Text Shadow:</label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">X-Offset:</label>
            <input
              type="number"
              value={settings.shadowOffsetX}
              onChange={(e) => updateSetting('shadowOffsetX', parseInt(e.target.value))}
              min="-50"
              max="50"
              className="w-full p-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Y-Offset:</label>
            <input
              type="number"
              value={settings.shadowOffsetY}
              onChange={(e) => updateSetting('shadowOffsetY', parseInt(e.target.value))}
              min="-50"
              max="50"
              className="w-full p-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Blur:</label>
            <input
              type="number"
              value={settings.shadowBlur}
              onChange={(e) => updateSetting('shadowBlur', parseInt(e.target.value))}
              min="0"
              max="50"
              className="w-full p-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Color:</label>
            <input
              type="color"
              value={settings.shadowColor}
              onChange={(e) => updateSetting('shadowColor', e.target.value)}
              className="w-full h-10 border-2 border-gray-200 rounded-xl cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Animation Settings */}
      <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-200/50 mb-5">
        <div className="mb-4">
          <label htmlFor="animation-in" className="block mb-2 font-semibold text-gray-700">
            🎭 Enter Animation:
          </label>
          <select
            id="animation-in"
            value={settings.animationIn}
            onChange={(e) => updateSetting('animationIn', e.target.value)}
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
          >
            <option value="fadeIn">✨ Fade In</option>
            <option value="slideInTop">⬇️ Slide In From Top</option>
            <option value="slideInBottom">⬆️ Slide In From Bottom</option>
            <option value="slideInLeft">➡️ Slide In From Left</option>
            <option value="slideInRight">⬅️ Slide In From Right</option>
            <option value="zoomIn">🔍 Zoom In</option>
            <option value="rotateIn">🔄 Rotate In</option>
            <option value="bounceIn">🏀 Bounce In</option>
          </select>
        </div>

        <div>
          <label htmlFor="animation-out" className="block mb-2 font-semibold text-gray-700">
            🎭 Exit Animation:
          </label>
          <select
            id="animation-out"
            value={settings.animationOut}
            onChange={(e) => updateSetting('animationOut', e.target.value)}
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
          >
            <option value="fadeOut">💫 Fade Out</option>
            <option value="slideOutTop">⬆️ Slide Out To Top</option>
            <option value="slideOutBottom">⬇️ Slide Out To Bottom</option>
            <option value="slideOutLeft">⬅️ Slide Out To Left</option>
            <option value="slideOutRight">➡️ Slide Out To Right</option>
            <option value="zoomOut">🔍 Zoom Out</option>
            <option value="rotateOut">🔄 Rotate Out</option>
            <option value="bounceOut">🏀 Bounce Out</option>
          </select>
        </div>
      </div>

      {/* Background Settings */}
      <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-200/50 mb-5">
        <label className="block mb-3 font-semibold text-gray-700">🖼️ Background Type:</label>
        <div className="space-y-2 mb-4">
          <label className="flex items-center text-black">
            <input
              type="radio"
              name="background-type"
              value="color"
              checked={settings.backgroundType === 'color'}
              onChange={(e) => updateSetting('backgroundType', e.target.value as 'color' | 'gradient' | 'image' | 'transparent')}
              className="mr-2 scale-110 accent-blue-500"
            />
            🎨 Solid Color
          </label>
          <label className="flex items-center text-black">
            <input
              type="radio"
              name="background-type"
              value="gradient"
              checked={settings.backgroundType === 'gradient'}
              onChange={(e) => updateSetting('backgroundType', e.target.value as 'color' | 'gradient' | 'image' | 'transparent')}
              className="mr-2 scale-110 accent-blue-500"
            />
            🌈 Gradient
          </label>
          <label className="flex items-center text-black">
            <input
              type="radio"
              name="background-type"
              value="image"
              checked={settings.backgroundType === 'image'}
              onChange={(e) => updateSetting('backgroundType', e.target.value as 'color' | 'gradient' | 'image' | 'transparent')}
              className="mr-2 scale-110 accent-blue-500"
            />
            🖼️ Custom Image
          </label>
          <label className="flex items-center text-black">
            <input
              type="radio"
              name="background-type"
              value="transparent"
              checked={settings.backgroundType === 'transparent'}
              onChange={(e) => updateSetting('backgroundType', e.target.value as 'color' | 'gradient' | 'image' | 'transparent')}
              className="mr-2 scale-110 accent-blue-500"
            />
            🔍 Transparent
          </label>
        </div>

        {/* Solid Color Controls */}
        {settings.backgroundType === 'color' && (
          <input
            type="color"
            value={settings.backgroundColor}
            onChange={(e) => updateSetting('backgroundColor', e.target.value)}
            className="w-full h-12 border-2 border-gray-200 rounded-xl cursor-pointer"
          />
        )}

        {/* Image Controls */}
        {settings.backgroundType === 'image' && (
          <input
            type="file"
            accept="image/*"
            onChange={(e) => updateSetting('backgroundImage', e.target.files?.[0] || null)}
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
          />
        )}

        {/* Transparent Info */}
        {settings.backgroundType === 'transparent' && (
          <small className="text-gray-600 text-sm block">
            Perfect for overlaying on other videos!
          </small>
        )}
      </div>

      <Button
        onClick={handleGenerateVideo}
        disabled={progressState.isVisible}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      >
        🎬 Generate Video
      </Button>
    </div>
  );
}
