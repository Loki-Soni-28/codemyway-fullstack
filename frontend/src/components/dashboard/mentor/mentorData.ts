import { MentorProfile, MentorshipSession, StudentProgressFeedback } from './types';

export const INITIAL_MENTORS: MentorProfile[] = [
  {
    id: 'mentor-vikram-seth',
    name: 'Dr. Vikram Seth',
    designation: 'Lead AI & Data Engineering Mentor',
    company: 'Ex-Microsoft · 12+ Yrs Experience',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    expertise: [
      'Advanced SQL',
      'Database Architecture',
      'ETL Pipelines',
      'BigQuery Sandbox',
      'Python Optimization',
      'Portfolio Strategy'
    ],
    bio: 'Dr. Vikram Seth has 12+ years of enterprise data engineering and analytics leadership. He specializes in distributed database architectures, complex SQL optimizations, and mentor-guided capstone portfolio building.',
    assignedDate: '15 March 2026',
    availabilityStatus: 'available',
    email: 'dr.vikram.seth@codemyway.internal',
    totalSessionsMentored: 342,
    rating: 4.96,
    availableSlots: [
      {
        id: 'slot-vs-01',
        date: '2026-11-04',
        dayOfWeek: 'Wednesday',
        displayDate: 'Wed, 04 Nov 2026',
        startTime: '05:00 PM',
        endTime: '05:45 PM',
        isBooked: false
      },
      {
        id: 'slot-vs-02',
        date: '2026-11-04',
        dayOfWeek: 'Wednesday',
        displayDate: 'Wed, 04 Nov 2026',
        startTime: '06:00 PM',
        endTime: '06:45 PM',
        isBooked: false
      },
      {
        id: 'slot-vs-03',
        date: '2026-11-05',
        dayOfWeek: 'Thursday',
        displayDate: 'Thu, 05 Nov 2026',
        startTime: '07:00 PM',
        endTime: '07:45 PM',
        isBooked: true, // Booked for upcoming session
        bookedByStudentEmail: 'anuj.sharma@example.com'
      },
      {
        id: 'slot-vs-04',
        date: '2026-11-06',
        dayOfWeek: 'Friday',
        displayDate: 'Fri, 06 Nov 2026',
        startTime: '04:00 PM',
        endTime: '04:45 PM',
        isBooked: false
      },
      {
        id: 'slot-vs-05',
        date: '2026-11-07',
        dayOfWeek: 'Saturday',
        displayDate: 'Sat, 07 Nov 2026',
        startTime: '11:00 AM',
        endTime: '11:45 AM',
        isBooked: false
      },
      {
        id: 'slot-vs-06',
        date: '2026-11-07',
        dayOfWeek: 'Saturday',
        displayDate: 'Sat, 07 Nov 2026',
        startTime: '12:00 PM',
        endTime: '12:45 PM',
        isBooked: false
      }
    ]
  },
  {
    id: 'mentor-pooja-nambiar',
    name: 'Pooja Nambiar',
    designation: 'Principal Product Analytics Mentor',
    company: 'Senior Product Analyst, Ex-Swiggy',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    expertise: [
      'Product Analytics',
      'Tableau Executive Dashboards',
      'Cohort Retention & LTV',
      'A/B Experimentation',
      'Business Storytelling'
    ],
    bio: 'Pooja leads high-growth product analytics initiatives. She mentors CodeMyWay students on turning raw telemetry datasets into boardroom-ready executive visual dashboards.',
    assignedDate: 'Co-Faculty',
    availabilityStatus: 'available',
    email: 'pooja.nambiar@codemyway.internal',
    totalSessionsMentored: 218,
    rating: 4.92,
    availableSlots: [
      {
        id: 'slot-pn-01',
        date: '2026-11-05',
        dayOfWeek: 'Thursday',
        displayDate: 'Thu, 05 Nov 2026',
        startTime: '03:00 PM',
        endTime: '03:45 PM',
        isBooked: false
      },
      {
        id: 'slot-pn-02',
        date: '2026-11-06',
        dayOfWeek: 'Friday',
        displayDate: 'Fri, 06 Nov 2026',
        startTime: '06:00 PM',
        endTime: '06:45 PM',
        isBooked: false
      },
      {
        id: 'slot-pn-03',
        date: '2026-11-08',
        dayOfWeek: 'Sunday',
        displayDate: 'Sun, 08 Nov 2026',
        startTime: '02:00 PM',
        endTime: '02:45 PM',
        isBooked: false
      }
    ]
  },
  {
    id: 'mentor-arjun-mehta',
    name: 'Arjun Mehta',
    designation: 'Quantitative Analytics & Python Mentor',
    company: 'Staff Analyst, Ex-Goldman Sachs',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    expertise: [
      'Statistical Modeling',
      'Python Data Pipelines',
      'Pandas Vectorization',
      'Machine Learning EDA',
      'Interview Question Prep'
    ],
    bio: 'Arjun mentors students on statistical hypothesis testing, financial datasets, algorithmic Python problem solving, and technical interview mock rounds.',
    assignedDate: 'Co-Faculty',
    availabilityStatus: 'in-session',
    email: 'arjun.mehta@codemyway.internal',
    totalSessionsMentored: 184,
    rating: 4.88,
    availableSlots: [
      {
        id: 'slot-am-01',
        date: '2026-11-06',
        dayOfWeek: 'Friday',
        displayDate: 'Fri, 06 Nov 2026',
        startTime: '07:00 PM',
        endTime: '07:45 PM',
        isBooked: false
      },
      {
        id: 'slot-am-02',
        date: '2026-11-09',
        dayOfWeek: 'Monday',
        displayDate: 'Mon, 09 Nov 2026',
        startTime: '08:00 PM',
        endTime: '08:45 PM',
        isBooked: false
      }
    ]
  }
];

