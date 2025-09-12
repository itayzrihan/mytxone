import { ProgressState } from './hooks/use-infographic-state';

interface ProgressIndicatorProps {
  progressState: ProgressState;
}

export function ProgressIndicator({ progressState }: ProgressIndicatorProps) {
  if (!progressState.isVisible) return null;

  const percentage = (progressState.current / progressState.total) * 100;

  return (
    <>
      {/* Progress Container */}
      <div className="w-full bg-white/30 rounded-xl overflow-hidden my-4">
        <div 
          className="h-2 bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 rounded-xl"
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {/* Progress Text */}
      <div className="text-center text-gray-700 font-medium">
        {progressState.message} ({progressState.current}/{progressState.total})
      </div>
    </>
  );
}
