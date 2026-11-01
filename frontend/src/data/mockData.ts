import { 
  MicroCourse, 
  PhaseItem, 
  AssignmentItem, 
  ProjectItem, 
  MentorProfile, 
  MentorBooking, 
  NotificationItem, 
  BadgeItem, 
  StudentProfile 
} from '../types';

export const PROGRAM_INFO = {
  title: 'Data Analyst + GenAI',
  tagline: 'Turn Your Skills Into a Career',
  subtitle: 'Build practical technology skills with structured learning, mentor guidance, hands-on projects and career preparation.',
  duration: '24 Weeks · Cohort Based',
  format: 'Live Interactive Sessions + Guided Labs',
  level: 'Beginner to Advanced (No prior coding experience required)',
  pricing: {
    standard: 29999,
    earlyBird: 24999,
    currencySymbol: '₹',
    registrationFeeNote: 'Separate additional fee — exact amount to be confirmed by admissions office prior to enrollment.'
  },
  mentoringModel: {
    fourTeachers: [
      {
        role: 'Concept Instructor',
        description: 'Delivers live interactive lectures breaking down core foundations step by step with real industry examples.'
      },
      {
        role: 'Hands-on Lab Facilitator',
        description: 'Guides live query sessions, debugging rooms, and daily problem-solving workshops.'
      },
      {
        role: 'Industry Project Reviewer',
        description: 'Conducts line-by-line project evaluations, grading with rubric checklists and actionable optimization advice.'
      },
      {
        role: 'Career & Interview Coach',
        description: 'Hosts phase-milestone mock interviews, resume architectures, and technical communication drills.'
      }
    ],
    supportRatios: '1 to 1 Mentorship + Hands-on Guided Practice',
    progressReviews: 'Weekly structured progress checkpoints tracking code commits and conceptual clarity.',
    guestMasterclass: 'Monthly masterclasses with visiting senior data practitioners discussing real production data stacks.'
  }
};

export const MICRO_COURSES: MicroCourse[] = [
  {
    id: 'mc-1',
    title: 'SQL for Business & Product Analysis',
    description: 'Master relational schemas, multi-table joins, subqueries, and window functions on real e-commerce transactional databases.',
    category: 'SQL',
    format: 'Live',
    status: 'Available',
    estimatedHours: '30 Hours',
    level: 'Beginner'
  },
  {
    id: 'mc-2',
    title: 'Advanced Excel & Power Query Automation',
    description: 'Build automated financial models, pivot architectures, and nested dynamic array functions without manual copy-pasting.',
    category: 'Excel',
    format: 'Recorded / Self-paced',
    status: 'Available',
    estimatedHours: '22 Hours',
    level: 'Beginner'
  },
  {
    id: 'mc-3',
    title: 'Tableau Visual Analytics & Executive Dashboards',
    description: 'Design executive-ready business intelligence dashboards, custom calculated fields, and interactive dashboard storytelling.',
    category: 'Tableau',
    format: 'Live',
    status: 'Available',
    estimatedHours: '28 Hours',
    level: 'All Levels'
  },
  {
    id: 'mc-4',
    title: 'Product Analysis with GenAI Workflows',
    description: 'Use large language models to automate exploratory data analysis, generate SQL queries from natural language, and summarize cohort metrics.',
    category: 'GenAI',
    format: 'Short Cohort',
    status: 'Upcoming Live (Pre-booking Open)',
    estimatedHours: '20 Hours',
    level: 'Intermediate'
  },
  {
    id: 'mc-5',
    title: 'Python Foundations for Analysts',
    description: 'Core programming logic, data structures, loops, functions, and error handling tailored specifically for data professionals.',
    category: 'Python',
    format: 'Live',
    status: 'Upcoming Live (Pre-booking Open)',
    estimatedHours: '35 Hours',
    level: 'Beginner'
  },
  {
    id: 'mc-6',
    title: 'Python Libraries: Pandas & NumPy Deep Dive',
    description: 'Vectorized calculations, series indexing, multi-index dataframes, and robust missing data strategies for large datasets.',
    category: 'Python Libraries',
    format: 'Recorded / Self-paced',
    status: 'Available',
    estimatedHours: '26 Hours',
    level: 'Intermediate'
  },
  {
    id: 'mc-7',
    title: 'Statistics & Probability for Tech Roles',
    description: 'Hypothesis testing, A/B testing statistical rigor, p-values, central limit theorem, and continuous distributions.',
    category: 'Statistics',
    format: 'Recorded / Self-paced',
    status: 'Available',
    estimatedHours: '24 Hours',
    level: 'All Levels'
  },
  {
    id: 'mc-8',
    title: 'Applied Product Analytics Metrics',
    description: 'LTV, CAC, churn cohort retention curves, activation funnels, and feature engagement telemetry architectures.',
    category: 'Product Analytics',
    format: 'Short Cohort',
    status: 'Upcoming',
    estimatedHours: '18 Hours',
    level: 'Intermediate'
  },
  {
    id: 'mc-9',
    title: 'Technical Interview Prep for Analytics Roles',
    description: 'Live coding challenges, schema design whiteboards, business case studies, and behavioral interview preparation.',
    category: 'GenAI',
    format: 'Live',
    status: 'Coming Soon',
    estimatedHours: 'Planned: 25 Hours',
    level: 'All Levels',
    isComingSoon: true
  },
  {
    id: 'mc-10',
    title: 'Project-Only Portfolio Course',
    description: 'Purely project-driven curriculum building 4 production-grade analytics deliverables reviewed by industry evaluators.',
    category: 'Product Analytics',
    format: 'Short Cohort',
    status: 'Coming Soon',
    estimatedHours: 'Planned: 40 Hours',
    level: 'Intermediate',
    isComingSoon: true
  }
];

