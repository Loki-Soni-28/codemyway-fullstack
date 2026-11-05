export type WeeklyCheckInStatus = 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'SKIPPED';
export type CheckInStudentStatus = 'ASSIGNED' | 'SCHEDULED' | 'REVIEW_PENDING' | 'COMPLETED' | 'MISSED';
export type CheckInFeedbackStatus = 'DRAFT' | 'PUBLISHED';

export interface WeeklyCheckInActionItem {
  id: string;
  feedbackId: string;
  description: string;
  isCompleted: boolean;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WeeklyCheckInFeedback {
  id: string;
  assignmentId: string;
  status: CheckInFeedbackStatus;
  strengths?: string | null;
  areasForImprovement?: string | null;
  generalFeedback?: string | null;
  nextWeekGoals?: string | null;
  attendanceRating?: number | null;
  taskCompletionScore?: number | null;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  actionItems: WeeklyCheckInActionItem[];
}

export interface WeeklyCheckInStudentAssignment {
  id: string;
  checkInId: string;
  checkIn: WeeklyCheckIn;
  studentId: string;
  teacherId: string;
  status: CheckInStudentStatus;
  scheduledStartAt?: string | null;
  scheduledEndAt?: string | null;
  meetingUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  student: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    avatarUrl?: string | null;
  };
  teacher: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string | null;
  };
  feedback?: WeeklyCheckInFeedback | null;
}

export interface WeeklyCheckInAuditLog {
  id: string;
  checkInId: string;
  actorId?: string | null;
  actor?: {
    id: string;
    name: string;
    role: string;
  } | null;
  action: string;
  metadata?: Record<string, any> | null;
  occurredAt: string;
}

export interface WeeklyCheckIn {
  id: string;
  batchId: string;
  batch?: {
    id: string;
    name: string;
    courseId?: string;
  };
  weekNumber: number;
  title: string;
  status: WeeklyCheckInStatus;
  scheduledStartDate: string;
  scheduledEndDate: string;
  defaultDurationMinutes: number;
  skipReason?: string | null;
  createdById: string;
  createdBy?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  students?: WeeklyCheckInStudentAssignment[];
  auditLogs?: WeeklyCheckInAuditLog[];
}

export interface BatchTeacher {
  id: string;
  batchId: string;
  batch: {
    id: string;
    name: string;
    courseId?: string;
  };
  teacherId: string;
  teacher: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string | null;
  };
  isActive: boolean;
  createdAt: string;
}
