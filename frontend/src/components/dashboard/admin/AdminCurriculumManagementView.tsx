import React, { useState, useEffect } from 'react';
import { api } from '../../../api';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  Plus, 
  Trash2, 
  Save, 
  Eye, 
  AlertCircle, 
  Layers, 
  X, 
  RotateCcw,
  Check,
  ChevronDown,
  ChevronUp,
  BrainCircuit,
  ShieldCheck,
  Video
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TopicClass {
  id: string;
  title: string;
  description?: string;
  weekNumber: number;
  order: number;
  topicHeadlines: string[];
  isMinorProject?: boolean;
  isGenAI?: boolean;
  date?: string;
  startTime?: string;
  endTime?: string;
  zoomLink?: string;
  status?: string;
}

interface AdminCurriculumModule {
  id: string;
  title: string;
  order: number;
  durationWeeks: string;
  totalClasses: number;
  classes: TopicClass[];
  weeks?: {
    weekNumber: number;
    weekTitle: string;
    classes: TopicClass[];
  }[];
}

export const AdminCurriculumManagementView: React.FC = () => {
  const [moduleData, setModuleData] = useState<AdminCurriculumModule | null>(null);
  const [classesList, setClassesList] = useState<TopicClass[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Expanded headlines per class
  const [expandedClassIds, setExpandedClassIds] = useState<string[]>([]);
  const [newHeadlineInputs, setNewHeadlineInputs] = useState<Record<string, string>>({});

  // Preview Modal
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState<boolean>(false);
  const [previewSelectedClass, setPreviewSelectedClass] = useState<TopicClass | null>(null);

  const showToast = (type: 'success' | 'error' | 'info', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const fetchCurriculum = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api<{ success: boolean; module: AdminCurriculumModule }>('/admin/curriculum');
      if (res && res.success && res.module) {
        setModuleData(res.module);
        const sorted = [...(res.module.classes || [])].sort((a, b) => a.order - b.order);
        setClassesList(sorted);
        setExpandedClassIds(sorted.map(c => c.id));
      }
    } catch (err: any) {
      console.error('Failed to load admin curriculum:', err);
      setError(err.message || 'Failed to fetch curriculum from database.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurriculum();
  }, []);

  const toggleClassExpansion = (classId: string) => {
    setExpandedClassIds(prev => 
      prev.includes(classId) ? prev.filter(id => id !== classId) : [...prev, classId]
    );
  };

  const handleTitleChange = (id: string, newTitle: string) => {
    setClassesList(prev => prev.map(c => c.id === id ? { ...c, title: newTitle } : c));
  };

  const handleWeekChange = (id: string, newWeek: number) => {
    setClassesList(prev => prev.map(c => c.id === id ? { ...c, weekNumber: newWeek } : c));
  };

  const handleOrderChange = (id: string, newOrder: number) => {
    setClassesList(prev => prev.map(c => c.id === id ? { ...c, order: newOrder } : c));
  };

  const handleHeadlineChange = (classId: string, index: number, val: string) => {
    setClassesList(prev => prev.map(c => {
      if (c.id !== classId) return c;
      const updated = [...c.topicHeadlines];
      updated[index] = val;
      return { ...c, topicHeadlines: updated };
    }));
  };

  const handleRemoveHeadline = (classId: string, index: number) => {
    setClassesList(prev => prev.map(c => {
      if (c.id !== classId) return c;
      return {
        ...c,
        topicHeadlines: c.topicHeadlines.filter((_, idx) => idx !== index)
      };
    }));
  };

  const handleAddHeadline = (classId: string) => {
    const text = (newHeadlineInputs[classId] || '').trim();
    if (!text) return;

    setClassesList(prev => prev.map(c => {
      if (c.id !== classId) return c;
      return {
        ...c,
        topicHeadlines: [...c.topicHeadlines, text]
      };
    }));

    setNewHeadlineInputs(prev => ({ ...prev, [classId]: '' }));
  };

  const handleSaveChanges = async () => {
    if (!moduleData) return;

    // 1. Validation: No empty titles
    for (let i = 0; i < classesList.length; i++) {
      const cls = classesList[i];
      if (!cls.title || !cls.title.trim()) {
        showToast('error', `Class at position ${i + 1} has an empty title. Please enter a valid class title.`);
        return;
      }
      if (cls.weekNumber < 1 || cls.weekNumber > 3) {
        showToast('error', `Class "${cls.title}" has invalid week ${cls.weekNumber}. Must be Week 1, 2, or 3.`);
        return;
      }
    }

    // 2. Validation: No duplicate order numbers
    const orders = classesList.map(c => c.order);
    if (new Set(orders).size !== orders.length) {
      showToast('error', 'Duplicate class order detected. Each class must have a unique order number.');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        moduleId: moduleData.id,
        moduleTitle: 'SQL',
        classes: classesList.map(c => ({
          id: c.id,
          title: c.title.trim(),
          weekNumber: c.weekNumber,
          order: c.order,
          topicHeadlines: c.topicHeadlines.map(h => h.trim()).filter(Boolean),
          isMinorProject: c.order === 8 || c.isMinorProject,
          isGenAI: c.order === 8 || c.isGenAI
        }))
      };

      const res = await api<{ success: boolean; message: string }>('/admin/curriculum', {
        method: 'PUT',
        body: JSON.stringify(payload) as any
      });

      if (res && res.success) {
        showToast('success', res.message || 'Curriculum updated successfully in PostgreSQL database!');
        await fetchCurriculum();
      }
    } catch (err: any) {
      console.error('Failed to save curriculum:', err);
      showToast('error', err.message || 'Failed to persist curriculum updates to database.');
    } finally {
      setIsSaving(false);
    }
  };

  // Group classes by week for organized rendering
  const week1Classes = classesList.filter(c => c.weekNumber === 1).sort((a, b) => a.order - b.order);
  const week2Classes = classesList.filter(c => c.weekNumber === 2).sort((a, b) => a.order - b.order);
  const week3Classes = classesList.filter(c => c.weekNumber === 3).sort((a, b) => a.order - b.order);

  if (isLoading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center space-y-3 bg-[#0A1120] rounded-2xl border border-[#1A263D]">
        <div className="w-8 h-8 rounded-full border-2 border-blue-500/20 border-t-blue-400 animate-spin" />
        <span className="text-xs text-[#94A3B8] font-mono tracking-wider animate-pulse">Loading SQL Curriculum from Database...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-[#0A1120] rounded-2xl border border-rose-500/30 text-center space-y-3">
        <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
        <h3 className="text-sm font-bold text-white">Database Curriculum Connection Failed</h3>
        <p className="text-xs text-[#94A3B8]">{error}</p>
        <button
          onClick={fetchCurriculum}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white rounded-xl transition cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* 1. TOP HEADER & CONTROLS */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0C1528] via-[#0E1A33] to-[#0A1120] border border-blue-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-md bg-blue-600/30 text-blue-300 border border-blue-500/40 text-[10px] font-mono font-bold uppercase">
              ADMIN CURRICULUM MANAGEMENT
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold uppercase">
              POSTGRESQL SYNCED
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
            <span>Module 1: SQL Curriculum</span>
            <span className="text-xs font-normal text-[#94A3B8]">(3 Weeks · Exactly 8 Classes)</span>
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1 max-w-2xl leading-relaxed">
            Maintain curriculum titles, class sequence, and topic headlines. Changes persist directly to the PostgreSQL database and update student views in real time.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              setPreviewSelectedClass(classesList[0] || null);
              setIsPreviewModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-[#0F1A2E] hover:bg-[#16243D] border border-[#1E2E4A] text-xs font-semibold text-[#CBD5E1] hover:text-white transition-all flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Eye className="w-4 h-4 text-sky-400" />
            <span>Preview Student View</span>
          </button>

          <button
            disabled={isSaving}
            onClick={handleSaveChanges}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving to Database...' : 'Save Changes to Database'}</span>
          </button>
        </div>
      </div>

      {/* 2. STATS STRIP */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-4 rounded-xl bg-[#0A1120] border border-[#1A263D] flex items-center justify-between">
          <span className="text-[#94A3B8]">Target Module</span>
          <span className="font-bold text-white font-mono">SQL (Module 1)</span>
        </div>
        <div className="p-4 rounded-xl bg-[#0A1120] border border-[#1A263D] flex items-center justify-between">
          <span className="text-[#94A3B8]">Configured Duration</span>
          <span className="font-bold text-amber-400 font-mono">3 Weeks</span>
        </div>
        <div className="p-4 rounded-xl bg-[#0A1120] border border-[#1A263D] flex items-center justify-between">
          <span className="text-[#94A3B8]">Total Classes</span>
          <span className="font-bold text-emerald-400 font-mono">{classesList.length} / 8</span>
        </div>
        <div className="p-4 rounded-xl bg-[#0A1120] border border-[#1A263D] flex items-center justify-between">
          <span className="text-[#94A3B8]">Final Capstone</span>
          <span className="font-bold text-purple-400 font-mono">Minor Project + GenAI</span>
        </div>
      </div>

      {/* 3. WEEKS ACCORDION SECTIONS */}
      <div className="space-y-6">
        {[
          { weekNum: 1, title: 'Week 1 — SQL Foundations', classes: week1Classes },
          { weekNum: 2, title: 'Week 2 — Data Analysis with SQL', classes: week2Classes },
          { weekNum: 3, title: 'Week 3 — Advanced SQL & Minor Project', classes: week3Classes }
        ].map(({ weekNum, title, classes }) => (
          <div key={weekNum} className="bg-[#0A1120] rounded-2xl border border-[#1A263D] overflow-hidden shadow-sm">
            
            {/* Week Header */}
            <div className="p-4 sm:p-5 bg-[#0D1627] border-b border-[#1A263D] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center font-bold font-mono text-xs">
                  W{weekNum}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">{title}</h3>
                  <p className="text-[11px] text-[#94A3B8]">{classes.length} {classes.length === 1 ? 'Class' : 'Classes'} scheduled in this week</p>
                </div>
              </div>

              <span className="text-[11px] font-mono text-[#64748B]">
                Week {weekNum} of 3
              </span>
            </div>

            {/* Classes in Week */}
            <div className="p-4 sm:p-6 space-y-4">
              {classes.map((cls) => {
                const isExpanded = expandedClassIds.includes(cls.id);
                const isMinorProject = cls.order === 8 || cls.isMinorProject;

                return (
                  <div 
                    key={cls.id}
                    className={`rounded-xl border transition-all ${
                      isMinorProject 
                        ? 'bg-[#101428] border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.08)]' 
                        : 'bg-[#080E1C] border-[#182338]'
                    } p-4 space-y-4`}
                  >
                    
                    {/* Class Row: Order, Title Input, Week Selector, Expand button */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      
                      {/* Left: Class order & Title input */}
                      <div className="flex-1 flex items-center gap-3 min-w-0">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                          isMinorProject ? 'bg-purple-600 text-white shadow-xs' : 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                        }`}>
                          {cls.order}
                        </div>

                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={cls.title}
                              onChange={(e) => handleTitleChange(cls.id, e.target.value)}
                              placeholder="Class title..."
                              className="w-full px-3 py-1.5 rounded-lg bg-[#050914] border border-[#1E2E4A] focus:border-blue-500 text-white font-bold text-xs sm:text-sm focus:outline-none transition-colors"
                            />
                            {isMinorProject && (
                              <span className="shrink-0 px-2.5 py-1 rounded-md bg-purple-600/30 text-purple-300 border border-purple-500/40 text-[10px] font-bold flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-purple-400" />
                                <span>Minor Project + GenAI</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Week selector, Order selector, Toggle Headlines */}
                      <div className="flex items-center gap-2.5 shrink-0 self-end md:self-auto text-xs">
                        <div className="flex items-center gap-1.5 bg-[#050914] px-2.5 py-1 rounded-lg border border-[#1E2E4A]">
                          <span className="text-[#64748B] text-[10px] uppercase">Week</span>
                          <select
                            value={cls.weekNumber}
                            onChange={(e) => handleWeekChange(cls.id, parseInt(e.target.value, 10))}
                            className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
                          >
                            <option value={1} className="bg-[#0B1324]">Week 1</option>
                            <option value={2} className="bg-[#0B1324]">Week 2</option>
                            <option value={3} className="bg-[#0B1324]">Week 3</option>
                          </select>
                        </div>

                        <div className="flex items-center gap-1.5 bg-[#050914] px-2.5 py-1 rounded-lg border border-[#1E2E4A]">
                          <span className="text-[#64748B] text-[10px] uppercase">Order</span>
                          <input
                            type="number"
                            min={1}
                            max={12}
                            value={cls.order}
                            onChange={(e) => handleOrderChange(cls.id, parseInt(e.target.value, 10) || 1)}
                            className="w-10 bg-transparent text-white font-bold text-center focus:outline-none"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleClassExpansion(cls.id)}
                          className="px-3 py-1.5 rounded-lg bg-[#0F172A] hover:bg-[#1E293B] text-[#94A3B8] hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <span className="text-[11px]">{cls.topicHeadlines.length} Topics</span>
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                    </div>

                    {/* Collapsible: Topic Headlines Editor */}
                    {isExpanded && (
                      <div className="pt-3 border-t border-[#162035] space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-[#CBD5E1] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-blue-400" />
                            <span>Topic Headlines ({cls.topicHeadlines.length})</span>
                          </span>
                          <span className="text-[10px] text-[#64748B]">
                            Headline list displayed in student view
                          </span>
                        </div>

                        {/* List of topic headlines */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {cls.topicHeadlines.map((headline, hIdx) => (
                            <div 
                              key={hIdx}
                              className="flex items-center gap-2 p-1.5 pl-2.5 bg-[#050914] rounded-lg border border-[#1A263D] hover:border-[#223554] transition-colors"
                            >
                              <span className="w-4 h-4 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-bold flex items-center justify-center shrink-0">
                                {hIdx + 1}
                              </span>
                              <input
                                type="text"
                                value={headline}
                                onChange={(e) => handleHeadlineChange(cls.id, hIdx, e.target.value)}
                                className="flex-1 bg-transparent text-xs text-white focus:outline-none font-medium"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveHeadline(cls.id, hIdx)}
                                className="p-1 text-[#64748B] hover:text-rose-400 transition-colors cursor-pointer"
                                title="Remove headline"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Add new headline input */}
                        <div className="flex items-center gap-2 pt-1">
                          <input
                            type="text"
                            placeholder="Add new topic headline (e.g. Inline Calculations)..."
                            value={newHeadlineInputs[cls.id] || ''}
                            onChange={(e) => setNewHeadlineInputs(prev => ({ ...prev, [cls.id]: e.target.value }))}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddHeadline(cls.id);
                              }
                            }}
                            className="flex-1 px-3 py-1.5 rounded-lg bg-[#050914] border border-[#1E2E4A] text-xs text-white placeholder-[#475569] focus:outline-none focus:border-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddHeadline(cls.id)}
                            className="px-3.5 py-1.5 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 border border-blue-500/40 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Headline</span>
                          </button>
                        </div>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>

          </div>
        ))}
      </div>

      {/* 4. PREVIEW MODAL: EXACT STUDENT-FACING PREVIEW */}
      <AnimatePresence>
        {isPreviewModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-[#0B1324] rounded-2xl max-w-4xl w-full p-6 border border-[#223354] shadow-2xl relative text-white max-h-[90vh] overflow-y-auto space-y-6"
            >
              <button
                onClick={() => setIsPreviewModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 text-[#94A3B8] hover:text-white rounded-lg hover:bg-[#152138] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Student Curriculum View Preview</h3>
                  <p className="text-xs text-[#94A3B8]">How enrolled students will see Module 1 (SQL) and its 8 classes.</p>
                </div>
              </div>

              {/* Student View Mockup */}
              <div className="bg-white rounded-xl p-6 text-[#0F172A] space-y-6">
                
                {/* Module Header Bar */}
                <div className="pb-4 border-b border-[#F1F5F9] flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono font-bold uppercase text-[#64748B]">PHASE 1 · MODULE 1</span>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-full">
                        3 Weeks
                      </span>
                    </div>
                    <h2 className="text-xl font-extrabold text-[#0F172A] tracking-tight">SQL</h2>
                  </div>

                  <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                    8 Classes Total
                  </span>
                </div>

                {/* 3-Week Groups Preview */}
                {[
                  { wNum: 1, title: 'Week 1 — SQL Foundations', classes: week1Classes },
                  { wNum: 2, title: 'Week 2 — Data Analysis with SQL', classes: week2Classes },
                  { wNum: 3, title: 'Week 3 — Advanced SQL & Minor Project', classes: week3Classes }
                ].map(({ wNum, title, classes }) => (
                  <div key={wNum} className="space-y-3">
                    <div className="bg-[#F8FAFC] px-4 py-2 rounded-lg border border-[#E2E8F0] flex items-center justify-between text-xs font-bold text-[#475569]">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                        <span>{title}</span>
                      </span>
                      <span className="text-[11px] text-[#64748B] font-mono">{classes.length} Classes</span>
                    </div>

                    <div className="divide-y divide-[#F1F5F9] border border-[#E2E8F0] rounded-xl overflow-hidden">
                      {classes.map((cls) => {
                        const isMinor = cls.order === 8 || cls.isMinorProject;
                        return (
                          <div 
                            key={cls.id}
                            onClick={() => setPreviewSelectedClass(cls)}
                            className="p-3.5 hover:bg-[#F8FAFC] flex items-center justify-between cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-mono font-bold text-[#64748B] min-w-[70px]">
                                Class 0{cls.order}
                              </span>
                              <span className="text-xs font-semibold text-[#0F172A]">
                                {cls.title}
                              </span>
                              {isMinor && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200 flex items-center gap-1">
                                  <Sparkles className="w-3 h-3 text-purple-600" />
                                  <span>Minor Project + GenAI</span>
                                </span>
                              )}
                            </div>

                            <span className="text-[11px] text-[#2563EB] font-medium hover:underline">
                              Inspect Topics →
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Selected Class Topic Headlines inside Preview */}
                {previewSelectedClass && (
                  <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-blue-600" />
                        <span>Inside Class View: {previewSelectedClass.title}</span>
                      </span>
                      <span className="text-[10px] text-[#64748B] font-mono">Week {previewSelectedClass.weekNumber}</span>
                    </div>

                    <p className="text-xs text-[#64748B]">Topic Headlines rendered to students in Pre-read tab:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {previewSelectedClass.topicHeadlines.map((h, idx) => (
                        <div key={idx} className="p-2.5 rounded-lg bg-white border border-[#E2E8F0] text-xs font-medium text-[#334155] flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setIsPreviewModalOpen(false)}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Close Preview
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. FLOATING TOAST NOTIFICATION */}
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
                ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
                : toastMessage.type === 'error'
                ? 'bg-rose-950/90 border-rose-500/50 text-rose-200'
                : 'bg-blue-950/90 border-blue-500/50 text-blue-200'
            }`}>
              <div className="shrink-0 mt-0.5">
                {toastMessage.type === 'success' && <Check className="w-4 h-4 text-emerald-400" />}
                {toastMessage.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400" />}
                {toastMessage.type === 'info' && <AlertCircle className="w-4 h-4 text-blue-400" />}
              </div>
              <div className="text-xs font-medium leading-relaxed">{toastMessage.text}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
