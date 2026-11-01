import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  Target,
  Camera,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  Upload,
  FileText,
  Download,
  X,
  Save,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Globe,
  MapPin,
  ChevronDown,
  Info,
  Linkedin,
  Github,
  AlertTriangle,
  Check,
  BookOpen,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  StudentPersonalProfile,
  BasicInfo,
  EducationDetails,
  ProfessionalDetails,
  CareerPreferences,
  CurrentStatus,
  TargetRole,
  PreferredDomain,
  computeCompletionFields,
  computeCompletionPercent,
} from './types';
import {
  loadProfile,
  saveProfile,
  isValidLinkedIn,
  isValidGitHub,
  isValidUrl,
  validateResume,
  readFileAsDataUri,
  MAX_RESUME_SIZE_BYTES,
  formatLastUpdated,
} from './profileStorage';

// ─────────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────────
interface PersonalDetailsViewProps {
  studentEmail?: string;
  studentName?: string;
  studentMobile?: string;
}

// ─────────────────────────────────────────────────
// SECTION TAB IDS
// ─────────────────────────────────────────────────
type SectionTab = 'basic' | 'education' | 'professional' | 'career';

// ─────────────────────────────────────────────────
// REUSABLE FIELD WRAPPER
// ─────────────────────────────────────────────────
const Field: React.FC<{
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}> = ({ label, required, hint, error, className, children }) => (
  <div className={`space-y-1.5 ${className ?? ''}`}>
    <label className="flex items-center gap-1.5 text-xs font-semibold text-[#CBD5E1] uppercase tracking-wider">
      {label}
      {required && <span className="text-rose-400 text-[10px]">*</span>}
      {hint && (
        <span title={hint} className="text-[#64748B] cursor-help">
          <Info className="w-3 h-3" />
        </span>
      )}
    </label>
    {children}
    {error && (
      <p className="flex items-center gap-1 text-[11px] text-rose-400">
        <AlertCircle className="w-3 h-3 shrink-0" />
        {error}
      </p>
    )}
  </div>
);

// ─────────────────────────────────────────────────
// REUSABLE TEXT INPUT
// ─────────────────────────────────────────────────
const TextInput: React.FC<
  React.InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean }
> = ({ hasError, className = '', ...props }) => (
  <input
    {...props}
    className={`w-full px-3.5 py-2.5 rounded-xl bg-[#070D1B] border text-white text-sm placeholder-[#475569] focus:outline-none transition-colors ${
      hasError
        ? 'border-rose-500 focus:border-rose-400'
        : 'border-[#1F2E4D] focus:border-[#2563EB]'
    } ${className}`}
  />
);

// ─────────────────────────────────────────────────
// REUSABLE SELECT
// ─────────────────────────────────────────────────
const SelectInput: React.FC<
  React.SelectHTMLAttributes<HTMLSelectElement> & { hasError?: boolean }
> = ({ hasError, className = '', children, ...props }) => (
  <div className="relative">
    <select
      {...props}
      className={`w-full appearance-none px-3.5 py-2.5 pr-9 rounded-xl bg-[#070D1B] border text-sm focus:outline-none transition-colors cursor-pointer ${
        hasError
          ? 'border-rose-500 focus:border-rose-400 text-white'
          : 'border-[#1F2E4D] focus:border-[#2563EB] text-white'
      } ${className}`}
    >
      {children}
    </select>
    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] pointer-events-none" />
  </div>
);

// ─────────────────────────────────────────────────
// VERIFICATION BADGE
// ─────────────────────────────────────────────────
const VerificationBadge: React.FC<{ status: 'verified' | 'unverified' | 'pending' }> = ({
  status,
}) => {
  if (status === 'verified')
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-2 py-0.5 rounded-full">
        <ShieldCheck className="w-3 h-3" />
        Verified
      </span>
    );
  if (status === 'pending')
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-950/40 border border-amber-500/30 px-2 py-0.5 rounded-full">
        <Clock className="w-3 h-3" />
        Pending
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#64748B] bg-[#0F1A2E] border border-[#1E2E4A] px-2 py-0.5 rounded-full">
      <AlertCircle className="w-3 h-3" />
      Not Verified
    </span>
  );
};