export const DEMO_STUDENT: StudentProfile = {
  name: 'Priya Sharma',
  rollId: 'CMW-2026-DA42',
  enrolledProgram: 'Data Analyst + GenAI',
  currentPhase: 1,
  attendancePercentage: 92,
  assignmentCompletionPercentage: 90,
  learningStreakDays: 14,
  badgeThresholds: {
    minAttendance: 90,
    minAssignment: 90
  }
};

export const DEMO_PHASES: PhaseItem[] = [
  {
    id: 'phase-1',
    phaseNumber: 1,
    title: 'Phase 1: Analytical Foundations & Core Business Tooling',
    subtitle: 'SQL, Advanced Excel, Tableau Dashboards, and Product Analysis with GenAI',
    freeMentorQuota: 4,
    usedMentorQuota: 2,
    modules: [
      {
        id: 'mod-1',
        moduleNumber: 1,
        title: 'Module 1: Relational Database Querying with SQL',
        description: 'Database architecture, standard ANSI SQL, complex aggregation, subqueries, and window functions.',
        classes: [
          {
            id: 'cls-101',
            classNumber: 1,
            title: 'Database Architecture & Relational Schema Design',
            instructor: 'Aarav Mehta (Concept Instructor)',
            dateTime: 'Completed · 12 Oct 2026',
            durationMinutes: 90,
            status: 'Completed',
            preReading: {
              title: 'Introduction to Relational Algebra & ERDs',
              description: 'Review entity-relationship notations, primary vs foreign keys, and normal forms (1NF, 2NF, 3NF).',
              estimatedReadTime: '20 mins',
              links: ['Entity Relationship Guide (PDF)', 'PostgreSQL Setup Checklist']
            },
            postClassMaterials: [
              { title: 'Session Lecture Slides — ERD Architecture.pdf', type: 'pdf', url: '#' },
              { title: 'Schema Creation Scripts (ecommerce_db.sql)', type: 'code', url: '#' }
            ],
            recordingUrl: '#',
            hasFeedbackSubmitted: true,
            relatedAssignmentId: 'asg-101'
          },
          {
            id: 'cls-102',
            classNumber: 2,
            title: 'Multi-table Joins & Filtering Logic',
            instructor: 'Neha Patel (Lab Facilitator)',
            dateTime: 'Completed · 15 Oct 2026',
            durationMinutes: 90,
            status: 'Completed',
            preReading: {
              title: 'Inner, Left, Right and Full Outer Joins',
              description: 'Visual diagrams of Venn join intersections with edge-case NULL value handling.',
              estimatedReadTime: '15 mins',
              links: ['Join Cheat Sheet', 'Sample Retail Order Queries']
            },
            postClassMaterials: [
              { title: 'Multi-Table Joins Code Notebook.sql', type: 'code', url: '#' },
              { title: 'Common Pitfalls with Cartesian Products.pdf', type: 'pdf', url: '#' }
            ],
            recordingUrl: '#',
            hasFeedbackSubmitted: true,
            relatedAssignmentId: 'asg-102'
          },
          {
            id: 'cls-103',
            classNumber: 3,
            title: 'Window Functions & Advanced Aggregations',
            instructor: 'Aarav Mehta (Concept Instructor)',
            dateTime: 'Completed · 19 Oct 2026',
            durationMinutes: 90,
            status: 'Completed',
            preReading: {
              title: 'PARTITION BY vs ORDER BY in Analytical SQL',
              description: 'Understanding OVER clauses, ROW_NUMBER(), DENSE_RANK(), and running total windows.',
              estimatedReadTime: '25 mins',
              links: ['Window Function Visualizer Guide']
            },
            postClassMaterials: [
              { title: 'Window Functions Practice Datasets.csv', type: 'doc', url: '#' },
              { title: 'Session Recording & Annotations', type: 'link', url: '#' }
            ],
            recordingUrl: '#',
            hasFeedbackSubmitted: true,
            relatedAssignmentId: 'asg-103',
            relatedProjectId: 'proj-mod-1'
          }
        ]
      },
      {
        id: 'mod-2',
        moduleNumber: 2,
        title: 'Module 2: Advanced Excel & Business Analytics Modeling',
        description: 'Dynamic array functions (XLOOKUP, FILTER), Power Query ETL, and scenario manager.',
        classes: [
          {
            id: 'cls-104',
            classNumber: 4,
            title: 'Power Query for Automated Data Cleaning & Transformation',
            instructor: 'Neha Patel (Lab Facilitator)',
            dateTime: 'Live Now · Today 19:30 IST',
            durationMinutes: 90,
            status: 'Live Now',
            preReading: {
              title: 'ETL Pipelines inside Excel with M-Code',
              description: 'How to ingest messy CSVs, unpivot columns, and set up automatic workbook refresh cycles.',
              estimatedReadTime: '15 mins',
              links: ['Sample Unclean Transactions Dataset.xlsx']
            },
            meetingUrl: 'https://meet.google.com/demo-cmw-live',
            postClassMaterials: [
              { title: 'Clean Pipeline Reference Template.xlsx', type: 'doc', url: '#' }
            ],
            hasFeedbackSubmitted: false,
            relatedAssignmentId: 'asg-104'
          },
          {
            id: 'cls-105',
            classNumber: 5,
            title: 'Executive Financial & Operational Model Construction',
            instructor: 'Aarav Mehta (Concept Instructor)',
            dateTime: 'Upcoming · 28 Oct 2026 · 19:30 IST',
            durationMinutes: 90,
            status: 'Upcoming',
            preReading: {
              title: 'Scenario & Sensitivity Modeling Frameworks',
              description: 'Understanding Goal Seek, Data Tables, and variance analysis reporting.',
              estimatedReadTime: '20 mins',
              links: ['Financial Modeling Best Practices.pdf']
            },
            relatedAssignmentId: 'asg-105'
          }
        ]
      },
      {
        id: 'mod-3',
        moduleNumber: 3,
        title: 'Module 3: Tableau Visual Analytics & BI Storytelling',
        description: 'Calculated fields, LOD expressions (FIXED, INCLUDE), parameters, and interactive dashboard UI.',
        classes: [
          {
            id: 'cls-106',
            classNumber: 6,
            title: 'Level of Detail (LOD) Calculations in Business Scenarios',
            instructor: 'Aarav Mehta (Concept Instructor)',
            dateTime: 'Upcoming · 02 Nov 2026 · 19:30 IST',
            durationMinutes: 90,
            status: 'Upcoming',
            preReading: {
              title: 'Understanding Granularity vs Visualization Level',
              description: 'Detailed explanation of why standard aggregation fails on multi-grain customer tables.',
              estimatedReadTime: '30 mins',
              links: ['LOD Expressions Syntax Guide.pdf']
            }
          }
        ]
      },
      {
        id: 'mod-4',
        moduleNumber: 4,
        title: 'Module 4: Product Analytics & GenAI Analytical Workflows',
        description: 'Using Generative AI models to accelerate data wrangling, draft SQL queries, and synthesize cohort retention patterns.',
        classes: [
          {
            id: 'cls-107',
            classNumber: 7,
            title: 'Prompt-Engineered Analytical Pipelines & Automated Insights',
            instructor: 'Dr. Kabir Sen (Industry Reviewer)',
            dateTime: 'Upcoming · 09 Nov 2026 · 19:30 IST',
            durationMinutes: 90,
            status: 'Upcoming',
            preReading: {
              title: 'GenAI in the Modern Data Stack',
              description: 'Safely querying data with schema context without sending raw PII into language models.',
              estimatedReadTime: '20 mins',
              links: ['GenAI Data Privacy Guidelines.pdf']
            },
            relatedProjectId: 'proj-major-1'
          }
        ]
      }
    ]
  },
  {
    id: 'phase-2',
    phaseNumber: 2,
    title: 'Phase 2: Applied Python & Statistical Intelligence',
    subtitle: 'Python, Pandas, NumPy, Matplotlib, Seaborn, and Rigorous Statistics & Probability',
    freeMentorQuota: 4,
    usedMentorQuota: 0,
    modules: [
      {
        id: 'mod-5',
        moduleNumber: 5,
        title: 'Module 5: Python Programming & Algorithmic Thinking',
        description: 'Syntax, data structures, functional paradigms, modular scripts, and testing basics.',
        classes: [
          {
            id: 'cls-201',
            classNumber: 8,
            title: 'Python Data Structures & Memory Models',
            instructor: 'Dr. Kabir Sen',
            dateTime: 'Upcoming · Phase 2 Launch',
            durationMinutes: 90,
            status: 'Upcoming',
            preReading: {
              title: 'Python Virtual Environments & Jupyter Setup',
              description: 'Guide to setting up Python 3.12, Conda, and VS Code data extensions.',
              estimatedReadTime: '25 mins',
              links: ['Python Setup Guide.md']
            }
          }
        ]
      },
      {
        id: 'mod-6',
        moduleNumber: 6,
        title: 'Module 6: Python Scientific Libraries (NumPy & Pandas)',
        description: 'Vectorized arrays, dataframe transformations, indexing, cleaning, and time series resampling.',
        classes: [
          {
            id: 'cls-202',
            classNumber: 9,
            title: 'Pandas Wrangling & Aggregation Patterns',
            instructor: 'Neha Patel',
            dateTime: 'Upcoming · Phase 2',
            durationMinutes: 90,
            status: 'Upcoming',
            preReading: {
              title: 'Vectorized Operations vs Python For-Loops',
              description: 'Performance benchmarking of NumPy arrays against standard Python lists.',
              estimatedReadTime: '20 mins',
              links: ['NumPy Memory Architecture.pdf']
            }
          }
        ]
      },
      {
        id: 'mod-7',
        moduleNumber: 7,
        title: 'Module 7: Applied Statistics, Probability & A/B Testing',
        description: 'Parametric and non-parametric hypothesis testing, confidence intervals, sample size calculation, and Bayes theorem.',
        classes: [
          {
            id: 'cls-203',
            classNumber: 10,
            title: 'Hypothesis Testing & A/B Experimentation Design',
            instructor: 'Dr. Kabir Sen',
            dateTime: 'Upcoming · Phase 2',
            durationMinutes: 90,
            status: 'Upcoming',
            preReading: {
              title: 'Type I vs Type II Errors in Product Decisions',
              description: 'Statistical power, sample size estimation, and minimum detectable effect (MDE).',
              estimatedReadTime: '30 mins',
              links: ['Experimentation Calculator Guide.pdf']
            },
            relatedProjectId: 'proj-major-2'
          }
        ]
      }
    ]
  }
];

