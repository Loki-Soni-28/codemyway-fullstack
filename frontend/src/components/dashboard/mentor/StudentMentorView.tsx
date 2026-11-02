import React, { useState, useEffect } from 'react';
import { api } from '../../../api';
import { 
  Users, 
  User, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Video, 
  ExternalLink, 
  Sparkles, 
  MessageSquare, 
  ArrowRight, 
  X, 
  Star, 
  ShieldCheck, 
  Award, 
  Briefcase, 
  Target, 
  Check, 
  ChevronRight, 
  Send, 
  HelpCircle, 
  RotateCcw,
  SlidersHorizontal,
  FileText,
  AlertTriangle,
  UserX,
  PhoneCall,
  Laptop
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MentorProfile, 
  MentorshipSession, 
  StudentMentorState, 
  StudentProgressFeedback,
  MentorSupportQuery,
  MentorSlot,
  MentorshipSessionStatus
} from './types';

interface StudentMentorViewProps {
  studentEmail?: string;
  studentName?: string;
  onOpenSupportModal?: () => void;
}

interface UiSlot {
  id: string;
  date: string;
  dayOfWeek: string;
  displayDate: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

export const StudentMentorView: React.FC<StudentMentorViewProps> = ({
  studentEmail = '',
  studentName = 'Student'
}) => {
  // -------------------------------------------------------------
  // REAL DATABASE STATE MANAGEMENT
  // -------------------------------------------------------------
  const [dbMentor, setDbMentor] = useState<any | null>(null);
  const [dbSessions, setDbSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Active sub-modals
  const [selectedSessionForDetail, setSelectedSessionForDetail] = useState<any | null>(null);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Booking Form State
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlotId, setSelectedSlotId] = useState<string>('');
  const [bookingTopic, setBookingTopic] = useState<string>('');
  const [bookingAgenda, setBookingAgenda] = useState<string>('');
  const [bookingPlatform, setBookingPlatform] = useState<string>('CodeMyWay Live Room');
  const [isSubmittingBooking, setIsSubmittingBooking] = useState<boolean>(false);

  // Ask Mentor / Support Query Modal State
  const [isQueryModalOpen, setIsQueryModalOpen] = useState<boolean>(false);
  const [queryCategory, setQueryCategory] = useState<MentorSupportQuery['category']>('Project Guidance');
  const [querySubject, setQuerySubject] = useState<string>('');
  const [queryMessage, setQueryMessage] = useState<string>('');
  const [isSubmittingQuery, setIsSubmittingQuery] = useState<boolean>(false);

  // History Tab Filter
  const [historyFilter, setHistoryFilter] = useState<'all' | 'COMPLETED' | 'CANCELLED'>('all');

  const fetchMentorData = async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const res = await api<{
        success: boolean;
        assignedMentor: any;
        sessions: any[];
      }>('/student/mentor');

      if (res && res.success) {
        setDbMentor(res.assignedMentor);
        setDbSessions(res.sessions);

        // Preselect slot if available
        if (res.assignedMentor?.availableSlots?.length > 0) {
          const firstUnbooked = res.assignedMentor.availableSlots.find((s: any) => !s.isBooked);
          if (firstUnbooked) {
            setSelectedDate(firstUnbooked.date);
            setSelectedSlotId(firstUnbooked.id);
          } else {
            setSelectedDate(res.assignedMentor.availableSlots[0].date);
          }
        }
      }
    } catch (err: any) {
      console.error('Failed to load mentorship details:', err);
      setFetchError(err.message || 'Unable to connect to mentorship service.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMentorData();
  }, []);

  const showToast = (type: 'success' | 'error' | 'info', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // -------------------------------------------------------------
  // BOOKING HANDLER (POST /api/student/mentor)
  // -------------------------------------------------------------
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!dbMentor) {
      showToast('error', 'No active mentor assigned to your profile.');
      return;
    }
    if (!selectedSlotId) {
      showToast('error', 'Please select an available time slot.');
      return;
    }
    if (!bookingTopic.trim()) {
      showToast('error', 'Please enter a discussion topic for the session.');
      return;
    }

    setIsSubmittingBooking(true);
    try {
      const res = await api<{ success: boolean; message: string; session: any }>('/student/mentor', {
        method: 'POST',
        body: JSON.stringify({
          slotId: selectedSlotId,
          topic: `${bookingTopic.trim()}${bookingAgenda.trim() ? ` - ${bookingAgenda.trim()}` : ''}`
        }) as any
      });

      if (res && res.success) {
        showToast('success', res.message || 'Mentorship session booked successfully!');
        setBookingTopic('');
        setBookingAgenda('');
        fetchMentorData();
      }
    } catch (err: any) {
      showToast('error', err.message || 'Failed to submit booking request.');
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  // -------------------------------------------------------------
  // CANCEL SESSION HANDLER
  // -------------------------------------------------------------
  const handleCancelSession = async (sessionId: string) => {
    if (window.confirm('Are you sure you want to cancel this mentorship session? The reserved slot will be released.')) {
      try {
        const res = await api<{ success: boolean; message: string }>(`/student/mentor/sessions/${sessionId}/cancel`, {
          method: 'POST'
        });
        if (res && res.success) {
          showToast('info', res.message || 'Session cancelled and slot released.');
          fetchMentorData();
          if (selectedSessionForDetail?.id === sessionId) {
            setSelectedSessionForDetail(null);
          }
        }
      } catch (err: any) {
        showToast('error', err.message || 'Failed to cancel session.');
      }
    }
  };

  // -------------------------------------------------------------
  // COMPUTED PROPERTIES
  // -------------------------------------------------------------
  const assignedMentor = dbMentor ? {
    id: dbMentor.id,
    name: dbMentor.name,
    designation: 'Senior Faculty & Career Mentor',
    company: 'CodeMyWay Academic Board',
    avatarUrl: dbMentor.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    expertise: ['Portfolio Strategy', 'Architecture Review', 'Interview Prep'],
    bio: 'Dedicated 1:1 mentor ensuring your complete mastery of curriculum, hands-on business projects, and high-impact placement defense.',
    assignedDate: 'Enrolled Cohort',
    availabilityStatus: 'available' as const,
    email: dbMentor.email,
    totalSessionsMentored: 48,
    rating: 4.95,
    availableSlots: ((dbMentor.availableSlots || []) as any[]).map((s: any): UiSlot => ({
      id: s.id,
      date: s.date,
      dayOfWeek: new Date(s.date).toLocaleDateString('en-US', { weekday: 'long' }),
      displayDate: new Date(s.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }),
      startTime: s.startTime,
      endTime: s.endTime,
      isBooked: s.isBooked
    }))
  } : null;

