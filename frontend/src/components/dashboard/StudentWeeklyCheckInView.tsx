import React, { useState, useEffect } from 'react';
import { api } from '../../api';
import { WeeklyCheckInStudentAssignment } from '../../types/weeklyCheckIn';
import { 
  Calendar, 
  Clock, 
  Video, 
  CheckCircle2, 
  Circle, 
  AlertCircle, 
  Star, 
  Award, 
  Target, 
  Sparkles, 
  ExternalLink,
  ChevronRight,
  History,
  Check,
  RefreshCw,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const StudentWeeklyCheckInView: React.FC = () => {
  const [assignments, setAssignments] = useState<WeeklyCheckInStudentAssignment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const [togglingActionItemId, setTogglingActionItemId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchAssignments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api<{ success: boolean; assignments: WeeklyCheckInStudentAssignment[] }>('/student/check-ins');
      if (res && res.success) {
        setAssignments(res.assignments);
        if (res.assignments.length > 0 && !selectedAssignmentId) {
          setSelectedAssignmentId(res.assignments[0].id);
        }
      }
    } catch (err: any) {
      console.error('Error fetching student check-ins:', err);
      setError(err.message || 'Failed to load weekly check-ins.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleToggleActionItem = async (actionItemId: string, currentStatus: boolean) => {
    setTogglingActionItemId(actionItemId);
    try {
      const res = await api<{ success: boolean; actionItem: any }>(`/student/check-ins/action-items/${actionItemId}`, {
        method: 'PATCH',
        body: { isCompleted: !currentStatus }
      });
      if (res && res.success) {
        setToastMessage(!currentStatus ? 'Action item completed! Keep up the great work.' : 'Action item reopened.');
        setTimeout(() => setToastMessage(null), 3500);

        // Update local state
        setAssignments(prev => prev.map(assign => {
          if (!assign.feedback) return assign;
          return {
            ...assign,
            feedback: {
              ...assign.feedback,
              actionItems: assign.feedback.actionItems.map(item => 
                item.id === actionItemId ? { ...item, isCompleted: !currentStatus } : item
              )
            }
          };
        }));
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update action item.');
    } finally {
      setTogglingActionItemId(null);
    }
  };

  const selectedAssignment = assignments.find(a => a.id === selectedAssignmentId) || assignments[0];

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 bg-[#0F1E38] border border-emerald-500/50 p-4 rounded-xl shadow-2xl shadow-emerald-950/30 text-white flex items-center gap-3"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <p className="text-xs text-white font-medium">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0C1528] via-[#0E1A33] to-[#0A1120] border border-blue-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md bg-blue-600/30 text-blue-300 border border-blue-500/40 text-[10px] font-mono font-bold uppercase">
              ACADEMIC PROGRESSION
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white">Weekly Progress Check-Ins</h1>
          </div>
          <p className="text-xs text-[#94A3B8]">
            Review your weekly scheduled check-in sessions, live Google Meet/Zoom links, published faculty feedback, rubric evaluations, and actionable sprint goals.
          </p>
        </div>

        <button
          onClick={fetchAssignments}
          disabled={isLoading}
          className="px-3.5 py-2 rounded-xl bg-[#152138] hover:bg-[#1E2E4E] border border-[#2A3756] text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shrink-0 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {isLoading ? (
        <div className="p-16 text-center space-y-3 bg-[#0A1120] border border-[#1A263D] rounded-2xl">
          <div className="w-8 h-8 rounded-full border-2 border-blue-500/20 border-t-blue-400 animate-spin mx-auto" />
          <p className="text-xs text-[#94A3B8] font-mono animate-pulse">Loading your weekly check-ins from database...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center space-y-3 bg-[#0D1527] border border-rose-500/30 rounded-2xl max-w-lg mx-auto">
          <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
          <h3 className="text-sm font-bold text-white">Failed to Load Check-Ins</h3>
          <p className="text-xs text-[#94A3B8]">{error}</p>
          <button
            onClick={fetchAssignments}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
          >
            Retry
          </button>
        </div>
      ) : assignments.length === 0 ? (
        <div className="p-16 text-center space-y-3 bg-[#0A1120] border border-[#1A263D] rounded-2xl">
          <Calendar className="w-10 h-10 text-[#64748B] mx-auto" />
          <h3 className="text-sm font-bold text-white">No Active Check-In Scheduled Yet</h3>
          <p className="text-xs text-[#94A3B8] max-w-md mx-auto">
            Your cohort administrator schedules weekly progress reviews for active weeks. Once scheduled and published, your assigned teacher, session time, and meeting link will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: List of weekly check-ins */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider px-1 flex items-center gap-2">
              <History className="w-3.5 h-3.5" />
              <span>Check-In Cycles ({assignments.length})</span>
            </h3>

            <div className="space-y-2.5">
              {assignments.map((assignment) => {
                const isSelected = assignment.id === selectedAssignment?.id;
                const isCompleted = assignment.status === 'COMPLETED';
                const isMissed = assignment.status === 'MISSED';
                const isScheduled = assignment.status === 'SCHEDULED';
                const hasPublishedFeedback = assignment.feedback && assignment.feedback.status === 'PUBLISHED';

                return (
                  <div
                    key={assignment.id}
                    onClick={() => setSelectedAssignmentId(assignment.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#101D36] border-blue-500 shadow-md shadow-blue-900/20'
                        : 'bg-[#0A1120] border-[#1A263D] hover:border-[#2A3756]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold">
                        WEEK {assignment.checkIn.weekNumber}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isCompleted
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : isMissed
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : isScheduled
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {assignment.status}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white line-clamp-1">{assignment.checkIn.title}</h4>

                    <div className="flex items-center gap-2 text-xs text-[#94A3B8] mt-2">
                      <div className="w-5 h-5 rounded-full bg-[#1A263D] flex items-center justify-center text-[10px] text-white font-bold">
                        {assignment.teacher.name[0]}
                      </div>
                      <span className="truncate">{assignment.teacher.name}</span>
                    </div>

                    {hasPublishedFeedback && (
                      <div className="mt-3 pt-2.5 border-t border-[#1A263D] flex items-center justify-between text-[11px]">
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Feedback Ready</span>
                        </span>
                        {assignment.feedback?.taskCompletionScore !== null && assignment.feedback?.taskCompletionScore !== undefined && (
                          <span className="font-mono text-white font-bold">
                            Score: {assignment.feedback.taskCompletionScore}%
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detailed session & Feedback view */}
          <div className="lg:col-span-8 space-y-6">
            {selectedAssignment && (
              <>
                {/* 1. Session Information Card */}
                <div className="p-6 rounded-2xl bg-[#0A1120] border border-[#1A263D] space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1A263D]">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-[#64748B] font-mono mb-1">
                        <span>WEEK {selectedAssignment.checkIn.weekNumber} CYCLE</span>
                        <span>•</span>
                        <span>{selectedAssignment.checkIn.defaultDurationMinutes || 30} MINS SESSION</span>
                      </div>
                      <h2 className="text-lg sm:text-xl font-bold text-white">{selectedAssignment.checkIn.title}</h2>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs font-bold text-white">{selectedAssignment.teacher.name}</div>
                        <div className="text-[10px] text-blue-400 font-mono">Assigned Teacher</div>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-300 font-bold text-sm">
                        {selectedAssignment.teacher.name[0]}
                      </div>
                    </div>
                  </div>

                  {/* Scheduled Date/Time & Meeting Link */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-[#0D1527] border border-[#1E293B] space-y-1">
                      <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
                        <Clock className="w-4 h-4 text-sky-400" />
                        <span>Scheduled Date & Time</span>
                      </div>
                      <div className="text-sm font-bold text-white pt-1">
                        {selectedAssignment.scheduledStartAt ? (
                          <>
                            {new Date(selectedAssignment.scheduledStartAt).toLocaleDateString('en-GB', {
                              weekday: 'short',
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                            <div className="text-xs text-sky-400 font-mono mt-0.5">
                              {new Date(selectedAssignment.scheduledStartAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {selectedAssignment.scheduledEndAt ? new Date(selectedAssignment.scheduledEndAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                            </div>
                          </>
                        ) : (
                          <span className="text-[#64748B] italic">Schedule timing pending</span>
                        )}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#0D1527] border border-[#1E293B] space-y-2 flex flex-col justify-between">
                      <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
                        <Video className="w-4 h-4 text-purple-400" />
                        <span>Video Meeting URL</span>
                      </div>
                      {selectedAssignment.meetingUrl ? (
                        <a
                          href={selectedAssignment.meetingUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="py-2 px-3 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-purple-900/30 cursor-pointer"
                        >
                          <span>Join Check-In Meeting</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        <span className="text-xs text-[#64748B] italic">Meeting link will appear once scheduled</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. Published Feedback & Action Items */}
                {selectedAssignment.feedback && selectedAssignment.feedback.status === 'PUBLISHED' ? (
                  <div className="p-6 rounded-2xl bg-[#0A1120] border border-emerald-500/30 space-y-6">
                    <div className="flex items-center justify-between pb-3 border-b border-[#1A263D]">
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-emerald-400" />
                        <h3 className="text-base font-bold text-white">Faculty Review & Sprint Feedback</h3>
                      </div>
                      {selectedAssignment.feedback.publishedAt && (
                        <span className="text-[11px] text-[#94A3B8]">
                          Published {new Date(selectedAssignment.feedback.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      )}
                    </div>

                    {/* Rubric Scores Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Attendance Rating */}
                      <div className="p-4 rounded-xl bg-[#0D1527] border border-[#1E293B]">
                        <span className="text-xs text-[#94A3B8] block mb-1">Attendance & Engagement Rating</span>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  selectedAssignment.feedback?.attendanceRating && selectedAssignment.feedback.attendanceRating >= star
                                    ? 'text-amber-400 fill-amber-400'
                                    : 'text-[#334155]'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-bold text-white font-mono ml-2">
                            {selectedAssignment.feedback.attendanceRating !== null ? `${selectedAssignment.feedback.attendanceRating} / 5` : '--'}
                          </span>
                        </div>
                      </div>

                      {/* Task Completion Score */}
                      <div className="p-4 rounded-xl bg-[#0D1527] border border-[#1E293B]">
                        <span className="text-xs text-[#94A3B8] block mb-1">Task Completion Score</span>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-black text-white font-mono">
                            {selectedAssignment.feedback.taskCompletionScore !== null ? `${selectedAssignment.feedback.taskCompletionScore}%` : '--'}
                          </span>
                          <div className="flex-1 bg-[#152138] h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-emerald-400 h-full rounded-full"
                              style={{ width: `${selectedAssignment.feedback.taskCompletionScore || 0}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* General Feedback & Next Week Goals */}
                    <div className="space-y-4">
                      {selectedAssignment.feedback.generalFeedback && (
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-white uppercase tracking-wider">Teacher Summary</span>
                          <p className="text-xs text-[#CBD5E1] bg-[#0D1527] p-3.5 rounded-xl border border-[#1E293B] leading-relaxed">
                            {selectedAssignment.feedback.generalFeedback}
                          </p>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedAssignment.feedback.strengths && (
                          <div className="space-y-1">
                            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Key Strengths</span>
                            </span>
                            <p className="text-xs text-[#CBD5E1] bg-[#0D1527] p-3 rounded-xl border border-[#1E293B] leading-relaxed">
                              {selectedAssignment.feedback.strengths}
                            </p>
                          </div>
                        )}

                        {selectedAssignment.feedback.areasForImprovement && (
                          <div className="space-y-1">
                            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                              <Target className="w-3.5 h-3.5" />
                              <span>Areas for Improvement</span>
                            </span>
                            <p className="text-xs text-[#CBD5E1] bg-[#0D1527] p-3 rounded-xl border border-[#1E293B] leading-relaxed">
                              {selectedAssignment.feedback.areasForImprovement}
                            </p>
                          </div>
                        )}
                      </div>

                      {selectedAssignment.feedback.nextWeekGoals && (
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Goals for Next Week</span>
                          <p className="text-xs text-[#CBD5E1] bg-[#0D1527] p-3 rounded-xl border border-[#1E293B] leading-relaxed">
                            {selectedAssignment.feedback.nextWeekGoals}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action Items List with Student Toggling */}
                    {selectedAssignment.feedback.actionItems && selectedAssignment.feedback.actionItems.length > 0 && (
                      <div className="space-y-3 pt-4 border-t border-[#1A263D]">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-sky-400" />
                            <span>Action Items ({selectedAssignment.feedback.actionItems.filter(i => i.isCompleted).length} / {selectedAssignment.feedback.actionItems.length} completed)</span>
                          </h4>
                          <span className="text-[11px] text-[#94A3B8]">Click checkbox to update your progress</span>
                        </div>

                        <div className="space-y-2">
                          {selectedAssignment.feedback.actionItems.map((item) => (
                            <div
                              key={item.id}
                              onClick={() => handleToggleActionItem(item.id, item.isCompleted)}
                              className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                                item.isCompleted
                                  ? 'bg-[#0E1A2E]/70 border-emerald-500/30'
                                  : 'bg-[#0D1527] border-[#1E293B] hover:border-blue-500/40'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  disabled={togglingActionItemId === item.id}
                                  className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                                    item.isCompleted
                                      ? 'bg-emerald-500 text-white'
                                      : 'border border-[#475569] hover:border-blue-400'
                                  }`}
                                >
                                  {item.isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                </button>
                                <span className={`text-xs ${item.isCompleted ? 'line-through text-[#64748B]' : 'text-white font-medium'}`}>
                                  {item.description}
                                </span>
                              </div>

                              {togglingActionItemId === item.id && (
                                <div className="w-3.5 h-3.5 rounded-full border border-blue-400 border-t-transparent animate-spin" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-8 rounded-2xl bg-[#0A1120] border border-[#1A263D] text-center space-y-2">
                    <Clock className="w-8 h-8 text-[#64748B] mx-auto" />
                    <h3 className="text-sm font-bold text-white">Feedback in Review</h3>
                    <p className="text-xs text-[#94A3B8] max-w-sm mx-auto">
                      Your teacher is currently evaluating your session deliverables and drafting feedback. Published evaluations will be visible here once verified.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