export const DEMO_ASSIGNMENTS: AssignmentItem[] = [
  {
    id: 'asg-101',
    classId: 'cls-101',
    title: 'Assignment 1: Relational Schema & Entity Diagram',
    description: 'Construct a 3NF normalized schema for a subscription streaming service with at least 5 linked tables.',
    dueDate: '14 Oct 2026',
    status: 'Evaluated',
    maxScore: 100,
    obtainedScore: 94,
    feedback: 'Excellent normalization and foreign key constraints. Consider adding index hints for the customer_id column.',
    submissionLink: 'https://github.com/priyasharma-cmw/sql-schema-assignment',
    submittedAt: '13 Oct 2026 · 22:15 IST'
  },
  {
    id: 'asg-102',
    classId: 'cls-102',
    title: 'Assignment 2: Complex Joins & Customer Churn Querying',
    description: 'Write queries to compute month-over-month active buyer retention using multi-table JOINs and CASE conditions.',
    dueDate: '18 Oct 2026',
    status: 'Evaluated',
    maxScore: 100,
    obtainedScore: 92,
    feedback: 'Solid query structure. The outer join handling of missing transaction months was done cleanly.',
    submissionLink: 'https://github.com/priyasharma-cmw/sql-joins-assignment',
    submittedAt: '17 Oct 2026 · 18:40 IST'
  },
  {
    id: 'asg-103',
    classId: 'cls-103',
    title: 'Assignment 3: Window Functions & Running Totals',
    description: 'Calculate 7-day moving averages of revenue and customer acquisition cohort ranks using analytical window queries.',
    dueDate: '24 Oct 2026',
    status: 'Submitted',
    maxScore: 100,
    submissionLink: 'https://github.com/priyasharma-cmw/sql-window-functions',
    submittedAt: '23 Oct 2026 · 20:10 IST'
  },
  {
    id: 'asg-104',
    classId: 'cls-104',
    title: 'Assignment 4: Automated Power Query ETL Workbook',
    description: 'Ingest 3 disparate sales CSV files, normalize customer addresses, and create a parameter-driven refresh dashboard.',
    dueDate: '30 Oct 2026',
    status: 'In Progress',
    maxScore: 100
  },
  {
    id: 'asg-105',
    classId: 'cls-105',
    title: 'Assignment 5: Scenario & Sensitivity Matrix Model',
    description: 'Build a two-variable sensitivity table testing product pricing elasticity vs customer acquisition cost.',
    dueDate: '04 Nov 2026',
    status: 'Available',
    maxScore: 100
  }
];

