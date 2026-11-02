import React from 'react';
import { COMPANY_STRIP } from '../../siteConfig';

// Slow, endlessly scrolling row of company names. Pauses on hover; the row is static and
// wraps for visitors who prefer reduced motion (see .marquee-track in index.css).
export const CompanyMarquee: React.FC = () => {
  const { heading, names } = COMPANY_STRIP;
  if (names.length === 0) return null;

  // Repeat enough times that one half of the track is always wider than the screen.
  const row = Array.from({ length: 4 }, () => names).flat();

  return (
    <section aria-label={heading} className="w-full overflow-hidden py-6">
      <h2 className="text-center text-3xl sm:text-5xl font-extrabold font-['Sora'] tracking-tight text-white mb-8 px-4">
        {heading}
      </h2>
      <div className="marquee relative">
        <div className="marquee-track flex w-max items-center gap-20 sm:gap-32">
          {[...row, ...row].map((name, index) => (
            <span
              key={`${name}-${index}`}
              aria-hidden={index >= row.length}
              className="text-4xl sm:text-6xl font-bold font-['Sora'] tracking-tight text-[#D1CADB]/45 hover:text-[#D1CADB]/85 transition-colors whitespace-nowrap select-none"
            >
              {name}
            </span>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#08070B] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#08070B] to-transparent" />
      </div>
    </section>
  );
};