export const INITIAL_STUDENT_SESSIONS: MentorshipSession[] = [
  {
    id: 'sess-up-01',
    studentEmail: 'anuj.sharma@example.com',
    studentName: 'Anuj Sharma',
    mentorId: 'mentor-vikram-seth',
    mentorName: 'Dr. Vikram Seth',
    mentorDesignation: 'Lead AI & Data Engineering Mentor',
    mentorCompany: 'Ex-Microsoft · 12+ Yrs Experience',
    mentorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    date: '2026-11-05',
    displayDate: 'Thu, 05 Nov 2026',
    time: '07:00 PM - 07:45 PM',
    duration: '45 mins',
    topic: 'Phase 1 Capstone: Relational Schema Architecture & SQL Pipeline Optimization',
    agendaDescription: 'Reviewing 3NF table design for the e-commerce analytics warehouse, BigQuery partition keys, and discussing query efficiency for cohort retention calculation.',
    platform: 'CodeMyWay Live Room',
    meetingLink: 'https://meet.google.com/cmw-anuj-vikram-data',
    status: 'Upcoming',
    requestedAt: '2026-10-28T14:30:00Z'
  },
  {
    id: 'sess-hist-01',
    studentEmail: 'anuj.sharma@example.com',
    studentName: 'Anuj Sharma',
    mentorId: 'mentor-vikram-seth',
    mentorName: 'Dr. Vikram Seth',
    mentorDesignation: 'Lead AI & Data Engineering Mentor',
    mentorCompany: 'Ex-Microsoft · 12+ Yrs Experience',
    mentorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    date: '2026-10-20',
    displayDate: 'Mon, 20 Oct 2026',
    time: '06:00 PM - 06:45 PM',
    duration: '45 mins',
    topic: 'SQL Window Functions & GROUP BY Aggregation Rollups Troubleshooting',
    agendaDescription: 'Deep dive into RANK() vs DENSE_RANK(), sliding framing clauses (ROWS BETWEEN 2 PRECEDING), and multi-level data summaries.',
    platform: 'CodeMyWay Live Room',
    meetingLink: 'https://meet.google.com/cmw-anuj-vikram-archive1',
    status: 'Completed',
    requestedAt: '2026-10-16T10:15:00Z',
    feedback: {
      notes: 'Anuj came well prepared with sample edge-case queries. He demonstrated solid conceptual mastery of window partitions. Recommended focusing on CTE structure to avoid repetitive execution of nested subqueries.',
      rating: 5,
      strengths: [
        'Excellent conceptual grasp of analytical window functions',
        'Systematic approach to debugging syntax and join errors',
        'Strong problem decomposition methodology'
      ],
      improvementAreas: [
        'Remember to profile query cost before running multi-table joins on large unindexed partitions',
        'Adopt standardized uppercase SQL keyword styling throughout scripts'
      ],
      actionItems: [
        {
          id: 'act-01',
          text: 'Refactor SQL Minor Project query to utilize CTEs rather than nested derived subqueries.',
          completed: true
        },
        {
          id: 'act-02',
          text: 'Benchmark BigQuery scan time comparing clustered table vs non-clustered table.',
          completed: true
        }
      ],
      submittedAt: '2026-10-20T19:00:00Z'
    }
  },
  {
    id: 'sess-hist-02',
    studentEmail: 'anuj.sharma@example.com',
    studentName: 'Anuj Sharma',
    mentorId: 'mentor-vikram-seth',
    mentorName: 'Dr. Vikram Seth',
    mentorDesignation: 'Lead AI & Data Engineering Mentor',
    mentorCompany: 'Ex-Microsoft · 12+ Yrs Experience',
    mentorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    date: '2026-10-03',
    displayDate: 'Fri, 03 Oct 2026',
    time: '08:00 PM - 08:45 PM',
    duration: '45 mins',
    topic: 'Module 1 Kickoff: Database Schema Setup, Keys & BigQuery Cloud Sandbox',
    agendaDescription: 'Onboarding session to configure Google Cloud BigQuery sandbox, load sample e-commerce datasets, and verify primary/foreign key constraints.',
    platform: 'CodeMyWay Live Room',
    meetingLink: 'https://meet.google.com/cmw-anuj-vikram-archive2',
    status: 'Completed',
    requestedAt: '2026-09-29T16:00:00Z',
    feedback: {
      notes: 'Initial 1:1 orientation session. Cloud sandbox credentials verified and test query successfully executed against public datasets. Anuj showed great enthusiasm and asked insightful questions regarding database indexing.',
      rating: 5,
      strengths: [
        'Quick setup and configuration of development tooling',
        'High curiosity regarding production database internals'
      ],
      improvementAreas: [
        'Bookmark the CodeMyWay BigQuery cheat-sheet for fast syntax reference'
      ],
      actionItems: [
        {
          id: 'act-03',
          text: 'Verify BigQuery sandbox quota limits and set up billing alerts.',
          completed: true
        }
      ],
      submittedAt: '2026-10-03T21:00:00Z'
    }
  }
];

