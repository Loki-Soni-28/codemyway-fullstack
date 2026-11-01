export type MentorAvailabilityStatus = 'available' | 'in-session' | 'busy' | 'on-leave';

export interface MentorSlot {
  id: string;
  date: string; // e.g. "2026-11-04"
  dayOfWeek: string; // e.g. "Wednesday"
  displayDate: string; // e.g. "Wed, 04 Nov 2026"
  startTime: string; // e.g. "06:00 PM"
  endTime: string; // e.g. "06:45 PM"
  isBooked: boolean;
  bookedByStudentEmail?: string;
}

export interface MentorProfile {
  id: string;
  name: string;
  designation: string;
  company: string;
  avatarUrl: string;
  expertise: string[];
  bio: string;
  assignedDate: string;
  availabilityStatus: MentorAvailabilityStatus;
  email: string;
  totalSessionsMentored: number;
  rating: number;
  availableSlots: MentorSlot[];
}

export type MentorshipSessionStatus = 
  | 'Upcoming' 
  | 'Booking Requested' 
  | 'Completed' 
  | 'Cancelled' 
  | 'Rescheduled';

export interface SessionFeedback {
  notes: string;
  rating: number; // 1-5
  strengths: string[];
  improvementAreas: string[];
  actionItems: {
    id: string;
    text: string;
    completed: boolean;
  }[];
  submittedAt: string;
}

export interface MentorshipSession {
  id: string;
  studentEmail: string;
  studentName?: string;
  mentorId: string;
  mentorName: string;
  mentorDesignation: string;
  mentorCompany: string;
  mentorAvatar: string;
  date: string; // e.g. "2026-11-05"
  displayDate: string; // e.g. "Thu, 05 Nov 2026"
  time: string; // e.g. "07:00 PM - 07:45 PM"
  duration: string;
  topic: string;
  agendaDescription: string;
  platform: 'CodeMyWay Live Room' | 'Google Meet' | 'Zoom' | 'Microsoft Teams';
  meetingLink?: string; // Only valid if approved/assigned
  status: MentorshipSessionStatus;
  requestedAt: string;
  rejectionReason?: string;
  feedback?: SessionFeedback;
}

export interface StudentProgressFeedback {
  studentEmail: string;
  mentorId: string;
  mentorName: string;
  lastFeedbackDate: string;
  overallObservations: string;
  strengths: string[];
  areasForImprovement: string[];
  nextLearningGoals: string[];
  actionItems: {
    id: string;
    text: string;
    completed: boolean;
    dueDate?: string;
  }[];
}

export interface StudentMentorState {
  assignedMentor: MentorProfile | null;
  availableMentors: MentorProfile[];
  sessions: MentorshipSession[];
  progressFeedback: StudentProgressFeedback | null;
}

export interface MentorSupportQuery {
  id: string;
  studentEmail: string;
  studentName: string;
  mentorId: string;
  subject: string;
  message: string;
  category: 'Curriculum Doubt' | 'Project Guidance' | 'Career & Interview' | 'Technical Issue' | 'Other';
  status: 'Open' | 'Answered' | 'Closed';
  createdAt: string;
  response?: string;
  respondedAt?: string;
}
