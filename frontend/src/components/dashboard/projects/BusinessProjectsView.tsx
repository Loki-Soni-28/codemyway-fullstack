import React, { useState, useEffect } from 'react';
import { api } from '../../../api';
import { 
  Briefcase, 
  Check,
  CheckCircle2, 
  Clock, 
  Hourglass, 
  AlertTriangle, 
  ArrowRight, 
  Sparkles, 
  Trophy, 
  Calendar, 
  FileCode, 
  Layers, 
  ChevronRight, 
  Database, 
  FileSpreadsheet, 
  PieChart, 
  Code2, 
  BrainCircuit, 
  BarChart3, 
  ShieldCheck, 
  Lock,
  User,
  Star,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  ProjectDefinition, 
  StudentProjectState, 
  ProjectStatus 
} from './types';
import { ProjectStatusBadge } from './ProjectStatusBadge';
import { ProjectDetailView } from './ProjectDetailView';

interface BusinessProjectsViewProps {
  studentEmail?: string;
  studentName?: string;
  onOpenSupportModal?: () => void;
}

export const BusinessProjectsView: React.FC<BusinessProjectsViewProps> = ({
  studentEmail = '',
  studentName = 'Student'
}) => {
  const [dbProjects, setDbProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Selected project to view in detailed page (null = list view)
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  // Filter state: 'all' | 'phase1' | 'phase2' | 'completed' | 'in-progress'
  const [activeFilter, setActiveFilter] = useState<'all' | 'phase1' | 'phase2' | 'completed' | 'in-progress'>('all');

  const fetchProjects = async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const res = await api<{ success: boolean; projects: any[] }>('/student/projects');
      if (res && res.success) {
        setDbProjects(res.projects);
      }
    } catch (err: any) {
      console.error('Failed to load projects:', err);
      setFetchError(err.message || 'Unable to load cohort projects.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Transform backend DB CourseProjects to frontend ProjectDefinition & StudentProjectState
  const projectDefinitions: ProjectDefinition[] = dbProjects.map((p, idx) => ({
    id: p.id,
    phaseNumber: (idx < Math.ceil(dbProjects.length / 2) ? 1 : 2) as 1 | 2,
    moduleNumber: idx + 1,
    type: p.type === 'major' ? 'major' : 'minor',
    title: p.title,
    shortDescription: p.problemStatement || 'Production-grade enterprise business project.',
    technologies: p.technologies || [],
    submissionDeadline: '15 Nov 2026, 11:59 PM',
    objective: p.outcome || 'Design and deploy end-to-end analytical solutions solving real business problems.',
    businessContext: p.problemStatement || 'Enterprise business case study requiring robust implementation.',
    problemStatement: p.problemStatement || 'Implement production pipeline and executive dashboard.',
    expectedOutcome: p.outcome || 'Production deliverables with verified test cases and executive summary.',
    skillsRequired: (p.skillsCovered || []).map((s: string) => ({ name: s, category: 'Technical' })),
    resources: p.resources || [],
    taskRequirements: [
      'Design modular, performant query architecture or script modules.',
      'Ensure proper handling of edge cases, null values, and anomalies.',
      'Document deliverables with README and architectural overview.'
    ],
    deliverables: [
      'GitHub repository with clean structure and commit history.',
      'Live deployment or query script files.',
      'Executive summary documentation.'
    ],
    evaluationCriteriaOverview: [
      'Technical Rigor & Code Quality (30%)',
      'Business Problem Formulation & Context (30%)',
      'Visual & Interactive Polish (20%)',
      'Documentation & Insights (20%)'
    ],
    submissionInstructions: [
      'Provide your GitHub repository link and any live dashboard or video demo URL.',
      'Attach any required query files or reports.'
    ]
  }));

  const getProjectState = (projectId: string): StudentProjectState => {
    const p = dbProjects.find(item => item.id === projectId);
    const sub = p?.submission;
    const status: ProjectStatus = sub
      ? (sub.status as ProjectStatus)
      : 'Not Started';

    return {
      projectId,
      studentEmail,
      status,
      isUnlocked: true,
      currentScore: sub?.review?.overallScore || undefined,
      lastUpdated: sub?.submittedAt || new Date().toISOString(),
      submissions: sub ? [
        {
          version: sub.version,
          submittedAt: sub.submittedAt,
          projectDescription: sub.projectDescription,
          uploadedFiles: (sub.files || []).map((f: any) => ({
            fileName: f.fileName,
            fileSize: f.fileSize || '1.0 MB',
            fileType: f.fileType || 'application/octet-stream',
            uploadedAt: sub.submittedAt
          })),
          githubRepoUrl: sub.githubRepoUrl || undefined,
          liveDashboardUrl: sub.liveDashboardUrl || undefined,
          demoVideoUrl: sub.demoVideoUrl || undefined,
          status: sub.status as ProjectStatus,
          mentorReview: sub.review ? {
            mentorName: sub.review.reviewerName,
            mentorAvatar: sub.review.reviewerAvatar || undefined,
            reviewDate: new Date(sub.review.reviewDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            overallScore: sub.review.overallScore || 0,
            maxScore: sub.review.maxScore || 100,
            criteriaBreakdown: sub.review.criteriaBreakdown || [],
            writtenFeedback: sub.review.writtenFeedback,
            strengths: sub.review.strengths || [],
            improvementAreas: sub.review.improvementAreas || [],
            revisionInstructions: sub.review.revisionInstructions
          } : undefined
        }
      ] : []
    };
  };

  // Metrics calculated strictly from real database submissions
  const totalCount = projectDefinitions.length;
  const completedCount = dbProjects.filter(p => p.submission?.status === 'Approved').length;
  const inProgressCount = dbProjects.filter(p => p.submission && p.submission.status !== 'Approved').length;
  const avgScore = completedCount > 0
    ? Math.round(
        dbProjects
          .filter(p => p.submission?.review?.overallScore)
          .reduce((acc, p) => acc + (p.submission.review.overallScore || 0), 0) / completedCount
      )
    : 0;

  // Handler for state updates from the detail view
  const handleStateUpdated = (updatedState: StudentProjectState) => {
    fetchProjects();
  };

  // Phase 1 Projects
  const phase1MinorProjects = projectDefinitions.filter(p => p.phaseNumber === 1 && p.type === 'minor');
  const phase1MajorProject = projectDefinitions.find(p => p.phaseNumber === 1 && p.type === 'major') || projectDefinitions[0];

  // Phase 2 Projects
  const phase2MinorProjects = projectDefinitions.filter(p => p.phaseNumber === 2 && p.type === 'minor');
  const phase2MajorProject = projectDefinitions.find(p => p.phaseNumber === 2 && p.type === 'major') || projectDefinitions[projectDefinitions.length - 1];

  // Tech Icon Resolver helper
  const getTechIcon = (tech: string) => {
    switch (tech) {
      case 'SQL':
        return <Database className="w-3.5 h-3.5 text-blue-400" />;
      case 'Excel':
        return <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Tableau':
        return <PieChart className="w-3.5 h-3.5 text-amber-400" />;
      case 'Python':
        return <Code2 className="w-3.5 h-3.5 text-purple-400" />;
      case 'NumPy':
      case 'Pandas':
      case 'Matplotlib':
      case 'Seaborn':
        return <Layers className="w-3.5 h-3.5 text-cyan-400" />;
      case 'Statistics and Probability':
        return <BarChart3 className="w-3.5 h-3.5 text-rose-400" />;
      default:
        return <BrainCircuit className="w-3.5 h-3.5 text-blue-400" />;
    }
  };

  if (isLoading) {
    return (
      <div className="w-full bg-[#070D1B] min-h-screen flex flex-col items-center justify-center p-12 space-y-4">
        <div className="w-10 h-10 rounded-full border-2 border-blue-500/20 border-t-blue-400 animate-spin" />
        <p className="text-xs text-[#94A3B8] font-mono tracking-wider animate-pulse">
          Loading Enrolled Cohort Projects...
        </p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="w-full bg-[#070D1B] min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#0D1527] border border-rose-500/30 rounded-2xl p-6 text-center space-y-4">
          <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
          <h3 className="text-sm font-bold text-white">Project Synchronization Error</h3>
          <p className="text-xs text-[#94A3B8]">{fetchError}</p>
          <button
            onClick={() => fetchProjects()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  if (projectDefinitions.length === 0) {
    return (
      <div className="w-full bg-[#070D1B] min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#0D1527] border border-[#1A263D] rounded-2xl p-8 text-center space-y-4">
          <Briefcase className="w-10 h-10 text-blue-400 mx-auto opacity-60" />
          <h3 className="text-base font-bold text-white">No Assigned Projects Yet</h3>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            Projects for your cohort will be assigned by the academic faculty as you progress through foundational modules.
          </p>
        </div>
      </div>
    );
  }

  // If a project detail is active, render the dedicated Detail View
  if (activeProjectId) {
    const projectDef = projectDefinitions.find(p => p.id === activeProjectId);
    if (projectDef) {
      return (
        <ProjectDetailView
          project={projectDef}
          studentState={getProjectState(activeProjectId)}
          studentEmail={studentEmail}
          onBack={() => setActiveProjectId(null)}
          onStateUpdated={handleStateUpdated}
        />
      );
    }
  }

  return (
    <div className="w-full bg-[#070D1B] text-white min-h-screen p-4 sm:p-6 lg:p-8 space-y-10 font-sans">
      
      {/* ========================================================
          1. HEADER & OVERVIEW METRIC CARDS
         ======================================================== */}
      <section className="space-y-6">
        
        {/* Title & Subtitle */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#152136]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-[#38BDF8]">
                <Briefcase className="w-4 h-4" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Business / Projects
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#94A3B8] max-w-2xl leading-relaxed">
              Apply your skills to real-world business problems and build your project portfolio.
            </p>
          </div>

          {/* Student Status Badge */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0A1120] border border-[#1A263D] text-xs text-[#CBD5E1] self-start md:self-auto font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Enrolled: Data Analyst + GenAI</span>
          </div>
        </div>

        {/* 4 Dynamic Overview Cards (Calculated strictly from student's records) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Total Projects */}
          <motion.div 
            whileHover={{ y: -2 }}
            className="p-5 rounded-2xl bg-[#0A1120] border border-[#1A263D] hover:border-blue-500/40 shadow-sm transition-all flex items-center justify-between"
          >
            <div>
              <span className="text-xs text-[#94A3B8] font-medium block">Total Projects</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight mt-0.5 block">
                {totalCount}
              </span>
              <span className="text-[10px] text-[#64748B] mt-1 block">Assigned in Cohort</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Briefcase className="w-5 h-5" />
            </div>
          </motion.div>

          {/* Completed Projects */}
          <motion.div 
            whileHover={{ y: -2 }}
            className="p-5 rounded-2xl bg-[#0A1120] border border-[#1A263D] hover:border-emerald-500/40 shadow-sm transition-all flex items-center justify-between"
          >
            <div>
              <span className="text-xs text-[#94A3B8] font-medium block">Completed Projects</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono tracking-tight mt-0.5 block">
                {completedCount}
              </span>
              <span className="text-[10px] text-emerald-400/70 mt-1 block font-semibold">
                Approved & Evaluated
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </motion.div>

          {/* In Progress */}
          <motion.div 
            whileHover={{ y: -2 }}
            className="p-5 rounded-2xl bg-[#0A1120] border border-[#1A263D] hover:border-purple-500/40 shadow-sm transition-all flex items-center justify-between"
          >
            <div>
              <span className="text-xs text-[#94A3B8] font-medium block">In Progress</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-mono tracking-tight mt-0.5 block">
                {inProgressCount}
              </span>
              <span className="text-[10px] text-purple-400/70 mt-1 block font-semibold">
                Submitted / Under Review
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Hourglass className="w-5 h-5" />
            </div>
          </motion.div>

          {/* Average Score */}
          <motion.div 
            whileHover={{ y: -2 }}
            className="p-5 rounded-2xl bg-[#0A1120] border border-[#1A263D] hover:border-amber-500/40 shadow-sm transition-all flex items-center justify-between"
          >
            <div>
              <span className="text-xs text-[#94A3B8] font-medium block">Average Project Score</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono tracking-tight mt-0.5 block">
                {avgScore > 0 ? `${avgScore}%` : '--'}
              </span>
              <span className="text-[10px] text-amber-400/70 mt-1 block font-semibold">
                Faculty Evaluated
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Star className="w-5 h-5" />
            </div>
          </motion.div>
        </div>

      </section>

      {/* ========================================================
          2. PHASE 1 — FOUNDATION PROJECTS
         ======================================================== */}
      <section className="space-y-6">
        
        {/* Phase Header */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0C1528] via-[#0E1A33] to-[#0A1120] border border-blue-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-[#2563EB] text-white text-[11px] font-bold font-mono uppercase tracking-wider">
                PHASE 1
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                Phase 1 — Foundation
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#94A3B8]">
              Apply foundational analytical skills through hands-on module projects.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#CBD5E1] bg-[#070D1B] px-3.5 py-1.5 rounded-xl border border-[#1E293B] shrink-0">
            <span className="text-emerald-400 font-bold">SQL · Excel · Tableau</span>
          </div>
        </div>

        {/* 2A. Minor Projects (3 cards in exact order) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] font-mono">
              Phase 1 Minor Projects (Modules 1, 2, 3)
            </h3>
            <span className="text-[11px] text-[#64748B]">3 Projects</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {phase1MinorProjects.map((project) => {
              const state = getProjectState(project.id);
              const isLocked = state.status === 'Locked';
              return (
                <div
                  key={project.id}
                  className={`p-5 rounded-2xl border flex flex-col justify-between transition-all duration-300 relative group ${
                    state.status === 'Approved'
                      ? 'bg-[#0A1224] border-emerald-500/30 hover:border-emerald-500/50'
                      : state.status === 'In Progress'
                      ? 'bg-[#0A1224] border-blue-500/40 hover:border-blue-400'
                      : state.status === 'Under Review'
                      ? 'bg-[#0A1224] border-amber-500/30'
                      : 'bg-[#0A1120] border-[#1A263D] hover:border-[#334155]'
                  }`}
                >
                  <div className="space-y-3.5">
                    {/* Top Row: Module tag and Status */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-mono font-bold text-[#64748B] uppercase tracking-wider">
                        MODULE {project.moduleNumber}
                      </span>
                      <ProjectStatusBadge status={state.status} size="sm" />
                    </div>

                    {/* Title */}
                    <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors leading-snug">
                      {project.title}
                    </h4>

                    {/* Tech Badges */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {project.technologies.map(tech => (
                        <span 
                          key={tech}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-[#111A2E] text-[#CBD5E1] border border-[#1E293B]"
                        >
                          {getTechIcon(tech)}
                          <span>{tech}</span>
                        </span>
                      ))}
                    </div>

                    {/* Description */}
                    <p className="text-xs text-[#94A3B8] leading-relaxed line-clamp-3">
                      {project.shortDescription}
                    </p>

                    {/* Deadline if configured */}
                    {project.submissionDeadline && (
                      <div className="flex items-center gap-1.5 text-[11px] text-[#64748B] font-mono pt-1">
                        <Calendar className="w-3 h-3 text-[#38BDF8]" />
                        <span>Deadline: {project.submissionDeadline}</span>
                      </div>
                    )}
                  </div>

                  {/* Bottom: Score or Action */}
                  <div className="pt-4 mt-4 border-t border-[#152136] flex items-center justify-between">
                    {state.currentScore !== undefined ? (
                      <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1">
                        <Trophy className="w-3.5 h-3.5" />
                        <span>Grade: {state.currentScore}/100</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-[#64748B]">
                        {state.submissions.length > 0 ? `${state.submissions.length} submission(s)` : 'No submissions yet'}
                      </span>
                    )}

                    <button
                      disabled={isLocked}
                      onClick={() => setActiveProjectId(project.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isLocked
                          ? 'bg-[#152138] text-[#64748B] cursor-not-allowed'
                          : 'bg-[#2563EB] hover:bg-blue-600 text-white shadow-xs hover:scale-[1.02] active:scale-[0.98]'
                      }`}
                    >
                      <span>View Project</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2B. Major Project (Separate, visually prominent card) */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 font-mono flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Phase 1 Integrated Capstone (Major Project)</span>
            </h3>
            <span className="text-[11px] text-amber-400 font-mono font-bold">Comprehensive Portfolio Capstone</span>
          </div>

          {/* Prominent Card */}
          {(() => {
            const capstoneState = getProjectState(phase1MajorProject.id);
            return (
              <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-[#0E172E] via-[#141233] to-[#0E172E] border-2 border-purple-500/40 hover:border-purple-500/70 shadow-lg shadow-purple-500/10 transition-all space-y-6 relative overflow-hidden group">
                
                {/* Ambient glow decoration */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#20254A] pb-5 relative z-10">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-3 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono tracking-wider bg-gradient-to-r from-amber-500/20 to-purple-500/20 text-amber-300 border border-amber-500/40">
                        Major Capstone Project
                      </span>
                      <span className="text-xs font-mono text-[#94A3B8]">
                        3 Integrated Milestones
                      </span>
                    </div>

                    <h4 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                      {phase1MajorProject.title}
                    </h4>

                    <p className="text-xs sm:text-sm text-[#CBD5E1] max-w-3xl leading-relaxed">
                      {phase1MajorProject.shortDescription}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-start lg:self-center">
                    <ProjectStatusBadge status={capstoneState.status} size="lg" />
                  </div>
                </div>

                {/* Key Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs relative z-10">
                  <div className="p-4 rounded-xl bg-[#080D1C]/80 border border-[#1E2744] space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase text-blue-400 block">Business Problem</span>
                    <p className="text-[#CBD5E1] leading-relaxed line-clamp-3">
                      {phase1MajorProject.businessContext}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#080D1C]/80 border border-[#1E2744] space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase text-purple-400 block">Required Skills</span>
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      {phase1MajorProject.technologies.map(t => (
                        <span key={t} className="px-2 py-0.5 rounded bg-[#151D33] text-white border border-[#232F4F] text-[10px] font-semibold">
                          {t}
                        </span>
                      ))}
                      <span className="px-2 py-0.5 rounded bg-[#151D33] text-[#A78BFA] border border-purple-500/30 text-[10px] font-semibold">
                        Financial Modeling
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#151D33] text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold">
                        Executive Storytelling
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#080D1C]/80 border border-[#1E2744] space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase text-amber-400 block">Evaluation & Review</span>
                    <p className="text-[#CBD5E1] leading-relaxed">
                      Assessed by senior industry reviewer on SQL data pipeline, Excel sensitivity, and Tableau C-suite presentation.
                    </p>
                  </div>
                </div>

                {/* Bottom Actions Row */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[#20254A] relative z-10">
                  <div className="flex items-center gap-3 text-xs text-[#94A3B8]">
                    <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Milestones 1 & 2 Approved</span>
                    </span>
                    <span>·</span>
                    <span className="text-[#38BDF8]">Final Dashboard WIP</span>
                  </div>

                  <button
                    onClick={() => setActiveProjectId(phase1MajorProject.id)}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#7C3AED] hover:from-blue-600 hover:to-purple-600 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span>View Capstone Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })()}
        </div>

      </section>

      {/* ========================================================
          3. PHASE 2 — ADVANCED PROJECTS
         ======================================================== */}
      <section className="space-y-6 pt-4">
        
        {/* Phase Header */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-[#140E2A] via-[#1A1238] to-[#0A1120] border border-purple-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-[#7C3AED] text-white text-[11px] font-bold font-mono uppercase tracking-wider">
                PHASE 2
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                Phase 2 — Advanced
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#94A3B8]">
              Build advanced analytical solutions using Python, libraries and statistical thinking.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#CBD5E1] bg-[#070D1B] px-3.5 py-1.5 rounded-xl border border-[#1E293B] shrink-0">
            <span className="text-purple-400 font-bold">Python · NumPy · Pandas · Stats · GenAI</span>
          </div>
        </div>

        {/* 3A. Minor Projects (3 cards in exact order: Module 5, Module 6, Module 7) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] font-mono">
              Phase 2 Minor Projects (Modules 5, 6, 7)
            </h3>
            <span className="text-[11px] text-[#64748B]">3 Projects · No Module 4 Project</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {phase2MinorProjects.map((project) => {
              const state = getProjectState(project.id);
              const isLocked = state.status === 'Locked';
              return (
                <div
                  key={project.id}
                  className={`p-5 rounded-2xl border flex flex-col justify-between transition-all duration-300 relative group ${
                    isLocked
                      ? 'bg-[#0A1120] border-[#1A263D] opacity-80'
                      : state.status === 'Approved'
                      ? 'bg-[#0A1224] border-emerald-500/30'
                      : state.status === 'In Progress'
                      ? 'bg-[#0A1224] border-purple-500/40 hover:border-purple-400'
                      : 'bg-[#0A1120] border-[#1A263D] hover:border-[#334155]'
                  }`}
                >
                  <div className="space-y-3.5">
                    {/* Top Row: Module tag and Status */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-mono font-bold text-[#64748B] uppercase tracking-wider">
                        MODULE {project.moduleNumber}
                      </span>
                      <ProjectStatusBadge status={state.status} size="sm" />
                    </div>

                    {/* Title */}
                    <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors leading-snug">
                      {project.title}
                    </h4>

                    {/* Tech Badges */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {project.technologies.map(tech => (
                        <span 
                          key={tech}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-[#111A2E] text-[#CBD5E1] border border-[#1E293B]"
                        >
                          {getTechIcon(tech)}
                          <span>{tech}</span>
                        </span>
                      ))}
                    </div>

                    {/* Description */}
                    <p className="text-xs text-[#94A3B8] leading-relaxed line-clamp-3">
                      {project.shortDescription}
                    </p>

                    {/* Deadline if configured */}
                    {project.submissionDeadline && (
                      <div className="flex items-center gap-1.5 text-[11px] text-[#64748B] font-mono pt-1">
                        <Calendar className="w-3 h-3 text-purple-400" />
                        <span>Deadline: {project.submissionDeadline}</span>
                      </div>
                    )}
                  </div>

                  {/* Bottom: Score or Action */}
                  <div className="pt-4 mt-4 border-t border-[#152136] flex items-center justify-between">
                    <span className="text-[11px] text-[#64748B]">
                      {isLocked ? 'Prerequisites required' : 'Ready to start'}
                    </span>

                    <button
                      disabled={isLocked}
                      onClick={() => setActiveProjectId(project.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isLocked
                          ? 'bg-[#152138] text-[#64748B] cursor-not-allowed'
                          : 'bg-[#7C3AED] hover:bg-purple-600 text-white shadow-xs hover:scale-[1.02] active:scale-[0.98]'
                      }`}
                    >
                      {isLocked ? <Lock className="w-3.5 h-3.5" /> : null}
                      <span>{isLocked ? 'Locked' : 'View Project'}</span>
                      {!isLocked && <ArrowRight className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3B. Major Project (Separate, highlighted card) */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 font-mono flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-purple-400" />
              <span>Phase 2 Integrated Capstone (Major Project)</span>
            </h3>
            <span className="text-[11px] text-purple-300 font-mono font-bold">Predictive ML & Autonomous GenAI Agent</span>
          </div>

          {/* Prominent Card */}
          {(() => {
            const capstone2State = getProjectState(phase2MajorProject.id);
            const isLocked = capstone2State.status === 'Locked';
            return (
              <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-[#120E2E] via-[#18113A] to-[#120E2E] border-2 border-purple-500/50 hover:border-purple-400 shadow-xl shadow-purple-900/20 transition-all space-y-6 relative overflow-hidden group">
                
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#251D4B] pb-5 relative z-10">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-3 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono tracking-wider bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-300 border border-purple-500/40">
                        Final Premier Capstone
                      </span>
                      <span className="text-xs font-mono text-[#94A3B8]">
                        Full Stack AI & Live Panel Defense
                      </span>
                    </div>

                    <h4 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                      {phase2MajorProject.title}
                    </h4>

                    <p className="text-xs sm:text-sm text-[#CBD5E1] max-w-3xl leading-relaxed">
                      {phase2MajorProject.shortDescription}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-start lg:self-center">
                    <ProjectStatusBadge status={capstone2State.status} size="lg" />
                  </div>
                </div>

                {/* Key Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs relative z-10">
                  <div className="p-4 rounded-xl bg-[#080D1C]/80 border border-[#231E47] space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase text-purple-400 block">Business Problem</span>
                    <p className="text-[#CBD5E1] leading-relaxed line-clamp-3">
                      {phase2MajorProject.businessContext}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#080D1C]/80 border border-[#231E47] space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase text-[#38BDF8] block">Required Skills</span>
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      {phase2MajorProject.technologies.map(t => (
                        <span key={t} className="px-2 py-0.5 rounded bg-[#1C163D] text-white border border-[#2F265C] text-[10px] font-semibold">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#080D1C]/80 border border-[#231E47] space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase text-amber-400 block">Capstone Defense</span>
                    <p className="text-[#CBD5E1] leading-relaxed">
                      Live technical defense before senior hiring committee. Automated AI agents, API deployment, and business presentation.
                    </p>
                  </div>
                </div>

                {/* Bottom Actions Row */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[#251D4B] relative z-10">
                  <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
                    <Clock className="w-3.5 h-3.5 text-purple-400" />
                    <span>Unlocks upon completion of Phase 2 Modules (5, 6, 7)</span>
                  </div>

                  <button
                    disabled={isLocked}
                    onClick={() => setActiveProjectId(phase2MajorProject.id)}
                    className={`px-6 py-2.5 rounded-xl text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isLocked
                        ? 'bg-[#1E1938] text-[#94A3B8] border border-[#2B2352] cursor-not-allowed'
                        : 'bg-gradient-to-r from-[#7C3AED] to-[#2563EB] hover:scale-[1.02] active:scale-[0.98]'
                    }`}
                  >
                    {isLocked ? <Lock className="w-4 h-4" /> : null}
                    <span>{isLocked ? 'Capstone Locked' : 'View Capstone Workspace'}</span>
                    {!isLocked && <ArrowRight className="w-4 h-4" />}
                  </button>
                </div>

              </div>
            );
          })()}
        </div>

      </section>

    </div>
  );
};
