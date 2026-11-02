import React from 'react';
import { ArrowRight } from 'lucide-react';
import { COMPANY_STRIP } from '../../siteConfig';
import amazonLogo from '../../assets/logos/amazon.png';
import sapLogo from '../../assets/logos/sap.png';
import ltiMindtreeLogo from '../../assets/logos/ltimindtree.png';
import cognizantLogo from '../../assets/logos/cognizant.png';
import googleLogo from '../../assets/logos/google.png';
import tcsLogo from '../../assets/logos/tcs.png';
import visaLogo from '../../assets/logos/visa.png';
import tredenceLogo from '../../assets/logos/tredence.png';
import symphonyTalentLogo from '../../assets/logos/symphony-talent.png';
import mphasisLogo from '../../assets/logos/mphasis.png';
import tigerAnalyticsLogo from '../../assets/logos/tiger-analytics.png';

// Approximate brand colours so each name reads as a distinct mark on the dark background.
// Unknown names fall back to the site purple. Swap in real logo files here if you have them.
const BRAND_COLOR: Record<string, string> = {
  Amazon: '#FF9900',
  Google: '#4285F4',
  'Symphony Talent': '#C084FC',
  Tredence: '#2DD4BF',
  Cognizant: '#2E8BFF',
  TCS: '#F0568C',
  SAP: '#1CB5FF',
  Visa: '#6B8BFF',
  LTIMindtree: '#1E4FA3',
  Mphasis: '#3B82F6',
  'Tiger Analytics': '#FF8A2A',
};
const FALLBACK_COLOR = '#C084FC';

// Real logo files, keyed by company name. Add more here as you get them.
const LOGO: Record<string, string> = {
  Amazon: amazonLogo,
  Google: googleLogo,
  SAP: sapLogo,
  Visa: visaLogo,
  TCS: tcsLogo,
  Cognizant: cognizantLogo,
  Tredence: tredenceLogo,
  LTIMindtree: ltiMindtreeLogo,
  'Symphony Talent': symphonyTalentLogo,
  Mphasis: mphasisLogo,
  'Tiger Analytics': tigerAnalyticsLogo,
};

// Slow, endlessly scrolling row of company marks. Pauses on hover; the row is static and
// wraps for visitors who prefer reduced motion (see .marquee-track in index.css).
interface CompanyMarqueeProps {
  onMeetMentors?: () => void;
}

export const CompanyMarquee: React.FC<CompanyMarqueeProps> = ({ onMeetMentors }) => {
  const { kicker, heading, subheading, disclaimer, names } = COMPANY_STRIP;
  if (names.length === 0) return null;

  // Repeat enough times that one half of the track is always wider than the screen.
  const row = Array.from({ length: 2 }, () => names).flat();

  return (
    <section aria-label={heading} className="w-full overflow-hidden py-6">
      <div className="text-center max-w-2xl mx-auto mb-8 px-4">
        <span className="text-xs font-semibold text-[#C084FC] uppercase tracking-widest">{kicker}</span>
        <h2 className="mt-2 text-2xl sm:text-4xl font-extrabold font-['Sora'] tracking-tight text-white">{heading}</h2>
        <p className="mt-3 text-sm sm:text-base text-[#D1CADB] leading-relaxed">{subheading}</p>
      </div>
      <div className="marquee relative">
        <div className="marquee-track flex w-max items-center gap-10 sm:gap-14">
          {[...row, ...row].map((name, index) => {
            const color = BRAND_COLOR[name] ?? FALLBACK_COLOR;
            const logo = LOGO[name];
            // Logos are transparent PNGs (dark marks lightened) so they sit directly on the dark page.
            if (logo) {
              return (
                <div
                  key={`${name}-${index}`}
                  aria-hidden={index >= row.length}
                  className="flex items-center justify-center h-16 px-2 select-none shrink-0 opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-300"
                >
                  <img src={logo} alt={name} className="h-9 sm:h-11 w-auto max-w-[200px] object-contain" draggable={false} />
                </div>
              );
            }
            return (
              <div
                key={`${name}-${index}`}
                aria-hidden={index >= row.length}
                className="group flex items-center gap-3 px-5 py-3 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] transition-colors select-none whitespace-nowrap"
              >
                <span
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-base font-extrabold font-['Sora'] shrink-0"
                  style={{ backgroundColor: `${color}26`, color }}
                >
                  {name.charAt(0)}
                </span>
                <span
                  className="text-xl sm:text-2xl font-bold font-['Sora'] tracking-tight opacity-80 group-hover:opacity-100 transition-opacity"
                  style={{ color }}
                >
                  {name}
                </span>
              </div>
            );
          })}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#08070B] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#08070B] to-transparent" />
      </div>

      <div className="mt-8 px-4 text-center">
        <p className="text-[11px] text-[#A7A0B5] max-w-xl mx-auto">{disclaimer}</p>
        {onMeetMentors && (
          <button
            onClick={onMeetMentors}
            className="mt-5 px-7 py-3 text-sm font-bold text-[#08070B] bg-[#F5C518] hover:bg-[#F1C40F] rounded-xl transition-all inline-flex items-center gap-2 cursor-pointer hover:scale-[1.03] active:scale-[0.98]"
          >
            <span>Meet Our Mentors</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </section>
  );
};
