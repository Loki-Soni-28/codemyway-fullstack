// Optional About-page content. Each list is hidden while it is empty, so nothing is shown
// until you fill it with real, verifiable information. Do not add numbers or testimonials
// you cannot back up.
export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  photoUrl?: string;
  linkedinUrl?: string;
}

export interface Testimonial {
  name: string;
  background: string; // e.g. "Operations executive to Data Analyst"
  quote: string;
}

export interface Stat {
  value: string; // e.g. "250+"
  label: string; // e.g. "Learners trained"
}

export const ABOUT_CONFIG: {
  stats: Stat[];
  team: TeamMember[];
  testimonials: Testimonial[];
} = {
  stats: [],
  team: [],
  testimonials: [],
};
