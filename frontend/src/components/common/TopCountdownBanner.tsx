import React from 'react';
import { Flame, ArrowRight, X } from 'lucide-react';
import { useCountdown } from '../../offer';

interface TopCountdownBannerProps {
  percent: number;
  endsAt: string | null;
  onOpenDiscount: () => void;
  onDismiss?: () => void;
}

export const TopCountdownBanner: React.FC<TopCountdownBannerProps> = ({
  percent,
  endsAt,
  onOpenDiscount,
  onDismiss
}) => {
  const timeLeft = useCountdown(endsAt);

  return (
    <div className="w-full bg-gradient-to-r from-[#170F28] via-[#2E1A47] to-[#170F28] border-b border-[#5C4B8A]/60 text-white text-xs py-2 px-3 sm:px-6 relative z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-4 flex-wrap sm:flex-nowrap">

        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#1B102B] border border-[#F1C40F]/50 text-[#F1C40F] font-bold text-[10px] tracking-wide shadow-[0_0_10px_rgba(241,196,15,0.25)]">
            <Flame className="w-3 h-3 text-[#F1C40F] animate-pulse" />
            <span>EARLY-BIRD OFFER</span>
          </span>

          <span className="font-semibold text-white text-xs">
            {percent}% off the Data Analyst + GenAI batch{timeLeft ? '. Closes in:' : ''}
          </span>

          {timeLeft && (
            <div className="flex items-center gap-1 font-mono font-bold text-xs">
              {[
                [timeLeft.days, 'd'],
                [timeLeft.hours, 'h'],
                [timeLeft.minutes, 'm'],
                [timeLeft.seconds, 's'],
              ].map(([value, unit], i) => (
                <React.Fragment key={unit}>
                  {i > 0 && <span className="text-[#9B59B6] font-bold">:</span>}
                  <div className="bg-[#0C0717] px-1.5 py-0.5 rounded border border-[#5C4B8A]/60 text-white min-w-[28px] text-center">
                    {String(value).padStart(2, '0')}{unit}
                  </div>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 ml-auto sm:ml-0">
          <button
            onClick={onOpenDiscount}
            className="px-3 py-1 bg-[#F1C40F] hover:bg-[#F39C12] text-[#08070B] font-bold text-[11px] rounded-lg shadow-[0_0_15px_rgba(241,196,15,0.35)] hover:shadow-[0_0_20px_rgba(241,196,15,0.5)] transition-all flex items-center gap-1 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Claim {percent}% OFF</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          {onDismiss && (
            <button
              onClick={onDismiss}
              className="p-1 text-[#A7A0B5] hover:text-white rounded hover:bg-[#1F1433] transition-colors cursor-pointer"
              title="Hide banner"
              aria-label="Dismiss banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
