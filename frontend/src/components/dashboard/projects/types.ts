export type ProjectStatus = 
  | 'Locked'
  | 'Not Started'
  | 'In Progress'
  | 'Submitted'
  | 'Under Review'
  | 'Revision Required'
  | 'Approved';

export type ProjectType = 'minor' | 'major';

export interface ProjectResource {
  id: string;
  name: string;
  type: 'csv' | 'xlsx' | 'sql' | 'pdf' | 'pbix' | 'twbx' | 'doc' | 'link';
  size?: string;
  url: string;
  description: string;
  isDownloadable?: boolean;
}

export interface EvaluationCriterion {
  category: string;
  score: number;
  maxScore: number;
  comments: string;
}

export interface MentorReview {
  mentorName: string;
  mentorAvatar?: string;
  reviewDate: string;
  overallScore: number; // e.g. 92
  maxScore: number; // e.g. 100
  criteriaBreakdown: EvaluationCriterion[];
  writtenFeedback: string;
  strengths: string[];
  improvementAreas: string[];
  revisionInstructions?: string;
}

export interface ProjectSubmission {
  version: number;
  submittedAt: string;
  projectDescription: string;
  uploadedFiles: {
    fileName: string;
    fileSize: string;
    fileType: string;
    uploadedAt: string;
  }[];
  githubRepoUrl?: string;
  liveDashboardUrl?: string;
  demoVideoUrl?: string;
  status: ProjectStatus;
  mentorReview?: MentorReview;
}

export interface CapstoneMilestone {
  id: string;
  milestoneNumber: number;
  title: string;
  description: string;
  deliverables: string[];
  status: 'Completed' | 'In Progress' | 'Upcoming';
  completionDate?: string;
  mentorRemarks?: string;
}

export interface ProjectDefinition {
  id: string; // e.g. 'proj-mod-1', 'proj-capstone-1'
  phaseNumber: 1 | 2;
  moduleNumber?: number; // 1, 2, 3 for Phase 1; 5, 6, 7 for Phase 2
  type: ProjectType;
  title: string;
  shortDescription: string;
  technologies: string[];
  submissionDeadline?: string;
  
  // Detailed Page fields
  objective: string;
  businessContext: string;
  problemStatement: string;
  expectedOutcome: string;
  skillsRequired: {
    name: string;
    category: string;
  }[];
  resources: ProjectResource[];
  taskRequirements: string[];
  deliverables: string[];
  evaluationCriteriaOverview: string[];
  submissionInstructions: string[];
  
  // Capstone specific milestones (if major)
  milestones?: CapstoneMilestone[];
  
  // Unlocking configuration
  prerequisiteModule?: string;
  isDefaultLocked?: boolean;
}

export interface StudentProjectState {
  projectId: string;
  studentEmail: string;
  status: ProjectStatus;
  isUnlocked: boolean;
  draftData?: {
    projectDescription: string;
    githubRepoUrl: string;
    liveDashboardUrl: string;
    demoVideoUrl: string;
    uploadedFileNames: string[];
    lastSavedAt: string;
  };
  submissions: ProjectSubmission[];
  currentScore?: number;
  lastUpdated: string;
}
