import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, User } from 'lucide-react';
import { MENTORS_SECTION } from '../../siteConfig';

// Horizontally scrolling mentor cards with prev/next arrows. Renders nothing until
// MENTORS_SECTION.mentors is filled in (see siteConfig.ts).
export const MentorCarousel: React.FC = () => {
  const { heading, mentors } = MENTORS_SECTION;
  const track = useRef<HTMLDivElement>(null);
  if (mentors.length === 0) return null;

  const scrollByCard = (direction: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    el.scrollBy({ left: direction * Math.max(el.clientWidth * 0.8, 300), behavior: 'smooth' });
  };

  return (
    <section id="mentors" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24" aria-label={heading}>
      <div className="flex items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold font-['Sora'] text-white">{heading}</h2>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => scrollByCard(-1)}
            aria-label="Previous mentors"
            className="w-10 h-10 rounded-full border border-[#5C4B8A]/60 bg-[#170F28] text-white hover:bg-[#2E1A47] flex items-center justify-center cursor-pointer transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scrollByCard(1)}
            aria-label="Next mentors"
            className="w-10 h-10 rounded-full border border-[#5C4B8A]/60 bg-[#170F28] text-white hover:bg-[#2E1A47] flex items-center justify-center cursor-pointer transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {mentors.some((mentor) => mentor.sample) && (
        <p className="mb-3 text-[11px] text-amber-300 bg-amber-950/40 border border-amber-700/40 rounded-lg px-3 py-1.5 w-fit">
          Preview with sample data. Replace these in siteConfig.ts before going live.
        </p>
      )}

      <div
        ref={track}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {mentors.map((mentor) => (
          <article
            key={mentor.name}
            className="snap-start shrink-0 w-[85%] sm:w-[420px] flex gap-4 p-3 rounded-2xl bg-[#170F28] border border-[#5C4B8A]/50"
          >
            {mentor.photoUrl ? (
              <img
                src={mentor.photoUrl}
                alt={mentor.name}
                loading="lazy"
                className="w-24 h-36 sm:w-36 sm:h-44 rounded-xl object-cover shrink-0 bg-[#2E1A47]"
              />
            ) : (
              <div className="w-24 h-36 sm:w-36 sm:h-44 rounded-xl shrink-0 bg-gradient-to-br from-[#3B225C] to-[#1C0E33] flex items-end justify-center overflow-hidden">
                <User className="w-20 h-20 sm:w-24 sm:h-24 text-[#9B59B6]/70 -mb-3" strokeWidth={1.25} />
              </div>
            )}
            <div className="flex flex-col justify-between py-1 min-w-0">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-white font-['Sora'] break-words">{mentor.name}</h3>
                <div className="text-sm font-bold text-[#9B59B6] mt-1">{mentor.company}</div>
              </div>
              <div className="border-t border-[#5C4B8A]/40 pt-3">
                <div className="text-sm text-white">{mentor.role}</div>
                <div className="text-xs text-[#A7A0B5] mt-1">{mentor.years}</div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
