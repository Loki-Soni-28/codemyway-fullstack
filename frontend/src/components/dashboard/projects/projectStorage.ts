import { 
  ProjectStatus, 
  StudentProjectState, 
  ProjectSubmission, 
  MentorReview 
} from './types';
import { ALL_PROJECTS } from './projectData';

const STORAGE_PREFIX = 'codemyway_student_projects_';

/**
 * Generates initial authentic student project progress data.
 * Module 1 SQL: Approved with full mentor review & scores
 * Module 2 Excel: Under Review / Submitted
 * Module 3 Tableau: In Progress (with draft)
 * Phase 1 Capstone: In Progress (Milestone 1 & 2 completed)
 * Phase 2 Core Python: Not Started
 * Phase 2 Python Libraries: Not Started
 * Phase 2 Stats: Locked (unlocks after Python)
 * Phase 2 Capstone: Locked
 */
export function generateInitialStudentProjects(studentEmail: string): StudentProjectState[] {
  return [
    // Phase 1 - Module 1: SQL Minor Project (Approved & Graded)
    {
      projectId: 'proj-mod-1-sql',
      studentEmail,
      status: 'Approved',
      isUnlocked: true,
      currentScore: 94,
      lastUpdated: '2026-10-25T14:30:00Z',
      submissions: [
        {
          version: 1,
          submittedAt: '2026-10-24T18:15:00Z',
          projectDescription: 'Completed comprehensive e-commerce cohort retention analysis across 124,500 orders. Built 12-month retention heatmaps, calculated customer lifetime value by acquisition channel, and identified high-churn product categories.',
          uploadedFiles: [
            {
              fileName: 'nexmart_cohort_retention_pipeline.sql',
              fileSize: '48 KB',
              fileType: 'application/sql',
              uploadedAt: '2026-10-24T18:10:00Z'
            },
            {
              fileName: 'executive_retention_findings_deck.pdf',
              fileSize: '3.4 MB',
              fileType: 'application/pdf',
              uploadedAt: '2026-10-24T18:12:00Z'
            }
          ],
          githubRepoUrl: 'https://github.com/anuj-sharma/nexmart-sql-cohort-retention',
          status: 'Approved',
          mentorReview: {
            mentorName: 'Vikramaditya Sengupta',
            mentorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
            reviewDate: '25 Oct 2026, 02:30 PM',
            overallScore: 94,
            maxScore: 100,
            criteriaBreakdown: [
              {
                category: 'Query Accuracy & Logical Structure',
                score: 24,
                maxScore: 25,
                comments: 'Impeccable SQL syntax. Proper table aliasing and zero syntax ambiguities in multi-table joins.'
              },
              {
                category: 'Advanced SQL: Window Functions & CTEs',
                score: 25,
                maxScore: 25,
                comments: 'Outstanding use of DENSE_RANK() and LAG() over partition windows to determine month-over-month retention deltas.'
              },
              {
                category: 'Data Integrity & NULL Handling',
                score: 22,
                maxScore: 25,
                comments: 'Handled cancelled orders well using COALESCE. Consider adding an index on order_purchase_timestamp for billion-row scale.'
              },
              {
                category: 'Actionable Business Insights',
                score: 23,
                maxScore: 25,
                comments: 'The finding regarding electronics warranty drop-offs is sharp and immediately actionable for marketing.'
              }
            ],
            writtenFeedback: 'Terrific execution, Anuj! Your SQL pipeline is well-commented, modular, and shows deep grasp of CTEs and analytical partitions. Your cohort breakdown was clear and the executive summary was structured like a senior analyst report.',
            strengths: [
              'Clean modular Common Table Expressions (CTEs) improving query readability',
              'Correct mathematical formulation of cohort retention rates without double-counting',
              'Thorough executive summary highlighting high-churn SKU segments'
            ],
            improvementAreas: [
              'Add EXPLAIN ANALYZE execution plan comments in your submission repository',
              'Include parameterized date ranges in stored views for future automation'
            ]
          }
        }
      ]
    },

    // Phase 1 - Module 2: Excel Minor Project (Submitted / Under Review)
    {
      projectId: 'proj-mod-2-excel',
      studentEmail,
      status: 'Under Review',
      isUnlocked: true,
      lastUpdated: '2026-10-29T16:45:00Z',
      submissions: [
        {
          version: 1,
          submittedAt: '2026-10-29T16:40:00Z',
          projectDescription: 'Cleaned and consolidated financial statements across all 42 BeanCraft coffee chain locations using Power Query. Built dynamic XLOOKUP models, store contribution margin rankings, and a two-variable price vs bean cost sensitivity table.',
          uploadedFiles: [
            {
              fileName: 'BeanCraft_Store_Profitability_Model_v1.xlsx',
              fileSize: '6.2 MB',
              fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              uploadedAt: '2026-10-29T16:38:00Z'
            }
          ],
          githubRepoUrl: 'https://github.com/anuj-sharma/beancraft-excel-diagnostics',
          liveDashboardUrl: 'https://onedrive.live.com/view.aspx?resid=beancraft_demo',
          status: 'Under Review'
        }
      ]
    },

    // Phase 1 - Module 3: Tableau Minor Project (In Progress with Saved Draft)
    {
      projectId: 'proj-mod-3-tableau',
      studentEmail,
      status: 'In Progress',
      isUnlocked: true,
      lastUpdated: '2026-10-31T11:20:00Z',
      draftData: {
        projectDescription: 'Currently building dual-axis freight volume maps and FIXED LOD calculations to isolate port-of-entry customs delays across international trade lanes.',
        githubRepoUrl: '',
        liveDashboardUrl: 'https://public.tableau.com/app/profile/anuj.sharma/viz/ApexLogisticsWIP',
        demoVideoUrl: '',
        uploadedFileNames: ['Apex_Freight_Delay_Analysis_Draft.twbx'],
        lastSavedAt: '2026-10-31T11:15:00Z'
      },
      submissions: []
    },

    // Phase 1 - Capstone / Major Project (In Progress - Milestone 1 & 2 completed)
    {
      projectId: 'proj-capstone-1',
      studentEmail,
      status: 'In Progress',
      isUnlocked: true,
      lastUpdated: '2026-10-30T19:00:00Z',
      draftData: {
        projectDescription: 'Phase 1 Capstone: End-to-End PulseFlow SaaS Customer Churn & Revenue Optimization Platform. Finished SQL extraction and Excel sensitivity model. Currently finalizing the executive Tableau dashboard and board presentation deck.',
        githubRepoUrl: 'https://github.com/anuj-sharma/pulseflow-saas-churn-capstone',
        liveDashboardUrl: 'https://public.tableau.com/app/profile/anuj.sharma/viz/PulseFlowExecutiveChurn',
        demoVideoUrl: '',
        uploadedFileNames: ['pulseflow_sql_pipeline.sql', 'pulseflow_financial_model.xlsx'],
        lastSavedAt: '2026-10-30T18:55:00Z'
      },
      submissions: []
    },

    // Phase 2 - Module 5: Core Python Minor Project (Not Started / Unlocked)
    {
      projectId: 'proj-mod-5-python',
      studentEmail,
      status: 'Not Started',
      isUnlocked: true,
      lastUpdated: '2026-10-31T00:00:00Z',
      submissions: []
    },

    // Phase 2 - Module 6: Python Libraries Minor Project (Not Started / Unlocked)
    {
      projectId: 'proj-mod-6-libraries',
      studentEmail,
      status: 'Not Started',
      isUnlocked: true,
      lastUpdated: '2026-10-31T00:00:00Z',
      submissions: []
    },

    // Phase 2 - Module 7: Statistics & Probability Minor Project (Locked)
    {
      projectId: 'proj-mod-7-stats',
      studentEmail,
      status: 'Locked',
      isUnlocked: false,
      lastUpdated: '2026-10-31T00:00:00Z',
      submissions: []
    },

    // Phase 2 - Capstone / Major Project (Locked)
    {
      projectId: 'proj-capstone-2',
      studentEmail,
      status: 'Locked',
      isUnlocked: false,
      lastUpdated: '2026-10-31T00:00:00Z',
      submissions: []
    }
  ];
}

