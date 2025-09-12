'use client';

import { CustomSettings } from './hooks/use-infographic-state';
import { getTemplateByName, TemplateOrientation } from './templates';

interface CustomAnimationControlsProps {
  settings: CustomSettings;
  onSettingsChange: (settings: CustomSettings) => void;
}

export function CustomAnimationControls({ settings, onSettingsChange }: CustomAnimationControlsProps) {
  const updateSettings = (updates: Partial<CustomSettings>) => {
    onSettingsChange({ ...settings, ...updates });
  };

  const loadTemplate = (templateName: string) => {
    const templateCode = getTemplateByName(templateName, settings.orientation);
    updateSettings({ unifiedCode: templateCode });
  };

  return (
    <div className="space-y-6">
      {/* Orientation Control */}
      <div className="bg-white/95 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/20">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">📐 Orientation</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => updateSettings({ orientation: 'horizontal' })}
            className={`p-3 rounded-lg font-medium transition-all ${
              settings.orientation === 'horizontal'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📺 Horizontal
          </button>
          <button
            onClick={() => updateSettings({ orientation: 'vertical' })}
            className={`p-3 rounded-lg font-medium transition-all ${
              settings.orientation === 'vertical'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📱 Vertical
          </button>
        </div>
      </div>

      {/* Animation Templates */}
      <div className="bg-white/95 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/20">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">🎨 Animation Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => loadTemplate('climbing')}
            className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg"
          >
            <div className="text-2xl mb-2">🧗</div>
            <div className="font-medium">Climbing Progress</div>
            <div className="text-sm opacity-90">Mountain climbing animation</div>
          </button>
          
          <button
            onClick={() => loadTemplate('morphing')}
            className="p-4 bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg"
          >
            <div className="text-2xl mb-2">🔄</div>
            <div className="font-medium">Shape Morphing</div>
            <div className="text-sm opacity-90">Dynamic shape transformation</div>
          </button>
          
          <button
            onClick={() => loadTemplate('energy')}
            className="p-4 bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg"
          >
            <div className="text-2xl mb-2">⚡</div>
            <div className="font-medium">Energy Core</div>
            <div className="text-sm opacity-90">Pulsing energy effects</div>
          </button>
        </div>
      </div>

      {/* Animation Duration */}
      <div className="bg-white/95 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/20">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">⏱️ Animation Duration</h3>
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-600">Duration (seconds):</label>
          <input
            type="range"
            min="1"
            max="30"
            value={settings.animationDuration}
            onChange={(e) => updateSettings({ animationDuration: parseInt(e.target.value) })}
            className="flex-1"
          />
          <span className="text-sm font-medium text-gray-700 w-12">{settings.animationDuration}s</span>
        </div>
      </div>

      {/* Custom Code Editor */}
      <div className="bg-white/95 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/20">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">💻 Custom HTML/CSS/JS Code</h3>
        <textarea
          value={settings.unifiedCode}
          onChange={(e) => updateSettings({ unifiedCode: e.target.value })}
          className="w-full h-64 p-4 border border-gray-300 rounded-lg font-mono text-sm resize-none"
          placeholder="Enter your custom HTML, CSS, and JavaScript code here..."
        />
        <div className="mt-3 text-sm text-gray-600">
          💡 <strong>Tip:</strong> Use complete HTML documents with embedded CSS and JavaScript for best results.
        </div>
      </div>
    </div>
  );
}
