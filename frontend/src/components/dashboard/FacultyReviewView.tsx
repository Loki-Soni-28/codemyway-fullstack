import React, { useState, useEffect } from 'react';
import { api } from '../../api';
import { 
  Briefcase, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ExternalLink, 
  Github, 
  User, 
  LogOut, 
  Check, 
  X, 
  Send, 
  RotateCcw,
  Sparkles,
  Trophy,
  ArrowRight,
  Calendar,
  Video,
  Plus,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import codemywayLogo from '../../assets/images/codemyway_logo.png';
import { StudentUser } from '../../types';
import { FacultyWeeklyCheckInView } from './FacultyWeeklyCheckInView';
import { AdminWeeklyCheckInView } from './AdminWeeklyCheckInView';

interface FacultyReviewViewProps {
  currentUser: StudentUser;
  onLogout: () => void;
  onOpenStudentPortal?: () => void;
  onNavigateHome: () => void;
}

interface FacultyMentorshipSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  bookedSession?: {
    id: string;
    studentName: string;
    studentEmail: string;
    topic: string;
    zoomLink?: string;
    status: string;
    notes?: string;
    feedback?: string;
    actionItems?: any[];
  } | null;
}

interface FacultySubmission {
  id: string;
  projectId: string;
  projectTitle: string;
  courseTitle: string;
  difficulty: string;
  student: {
    id: string;
    name: string;
    email: string;
  };
  version: number;
  projectDescription: string;
  githubRepoUrl?: string;
  liveDashboardUrl?: string;
  demoVideoUrl?: string;
  files: { fileName: string; fileSize?: string; fileType?: string }[];
  status: 'Submitted' | 'Under Review' | 'Revision Required' | 'Resubmitted' | 'Approved';
  submittedAt: string;
  review?: {
    id: string;
    overallScore?: number;
    maxScore: number;
    writtenFeedback: string;
    status: string;
    reviewedAt: string;
    reviewerName: string;
  } | null;
}

