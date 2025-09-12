import { InfographicMode } from './hooks/use-infographic-state';

interface ModeToggleProps {
  mode: InfographicMode;
  onModeChange: (mode: InfographicMode) => void;
}

export function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl p-6 mb-6">
      <label className="block text-white font-semibold mb-4 text-lg">
        🎯 Select Creation Mode:
      </label>
      
      <div className="space-y-3">
        <label className="flex items-center p-3 bg-white/10 rounded-xl transition-all hover:bg-white/20 hover:translate-x-1 cursor-pointer">
          <input
            type="radio"
            name="creation-mode"
            value="countdown"
            checked={mode === 'countdown'}
            onChange={(e) => onModeChange(e.target.value as InfographicMode)}
            className="mr-3 scale-125 accent-white"
          />
          <span className="font-medium">⏱️ Countdown Videos</span>
        </label>
        
        <label className="flex items-center p-3 bg-white/10 rounded-xl transition-all hover:bg-white/20 hover:translate-x-1 cursor-pointer">
          <input
            type="radio"
            name="creation-mode"
            value="custom"
            checked={mode === 'custom'}
            onChange={(e) => onModeChange(e.target.value as InfographicMode)}
            className="mr-3 scale-125 accent-white"
          />
          <span className="font-medium">🎨 Custom Infographics</span>
        </label>
      </div>
    </div>
  );
}
