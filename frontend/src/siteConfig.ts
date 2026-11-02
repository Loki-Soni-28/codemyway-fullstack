// Site-wide content you maintain by hand. Confirm everything here is accurate before going live.

// Scrolling company-name strip (home and About pages). Names with a logo file in
// CompanyMarquee.tsx show the logo; the rest show a coloured name badge. The heading says your mentors and teachers come from these companies, so every name
// must be one where a current or former mentor/teacher really worked, and you should be
// comfortable naming them. Set `names` to [] to hide the strip.
export const COMPANY_STRIP = {
  kicker: 'Real industry experience',
  heading: "Learn from Professionals Who've Worked in the Industry.",
  subheading: 'Gain practical insights from mentors with professional experience across leading technology, consulting, and analytics organizations.',
  disclaimer: 'Organizations where our mentors have gained professional experience. Company names do not imply official partnerships or endorsements.',
  names: [
    'Amazon',
    'Google',
    'Symphony Talent',
    'Tredence',
    'Cognizant',
    'TCS',
    'SAP',
    'Visa',
    'LTIMindtree',
    'Mphasis',
    'Tiger Analytics',
  ],
};

// Footer social links. An icon appears only when its URL is filled in.
export const SOCIAL_LINKS = {
  instagram: '',
  linkedin: '',
  youtube: '',
  x: '',
};

// Mentor cards for the scrolling "Learn from practitioners" row on the home page. The row
// stays hidden until you add real people. Use only mentors who have agreed to be listed,
// and years/roles you can verify. photoUrl is optional (initials are shown without it).
export interface MentorCard {
  name: string;
  company: string;
  role: string;
  years: string; // e.g. "6+ years"
  photoUrl?: string;
  sample?: boolean; // true = placeholder shown only for previewing the layout
}

// PLACEHOLDERS: replace every entry below with a real mentor (and remove `sample: true`)
// before going live. While any entry is a sample, the section shows a "sample data" notice.
export const MENTORS_SECTION = {
  heading: 'Meet our mentors',
  mentors: [
    { name: 'Sample Mentor One', company: 'Company Name', role: 'Analytics Lead', years: '10+ years', sample: true },
    { name: 'Sample Mentor Two', company: 'Company Name', role: 'Senior Business Analyst', years: '6+ years', sample: true },
    { name: 'Sample Mentor Three', company: 'Company Name', role: 'Data Scientist', years: '7+ years', sample: true },
    { name: 'Sample Mentor Four', company: 'Company Name', role: 'Data Engineer', years: '8+ years', sample: true },
    { name: 'Sample Mentor Five', company: 'Company Name', role: 'BI Developer', years: '5+ years', sample: true },
    { name: 'Sample Mentor Six', company: 'Company Name', role: 'ML Engineer', years: '9+ years', sample: true },
  ] as MentorCard[],
};
