import { 
  MentorProfile, 
  MentorshipSession, 
  StudentMentorState, 
  StudentProgressFeedback,
  MentorSupportQuery,
  SessionFeedback
} from './types';
import { 
  INITIAL_MENTORS, 
  INITIAL_STUDENT_SESSIONS, 
  INITIAL_PROGRESS_FEEDBACK 
} from './mentorData';

const getStorageKey = (email: string) => `codemyway_student_mentor_${email.toLowerCase().trim()}`;
const getQueriesKey = (email: string) => `codemyway_student_mentor_queries_${email.toLowerCase().trim()}`;

/**
 * Load student mentor state from localStorage, or initialize with realistic cohort defaults.
 */
export const getStudentMentorState = (email: string = 'anuj.sharma@example.com'): StudentMentorState => {
  try {
    const raw = localStorage.getItem(getStorageKey(email));
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error loading student mentor state from storage:', err);
  }

  // Initial state for enrolled student
  const initialState: StudentMentorState = {
    assignedMentor: INITIAL_MENTORS[0], // Dr. Vikram Seth
    availableMentors: INITIAL_MENTORS,
    sessions: INITIAL_STUDENT_SESSIONS,
    progressFeedback: INITIAL_PROGRESS_FEEDBACK
  };

  saveStudentMentorState(email, initialState);
  return initialState;
};

/**
 * Save updated mentor state
 */
export const saveStudentMentorState = (email: string, state: StudentMentorState): void => {
  try {
    localStorage.setItem(getStorageKey(email), JSON.stringify(state));
  } catch (err) {
    console.error('Error saving student mentor state to storage:', err);
  }
};

/**
 * Book a mentorship session: validates slot, prevents double booking, creates 'Booking Requested' status.
 */