// ─────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────
export const PersonalDetailsView: React.FC<PersonalDetailsViewProps> = ({
  studentEmail = '',
  studentName = '',
  studentMobile = '',
}) => {
  // Load persisted profile on mount
  const [profile, setProfile] = useState<StudentPersonalProfile>(() =>
    loadProfile(studentEmail, studentName, studentMobile)
  );

  // Working draft — user edits this; profile = last saved state
  const [draft, setDraft] = useState<StudentPersonalProfile>(() =>
    loadProfile(studentEmail, studentName, studentMobile)
  );

  const [activeTab, setActiveTab] = useState<SectionTab>('basic');
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [photoPreview, setPhotoPreview] = useState<string>(profile.basic.profilePhotoUrl);

  // Resume upload ref
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Re-load if email changes (e.g. admin impersonation)
  useEffect(() => {
    const p = loadProfile(studentEmail, studentName, studentMobile);
    setProfile(p);
    setDraft(p);
    setPhotoPreview(p.basic.profilePhotoUrl);
    setIsDirty(false);
  }, [studentEmail]);

  // ── COMPLETION METRICS ──────────────────────────
  const completionFields = computeCompletionFields(draft);
  const completionPercent = computeCompletionPercent(draft);
  const incompleteFields = completionFields.filter((f) => !f.filled);

  // ── DIRTY FLAG ─────────────────────────────────
  const markDirty = () => setIsDirty(true);

  // ── PATCH HELPERS ──────────────────────────────
  const patchBasic = (patch: Partial<BasicInfo>) => {
    setDraft((d) => ({ ...d, basic: { ...d.basic, ...patch } }));
    markDirty();
  };

  const patchEducation = (patch: Partial<EducationDetails>) => {
    setDraft((d) => ({ ...d, education: { ...d.education, ...patch } }));
    markDirty();
  };

  const patchProfessional = (patch: Partial<ProfessionalDetails>) => {
    setDraft((d) => ({ ...d, professional: { ...d.professional, ...patch } }));
    markDirty();
  };

  const patchCareer = (patch: Partial<CareerPreferences>) => {
    setDraft((d) => ({ ...d, career: { ...d.career, ...patch } }));
    markDirty();
  };

  // ── PHOTO UPLOAD ───────────────────────────────
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, photo: 'Only image files are accepted for profile photo.' }));
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, photo: 'Photo must be under 3 MB.' }));
      return;
    }
    setErrors((prev) => { const n = { ...prev }; delete n.photo; return n; });
    const dataUri = await readFileAsDataUri(file);
    setPhotoPreview(dataUri);
    patchBasic({ profilePhotoUrl: dataUri, profilePhotoName: file.name });
  };

  // ── RESUME UPLOAD ──────────────────────────────
  const handleResumeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const err = validateResume(file);
    if (err) {
      setErrors((prev) => ({ ...prev, resume: err }));
      return;
    }
    setErrors((prev) => { const n = { ...prev }; delete n.resume; return n; });
    const dataUri = await readFileAsDataUri(file);
    patchProfessional({
      resumeFileName: file.name,
      resumeDataUri: dataUri,
      resumeUploadedAt: new Date().toISOString(),
    });
  };

  // ── VALIDATION ─────────────────────────────────
  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!draft.basic.fullName.trim()) errs.fullName = 'Full name is required.';
    if (!draft.basic.mobile.trim()) errs.mobile = 'Mobile number is required.';
    if (draft.basic.mobile.trim() && !/^[6-9]\d{9}$/.test(draft.basic.mobile.trim()))
      errs.mobile = 'Enter a valid 10-digit Indian mobile number.';

    if (!isValidLinkedIn(draft.professional.linkedInUrl))
      errs.linkedIn = 'Enter a valid LinkedIn profile URL (must include linkedin.com).';
    if (!isValidGitHub(draft.professional.githubUrl))
      errs.github = 'Enter a valid GitHub profile URL (must include github.com).';
    if (!isValidUrl(draft.professional.portfolioUrl))
      errs.portfolio = 'Enter a valid HTTPS URL for your portfolio.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── SAVE ───────────────────────────────────────
  const handleSave = async () => {
    if (!validate()) {
      showToast('error', 'Please fix the highlighted errors before saving.');
      // Switch to the first tab that has an error
      if (errors.fullName || errors.mobile || errors.photo) setActiveTab('basic');
      else if (errors.linkedIn || errors.github || errors.portfolio || errors.resume)
        setActiveTab('professional');
      return;
    }
    if (isSaving) return;
    setIsSaving(true);
    try {
      const saved = saveProfile(draft);
      setProfile(saved);
      setDraft(saved);
      setIsDirty(false);
      showToast('success', 'Your profile has been saved successfully.');
    } catch (err: any) {
      showToast('error', err.message || 'Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // ── DISCARD ────────────────────────────────────
  const handleDiscard = () => {
    setDraft(profile);
    setPhotoPreview(profile.basic.profilePhotoUrl);
    setErrors({});
    setIsDirty(false);
  };

  // ── TOAST ──────────────────────────────────────
  const showToast = (type: 'success' | 'error', text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4500);
  };

  // ── TABS CONFIG ────────────────────────────────
  const tabs: { id: SectionTab; label: string; icon: React.FC<{ className?: string }>; incomplete: number }[] = [
    {
      id: 'basic',
      label: 'Basic',
      icon: User,
      incomplete: completionFields.filter((f) => f.section === 'Basic' && !f.filled).length,
    },
    {
      id: 'education',
      label: 'Education',
      icon: BookOpen,
      incomplete: completionFields.filter((f) => f.section === 'Education' && !f.filled).length,
    },
    {
      id: 'professional',
      label: 'Professional',
      icon: Briefcase,
      incomplete: completionFields.filter((f) => f.section === 'Professional' && !f.filled).length,
    },
    {
      id: 'career',
      label: 'Career',
      icon: Target,
      incomplete: completionFields.filter((f) => f.section === 'Career' && !f.filled).length,
    },
  ];

  // ── RESUME DOWNLOAD ────────────────────────────
  const handleResumeDownload = () => {
    if (!draft.professional.resumeDataUri) return;
    const link = document.createElement('a');
    link.href = draft.professional.resumeDataUri;
    link.download = draft.professional.resumeFileName || 'resume.pdf';
    link.click();
  };

  // ═══════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════
  return (
    <div className="flex-1 bg-[#070D1B] text-white min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">

        {/* ═══════════════════════════════════════════════
            1. PAGE HEADER + PROFILE COMPLETION
           ═══════════════════════════════════════════════ */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          
          {/* Left: Title + Meta */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-blue-500/15 text-[#38BDF8] border border-blue-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Student Profile
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">Personal Details</h1>
            <p className="text-sm text-[#94A3B8] mt-1">
              Manage your profile and career information.{' '}
              {profile.lastUpdatedAt && (
                <span className="text-[#64748B]">
                  Last saved: <strong className="text-[#94A3B8]">{formatLastUpdated(profile.lastUpdatedAt)}</strong>
                </span>
              )}
            </p>
          </div>

          {/* Right: Profile Completion Widget */}
          <div className="lg:w-72 bg-[#0B1324] border border-[#182338] rounded-2xl p-4 space-y-3 shrink-0">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white">Profile Completion</span>
              <span className={`font-extrabold font-mono text-lg ${
                completionPercent >= 80 ? 'text-emerald-400' :
                completionPercent >= 50 ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {completionPercent}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2.5 bg-[#152136] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionPercent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className={`h-full rounded-full ${
                  completionPercent >= 80
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                    : completionPercent >= 50
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                    : 'bg-gradient-to-r from-rose-500 to-orange-400'
                }`}
              />
            </div>

            {/* Incomplete Fields Hint */}
            {incompleteFields.length > 0 ? (
              <div className="space-y-1">
                <p className="text-[11px] text-[#64748B]">Complete these fields to reach 100%:</p>
                <div className="flex flex-wrap gap-1">
                  {incompleteFields.slice(0, 5).map((f, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-[#101A2E] border border-[#1E2E4A] text-[#94A3B8]"
                    >
                      {f.label}
                    </span>
                  ))}
                  {incompleteFields.length > 5 && (
                    <span className="text-[10px] text-[#64748B]">
                      +{incompleteFields.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Profile is complete!
              </p>
            )}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════
            2. PROFILE PHOTO + IDENTITY ROW
           ═══════════════════════════════════════════════ */}
        <div className="bg-[#0B1324] rounded-2xl border border-[#182338] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-5">
          {/* Avatar */}
          <div className="relative shrink-0 self-start sm:self-auto">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-blue-500/40 bg-[#101A2E] flex items-center justify-center shadow-lg shadow-blue-500/10">
              {photoPreview ? (
                <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-[#334155]" />
              )}
            </div>

            {/* Edit Photo Button */}
            <button
              onClick={() => photoInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-[#2563EB] hover:bg-blue-500 text-white flex items-center justify-center shadow-md cursor-pointer transition-colors"
              title="Change profile photo"
            >
              <Camera className="w-4 h-4" />
            </button>

            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </div>

          {/* Student Identity */}
          <div className="flex-1 space-y-1 min-w-0">
            <h2 className="text-xl font-extrabold text-white tracking-tight truncate">
              {draft.basic.fullName || studentName || 'Your Name'}
            </h2>
            <p className="text-sm text-[#94A3B8] flex items-center gap-1.5 truncate">
              <Mail className="w-4 h-4 text-blue-400 shrink-0" />
              <span>{draft.basic.email}</span>
              <VerificationBadge status={draft.basic.emailVerified} />
            </p>
            <p className="text-sm text-[#94A3B8] flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-purple-400 shrink-0" />
              <span>{draft.basic.mobile || 'Mobile not added'}</span>
              <VerificationBadge status={draft.basic.mobileVerified} />
            </p>
            {errors.photo && (
              <p className="text-xs text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.photo}
              </p>
            )}
          </div>

          {/* Status pill */}
          {draft.professional.currentStatus && (
            <span className="self-start sm:self-auto px-3 py-1.5 rounded-xl text-xs font-bold bg-[#101C33] border border-[#1E3056] text-[#93C5FD] shrink-0">
              {draft.professional.currentStatus}
            </span>
          )}
        </div>

        {/* ═══════════════════════════════════════════════
            3. SECTION TABS
           ═══════════════════════════════════════════════ */}
        <div className="bg-[#0B1324] rounded-2xl border border-[#182338] overflow-hidden shadow-xl">

          {/* Tab Bar */}
          <div className="flex overflow-x-auto no-scrollbar border-b border-[#182338]">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-4 sm:px-6 py-4 text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'text-white'
                      : 'text-[#64748B] hover:text-[#CBD5E1]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.incomplete > 0 && (
                    <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                      {tab.incomplete}
                    </span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="activePersonalTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB]"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="p-5 sm:p-6 lg:p-8">
            <AnimatePresence mode="wait">

              {/* ──────────────────────────────────────
                  TAB A — BASIC INFORMATION
                 ────────────────────────────────────── */}
              {activeTab === 'basic' && (
                <motion.div
                  key="basic"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-5"
                >
                  <div>
                    <h3 className="text-sm font-bold text-white mb-0.5">Basic Information</h3>
                    <p className="text-xs text-[#64748B]">Your personal contact details associated with the CodeMyWay account.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                    {/* Full Name */}
                    <Field label="Full Name" required error={errors.fullName}>
                      <TextInput
                        type="text"
                        value={draft.basic.fullName}
                        onChange={(e) => patchBasic({ fullName: e.target.value })}
                        placeholder="e.g. Anuj Sharma"
                        hasError={!!errors.fullName}
                      />
                    </Field>

                    {/* Email — read-only tied to auth */}
                    <Field
                      label="Email Address"
                      required
                      hint="Your registered account email. Contact support to update."
                    >
                      <div className="relative">
                        <TextInput
                          type="email"
                          value={draft.basic.email}
                          readOnly
                          className="bg-[#0A1120] border-[#182338] cursor-not-allowed text-[#64748B]"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <VerificationBadge status={draft.basic.emailVerified} />
                        </div>
                      </div>
                    </Field>

                    {/* Mobile */}
                    <Field label="Mobile Number" required error={errors.mobile}>
                      <div className="flex gap-2">
                        <div className="flex items-center px-3 rounded-xl bg-[#070D1B] border border-[#1F2E4D] text-[#94A3B8] text-sm shrink-0">
                          +91
                        </div>
                        <div className="flex-1 relative">
                          <TextInput
                            type="tel"
                            value={draft.basic.mobile}
                            onChange={(e) => patchBasic({ mobile: e.target.value })}
                            placeholder="9876543210"
                            maxLength={10}
                            hasError={!!errors.mobile}
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <VerificationBadge status={draft.basic.mobileVerified} />
                          </div>
                        </div>
                      </div>
                    </Field>

                    {/* Verification info note */}
                    <div className="sm:col-span-2">
                      <div className="p-3.5 rounded-xl bg-[#0A111E] border border-[#1A263D] flex items-start gap-2.5 text-xs text-[#94A3B8]">
                        <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                        <p className="leading-relaxed">
                          <strong className="text-white">Email verification</strong> is automatically granted on first login. Mobile OTP verification is handled by the CodeMyWay backend authentication service — this status updates after verification is completed.{' '}
                          <strong className="text-[#38BDF8]">
                            Students cannot bypass or self-approve verification status.
                          </strong>
                        </p>
                      </div>
                    </div>

                  </div>
                </motion.div>
              )}

              {/* ──────────────────────────────────────
                  TAB B — EDUCATION DETAILS
                 ────────────────────────────────────── */}
              {activeTab === 'education' && (
                <motion.div
                  key="education"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-5"
                >
                  <div>
                    <h3 className="text-sm font-bold text-white mb-0.5">Education Details</h3>
                    <p className="text-xs text-[#64748B]">Your academic background. Used by faculty to personalise mentorship guidance.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                    <div className="sm:col-span-2">
                    <Field label="College / University Name" required>
                      <TextInput
                        type="text"
                        value={draft.education.collegeName}
                        onChange={(e) => patchEducation({ collegeName: e.target.value })}
                        placeholder="e.g. Delhi Technological University"
                      />
                    </Field>
                    </div>

                    <Field label="Degree" required>
                      <SelectInput
                        value={draft.education.degree}
                        onChange={(e) => patchEducation({ degree: e.target.value })}
                      >
                        <option value="">Select degree</option>
                        {['B.Tech', 'B.E.', 'BCA', 'B.Sc', 'BBA', 'B.Com', 'MBA', 'MCA', 'M.Tech', 'M.Sc', 'M.Com', 'Ph.D', 'Other'].map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </SelectInput>
                    </Field>

                    <Field label="Specialization / Branch" required>
                      <TextInput
                        type="text"
                        value={draft.education.specialization}
                        onChange={(e) => patchEducation({ specialization: e.target.value })}
                        placeholder="e.g. Computer Science, Commerce"
                      />
                    </Field>

                    <Field label="Graduation Year" required>
                      <SelectInput
                        value={draft.education.graduationYear}
                        onChange={(e) => patchEducation({ graduationYear: e.target.value })}
                      >
                        <option value="">Select year</option>
                        {Array.from({ length: 10 }, (_, i) => 2020 + i).map((y) => (
                          <option key={y} value={String(y)}>{y}</option>
                        ))}
                      </SelectInput>
                    </Field>

                    <Field label="Current Academic Year" hint="Leave blank if already graduated.">
                      <SelectInput
                        value={draft.education.currentAcademicYear}
                        onChange={(e) => patchEducation({ currentAcademicYear: e.target.value })}
                      >
                        <option value="">Select (if still studying)</option>
                        {['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduated'].map((y) => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </SelectInput>
                    </Field>

                    <Field label="CGPA" hint="Optional — enter your current or final CGPA.">
                      <TextInput
                        type="text"
                        value={draft.education.cgpa}
                        onChange={(e) => patchEducation({ cgpa: e.target.value })}
                        placeholder="e.g. 8.4 / 10"
                      />
                    </Field>

                  </div>
                </motion.div>
              )}

              {/* ──────────────────────────────────────
                  TAB C — PROFESSIONAL DETAILS
                 ────────────────────────────────────── */}
              {activeTab === 'professional' && (
                <motion.div
                  key="professional"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-5"
                >
                  <div>
                    <h3 className="text-sm font-bold text-white mb-0.5">Professional Details</h3>
                    <p className="text-xs text-[#64748B]">Your work background, online presence, and career artifacts.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                    {/* Current Status */}
                    <Field label="Current Status" required>
                      <SelectInput
                        value={draft.professional.currentStatus}
                        onChange={(e) => patchProfessional({ currentStatus: e.target.value as CurrentStatus })}
                      >
                        <option value="">Select your current status</option>
                        {(['Student', 'Fresher', 'Working Professional'] as const).map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </SelectInput>
                    </Field>

                    {/* Work Experience */}
                    <Field label="Work Experience" hint="Optional. Leave blank if fresher / student.">
                      <TextInput
                        type="text"
                        value={draft.professional.workExperience}
                        onChange={(e) => patchProfessional({ workExperience: e.target.value })}
                        placeholder="e.g. 1 yr 6 months at InfoSys as Data Intern"
                      />
                    </Field>

                    {/* LinkedIn */}
                    <Field label="LinkedIn Profile URL" required error={errors.linkedIn}>
                      <div className="relative">
                        <Linkedin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0A66C2]" />
                        <TextInput
                          type="url"
                          value={draft.professional.linkedInUrl}
                          onChange={(e) => patchProfessional({ linkedInUrl: e.target.value })}
                          placeholder="https://linkedin.com/in/yourname"
                          hasError={!!errors.linkedIn}
                          className="pl-9"
                        />
                      </div>
                    </Field>

                    {/* GitHub */}
                    <Field label="GitHub Profile URL" required error={errors.github}>
                      <div className="relative">
                        <Github className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white" />
                        <TextInput
                          type="url"
                          value={draft.professional.githubUrl}
                          onChange={(e) => patchProfessional({ githubUrl: e.target.value })}
                          placeholder="https://github.com/yourusername"
                          hasError={!!errors.github}
                          className="pl-9"
                        />
                      </div>
                    </Field>

                    {/* Portfolio */}
                    <div className="sm:col-span-2">
                    <Field label="Portfolio / Personal Website URL" hint="Optional." error={errors.portfolio}>
                      <div className="relative">
                        <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#38BDF8]" />
                        <TextInput
                          type="url"
                          value={draft.professional.portfolioUrl}
                          onChange={(e) => patchProfessional({ portfolioUrl: e.target.value })}
                          placeholder="https://yourportfolio.dev"
                          hasError={!!errors.portfolio}
                          className="pl-9"
                        />
                      </div>
                    </Field>
                    </div>

                    {/* External Links Row */}
                    {(draft.professional.linkedInUrl || draft.professional.githubUrl || draft.professional.portfolioUrl) && (
                      <div className="sm:col-span-2 flex flex-wrap gap-2">
                        {draft.professional.linkedInUrl && isValidLinkedIn(draft.professional.linkedInUrl) && (
                          <a href={draft.professional.linkedInUrl} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0A66C2]/15 border border-[#0A66C2]/30 text-[#5BA4F5] text-xs font-medium hover:bg-[#0A66C2]/25 transition-colors">
                            <Linkedin className="w-3.5 h-3.5" />
                            <span>View LinkedIn</span>
                            <ExternalLink className="w-3 h-3 opacity-60" />
                          </a>
                        )}
                        {draft.professional.githubUrl && isValidGitHub(draft.professional.githubUrl) && (
                          <a href={draft.professional.githubUrl} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white text-xs font-medium hover:bg-white/15 transition-colors">
                            <Github className="w-3.5 h-3.5" />
                            <span>View GitHub</span>
                            <ExternalLink className="w-3 h-3 opacity-60" />
                          </a>
                        )}
                        {draft.professional.portfolioUrl && isValidUrl(draft.professional.portfolioUrl) && (
                          <a href={draft.professional.portfolioUrl} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#38BDF8]/10 border border-[#38BDF8]/25 text-[#38BDF8] text-xs font-medium hover:bg-[#38BDF8]/15 transition-colors">
                            <Globe className="w-3.5 h-3.5" />
                            <span>View Portfolio</span>
                            <ExternalLink className="w-3 h-3 opacity-60" />
                          </a>
                        )}
                      </div>
                    )}

                    {/* ── RESUME UPLOAD ── */}
                    <div className="sm:col-span-2 space-y-3">
                      <Field label="Resume (PDF, max 5 MB)" hint="Optional — but strongly recommended for placement support." error={errors.resume}>
                        <div
                          onClick={() => resumeInputRef.current?.click()}
                          className="relative border-2 border-dashed border-[#1E2E4A] hover:border-blue-500/60 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 cursor-pointer transition-colors group bg-[#070D1B] hover:bg-[#0B1324]"
                        >
                          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 group-hover:scale-105 transition-transform">
                            <Upload className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">
                              {draft.professional.resumeFileName
                                ? draft.professional.resumeFileName
                                : 'Click to upload your resume'}
                            </p>
                            <p className="text-xs text-[#64748B]">
                              {draft.professional.resumeUploadedAt
                                ? `Uploaded ${formatLastUpdated(draft.professional.resumeUploadedAt)}`
                                : 'PDF only · Maximum 5 MB'}
                            </p>
                          </div>
                        </div>
                        <input
                          ref={resumeInputRef}
                          type="file"
                          accept=".pdf,application/pdf"
                          className="hidden"
                          onChange={handleResumeChange}
                        />
                      </Field>

                      {/* Resume Actions */}
                      {draft.professional.resumeFileName && draft.professional.resumeDataUri && (
                        <div className="flex items-center gap-3 pl-1">
                          <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
                            <FileText className="w-4 h-4 text-rose-400" />
                            <span className="font-medium text-white truncate max-w-xs">
                              {draft.professional.resumeFileName}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={handleResumeDownload}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-[#38BDF8] bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-colors cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            Download
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              patchProfessional({ resumeFileName: '', resumeDataUri: '', resumeUploadedAt: '' });
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                            Remove
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                </motion.div>
              )}

              {/* ──────────────────────────────────────
                  TAB D — CAREER PREFERENCES
                 ────────────────────────────────────── */}
              {activeTab === 'career' && (
                <motion.div
                  key="career"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-5"
                >
                  <div>
                    <h3 className="text-sm font-bold text-white mb-0.5">Career Preferences</h3>
                    <p className="text-xs text-[#64748B]">Help your mentor and the CodeMyWay placement cell tailor opportunities for you.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                    <Field label="Target Role" required>
                      <SelectInput
                        value={draft.career.targetRole}
                        onChange={(e) => patchCareer({ targetRole: e.target.value as TargetRole })}
                      >
                        <option value="">Select your target role</option>
                        {[
                          'Data Analyst',
                          'Business Analyst',
                          'Product Analyst',
                          'Data Scientist',
                          'Marketing Analyst',
                          'Financial Analyst',
                          'Operations Analyst',
                          'Other',
                        ].map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </SelectInput>
                    </Field>

                    <Field label="Preferred Industry Domain" required>
                      <SelectInput
                        value={draft.career.preferredDomain}
                        onChange={(e) => patchCareer({ preferredDomain: e.target.value as PreferredDomain })}
                      >
                        <option value="">Select preferred domain</option>
                        {[
                          'E-Commerce / Retail',
                          'FinTech / Banking',
                          'Healthcare / Life Sciences',
                          'Consulting / Advisory',
                          'Product & SaaS',
                          'Media & Entertainment',
                          'Supply Chain & Logistics',
                          'Open to All',
                        ].map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </SelectInput>
                    </Field>

                    <Field label="Preferred Job Location" required>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-400" />
                        <TextInput
                          type="text"
                          value={draft.career.preferredLocation}
                          onChange={(e) => patchCareer({ preferredLocation: e.target.value })}
                          placeholder="e.g. Bengaluru, Remote, Open to Relocation"
                          className="pl-9"
                        />
                      </div>
                    </Field>

                    <div className="sm:col-span-2">
                      <Field label="Career Goal" required hint="Briefly describe your 2-year career objective (max 300 chars).">
                        <textarea
                          value={draft.career.careerGoal}
                          onChange={(e) => patchCareer({ careerGoal: e.target.value.slice(0, 300) })}
                          rows={4}
                          placeholder="e.g. Transition into a Data Analyst role at a product-led company within 12 months of program completion, leveraging SQL, Tableau and Python skills to drive customer retention improvements."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#070D1B] border border-[#1F2E4D] focus:border-[#2563EB] text-white text-sm placeholder-[#475569] focus:outline-none transition-colors resize-none leading-relaxed"
                        />
                        <div className="text-right text-[11px] text-[#64748B]">
                          {draft.career.careerGoal.length} / 300
                        </div>
                      </Field>
                    </div>

                    {/* Placement readiness note */}
                    <div className="sm:col-span-2">
                      <div className="p-3.5 rounded-xl bg-[#0B1A12] border border-emerald-500/25 flex items-start gap-2.5 text-xs text-[#94A3B8]">
                        <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <p className="leading-relaxed">
                          Career preferences are shared with the{' '}
                          <strong className="text-white">CodeMyWay Placement Cell</strong> and your assigned mentor to match you with relevant job referrals, project case studies, and interview prep modules.
                        </p>
                      </div>
                    </div>

                  </div>
                </motion.div>
              )}

            </AnimatePresence>

            {/* ── SAVE / DISCARD FOOTER ── */}
            <div className="mt-8 pt-5 border-t border-[#182338] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs text-[#64748B] flex items-center gap-1.5">
                {isDirty ? (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-amber-400">You have unsaved changes.</span>
                  </>
                ) : profile.lastUpdatedAt ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>All changes saved · {formatLastUpdated(profile.lastUpdatedAt)}</span>
                  </>
                ) : (
                  <span>Fill in your details and save your profile.</span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {isDirty && (
                  <button
                    type="button"
                    onClick={handleDiscard}
                    className="px-4 py-2.5 rounded-xl text-sm font-semibold text-[#94A3B8] hover:text-white border border-[#1E2E4A] hover:border-[#334155] bg-[#080E1C] hover:bg-[#0E1729] transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Discard</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving || !isDirty}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#2563EB] to-[#7C3AED] hover:from-blue-500 hover:to-purple-600 shadow-md shadow-blue-600/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Saving…</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* ═══════════════════════════════════════════════
            4. BACKEND INTEGRATION NOTE CARD
           ═══════════════════════════════════════════════ */}
        <div className="p-4 rounded-2xl bg-[#0E1122] border border-[#1E2A42] text-xs text-[#64748B] space-y-1 leading-relaxed">
          <div className="flex items-center gap-1.5 text-[#94A3B8] font-semibold mb-1">
            <Info className="w-3.5 h-3.5 text-blue-400" />
            Backend Integration Notes
          </div>
          <ul className="space-y-0.5 list-disc list-inside marker:text-[#334155]">
            <li><strong className="text-white">Storage:</strong> Profile data is persisted in <code className="bg-[#101A2E] px-1 rounded text-[#93C5FD]">localStorage</code> keyed by authenticated email. Replace with a REST <code className="bg-[#101A2E] px-1 rounded text-[#93C5FD]">PATCH /api/students/:id/profile</code> call in production.</li>
            <li><strong className="text-white">Resume / Photo:</strong> Stored as base-64 data URIs locally. Production path: pre-signed S3 upload → CDN URL stored in the students table.</li>
            <li><strong className="text-white">Mobile Verification:</strong> OTP flow is a backend responsibility. The <code className="bg-[#101A2E] px-1 rounded text-[#93C5FD]">mobileVerified</code> flag should be set server-side after SMS OTP confirmation and returned in the auth token claims.</li>
            <li><strong className="text-white">Admin Read Access:</strong> The profile object is structured to be retrieved by faculty/admin via a <code className="bg-[#101A2E] px-1 rounded text-[#93C5FD]">GET /api/admin/students/:id/profile</code> endpoint with role-based guard.</li>
          </ul>
        </div>

      </div>

      {/* ═══════════════════════════════════════════════
          5. TOAST NOTIFICATION
         ═══════════════════════════════════════════════ */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm"
          >
            <div className={`p-4 rounded-xl border shadow-2xl flex items-start gap-3 backdrop-blur-md ${
              toast.type === 'success'
                ? 'bg-[#081A10]/95 border-emerald-500/50 text-emerald-200'
                : 'bg-[#1E090F]/95 border-rose-500/50 text-rose-200'
            }`}>
              {toast.type === 'success'
                ? <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                : <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}
              <p className="text-xs leading-relaxed flex-1">{toast.text}</p>
              <button onClick={() => setToast(null)} className="text-current opacity-60 hover:opacity-100 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