export const INITIAL_PROGRESS_FEEDBACK: StudentProgressFeedback = {
  studentEmail: 'anuj.sharma@example.com',
  mentorId: 'mentor-vikram-seth',
  mentorName: 'Dr. Vikram Seth',
  lastFeedbackDate: '22 Oct 2026',
  overallObservations: 'Anuj is demonstrating outstanding commitment and analytical rigor. His query execution time on Module 1 problem sets is among the top 10% of the cohort. He has strong problem-solving fundamentals and takes feedback constructively.',
  strengths: [
    'Complex Multi-Table Joins & Schema Relations',
    'Analytical Window Functions (RANK, LAG, LEAD)',
    'High Attendance & Proactive Doubt Clarification',
    'Clean, Readable Code & Commenting'
  ],
  areasForImprovement: [
    'Query Execution Cost Optimization & Partitioning Awareness',
    'Edge-Case Handling with NULL and Zero-Division Values',
    'Executive Summary & Business Takeaway Storytelling'
  ],
  nextLearningGoals: [
    'Complete Module 2 Excel Sensitivity Models & Dynamic Arrays',
    'Architect 3NF Schema for Phase 1 Capstone Project',
    'Prepare for Mid-Cohort Mock Technical Interview Round'
  ],
  actionItems: [
    {
      id: 'act-fb-01',
      text: 'Refactor SQL Minor Project query to utilize CTEs rather than nested derived subqueries.',
      completed: true,
      dueDate: '25 Oct 2026'
    },
    {
      id: 'act-fb-02',
      text: 'Benchmark BigQuery scan time comparing clustered table vs non-clustered table.',
      completed: true,
      dueDate: '28 Oct 2026'
    },
    {
      id: 'act-fb-03',
      text: 'Finalize financial assumptions sheet before starting Module 2 Excel project.',
      completed: false,
      dueDate: '04 Nov 2026'
    },
    {
      id: 'act-fb-04',
      text: 'Draft questions on cohort LTV modeling for upcoming 1:1 mentorship session.',
      completed: false,
      dueDate: '05 Nov 2026'
    }
  ]
};