export const bookMentorshipSession = (
  email: string,
  studentName: string,
  params: {
    mentorId: string;
    slotId: string;
    topic: string;
    agendaDescription: string;
    platform: 'CodeMyWay Live Room' | 'Google Meet' | 'Zoom' | 'Microsoft Teams';
  }
): { success: boolean; message: string; session?: MentorshipSession } => {
  const state = getStudentMentorState(email);
  const mentor = state.availableMentors.find(m => m.id === params.mentorId) || state.assignedMentor;

  if (!mentor) {
    return { success: false, message: 'Selected mentor not found in platform directory.' };
  }

  const slot = mentor.availableSlots.find(s => s.id === params.slotId);
  if (!slot) {
    return { success: false, message: 'Selected time slot does not exist.' };
  }

  if (slot.isBooked) {
    return { success: false, message: 'This slot has already been reserved. Please select another slot.' };
  }

  // Prevent double booking on the same date and time by this student
  const hasClashingSession = state.sessions.some(
    s => s.date === slot.date && 
         s.time.includes(slot.startTime) && 
         (s.status === 'Upcoming' || s.status === 'Booking Requested')
  );

  if (hasClashingSession) {
    return { 
      success: false, 
      message: 'You already have an active mentorship session booked for this date and time.' 
    };
  }

  // Mark slot as booked
  slot.isBooked = true;
  slot.bookedByStudentEmail = email;

  // Create new session with 'Booking Requested' (awaiting faculty/mentor confirmation)
  const newSession: MentorshipSession = {
    id: `sess-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    studentEmail: email,
    studentName,
    mentorId: mentor.id,
    mentorName: mentor.name,
    mentorDesignation: mentor.designation,
    mentorCompany: mentor.company,
    mentorAvatar: mentor.avatarUrl,
    date: slot.date,
    displayDate: slot.displayDate,
    time: `${slot.startTime} - ${slot.endTime}`,
    duration: '45 mins',
    topic: params.topic.trim(),
    agendaDescription: params.agendaDescription.trim(),
    platform: params.platform,
    meetingLink: undefined, // Meeting link generated only upon mentor approval
    status: 'Booking Requested',
    requestedAt: new Date().toISOString()
  };

  // Prepend to sessions
  state.sessions = [newSession, ...state.sessions];

  // Update mentor in availableMentors list as well
  state.availableMentors = state.availableMentors.map(m => {
    if (m.id === mentor.id) {
      return {
        ...m,
        availableSlots: m.availableSlots.map(s => s.id === slot.id ? slot : s)
      };
    }
    return m;
  });

  if (state.assignedMentor?.id === mentor.id) {
    state.assignedMentor = {
      ...state.assignedMentor,
      availableSlots: state.assignedMentor.availableSlots.map(s => s.id === slot.id ? slot : s)
    };
  }

  saveStudentMentorState(email, state);
  return { 
    success: true, 
    message: 'Mentorship session requested successfully! Awaiting mentor approval.',
    session: newSession 
  };
};

/**
 * Cancel a session and release the reserved slot
 */
export const cancelStudentSession = (email: string, sessionId: string): boolean => {
  const state = getStudentMentorState(email);
  const session = state.sessions.find(s => s.id === sessionId);

  if (!session) return false;
  if (session.status === 'Completed') return false;

  session.status = 'Cancelled';

  // Release slot on mentor
  state.availableMentors = state.availableMentors.map(m => {
    if (m.id === session.mentorId) {
      return {
        ...m,
        availableSlots: m.availableSlots.map(slot => {
          if (slot.date === session.date && session.time.includes(slot.startTime)) {
            return { ...slot, isBooked: false, bookedByStudentEmail: undefined };
          }
          return slot;
        })
      };
    }
    return m;
  });

  if (state.assignedMentor?.id === session.mentorId) {
    state.assignedMentor = {
      ...state.assignedMentor,
      availableSlots: state.assignedMentor.availableSlots.map(slot => {
        if (slot.date === session.date && session.time.includes(slot.startTime)) {
          return { ...slot, isBooked: false, bookedByStudentEmail: undefined };
        }
        return slot;
      })
    };
  }

  saveStudentMentorState(email, state);
  return true;
};

/**
 * Toggle completion of an action item by the student
 */
export const toggleActionItemCompletion = (email: string, itemId: string): boolean => {
  const state = getStudentMentorState(email);
  if (!state.progressFeedback) return false;

  let found = false;
  state.progressFeedback.actionItems = state.progressFeedback.actionItems.map(item => {
    if (item.id === itemId) {
      found = true;
      return { ...item, completed: !item.completed };
    }
    return item;
  });

  if (found) {
    saveStudentMentorState(email, state);
  }
  return found;
};

/**
 * Submit a direct message / query to the mentor
 */
export const submitMentorQuery = (
  email: string,
  studentName: string,
  params: {
    mentorId: string;
    subject: string;
    message: string;
    category: 'Curriculum Doubt' | 'Project Guidance' | 'Career & Interview' | 'Technical Issue' | 'Other';
  }
): MentorSupportQuery => {
  const query: MentorSupportQuery = {
    id: `query-${Date.now()}`,
    studentEmail: email,
    studentName,
    mentorId: params.mentorId,
    subject: params.subject.trim(),
    message: params.message.trim(),
    category: params.category,
    status: 'Open',
    createdAt: new Date().toISOString()
  };

  try {
    const existingRaw = localStorage.getItem(getQueriesKey(email));
    const queries: MentorSupportQuery[] = existingRaw ? JSON.parse(existingRaw) : [];
    queries.unshift(query);
    localStorage.setItem(getQueriesKey(email), JSON.stringify(queries));
  } catch (err) {
    console.error('Error saving mentor query:', err);
  }

  return query;
};

export const getStudentQueries = (email: string): MentorSupportQuery[] => {
  try {
    const raw = localStorage.getItem(getQueriesKey(email));
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading queries:', err);
  }
  return [];
};

// ============================================================
// FACULTY / ADMIN SIMULATOR ACTIONS (For Testing & Verification)
// ============================================================

export const adminAssignMentor = (email: string, mentorId: string | null): void => {
  const state = getStudentMentorState(email);
  if (!mentorId) {
    state.assignedMentor = null;
  } else {
    const mentor = state.availableMentors.find(m => m.id === mentorId);
    state.assignedMentor = mentor || null;
  }
  saveStudentMentorState(email, state);
};

export const adminApproveSession = (
  email: string, 
  sessionId: string, 
  meetingLink: string = 'https://meet.google.com/cmw-session-room'
): void => {
  const state = getStudentMentorState(email);
  state.sessions = state.sessions.map(s => {
    if (s.id === sessionId) {
      return {
        ...s,
        status: 'Upcoming',
        meetingLink: meetingLink.trim()
      };
    }
    return s;
  });
  saveStudentMentorState(email, state);
};

export const adminRejectSession = (email: string, sessionId: string, reason: string): void => {
  const state = getStudentMentorState(email);
  const session = state.sessions.find(s => s.id === sessionId);
  if (!session) return;

  session.status = 'Cancelled';
  session.rejectionReason = reason;

  // Free slot
  state.availableMentors = state.availableMentors.map(m => {
    if (m.id === session.mentorId) {
      return {
        ...m,
        availableSlots: m.availableSlots.map(slot => {
          if (slot.date === session.date && session.time.includes(slot.startTime)) {
            return { ...slot, isBooked: false, bookedByStudentEmail: undefined };
          }
          return slot;
        })
      };
    }
    return m;
  });

  saveStudentMentorState(email, state);
};

export const adminCompleteSession = (
  email: string, 
  sessionId: string, 
  feedback: SessionFeedback
): void => {
  const state = getStudentMentorState(email);
  state.sessions = state.sessions.map(s => {
    if (s.id === sessionId) {
      return {
        ...s,
        status: 'Completed',
        feedback
      };
    }
    return s;
  });
  saveStudentMentorState(email, state);
};

export const adminResetMentorData = (email: string): StudentMentorState => {
  const initialState: StudentMentorState = {
    assignedMentor: INITIAL_MENTORS[0],
    availableMentors: INITIAL_MENTORS,
    sessions: INITIAL_STUDENT_SESSIONS,
    progressFeedback: INITIAL_PROGRESS_FEEDBACK
  };
  saveStudentMentorState(email, initialState);
  return initialState;
};
