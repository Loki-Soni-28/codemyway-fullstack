import React from 'react';
import { 
  Lock, 
  Clock, 
  PlayCircle, 
  Send, 
  Hourglass, 
  AlertTriangle, 
  CheckCircle2 
} from 'lucide-react';
import { ProjectStatus } from './types';

interface ProjectStatusBadgeProps {
  status: ProjectStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const ProjectStatusBadge: React.FC<ProjectStatusBadgeProps> = ({ 
  status, 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3 py-1.5 text-xs font-bold gap-2'
  }[size];

  switch (status) {
    case 'Locked':
      return (
        <span className={`inline-flex items-center rounded-full font-semibold bg-[#1E293B] text-[#94A3B8] border border-[#334155] ${sizeClasses}`}>
          <Lock className="w-3 h-3 text-[#94A3B8]" />
          <span>Locked</span>
        </span>
      );

    case 'Not Started':
      return (
        <span className={`inline-flex items-center rounded-full font-semibold bg-[#0F172A] text-[#CBD5E1] border border-[#334155] ${sizeClasses}`}>
          <Clock className="w-3 h-3 text-[#94A3B8]" />
          <span>Not Started</span>
        </span>
      );

    case 'In Progress':
      return (
        <span className={`inline-flex items-center rounded-full font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30 ${sizeClasses}`}>
          <PlayCircle className="w-3 h-3 text-blue-400" />
          <span>In Progress</span>
        </span>
      );

    case 'Submitted':
      return (
        <span className={`inline-flex items-center rounded-full font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 ${sizeClasses}`}>
          <Send className="w-3 h-3 text-indigo-400" />
          <span>Submitted</span>
        </span>
      );

    case 'Under Review':
      return (
        <span className={`inline-flex items-center rounded-full font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 ${sizeClasses}`}>
          <Hourglass className="w-3 h-3 text-amber-400 animate-spin-slow" />
          <span>Under Review</span>
        </span>
      );

    case 'Revision Required':
      return (
        <span className={`inline-flex items-center rounded-full font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30 ${sizeClasses}`}>
          <AlertTriangle className="w-3 h-3 text-rose-400" />
          <span>Revision Required</span>
        </span>
      );

    case 'Approved':
      return (
        <span className={`inline-flex items-center rounded-full font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 ${sizeClasses}`}>
          <CheckCircle2 className="w-3 h-3 text-emerald-400 stroke-[2.5]" />
          <span>Approved</span>
        </span>
      );

    default:
      return null;
  }
};