export const DEMO_PROJECTS: ProjectItem[] = [
  {
    id: 'proj-mod-1',
    type: 'module',
    phaseNumber: 1,
    title: 'Module 1 Hands-on: Retail E-Commerce SQL Database Audit',
    description: 'End-to-end relational audit analyzing 100k customer order records to identify revenue leakage and refund patterns.',
    brief: 'Work with a simulated production PostgreSQL database containing raw order tables, returns, and delivery logs. Identify top return categories and calculate refund rates per merchant.',
    deliverables: [
      'Comprehensive SQL script with commented logic',
      'Summary executive presentation (5 slides)',
      'Query execution plan analysis showing index utilization'
    ],
    status: 'Evaluated',
    score: 95,
    maxScore: 100,
    reviewerFeedback: 'Outstanding schema exploration. Your index suggestions reduced query runtime on the transactions table by 68%. Approved for portfolio inclusion.',
    submissionRepoUrl: 'https://github.com/priyasharma-cmw/ecommerce-sql-audit',
    submittedAt: '20 Oct 2026',
    allowResubmission: false
  },
  {
    id: 'proj-major-1',
    type: 'major',
    phaseNumber: 1,
    title: 'Major Project 1: End-to-End Product Analytics & Executive Tableau Suite',
    description: 'Synthesizing SQL backend queries, Excel financial reconciliations, Tableau visual storytelling, and GenAI automated report generation.',
    brief: 'A flagship portfolio project analyzing a multi-tier SaaS platform. You will build user activation funnels, churn probability cohorts, and an interactive executive cockpit in Tableau, supplemented by an automated GenAI summary generator.',
    deliverables: [
      'Cleaned data pipeline in PostgreSQL & Excel Power Query',
      'Tableau Workbook (.twbx) with interactive filters and parameters',
      'GenAI prompt chain document generating automated executive briefs',
      '10-minute recorded walkthrough video presentation'
    ],
    status: 'In Progress',
    maxScore: 100
  },
  {
    id: 'proj-major-2',
    type: 'major',
    phaseNumber: 2,
    title: 'Major Project 2: Predictive Customer Modeling & A/B Experimentation Suite',
    description: 'Rigorous statistical experimentation analysis, Python data processing, and predictive churn modeling using statistical regression.',
    brief: 'Phase 2 capstone project testing conversion hypotheses across product redesigns with 95% statistical confidence, followed by building a predictive customer lifetime value model using Pandas and NumPy.',
    deliverables: [
      'Jupyter Notebook with documented statistical tests (t-tests, chi-square, ANOVA)',
      'Automated data cleaning and outlier detection pipeline in Python',
      'Experimentation decision memo for product managers'
    ],
    status: 'Not Started',
    maxScore: 100
  }
];

