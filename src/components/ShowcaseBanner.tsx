import React from 'react';
import { Sparkles, X } from 'lucide-react';

interface ShowcaseBannerProps {
  isRunning: boolean;
  currentStep: number;
  totalSteps: number;
  stepMessage: string;
  onCancel: () => void;
}

export const ShowcaseBanner: React.FC<ShowcaseBannerProps> = ({
  isRunning,
  currentStep,
  totalSteps,
  stepMessage,
  onCancel,
}) => {
  if (!isRunning) return null;

  const progressPercent = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="bg-white border-b-2 border-emerald-500 px-4 py-2.5 text-xs text-neutral-900 sticky top-16 z-30 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-6 h-6 rounded bg-emerald-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-white animate-spin" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-neutral-900 uppercase tracking-wider text-[11px]">
                Showcase Sequence ({currentStep}/{totalSteps})
              </span>
              <span className="font-mono text-[10px] text-emerald-700 font-bold">
                {progressPercent}% Complete
              </span>
            </div>
            <p className="text-[11px] text-neutral-600 truncate">
              {stepMessage}
            </p>
          </div>
        </div>

        {/* Progress Bar & Cancel */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-28 h-2 bg-neutral-100 rounded-full overflow-hidden border border-neutral-300 hidden sm:block">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <button
            onClick={onCancel}
            className="p-1 rounded text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
            title="Cancel Showcase"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