/**
 * Gets student project records from localStorage or initializes them.
 */
export function getStudentProjects(studentEmail: string): StudentProjectState[] {
  const key = `${STORAGE_PREFIX}${studentEmail || 'default'}`;
  try {
    const data = localStorage.getItem(key);
    if (data) {
      const parsed: StudentProjectState[] = JSON.parse(data);
      // Ensure all 8 project definitions exist in user state
      const existingIds = new Set(parsed.map(p => p.projectId));
      const initial = generateInitialStudentProjects(studentEmail);
      let updated = false;
      initial.forEach(initP => {
        if (!existingIds.has(initP.projectId)) {
          parsed.push(initP);
          updated = true;
        }
      });
      if (updated) {
        localStorage.setItem(key, JSON.stringify(parsed));
      }
      return parsed;
    }
  } catch (err) {
    console.warn('Failed to load student projects from localStorage:', err);
  }

  // Fallback initialize
  const initialData = generateInitialStudentProjects(studentEmail);
  try {
    localStorage.setItem(key, JSON.stringify(initialData));
  } catch {
    // Ignore storage quota errors
  }
  return initialData;
}

/**
 * Saves updated project states for a student.
 */
export function saveStudentProjects(studentEmail: string, states: StudentProjectState[]): void {
  const key = `${STORAGE_PREFIX}${studentEmail || 'default'}`;
  try {
    localStorage.setItem(key, JSON.stringify(states));
  } catch (err) {
    console.error('Error saving student projects:', err);
  }
}

/**
 * Saves a draft for a specific project.
 */