export const DEMO_BADGES: BadgeItem[] = [
  {
    id: 'badge-1',
    title: 'Attendance Vanguard',
    description: 'Maintained >= 90% live lecture and workshop attendance.',
    isUnlocked: true,
    earnedDate: '20 Oct 2026',
    criteria: 'Attendance >= 90%',
    iconName: 'ShieldCheck'
  },
  {
    id: 'badge-2',
    title: 'Assignment Consistency',
    description: 'Completed >= 90% of all assigned module exercises on time.',
    isUnlocked: true,
    earnedDate: '22 Oct 2026',
    criteria: 'Assignment Completion >= 90%',
    iconName: 'CheckCircle2'
  },
  {
    id: 'badge-3',
    title: 'SQL Maestro',
    description: 'Achieved > 90% marks on all Phase 1 SQL assessments and project audit.',
    isUnlocked: true,
    earnedDate: '21 Oct 2026',
    criteria: 'SQL Evaluation >= 90%',
    iconName: 'Database'
  },
  {
    id: 'badge-4',
    title: 'Phase 1 Champion',
    description: 'Complete all Phase 1 modules, pass mock interview 1, and submit Major Project 1.',
    isUnlocked: false,
    criteria: 'Phase 1 completion + Major Project 1 approval',
    iconName: 'Award'
  },
  {
    id: 'badge-5',
    title: 'Python Data Alchemist',
    description: 'Complete Phase 2 Python libraries and statistical experimentation capstone.',
    isUnlocked: false,
    criteria: 'Phase 2 completion + Major Project 2 approval',
    iconName: 'Code2'
  }
];

