import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  CheckCircle, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Download, 
  UploadCloud, 
  Github, 
  ExternalLink, 
  Video, 
  Layers, 
  Sparkles, 
  Trophy, 
  User, 
  Star, 
  Save, 
  Send, 
  FileCode, 
  FileSpreadsheet, 
  Database, 
  PieChart, 
  Lock, 
  Info, 
  X, 
  Eye, 
  Check, 
  RefreshCw,
  Sliders,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ProjectDefinition, 
  StudentProjectState, 
  ProjectStatus, 
  ProjectResource 
} from './types';
import { ProjectStatusBadge } from './ProjectStatusBadge';
import { saveProjectDraft, submitProject, updateMentorReview } from './projectStorage';

interface ProjectDetailViewProps {
  project: ProjectDefinition;
  studentState: StudentProjectState;
  studentEmail: string;
  onBack: () => void;
  onStateUpdated: (newState: StudentProjectState) => void;
}

export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({
  project,
  studentState,
  studentEmail,
  onBack,
  onStateUpdated
}) => {
  // Submission Form State (initialized from draft or current submission)
  const latestSubmission = studentState.submissions[0];
  const draft = studentState.draftData;

  const [projectDescription, setProjectDescription] = useState<string>(
    draft?.projectDescription || latestSubmission?.projectDescription || ''
  );
  const [githubRepoUrl, setGithubRepoUrl] = useState<string>(
    draft?.githubRepoUrl || latestSubmission?.githubRepoUrl || ''
  );
  const [liveDashboardUrl, setLiveDashboardUrl] = useState<string>(
    draft?.liveDashboardUrl || latestSubmission?.liveDashboardUrl || ''
  );
  const [demoVideoUrl, setDemoVideoUrl] = useState<string>(
    draft?.demoVideoUrl || latestSubmission?.demoVideoUrl || ''
  );

  // Uploaded files state
  const [uploadedFiles, setUploadedFiles] = useState<{ fileName: string; fileSize: string; fileType: string }[]>(
    latestSubmission?.uploadedFiles.map(f => ({ fileName: f.fileName, fileSize: f.fileSize, fileType: f.fileType })) ||
    draft?.uploadedFileNames.map(name => ({ fileName: name, fileSize: '3.8 MB', fileType: 'application/octet-stream' })) ||
    []
  );

  // Form feedback state
  const [formError, setFormError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Dataset Preview Modal State
  const [previewResource, setPreviewResource] = useState<ProjectResource | null>(null);

  // Faculty Review Simulator Panel Toggle
  const [isFacultyPanelOpen, setIsFacultyPanelOpen] = useState<boolean>(false);
  const [simulatedScore, setSimulatedScore] = useState<number>(studentState.currentScore || 90);
  const [simulatedStatus, setSimulatedStatus] = useState<ProjectStatus>('Approved');
  const [simulatedFeedback, setSimulatedFeedback] = useState<string>(
    'Comprehensive work demonstrating clear understanding of analytical metrics and production data structuring.'
  );

  // URL Validator helper
  const isValidUrl = (url: string) => {
    if (!url.trim()) return true;
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  // Handle Save Draft
  const handleSaveDraft = () => {
    setFormError(null);
    try {
      const updated = saveProjectDraft(project.id, studentEmail, {
        projectDescription,
        githubRepoUrl,
        liveDashboardUrl,
        demoVideoUrl,
        uploadedFileNames: uploadedFiles.map(f => f.fileName)
      });
      onStateUpdated(updated);
      setSuccessToast('Draft saved successfully! You can resume and edit anytime.');
      setTimeout(() => setSuccessToast(null), 3500);
    } catch (err) {
      setFormError('Failed to save draft. Please try again.');
    }
  };

  // Handle Final Submission
  const handleSubmitProject = () => {
    setFormError(null);

    // Validation
    if (!projectDescription.trim() || projectDescription.trim().length < 20) {
      setFormError('Please provide a project description / summary (minimum 20 characters).');
      return;
    }

    if (githubRepoUrl && !isValidUrl(githubRepoUrl)) {
      setFormError('Please enter a valid GitHub repository URL starting with https://');
      return;
    }

    if (liveDashboardUrl && !isValidUrl(liveDashboardUrl)) {
      setFormError('Please enter a valid Dashboard URL starting with https://');
      return;
    }

    if (demoVideoUrl && !isValidUrl(demoVideoUrl)) {
      setFormError('Please enter a valid video presentation URL starting with https://');
      return;
    }

    if (uploadedFiles.length === 0 && !githubRepoUrl && !liveDashboardUrl) {
      setFormError('Please upload at least one project deliverable file or provide a GitHub / Live Dashboard URL.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      try {
        const updated = submitProject(project.id, studentEmail, {
          projectDescription,
          githubRepoUrl,
          liveDashboardUrl,
          demoVideoUrl,
          files: uploadedFiles
        });
        onStateUpdated(updated);
        setIsSubmitting(false);
        setSuccessToast('Project submitted successfully! Assigned to senior mentor panel for evaluation.');
        setTimeout(() => setSuccessToast(null), 4000);
      } catch (err) {
        setIsSubmitting(false);
        setFormError('Submission failed. Please check network connection.');
      }
    }, 600);
  };

  // Simulated File Upload handler
  const handleSimulatedFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(file => ({
        fileName: file.name,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        fileType: file.type || 'application/octet-stream'
      }));
      setUploadedFiles(prev => [...prev, ...newFiles]);
      setSuccessToast(`Attached ${newFiles.length} file(s).`);
      setTimeout(() => setSuccessToast(null), 2500);
    }
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Handle Faculty Review Simulation
  const handleApplyFacultyReview = () => {
    try {
      const updated = updateMentorReview(
        project.id,
        studentEmail,
        {
          mentorName: 'Vikramaditya Sengupta',
          mentorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          reviewDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          overallScore: simulatedScore,
          maxScore: 100,
          criteriaBreakdown: [
            {
              category: 'Business Problem Formulation & Context',
              score: Math.round(simulatedScore * 0.25),
              maxScore: 25,
              comments: 'Structured analytical thinking aligned with stakeholder objectives.'
            },
            {
              category: 'Technical Rigor & Code Quality',
              score: Math.round(simulatedScore * 0.26),
              maxScore: 25,
              comments: 'Clean pipeline execution, robust data validation, and modular structure.'
            },
            {
              category: 'Visual & Interactive Excellence',
              score: Math.round(simulatedScore * 0.24),
              maxScore: 25,
              comments: 'Effective visual encoding, responsive layouts, and intuitive ergonomics.'
            },
            {
              category: 'Strategic Insights & Recommendations',
              score: Math.round(simulatedScore * 0.25),
              maxScore: 25,
              comments: 'Actionable business turnaround recommendations with clear ROI.'
            }
          ],
          writtenFeedback: simulatedFeedback,
          strengths: [
            'Exceptional attention to data hygiene and metric definitions',
            'Solid analytical defense of findings with zero speculative claims',
            'Clean presentation tailored for C-suite decision-makers'
          ],
          improvementAreas: [
            'Add automated regression unit tests in future pipeline iterations',
            'Include statistical confidence intervals for sensitivity forecasts'
          ],
          revisionInstructions: simulatedStatus === 'Revision Required' 
            ? 'Please re-examine the cohort calculation in table 3 to account for returns and resubmit.' 
            : undefined
        },
        simulatedStatus
      );
      onStateUpdated(updated);
      setIsFacultyPanelOpen(false);
      setSuccessToast(`Mentor review updated: Status is now "${simulatedStatus}" with score ${simulatedScore}/100.`);
      setTimeout(() => setSuccessToast(null), 4000);
    } catch (err) {
      setFormError('Failed to update faculty review.');
    }
  };

  const isLocked = studentState.status === 'Locked';
  const isApproved = studentState.status === 'Approved';
  const isUnderReview = studentState.status === 'Under Review' || studentState.status === 'Submitted';
  const isRevisionRequired = studentState.status === 'Revision Required';
  const isEditable = !isLocked && (!isApproved && !isUnderReview || isRevisionRequired);

  const activeMentorReview = latestSubmission?.mentorReview;

  return (
    <div className="w-full bg-[#070D1B] text-white min-h-screen pb-16 font-sans">
      
      {/* ========================================================
          TOP BREADCRUMB & HEADER BAR
         ======================================================== */}
      <header className="px-4 sm:px-6 lg:px-8 py-4 bg-[#0A1120] border-b border-[#1A263D] sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-[#0F172A] border border-[#1E293B] hover:border-[#38BDF8]/60 text-[#94A3B8] hover:text-white transition-all cursor-pointer group shrink-0"
              title="Back to All Projects"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </button>

            <div>
              <div className="flex items-center gap-2 text-xs text-[#64748B] mb-0.5 font-mono">
                <span className="hover:text-blue-400 cursor-pointer" onClick={onBack}>Business / Projects</span>
                <span>/</span>
                <span className="text-[#38BDF8] uppercase font-semibold">Phase {project.phaseNumber}</span>
                <span>/</span>
                <span className="text-white font-semibold truncate max-w-xs">{project.title}</span>
              </div>
              <h1 className="text-base sm:text-xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
                <span>{project.title}</span>
                {project.type === 'major' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-gradient-to-r from-amber-500/20 to-purple-500/20 text-amber-300 border border-amber-500/30">
                    Capstone Major
                  </span>
                )}
              </h1>
            </div>
          </div>

          {/* Right Status Badges & Quick Action */}
          <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
            <ProjectStatusBadge status={studentState.status} size="lg" />

            {studentState.currentScore !== undefined && (
              <div className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5" />
                <span>Score: {studentState.currentScore}/100</span>
              </div>
            )}

            {/* Faculty Simulation Toggle Button */}
            <button
              onClick={() => setIsFacultyPanelOpen(!isFacultyPanelOpen)}
              className="px-3 py-1.5 rounded-xl bg-[#1E293B] hover:bg-[#283548] border border-[#334155] text-[11px] font-semibold text-[#CBD5E1] flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Faculty / Mentor Simulation Mode"
            >
              <Sliders className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span className="hidden sm:inline">Faculty Simulator</span>
            </button>
          </div>

        </div>
      </header>

      {/* SUCCESS / ERROR TOASTS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <AnimatePresence>
          {successToast && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-semibold flex items-center justify-between mb-4 shadow-lg shadow-emerald-500/10"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successToast}</span>
              </div>
              <button onClick={() => setSuccessToast(null)} className="p-1 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {formError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs sm:text-sm font-semibold flex items-center justify-between mb-4 shadow-lg shadow-rose-500/10"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{formError}</span>
              </div>
              <button onClick={() => setFormError(null)} className="p-1 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ========================================================
          FACULTY / MENTOR SIMULATOR DRAWER (IF OPEN)
         ======================================================== */}
      <AnimatePresence>
        {isFacultyPanelOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 overflow-hidden"
          >
            <div className="p-5 rounded-2xl bg-gradient-to-r from-[#111C35] via-[#162340] to-[#111C35] border border-blue-500/40 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#203254] pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#38BDF8]" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Faculty / Evaluator Simulation Console
                  </span>
                  <span className="text-[10px] text-[#94A3B8] font-mono hidden sm:inline">
                    (Review submissions, grade criteria & update project state)
                  </span>
                </div>
                <button
                  onClick={() => setIsFacultyPanelOpen(false)}
                  className="p-1 text-[#94A3B8] hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-[#94A3B8] mb-1 font-semibold">Set Review Status:</label>
                  <select
                    value={simulatedStatus}
                    onChange={(e) => setSimulatedStatus(e.target.value as ProjectStatus)}
                    className="w-full bg-[#0A1120] border border-[#233554] rounded-xl px-3 py-2 text-white font-semibold focus:outline-none focus:border-blue-500"
                  >
                    <option value="Approved">Approved (Grade & Certify)</option>
                    <option value="Revision Required">Revision Required (Request edits)</option>
                    <option value="Under Review">Under Review (Keep queued)</option>
                    <option value="In Progress">In Progress (Unlock for student)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#94A3B8] mb-1 font-semibold">Overall Score (0–100):</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={simulatedScore}
                    onChange={(e) => setSimulatedScore(Math.min(100, Math.max(0, Number(e.target.value))))}
                    className="w-full bg-[#0A1120] border border-[#233554] rounded-xl px-3 py-2 text-white font-mono font-bold focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="sm:col-span-1 flex items-end">
                  <button
                    onClick={handleApplyFacultyReview}
                    className="w-full py-2 px-4 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Apply Review & Grade</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[#94A3B8] mb-1 text-xs font-semibold">Faculty Written Feedback:</label>
                <textarea
                  rows={2}
                  value={simulatedFeedback}
                  onChange={(e) => setSimulatedFeedback(e.target.value)}
                  className="w-full bg-[#0A1120] border border-[#233554] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================
          MAIN PROJECT DETAIL CONTENT (GRID LAYOUT)
         ======================================================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* STATUS BANNER NOTICES */}
        {isApproved && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-white block">Project Approved & Evaluated</span>
                <span className="text-emerald-300/90 text-xs">
                  Your project has satisfied all evaluation benchmarks and is published to your student portfolio.
                </span>
              </div>
            </div>
            {studentState.currentScore && (
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xs shrink-0">
                Final Grade: {studentState.currentScore}/100
              </span>
            )}
          </div>
        )}

        {isRevisionRequired && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/40 flex items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-rose-200 block">Revision Requested by Mentor</span>
                <span className="text-[#CBD5E1] text-xs">
                  Please check the revision instructions in the Mentor Review section below, update your code/deliverables, and resubmit.
                </span>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 font-mono font-bold text-xs shrink-0">
              Action Required
            </span>
          </div>
        )}

        {isUnderReview && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="font-bold text-amber-200 block">Under Review by Industry Mentors</span>
                <span className="text-[#CBD5E1] text-xs">
                  Your latest submission (v{latestSubmission?.version || 1}) is being reviewed. Evaluation feedback will be published within 48 hours.
                </span>
              </div>
            </div>
          </div>
        )}

        {isLocked && (
          <div className="p-4 rounded-2xl bg-[#1E293B] border border-[#334155] flex items-center gap-3 text-xs sm:text-sm text-[#94A3B8]">
            <Lock className="w-5 h-5 text-[#64748B] shrink-0" />
            <div>
              <span className="font-bold text-white block">Project Locked</span>
              <span>Complete prerequisite modules and assignments to unlock this project workspace.</span>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            SECTION A & B: PROJECT OVERVIEW & SKILLS REQUIRED
           ---------------------------------------------------- */}
        <section className="bg-[#0A1120] rounded-2xl border border-[#1A263D] p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1A263D]">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase bg-blue-500/15 text-blue-400 border border-blue-500/30">
                  Phase {project.phaseNumber} · Module {project.moduleNumber || 'Major'}
                </span>
                {project.submissionDeadline && (
                  <span className="flex items-center gap-1 text-[11px] text-[#94A3B8] bg-[#0F172A] px-2.5 py-0.5 rounded-full border border-[#1E293B]">
                    <Calendar className="w-3 h-3 text-[#38BDF8]" />
                    <span>Due: {project.submissionDeadline}</span>
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                {project.title}
              </h2>
            </div>

            {/* Technologies Badges */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {project.technologies.map(tech => (
                <span 
                  key={tech}
                  className="px-3 py-1 rounded-xl text-xs font-semibold bg-[#111A2E] text-white border border-[#202E4B]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Business Context & Problem Statement */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-[#0D1527] border border-[#1E293B] space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 font-mono block">
                Executive Business Context
              </span>
              <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
                {project.businessContext}
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#0D1527] border border-[#1E293B] space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400 font-mono block">
                Problem Statement & Technical Challenge
              </span>
              <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
                {project.problemStatement}
              </p>
            </div>
          </div>

          {/* Objective & Expected Outcome */}
          <div className="p-5 rounded-xl bg-gradient-to-r from-[#0C1528] to-[#121B32] border border-[#1E2A42] flex flex-col md:flex-row gap-6">
            <div className="flex-1 space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#38BDF8] font-mono flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Project Objective</span>
              </span>
              <p className="text-xs sm:text-sm text-[#E2E8F0] leading-relaxed">
                {project.objective}
              </p>
            </div>

            <div className="flex-1 space-y-1.5 border-t md:border-t-0 md:border-l border-[#1E2A42] pt-4 md:pt-0 md:pl-6">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 font-mono flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5" />
                <span>Expected Outcome & Deliverable</span>
              </span>
              <p className="text-xs sm:text-sm text-[#E2E8F0] leading-relaxed">
                {project.expectedOutcome}
              </p>
            </div>
          </div>

          {/* Skills Required Grid */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] font-mono">
              Skills, Tools & Methodologies Evaluated:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {project.skillsRequired.map((skill, idx) => (
                <div 
                  key={idx}
                  className="p-3 rounded-xl bg-[#0D1527] border border-[#1E293B] flex items-center justify-between text-xs"
                >
                  <span className="font-semibold text-white">{skill.name}</span>
                  <span className="text-[10px] text-[#64748B] font-mono px-2 py-0.5 rounded bg-[#070D1B]">
                    {skill.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------
            SECTION: CAPSTONE MILESTONES (FOR MAJOR PROJECTS)
           ---------------------------------------------------- */}
        {project.type === 'major' && project.milestones && (
          <section className="bg-[#0A1120] rounded-2xl border border-purple-500/30 p-6 sm:p-8 space-y-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1A263D] gap-2">
              <div>
                <span className="text-xs font-mono font-bold uppercase text-purple-400 tracking-wider block">
                  Milestone-Based Progress Tracker
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  Phase {project.phaseNumber} Capstone Milestones
                </h3>
              </div>
              <span className="text-xs text-[#94A3B8] bg-[#0D1527] px-3 py-1 rounded-full border border-[#1E293B]">
                {project.milestones.filter(m => m.status === 'Completed').length} / {project.milestones.length} Milestones Completed
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {project.milestones.map((milestone) => {
                const isMilestoneCompleted = milestone.status === 'Completed';
                const isMilestoneInProgress = milestone.status === 'In Progress';
                return (
                  <div 
                    key={milestone.id}
                    className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                      isMilestoneCompleted
                        ? 'bg-[#0D1829] border-emerald-500/40 shadow-sm shadow-emerald-500/5'
                        : isMilestoneInProgress
                        ? 'bg-[#12162E] border-blue-500/50 shadow-sm shadow-blue-500/10'
                        : 'bg-[#0A1120] border-[#1E293B] opacity-75'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono font-bold text-[#64748B]">
                          MILESTONE {milestone.milestoneNumber}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isMilestoneCompleted
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : isMilestoneInProgress
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : 'bg-[#1E293B] text-[#94A3B8]'
                        }`}>
                          {milestone.status}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white">
                        {milestone.title}
                      </h4>

                      <p className="text-xs text-[#94A3B8] leading-relaxed">
                        {milestone.description}
                      </p>

                      <div className="pt-2 space-y-1">
                        <span className="text-[10px] font-bold text-[#64748B] uppercase font-mono block">Deliverables:</span>
                        {milestone.deliverables.map((del, dIdx) => (
                          <div key={dIdx} className="text-xs text-[#CBD5E1] flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                            <span>{del}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {milestone.mentorRemarks && (
                      <div className="mt-4 pt-3 border-t border-[#1E293B] text-[11px] text-emerald-300/90 italic">
                        Mentor note: “{milestone.mentorRemarks}”
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ----------------------------------------------------
            SECTION C: DATASET & SUPPORTING RESOURCES
           ---------------------------------------------------- */}
        <section className="bg-[#0A1120] rounded-2xl border border-[#1A263D] p-6 sm:p-8 space-y-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1A263D] gap-2">
            <div>
              <span className="text-xs font-mono font-bold uppercase text-[#38BDF8] tracking-wider block">
                Official Datasets & Materials
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">
                Dataset & Supporting Resources
              </h3>
            </div>
            <span className="text-xs text-[#64748B]">
              Only resources published by verified faculty are accessible here
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {project.resources.map((res) => (
              <div 
                key={res.id}
                className="p-4 rounded-xl bg-[#0D1527] border border-[#1E293B] hover:border-[#334155] transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#152138] text-[#38BDF8] border border-[#233554]">
                      {res.type}
                    </span>
                    {res.size && (
                      <span className="text-[10px] text-[#64748B] font-mono">{res.size}</span>
                    )}
                  </div>

                  <h4 className="text-xs font-bold text-white truncate" title={res.name}>
                    {res.name}
                  </h4>

                  <p className="text-[11px] text-[#94A3B8] leading-relaxed line-clamp-2">
                    {res.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#152138] flex items-center gap-2">
                  <button
                    onClick={() => {
                      setPreviewResource(res);
                    }}
                    className="flex-1 py-1.5 px-2.5 rounded-lg bg-[#152138] hover:bg-[#1C2C4A] text-xs font-semibold text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-blue-400" />
                    <span>Preview</span>
                  </button>

                  <a
                    href={res.url}
                    onClick={(e) => {
                      e.preventDefault();
                      setSuccessToast(`Initiated download for "${res.name}".`);
                      setTimeout(() => setSuccessToast(null), 3000);
                    }}
                    className="flex-1 py-1.5 px-2.5 rounded-lg bg-[#2563EB] hover:bg-blue-600 text-xs font-semibold text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ----------------------------------------------------
            SECTION D: PROJECT INSTRUCTIONS & REQUIREMENTS
           ---------------------------------------------------- */}
        <section className="bg-[#0A1120] rounded-2xl border border-[#1A263D] p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="pb-4 border-b border-[#1A263D]">
            <span className="text-xs font-mono font-bold uppercase text-amber-400 tracking-wider block">
              Execution Guidelines
            </span>
            <h3 className="text-lg font-bold text-white mt-0.5">
              Task Requirements & Rubric Evaluation
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Task Requirements */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase text-white font-mono flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#38BDF8]" />
                <span>Task Requirements (Step-by-Step)</span>
              </h4>
              <ul className="space-y-2.5">
                {project.taskRequirements.map((req, idx) => (
                  <li key={idx} className="p-3 rounded-xl bg-[#0D1527] border border-[#1E293B] text-xs text-[#CBD5E1] flex items-start gap-2.5 leading-relaxed">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Deliverables & Evaluation Criteria */}
            <div className="space-y-5">
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase text-white font-mono flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>Mandatory Deliverables</span>
                </h4>
                <div className="space-y-2">
                  {project.deliverables.map((del, dIdx) => (
                    <div key={dIdx} className="p-2.5 rounded-lg bg-[#0D1527] border border-[#1E293B] text-xs text-white flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{del}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase text-white font-mono flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-400" />
                  <span>Grading Rubric Weights</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {project.evaluationCriteriaOverview.map((crit, cIdx) => (
                    <div key={cIdx} className="p-2.5 rounded-lg bg-[#0D1527] border border-[#1E293B] text-[11px] text-[#CBD5E1]">
                      {crit}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------
            SECTION E: STUDENT WORKSPACE & SUBMISSION FORM
           ---------------------------------------------------- */}
        <section className="bg-[#0A1120] rounded-2xl border border-[#1A263D] p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1A263D] gap-2">
            <div>
              <span className="text-xs font-mono font-bold uppercase text-[#38BDF8] tracking-wider block">
                Submission Portal
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">
                Student Workspace & Deliverable Submission
              </h3>
            </div>
            {draft?.lastSavedAt && (
              <span className="text-xs text-[#94A3B8] font-mono">
                Draft auto-saved: {new Date(draft.lastSavedAt).toLocaleTimeString()}
              </span>
            )}
          </div>

          <div className="space-y-5">
            {/* Project Description / Executive Summary */}
            <div>
              <label className="block text-xs font-bold text-white mb-1.5 font-mono">
                1. Project Summary, Methodology & Key Insights <span className="text-rose-400">*</span>
              </label>
              <textarea
                disabled={!isEditable}
                rows={4}
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="Describe your analytical approach, tools utilized, data cleaning decisions, and top business insights..."
                className="w-full p-3.5 rounded-xl bg-[#0D1527] border border-[#1E293B] text-xs sm:text-sm text-white placeholder-[#64748B] focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              />
              <span className="text-[10px] text-[#64748B] block mt-1">
                Provide a structured executive summary for the evaluation committee.
              </span>
            </div>

            {/* URL Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-white mb-1.5 font-mono flex items-center gap-1.5">
                  <Github className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span>GitHub Repository URL</span>
                </label>
                <input
                  type="url"
                  disabled={!isEditable}
                  value={githubRepoUrl}
                  onChange={(e) => setGithubRepoUrl(e.target.value)}
                  placeholder="https://github.com/username/repo"
                  className="w-full p-2.5 rounded-xl bg-[#0D1527] border border-[#1E293B] text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-blue-500 disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1.5 font-mono flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5 text-purple-400" />
                  <span>Live Dashboard / BI URL</span>
                </label>
                <input
                  type="url"
                  disabled={!isEditable}
                  value={liveDashboardUrl}
                  onChange={(e) => setLiveDashboardUrl(e.target.value)}
                  placeholder="https://public.tableau.com/... or OneDrive"
                  className="w-full p-2.5 rounded-xl bg-[#0D1527] border border-[#1E293B] text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-blue-500 disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1.5 font-mono flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-rose-400" />
                  <span>Video Demo / Loom Link</span>
                </label>
                <input
                  type="url"
                  disabled={!isEditable}
                  value={demoVideoUrl}
                  onChange={(e) => setDemoVideoUrl(e.target.value)}
                  placeholder="https://loom.com/share/... or YouTube"
                  className="w-full p-2.5 rounded-xl bg-[#0D1527] border border-[#1E293B] text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-blue-500 disabled:opacity-50"
                />
              </div>
            </div>

            {/* File Upload Component */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-white mb-1 font-mono">
                2. Upload Project Deliverables (.sql, .xlsx, .twbx, .pbix, .ipynb, .pdf, .zip)
              </label>

              {isEditable && (
                <div className="p-6 rounded-2xl border-2 border-dashed border-[#1E293B] hover:border-blue-500/60 bg-[#0D1527]/60 text-center transition-all cursor-pointer relative group">
                  <input
                    type="file"
                    multiple
                    onChange={handleSimulatedFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <UploadCloud className="w-8 h-8 text-[#38BDF8] mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-xs font-semibold text-white">
                    Click to browse files or drag and drop your deliverables
                  </p>
                  <p className="text-[10px] text-[#64748B] mt-1">
                    Maximum size: 50MB per file. Allowed formats: .sql, .xlsx, .pbix, .twbx, .ipynb, .pdf, .zip
                  </p>
                </div>
              )}

              {/* Uploaded File List */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-bold text-[#94A3B8] font-mono block">Attached Files ({uploadedFiles.length}):</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {uploadedFiles.map((file, fIdx) => (
                      <div 
                        key={fIdx}
                        className="p-3 rounded-xl bg-[#0D1527] border border-[#1E293B] flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                          <div className="min-w-0">
                            <span className="font-semibold text-white block truncate">{file.fileName}</span>
                            <span className="text-[10px] text-[#64748B] font-mono">{file.fileSize}</span>
                          </div>
                        </div>

                        {isEditable && (
                          <button
                            onClick={() => handleRemoveFile(fIdx)}
                            className="p-1 text-[#64748B] hover:text-rose-400 rounded transition-colors cursor-pointer"
                            title="Remove file"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submission Buttons */}
            {isEditable && (
              <div className="pt-4 border-t border-[#1A263D] flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="px-5 py-2.5 rounded-xl bg-[#0F172A] hover:bg-[#152138] border border-[#1E293B] text-xs font-semibold text-white transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4 text-[#38BDF8]" />
                  <span>Save Draft</span>
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleSubmitProject}
                  className="px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-600 disabled:opacity-50 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Submitting...' : 'Submit Project for Review'}</span>
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ----------------------------------------------------
            SECTION G: MENTOR REVIEW & EVALUATION (IF REVIEWED)
           ---------------------------------------------------- */}
        {activeMentorReview && (
          <section className="bg-[#0A1120] rounded-2xl border border-emerald-500/40 p-6 sm:p-8 space-y-6 shadow-sm relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1A263D] gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-tr from-purple-500 to-indigo-500 border border-purple-400/30 shrink-0">
                  <img 
                    src={activeMentorReview.mentorAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"} 
                    alt={activeMentorReview.mentorName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-emerald-400 tracking-wider block">
                    Official Evaluator Feedback
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {activeMentorReview.mentorName}
                  </h3>
                  <span className="text-xs text-[#94A3B8]">
                    Evaluated on {activeMentorReview.reviewDate}
                  </span>
                </div>
              </div>

              {/* Overall Score Badge */}
              <div className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 text-center shrink-0">
                <span className="text-[10px] font-mono text-emerald-300 uppercase block font-semibold">Total Grade</span>
                <span className="text-2xl font-black font-mono text-emerald-400">
                  {activeMentorReview.overallScore} <span className="text-xs text-[#94A3B8]">/ {activeMentorReview.maxScore}</span>
                </span>
              </div>
            </div>

            {/* Criteria Breakdown Grid */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase font-mono">
                Evaluation Criteria & Score Breakdown:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeMentorReview.criteriaBreakdown.map((crit, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-[#0D1527] border border-[#1E293B] space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-white">{crit.category}</span>
                      <span className="text-emerald-400 font-mono">{crit.score} / {crit.maxScore}</span>
                    </div>
                    <div className="w-full bg-[#152138] h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-emerald-400 h-full rounded-full" 
                        style={{ width: `${(crit.score / crit.maxScore) * 100}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                      {crit.comments}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Written Qualitative Feedback */}
            <div className="p-4 rounded-xl bg-[#0D1527] border border-[#1E293B] space-y-2">
              <h4 className="text-xs font-bold text-[#38BDF8] uppercase font-mono">
                Detailed Mentor Assessment:
              </h4>
              <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
                “{activeMentorReview.writtenFeedback}”
              </p>
            </div>

            {/* Strengths & Improvement Areas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="p-4 rounded-xl bg-[#0D1527] border border-emerald-500/30 space-y-2">
                <span className="text-[11px] font-bold text-emerald-400 uppercase font-mono flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Key Strengths</span>
                </span>
                <ul className="space-y-1.5">
                  {activeMentorReview.strengths.map((str, sIdx) => (
                    <li key={sIdx} className="text-xs text-[#CBD5E1] flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-[#0D1527] border border-amber-500/30 space-y-2">
                <span className="text-[11px] font-bold text-amber-400 uppercase font-mono flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Growth & Improvement Areas</span>
                </span>
                <ul className="space-y-1.5">
                  {activeMentorReview.improvementAreas.map((imp, iIdx) => (
                    <li key={iIdx} className="text-xs text-[#CBD5E1] flex items-start gap-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {activeMentorReview.revisionInstructions && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 space-y-1">
                <span className="font-bold block">Revision Instructions:</span>
                <p>{activeMentorReview.revisionInstructions}</p>
              </div>
            )}
          </section>
        )}

        {/* ----------------------------------------------------
            SECTION F: SUBMISSION HISTORY
           ---------------------------------------------------- */}
        {studentState.submissions.length > 0 && (
          <section className="bg-[#0A1120] rounded-2xl border border-[#1A263D] p-6 sm:p-8 space-y-4 shadow-sm">
            <div className="pb-3 border-b border-[#1A263D] flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold uppercase text-[#94A3B8] tracking-wider block">
                  Audit Trail
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  Submission History ({studentState.submissions.length})
                </h3>
              </div>
            </div>

            <div className="space-y-3">
              {studentState.submissions.map((sub, sIdx) => (
                <div 
                  key={sIdx}
                  className="p-4 rounded-xl bg-[#0D1527] border border-[#1E293B] space-y-3"
                >
                  <div className="flex items-center justify-between text-xs flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono font-bold">
                        Version {sub.version}
                      </span>
                      <span className="text-[#94A3B8]">
                        Submitted on {new Date(sub.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <ProjectStatusBadge status={sub.status} size="sm" />
                  </div>

                  <p className="text-xs text-[#CBD5E1] leading-relaxed">
                    {sub.projectDescription}
                  </p>

                  {/* Submitted URLs and Files */}
                  <div className="flex items-center gap-4 text-xs text-[#94A3B8] flex-wrap pt-1 border-t border-[#152138]">
                    {sub.githubRepoUrl && (
                      <a 
                        href={sub.githubRepoUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-blue-400 hover:underline flex items-center gap-1"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>GitHub Code</span>
                      </a>
                    )}
                    {sub.liveDashboardUrl && (
                      <a 
                        href={sub.liveDashboardUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-purple-400 hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Live Dashboard</span>
                      </a>
                    )}
                    {sub.uploadedFiles && sub.uploadedFiles.length > 0 && (
                      <span className="text-[#64748B]">
                        Files: {sub.uploadedFiles.map(f => f.fileName).join(', ')}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* ========================================================
          DATASET PREVIEW MODAL
         ======================================================== */}
      <AnimatePresence>
        {previewResource && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-4xl bg-[#0B1120] text-white rounded-2xl border border-[#1E293B] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="p-4 bg-[#101A2E] border-b border-[#1E293B] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-[#38BDF8]" />
                  <span className="text-xs font-mono font-bold text-white truncate max-w-md">
                    {previewResource.name}
                  </span>
                  <span className="text-[10px] text-[#64748B] font-mono">({previewResource.size})</span>
                </div>
                <button
                  onClick={() => setPreviewResource(null)}
                  className="p-1 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#1E293B] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 overflow-y-auto space-y-4">
                <p className="text-xs text-[#CBD5E1]">
                  {previewResource.description}
                </p>

                {/* Sample tabular preview */}
                <div className="rounded-xl border border-[#1E293B] overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono border-collapse min-w-[600px]">
                    <thead className="bg-[#0F172A] text-[#94A3B8] border-b border-[#1E293B] text-[10px] uppercase">
                      <tr>
                        <th className="py-2.5 px-3">record_id</th>
                        <th className="py-2.5 px-3">timestamp</th>
                        <th className="py-2.5 px-3">customer_id</th>
                        <th className="py-2.5 px-3">channel</th>
                        <th className="py-2.5 px-3">metric_value</th>
                        <th className="py-2.5 px-3 text-right">status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#152138] bg-[#070D1B] text-[#E2E8F0] text-[11px]">
                      <tr>
                        <td className="py-2 px-3 text-[#38BDF8]">REC_10482</td>
                        <td className="py-2 px-3 text-[#94A3B8]">2026-10-14 09:22:15</td>
                        <td className="py-2 px-3">CUST_88219</td>
                        <td className="py-2 px-3">Direct Web</td>
                        <td className="py-2 px-3 text-emerald-400 font-bold">₹14,999.00</td>
                        <td className="py-2 px-3 text-right text-emerald-400 font-semibold">SUCCESS</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 text-[#38BDF8]">REC_10483</td>
                        <td className="py-2 px-3 text-[#94A3B8]">2026-10-14 09:24:02</td>
                        <td className="py-2 px-3">CUST_94211</td>
                        <td className="py-2 px-3">Meta Referral</td>
                        <td className="py-2 px-3 text-emerald-400 font-bold">₹4,250.00</td>
                        <td className="py-2 px-3 text-right text-emerald-400 font-semibold">SUCCESS</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 text-[#38BDF8]">REC_10484</td>
                        <td className="py-2 px-3 text-[#94A3B8]">2026-10-14 09:31:44</td>
                        <td className="py-2 px-3">CUST_11094</td>
                        <td className="py-2 px-3">Google Organic</td>
                        <td className="py-2 px-3 text-emerald-400 font-bold">₹28,500.00</td>
                        <td className="py-2 px-3 text-right text-amber-400 font-semibold">PENDING</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 text-[#38BDF8]">REC_10485</td>
                        <td className="py-2 px-3 text-[#94A3B8]">2026-10-14 09:42:19</td>
                        <td className="py-2 px-3">CUST_44921</td>
                        <td className="py-2 px-3">Email Retention</td>
                        <td className="py-2 px-3 text-emerald-400 font-bold">₹8,990.00</td>
                        <td className="py-2 px-3 text-right text-emerald-400 font-semibold">SUCCESS</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <span className="text-[10px] text-[#64748B] block italic">
                  Showing top 4 sample rows. Download full dataset for complete schema exploration.
                </span>
              </div>

              <div className="p-4 bg-[#101A2E] border-t border-[#1E293B] flex items-center justify-between text-xs">
                <span className="text-[#94A3B8]">Authorized Academic Use Only</span>
                <button
                  onClick={() => setPreviewResource(null)}
                  className="px-4 py-1.5 rounded-lg bg-[#2563EB] hover:bg-blue-600 text-white font-semibold cursor-pointer"
                >
                  Close Preview
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