export function saveProjectDraft(
  projectId: string,
  studentEmail: string,
  draft: {
    projectDescription: string;
    githubRepoUrl: string;
    liveDashboardUrl: string;
    demoVideoUrl: string;
    uploadedFileNames: string[];
  }
): StudentProjectState {
  const projects = getStudentProjects(studentEmail);
  const index = projects.findIndex(p => p.projectId === projectId);
  const now = new Date().toISOString();

  let state: StudentProjectState;
  if (index !== -1) {
    state = {
      ...projects[index],
      status: projects[index].status === 'Not Started' ? 'In Progress' : projects[index].status,
      draftData: {
        ...draft,
        lastSavedAt: now
      },
      lastUpdated: now
    };
    projects[index] = state;
  } else {
    state = {
      projectId,
      studentEmail,
      status: 'In Progress',
      isUnlocked: true,
      draftData: {
        ...draft,
        lastSavedAt: now
      },
      submissions: [],
      lastUpdated: now
    };
    projects.push(state);
  }

  saveStudentProjects(studentEmail, projects);
  return state;
}

/**
 * Submits a completed project for review.
 */
export function submitProject(
  projectId: string,
  studentEmail: string,
  submissionPayload: {
    projectDescription: string;
    githubRepoUrl?: string;
    liveDashboardUrl?: string;
    demoVideoUrl?: string;
    files: { fileName: string; fileSize: string; fileType: string }[];
  }
): StudentProjectState {
  const projects = getStudentProjects(studentEmail);
  const index = projects.findIndex(p => p.projectId === projectId);
  const now = new Date().toISOString();

  const newVersion = (index !== -1 && projects[index].submissions.length > 0)
    ? projects[index].submissions.length + 1
    : 1;

  const newSubmission: ProjectSubmission = {
    version: newVersion,
    submittedAt: now,
    projectDescription: submissionPayload.projectDescription,
    uploadedFiles: submissionPayload.files.map(f => ({
      ...f,
      uploadedAt: now
    })),
    githubRepoUrl: submissionPayload.githubRepoUrl,
    liveDashboardUrl: submissionPayload.liveDashboardUrl,
    demoVideoUrl: submissionPayload.demoVideoUrl,
    status: 'Under Review'
  };

  let state: StudentProjectState;
  if (index !== -1) {
    state = {
      ...projects[index],
      status: 'Under Review',
      submissions: [newSubmission, ...projects[index].submissions],
      lastUpdated: now
    };
    projects[index] = state;
  } else {
    state = {
      projectId,
      studentEmail,
      status: 'Under Review',
      isUnlocked: true,
      submissions: [newSubmission],
      lastUpdated: now
    };
    projects.push(state);
  }

  saveStudentProjects(studentEmail, projects);
  return state;
}

/**
 * Updates mentor review (Faculty / Review Simulation).
 */
export function updateMentorReview(
  projectId: string,
  studentEmail: string,
  review: MentorReview,
  newStatus: ProjectStatus
): StudentProjectState {
  const projects = getStudentProjects(studentEmail);
  const index = projects.findIndex(p => p.projectId === projectId);
  const now = new Date().toISOString();

  if (index === -1) {
    throw new Error('Project not found');
  }

  const project = projects[index];
  const submissions = [...project.submissions];
  if (submissions.length > 0) {
    submissions[0] = {
      ...submissions[0],
      status: newStatus,
      mentorReview: review
    };
  }

  const updated: StudentProjectState = {
    ...project,
    status: newStatus,
    currentScore: review.overallScore,
    submissions,
    lastUpdated: now
  };

  projects[index] = updated;
  saveStudentProjects(studentEmail, projects);
  return updated;
}

/**
 * Toggles locking/unlocking of a project.
 */
export function toggleProjectLock(
  projectId: string,
  studentEmail: string,
  isUnlocked: boolean
): StudentProjectState {
  const projects = getStudentProjects(studentEmail);
  const index = projects.findIndex(p => p.projectId === projectId);
  const now = new Date().toISOString();

  if (index === -1) {
    throw new Error('Project not found');
  }

  const updated: StudentProjectState = {
    ...projects[index],
    isUnlocked,
    status: isUnlocked 
      ? (projects[index].status === 'Locked' ? 'Not Started' : projects[index].status) 
      : 'Locked',
    lastUpdated: now
  };

  projects[index] = updated;
  saveStudentProjects(studentEmail, projects);
  return updated;
}

/**
 * Calculates dynamic project metrics from student records.
 */
export function calculateProjectMetrics(studentProjects: StudentProjectState[]) {
  const totalProjects = ALL_PROJECTS.length; // Exactly 8 projects
  
  let completedProjects = 0;
  let inProgress = 0;
  let pendingReview = 0;

  studentProjects.forEach(p => {
    if (p.status === 'Approved') {
      completedProjects++;
    } else if (p.status === 'In Progress') {
      inProgress++;
    } else if (p.status === 'Submitted' || p.status === 'Under Review' || p.status === 'Revision Required') {
      pendingReview++;
    }
  });

  return {
    totalProjects,
    completedProjects,
    inProgress,
    pendingReview
  };
}
