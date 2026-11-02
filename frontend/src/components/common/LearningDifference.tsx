import React from 'react';
import { BookOpen, CheckCircle2, GraduationCap, Globe, Minus } from 'lucide-react';

// Each row compares one part of the learning experience across three formats. Keep the
// CodeMyWay column in line with the published program details, and keep the other two
// general (they describe formats, not specific companies).
const ROWS = [
  {
    area: 'Teaching',
    codemyway: 'Live, interactive sessions',
    online: 'Live or hybrid, often in large batches',
    offline: 'In-person classes or pre-recorded lessons',
  },
  {
    area: 'Mentorship',
    codemyway: 'Personalized 1:1 mentor guidance',
    online: 'Varies; often one general instructor or a paid add-on',
    offline: 'Limited, or none after class',
  },
  {
    area: 'Practice',
    codemyway: 'Guided labs and assignments',
    online: 'Varies by platform',
    offline: 'Mostly independent practice',
  },
  {
    area: 'Projects',
    codemyway: 'Realistic business case studies',
    online: 'Often predefined exercises',
    offline: 'Often predefined exercises',
  },
  {
    area: 'Feedback',
    codemyway: 'Individual project reviews',
    online: 'Varies by program',
    offline: 'Limited, when available',
  },
  {
    area: 'Career prep',
    codemyway: 'Interview and portfolio guidance',
    online: 'Varies; may cost extra',
    offline: 'May require additional support',
  },
];

const mutedCardCls = 'rounded-2xl bg-[#14101D] border border-[#3A3150]/70 p-5 sm:p-6';

export const LearningDifference: React.FC = () => (
  <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8" aria-labelledby="learning-difference-title">
    <div className="text-center max-w-2xl mx-auto mb-8">
      <span className="text-xs font-semibold text-[#9B59B6] uppercase tracking-wider">The CodeMyWay Advantage</span>
      <h2 id="learning-difference-title" className="text-3xl sm:text-4xl font-extrabold text-white mt-1 font-['Sora']">
        What Makes the CodeMyWay Experience Different?
      </h2>
      <p className="text-sm text-[#D1CADB] mt-2">
        Discover a learning experience built around live instruction, personalized mentorship, practical guidance, and career-focused support.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* CodeMyWay (first on phones, highlighted everywhere) */}
      <div className="rounded-2xl bg-gradient-to-b from-[#2A1740] to-[#1D1030] border border-[#5C4B8A]/60 p-5 sm:p-6">
        <GraduationCap className="w-7 h-7 text-[#F1C40F] mb-3" />
        <h3 className="text-lg font-semibold text-[#F1C40F] font-['Sora'] mb-4">CodeMyWay</h3>
        <ul className="space-y-3.5">
          {ROWS.map((row) => (
            <li key={row.area} className="flex items-start gap-3 text-sm text-white md:min-h-[3.75rem]">
              <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-emerald-400" />
              <span>
                <span className="block text-[11px] uppercase tracking-wider text-[#C9A8E3]">{row.area}</span>
                {row.codemyway}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Other online platforms */}
      <div className={mutedCardCls}>
        <Globe className="w-7 h-7 text-[#A7A0B5] mb-3" />
        <h3 className="text-lg font-semibold text-[#D1CADB] font-['Sora'] mb-4">Other Online Platforms</h3>
        <ul className="space-y-3.5">
          {ROWS.map((row) => (
            <li key={row.area} className="flex items-start gap-3 text-sm text-[#A7A0B5] md:min-h-[3.75rem]">
              <Minus className="w-4 h-4 mt-0.5 shrink-0 text-[#6D6483]" />
              <span>
                <span className="block text-[11px] uppercase tracking-wider text-[#6D6483]">{row.area}</span>
                {row.online}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Offline / recorded */}
      <div className={mutedCardCls}>
        <BookOpen className="w-7 h-7 text-[#A7A0B5] mb-3" />
        <h3 className="text-lg font-semibold text-[#D1CADB] font-['Sora'] mb-4">Offline / Recorded Courses</h3>
        <ul className="space-y-3.5">
          {ROWS.map((row) => (
            <li key={row.area} className="flex items-start gap-3 text-sm text-[#A7A0B5] md:min-h-[3.75rem]">
              <Minus className="w-4 h-4 mt-0.5 shrink-0 text-[#6D6483]" />
              <span>
                <span className="block text-[11px] uppercase tracking-wider text-[#6D6483]">{row.area}</span>
                {row.offline}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>

    <p className="text-[11px] text-[#A7A0B5] mt-4 text-center">
      Learning formats vary by provider. This is a general comparison of approaches, not a claim about any specific company.
    </p>
  </section>
);