export const AVAILABLE_MENTORS: MentorProfile[] = [
  {
    id: 'mentor-1',
    name: 'Aarav Mehta',
    role: 'Lead Concept Instructor · Ex-Senior Analyst',
    expertise: ['SQL Architecture', 'Window Functions', 'Data Modeling', 'Interview Prep'],
    availableSlots: [
      'Tomorrow · 16:00 - 16:45 IST',
      'Tomorrow · 18:30 - 19:15 IST',
      'Thursday · 15:00 - 15:45 IST'
    ],
    avatarInitial: 'AM'
  },
  {
    id: 'mentor-2',
    name: 'Neha Patel',
    role: 'Hands-on Lab Facilitator · BI Specialist',
    expertise: ['Excel Power Query', 'Tableau Dashboards', 'Query Debugging', 'ETL Pipelines'],
    availableSlots: [
      'Wednesday · 14:00 - 14:45 IST',
      'Friday · 17:00 - 17:45 IST',
      'Saturday · 11:00 - 11:45 IST'
    ],
    avatarInitial: 'NP'
  },
  {
    id: 'mentor-3',
    name: 'Dr. Kabir Sen',
    role: 'Industry Project Reviewer · Staff Data Scientist',
    expertise: ['Python for Data', 'Statistics & A/B Testing', 'GenAI Workflows', 'Portfolio Architecture'],
    availableSlots: [
      'Thursday · 19:00 - 19:45 IST',
      'Saturday · 16:30 - 17:15 IST'
    ],
    avatarInitial: 'KS'
  },
  {
    id: 'mentor-4',
    name: 'Rohit Verma',
    role: 'Career & Interview Coach',
    expertise: ['Mock Interviews', 'Resume Architecture', 'Salary Benchmarking', 'Technical Case Studies'],
    availableSlots: [
      'Friday · 15:30 - 16:15 IST',
      'Sunday · 12:00 - 12:45 IST'
    ],
    avatarInitial: 'RV'
  }
];

