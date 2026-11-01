import React from 'react';

interface HeroBackgroundProps {
  imageSrc: string;
  className?: string;
}

export const LiquidHeroBackground: React.FC<HeroBackgroundProps> = ({
  imageSrc,
  className = '',
}) => {
  return (
    <div className={`absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none ${className}`}>
      {/* Full-Screen Hero Background Image: Clearly visible across the whole screen */}
      <img
        src={imageSrc}
        alt="CodeMyWay Collaborative Learning Lab"
        className="w-full h-full object-cover object-center transform scale-100 transition-all duration-500"
        style={{
          filter: 'brightness(0.65) contrast(1.15)',
        }}
      />

      {/* Subtle, slim side edge blur & fade (gentle blur on the outer sides) */}
      <div className="absolute inset-y-0 left-0 w-12 sm:w-28 bg-gradient-to-r from-[#08070B] via-[#08070B]/60 to-transparent backdrop-blur-[3px] pointer-events-none z-10" />
      <div className="absolute inset-y-0 right-0 w-12 sm:w-28 bg-gradient-to-l from-[#08070B] via-[#08070B]/60 to-transparent backdrop-blur-[3px] pointer-events-none z-10" />

      {/* Top Ambient Fade for Header blend */}
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#08070B] via-[#08070B]/50 to-transparent pointer-events-none z-10" />

      {/* Bottom Gradient Merge into Page Sections */}
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#08070B] via-[#08070B]/80 to-transparent pointer-events-none z-10" />

      {/* Ambient dark violet mood layer to preserve site palette */}
      <div className="absolute inset-0 bg-[#120A1F]/25 pointer-events-none z-10" />
    </div>
  );
};
