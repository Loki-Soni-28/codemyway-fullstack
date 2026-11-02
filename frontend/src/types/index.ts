export type NavigationRoute = 'home' | 'course-details' | 'skill-store' | 'student-dashboard' | 'login' | 'faculty-reviews' | 'admin-dashboard' | 'privacy' | 'terms' | 'refund' | 'contact' | 'about';

export type UserRole = 'STUDENT' | 'ADMIN' | 'INSTRUCTOR' | 'MENTOR';

export interface StudentUser {
  id?: string;
  fullName: string;
  email: string;
  mobile: string;
  role?: UserRole;
  isLoggedIn: boolean;
  avatarUrl?: string;
  enrolledCourse?: string;
  studentProfile?: any;
  enrolled?: boolean;
}

export interface LeadCaptureData {
  fullName: string;
  email: string;
  mobile: string;
  programOfInterest?: string;
  qualification?: string;
}

export type SkillCategory = 
  | 'SQL'
  | 'Excel'
  | 'Tableau'
  | 'Python'
  | 'Statistics'
  | 'GenAI'
  | 'Python Libraries'
  | 'Product Analytics';

export type CourseFormat = 
  | 'Live'
  | 'Recorded / Self-paced'
  | 'Short Cohort';

export type AvailabilityStatus = 
  | 'Available'
  | 'Upcoming Live (Pre-booking Open)'
  | 'Upcoming'
  | 'Coming Soon';

export interface MicroCourse {
  id: string;
  title: string;
  description: string;
  category: SkillCategory;
  format: CourseFormat;
  status: AvailabilityStatus;
  estimatedHours: string;
  level: 'Beginner' | 'Intermediate' | 'All Levels';
  isComingSoon?: boolean;
}

export type AssignmentStatus = 
  | 'Locked'
  | 'Available'
  | 'In Progress'
  | 'Submitted'
  | 'Under Review'
  | 'Evaluated'
  | 'Overdue';

export type ProjectProgressStatus = 
  | 'Not Started'
  | 'In Progress'
  | 'Submitted'
  | 'Under Review'
  | 'Evaluated';

export interface ClassResource {
  title: string;
  type: 'pdf' | 'code' | 'doc' | 'link';
  url: string;
}

export interface ClassItem {
  id: string;
  classNumber: number;
  title: string;
  instructor: string;
  dateTime: string;
  durationMinutes: number;
  status: 'Completed' | 'Live Now' | 'Upcoming';
  preReading: {
    title: string;
    description: string;
    estimatedReadTime: string;
    links: string[];
  };
  meetingUrl?: string;
  postClassMaterials?: ClassResource[];
  recordingUrl?: string;
  hasFeedbackSubmitted?: boolean;
  relatedAssignmentId?: string;
  relatedProjectId?: string;
}

export interface ModuleItem {
  id: string;
  moduleNumber: number;
  title: string;
  description: string;
  classes: ClassItem[];
}

export interface PhaseItem {
  id: string;
  phaseNumber: 1 | 2;
  title: string;
  subtitle: string;
  modules: ModuleItem[];
  freeMentorQuota: number;
  usedMentorQuota: number;
}

export interface AssignmentItem {
  id: string;
  classId: string;
  title: string;
  description: string;
  dueDate: string;
  status: AssignmentStatus;
  maxScore: number;
  obtainedScore?: number;
  feedback?: string;
  submissionLink?: string;
  submittedAt?: string;
}

export interface ProjectItem {
  id: string;
  type: 'module' | 'major';
  title: string;
  phaseNumber: 1 | 2;
  description: string;
  brief: string;
  deliverables: string[];
  status: ProjectProgressStatus;
  score?: number;
  maxScore?: number;
  reviewerFeedback?: string;
  submissionRepoUrl?: string;
  submittedAt?: string;
  allowResubmission?: boolean;
}

export interface MentorProfile {
  id: string;
  name: string;
  role: string;
  expertise: string[];
  availableSlots: string[];
  avatarInitial: string;
}

export interface MentorBooking {
  id: string;
  mentorName: string;
  phase: 1 | 2;
  date: string;
  timeSlot: string;
  topic: string;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
  meetingLink?: string;
  isFreeQuota: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  category: 'Class' | 'Assignment' | 'Project' | 'Mentor' | 'Announcement';
  isRead: boolean;
  actionRoute?: NavigationRoute;
}

export interface BadgeItem {
  id: string;
  title: string;
  description: string;
  earnedDate?: string;
  isUnlocked: boolean;
  criteria: string;
  iconName: string;
}

export interface StudentProfile {
  name: string;
  rollId: string;
  enrolledProgram: string;
  currentPhase: number;
  attendancePercentage: number;
  assignmentCompletionPercentage: number;
  learningStreakDays: number;
  badgeThresholds: {
    minAttendance: number;
    minAssignment: number;
  };
}