export const DEMO_BOOKINGS: MentorBooking[] = [
  {
    id: 'bk-1',
    mentorName: 'Aarav Mehta',
    phase: 1,
    date: '27 Oct 2026',
    timeSlot: '16:00 - 16:45 IST',
    topic: 'Reviewing Major Project 1 Schema Architecture & Query Optimization',
    status: 'Upcoming',
    meetingLink: 'https://meet.google.com/demo-cmw-mentor1',
    isFreeQuota: true
  },
  {
    id: 'bk-2',
    mentorName: 'Neha Patel',
    phase: 1,
    date: '16 Oct 2026',
    timeSlot: '17:00 - 17:45 IST',
    topic: 'Debugging complex multi-table joins and NULL value filtering',
    status: 'Completed',
    isFreeQuota: true
  }
];

export const DEMO_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Live Class Starting Soon',
    message: 'Class 4: Power Query for Automated Data Cleaning starts today at 19:30 IST. Join link is now active in your dashboard.',
    timestamp: '15 mins ago',
    category: 'Class',
    isRead: false,
    actionRoute: 'student-dashboard'
  },
  {
    id: 'notif-2',
    title: 'Assignment 1 Evaluated',
    message: 'Your Relational Schema assignment has been graded (94/100). Review your instructor feedback.',
    timestamp: '2 hours ago',
    category: 'Assignment',
    isRead: false,
    actionRoute: 'student-dashboard'
  },
  {
    id: 'notif-3',
    title: 'Mentor Booking Confirmed',
    message: 'Your 1:1 session with Aarav Mehta is confirmed for 27 Oct at 16:00 IST.',
    timestamp: '1 day ago',
    category: 'Mentor',
    isRead: true,
    actionRoute: 'student-dashboard'
  },
  {
    id: 'notif-4',
    title: 'Monthly Guest Masterclass Announced',
    message: 'Topic: Real-World Data Pipelines & Modern Lakehouse Architectures with visiting staff engineer. RSVP open.',
    timestamp: '2 days ago',
    category: 'Announcement',
    isRead: true,
    actionRoute: 'student-dashboard'
  }
];

export const FAQS = [
  {
    q: 'Can beginners with no coding background join the Data Analyst + GenAI program?',
    a: 'Yes. The curriculum begins with fundamental data modeling, SQL syntax, and spreadsheet foundations before advancing into Python and algorithmic thinking. Over 60% of our enrolled learners transition from non-coding or non-tech backgrounds.'
  },
  {
    q: 'How does the Four-Teacher mentoring model work?',
    a: 'Instead of relying on a single instructor for everything, you learn through four dedicated specialists: Concept Instructors for conceptual theory, Hands-on Lab Facilitators for daily coding queries, Industry Project Reviewers for line-by-line portfolio feedback, and Career Coaches for interview preparation.'
  },
  {
    q: 'What is the schedule and weekly time commitment?',
    a: 'Expect approximately 8–10 hours per week: 3 hours of live interactive weekend lectures, 2 hours of weekday guided hands-on labs, and 3–5 hours for assignments, projects, and 1:1 mentor checkpoints.'
  },
  {
    q: 'What is the fee breakdown and early-bird policy?',
    a: 'The standard program price is ₹36,000, with a special early-bird enrolled price of ₹24,999 (30% discount) for early registrants. Registration fees are charged separately and confirmed by the admissions team prior to onboarding.'
  },
  {
    q: 'How are mock interviews conducted?',
    a: 'Students receive structured technical and behavioral mock interviews after completing Phase 1 and Phase 2 milestones. These replicate realistic technical hiring loops with real feedback and actionable revision plans.'
  },
  {
    q: 'Does CodeMyWay guarantee jobs or placements?',
    a: 'No. CodeMyWay focuses on rigorous, verifiable skill mastery, portfolio architecture, resume optimization, and mock interview readiness. We do not make false job or salary placement guarantees.'
  }
];
