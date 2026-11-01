import React, { useState, useEffect } from 'react';
import { Flame, ArrowRight, X, Clock, Copy, Check } from 'lucide-react';

interface TopCountdownBannerProps {
  onOpenDiscount: () => void;
  onDismiss?: () => void;
}

/**
 * Returns a 24-hour target timestamp for today.
 * If this is a new visitor, a new day, or the previous timer has expired,
 * it automatically initializes a fresh 24-hour countdown for today.
 */
export const getOrInitDailyCountdown = (): number => {
  try {
    const todayStr = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
    const storedDate = localStorage.getItem('codemyway_countdown_date');
    const storedEnd = localStorage.getItem('codemyway_top_countdown_end');
    const now = Date.now();

    if (storedDate === todayStr && storedEnd) {
      const parsed = parseInt(storedEnd, 10);
      if (parsed > now) {
        return parsed;
      }
    }

    // New visitor, first time today, or expired timer: start fresh 24h countdown for today
    const newTarget = now + 24 * 60 * 60 * 1000;
    localStorage.setItem('codemyway_countdown_date', todayStr);
    localStorage.setItem('codemyway_top_countdown_end', newTarget.toString());
    return newTarget;
  } catch {
    return Date.now() + 24 * 60 * 60 * 1000;
  }
};

export const TopCountdownBanner: React.FC<TopCountdownBannerProps> = ({
  onOpenDiscount,
  onDismiss
}) => {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 23,
    minutes: 59,
    seconds: 59
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let targetTime = getOrInitDailyCountdown();

    const updateTimer = () => {
      const now = Date.now();
      let diff = targetTime - now;

      // Automatically renew countdown if it reaches 0 during a live session
      if (diff <= 0) {
        targetTime = getOrInitDailyCountdown();
        diff = Math.max(0, targetTime - now);
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText('BATCH30');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full bg-gradient-to-r from-[#170F28] via-[#2E1A47] to-[#170F28] border-b border-[#9B59B6]/50 shadow-[0_4px_20px_rgba(155,89,182,0.3)] text-white text-xs py-2 px-3 sm:px-6 relative z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-4 flex-wrap sm:flex-nowrap">
        
        {/* Left / Center Timer Content */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#1B102B] border border-[#F1C40F]/50 text-[#F1C40F] font-bold text-[10px] tracking-wide shadow-[0_0_10px_rgba(241,196,15,0.25)]">
            <Flame className="w-3 h-3 text-[#F1C40F] animate-pulse" />
            <span>1-DAY FLASH OFFER</span>
          </span>

          <span className="font-semibold text-white text-xs hidden sm:inline">
            30% Early Bird Scholarship Closes In:
          </span>
          <span className="font-semibold text-white text-xs sm:hidden">
            30% OFF Closes In:
          </span>

          {/* 1-Day Live Countdown Digits */}
          <div className="flex items-center gap-1 font-mono font-bold text-xs">
            <div className="bg-[#0C0717] px-1.5 py-0.5 rounded border border-[#9B59B6]/60 text-white min-w-[28px] text-center shadow-[0_0_10px_rgba(155,89,182,0.25)]">
              {String(timeLeft.hours).padStart(2, '0')}h
            </div>
            <span className="text-[#9B59B6] font-bold">:</span>
            <div className="bg-[#0C0717] px-1.5 py-0.5 rounded border border-[#9B59B6]/60 text-white min-w-[28px] text-center shadow-[0_0_10px_rgba(155,89,182,0.25)]">
              {String(timeLeft.minutes).padStart(2, '0')}m
            </div>
            <span className="text-[#9B59B6] font-bold">:</span>
            <div className="bg-[#0C0717] px-1.5 py-0.5 rounded border border-[#9B59B6]/60 text-[#F1C40F] min-w-[28px] text-center shadow-[0_0_12px_rgba(241,196,15,0.35)] animate-pulse">
              {String(timeLeft.seconds).padStart(2, '0')}s
            </div>
          </div>

          {/* Quick Copy Promo Code */}
          <button
            onClick={handleCopyCode}
            className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-[#0C0717]/90 hover:bg-[#1B102B] border border-[#5C4B8A]/70 text-[11px] font-mono text-[#D1CADB] cursor-pointer transition-colors"
            title="Click to copy promo code"
          >
            <span>Code: <strong className="text-[#F1C40F]">BATCH30</strong></span>
            {copied ? <Check className="w-3 h-3 text-[#2ECC71]" /> : <Copy className="w-3 h-3 text-[#A7A0B5]" />}
          </button>
        </div>

        {/* Right Action & Dismiss */}
        <div className="flex items-center gap-2 ml-auto sm:ml-0">
          <button
            onClick={onOpenDiscount}
            className="px-3 py-1 bg-[#F1C40F] hover:bg-[#F39C12] text-[#08070B] font-bold text-[11px] rounded-lg shadow-[0_0_15px_rgba(241,196,15,0.35)] hover:shadow-[0_0_20px_rgba(241,196,15,0.5)] transition-all flex items-center gap-1 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Claim 30% OFF</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          {onDismiss && (
            <button
              onClick={onDismiss}
              className="p-1 text-[#A7A0B5] hover:text-white rounded hover:bg-[#1F1433] transition-colors cursor-pointer"
              title="Hide countdown banner"
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
