// ─────────────────────────────────────────────────
// PERSONAL DETAILS — TYPE DEFINITIONS
// ─────────────────────────────────────────────────

export type VerificationStatus = 'verified' | 'unverified' | 'pending';

export type CurrentStatus = 
  | 'Student'
  | 'Fresher'
  | 'Working Professional';

export type TargetRole =
  | 'Data Analyst'
  | 'Business Analyst'
  | 'Product Analyst'
  | 'Data Scientist'
  | 'Marketing Analyst'
  | 'Financial Analyst'
  | 'Operations Analyst'
  | 'Other';

export type PreferredDomain =
  | 'E-Commerce / Retail'
  | 'FinTech / Banking'
  | 'Healthcare / Life Sciences'
  | 'Consulting / Advisory'
  | 'Product & SaaS'
  | 'Media & Entertainment'
  | 'Supply Chain & Logistics'
  | 'Open to All';

export interface BasicInfo {
  fullName: string;
  email: string;               // pre-filled from auth; read-only email field
  mobile: string;
  emailVerified: VerificationStatus;
  mobileVerified: VerificationStatus;
  profilePhotoUrl: string;     // data-URI stored in localStorage; real app: cloud CDN
  profilePhotoName: string;
}

export interface EducationDetails {
  collegeName: string;
  degree: string;
  specialization: string;
  graduationYear: string;
  currentAcademicYear: string;
  cgpa: string;                // optional
}

export interface ProfessionalDetails {
  currentStatus: CurrentStatus | '';
  workExperience: string;      // optional — e.g. "1 year 6 months at XYZ Corp"
  linkedInUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  resumeFileName: string;      // original filename
  resumeDataUri: string;       // base-64 encoded; real app: secure S3 pre-signed URL
  resumeUploadedAt: string;
}

export interface CareerPreferences {
  targetRole: TargetRole | '';
  preferredDomain: PreferredDomain | '';
  preferredLocation: string;
  careerGoal: string;
}

export interface StudentPersonalProfile {
  email: string;                   // primary key tied to auth
  lastUpdatedAt: string;           // ISO timestamp
  basic: BasicInfo;
  education: EducationDetails;
  professional: ProfessionalDetails;
  career: CareerPreferences;
}

// ─────────────────────────────────────────────────
// PROFILE COMPLETION SCORE CALCULATION
// Only required fields count toward completion.
// Optional fields (cgpa, workExperience, portfolioUrl, resume) do NOT count.
// ─────────────────────────────────────────────────
export interface CompletionField {
  label: string;
  section: 'Basic' | 'Education' | 'Professional' | 'Career';
  filled: boolean;
}

export const computeCompletionFields = (profile: StudentPersonalProfile): CompletionField[] => {
  const { basic, education, professional, career } = profile;

  return [
    // Basic — required
    { label: 'Full Name',         section: 'Basic',        filled: basic.fullName.trim().length > 0 },
    { label: 'Mobile Number',     section: 'Basic',        filled: basic.mobile.trim().length > 0 },
    { label: 'Profile Photo',     section: 'Basic',        filled: basic.profilePhotoUrl.length > 0 },
    // Education — required
    { label: 'College / University', section: 'Education', filled: education.collegeName.trim().length > 0 },
    { label: 'Degree',            section: 'Education',    filled: education.degree.trim().length > 0 },
    { label: 'Specialization',    section: 'Education',    filled: education.specialization.trim().length > 0 },
    { label: 'Graduation Year',   section: 'Education',    filled: education.graduationYear.trim().length > 0 },
    // Professional — required
    { label: 'Current Status',    section: 'Professional', filled: professional.currentStatus.length > 0 },
    { label: 'LinkedIn Profile',  section: 'Professional', filled: professional.linkedInUrl.trim().length > 0 },
    { label: 'GitHub Profile',    section: 'Professional', filled: professional.githubUrl.trim().length > 0 },
    // Career — required
    { label: 'Target Role',       section: 'Career',       filled: career.targetRole.length > 0 },
    { label: 'Preferred Domain',  section: 'Career',       filled: career.preferredDomain.length > 0 },
    { label: 'Preferred Location',section: 'Career',       filled: career.preferredLocation.trim().length > 0 },
    { label: 'Career Goal',       section: 'Career',       filled: career.careerGoal.trim().length > 0 },
  ];
};

export const computeCompletionPercent = (profile: StudentPersonalProfile): number => {
  const fields = computeCompletionFields(profile);
  const filled = fields.filter(f => f.filled).length;
  return Math.round((filled / fields.length) * 100);
};
