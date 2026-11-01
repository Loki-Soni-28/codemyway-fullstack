import { StudentPersonalProfile } from './types';

const STORAGE_KEY = (email: string) =>
  `codemyway_student_profile_${email.toLowerCase().trim()}`;

// ─────────────────────────────────────────────────
// BUILD A BLANK PROFILE SKELETON FOR A NEW STUDENT
// ─────────────────────────────────────────────────
export const buildEmptyProfile = (
  email: string,
  fullName: string = '',
  mobile: string = ''
): StudentPersonalProfile => ({
  email,
  lastUpdatedAt: '',
  basic: {
    fullName,
    email,
    mobile,
    emailVerified: 'verified',   // email is verified at login
    mobileVerified: 'unverified',
    profilePhotoUrl: '',
    profilePhotoName: '',
  },
  education: {
    collegeName: '',
    degree: '',
    specialization: '',
    graduationYear: '',
    currentAcademicYear: '',
    cgpa: '',
  },
  professional: {
    currentStatus: '',
    workExperience: '',
    linkedInUrl: '',
    githubUrl: '',
    portfolioUrl: '',
    resumeFileName: '',
    resumeDataUri: '',
    resumeUploadedAt: '',
  },
  career: {
    targetRole: '',
    preferredDomain: '',
    preferredLocation: '',
    careerGoal: '',
  },
});

// ─────────────────────────────────────────────────
// LOAD — returns stored profile or fresh skeleton
// ─────────────────────────────────────────────────
export const loadProfile = (
  email: string,
  fallbackName: string = '',
  fallbackMobile: string = ''
): StudentPersonalProfile => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY(email));
    if (raw) {
      const parsed: StudentPersonalProfile = JSON.parse(raw);
      // Back-fill any missing top-level keys added in later versions
      return {
        ...buildEmptyProfile(email, fallbackName, fallbackMobile),
        ...parsed,
        basic: {
          ...buildEmptyProfile(email, fallbackName, fallbackMobile).basic,
          ...parsed.basic,
          email, // always reflect current auth email
        },
      };
    }
  } catch {
    /* ignore parse errors — return clean skeleton */
  }
  return buildEmptyProfile(email, fallbackName, fallbackMobile);
};

// ─────────────────────────────────────────────────
// SAVE — persist updated profile; returns saved copy
// ─────────────────────────────────────────────────
export const saveProfile = (profile: StudentPersonalProfile): StudentPersonalProfile => {
  const toSave: StudentPersonalProfile = {
    ...profile,
    lastUpdatedAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(STORAGE_KEY(profile.email), JSON.stringify(toSave));
  } catch (err) {
    console.error('[PersonalDetails] Failed to persist profile:', err);
    throw new Error('Could not save profile. Storage may be full.');
  }
  return toSave;
};

// ─────────────────────────────────────────────────
// URL VALIDATION HELPERS
// ─────────────────────────────────────────────────
export const isValidUrl = (url: string): boolean => {
  if (!url.trim()) return true; // empty = optional field, skip
  try {
    const u = new URL(url);
    return u.protocol === 'https:' || u.protocol === 'http:';
  } catch {
    return false;
  }
};

export const isValidLinkedIn = (url: string): boolean => {
  if (!url.trim()) return true;
  return isValidUrl(url) && url.includes('linkedin.com');
};

export const isValidGitHub = (url: string): boolean => {
  if (!url.trim()) return true;
  return isValidUrl(url) && url.includes('github.com');
};

// ─────────────────────────────────────────────────
// RESUME VALIDATION
// ─────────────────────────────────────────────────
export const MAX_RESUME_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export const validateResume = (file: File): string | null => {
  if (file.type !== 'application/pdf') {
    return 'Only PDF files are accepted for resume uploads.';
  }
  if (file.size > MAX_RESUME_SIZE_BYTES) {
    return `Resume file size must not exceed 5 MB (uploaded: ${(file.size / (1024 * 1024)).toFixed(1)} MB).`;
  }
  return null;
};

// ─────────────────────────────────────────────────
// READ FILE AS DATA-URI (base64) — for localStorage storage
// Real app: replace with pre-signed S3 upload endpoint
// ─────────────────────────────────────────────────
export const readFileAsDataUri = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsDataURL(file);
  });

// ─────────────────────────────────────────────────
// FORMAT LAST-UPDATED TIMESTAMP FOR DISPLAY
// ─────────────────────────────────────────────────
export const formatLastUpdated = (isoString: string): string => {
  if (!isoString) return 'Never saved';
  try {
    return new Date(isoString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
};
