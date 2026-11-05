import React, { useState, useEffect } from 'react';
import { api } from '../../api';
import { WeeklyCheckIn, BatchTeacher } from '../../types/weeklyCheckIn';
import { 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Send, 
  Lock, 
  Edit3, 
  Trash2, 
  RefreshCw, 
  Video, 
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Archive,
  History,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AdminWeeklyCheckInView: React.FC = () => {
  const [batches, setBatches] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<string>('');
  const [checkIns, setCheckIns] = useState<WeeklyCheckIn[]>([]);
  const [selectedCheckInId, setSelectedCheckInId] = useState<string | null>(null);
  const [selectedCheckInDetail, setSelectedCheckInDetail] = useState<WeeklyCheckIn | null>(null);

  const [batchTeachers, setBatchTeachers] = useState<BatchTeacher[]>([]);
  const [availableTeachers, setAvailableTeachers] = useState<Array<{ id: string; name: string; email: string }>>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDetailLoading, setIsDetailLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isSkipModalOpen, setIsSkipModalOpen] = useState<boolean>(false);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState<boolean>(false);
  const [isAllocateModalOpen, setIsAllocateModalOpen] = useState<boolean>(false);
  const [isAmendModalOpen, setIsAmendModalOpen] = useState<boolean>(false);
  const [activeAmendAssignment, setActiveAmendAssignment] = useState<any>(null);

  const [batchStudents, setBatchStudents] = useState<Array<{ id: string; name: string; email: string }>>([]);
  const [selectedStudentsForAllocation, setSelectedStudentsForAllocation] = useState<string[]>([]);
  const [teacherAllocationMap, setTeacherAllocationMap] = useState<Record<string, string>>({});
  const [isAllocatingLoading, setIsAllocatingLoading] = useState<boolean>(false);
  const [createWeekNumber, setCreateWeekNumber] = useState<number>(1);
  const [createTitle, setCreateTitle] = useState<string>('');
  const [createStartDate, setCreateStartDate] = useState<string>('');
  const [createEndDate, setCreateEndDate] = useState<string>('');
  const [createDuration, setCreateDuration] = useState<number>(30);

  const [skipWeekNumber, setSkipWeekNumber] = useState<number>(1);
  const [skipTitle, setSkipTitle] = useState<string>('');
  const [skipStartDate, setSkipStartDate] = useState<string>('');
  const [skipEndDate, setSkipEndDate] = useState<string>('');
  const [skipReason, setSkipReason] = useState<string>('');

  const [closeReason, setCloseReason] = useState<string>('');

  // Amend form state
  const [amendReason, setAmendReason] = useState<string>('');
  const [amendAttendance, setAmendAttendance] = useState<number | ''>('');
  const [amendScore, setAmendScore] = useState<number | ''>('');
  const [amendGeneral, setAmendGeneral] = useState<string>('');
  const [amendStrengths, setAmendStrengths] = useState<string>('');
  const [amendAreas, setAmendAreas] = useState<string>('');
  const [amendGoals, setAmendGoals] = useState<string>('');

  // Scheduling inputs per assignment (keyed by assignmentId)
  const [scheduleData, setScheduleData] = useState<Record<string, { start: string; end: string; url: string }>>({});

  // 1. Initial Load: Fetch batches and teachers
  const loadBatchesAndTeachers = async () => {
    setIsLoading(true);
    try {
      const res = await api<{
        success: boolean;
        batches: Array<{ id: string; name: string }>;
        batchTeachers: BatchTeacher[];
        availableTeachers: Array<{ id: string; name: string; email: string }>;
      }>('/admin/check-ins/batch-teachers');

      if (res && res.success) {
        setBatches(res.batches);
        setBatchTeachers(res.batchTeachers);
        setAvailableTeachers(res.availableTeachers);
        if (res.batches.length > 0 && !selectedBatchId) {
          setSelectedBatchId(res.batches[0].id);
        }
      }
    } catch (err: any) {
      console.error('Error loading admin batches/teachers:', err);
      setError(err.message || 'Failed to initialize batch configuration.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBatchesAndTeachers();
  }, []);

  // 2. Fetch check-ins for the selected batch
  const fetchCheckIns = async () => {
    if (!selectedBatchId) return;
    try {
      const res = await api<{ success: boolean; checkIns: WeeklyCheckIn[] }>(`/admin/check-ins?batchId=${selectedBatchId}`);
      if (res && res.success) {
        setCheckIns(res.checkIns);
        if (res.checkIns.length > 0) {
          if (!selectedCheckInId || !res.checkIns.find(c => c.id === selectedCheckInId)) {
            setSelectedCheckInId(res.checkIns[0].id);
          }
        } else {
          setSelectedCheckInId(null);
          setSelectedCheckInDetail(null);
        }
      }
    } catch (err: any) {
      console.error('Error fetching check-ins:', err);
    }
  };

  useEffect(() => {
    fetchCheckIns();
  }, [selectedBatchId]);

  // 3. Fetch full detail for selected check-in
  const fetchCheckInDetail = async (id: string) => {
    setIsDetailLoading(true);
    try {
      const res = await api<{ success: boolean; checkIn: WeeklyCheckIn }>(`/admin/check-ins/${id}`);
      if (res && res.success) {
        setSelectedCheckInDetail(res.checkIn);
        // Pre-fill scheduleData
        const initialSchedules: Record<string, { start: string; end: string; url: string }> = {};
        if (res.checkIn.students) {
          for (const s of res.checkIn.students) {
            initialSchedules[s.id] = {
              start: s.scheduledStartAt ? s.scheduledStartAt.slice(0, 16) : '',
              end: s.scheduledEndAt ? s.scheduledEndAt.slice(0, 16) : '',
              url: s.meetingUrl || '',
            };
          }
        }
        setScheduleData(initialSchedules);
      }
    } catch (err: any) {
      console.error('Error fetching checkIn detail:', err);
    } finally {
      setIsDetailLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCheckInId) {
      fetchCheckInDetail(selectedCheckInId);
    }
  }, [selectedCheckInId]);

  // Helper Toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Actions
  const handleToggleTeacherEligibility = async (teacherId: string, currentStatus: boolean) => {
    try {
      const res = await api<{ success: boolean; batchTeacher: any }>('/admin/check-ins/batch-teachers', {
        method: 'POST',
        body: {
          batchId: selectedBatchId,
          teacherId,
          isActive: !currentStatus,
        },
      });
      if (res && res.success) {
        showToast('Teacher batch eligibility updated.');
        loadBatchesAndTeachers();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update teacher eligibility.');
    }
  };

  const handleCreateCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createTitle.trim() || !createStartDate || !createEndDate) {
      alert('Please fill out all required fields.');
      return;
    }
    try {
      const res = await api<{ success: boolean; checkIn: WeeklyCheckIn }>('/admin/check-ins', {
        method: 'POST',
        body: {
          batchId: selectedBatchId,
          weekNumber: Number(createWeekNumber),
          title: createTitle.trim(),
          scheduledStartDate: new Date(createStartDate).toISOString(),
          scheduledEndDate: new Date(createEndDate).toISOString(),
          defaultDurationMinutes: Number(createDuration),
          isSkipped: false,
        },
      });
      if (res && res.success) {
        showToast(`Created check-in: ${res.checkIn.title}`);
        setIsCreateModalOpen(false);
        setCreateTitle('');
        fetchCheckIns();
        setSelectedCheckInId(res.checkIn.id);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to create check-in.');
    }
  };

  const handleSkipWeek = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skipReason.trim()) {
      alert('A mandatory reason is required when skipping a week.');
      return;
    }
    try {
      const res = await api<{ success: boolean; checkIn: WeeklyCheckIn }>('/admin/check-ins', {
        method: 'POST',
        body: {
          batchId: selectedBatchId,
          weekNumber: Number(skipWeekNumber),
          title: skipTitle.trim() || `Skipped Week ${skipWeekNumber}`,
          scheduledStartDate: new Date(skipStartDate).toISOString(),
          scheduledEndDate: new Date(skipEndDate).toISOString(),
          isSkipped: true,
          skipReason: skipReason.trim(),
        },
      });
      if (res && res.success) {
        showToast(`Week ${skipWeekNumber} marked as SKIPPED.`);
        setIsSkipModalOpen(false);
        setSkipReason('');
        fetchCheckIns();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to skip week.');
    }
  };

  const handlePublishCheckIn = async () => {
    if (!selectedCheckInId || !selectedCheckInDetail) return;
    
    // Client-side verification before sending to backend
    const assignments = selectedCheckInDetail.students || [];
    if (assignments.length === 0) {
      alert('Cannot publish check-in: 0 students are allocated.');
      return;
    }

    const missingSchedule = assignments.some(a => !a.scheduledStartAt || !a.scheduledEndAt || !a.meetingUrl);
    if (missingSchedule) {
      alert('Cannot publish check-in: Every student assignment must be scheduled with a start time, end time, and meeting URL.');
      return;
    }

    if (!confirm('Are you sure you want to publish this weekly check-in? Students and teachers will receive in-app notifications, and sessions will become active.')) {
      return;
    }

    try {
      const res = await api<{ success: boolean; checkIn: WeeklyCheckIn }>(`/admin/check-ins/${selectedCheckInId}`, {
        method: 'PATCH',
        body: { action: 'PUBLISH' },
      });
      if (res && res.success) {
        showToast('Weekly check-in published and ACTIVE!');
        fetchCheckIns();
        fetchCheckInDetail(selectedCheckInId);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to publish check-in.');
    }
  };

  const handleSaveSchedules = async () => {
    if (!selectedCheckInId || !selectedCheckInDetail) return;
    const sessions = Object.entries(scheduleData).map(([assignmentId, data]) => ({
      assignmentId,
      scheduledStartAt: data.start ? new Date(data.start).toISOString() : null,
      scheduledEndAt: data.end ? new Date(data.end).toISOString() : null,
      meetingUrl: data.url.trim() || null,
    })).filter(s => s.scheduledStartAt && s.scheduledEndAt);

    if (sessions.length === 0) {
      alert('Please fill out at least one session schedule with start and end times.');
      return;
    }

    try {
      const res = await api<{ success: boolean }>(`/admin/check-ins/${selectedCheckInId}/schedule`, {
        method: 'POST',
        body: { sessions },
      });
      if (res && res.success) {
        showToast('Session schedules saved successfully!');
        fetchCheckInDetail(selectedCheckInId);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to save session schedules.');
    }
  };

  // Open Allocate Modal and load batch students
  const handleOpenAllocateModal = async () => {
    if (!selectedCheckInId || !selectedBatchId) return;
    setIsAllocatingLoading(true);
    setIsAllocateModalOpen(true);
    try {
      const res = await api<{ success: boolean; students: Array<any> }>('/admin/students');
      if (res && res.success) {
        // Filter students belonging to this batch with ACTIVE status
        const activeCohortStudents = res.students
          .filter((s: any) => s.batchId === selectedBatchId && s.status === 'ACTIVE')
          .map((s: any) => ({ id: s.id, name: s.name, email: s.email }));
        setBatchStudents(activeCohortStudents);

        // Pre-select already allocated students and their teachers
        if (selectedCheckInDetail?.students) {
          const preSelected = selectedCheckInDetail.students.map(s => s.studentId);
          setSelectedStudentsForAllocation(preSelected);
          const map: Record<string, string> = {};
          for (const s of selectedCheckInDetail.students) {
            map[s.studentId] = s.teacherId;
          }
          setTeacherAllocationMap(map);
        }
      }
    } catch (err: any) {
      console.error('Error fetching students for allocation:', err);
      alert('Failed to load batch students.');
    } finally {
      setIsAllocatingLoading(false);
    }
  };

  const handleSaveAllocations = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCheckInId) return;

    if (selectedStudentsForAllocation.length === 0) {
      alert('Please select at least one student to allocate.');
      return;
    }

    // Verify all selected students have a teacher assigned
    const unassigned = selectedStudentsForAllocation.find(id => !teacherAllocationMap[id]);
    if (unassigned) {
      const studentObj = batchStudents.find(s => s.id === unassigned);
      alert(`Please select an assigned teacher for student: ${studentObj?.name || unassigned}`);
      return;
    }

    // Check teacher capacity (max 5) on client-side before submission
    const teacherCounts: Record<string, number> = {};
    for (const sid of selectedStudentsForAllocation) {
      const tid = teacherAllocationMap[sid];
      teacherCounts[tid] = (teacherCounts[tid] || 0) + 1;
      if (teacherCounts[tid] > 5) {
        const teacherObj = availableTeachers.find(t => t.id === tid);
        alert(`Capacity limit exceeded: Teacher "${teacherObj?.name || tid}" cannot be assigned more than 5 students per check-in.`);
        return;
      }
    }

    const payload = selectedStudentsForAllocation.map(sid => ({
      studentId: sid,
      teacherId: teacherAllocationMap[sid]
    }));

    setIsAllocatingLoading(true);
    try {
      const res = await api<{ success: boolean; assignments: any[] }>(`/admin/check-ins/${selectedCheckInId}/allocate`, {
        method: 'POST',
        body: { allocations: payload }
      });
      if (res && res.success) {
        showToast(`Successfully allocated ${res.assignments.length} students.`);
        setIsAllocateModalOpen(false);
        fetchCheckInDetail(selectedCheckInId);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to allocate students.');
    } finally {
      setIsAllocatingLoading(false);
    }
  };

  const handleToggleStudentSelection = (studentId: string) => {
    setSelectedStudentsForAllocation(prev => {
      if (prev.includes(studentId)) {
        return prev.filter(id => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };

  const handleCloseCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCheckInId || !closeReason.trim()) {
      alert('A mandatory reason is required to close an unresolved check-in.');
      return;
    }
    try {
      const res = await api<{ success: boolean }>(`/admin/check-ins/${selectedCheckInId}`, {
        method: 'PATCH',
        body: { action: 'CLOSE', closeReason: closeReason.trim() },
      });
      if (res && res.success) {
        showToast('Check-in closed. Remaining sessions marked as MISSED.');
        setIsCloseModalOpen(false);
        setCloseReason('');
        fetchCheckIns();
        fetchCheckInDetail(selectedCheckInId);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to close check-in.');
    }
  };

  const handleOpenAmendModal = (assignment: any) => {
    setActiveAmendAssignment(assignment);
    const fb = assignment.feedback || {};
    setAmendReason('');
    setAmendAttendance(fb.attendanceRating ?? '');
    setAmendScore(fb.taskCompletionScore ?? '');
    setAmendGeneral(fb.generalFeedback ?? '');
    setAmendStrengths(fb.strengths ?? '');
    setAmendAreas(fb.areasForImprovement ?? '');
    setAmendGoals(fb.nextWeekGoals ?? '');
    setIsAmendModalOpen(true);
  };

  const handleSaveAmendment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAmendAssignment || !amendReason.trim()) {
      alert('A mandatory amendmentReason is required to amend published feedback.');
      return;
    }
    try {
      const res = await api<{ success: boolean }>(`/admin/check-ins/assignments/${activeAmendAssignment.id}/amend`, {
        method: 'POST',
        body: {
          amendmentReason: amendReason.trim(),
          attendanceRating: amendAttendance === '' ? null : Number(amendAttendance),
          taskCompletionScore: amendScore === '' ? null : Number(amendScore),
          generalFeedback: amendGeneral.trim() || null,
          strengths: amendStrengths.trim() || null,
          areasForImprovement: amendAreas.trim() || null,
          nextWeekGoals: amendGoals.trim() || null,
        },
      });
      if (res && res.success) {
        showToast('Feedback amended and logged in audit history.');
        setIsAmendModalOpen(false);
        if (selectedCheckInId) fetchCheckInDetail(selectedCheckInId);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to amend feedback.');
    }
  };

  const eligibleTeachersForBatch = batchTeachers.filter(bt => bt.batchId === selectedBatchId && bt.isActive);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 bg-[#0F1E38] border border-blue-500/50 p-4 rounded-xl shadow-2xl shadow-blue-950/30 text-white flex items-center gap-3"
          >
            <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
            <p className="text-xs text-white font-medium">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0C1528] via-[#0E1A33] to-[#0A1120] border border-blue-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md bg-blue-600/30 text-blue-300 border border-blue-500/40 text-[10px] font-mono font-bold uppercase">
              ADMIN CONTROL PANEL
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white">Weekly Progress Check-In Management</h1>
          </div>
          <p className="text-xs text-[#94A3B8]">
            Configure cohort batches, assign students to eligible faculty (max 5 capacity), schedule Google Meet/Zoom URLs, publish sprint cycles, and oversee audit logs.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsSkipModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-[#1E192B] hover:bg-[#2D1F42] border border-purple-500/30 text-purple-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Archive className="w-3.5 h-3.5" />
            <span>Skip Week</span>
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-900/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Check-In</span>
          </button>
        </div>
      </div>

      {/* Cohort Batch Selector Bar */}
      <div className="p-4 rounded-2xl bg-[#0A1120] border border-[#1A263D] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">Select Batch:</label>
          <select
            value={selectedBatchId}
            onChange={(e) => setSelectedBatchId(e.target.value)}
            className="px-3 py-1.5 bg-[#0D1527] border border-[#1E293B] rounded-xl text-xs font-bold text-white focus:outline-none focus:border-blue-500"
          >
            {batches.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>

        {/* Eligible Batch Teachers Badge Summary */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#94A3B8]">Eligible Teachers:</span>
          <div className="flex items-center gap-1.5">
            {eligibleTeachersForBatch.map(bt => (
              <span key={bt.id} className="px-2 py-0.5 rounded-md bg-[#152138] border border-[#2A3756] text-[11px] font-semibold text-white">
                {bt.teacher.name}
              </span>
            ))}
            {eligibleTeachersForBatch.length === 0 && (
              <span className="text-xs text-amber-400 italic">No teachers configured</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Check-In Cycles list on Left, Active Cycle Details on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Weekly Check-In Cycles */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider px-1 flex items-center gap-2">
            <History className="w-3.5 h-3.5" />
            <span>Weekly Cycles ({checkIns.length})</span>
          </h3>

          <div className="space-y-2.5 max-h-[750px] overflow-y-auto pr-1">
            {checkIns.map((ci) => {
              const isSelected = ci.id === selectedCheckInId;
              const isDraft = ci.status === 'DRAFT';
              const isActive = ci.status === 'ACTIVE';
              const isCompleted = ci.status === 'COMPLETED';
              const isSkipped = ci.status === 'SKIPPED';

              return (
                <div
                  key={ci.id}
                  onClick={() => setSelectedCheckInId(ci.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#101D36] border-blue-500 shadow-md shadow-blue-900/20'
                      : 'bg-[#0A1120] border-[#1A263D] hover:border-[#2A3756]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold">
                      WEEK {ci.weekNumber}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                        : isCompleted
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : isSkipped
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    }`}>
                      {ci.status}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white line-clamp-1">{ci.title}</h4>

                  {isSkipped ? (
                    <p className="text-[11px] text-amber-300/80 mt-1 italic line-clamp-1">
                      Reason: {ci.skipReason}
                    </p>
                  ) : (
                    <div className="mt-2 pt-2 border-t border-[#1A263D] flex items-center justify-between text-[11px] text-[#64748B]">
                      <span>{ci.students?.length || 0} students assigned</span>
                      <span className="font-mono">{ci.defaultDurationMinutes}m sessions</span>
                    </div>
                  )}
                </div>
              );
            })}

            {checkIns.length === 0 && (
              <div className="p-8 text-center bg-[#0A1120] border border-[#1A263D] rounded-xl text-xs text-[#64748B]">
                No weekly check-ins created for this batch yet.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Selected Cycle Workspace */}
        <div className="lg:col-span-8 space-y-6">
          {selectedCheckInDetail ? (
            <div className="p-6 rounded-2xl bg-[#0A1120] border border-[#1A263D] space-y-6">
              {/* Cycle Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1A263D]">
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#64748B] font-mono mb-1">
                    <span>WEEK {selectedCheckInDetail.weekNumber}</span>
                    <span>•</span>
                    <span className="text-white font-bold">{selectedCheckInDetail.status}</span>
                  </div>
                  <h2 className="text-xl font-bold text-white">{selectedCheckInDetail.title}</h2>
                  <p className="text-xs text-[#94A3B8] mt-0.5">
                    Window: {new Date(selectedCheckInDetail.scheduledStartDate).toLocaleDateString('en-GB')} – {new Date(selectedCheckInDetail.scheduledEndDate).toLocaleDateString('en-GB')}
                  </p>
                </div>

                {/* State Control Buttons */}
                <div className="flex items-center gap-2">
                  {selectedCheckInDetail.status === 'DRAFT' && (
                    <button
                      onClick={handlePublishCheckIn}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950/30 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Publish Check-In</span>
                    </button>
                  )}

                  {selectedCheckInDetail.status === 'ACTIVE' && (
                    <button
                      onClick={() => setIsCloseModalOpen(true)}
                      className="px-3.5 py-2 rounded-xl bg-[#2D1218] hover:bg-[#3D1822] border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Close Cycle</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Student Assignments & Scheduling Workspace */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-400" />
                    <span>Allocated Students ({selectedCheckInDetail.students?.length || 0})</span>
                  </h3>

                  {/* Student Allocation button & Save schedules */}
                  {selectedCheckInDetail.status === 'DRAFT' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleOpenAllocateModal}
                        className="px-3 py-1.5 rounded-lg bg-[#152138] hover:bg-[#1E2E4E] border border-[#2A3756] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Users className="w-3.5 h-3.5 text-blue-400" />
                        <span>Allocate Students</span>
                      </button>
                      <button
                        onClick={handleSaveSchedules}
                        className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <span>Save Schedules</span>
                      </button>
                    </div>
                  )}
                </div>

                {selectedCheckInDetail.students && selectedCheckInDetail.students.length > 0 ? (
                  <div className="space-y-3">
                    {selectedCheckInDetail.students.map((assignment) => {
                      const sched = scheduleData[assignment.id] || { start: '', end: '', url: '' };
                      const hasPublished = assignment.feedback?.status === 'PUBLISHED';

                      return (
                        <div
                          key={assignment.id}
                          className="p-4 rounded-xl bg-[#0D1527] border border-[#1E293B] space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-300 font-bold text-xs">
                                {assignment.student.name[0]}
                              </div>
                              <div>
                                <span className="text-xs font-bold text-white block">{assignment.student.name}</span>
                                <span className="text-[11px] text-[#94A3B8]">{assignment.student.email}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-xs text-[#94A3B8]">Teacher:</span>
                              <span className="text-xs font-semibold text-white px-2 py-0.5 rounded bg-[#152138] border border-[#2A3756]">
                                {assignment.teacher.name}
                              </span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ml-1 ${
                                assignment.status === 'COMPLETED'
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : assignment.status === 'MISSED'
                                  ? 'bg-rose-500/20 text-rose-300'
                                  : 'bg-sky-500/20 text-sky-300'
                              }`}>
                                {assignment.status}
                              </span>
                            </div>
                          </div>

                          {/* Scheduling Input Controls */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#1E293B]">
                            <div>
                              <label className="text-[10px] text-[#94A3B8] block mb-1">Start Time</label>
                              <input
                                type="datetime-local"
                                disabled={selectedCheckInDetail.status !== 'DRAFT'}
                                value={sched.start}
                                onChange={(e) => setScheduleData(prev => ({
                                  ...prev,
                                  [assignment.id]: { ...prev[assignment.id], start: e.target.value }
                                }))}
                                className="w-full px-2.5 py-1.5 bg-[#0A1120] border border-[#1A263D] rounded-lg text-xs text-white focus:outline-none focus:border-blue-500 disabled:opacity-50"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] text-[#94A3B8] block mb-1">End Time</label>
                              <input
                                type="datetime-local"
                                disabled={selectedCheckInDetail.status !== 'DRAFT'}
                                value={sched.end}
                                onChange={(e) => setScheduleData(prev => ({
                                  ...prev,
                                  [assignment.id]: { ...prev[assignment.id], end: e.target.value }
                                }))}
                                className="w-full px-2.5 py-1.5 bg-[#0A1120] border border-[#1A263D] rounded-lg text-xs text-white focus:outline-none focus:border-blue-500 disabled:opacity-50"
                              />
                            </div>

                            <div>
                              <label className="text-[10px] text-[#94A3B8] block mb-1">Google Meet / Zoom URL</label>
                              <input
                                type="url"
                                placeholder="https://meet.google.com/..."
                                disabled={selectedCheckInDetail.status !== 'DRAFT'}
                                value={sched.url}
                                onChange={(e) => setScheduleData(prev => ({
                                  ...prev,
                                  [assignment.id]: { ...prev[assignment.id], url: e.target.value }
                                }))}
                                className="w-full px-2.5 py-1.5 bg-[#0A1120] border border-[#1A263D] rounded-lg text-xs text-white focus:outline-none focus:border-blue-500 disabled:opacity-50"
                              />
                            </div>
                          </div>

                          {/* Admin Feedback Amendment trigger if feedback is published */}
                          {hasPublished && (
                            <div className="pt-2 flex items-center justify-between text-xs border-t border-[#1E293B]">
                              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Feedback Published · Score: {assignment.feedback?.taskCompletionScore}% · Rating: {assignment.feedback?.attendanceRating}/5</span>
                              </span>

                              <button
                                type="button"
                                onClick={() => handleOpenAmendModal(assignment)}
                                className="px-3 py-1 rounded bg-[#1E293B] hover:bg-[#2A3756] text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                              >
                                <Edit3 className="w-3 h-3 text-amber-400" />
                                <span>Amend Feedback</span>
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-[#0D1527] border border-[#1E293B] rounded-xl text-xs text-[#64748B]">
                    No students allocated yet. Allocate students to available teachers before publishing.
                  </div>
                )}
              </div>

              {/* Audit Log Trail */}
              {selectedCheckInDetail.auditLogs && selectedCheckInDetail.auditLogs.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-[#1A263D]">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <History className="w-4 h-4 text-purple-400" />
                    <span>Audit Trail ({selectedCheckInDetail.auditLogs.length} events)</span>
                  </h3>

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {selectedCheckInDetail.auditLogs.map((log) => (
                      <div key={log.id} className="p-2.5 rounded-lg bg-[#0D1527] border border-[#1E293B] text-xs flex items-center justify-between">
                        <div className="space-y-0.5">
                          <span className="font-mono text-purple-300 font-bold">{log.action}</span>
                          <p className="text-[11px] text-[#94A3B8]">
                            Actor: {log.actor ? `${log.actor.name} (${log.actor.role})` : 'System Engine'}
                          </p>
                        </div>
                        <span className="text-[10px] text-[#64748B] font-mono">
                          {new Date(log.occurredAt).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-16 text-center bg-[#0A1120] border border-[#1A263D] rounded-2xl text-xs text-[#64748B]">
              Select a weekly check-in from the list to view its workspace.
            </div>
          )}
        </div>
      </div>

      {/* MODAL 1: Create Weekly Check-In */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#0D1527] border border-[#1E293B] rounded-2xl p-6 text-white space-y-4 shadow-2xl"
            >
              <h3 className="text-lg font-bold text-white">Create Weekly Check-In</h3>
              <form onSubmit={handleCreateCheckIn} className="space-y-3.5">
                <div>
                  <label className="text-xs text-[#94A3B8] block mb-1">Week Number</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={createWeekNumber}
                    onChange={(e) => setCreateWeekNumber(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#0A1120] border border-[#1A263D] rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#94A3B8] block mb-1">Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sprint Review & Capstone Milestone 7"
                    value={createTitle}
                    onChange={(e) => setCreateTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0A1120] border border-[#1A263D] rounded-xl text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-[#94A3B8] block mb-1">Start Date</label>
                    <input
                      type="date"
                      required
                      value={createStartDate}
                      onChange={(e) => setCreateStartDate(e.target.value)}
                      className="w-full px-3 py-2 bg-[#0A1120] border border-[#1A263D] rounded-xl text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#94A3B8] block mb-1">End Date</label>
                    <input
                      type="date"
                      required
                      value={createEndDate}
                      onChange={(e) => setCreateEndDate(e.target.value)}
                      className="w-full px-3 py-2 bg-[#0A1120] border border-[#1A263D] rounded-xl text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-[#94A3B8] block mb-1">Session Duration</label>
                  <select
                    value={createDuration}
                    onChange={(e) => setCreateDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#0A1120] border border-[#1A263D] rounded-xl text-xs text-white"
                  >
                    <option value={15}>15 Minutes</option>
                    <option value={30}>30 Minutes (Default)</option>
                    <option value={45}>45 Minutes</option>
                    <option value={60}>60 Minutes</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-[#152138] text-xs font-semibold text-[#94A3B8]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
                  >
                    Create
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: Skip Week with Mandatory Reason */}
      <AnimatePresence>
        {isSkipModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#0D1527] border border-[#1E293B] rounded-2xl p-6 text-white space-y-4 shadow-2xl"
            >
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Archive className="w-5 h-5 text-amber-400" />
                <span>Skip Weekly Check-In</span>
              </h3>
              <form onSubmit={handleSkipWeek} className="space-y-3.5">
                <div>
                  <label className="text-xs text-[#94A3B8] block mb-1">Week Number to Skip</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={skipWeekNumber}
                    onChange={(e) => setSkipWeekNumber(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#0A1120] border border-[#1A263D] rounded-xl text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-[#94A3B8] block mb-1">Window Start</label>
                    <input
                      type="date"
                      required
                      value={skipStartDate}
                      onChange={(e) => setSkipStartDate(e.target.value)}
                      className="w-full px-3 py-2 bg-[#0A1120] border border-[#1A263D] rounded-xl text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#94A3B8] block mb-1">Window End</label>
                    <input
                      type="date"
                      required
                      value={skipEndDate}
                      onChange={(e) => setSkipEndDate(e.target.value)}
                      className="w-full px-3 py-2 bg-[#0A1120] border border-[#1A263D] rounded-xl text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-amber-400 font-bold block mb-1">Mandatory Skip Reason</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Provide justification (e.g. Festival vacation, Mid-term examinations, National holiday)..."
                    value={skipReason}
                    onChange={(e) => setSkipReason(e.target.value)}
                    className="w-full p-3 bg-[#0A1120] border border-[#1A263D] rounded-xl text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsSkipModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-[#152138] text-xs font-semibold text-[#94A3B8]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold"
                  >
                    Confirm Skip
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: Close Unresolved Cycle */}
      <AnimatePresence>
        {isCloseModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#0D1527] border border-rose-500/40 rounded-2xl p-6 text-white space-y-4 shadow-2xl"
            >
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-400" />
                <span>Close Unresolved Check-In Cycle</span>
              </h3>
              <p className="text-xs text-[#94A3B8]">
                This will finalize this check-in cycle. Any remaining pending or unscheduled sessions will be marked as <strong>MISSED</strong>.
              </p>
              <form onSubmit={handleCloseCheckIn} className="space-y-3.5">
                <div>
                  <label className="text-xs text-rose-400 font-bold block mb-1">Mandatory Close Reason</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Provide justification for closing unresolved check-in (e.g. Scheduled window elapsed, academic cutoff)..."
                    value={closeReason}
                    onChange={(e) => setCloseReason(e.target.value)}
                    className="w-full p-3 bg-[#0A1120] border border-[#1A263D] rounded-xl text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-rose-400"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCloseModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-[#152138] text-xs font-semibold text-[#94A3B8]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
                  >
                    Confirm Close
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 4: Admin Feedback Amendment with Audit Trail */}
      <AnimatePresence>
        {isAmendModalOpen && activeAmendAssignment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#0D1527] border border-amber-500/40 rounded-2xl p-6 text-white space-y-4 shadow-2xl my-8"
            >
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-400" />
                <span>Audited Administrative Amendment</span>
              </h3>
              <p className="text-xs text-[#94A3B8]">
                Amending published feedback for <strong>{activeAmendAssignment.student.name}</strong>. A mandatory justification is permanently recorded in the immutable audit trail.
              </p>

              <form onSubmit={handleSaveAmendment} className="space-y-3.5">
                <div>
                  <label className="text-xs text-amber-400 font-bold block mb-1">
                    Mandatory Amendment Reason <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Corrected score after medical re-evaluation..."
                    value={amendReason}
                    onChange={(e) => setAmendReason(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0A1120] border border-[#1A263D] rounded-xl text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-[#94A3B8] block mb-1">Attendance Rating (1-5)</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={amendAttendance}
                      onChange={(e) => setAmendAttendance(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full px-3 py-2 bg-[#0A1120] border border-[#1A263D] rounded-xl text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-[#94A3B8] block mb-1">Task Score (0-100%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={amendScore}
                      onChange={(e) => setAmendScore(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full px-3 py-2 bg-[#0A1120] border border-[#1A263D] rounded-xl text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-[#94A3B8] block mb-1">General Summary</label>
                  <textarea
                    rows={2}
                    value={amendGeneral}
                    onChange={(e) => setAmendGeneral(e.target.value)}
                    className="w-full p-2.5 bg-[#0A1120] border border-[#1A263D] rounded-xl text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-emerald-400 block mb-1">Strengths</label>
                    <textarea
                      rows={2}
                      value={amendStrengths}
                      onChange={(e) => setAmendStrengths(e.target.value)}
                      className="w-full p-2.5 bg-[#0A1120] border border-[#1A263D] rounded-xl text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-amber-400 block mb-1">Areas for Improvement</label>
                    <textarea
                      rows={2}
                      value={amendAreas}
                      onChange={(e) => setAmendAreas(e.target.value)}
                      className="w-full p-2.5 bg-[#0A1120] border border-[#1A263D] rounded-xl text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-blue-400 block mb-1">Next Week Goals</label>
                  <textarea
                    rows={2}
                    value={amendGoals}
                    onChange={(e) => setAmendGoals(e.target.value)}
                    className="w-full p-2.5 bg-[#0A1120] border border-[#1A263D] rounded-xl text-xs text-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAmendModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-[#152138] text-xs font-semibold text-[#94A3B8]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold"
                  >
                    Save Amendment
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 5: Student Allocation & Teacher Assignment */}
      <AnimatePresence>
        {isAllocateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-[#0D1527] border border-[#1E293B] rounded-2xl p-6 text-white space-y-4 shadow-2xl my-8"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-400" />
                    <span>Allocate Cohort Students to Faculty</span>
                  </h3>
                  <p className="text-xs text-[#94A3B8] mt-0.5">
                    Select active students from batch and assign them to eligible teachers (Max capacity: 5 students per teacher).
                  </p>
                </div>
                <span className="text-xs font-mono text-sky-400 font-bold px-2.5 py-1 bg-[#101D36] border border-blue-500/30 rounded-lg">
                  {selectedStudentsForAllocation.length} Selected
                </span>
              </div>

              {isAllocatingLoading ? (
                <div className="p-12 text-center text-xs text-[#94A3B8] font-mono animate-pulse">
                  Loading active batch students...
                </div>
              ) : batchStudents.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#64748B] italic">
                  No active students enrolled in this batch.
                </div>
              ) : (
                <form onSubmit={handleSaveAllocations} className="space-y-4">
                  <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                    {batchStudents.map((s) => {
                      const isSelected = selectedStudentsForAllocation.includes(s.id);
                      const assignedTeacherId = teacherAllocationMap[s.id] || '';

                      return (
                        <div
                          key={s.id}
                          className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                            isSelected
                              ? 'bg-[#101D36] border-blue-500/50'
                              : 'bg-[#0A1120] border-[#1A263D]'
                          }`}
                        >
                          <div
                            onClick={() => handleToggleStudentSelection(s.id)}
                            className="flex items-center gap-3 cursor-pointer select-none"
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}} // handled by parent onClick
                              className="w-4 h-4 rounded text-blue-600 focus:ring-0 focus:outline-none cursor-pointer"
                            />
                            <div>
                              <span className="text-xs font-bold text-white block">{s.name}</span>
                              <span className="text-[11px] text-[#94A3B8]">{s.email}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-[#94A3B8]">Assign Teacher:</span>
                            <select
                              disabled={!isSelected}
                              value={assignedTeacherId}
                              onChange={(e) => setTeacherAllocationMap(prev => ({ ...prev, [s.id]: e.target.value }))}
                              className="px-2.5 py-1 bg-[#0D1527] border border-[#1E293B] rounded-lg text-xs font-bold text-white focus:outline-none focus:border-blue-500 disabled:opacity-40"
                            >
                              <option value="">-- Choose Teacher --</option>
                              {eligibleTeachersForBatch.map(bt => (
                                <option key={bt.teacherId} value={bt.teacherId}>
                                  {bt.teacher.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1E293B]">
                    <button
                      type="button"
                      onClick={() => setIsAllocateModalOpen(false)}
                      className="px-4 py-2 rounded-xl bg-[#152138] text-xs font-semibold text-[#94A3B8]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isAllocatingLoading}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-900/30 disabled:opacity-50"
                    >
                      Save Allocations
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