export const FacultyReviewView: React.FC<FacultyReviewViewProps> = ({
  currentUser,
  onLogout,
  onOpenStudentPortal,
  onNavigateHome
}) => {
  const [submissions, setSubmissions] = useState<FacultySubmission[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');

  // Navigation tab: 'projects' or 'mentorship'
  const [activeTab, setActiveTab] = useState<'projects' | 'mentorship' | 'weekly-checkins'>('weekly-checkins');

  // Mentorship Slots State
  const [mentorSlots, setMentorSlots] = useState<FacultyMentorshipSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState<boolean>(false);
  const [newSlotDate, setNewSlotDate] = useState<string>('');
  const [newSlotStartTime, setNewSlotStartTime] = useState<string>('14:00');
  const [newSlotEndTime, setNewSlotEndTime] = useState<string>('14:45');
  const [isCreatingSlot, setIsCreatingSlot] = useState<boolean>(false);

  // Selected session to update link / notes / status
  const [selectedSessionToEdit, setSelectedSessionToEdit] = useState<any | null>(null);
  const [editSessionZoomLink, setEditSessionZoomLink] = useState<string>('');
  const [editSessionStatus, setEditSessionStatus] = useState<string>('SCHEDULED');
  const [editSessionNotes, setEditSessionNotes] = useState<string>('');
  const [isUpdatingSession, setIsUpdatingSession] = useState<boolean>(false);

  const fetchMentorSlots = async () => {
    setIsLoadingSlots(true);
    try {
      const res = await api<{ success: boolean; slots: FacultyMentorshipSlot[] }>('/faculty/mentor-slots');
      if (res && res.success) {
        setMentorSlots(res.slots);
      }
    } catch (err: any) {
      console.error('Failed to load mentor slots:', err);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const handleCreateSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlotDate || !newSlotStartTime || !newSlotEndTime) {
      alert('Please provide slot date, start time, and end time.');
      return;
    }
    setIsCreatingSlot(true);
    try {
      const res = await api<{ success: boolean; slot: any; message?: string }>('/faculty/mentor-slots', {
        method: 'POST',
        body: {
          date: newSlotDate,
          startTime: newSlotStartTime,
          endTime: newSlotEndTime
        }
      });
      if (res && res.success) {
        setToastMessage('Mentorship availability slot published!');
        setTimeout(() => setToastMessage(null), 4000);
        fetchMentorSlots();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to create availability slot.');
    } finally {
      setIsCreatingSlot(false);
    }
  };

  const handleUpdateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSessionToEdit) return;
    setIsUpdatingSession(true);
    try {
      const res = await api<{ success: boolean; message: string }>(`/faculty/mentor-sessions/${selectedSessionToEdit.id}`, {
        method: 'POST',
        body: {
          status: editSessionStatus,
          zoomLink: editSessionZoomLink,
          notes: editSessionNotes
        }
      });
      if (res && res.success) {
        setToastMessage(res.message || 'Mentorship session updated!');
        setTimeout(() => setToastMessage(null), 4000);
        setSelectedSessionToEdit(null);
        fetchMentorSlots();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update session.');
    } finally {
      setIsUpdatingSession(false);
    }
  };

  // Selected Submission for Review Modal
  const [activeSubmission, setActiveSubmission] = useState<FacultySubmission | null>(null);

  // Review Form States
  const [reviewStatus, setReviewStatus] = useState<'Under Review' | 'Revision Required' | 'Approved'>('Approved');
  const [overallScore, setOverallScore] = useState<number>(85);
  const [writtenFeedback, setWrittenFeedback] = useState<string>('');
  const [strengths, setStrengths] = useState<string>('');
  const [improvementAreas, setImprovementAreas] = useState<string>('');
  const [revisionInstructions, setRevisionInstructions] = useState<string>('');
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchSubmissions = async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const res = await api<{ success: boolean; submissions: FacultySubmission[] }>('/faculty/project-reviews');
      if (res && res.success) {
        setSubmissions(res.submissions);
      }
    } catch (err: any) {
      console.error('Failed to load faculty submissions:', err);
      setFetchError(err.message || 'Unable to load assigned submissions.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
    fetchMentorSlots();
  }, []);

  const handleOpenReviewModal = (sub: FacultySubmission) => {
    setActiveSubmission(sub);
    setFormError(null);
    if (sub.review) {
      setReviewStatus(sub.review.status as any || 'Approved');
      setOverallScore(sub.review.overallScore || 85);
      setWrittenFeedback(sub.review.writtenFeedback || '');
    } else {
      setReviewStatus(sub.status === 'Revision Required' ? 'Revision Required' : 'Approved');
      setOverallScore(85);
      setWrittenFeedback('');
      setStrengths('');
      setImprovementAreas('');
      setRevisionInstructions('');
    }
  };

  const handleSubmitReview = async () => {
    if (!activeSubmission) return;
    setFormError(null);

    if (!writtenFeedback.trim()) {
      setFormError('Written feedback is required.');
      return;
    }

    if (overallScore < 0 || overallScore > 100) {
      setFormError('Overall score must be between 0 and 100.');
      return;
    }

    setIsSubmittingReview(true);
    try {
      const strengthsArr = strengths.split('\n').map(s => s.trim()).filter(Boolean);
      const improvementsArr = improvementAreas.split('\n').map(s => s.trim()).filter(Boolean);

      const res = await api<{ success: boolean; message: string }>('/faculty/project-reviews', {
        method: 'POST',
        body: {
          submissionId: activeSubmission.id,
          status: reviewStatus,
          overallScore: Number(overallScore),
          writtenFeedback: writtenFeedback.trim(),
          strengths: strengthsArr,
          improvementAreas: improvementsArr,
          revisionInstructions: revisionInstructions.trim() || undefined
        }
      });

      if (res && res.success) {
        setToastMessage(`Review submitted: Marked as ${reviewStatus}!`);
        setTimeout(() => setToastMessage(null), 3500);
        setActiveSubmission(null);
        fetchSubmissions();
      }
    } catch (err: any) {
      console.error('Error submitting review:', err);
      setFormError(err.message || 'Failed to submit review.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Distinct courses for filter dropdown
  const uniqueCourses = Array.from(new Set(submissions.map(s => s.courseTitle)));

  // Filtered submissions
  const filteredSubmissions = submissions.filter(sub => {
    const matchesSearch = 
      sub.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.projectTitle.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    const matchesCourse = selectedCourse === 'all' || sub.courseTitle === selectedCourse;

    return matchesSearch && matchesStatus && matchesCourse;
  });

  return (
    <div className="min-h-screen bg-[#070D1B] text-white font-sans flex flex-col">
      {/* Top Navbar */}
      <header className="w-full bg-[#0A1120] border-b border-[#1A263D] px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4 cursor-pointer" onClick={onNavigateHome}>
          <img src={codemywayLogo} alt="CodeMyWay" className="h-8 w-auto object-contain" />
          <div className="border-l border-[#1E293B] pl-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-purple-400 font-bold block">
              FACULTY PORTAL
            </span>
            <span className="text-xs text-[#CBD5E1] font-semibold">
              Project Review Committee
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#111A2E] border border-[#1E293B]">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-mono text-[#CBD5E1]">
              {currentUser.role}: <strong className="text-white">{currentUser.fullName}</strong>
            </span>
          </div>

          {onOpenStudentPortal && (
            <button
              onClick={onOpenStudentPortal}
              className="px-3 py-2 rounded-xl text-xs font-bold text-white bg-[#9B59B6]/30 hover:bg-[#9B59B6]/50 border border-[#9B59B6]/50 transition-colors cursor-pointer"
            >
              Student Portal
            </button>
          )}

          <button
            onClick={onLogout}
            title="Log out"
            className="p-2 rounded-xl text-[#94A3B8] hover:text-rose-400 hover:bg-[#152138] border border-[#1E293B] transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#1A263D] pb-3 flex-wrap">
          <button
            onClick={() => setActiveTab('weekly-checkins')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'weekly-checkins'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-[#94A3B8] hover:text-white bg-[#0A1120] border border-[#1A263D]'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Weekly Progress Check-Ins</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'projects'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-[#94A3B8] hover:text-white bg-[#0A1120] border border-[#1A263D]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Project Submissions ({submissions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('mentorship')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'mentorship'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-[#94A3B8] hover:text-white bg-[#0A1120] border border-[#1A263D]'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>1:1 Mentorship & Slots ({mentorSlots.length})</span>
          </button>
        </div>

{activeTab === 'weekly-checkins' ? (
  currentUser.role === 'ADMIN' ? (
    <AdminWeeklyCheckInView />
  ) : (
    <FacultyWeeklyCheckInView />
  )
) : activeTab === 'projects' ? (
    <>
        {/* Header Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0C1528] via-[#0E1A33] to-[#0A1120] border border-blue-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-md bg-purple-600/30 text-purple-300 border border-purple-500/40 text-[10px] font-mono font-bold uppercase">
                {currentUser.role} PANEL
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-white">Student Project Submissions</h1>
            </div>
            <p className="text-xs text-[#94A3B8]">
              Evaluate student project deliverables, review GitHub repositories, assign objective scores, and provide actionable feedback.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="p-3 rounded-xl bg-[#070D1B] border border-[#1A263D] text-center">
              <span className="text-[10px] text-[#64748B] block font-mono">ASSIGNED SUBMISSIONS</span>
              <span className="text-lg font-black text-white font-mono">{submissions.length}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#070D1B] border border-[#1A263D] text-center">
              <span className="text-[10px] text-[#64748B] block font-mono">PENDING REVIEW</span>
              <span className="text-lg font-black text-amber-400 font-mono">
                {submissions.filter(s => s.status === 'Submitted' || s.status === 'Resubmitted' || s.status === 'Under Review').length}
              </span>
            </div>
          </div>
        </div>

        {/* Search & Filter Strip */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name, email, or project title..."
              className="w-full pl-10 pr-4 py-2 bg-[#0A1120] border border-[#1A263D] focus:border-blue-500 rounded-xl text-xs text-white placeholder-[#64748B] outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 bg-[#0A1120] border border-[#1A263D] rounded-xl text-xs text-[#CBD5E1] outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="Submitted">Submitted (New)</option>
            <option value="Resubmitted">Resubmitted</option>
            <option value="Under Review">Under Review</option>
            <option value="Revision Required">Revision Required</option>
            <option value="Approved">Approved</option>
          </select>

          {uniqueCourses.length > 1 && (
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-3.5 py-2 bg-[#0A1120] border border-[#1A263D] rounded-xl text-xs text-[#CBD5E1] outline-none cursor-pointer"
            >
              <option value="all">All Courses</option>
              {uniqueCourses.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          )}

          <button
            onClick={() => fetchSubmissions()}
            className="px-3.5 py-2 rounded-xl bg-[#111A2E] hover:bg-[#1A263D] border border-[#1E293B] text-xs text-[#CBD5E1] flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>

        {/* Submissions List */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-16 space-y-3">
            <div className="w-10 h-10 rounded-full border-2 border-purple-500/20 border-t-purple-400 animate-spin" />
            <p className="text-xs text-[#94A3B8] font-mono tracking-wider animate-pulse">Loading Assigned Student Submissions...</p>
          </div>
        ) : fetchError ? (
          <div className="p-8 rounded-2xl bg-[#0D1527] border border-rose-500/30 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
            <h3 className="text-sm font-bold text-white">Failed to Load Submissions</h3>
            <p className="text-xs text-[#94A3B8]">{fetchError}</p>
            <button
              onClick={fetchSubmissions}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="p-12 rounded-2xl bg-[#0A1120] border border-[#1A263D] text-center space-y-2">
            <Briefcase className="w-8 h-8 text-[#64748B] mx-auto opacity-50" />
            <h3 className="text-sm font-bold text-white">No Submissions Found</h3>
            <p className="text-xs text-[#94A3B8]">
              {searchQuery || statusFilter !== 'all'
                ? 'No project submissions match the selected filters.'
                : 'No students have submitted projects in your assigned cohort yet.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredSubmissions.map((sub) => (
              <div
                key={sub.id}
                className="p-5 rounded-2xl bg-[#0A1120] border border-[#1A263D] hover:border-[#2A3756] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono text-[10px] font-bold">
                      {sub.courseTitle}
                    </span>
                    <span className="text-xs text-[#64748B]">•</span>
                    <span className="text-xs text-[#94A3B8] font-mono">
                      Version {sub.version}
                    </span>
                    <span className="text-xs text-[#64748B]">•</span>
                    <span className="text-xs text-[#94A3B8]">
                      {new Date(sub.submittedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white">{sub.projectTitle}</h3>

                  <div className="flex items-center gap-2 text-xs text-[#CBD5E1]">
                    <div className="w-5 h-5 rounded-full bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-[10px] text-purple-300 font-bold">
                      {sub.student.name[0]}
                    </div>
                    <span className="font-semibold text-white">{sub.student.name}</span>
                    <span className="text-[#64748B]">({sub.student.email})</span>
                  </div>

                  <p className="text-xs text-[#94A3B8] line-clamp-2 leading-relaxed">
                    {sub.projectDescription}
                  </p>

                  <div className="flex items-center gap-4 text-xs pt-1">
                    {sub.githubRepoUrl && (
                      <a
                        href={sub.githubRepoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>GitHub Repo</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {sub.liveDashboardUrl && (
                      <a
                        href={sub.liveDashboardUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-purple-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                      >
                        <span>Live Dashboard</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {sub.files && sub.files.length > 0 && (
                      <span className="text-[#64748B] text-[11px]">
                        {sub.files.length} attached file(s)
                      </span>
                    )}
                  </div>
                </div>

                {/* Status & Review Action */}
                <div className="flex md:flex-col items-center md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-[#152136] shrink-0">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold font-mono ${
                      sub.status === 'Approved'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : sub.status === 'Revision Required'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                        : sub.status === 'Resubmitted'
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    }`}>
                      {sub.status}
                    </span>
                    {sub.review?.overallScore !== undefined && (
                      <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/30">
                        {sub.review.overallScore}/100
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleOpenReviewModal(sub)}
                    className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/20 cursor-pointer"
                  >
                    <span>{sub.review ? 'Update Review' : 'Evaluate & Review'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
    </>
  ) : (
    /* ========================================================
       MENTORSHIP SLOTS & 1:1 SESSIONS MANAGEMENT
       ======================================================== */
    <div className="space-y-6">
      {/* Mentorship Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0C1528] via-[#0E1A33] to-[#0A1120] border border-blue-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md bg-blue-600/30 text-blue-300 border border-blue-500/40 text-[10px] font-mono font-bold uppercase">
              1:1 MENTORSHIP MANAGER
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white">Availability Slots & Student Sessions</h1>
          </div>
          <p className="text-xs text-[#94A3B8]">
            Publish your calendar slots for assigned cohort students, join scheduled meetings, and update session outcomes.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="p-3 rounded-xl bg-[#070D1B] border border-[#1A263D] text-center">
            <span className="text-[10px] text-[#64748B] block font-mono">TOTAL SLOTS</span>
            <span className="text-lg font-black text-white font-mono">{mentorSlots.length}</span>
          </div>
          <div className="p-3 rounded-xl bg-[#070D1B] border border-[#1A263D] text-center">
            <span className="text-[10px] text-[#64748B] block font-mono">BOOKED SESSIONS</span>
            <span className="text-lg font-black text-emerald-400 font-mono">
              {mentorSlots.filter(s => s.isBooked).length}
            </span>
          </div>
        </div>
      </div>

      {/* Add Slot Form Card */}
      <div className="p-5 rounded-2xl bg-[#0A1120] border border-[#1A263D] space-y-4">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <Plus className="w-4 h-4 text-blue-400" />
          <span>Publish New Availability Slot</span>
        </div>

        <form onSubmit={handleCreateSlot} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-[#94A3B8] block">Date (YYYY-MM-DD)</label>
            <input
              type="date"
              required
              value={newSlotDate}
              onChange={(e) => setNewSlotDate(e.target.value)}
              className="w-full px-3 py-2 bg-[#070D1B] border border-[#1F2E4D] rounded-xl text-xs text-white outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-[#94A3B8] block">Start Time (HH:mm)</label>
            <input
              type="time"
              required
              value={newSlotStartTime}
              onChange={(e) => setNewSlotStartTime(e.target.value)}
              className="w-full px-3 py-2 bg-[#070D1B] border border-[#1F2E4D] rounded-xl text-xs text-white outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-[#94A3B8] block">End Time (HH:mm)</label>
            <input
              type="time"
              required
              value={newSlotEndTime}
              onChange={(e) => setNewSlotEndTime(e.target.value)}
              className="w-full px-3 py-2 bg-[#070D1B] border border-[#1F2E4D] rounded-xl text-xs text-white outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isCreatingSlot || !newSlotDate}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-blue-600/20 disabled:opacity-50 cursor-pointer h-9.5"
          >
            {isCreatingSlot ? 'Publishing...' : 'Add Slot'}
          </button>
        </form>
      </div>

      {/* Slots & Booked Sessions List */}
      <div className="space-y-3">
        <h2 className="text-xs font-mono font-bold text-[#94A3B8] uppercase tracking-wider">
          Managed Slots & Student Bookings
        </h2>

        {isLoadingSlots ? (
          <div className="p-12 text-center text-xs text-[#64748B]">Loading your mentorship schedule...</div>
        ) : mentorSlots.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#0A1120] border border-[#1A263D] text-xs text-[#94A3B8]">
            No availability slots created yet. Use the form above to publish time slots for students.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {mentorSlots.map((slot) => (
              <div
                key={slot.id}
                className="p-4 rounded-xl bg-[#0A1120] border border-[#1A263D] flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white text-xs">{slot.date}</span>
                    <span className="text-xs text-[#64748B]">•</span>
                    <span className="font-mono text-xs text-blue-400">{slot.startTime} - {slot.endTime}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      slot.isBooked
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-[#152238] text-[#94A3B8] border border-[#20314E]'
                    }`}>
                      {slot.isBooked ? 'Booked by Student' : 'Open / Unbooked'}
                    </span>
                  </div>

                  {slot.bookedSession ? (
                    <div className="pt-1 space-y-1">
                      <div className="text-xs text-[#CBD5E1]">
                        Student: <strong className="text-white">{slot.bookedSession.studentName}</strong> ({slot.bookedSession.studentEmail})
                      </div>
                      <div className="text-xs text-[#94A3B8]">
                        Topic: <span className="text-white italic">"{slot.bookedSession.topic}"</span>
                      </div>
                      {slot.bookedSession.zoomLink && (
                        <div className="text-xs text-emerald-400 font-mono">
                          Meeting Link: <a href={slot.bookedSession.zoomLink} target="_blank" rel="noreferrer" className="underline">{slot.bookedSession.zoomLink}</a>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-[11px] text-[#64748B]">This slot is visible on the student booking calendar.</p>
                  )}
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  {slot.bookedSession && (
                    <button
                      onClick={() => {
                        setSelectedSessionToEdit(slot.bookedSession);
                        setEditSessionZoomLink(slot.bookedSession?.zoomLink || '');
                        setEditSessionStatus(slot.bookedSession?.status || 'SCHEDULED');
                        setEditSessionNotes(slot.bookedSession?.notes || '');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#142036] hover:bg-[#1D2E4D] text-xs font-semibold text-[#38BDF8] border border-[#223555] transition-colors cursor-pointer"
                    >
                      Update Meeting / Status
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )}

      </main>

      {/* Mentorship Session Update Modal */}
      <AnimatePresence>
        {selectedSessionToEdit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg bg-[#0A1120] border border-[#1A263D] rounded-2xl p-6 text-white space-y-4 shadow-2xl relative"
            >
              <button
                onClick={() => setSelectedSessionToEdit(null)}
                className="absolute top-4 right-4 p-1.5 text-[#94A3B8] hover:text-white rounded-lg hover:bg-[#152138] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-base text-white">Update 1:1 Mentorship Session</h3>
              </div>

              <div className="p-3 rounded-xl bg-[#070D1B] border border-[#182338] text-xs space-y-1">
                <div>Student: <strong className="text-white">{selectedSessionToEdit.studentName}</strong></div>
                <div>Topic: <span className="text-[#38BDF8] italic">"{selectedSessionToEdit.topic}"</span></div>
              </div>

              <form onSubmit={handleUpdateSession} className="space-y-3 pt-1">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-[#94A3B8]">Session Status</label>
                  <select
                    value={editSessionStatus}
                    onChange={(e) => setEditSessionStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-[#070D1B] border border-[#1F2E4D] rounded-xl text-xs text-white outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="SCHEDULED">Scheduled</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled (Releases Slot)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-[#94A3B8]">Meeting URL (Google Meet / Zoom / Teams)</label>
                  <input
                    type="url"
                    value={editSessionZoomLink}
                    onChange={(e) => setEditSessionZoomLink(e.target.value)}
                    placeholder="https://meet.google.com/xyz-abc or https://zoom.us/j/..."
                    className="w-full px-3 py-2 bg-[#070D1B] border border-[#1F2E4D] rounded-xl text-xs text-white outline-none focus:border-blue-500 font-mono"
                  />
                  <span className="text-[10px] text-[#64748B]">
                    Students will see a Join Meeting button once this URL is saved.
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-[#94A3B8]">Session Notes & Action Items</label>
                  <textarea
                    rows={3}
                    value={editSessionNotes}
                    onChange={(e) => setEditSessionNotes(e.target.value)}
                    placeholder="Enter discussion summary, strengths, and student action items..."
                    className="w-full px-3 py-2 bg-[#070D1B] border border-[#1F2E4D] rounded-xl text-xs text-white outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedSessionToEdit(null)}
                    className="px-4 py-2 rounded-xl border border-[#1E293B] text-xs font-semibold text-[#94A3B8] hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdatingSession}
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isUpdatingSession ? 'Saving...' : 'Save Session'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Review Modal Drawer */}
      <AnimatePresence>
        {activeSubmission && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-[#0D1527] border border-[#1E293B] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-4 bg-[#0A1120] border-b border-[#1A263D] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-purple-400 uppercase font-bold block">
                    PROJECT EVALUATION
                  </span>
                  <h3 className="text-sm font-bold text-white">{activeSubmission.projectTitle}</h3>
                </div>
                <button
                  onClick={() => setActiveSubmission(null)}
                  className="p-1 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#1A263D] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
                {/* Student Info & Submission Details */}
                <div className="p-4 rounded-xl bg-[#080D1C] border border-[#1A263D] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[#94A3B8]">Student: <strong className="text-white">{activeSubmission.student.name}</strong> ({activeSubmission.student.email})</span>
                    <span className="font-mono text-blue-400">Version {activeSubmission.version}</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] block font-mono text-[10px] uppercase">PROJECT DESCRIPTION:</span>
                    <p className="text-[#CBD5E1] mt-0.5">{activeSubmission.projectDescription}</p>
                  </div>

                  <div className="flex items-center gap-4 pt-1">
                    {activeSubmission.githubRepoUrl && (
                      <a href={activeSubmission.githubRepoUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline flex items-center gap-1 font-mono">
                        <Github className="w-3.5 h-3.5" />
                        <span>Inspect GitHub Repository</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {activeSubmission.liveDashboardUrl && (
                      <a href={activeSubmission.liveDashboardUrl} target="_blank" rel="noreferrer" className="text-purple-400 hover:underline flex items-center gap-1 font-mono">
                        <span>Live Dashboard</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Evaluation Status & Score */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[#CBD5E1] font-bold uppercase tracking-wider text-[11px] block">
                      Evaluation Decision <span className="text-rose-400">*</span>
                    </label>
                    <select
                      value={reviewStatus}
                      onChange={(e) => setReviewStatus(e.target.value as any)}
                      className="w-full p-2.5 bg-[#080D1C] border border-[#1A263D] focus:border-blue-500 rounded-xl text-white outline-none cursor-pointer"
                    >
                      <option value="Approved">Approved (Pass)</option>
                      <option value="Revision Required">Revision Required (Resubmit)</option>
                      <option value="Under Review">Under Review (Hold)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[#CBD5E1] font-bold uppercase tracking-wider text-[11px] block">
                      Score (out of 100) <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={overallScore}
                      onChange={(e) => setOverallScore(Number(e.target.value))}
                      className="w-full p-2.5 bg-[#080D1C] border border-[#1A263D] focus:border-blue-500 rounded-xl text-white font-mono outline-none"
                    />
                  </div>
                </div>

                {/* Written Feedback */}
                <div className="space-y-1.5">
                  <label className="text-[#CBD5E1] font-bold uppercase tracking-wider text-[11px] block">
                    Written Feedback / Summary <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    value={writtenFeedback}
                    onChange={(e) => setWrittenFeedback(e.target.value)}
                    rows={3}
                    placeholder="Provide constructive assessment of project architecture, data validation, and deliverables..."
                    className="w-full p-3 bg-[#080D1C] border border-[#1A263D] focus:border-blue-500 rounded-xl text-white placeholder-[#64748B] outline-none"
                  />
                </div>

                {/* Key Strengths (one per line) */}
                <div className="space-y-1.5">
                  <label className="text-[#CBD5E1] font-bold uppercase tracking-wider text-[11px] block">
                    Key Strengths (one per line)
                  </label>
                  <textarea
                    value={strengths}
                    onChange={(e) => setStrengths(e.target.value)}
                    rows={2}
                    placeholder="E.g. Clean SQL CTE architecture&#10;Robust handling of NULL invoice values"
                    className="w-full p-3 bg-[#080D1C] border border-[#1A263D] focus:border-blue-500 rounded-xl text-white placeholder-[#64748B] outline-none"
                  />
                </div>

                {/* Revision Instructions (if Revision Required) */}
                {reviewStatus === 'Revision Required' && (
                  <div className="space-y-1.5">
                    <label className="text-amber-300 font-bold uppercase tracking-wider text-[11px] block">
                      Required Revision Instructions <span className="text-rose-400">*</span>
                    </label>
                    <textarea
                      value={revisionInstructions}
                      onChange={(e) => setRevisionInstructions(e.target.value)}
                      rows={2}
                      placeholder="Specify what exact changes the student must make before re-submitting..."
                      className="w-full p-3 bg-[#171124] border border-amber-500/40 focus:border-amber-400 rounded-xl text-white placeholder-[#94A3B8] outline-none"
                    />
                  </div>
                )}

                {formError && (
                  <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{formError}</span>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-[#0A1120] border-t border-[#1A263D] flex items-center justify-between">
                <button
                  onClick={() => setActiveSubmission(null)}
                  className="px-4 py-2 rounded-xl border border-[#1E293B] hover:bg-[#1A263D] text-[#CBD5E1] text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSubmitReview}
                  disabled={isSubmittingReview || !writtenFeedback.trim()}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-purple-600/30"
                >
                  {isSubmittingReview ? (
                    <>
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                      <span>Saving Evaluation...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Review to Student</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
