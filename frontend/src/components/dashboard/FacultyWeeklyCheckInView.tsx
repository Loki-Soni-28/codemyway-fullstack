import React, { useState, useEffect } from 'react';
import { api } from '../../api';
import { WeeklyCheckInStudentAssignment } from '../../types/weeklyCheckIn';
import { 
  Users, 
  Calendar, 
  Clock, 
  Video, 
  CheckCircle2, 
  AlertCircle, 
  Star, 
  Award, 
  Target, 
  Sparkles, 
  ExternalLink,
  Plus,
  Trash2,
  Save,
  Send,
  Lock,
  RefreshCw,
  Search,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const FacultyWeeklyCheckInView: React.FC = () => {
  const [assignments, setAssignments] = useState<WeeklyCheckInStudentAssignment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Form State for Active Feedback
  const [attendanceRating, setAttendanceRating] = useState<number | ''>('');
  const [taskCompletionScore, setTaskCompletionScore] = useState<number | ''>('');
  const [generalFeedback, setGeneralFeedback] = useState<string>('');
  const [strengths, setStrengths] = useState<string>('');
  const [areasForImprovement, setAreasForImprovement] = useState<string>('');
  const [nextWeekGoals, setNextWeekGoals] = useState<string>('');
  const [actionItems, setActionItems] = useState<Array<{ id?: string; description: string }>>([]);
  const [newActionItemDesc, setNewActionItemDesc] = useState<string>('');

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchAssignments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api<{ success: boolean; assignments: WeeklyCheckInStudentAssignment[] }>('/faculty/check-ins/assignments');
      if (res && res.success) {
        setAssignments(res.assignments);
        if (res.assignments.length > 0 && !selectedAssignmentId) {
          selectAssignment(res.assignments[0]);
        }
      }
    } catch (err: any) {
      console.error('Error fetching faculty check-in assignments:', err);
      setError(err.message || 'Failed to load check-in assignments.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const selectAssignment = (assignment: WeeklyCheckInStudentAssignment) => {
    setSelectedAssignmentId(assignment.id);
    setFormError(null);

    if (assignment.feedback) {
      setAttendanceRating(assignment.feedback.attendanceRating ?? '');
      setTaskCompletionScore(assignment.feedback.taskCompletionScore ?? '');
      setGeneralFeedback(assignment.feedback.generalFeedback ?? '');
      setStrengths(assignment.feedback.strengths ?? '');
      setAreasForImprovement(assignment.feedback.areasForImprovement ?? '');
      setNextWeekGoals(assignment.feedback.nextWeekGoals ?? '');
      setActionItems(assignment.feedback.actionItems.map(i => ({ id: i.id, description: i.description })));
    } else {
      setAttendanceRating('');
      setTaskCompletionScore('');
      setGeneralFeedback('');
      setStrengths('');
      setAreasForImprovement('');
      setNextWeekGoals('');
      setActionItems([]);
    }
  };

  const handleAddActionItem = () => {
    if (!newActionItemDesc.trim()) return;
    setActionItems(prev => [...prev, { description: newActionItemDesc.trim() }]);
    setNewActionItemDesc('');
  };

  const handleRemoveActionItem = (index: number) => {
    setActionItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveFeedback = async (publish: boolean) => {
    if (!selectedAssignmentId) return;
    setFormError(null);

    if (publish) {
      if (attendanceRating === '' || Number(attendanceRating) < 1 || Number(attendanceRating) > 5) {
        setFormError('Attendance rating (1-5 stars) is mandatory when publishing feedback.');
        return;
      }
      if (taskCompletionScore === '' || Number(taskCompletionScore) < 0 || Number(taskCompletionScore) > 100) {
        setFormError('Task completion score (0-100%) is mandatory when publishing feedback.');
        return;
      }
      if (!generalFeedback.trim()) {
        setFormError('General feedback summary is required when publishing.');
        return;
      }
    }

    setIsSaving(true);
    try {
      const res = await api<{ success: boolean; feedback: any }>(`/faculty/check-ins/assignments/${selectedAssignmentId}/feedback`, {
        method: 'POST',
        body: {
          publish,
          attendanceRating: attendanceRating === '' ? null : Number(attendanceRating),
          taskCompletionScore: taskCompletionScore === '' ? null : Number(taskCompletionScore),
          generalFeedback: generalFeedback.trim() || null,
          strengths: strengths.trim() || null,
          areasForImprovement: areasForImprovement.trim() || null,
          nextWeekGoals: nextWeekGoals.trim() || null,
          actionItems
        }
      });

      if (res && res.success) {
        setToastMessage(publish ? 'Feedback published successfully! Marked as COMPLETED.' : 'Feedback draft saved.');
        setTimeout(() => setToastMessage(null), 3500);
        await fetchAssignments();
      }
    } catch (err: any) {
      setFormError(err.message || 'Failed to save feedback.');
    } finally {
      setIsSaving(false);
    }
  };

  const activeAssignment = assignments.find(a => a.id === selectedAssignmentId);
  const isPublished = activeAssignment?.feedback?.status === 'PUBLISHED';

  const filteredAssignments = assignments.filter(a => 
    a.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.checkIn.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <span className="px-2.5 py-0.5 rounded-md bg-purple-600/30 text-purple-300 border border-purple-500/40 text-[10px] font-mono font-bold uppercase">
              FACULTY PORTAL
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white">Weekly Progress Check-Ins</h1>
          </div>
          <p className="text-xs text-[#94A3B8]">
            Review assigned students for active weekly check-ins, conduct sessions via scheduled Google Meet/Zoom links, save draft notes, and publish structured sprint evaluations.
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
          <div className="w-8 h-8 rounded-full border-2 border-purple-500/20 border-t-purple-400 animate-spin mx-auto" />
          <p className="text-xs text-[#94A3B8] font-mono animate-pulse">Loading assigned students...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center space-y-3 bg-[#0D1527] border border-rose-500/30 rounded-2xl max-w-lg mx-auto">
          <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
          <h3 className="text-sm font-bold text-white">Failed to Load Assignments</h3>
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
          <Users className="w-10 h-10 text-[#64748B] mx-auto" />
          <h3 className="text-sm font-bold text-white">No Assigned Students This Week</h3>
          <p className="text-xs text-[#94A3B8] max-w-md mx-auto">
            You do not currently have any student check-in assignments allocated to you. Cohort administrators assign active students when a weekly check-in cycle is configured.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Assigned Students List */}
          <div className="lg:col-span-4 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search student or week..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[#0A1120] border border-[#1A263D] rounded-xl text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
              {filteredAssignments.map((assignment) => {
                const isSelected = assignment.id === activeAssignment?.id;
                const hasPublishedFeedback = assignment.feedback?.status === 'PUBLISHED';
                const hasDraft = assignment.feedback?.status === 'DRAFT';

                return (
                  <div
                    key={assignment.id}
                    onClick={() => selectAssignment(assignment)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#101D36] border-purple-500 shadow-md shadow-purple-900/20'
                        : 'bg-[#0A1120] border-[#1A263D] hover:border-[#2A3756]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 font-bold">
                        WEEK {assignment.checkIn.weekNumber}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        hasPublishedFeedback
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : hasDraft
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}>
                        {hasPublishedFeedback ? 'PUBLISHED' : hasDraft ? 'DRAFT' : assignment.status}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white line-clamp-1">{assignment.student.name}</h4>
                    <p className="text-[11px] text-[#94A3B8] truncate">{assignment.student.email}</p>

                    <div className="mt-2 pt-2 border-t border-[#1A263D] flex items-center justify-between text-[11px] text-[#64748B]">
                      <span>{assignment.checkIn.batch?.name || 'Cohort Batch'}</span>
                      {assignment.scheduledStartAt && (
                        <span className="text-sky-400 font-mono">
                          {new Date(assignment.scheduledStartAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Feedback Form / View */}
          <div className="lg:col-span-8 space-y-6">
            {activeAssignment && (
              <div className="p-6 rounded-2xl bg-[#0A1120] border border-[#1A263D] space-y-6">
                {/* Header Profile Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1A263D]">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300 font-bold text-base">
                      {activeAssignment.student.name[0]}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">{activeAssignment.student.name}</h2>
                      <p className="text-xs text-[#94A3B8]">{activeAssignment.student.email}</p>
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-2">
                    {activeAssignment.meetingUrl ? (
                      <a
                        href={activeAssignment.meetingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-md shadow-purple-900/30 cursor-pointer"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Open Meeting</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-xs text-[#64748B] italic">No meeting URL scheduled</span>
                    )}
                  </div>
                </div>

                {isPublished && (
                  <div className="p-4 rounded-xl bg-[#0F231D] border border-emerald-500/40 flex items-center gap-3 text-emerald-300 text-xs">
                    <Lock className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span>
                      This feedback has been <strong>PUBLISHED</strong> and is now visible to the student. Direct faculty edits are locked. (If corrections are necessary, contact the Administrator for an audited amendment).
                    </span>
                  </div>
                )}

                {formError && (
                  <div className="p-3.5 rounded-xl bg-[#2D1218] border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Form Inputs */}
                <div className="space-y-5">
                  {/* Rubric Evaluation: Attendance Rating & Task Score */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Attendance Rating */}
                    <div className="p-4 rounded-xl bg-[#0D1527] border border-[#1E293B] space-y-2">
                      <label className="text-xs font-bold text-white block">
                        Attendance & Engagement Rating (1–5) <span className="text-rose-400">*</span>
                      </label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            disabled={isPublished}
                            onClick={() => setAttendanceRating(star)}
                            className="p-1 text-[#475569] hover:text-amber-400 transition-colors disabled:cursor-not-allowed"
                          >
                            <Star
                              className={`w-6 h-6 ${
                                attendanceRating && Number(attendanceRating) >= star
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-[#334155]'
                              }`}
                            />
                          </button>
                        ))}
                        <span className="text-xs font-mono font-bold text-white ml-2">
                          {attendanceRating ? `${attendanceRating} / 5` : 'Unrated'}
                        </span>
                      </div>
                    </div>

                    {/* Task Completion Score */}
                    <div className="p-4 rounded-xl bg-[#0D1527] border border-[#1E293B] space-y-2">
                      <label className="text-xs font-bold text-white block">
                        Task Completion Score (0–100%) <span className="text-rose-400">*</span>
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          disabled={isPublished}
                          placeholder="e.g. 90"
                          value={taskCompletionScore}
                          onChange={(e) => setTaskCompletionScore(e.target.value === '' ? '' : Number(e.target.value))}
                          className="w-24 px-3 py-2 bg-[#0A1120] border border-[#1A263D] rounded-lg text-sm font-bold text-white focus:outline-none focus:border-purple-500 disabled:opacity-50"
                        />
                        <span className="text-xs text-[#94A3B8]">Score out of 100</span>
                      </div>
                    </div>
                  </div>

                  {/* General Summary Feedback */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-white block">
                      General Weekly Feedback <span className="text-rose-400">*</span>
                    </label>
                    <textarea
                      rows={3}
                      disabled={isPublished}
                      placeholder="Summarize the student's progress, participation, and weekly sprint output..."
                      value={generalFeedback}
                      onChange={(e) => setGeneralFeedback(e.target.value)}
                      className="w-full p-3 bg-[#0D1527] border border-[#1E293B] rounded-xl text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-purple-500 disabled:opacity-60 leading-relaxed"
                    />
                  </div>

                  {/* Strengths & Improvement Areas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Key Strengths</span>
                      </label>
                      <textarea
                        rows={3}
                        disabled={isPublished}
                        placeholder="What did the student excel at this week?"
                        value={strengths}
                        onChange={(e) => setStrengths(e.target.value)}
                        className="w-full p-3 bg-[#0D1527] border border-[#1E293B] rounded-xl text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-purple-500 disabled:opacity-60"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5" />
                        <span>Areas for Improvement</span>
                      </label>
                      <textarea
                        rows={3}
                        disabled={isPublished}
                        placeholder="Where should the student focus on improving?"
                        value={areasForImprovement}
                        onChange={(e) => setAreasForImprovement(e.target.value)}
                        className="w-full p-3 bg-[#0D1527] border border-[#1E293B] rounded-xl text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-purple-500 disabled:opacity-60"
                      />
                    </div>
                  </div>

                  {/* Goals for Next Week */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-blue-400 block">Goals for Next Week</label>
                    <textarea
                      rows={2}
                      disabled={isPublished}
                      placeholder="Define specific milestone targets for the upcoming week..."
                      value={nextWeekGoals}
                      onChange={(e) => setNextWeekGoals(e.target.value)}
                      className="w-full p-3 bg-[#0D1527] border border-[#1E293B] rounded-xl text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-purple-500 disabled:opacity-60"
                    />
                  </div>

                  {/* Action Items List */}
                  <div className="space-y-3 pt-3 border-t border-[#1A263D]">
                    <label className="text-xs font-bold text-white block">Action Items Assigned to Student</label>
                    
                    {!isPublished && (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g. Refactor SQL query to use subqueries or CTEs..."
                          value={newActionItemDesc}
                          onChange={(e) => setNewActionItemDesc(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddActionItem(); } }}
                          className="flex-1 px-3 py-2 bg-[#0D1527] border border-[#1E293B] rounded-xl text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-purple-500"
                        />
                        <button
                          type="button"
                          onClick={handleAddActionItem}
                          className="px-3.5 py-2 rounded-xl bg-[#1E293B] hover:bg-[#2A3756] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Item</span>
                        </button>
                      </div>
                    )}

                    <div className="space-y-2">
                      {actionItems.map((item, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-[#0D1527] border border-[#1E293B] flex items-center justify-between text-xs">
                          <span className="text-white font-medium">{item.description}</span>
                          {!isPublished && (
                            <button
                              type="button"
                              onClick={() => handleRemoveActionItem(idx)}
                              className="p-1 text-[#64748B] hover:text-rose-400 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                      {actionItems.length === 0 && (
                        <p className="text-xs text-[#64748B] italic">No specific action items added yet.</p>
                      )}
                    </div>
                  </div>

                  {/* Form Actions: Save Draft vs Publish */}
                  {!isPublished && (
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1A263D]">
                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => handleSaveFeedback(false)}
                        className="px-4 py-2.5 rounded-xl bg-[#152138] hover:bg-[#1E2E4E] border border-[#2A3756] text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Draft</span>
                      </button>

                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => {
                          if (confirm('Are you sure you want to publish this feedback? Once published, it will be immediately visible to the student and locked for editing.')) {
                            handleSaveFeedback(true);
                          }
                        }}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-900/40 cursor-pointer transition-all disabled:opacity-50"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Publish Feedback</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