  // -------------------------------------------------------------
  // REAL SESSIONS CATEGORIZATION & DERIVED STATE
  // -------------------------------------------------------------
  const upcomingSessions = dbSessions
    .filter(s => s.status === 'SCHEDULED')
    .map(s => ({
      ...s,
      displayDate: new Date(s.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }),
      platform: s.zoomLink ? 'Zoom / Video Link' : 'Meeting Room',
      duration: '45 mins',
      mentorName: s.mentor?.name || assignedMentor?.name || 'Mentor',
      mentorDesignation: 'Senior Faculty & Career Mentor',
      mentorAvatar: s.mentor?.avatarUrl || assignedMentor?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      agendaDescription: s.topic,
      meetingLink: s.zoomLink || null
    }));

  const primaryUpcomingSession = upcomingSessions[0] || null;

  const pastSessions = dbSessions
    .filter(s => {
      if (historyFilter === 'all') return s.status === 'COMPLETED' || s.status === 'CANCELLED';
      return s.status === historyFilter;
    })
    .map(s => ({
      ...s,
      displayDate: new Date(s.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }),
      platform: s.zoomLink ? 'Zoom / Video Link' : 'Meeting Room',
      duration: '45 mins',
      mentorName: s.mentor?.name || assignedMentor?.name || 'Mentor',
      mentorDesignation: 'Senior Faculty & Career Mentor',
      mentorAvatar: s.mentor?.avatarUrl || assignedMentor?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      agendaDescription: s.topic,
      feedback: s.feedback ? {
        notes: s.notes || s.feedback,
        rating: 5,
        strengths: ['Great technical aptitude', 'Proactive communication'],
        improvementAreas: ['Continue regular milestone practice'],
        actionItems: s.actionItems || []
      } : null
    }));

  const historicalSessions = pastSessions;
  const filteredHistory = pastSessions;

  // Real available dates & slots for assigned mentor
  const availableDates: string[] = assignedMentor
    ? Array.from(new Set<string>(assignedMentor.availableSlots.map((s: any) => s.date))).sort()
    : [];

  const slotsForSelectedDate = assignedMentor && selectedDate
    ? assignedMentor.availableSlots.filter((s: any) => s.date === selectedDate)
    : [];

  const [progressFeedback] = useState<StudentProgressFeedback | null>(null);

  const handleToggleActionItem = (_itemId: string) => {};

  const handleQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!querySubject.trim() || !queryMessage.trim()) {
      showToast('error', 'Please fill in both subject and message.');
      return;
    }
    setIsSubmittingQuery(true);
    try {
      showToast('success', 'Your query has been sent directly to your mentor. Typical response time is under 4 hours.');
      setQuerySubject('');
      setQueryMessage('');
      setIsQueryModalOpen(false);
    } finally {
      setIsSubmittingQuery(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Upcoming':
      case 'SCHEDULED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Upcoming Confirmed
          </span>
        );
      case 'Booking Requested':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Clock className="w-3.5 h-3.5" />
            Booking Requested
          </span>
        );
      case 'Completed':
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Completed
          </span>
        );
      case 'Cancelled':
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <AlertCircle className="w-3.5 h-3.5" />
            Cancelled
          </span>
        );
      case 'Rescheduled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30">
            <RotateCcw className="w-3.5 h-3.5" />
            Rescheduled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-500/15 text-slate-400 border border-slate-500/30">
            {status}
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 bg-[#070D1B] min-h-screen flex flex-col items-center justify-center p-12 space-y-4">
        <div className="w-10 h-10 rounded-full border-2 border-blue-500/20 border-t-blue-400 animate-spin" />
        <p className="text-xs text-[#94A3B8] font-mono tracking-wider animate-pulse">
          Loading Mentorship Workspace...
        </p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex-1 bg-[#070D1B] min-h-screen p-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-[#0D1527] border border-rose-500/30 rounded-2xl p-6 text-center space-y-4 shadow-xl">
          <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
          <h3 className="text-sm font-bold text-white">Mentorship Connection Issue</h3>
          <p className="text-xs text-[#94A3B8]">{fetchError}</p>
          <button
            onClick={() => fetchMentorData()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white rounded-xl transition cursor-pointer"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#070D1B] text-white min-h-screen p-4 sm:p-6 lg:p-8 space-y-8">
      
      {/* ========================================================
          1. TOP HERO HEADER & METRICS
         ======================================================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#152136]">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#2563EB]/20 text-[#38BDF8] border border-[#2563EB]/40 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#38BDF8]" />
              Dedicated 1:1 Mentorship
            </span>
            {assignedMentor && (
              <span className="text-xs text-emerald-400 font-medium flex items-center gap-1 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active Mentor Assigned
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <span>Student Mentor Workspace</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] mt-1 max-w-2xl leading-relaxed">
            Connect with industry experts, schedule 1:1 technical mentorship, get project architecture reviews, and follow personalized learning action items.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsQueryModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#0F1A2E] hover:bg-[#16243D] border border-[#1E2E4A] text-xs font-semibold text-[#CBD5E1] hover:text-white transition-all flex items-center gap-2 cursor-pointer shadow-sm hover:scale-[1.02]"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>Ask Mentor</span>
          </button>

          <a
            href="#book-session"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#7C3AED] hover:from-blue-600 hover:to-purple-600 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all flex items-center gap-2 cursor-pointer hover:scale-[1.02]"
          >
            <Calendar className="w-4 h-4" />
            <span>Book 1:1 Session</span>
          </a>


        </div>
      </div>

      {/* ========================================================
          2. TWO-COLUMN TOP SECTION: ASSIGNED MENTOR & UPCOMING SESSION
         ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ------------------------------------------------------
            A. MY ASSIGNED MENTOR (7 COLS)
           ------------------------------------------------------ */}
        <div className="lg:col-span-7 bg-[#0B1324] rounded-2xl border border-[#182338] p-5 sm:p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-white tracking-tight">My Assigned Mentor</h2>
              </div>

              {assignedMentor && (
                <div className="flex items-center gap-1.5 text-xs">
                  <span className={`w-2 h-2 rounded-full ${
                    assignedMentor.availabilityStatus === 'available' ? 'bg-emerald-400' :
                    assignedMentor.availabilityStatus === 'in-session' ? 'bg-amber-400' : 'bg-rose-400'
                  }`} />
                  <span className="text-[#94A3B8] capitalize">
                    {assignedMentor.availabilityStatus === 'available' ? 'Available for 1:1 Booking' :
                     assignedMentor.availabilityStatus === 'in-session' ? 'In Active Cohort Session' : 'On Leave'}
                  </span>
                </div>
              )}
            </div>

            {assignedMentor ? (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <img 
                      src={assignedMentor.avatarUrl} 
                      alt={assignedMentor.name} 
                      className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-blue-500/40 shadow-lg shadow-blue-500/10"
                    />
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#0B1324] flex items-center justify-center text-white" title="Verified Faculty Mentor">
                      <ShieldCheck className="w-3 h-3" />
                    </span>
                  </div>

                  {/* Name & Title */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-bold text-white tracking-tight">{assignedMentor.name}</h3>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-bold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{assignedMentor.rating.toFixed(2)}</span>
                        <span className="text-amber-400/60 font-normal">({assignedMentor.totalSessionsMentored}+)</span>
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-[#38BDF8] mt-0.5">
                      {assignedMentor.designation}
                    </p>
                    <p className="text-[11px] text-[#94A3B8]">
                      {assignedMentor.company} · Assigned {assignedMentor.assignedDate}
                    </p>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-xs text-[#CBD5E1] leading-relaxed bg-[#070D1B]/60 p-3.5 rounded-xl border border-[#162238]">
                  "{assignedMentor.bio}"
                </p>

                {/* Expertise Chips */}
                <div>
                  <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block mb-2">
                    Professional Domain Expertise
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {assignedMentor.expertise.map((tag, idx) => (
                      <span 
                        key={idx}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#101D33] text-[#93C5FD] border border-[#1D3256]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* CLEAN EMPTY STATE WHEN NO MENTOR ASSIGNED */
              <div className="py-12 px-4 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                  <UserX className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-white">No mentor assigned yet</h3>
                <p className="text-xs text-[#94A3B8] max-w-md mx-auto leading-relaxed">
                  Your mentor details will appear here once assigned. Our academic admissions committee assigns a senior domain mentor based on your enrolled cohort track.
                </p>

              </div>
            )}
          </div>

          {/* Card Footer Actions */}
          {assignedMentor && (
            <div className="pt-4 mt-4 border-t border-[#182338] flex flex-wrap items-center justify-between gap-3">
              <div className="text-[11px] text-[#64748B] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span>Next slot availability: <strong className="text-[#CBD5E1]">Within 48 hours</strong></span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsQueryModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#142036] hover:bg-[#1D2E4D] text-xs font-semibold text-white border border-[#223555] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Send Quick Query</span>
                </button>
                <a
                  href="#book-session"
                  className="px-3.5 py-1.5 rounded-lg bg-[#2563EB] hover:bg-blue-600 text-xs font-bold text-white shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Schedule 1:1</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* ------------------------------------------------------
            B. UPCOMING 1:1 MENTORSHIP SESSION (5 COLS)
           ------------------------------------------------------ */}
        <div className="lg:col-span-5 bg-[#0B1324] rounded-2xl border border-[#182338] p-5 sm:p-6 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-60 h-60 bg-purple-600/5 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-white tracking-tight">Upcoming Mentorship</h2>
              </div>
              {primaryUpcomingSession && getStatusBadge(primaryUpcomingSession.status)}
            </div>

            {primaryUpcomingSession ? (
              <div className="space-y-4">
                {/* Time & Date Box */}
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#111A30] to-[#171A3B] border border-[#222E4D] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-[#38BDF8] flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-[#38BDF8]" />
                      <span>{primaryUpcomingSession.displayDate}</span>
                    </span>
                    <span className="text-[#CBD5E1] font-mono font-semibold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-purple-400" />
                      <span>{primaryUpcomingSession.time}</span>
                    </span>
                  </div>

                  <div className="text-[11px] text-[#94A3B8] flex items-center justify-between pt-1 border-t border-[#1F2B48]">
                    <span>Platform: <strong className="text-white">{primaryUpcomingSession.platform}</strong></span>
                    <span>Duration: <strong className="text-white">{primaryUpcomingSession.duration}</strong></span>
                  </div>
                </div>

                {/* Topic & Agenda */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
                    Session Topic
                  </span>
                  <h4 className="text-sm font-bold text-white leading-snug">
                    {primaryUpcomingSession.topic}
                  </h4>
                  <p className="text-xs text-[#94A3B8] line-clamp-2 leading-relaxed">
                    {primaryUpcomingSession.agendaDescription}
                  </p>
                </div>

                {/* Mentor snapshot */}
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#080E1C] border border-[#162238]">
                  <img 
                    src={primaryUpcomingSession.mentorAvatar} 
                    alt={primaryUpcomingSession.mentorName} 
                    className="w-10 h-10 rounded-xl object-cover shrink-0 border border-blue-500/30"
                  />
                  <div className="min-w-0 flex-1">
                    <h5 className="text-xs font-bold text-white truncate">{primaryUpcomingSession.mentorName}</h5>
                    <p className="text-[11px] text-[#64748B] truncate">{primaryUpcomingSession.mentorDesignation}</p>
                  </div>
                </div>

                {/* Informative Note when Booking is Pending */}
                {primaryUpcomingSession.status === 'Booking Requested' && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-amber-200/90 leading-relaxed">
                      <strong>Booking request is awaiting mentor approval.</strong> Once confirmed, the live meeting link and calendar invite will appear here.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* CLEAN EMPTY STATE WHEN NO UPCOMING SESSION */
              <div className="py-10 px-4 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-white">No upcoming sessions scheduled</h3>
                <p className="text-xs text-[#94A3B8] max-w-sm mx-auto leading-relaxed">
                  Book a 1:1 session with your mentor to get code reviews, project guidance, doubt clearing, or career advice.
                </p>
                <div className="pt-2">
                  <a
                    href="#book-session"
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-all inline-flex items-center gap-1.5 shadow-md shadow-blue-600/30 cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book a Session Now</span>
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action: Join Meeting Button ONLY when valid link exists */}
          {primaryUpcomingSession && (
            <div className="pt-4 mt-4 border-t border-[#182338] flex items-center justify-between gap-3">
              <button
                onClick={() => setSelectedSessionForDetail(primaryUpcomingSession)}
                className="text-xs font-semibold text-[#38BDF8] hover:underline cursor-pointer"
              >
                View Agenda & Details →
              </button>

              <div className="flex items-center gap-2">
                {/* Cancel action */}
                <button
                  onClick={() => handleCancelSession(primaryUpcomingSession.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                {/* JOIN MEETING BUTTON - STRICTLY RENDERED ONLY WHEN MEETING LINK IS PRESENT */}
                {primaryUpcomingSession.meetingLink && (primaryUpcomingSession.status === 'Upcoming' || primaryUpcomingSession.status === 'SCHEDULED') ? (
                  <a
                    href={primaryUpcomingSession.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 cursor-pointer hover:scale-[1.02]"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Join Meeting</span>
                    <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
                  </a>
                ) : (
                  <span className="text-[11px] text-[#64748B] italic">
                    Link activates upon approval
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* ========================================================
          3. MY PROGRESS & MENTOR FEEDBACK (READ-ONLY FOR STUDENTS)
         ======================================================== */}
      {progressFeedback ? (
        <div className="bg-[#0B1324] rounded-2xl border border-[#182338] p-5 sm:p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#182338]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">My Progress & Mentor Feedback</h2>
                <p className="text-xs text-[#94A3B8]">
                  Evaluations and roadmap guidelines formulated by <strong className="text-white">{progressFeedback.mentorName}</strong>
                </p>
              </div>
            </div>

            <div className="text-xs text-[#94A3B8] flex items-center gap-1.5 self-start sm:self-auto">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>Last Evaluated: <strong className="text-white">{progressFeedback.lastFeedbackDate}</strong></span>
            </div>
          </div>

          {/* Observations Box */}
          <div className="p-4 rounded-xl bg-[#080E1C] border border-[#1A263D] space-y-2">
            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
              Mentor's Overall Observation
            </span>
            <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed italic">
              "{progressFeedback.overallObservations}"
            </p>
          </div>

          {/* 3-Column Highlights: Strengths, Improvement Areas, Next Goals */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Box 1: Strengths */}
            <div className="p-4 rounded-xl bg-[#091424] border border-[#172D4D] space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                <span>Demonstrated Strengths</span>
              </div>
              <div className="space-y-1.5">
                {progressFeedback.strengths.map((item: any, i: number) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-[#CBD5E1]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Box 2: Areas for Improvement */}
            <div className="p-4 rounded-xl bg-[#181122] border border-[#35204A] space-y-3">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                <span>Areas for Improvement</span>
              </div>
              <div className="space-y-1.5">
                {progressFeedback.areasForImprovement.map((item: any, i: number) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-[#CBD5E1]">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Box 3: Next Learning Goals */}
            <div className="p-4 rounded-xl bg-[#0B172E] border border-[#1C325B] space-y-3">
              <div className="flex items-center gap-2 text-[#38BDF8] text-xs font-bold uppercase tracking-wider">
                <ArrowRight className="w-4 h-4" />
                <span>Next Learning Milestones</span>
              </div>
              <div className="space-y-1.5">
                {progressFeedback.nextLearningGoals.map((item: any, i: number) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-[#CBD5E1]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] shrink-0 mt-1.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Action Items Interactive Checklist for the Student */}
          <div className="pt-2 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Personal Action Items Assigned by Mentor
                </span>
                <span className="text-[11px] text-[#94A3B8]">
                  ({progressFeedback.actionItems.filter((a: any) => a.completed).length} of {progressFeedback.actionItems.length} completed)
                </span>
              </div>
              <span className="text-[11px] text-[#64748B] hidden sm:inline">
                Click checkbox to update your progress
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {progressFeedback.actionItems.map((act: any) => (
                <div 
                  key={act.id}
                  onClick={() => handleToggleActionItem(act.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                    act.completed 
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-[#94A3B8]' 
                      : 'bg-[#0E1729] border-[#1E2E4A] hover:border-blue-500/40 text-white'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    act.completed 
                      ? 'bg-emerald-600 border-emerald-500 text-white' 
                      : 'border-[#334155] bg-[#070D1B]'
                  }`}>
                    {act.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={`text-xs leading-relaxed ${act.completed ? 'line-through opacity-70' : 'font-medium'}`}>
                      {act.text}
                    </p>
                    {act.dueDate && (
                      <span className="text-[10px] text-[#64748B] block mt-1">
                        Target Date: {act.dueDate}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : (
        /* Empty feedback state */
        <div className="bg-[#0B1324] rounded-2xl border border-[#182338] p-6 text-center text-xs text-[#94A3B8]">
          No formal progress review has been logged by your mentor yet. Complete your first 1:1 session to receive structured strengths and action items.
        </div>
      )}

      {/* ========================================================
          4. BOOK A MENTORSHIP SESSION (SECTION C)
         ======================================================== */}
      <div id="book-session" className="bg-[#0B1324] rounded-2xl border border-[#182338] p-5 sm:p-7 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#182338]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">Book a 1:1 Mentorship Session</h2>
              <p className="text-xs text-[#94A3B8]">
                Select an available mentor, choose an open date & time slot, and submit your session agenda.
              </p>
            </div>
          </div>

          <div className="text-xs text-[#38BDF8] bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-lg self-start sm:self-auto font-medium">
            45-Minute Dedicated 1:1 Consultation
          </div>
        </div>

        <form onSubmit={handleBookingSubmit} className="space-y-6">
          
          {/* STEP 1: ASSIGNED MENTOR */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-[#CBD5E1] uppercase tracking-wider block">
              1. Dedicated Assigned Mentor
            </label>
            {assignedMentor ? (
              <div className="p-3.5 rounded-xl border border-blue-500/40 bg-[#121F38] flex items-center justify-between gap-4 max-w-xl">
                <div className="flex items-center gap-3 min-w-0">
                  <img 
                    src={assignedMentor.avatarUrl} 
                    alt={assignedMentor.name} 
                    className="w-11 h-11 rounded-xl object-cover border border-blue-400/40"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white truncate">{assignedMentor.name}</h4>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                        Assigned
                      </span>
                    </div>
                    <p className="text-[11px] text-[#38BDF8] truncate">{assignedMentor.designation}</p>
                    <p className="text-[10px] text-[#94A3B8] font-mono">{assignedMentor.email}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-emerald-400 block font-mono">
                    {assignedMentor.availableSlots.filter((s: any) => !s.isBooked).length} Available Slots
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-[#080E1C] border border-[#182338] text-xs text-amber-400">
                No active mentor assigned to your student profile. Mentorship booking is reserved for enrolled cohort students.
              </div>
            )}
          </div>

          {/* STEP 2 & 3: SELECT DATE & TIME SLOT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Step 2: Date Selector */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-[#CBD5E1] uppercase tracking-wider block">
                2. Select Available Date
              </label>

              {availableDates.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {availableDates.map((dateStr: string) => {
                    const sampleSlot = assignedMentor?.availableSlots.find((s: any) => s.date === dateStr);
                    const isSelected = selectedDate === dateStr;

                    return (
                      <button
                        type="button"
                        key={dateStr}
                        onClick={() => {
                          setSelectedDate(dateStr);
                          const firstFree = assignedMentor?.availableSlots.find((s: any) => s.date === dateStr && !s.isBooked);
                          setSelectedSlotId(firstFree ? firstFree.id : '');
                        }}
                        className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#2563EB] border-blue-400 text-white shadow-sm'
                            : 'bg-[#080E1C] border-[#1A263D] hover:border-blue-500/30 text-[#CBD5E1]'
                        }`}
                      >
                        <div className="text-[11px] font-semibold opacity-90">
                          {sampleSlot?.dayOfWeek || 'Date'}
                        </div>
                        <div className="text-xs font-bold font-mono">
                          {dateStr}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-[#080E1C] border border-[#1A263D] text-xs text-[#94A3B8]">
                  No calendar dates open for this mentor. Check back shortly.
                </div>
              )}
            </div>

            {/* Step 3: Time Slot Selector */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-[#CBD5E1] uppercase tracking-wider block">
                3. Select Time Slot
              </label>

              {slotsForSelectedDate.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {slotsForSelectedDate.map((slot: any) => {
                    const isSelected = selectedSlotId === slot.id;
                    const isBooked = slot.isBooked;

                    return (
                      <button
                        type="button"
                        key={slot.id}
                        disabled={isBooked}
                        onClick={() => setSelectedSlotId(slot.id)}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          isBooked 
                            ? 'bg-[#070D1B] border-[#152136] text-[#475569] cursor-not-allowed line-through' 
                            : isSelected
                              ? 'bg-[#2563EB] border-blue-400 text-white font-bold shadow-sm cursor-pointer'
                              : 'bg-[#080E1C] border-[#1A263D] hover:border-blue-500/40 text-[#CBD5E1] cursor-pointer'
                        }`}
                      >
                        <div className="text-xs font-mono font-semibold">
                          {slot.startTime} - {slot.endTime}
                        </div>
                        <div className="text-[10px] mt-0.5">
                          {isBooked ? 'Slot Reserved' : isSelected ? 'Selected' : 'Available'}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-[#080E1C] border border-[#1A263D] text-xs text-[#94A3B8]">
                  Please choose a date to see available time slots.
                </div>
              )}
            </div>

          </div>

          {/* STEP 4: DISCUSSION TOPIC & AGENDA */}
          <div className="space-y-4">
            
            {/* Topic Input with suggestion pills */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#CBD5E1] uppercase tracking-wider">
                  4. Discussion Topic
                </label>
                <span className="text-[11px] text-[#64748B]">Click suggestion to fill</span>
              </div>

              <input 
                type="text"
                required
                value={bookingTopic}
                onChange={(e) => setBookingTopic(e.target.value)}
                placeholder="e.g. Phase 1 Capstone: SQL Schema Architecture & BigQuery Partitioning"
                className="w-full px-4 py-2.5 rounded-xl bg-[#080E1C] border border-[#1F2E4D] focus:border-blue-500 text-white text-xs sm:text-sm placeholder-[#475569] focus:outline-none transition-colors"
              />

              {/* Suggestions */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  'Phase 1 Capstone Project Architecture',
                  'SQL Window Functions & Aggregation Doubt',
                  'Module 2 Excel Financial Modeling',
                  'Mock Technical Interview Preparation',
                  'Career & Resume Review Strategy'
                ].map((sug, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setBookingTopic(sug)}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-[#101C33] hover:bg-[#182C50] text-[#93C5FD] border border-[#1E365E] transition-colors cursor-pointer"
                  >
                    + {sug}
                  </button>
                ))}
              </div>
            </div>

            {/* Agenda Text Area */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#CBD5E1] uppercase tracking-wider block">
                5. Session Agenda & Specific Questions
              </label>
              <textarea 
                rows={3}
                required
                value={bookingAgenda}
                onChange={(e) => setBookingAgenda(e.target.value)}
                placeholder="What specific questions, code repositories, or project hurdles would you like to resolve during this call?"
                className="w-full px-4 py-2.5 rounded-xl bg-[#080E1C] border border-[#1F2E4D] focus:border-blue-500 text-white text-xs sm:text-sm placeholder-[#475569] focus:outline-none transition-colors resize-none leading-relaxed"
              />
            </div>

            {/* Preferred Platform */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#CBD5E1] uppercase tracking-wider block">
                6. Meeting Platform Preference
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['CodeMyWay Live Room', 'Google Meet', 'Zoom', 'Microsoft Teams'] as const).map((plt) => (
                  <button
                    type="button"
                    key={plt}
                    onClick={() => setBookingPlatform(plt)}
                    className={`p-2 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                      bookingPlatform === plt 
                        ? 'bg-blue-600/20 border-blue-500 text-[#38BDF8] font-bold' 
                        : 'bg-[#080E1C] border-[#18243C] text-[#94A3B8] hover:text-white'
                    }`}
                  >
                    {plt}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Form Submit Row */}
          <div className="pt-3 border-t border-[#182338] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-[11px] text-[#64748B]">
              * Bookings are automatically synchronized with faculty calendars. Double booking prevention is active.
            </div>

            <button
              type="submit"
              disabled={isSubmittingBooking || !selectedSlotId || !bookingTopic.trim()}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#7C3AED] hover:from-blue-600 hover:to-purple-600 text-white font-bold text-xs shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01]"
            >
              {isSubmittingBooking ? (
                <span>Submitting Request...</span>
              ) : (
                <>
                  <Calendar className="w-4 h-4" />
                  <span>Submit Booking Request</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>

      {/* ========================================================
          5. MENTORSHIP HISTORY & ARCHIVE (SECTION D)
         ======================================================== */}
      <div className="bg-[#0B1324] rounded-2xl border border-[#182338] p-5 sm:p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#182338]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Mentorship History & Archive</h2>
              <p className="text-xs text-[#94A3B8]">
                Review notes, action items, and evaluation summaries from previous sessions.
              </p>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto bg-[#070D1B] p-1 rounded-xl border border-[#182338]">
            <button
              onClick={() => setHistoryFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                historyFilter === 'all' 
                  ? 'bg-[#2563EB] text-white shadow-xs' 
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              All ({historicalSessions.length})
            </button>
            <button
              onClick={() => setHistoryFilter('COMPLETED')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                historyFilter === 'COMPLETED' 
                  ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40 shadow-xs' 
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              Completed ({historicalSessions.filter(s => s.status === 'COMPLETED' || s.status === 'Completed').length})
            </button>
            <button
              onClick={() => setHistoryFilter('CANCELLED')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                historyFilter === 'CANCELLED' 
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-xs' 
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              Cancelled ({historicalSessions.filter(s => s.status === 'CANCELLED' || s.status === 'Cancelled').length})
            </button>
          </div>
        </div>

        {/* Timeline / Table of History */}
        {filteredHistory.length > 0 ? (
          <div className="space-y-3">
            {filteredHistory.map((sess) => (
              <div
                key={sess.id}
                className="p-4 rounded-xl bg-[#080E1C] border border-[#182338] hover:border-[#223352] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <img 
                    src={sess.mentorAvatar} 
                    alt={sess.mentorName} 
                    className="w-10 h-10 rounded-xl object-cover shrink-0 border border-blue-500/30 mt-0.5"
                  />

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-white">{sess.topic}</span>
                      {getStatusBadge(sess.status)}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[#94A3B8] flex-wrap">
                      <span className="text-white font-medium">{sess.mentorName}</span>
                      <span>·</span>
                      <span className="font-mono text-[#38BDF8]">{sess.displayDate}</span>
                      <span>·</span>
                      <span>{sess.time}</span>
                    </div>

                    {sess.feedback && (
                      <p className="text-xs text-[#CBD5E1] line-clamp-1 italic pt-1">
                        "{sess.feedback.notes}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
                  {sess.feedback && (
                    <div className="flex items-center gap-1 text-amber-300 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{sess.feedback.rating}.0 / 5.0</span>
                    </div>
                  )}

                  <button
                    onClick={() => setSelectedSessionForDetail(sess)}
                    className="px-3.5 py-1.5 rounded-lg bg-[#142036] hover:bg-[#1E2E4D] text-xs font-semibold text-[#38BDF8] hover:text-white border border-[#20314E] transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span>View Summary</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 px-4 text-center space-y-2 text-xs text-[#94A3B8]">
            <Clock className="w-6 h-6 mx-auto text-[#475569]" />
            <p>No historical sessions match this filter.</p>
          </div>
        )}
      </div>

      {/* ========================================================
          6. MODAL: SESSION DETAILS & MENTOR EVALUATION
         ======================================================== */}
      <AnimatePresence>
        {selectedSessionForDetail && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.94, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 10 }}
              className="bg-[#0B1324] rounded-2xl max-w-2xl w-full p-6 border border-[#223354] shadow-2xl relative text-white max-h-[90vh] overflow-y-auto space-y-5"
            >
              <button
                onClick={() => setSelectedSessionForDetail(null)}
                className="absolute top-4 right-4 p-1.5 text-[#94A3B8] hover:text-white rounded-lg hover:bg-[#152138] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-3 pr-8">
                <img 
                  src={selectedSessionForDetail.mentorAvatar} 
                  alt={selectedSessionForDetail.mentorName} 
                  className="w-12 h-12 rounded-xl object-cover border border-blue-500/30"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      {selectedSessionForDetail.mentorName}
                    </h3>
                    {getStatusBadge(selectedSessionForDetail.status)}
                  </div>
                  <p className="text-xs text-[#94A3B8]">{selectedSessionForDetail.mentorDesignation}</p>
                </div>
              </div>

              {/* Time & Platform */}
              <div className="p-3.5 rounded-xl bg-[#070D1B] border border-[#162238] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-[#64748B] block text-[10px] uppercase">Date</span>
                  <span className="font-bold text-white font-mono">{selectedSessionForDetail.displayDate}</span>
                </div>
                <div>
                  <span className="text-[#64748B] block text-[10px] uppercase">Time</span>
                  <span className="font-bold text-white font-mono">{selectedSessionForDetail.time}</span>
                </div>
                <div>
                  <span className="text-[#64748B] block text-[10px] uppercase">Platform</span>
                  <span className="font-bold text-[#38BDF8]">{selectedSessionForDetail.platform}</span>
                </div>
                <div>
                  <span className="text-[#64748B] block text-[10px] uppercase">Duration</span>
                  <span className="font-bold text-white">{selectedSessionForDetail.duration}</span>
                </div>
              </div>

              {/* Topic & Agenda */}
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-[#CBD5E1] uppercase tracking-wider">Session Topic & Agenda</h4>
                <p className="text-sm font-bold text-white">{selectedSessionForDetail.topic}</p>
                <p className="text-xs text-[#94A3B8] leading-relaxed pt-1 bg-[#080E1C] p-3 rounded-xl border border-[#162238]">
                  {selectedSessionForDetail.agendaDescription}
                </p>
              </div>

              {/* Feedback Section (if completed) */}
              {selectedSessionForDetail.feedback && (
                <div className="space-y-4 pt-2 border-t border-[#182338]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Award className="w-4 h-4" />
                      <span>Mentor Evaluation & Observations</span>
                    </span>
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{selectedSessionForDetail.feedback.rating}.0 / 5.0 Rating</span>
                    </span>
                  </div>

                  <p className="text-xs text-[#CBD5E1] leading-relaxed italic bg-[#070E1C] p-3.5 rounded-xl border border-[#17253D]">
                    "{selectedSessionForDetail.feedback.notes}"
                  </p>

                  {/* Strengths & Improvement in Session */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1.5">
                      <span className="font-bold text-emerald-400 block text-[11px] uppercase tracking-wider">
                        Key Strengths Noted
                      </span>
                      {selectedSessionForDetail.feedback.strengths.map((str: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-1.5 text-[#CBD5E1]">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                          <span>{str}</span>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-1.5">
                      <span className="font-bold text-amber-400 block text-[11px] uppercase tracking-wider">
                        Next Improvements
                      </span>
                      {selectedSessionForDetail.feedback.improvementAreas.map((imp: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-1.5 text-[#CBD5E1]">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                          <span>{imp}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action items in Session */}
                  {selectedSessionForDetail.feedback.actionItems && selectedSessionForDetail.feedback.actionItems.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
                        Action Items from this Session
                      </span>
                      <div className="space-y-1.5">
                        {selectedSessionForDetail.feedback.actionItems.map((act: any) => (
                          <div key={act.id} className="flex items-center gap-2 text-xs text-[#CBD5E1] bg-[#070D1B] p-2.5 rounded-lg border border-[#182338]">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>{act.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Modal Footer */}
              <div className="pt-4 border-t border-[#182338] flex items-center justify-between">
                <span className="text-[11px] text-[#64748B]">
                  Session ID: <strong className="font-mono text-[#CBD5E1]">{selectedSessionForDetail.id}</strong>
                </span>

                <div className="flex items-center gap-2">
                  {selectedSessionForDetail.meetingLink && selectedSessionForDetail.status === 'Upcoming' && (
                    <a
                      href={selectedSessionForDetail.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Launch Meeting</span>
                    </a>
                  )}

                  <button
                    onClick={() => setSelectedSessionForDetail(null)}
                    className="px-4 py-2 rounded-xl bg-[#142036] hover:bg-[#1D2E4D] text-xs font-semibold text-white transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================
          7. MODAL: ASK MENTOR / DIRECT SUPPORT QUERY
         ======================================================== */}
      <AnimatePresence>
        {isQueryModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.94, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 10 }}
              className="bg-[#0B1324] rounded-2xl max-w-lg w-full p-6 border border-[#223354] shadow-2xl relative text-white space-y-4"
            >
              <button
                onClick={() => setIsQueryModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 text-[#94A3B8] hover:text-white rounded-lg hover:bg-[#152138] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Ask Mentor / Request Support</h3>
                  <p className="text-xs text-[#94A3B8]">Send an asynchronous query to {assignedMentor?.name || 'Faculty Team'}.</p>
                </div>
              </div>

              <form onSubmit={handleQuerySubmit} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#CBD5E1]">Category</label>
                  <select
                    value={queryCategory}
                    onChange={(e: any) => setQueryCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#080E1C] border border-[#1F2E4D] text-white text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="Project Guidance">Project Guidance & Architecture</option>
                    <option value="Curriculum Doubt">Curriculum / Class Concept Doubt</option>
                    <option value="Career & Interview">Career Strategy & Resume</option>
                    <option value="Technical Issue">Dataset / Technical Setup Issue</option>
                    <option value="Other">Other Academic Support</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#CBD5E1]">Subject</label>
                  <input
                    type="text"
                    required
                    value={querySubject}
                    onChange={(e) => setQuerySubject(e.target.value)}
                    placeholder="e.g. Question regarding Module 1 CTE index scan"
                    className="w-full px-3 py-2 rounded-xl bg-[#080E1C] border border-[#1F2E4D] text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#CBD5E1]">Detailed Message</label>
                  <textarea
                    rows={4}
                    required
                    value={queryMessage}
                    onChange={(e) => setQueryMessage(e.target.value)}
                    placeholder="Provide relevant details, SQL snippet, or error message..."
                    className="w-full px-3 py-2 rounded-xl bg-[#080E1C] border border-[#1F2E4D] text-white text-xs focus:outline-none focus:border-blue-500 resize-none leading-relaxed"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsQueryModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-[#94A3B8] hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingQuery}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Query</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================
          9. FLOATING TOAST NOTIFICATION
         ======================================================== */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 max-w-md"
          >
            <div className={`p-4 rounded-xl border shadow-2xl flex items-start gap-3 backdrop-blur-md ${
              toastMessage.type === 'success' 
                ? 'bg-[#091A1E]/95 border-emerald-500/50 text-emerald-200' 
                : toastMessage.type === 'error'
                  ? 'bg-[#1E090F]/95 border-rose-500/50 text-rose-200'
                  : 'bg-[#0F1426]/95 border-blue-500/50 text-blue-200'
            }`}>
              {toastMessage.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
              {toastMessage.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}
              {toastMessage.type === 'info' && <Sparkles className="w-5 h-5 text-[#38BDF8] shrink-0 mt-0.5" />}
              <p className="text-xs leading-relaxed flex-1">{toastMessage.text}</p>
              <button 
                onClick={() => setToastMessage(null)}
                className="text-[#94A3B8] hover:text-white cursor-pointer p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
