import React, { useState, useEffect } from 'react';
import { NavigationRoute, StudentUser } from '../../types';
import { CoreCurriculumView } from './CoreCurriculumView';
import { BusinessProjectsView } from './projects/BusinessProjectsView';
import { StudentMentorView } from './mentor/StudentMentorView';
import { PersonalDetailsView } from './personal/PersonalDetailsView';
import { 
  Rocket,
  LayoutDashboard,
  BookOpen,
  FileText,
  Users,
  Briefcase,
  User,
  Award,
  Trophy,
  Calendar,
  CheckCircle2,
  Clock,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Target,
  Laptop,
  Lock,
  Bell,
  ArrowRight,
  Download,
  MessageSquare,
  Headphones,
  Sparkles,
  ExternalLink,
  X,
  Play,
  Check,
  Menu,
  Home,
  Search,
  Code2,
  Calculator,
  BrainCircuit,
  FolderOpen,
  PanelLeftClose,
  PanelLeftOpen,
  PanelLeft,
  FileSpreadsheet,
  Layers,
  Video,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Database,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StudentDashboardPageProps {
  onRouteChange: (route: NavigationRoute) => void;
  currentUser?: StudentUser | null;
  onLogout?: () => void;
}

export interface SqlWeeklyStructure {
  weekTitle: string;
  classes: {
    id: number;
    title: string;
  }[];
}

export interface DayWiseClass {
  id: number;
  dayNumber: string;
  title: string;
  duration: string;
  shortDescription: string;
  topics: string[];
  learningOutcome: string;
  status: 'Completed' | 'In Progress' | 'Upcoming';
  hasMaterials: boolean;
  materialsName?: string;
  hasRecording: boolean;
  recordingDuration?: string;
  hasAssignment: boolean;
  assignmentTitle?: string;
  assignmentStatus?: 'Submitted' | 'In Progress' | 'Pending' | 'Not Started';
  isProject?: boolean;
  projectScenario?: string;
  projectTasks?: string[];
  projectDeliverables?: string[];
  isGenAI?: boolean;
  practicalDemos?: string[];
  importantNote?: string;
}

interface ClassTopicItem {
  id: number;
  topic: string;
  date: string;
  day: string;
  isToday?: boolean;
  course: string;
  courseType: 'python' | 'math' | 'ml';
  assignment: string;
  assignmentCompleted: boolean;
  additionalProblem: string;
  lectureAttendance: string;
  attendanceRatio: string;
  attendanceFull: boolean;
}

interface CurriculumModule {
  id: number;
  title: string;
  progressText: string;
  percent: number;
  status: 'completed' | 'in-progress' | 'locked' | 'resources';
  classes: ClassTopicItem[];
  dayWiseClasses?: DayWiseClass[];
  sqlWeeks?: SqlWeeklyStructure[];
}

export const StudentDashboardPage: React.FC<StudentDashboardPageProps> = ({ 
  onRouteChange,
  currentUser,
  onLogout 
}) => {
  const studentName = currentUser?.fullName ? currentUser.fullName.split(' ')[0] : 'Learner';
  const studentInitial = currentUser?.fullName ? currentUser.fullName.charAt(0).toUpperCase() : 'L';

  // "Welcome" on a student's first dashboard visit, "Welcome back" afterwards.
  const visitKey = `codemyway_dashboard_visited:${currentUser?.email ?? 'anon'}`;
  const [isFirstVisit] =useState<boolean>(() => {
    try {
      return !localStorage.getItem(visitKey);
    } catch {
      return true;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(visitKey, '1');
    } catch {
      // ignore
    }
  }, [visitKey]);

  // Today's date, kept in sync with the device calendar (re-checked every minute so it rolls over at midnight).
  const [now, setNow] = useState<Date>(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);
  const todayLabel = `${now.toLocaleDateString('en-GB', { weekday: 'short' })}, ${now.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })}`;

  // Navigation active tab: 'dashboard' | 'curriculum' | 'assignments' | etc.
  const [activeNav, setActiveNav] = useState<string>('dashboard');
  
  // Slide Open / Close Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Selected module in Core Curriculum view
  const [selectedModuleId, setSelectedModuleId] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCurriculumExpanded, setIsCurriculumExpanded] = useState<boolean>(true);

  // Module View Mode: 'cards' (Day-wise Roadmap Cards) | 'table' (Schedule Table)
  const [moduleViewMode, setModuleViewMode] = useState<'cards' | 'table'>('cards');
  const [cardStatusFilter, setCardStatusFilter] = useState<'all' | 'Completed' | 'In Progress' | 'Upcoming'>('all');
  const [expandedCardIds, setExpandedCardIds] = useState<number[]>([1, 2, 3, 4, 5, 6]);

  const toggleCardExpanded = (id: number) => {
    setExpandedCardIds(prev => 
      prev.includes(id) ? prev.filter(cardId => cardId !== id) : [...prev, id]
    );
  };

  const expandAllCards = () => {
    setExpandedCardIds([1, 2, 3, 4, 5, 6]);
  };

  const collapseAllCards = () => {
    setExpandedCardIds([]);
  };

  // 4-Week, 12-Class Structure for Module 1: SQL
  const sqlWeeklyStructure: SqlWeeklyStructure[] = [
    {
      weekTitle: 'WEEK 1 — SQL FOUNDATIONS',
      classes: [
        { id: 1, title: 'Database Fundamentals & BigQuery Setup' },
        { id: 2, title: 'SQL Basics — Extracting Data' },
        { id: 3, title: 'Filtering & Conditional Logic' },
      ]
    },
    {
      weekTitle: 'WEEK 2 — DATA ANALYSIS WITH SQL',
      classes: [
        { id: 4, title: 'SQL Functions & Data Cleaning' },
        { id: 5, title: 'Aggregate Functions & GROUP BY' },
        { id: 6, title: 'Date Functions & Business Analysis' },
      ]
    },
    {
      weekTitle: 'WEEK 3 — INTERMEDIATE TO ADVANCED SQL',
      classes: [
        { id: 7, title: 'Subqueries & Nested Queries' },
        { id: 8, title: 'SQL Joins — Combining Multiple Tables' },
        { id: 9, title: 'Advanced Joins & Set Operations' },
      ]
    },
    {
      weekTitle: 'WEEK 4 — ADVANCED SQL & PRACTICAL APPLICATION',
      classes: [
        { id: 10, title: 'Window Functions, CTEs & Views' },
        { id: 11, title: 'SQL Minor Project — Business Case Study' },
        { id: 12, title: 'GenAI with SQL — Learn, Debug & Analyze' },
      ]
    }
  ];

  // 6 Day-wise Classes for Module 2: Excel & Google Sheets
  const excelDayWiseClasses: DayWiseClass[] = [
    {
      id: 1,
      dayNumber: 'Day 01',
      title: 'Spreadsheet Fundamentals & Essential Formulas',
      duration: '2 Hours',
      shortDescription: 'Spreadsheet navigation, cell references, data entry, and essential calculation formulas.',
      status: 'Completed',
      topics: [
        'Introduction to Microsoft Excel and Google Sheets',
        'Spreadsheet interface, rows, columns, cells and navigation',
        'Data entry, formatting and cell references',
        'Basic calculations and operators',
        'SUM, AVERAGE, MIN, MAX, COUNT and COUNTA',
        'IF, AND, OR, SUMIF and COUNTIF',
        'Basic text functions and CONCAT'
      ],
      learningOutcome: 'Students will understand spreadsheets and perform basic calculations using essential formulas.',
      hasMaterials: true,
      materialsName: 'Day01_Formulas_Starter.xlsx',
      hasRecording: true,
      recordingDuration: '2h 05m',
      hasAssignment: true,
      assignmentTitle: 'Assignment 1: Financial Operators & Math Functions',
      assignmentStatus: 'Submitted'
    },
    {
      id: 2,
      dayNumber: 'Day 02',
      title: 'Data Cleaning, Lookup & Advanced Formulas',
      duration: '2 Hours',
      shortDescription: 'Clean unstructured datasets, remove duplicates, handle dates, and master lookup and dynamic array formulas.',
      status: 'Completed',
      topics: [
        'Understanding messy and unstructured data',
        'Removing duplicates and handling missing values',
        'TRIM, LEFT, RIGHT, MID, LEN and VALUE',
        'Date functions: TODAY, DATE, YEAR, MONTH and DAY',
        'IFERROR',
        'VLOOKUP and XLOOKUP',
        'INDEX + MATCH',
        'FILTER, UNIQUE and SORT',
        'Introduction to dynamic array formulas'
      ],
      learningOutcome: 'Students will be able to clean datasets and retrieve relevant information using lookup and advanced formulas.',
      hasMaterials: true,
      materialsName: 'Day02_Data_Cleaning_Raw_Dataset.xlsx',
      hasRecording: true,
      recordingDuration: '2h 12m',
      hasAssignment: true,
      assignmentTitle: 'Assignment 2: Customer Cleansing & Modern XLOOKUP',
      assignmentStatus: 'Submitted'
    },
    {
      id: 3,
      dayNumber: 'Day 03',
      title: 'Data Analysis with Pivot Tables & Charts',
      duration: '2 Hours',
      shortDescription: 'Summarize large datasets, compute statistical aggregations, and create visual business charts.',
      status: 'In Progress',
      topics: [
        'Introduction to Pivot Tables',
        'Rows, Columns, Values and Filters',
        'SUM, COUNT and AVERAGE aggregations',
        'Sorting, filtering and grouping data',
        'Calculated fields',
        'Conditional formatting',
        'Bar, Column, Pie and Stacked Charts',
        'Introduction to statistical functions: Mean, Median, Mode and Standard Deviation'
      ],
      learningOutcome: 'Students will summarize large datasets, identify trends and create meaningful visualizations.',
      hasMaterials: true,
      materialsName: 'Day03_Sales_Aggregations_Template.xlsx',
      hasRecording: true,
      recordingDuration: 'Live Stream (Processing)',
      hasAssignment: true,
      assignmentTitle: 'Assignment 3: Pivot Table Sales Performance Matrix',
      assignmentStatus: 'In Progress'
    },
    {
      id: 4,
      dayNumber: 'Day 04',
      title: 'Interactive Dashboards & Business Insights',
      duration: '2 Hours',
      shortDescription: 'Build executive KPI dashboards with interactive slicers, layout design, and business data storytelling.',
      status: 'Upcoming',
      topics: [
        'Understanding business dashboards',
        'Selecting meaningful KPIs',
        'Creating helper columns and multiple Pivot Tables',
        'Creating KPI cards: Revenue, Profit, Orders and Growth',
        'Adding charts and slicers',
        'Interactive dashboard filters',
        'Dashboard layout and visualization principles',
        'Converting data into business insights',
        'Protecting sheets and organizing workbooks'
      ],
      learningOutcome: 'Students will build an interactive business dashboard and communicate insights using data.',
      hasMaterials: true,
      materialsName: 'Day04_Executive_Dashboard_Wireframe.xlsx',
      hasRecording: false,
      hasAssignment: true,
      assignmentTitle: 'Assignment 4: Executive KPI Dashboard Prototype',
      assignmentStatus: 'Pending'
    },
    {
      id: 5,
      dayNumber: 'Day 05',
      title: 'Minor Project: Coffee Chain Business Analysis',
      duration: '2 Hours',
      shortDescription: 'Hands-on practical business project: Diagnose financial losses for a coffee chain business and deliver actionable recommendations.',
      status: 'Upcoming',
      isProject: true,
      projectScenario: 'A coffee chain business is experiencing financial losses. Students need to analyze the available business dataset and identify possible reasons behind the losses.',
      projectTasks: [
        'Understand the business problem and define loss metrics',
        'Explore and clean the raw coffee chain sales dataset',
        'Analyze sales, profit and COGS (Cost of Goods Sold)',
        'Analyze product line and store location performance',
        'Create Pivot Tables and business KPIs',
        'Build charts and an interactive dashboard with slicers',
        'Identify 3–5 important business insights',
        'Suggest actionable business turnaround recommendations'
      ],
      projectDeliverables: [
        'Cleaned dataset (.xlsx / Google Sheets)',
        'Data analysis sheet with working formulas',
        'Pivot Tables and KPI calculations',
        'Interactive dashboard',
        'Business insights and recommendations presentation'
      ],
      topics: [
        'Understand the business problem',
        'Explore and clean the dataset',
        'Analyze sales, profit and COGS',
        'Analyze product and store performance',
        'Create Pivot Tables and business KPIs',
        'Build charts and an interactive dashboard',
        'Identify 3–5 important business insights',
        'Suggest actionable business recommendations'
      ],
      learningOutcome: 'Students will apply their spreadsheet knowledge to solve a practical business problem.',
      hasMaterials: true,
      materialsName: 'Day05_Coffee_Chain_Case_Study.zip',
      hasRecording: false,
      hasAssignment: true,
      assignmentTitle: 'Project 1: Coffee Chain Diagnostic Submission',
      assignmentStatus: 'Not Started'
    },
    {
      id: 6,
      dayNumber: 'Day 06',
      title: 'GenAI + Excel: Work Smarter with AI',
      duration: '2 Hours',
      shortDescription: 'Combine spreadsheet skills with ChatGPT & Gemini to write complex formulas, debug errors, automate workflows, and boost productivity.',
      status: 'Upcoming',
      isGenAI: true,
      topics: [
        'Introduction to using GenAI with Excel and Google Sheets',
        'Using AI tools such as ChatGPT and Gemini for spreadsheet tasks',
        'Writing effective prompts for Excel-related problems',
        'Generating complex Excel formulas using AI',
        'Understanding and debugging formula errors with AI',
        'Cleaning messy datasets using AI-assisted workflows',
        'Generating lookup formulas, conditional formulas and Pivot Table guidance',
        'Creating Excel dashboards with AI assistance',
        'Using AI to analyze datasets and generate business insights',
        'Automating repetitive spreadsheet tasks where supported',
        'Understanding how to verify AI-generated formulas and outputs'
      ],
      practicalDemos: [
        'Ask AI to write a formula for a real business problem.',
        'Give AI a messy dataset and ask for a cleaning approach.',
        'Use AI to explain a complicated formula in simple language.',
        'Generate formulas for revenue, profit, growth and performance analysis.',
        'Use AI to analyze a dataset and suggest useful KPIs.',
        'Ask AI to help design a business dashboard.',
        'Debug an incorrect formula with AI.'
      ],
      importantNote: 'This class focuses on practical demonstrations and hands-on AI usage, not just theory. Do not claim that AI can automatically perform every Excel task. Students must be taught to verify AI-generated formulas and outputs.',
      learningOutcome: 'Students will learn how to combine spreadsheet skills with GenAI to solve business problems faster and work more efficiently.',
      hasMaterials: true,
      materialsName: 'Day06_GenAI_Prompt_Engineering_Kit.pdf',
      hasRecording: false,
      hasAssignment: true,
      assignmentTitle: 'Assignment 6: AI-Assisted Formula Generation & Verification',
      assignmentStatus: 'Not Started'
    }
  ];

  // Modals state
  const [activeModalMessage, setActiveModalMessage] = useState<string | null>(null);

  // Sidebar navigation items
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'curriculum', label: 'Core Curriculum', icon: BookOpen },
    { id: 'assignments', label: 'Assignments', icon: FileText },
    { id: 'mentor', label: 'Mentor', icon: Users },
    { id: 'projects', label: 'Business / Projects', icon: Briefcase },
    { id: 'personal', label: 'Personal Details', icon: User },
    { id: 'certification', label: 'Skill Certification', icon: Award },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  ];

  // Secondary center navigation tabs
  const secondaryTabs = [
    { id: 'curriculum', label: 'Core Curriculum', icon: BookOpen },
    { id: 'assignments', label: 'Assignments', icon: FileText },
    { id: 'mentor', label: 'Mentor', icon: Users },
    { id: 'projects', label: 'Business / Projects', icon: Briefcase },
    { id: 'personal', label: 'Personal Details', icon: User },
    { id: 'certification', label: 'Skill Certification', icon: Award },
  ];

  // Comprehensive Curriculum Modules Data matching Screenshot 2
  const curriculumModules: CurriculumModule[] = [
    {
      id: 1,
      title: 'Module 1: SQL',
      progressText: '4 Weeks · 12 Classes',
      percent: 25,
      status: 'in-progress',
      sqlWeeks: sqlWeeklyStructure,
      classes: [
        {
          id: 1,
          topic: 'Database Fundamentals & BigQuery Setup',
          date: 'WEEK 1',
          day: '(Class 1)',
          course: 'SQL',
          courseType: 'python',
          assignment: '1 / 1',
          assignmentCompleted: true,
          additionalProblem: '0 / 0',
          lectureAttendance: '100%',
          attendanceRatio: '1 / 1',
          attendanceFull: true
        },
        {
          id: 2,
          topic: 'SQL Basics — Extracting Data',
          date: 'WEEK 1',
          day: '(Class 2)',
          course: 'SQL',
          courseType: 'python',
          assignment: '1 / 1',
          assignmentCompleted: true,
          additionalProblem: '0 / 0',
          lectureAttendance: '100%',
          attendanceRatio: '1 / 1',
          attendanceFull: true
        },
        {
          id: 3,
          topic: 'Filtering & Conditional Logic',
          date: 'WEEK 1',
          day: '(Class 3)',
          course: 'SQL',
          courseType: 'python',
          assignment: '0 / 1',
          assignmentCompleted: false,
          additionalProblem: '0 / 0',
          lectureAttendance: '0%',
          attendanceRatio: '0 / 1',
          attendanceFull: false
        },
        {
          id: 4,
          topic: 'SQL Functions & Data Cleaning',
          date: 'WEEK 2',
          day: '(Class 4)',
          course: 'SQL',
          courseType: 'python',
          assignment: '0 / 1',
          assignmentCompleted: false,
          additionalProblem: '0 / 0',
          lectureAttendance: '0%',
          attendanceRatio: '0 / 1',
          attendanceFull: false
        },
        {
          id: 5,
          topic: 'Aggregate Functions & GROUP BY',
          date: 'WEEK 2',
          day: '(Class 5)',
          course: 'SQL',
          courseType: 'python',
          assignment: '0 / 1',
          assignmentCompleted: false,
          additionalProblem: '0 / 0',
          lectureAttendance: '0%',
          attendanceRatio: '0 / 1',
          attendanceFull: false
        },
        {
          id: 6,
          topic: 'Date Functions & Business Analysis',
          date: 'WEEK 2',
          day: '(Class 6)',
          course: 'SQL',
          courseType: 'python',
          assignment: '0 / 1',
          assignmentCompleted: false,
          additionalProblem: '0 / 0',
          lectureAttendance: '0%',
          attendanceRatio: '0 / 1',
          attendanceFull: false
        },
        {
          id: 7,
          topic: 'Subqueries & Nested Queries',
          date: 'WEEK 3',
          day: '(Class 7)',
          course: 'SQL',
          courseType: 'python',
          assignment: '0 / 1',
          assignmentCompleted: false,
          additionalProblem: '0 / 0',
          lectureAttendance: '0%',
          attendanceRatio: '0 / 1',
          attendanceFull: false
        },
        {
          id: 8,
          topic: 'SQL Joins — Combining Multiple Tables',
          date: 'WEEK 3',
          day: '(Class 8)',
          course: 'SQL',
          courseType: 'python',
          assignment: '0 / 1',
          assignmentCompleted: false,
          additionalProblem: '0 / 0',
          lectureAttendance: '0%',
          attendanceRatio: '0 / 1',
          attendanceFull: false
        },
        {
          id: 9,
          topic: 'Advanced Joins & Set Operations',
          date: 'WEEK 3',
          day: '(Class 9)',
          course: 'SQL',
          courseType: 'python',
          assignment: '0 / 1',
          assignmentCompleted: false,
          additionalProblem: '0 / 0',
          lectureAttendance: '0%',
          attendanceRatio: '0 / 1',
          attendanceFull: false
        },
        {
          id: 10,
          topic: 'Window Functions, CTEs & Views',
          date: 'WEEK 4',
          day: '(Class 10)',
          course: 'SQL',
          courseType: 'python',
          assignment: '0 / 1',
          assignmentCompleted: false,
          additionalProblem: '0 / 0',
          lectureAttendance: '0%',
          attendanceRatio: '0 / 1',
          attendanceFull: false
        },
        {
          id: 11,
          topic: 'SQL Minor Project — Business Case Study',
          date: 'WEEK 4',
          day: '(Class 11)',
          course: 'SQL',
          courseType: 'ml',
          assignment: '0 / 1',
          assignmentCompleted: false,
          additionalProblem: '0 / 0',
          lectureAttendance: '0%',
          attendanceRatio: '0 / 1',
          attendanceFull: false
        },
        {
          id: 12,
          topic: 'GenAI with SQL — Learn, Debug & Analyze',
          date: 'WEEK 4',
          day: '(Class 12)',
          course: 'SQL',
          courseType: 'python',
          assignment: '0 / 1',
          assignmentCompleted: false,
          additionalProblem: '0 / 0',
          lectureAttendance: '0%',
          attendanceRatio: '0 / 1',
          attendanceFull: false
        }
      ]
    },
    {
      id: 2,
      title: 'Module 2: Excel & Google Sheets',
      progressText: '2 / 6 completed · 12 Hours',
      percent: 33,
      status: 'in-progress',
      dayWiseClasses: excelDayWiseClasses,
      classes: [
        {
          id: 1,
          topic: 'Spreadsheet Fundamentals & Essential Formulas',
          date: 'DAY 01, 15 OCT',
          day: '(Wed)',
          course: 'Excel & Sheets',
          courseType: 'python',
          assignment: '1 / 1',
          assignmentCompleted: true,
          additionalProblem: '0 / 0',
          lectureAttendance: '100%',
          attendanceRatio: '1 / 1',
          attendanceFull: true
        },
        {
          id: 2,
          topic: 'Data Cleaning, Lookup & Advanced Formulas',
          date: 'DAY 02, 17 OCT',
          day: '(Fri)',
          course: 'Excel & Sheets',
          courseType: 'python',
          assignment: '1 / 1',
          assignmentCompleted: true,
          additionalProblem: '0 / 0',
          lectureAttendance: '100%',
          attendanceRatio: '1 / 1',
          attendanceFull: true
        },
        {
          id: 3,
          topic: 'Data Analysis with Pivot Tables & Charts',
          date: 'DAY 03, TODAY',
          day: '(Mon)',
          isToday: true,
          course: 'Excel & Sheets',
          courseType: 'python',
          assignment: '0 / 1',
          assignmentCompleted: false,
          additionalProblem: '0 / 0',
          lectureAttendance: '0%',
          attendanceRatio: '0 / 1',
          attendanceFull: false
        },
        {
          id: 4,
          topic: 'Interactive Dashboards & Business Insights',
          date: 'DAY 04, 22 OCT',
          day: '(Wed)',
          course: 'Excel & Sheets',
          courseType: 'python',
          assignment: '0 / 1',
          assignmentCompleted: false,
          additionalProblem: '0 / 0',
          lectureAttendance: '0%',
          attendanceRatio: '0 / 1',
          attendanceFull: false
        },
        {
          id: 5,
          topic: 'Minor Project: Coffee Chain Business Analysis',
          date: 'DAY 05, 24 OCT',
          day: '(Fri)',
          course: 'Business Project',
          courseType: 'ml',
          assignment: '0 / 1',
          assignmentCompleted: false,
          additionalProblem: '0 / 0',
          lectureAttendance: '0%',
          attendanceRatio: '0 / 1',
          attendanceFull: false
        },
        {
          id: 6,
          topic: 'GenAI + Excel: Work Smarter with AI',
          date: 'DAY 06, 27 OCT',
          day: '(Mon)',
          course: 'GenAI + Excel',
          courseType: 'python',
          assignment: '0 / 1',
          assignmentCompleted: false,
          additionalProblem: '0 / 0',
          lectureAttendance: '0%',
          attendanceRatio: '0 / 1',
          attendanceFull: false
        }
      ]
    },
    {
      id: 3,
      title: 'Module 3: Data Manipulation',
      progressText: '2 / 5 completed',
      percent: 40,
      status: 'in-progress',
      classes: [
        {
          id: 1,
          topic: 'Pandas Series, DataFrames & Indexing Mastery',
          date: 'DAY 103, 20 NOV',
          day: '(Fri)',
          course: 'Python',
          courseType: 'python',
          assignment: '1 / 1',
          assignmentCompleted: true,
          additionalProblem: '0 / 0',
          lectureAttendance: '100%',
          attendanceRatio: '1 / 1',
          attendanceFull: true
        },
        {
          id: 2,
          topic: 'Vectorized Operations & Lambda Transforms',
          date: 'DAY 104, 23 NOV',
          day: '(Mon)',
          course: 'Python',
          courseType: 'python',
          assignment: '1 / 1',
          assignmentCompleted: true,
          additionalProblem: '0 / 0',
          lectureAttendance: '100%',
          attendanceRatio: '1 / 1',
          attendanceFull: true
        },
        {
          id: 3,
          topic: 'Data Cleaning: Missing Values & Outliers',
          date: 'DAY 105, 25 NOV',
          day: '(Wed)',
          course: 'Python',
          courseType: 'python',
          assignment: '0 / 1',
          assignmentCompleted: false,
          additionalProblem: '0 / 0',
          lectureAttendance: '0%',
          attendanceRatio: '0 / 1',
          attendanceFull: false
        }
      ]
    },
    {
      id: 4,
      title: 'Module 4: Data Visualization',
      progressText: '0 / 5 completed',
      percent: 0,
      status: 'locked',
      classes: []
    },
    {
      id: 5,
      title: 'Module 5: Real World Project',
      progressText: '0 / 4 completed',
      percent: 0,
      status: 'locked',
      classes: []
    },
    {
      id: 6,
      title: 'Module 6: Machine Learning with Python',
      progressText: '0 / 6 completed',
      percent: 0,
      status: 'locked',
      classes: []
    },
    {
      id: 7,
      title: 'Module 7: Advanced Analytics',
      progressText: '0 / 5 completed',
      percent: 0,
      status: 'locked',
      classes: []
    },
    {
      id: 8,
      title: 'Module 8: Capstone Project',
      progressText: '0 / 5 completed',
      percent: 0,
      status: 'locked',
      classes: []
    },
    {
      id: 9,
      title: 'Supplementary Resources',
      progressText: '0 resources',
      percent: 0,
      status: 'resources',
      classes: []
    }
  ];

  // Active selected module object
  // New student: nothing attended, submitted or completed yet.
  const totalModules = curriculumModules.length;
  const firstModule = curriculumModules[0];
  const progress = { attendancePct: 0, assignmentPct: 0, modulesDone: 0, modulesPct: 0, points: 0 };

  const activeModule = curriculumModules.find(m => m.id === selectedModuleId) || curriculumModules[0];

  // Filtered classes according to search query (for table view)
  const filteredClasses = activeModule.classes.filter(c => 
    c.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.date.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filtered Day-wise classes according to search query and status filter (for cards roadmap)
  const filteredDayWiseClasses = (activeModule.dayWiseClasses || []).filter(c => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q ||
      c.title.toLowerCase().includes(q) ||
      c.dayNumber.toLowerCase().includes(q) ||
      c.shortDescription.toLowerCase().includes(q) ||
      c.topics.some(t => t.toLowerCase().includes(q)) ||
      c.learningOutcome.toLowerCase().includes(q);

    const matchesStatus = cardStatusFilter === 'all' || c.status === cardStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#060B14] text-white flex flex-col lg:flex-row font-sans selection:bg-[#2563EB]/40 selection:text-white">
      
      {/* ========================================================
          1. SLIDABLE LEFT SIDEBAR (Desktop Animated Spring Slide)
         ======================================================== */}
      
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-[#0A1120] border-b border-[#1A263D] sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <motion.div 
            whileHover={{ rotate: 12, scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/30 cursor-pointer"
          >
            <Rocket className="w-4 h-4" />
          </motion.div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight">
              <span>Code</span><span className="text-[#A855F7]">My</span><span>Way</span>
            </h1>
            <p className="text-[10px] text-[#64748B]">Learn · Build · Grow</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onRouteChange('home')}
            className="p-2 text-[#94A3B8] hover:text-white rounded-lg hover:bg-[#152136] transition-colors"
            title="Back to CodeMyWay Website"
          >
            <Home className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-[#94A3B8] hover:text-white rounded-lg hover:bg-[#152136] transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Slide in/out from left) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
            />

            {/* Sliding Mobile Drawer */}
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="relative w-72 bg-[#070D1B] border-r border-[#152136] flex flex-col justify-between p-4 z-50 h-full shadow-2xl"
            >
              <div>
                <div className="flex items-center justify-between pb-5 mb-4 border-b border-[#152136]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md">
                      <Rocket className="w-4 h-4" />
                    </div>
                    <div>
                      <h1 className="text-sm font-bold text-white">
                        <span>Code</span><span className="text-[#A855F7]">My</span><span>Way</span>
                      </h1>
                      <p className="text-[10px] text-[#64748B]">Learn · Build · Grow</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1.5 text-[#94A3B8] hover:text-white rounded-lg hover:bg-[#152136]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {sidebarItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeNav === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveNav(item.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                          isActive
                            ? 'bg-[#2563EB] text-white font-semibold shadow-md shadow-blue-600/30'
                            : 'text-[#94A3B8] hover:text-white hover:bg-[#0E1729]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Mobile Drawer Footer */}
              <div className="pt-4 border-t border-[#152136]">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onRouteChange('home');
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#0D1527] border border-[#1E293B] text-xs font-semibold text-[#CBD5E1]"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Back to CodeMyWay Website</span>
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Desktop Collapsible Slide Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 256 : 76 }}
        transition={{ type: "spring", stiffness: 350, damping: 32 }}
        className="hidden lg:flex bg-[#070D1B] border-r border-[#152136] flex-col justify-between p-3.5 shrink-0 z-30 overflow-hidden select-none"
      >
        {/* Top: Brand Logo & Slide Toggle Controls */}
        <div>
          <div className={`flex items-center pb-5 mb-4 border-b border-[#152136]/60 transition-all ${
            isSidebarOpen ? 'justify-between' : 'flex-col gap-3 justify-center'
          }`}>
            <div 
              onClick={() => onRouteChange('home')}
              className={`flex items-center gap-2.5 cursor-pointer group min-w-0 ${
                isSidebarOpen ? '' : 'justify-center'
              }`}
              title="Return to CodeMyWay Home"
            >
              <motion.div 
                whileHover={{ rotate: 15, scale: 1.12 }}
                whileTap={{ scale: 0.92 }}
                className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 shrink-0"
              >
                <Rocket className="w-4 h-4 group-hover:animate-pulse" />
              </motion.div>

              {isSidebarOpen && (
                <div className="min-w-0 overflow-hidden">
                  <h1 className="text-sm font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors truncate">
                    <span>Code</span><span className="text-[#A855F7] group-hover:text-purple-300 transition-colors">My</span><span>Way</span>
                  </h1>
                  <p className="text-[10px] text-[#64748B] tracking-wide truncate">
                    Learn · Build · Grow
                  </p>
                </div>
              )}
            </div>

            <div className={`flex items-center gap-1 shrink-0 ${isSidebarOpen ? '' : 'flex-col'}`}>
              {isSidebarOpen && (
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onRouteChange('home')}
                  className="p-1.5 text-[#64748B] hover:text-white rounded-lg hover:bg-[#152136] transition-colors cursor-pointer"
                  title="Back to CodeMyWay Website"
                >
                  <Home className="w-3.5 h-3.5" />
                </motion.button>
              )}

              {/* Slide Open / Close Button */}
              <motion.button 
                whileHover={{ scale: 1.1, backgroundColor: '#152136' }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-1.5 text-[#94A3B8] hover:text-white rounded-lg transition-colors cursor-pointer"
                title={isSidebarOpen ? "Slide Close Sidebar" : "Slide Open Sidebar"}
              >
                {isSidebarOpen ? (
                  <PanelLeftClose className="w-4 h-4 text-[#94A3B8]" />
                ) : (
                  <PanelLeftOpen className="w-4 h-4 text-blue-400" />
                )}
              </motion.button>
            </div>
          </div>

          {/* Navigation Items List */}
          <nav className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <motion.button
                  key={item.id}
                  whileHover={{ x: isSidebarOpen ? 4 : 0, scale: isSidebarOpen ? 1 : 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setActiveNav(item.id)}
                  title={!isSidebarOpen ? item.label : undefined}
                  className={`w-full flex items-center rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer relative group ${
                    isSidebarOpen ? 'gap-3 px-3.5 py-2.5 justify-start' : 'p-2.5 justify-center'
                  } ${
                    isActive
                      ? 'bg-[#2563EB] text-white font-semibold shadow-md shadow-blue-600/30'
                      : 'text-[#94A3B8] hover:text-white hover:bg-[#0E1729]'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'text-white' : 'text-[#64748B] group-hover:text-white'}`} />
                  
                  {isSidebarOpen ? (
                    <span className="truncate">{item.label}</span>
                  ) : (
                    /* Floating Tooltip when sidebar is collapsed */
                    <span className="absolute left-full ml-3 px-2.5 py-1 bg-[#0F172A] border border-[#1E293B] text-white text-[11px] font-semibold rounded-md shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                      {item.label}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Card: Motivational Mountain Card */}
        {isSidebarOpen ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 pt-3"
          >
            <div className="rounded-2xl bg-[#0B1324] border border-[#1A263D] overflow-hidden relative shadow-lg hover:border-[#2563EB]/40 transition-colors duration-300">
              <div className="p-3.5 pb-2 relative z-10">
                <div className="flex items-center gap-1.5 text-xs text-[#38BDF8] mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#38BDF8] animate-pulse" />
                </div>
                <p className="text-xs font-semibold text-white leading-snug mb-2.5">
                  Small steps every day lead to big results. 🚀
                </p>

                {/* Progress Bar with smooth initial fill */}
                <div className="w-full bg-[#152138] h-1.5 rounded-full overflow-hidden mb-1.5">
                  <div className="bg-gradient-to-r from-emerald-400 to-sky-400 h-full w-[0%] rounded-full shadow-[0_0_8px_rgba(56,189,248,0.5)]" />
                </div>

                <p className="text-[10px] text-[#94A3B8]">
                  Let's begin, {studentName}!
                </p>
              </div>

              {/* Aesthetic SVG Mountain Landscape with Sunset */}
              <div className="w-full h-16 -mt-2 overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="sky" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#0B1324" />
                      <stop offset="100%" stopColor="#1E293B" />
                    </linearGradient>
                    <radialGradient id="sun" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.9" />
                      <stop offset="60%" stopColor="#D97706" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#0B1324" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <rect width="200" height="80" fill="url(#sky)" />
                  <circle cx="100" cy="50" r="18" fill="url(#sun)" className="animate-pulse-glow" />
                  <circle cx="100" cy="50" r="10" fill="#FDE68A" />
                  <path d="M-10 80 L35 45 L85 68 L145 38 L210 80 Z" fill="#1E293B" opacity="0.65" />
                  <path d="M15 80 L65 52 L115 72 L165 48 L220 80 Z" fill="#0F172A" opacity="0.9" />
                  <path d="M-20 80 L55 62 L95 78 L140 58 L230 80 Z" fill="#060A14" />
                </svg>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Mini Collapsed Indicator */
          <div 
            onClick={() => setIsSidebarOpen(true)}
            className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#0B1324] border border-[#1A263D] hover:border-blue-500/40 cursor-pointer transition-colors"
            title="Expand Sidebar (Progress: 0%)"
          >
            <Sparkles className="w-4 h-4 text-[#38BDF8] mb-1 animate-pulse" />
            <span className="text-[10px] font-bold text-white font-mono">0%</span>
          </div>
        )}
      </motion.aside>

      {/* ========================================================
          2. MAIN CONTENT AREA
         ======================================================== */}
      <div className="flex-1 flex flex-col overflow-x-hidden min-h-screen">
        
        {/* ======================================================
            A. CORE CURRICULUM VIEW (Scaler-Style Layout)
           ====================================================== */}
        {activeNav === 'curriculum' ? (
          <CoreCurriculumView 
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            isSidebarOpen={isSidebarOpen}
            onOpenSupportModal={() => setActiveModalMessage('Connecting you to your dedicated 1:1 CodeMyWay Mentor & Academic Support Team...')}
          />
        ) : activeNav === 'projects' ? (
          <BusinessProjectsView
            studentEmail={currentUser?.email}
            studentName={studentName}
            onOpenSupportModal={() => setActiveModalMessage('Connecting you to your dedicated 1:1 Project Mentor & Review Committee...')}
          />
        ) : activeNav === 'mentor' ? (
          <StudentMentorView
            studentEmail={currentUser?.email}
            studentName={studentName}
          />
        ) : activeNav === 'personal' ? (
          <PersonalDetailsView
            studentEmail={currentUser?.email}
            studentName={currentUser?.fullName}
            studentMobile={currentUser?.mobile}
          />
        ) : (
          /* ======================================================
              B. OVERVIEW DASHBOARD VIEW (Screenshot 1)
             ====================================================== */
          <div className="flex-1 flex flex-col xl:flex-row overflow-x-hidden">
            
            {/* Center Column */}
            <main className="flex-1 p-4 sm:p-6 lg:p-7 space-y-6">
              
              {/* Welcome Header with Sidebar Toggle shortcut */}
              <motion.div 
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  {/* Desktop Sidebar Slide Toggle */}
                  <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="hidden lg:flex p-2 text-[#94A3B8] hover:text-white rounded-xl hover:bg-[#101A2E] border border-[#1A263D] transition-colors cursor-pointer shrink-0"
                    title={isSidebarOpen ? "Slide Close Sidebar" : "Slide Open Sidebar"}
                  >
                    {isSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4 text-blue-400" />}
                  </button>

                  <motion.div 
                    whileHover={{ scale: 1.08 }}
                    className="w-12 h-12 rounded-full bg-[#1E293B] border border-[#334155] flex items-center justify-center text-[#94A3B8] shadow-inner shrink-0 cursor-pointer"
                  >
                    <User className="w-6 h-6 text-[#CBD5E1]" />
                  </motion.div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center">
                      <span>{isFirstVisit ? `Welcome to CodeMyWay, ${studentName}!` : `Welcome back, ${studentName}!`}</span>
                      <span className="animate-wave ml-2 text-2xl">👋</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-[#94A3B8] mt-0.5">
                      {isFirstVisit
                        ? "Your learning journey starts here. Begin with Module 1 below."
                        : 'Keep learning, keep building, your future is in your hands.'}
                    </p>
                  </div>
                </div>

                {/* Current Date Badge */}
                <motion.div 
                  whileHover={{ scale: 1.03 }}
                  className="flex items-center gap-2 text-xs font-medium text-[#94A3B8] bg-[#0A1120] px-3.5 py-1.5 rounded-xl border border-[#1A263D] hover:border-[#38BDF8]/40 transition-colors self-start sm:self-center shrink-0 cursor-default"
                >
                  <span>{todayLabel}</span>
                  <Calendar className="w-3.5 h-3.5 text-[#64748B]" />
                </motion.div>
              </motion.div>

              {/* Top 3 Metric Summary Cards Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Metric 1: Total Attendance */}
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 }}
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  className="bg-[#0A1120] rounded-2xl p-5 border border-[#1A263D] hover:border-emerald-500/40 shadow-sm transition-all duration-300 flex flex-col justify-between relative overflow-hidden group cursor-default"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs text-[#94A3B8] font-medium block">Total Attendance</span>
                      <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{progress.attendancePct}%</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="w-full bg-[#152138] h-2 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress.attendancePct}%` }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                        className="bg-emerald-400 h-full rounded-full shadow-[0_0_8px_rgba(52,211,153,0.5)]" 
                      />
                    </div>
                    <div className="text-[11px] text-[#64748B]">No classes attended yet</div>
                  </div>
                </motion.div>

                {/* Metric 2: Assignment / Problem Solve */}
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  className="bg-[#0A1120] rounded-2xl p-5 border border-[#1A263D] hover:border-blue-500/40 shadow-sm transition-all duration-300 flex flex-col justify-between relative overflow-hidden group cursor-default"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 group-hover:scale-105 transition-transform">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs text-[#94A3B8] font-medium block">Assignment / Problem Solve</span>
                      <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{progress.assignmentPct}%</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="w-full bg-[#152138] h-2 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress.assignmentPct}%` }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                        className="bg-sky-400 h-full rounded-full shadow-[0_0_8px_rgba(56,189,248,0.5)]" 
                      />
                    </div>
                    <div className="text-[11px] text-[#64748B]">No assignments submitted yet</div>
                  </div>
                </motion.div>

                {/* Metric 3: Next Class / Session */}
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.25 }}
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                  onClick={() => setActiveModalMessage('Your class schedule will appear here once your batch timetable is published.')}
                  className="bg-[#0A1120] rounded-2xl p-5 border border-[#1A263D] hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] shadow-sm flex items-center justify-between transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 mt-0.5 group-hover:rotate-12 transition-transform duration-300">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs text-[#94A3B8] font-medium block">Next Class / Session</span>
                      <span className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                        Not scheduled
                      </span>
                      <p className="text-xs font-semibold text-[#CBD5E1] mt-1 group-hover:text-purple-300 transition-colors">
                        Your first class will show here
                      </p>
                      <p className="text-[10px] text-[#64748B]">Batch timetable coming soon</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#64748B] group-hover:text-white group-hover:translate-x-1.5 transition-all shrink-0 ml-2" />
                </motion.div>

              </div>

              {/* Secondary Horizontal Navigation Bar */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {secondaryTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeNav === tab.id || (activeNav === 'dashboard' && tab.id === 'curriculum');
                  return (
                    <motion.button
                      key={tab.id}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setActiveNav(tab.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                        isActive
                          ? 'bg-[#2563EB] text-white shadow-md shadow-blue-600/30 border border-blue-400/40'
                          : 'bg-[#0A1120] hover:bg-[#121B30] text-[#94A3B8] hover:text-white border border-[#1A263D]'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </motion.button>
                  );
                })}
                <motion.button 
                  whileHover={{ scale: 1.06, rotate: 10 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setActiveNav('leaderboard')}
                  className={`p-2 rounded-xl border transition-colors shrink-0 cursor-pointer ${
                    activeNav === 'leaderboard'
                      ? 'bg-[#2563EB] text-white border-blue-400/40'
                      : 'bg-[#0A1120] hover:bg-[#121B30] text-[#F59E0B] border-[#1A263D]'
                  }`}
                  title="View Leaderboard"
                >
                  <Trophy className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Main Core Curriculum Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-[#0A1120] rounded-2xl border border-[#1A263D] hover:border-[#1E293B] p-5 sm:p-6 shadow-sm transition-all duration-300"
              >
                
                {/* Card Header */}
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#1A263D]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400 shrink-0">
                      <Target className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight">Core Curriculum</h3>
                      <p className="text-xs text-[#64748B]">Your classes and learning modules</p>
                    </div>
                  </div>
                  <motion.button 
                    whileHover={{ x: 2 }}
                    onClick={() => setActiveNav('curriculum')}
                    className="text-xs font-semibold text-[#38BDF8] hover:text-sky-300 flex items-center gap-1 transition-colors cursor-pointer group"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </div>

                {/* Inner Top 2-Column Boxes: Next Class & Your Progress */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  
                  {/* Box 1: Next Class */}
                  <div className="bg-[#0D1527] rounded-xl p-4 border border-[#1E293B] flex flex-col justify-between hover:border-blue-500/30 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium text-[#94A3B8]">Start Here</span>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        Get Started
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0"
                      >
                        <Laptop className="w-6 h-6" />
                      </motion.div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{firstModule.title}</h4>
                        <p className="text-xs text-[#94A3B8]">Your first module</p>
                        <p className="text-[11px] text-[#64748B] mt-0.5">{firstModule.progressText.split('·').slice(1).join('·').trim() || 'Self-paced'}</p>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedModuleId(firstModule.id);
                        setActiveNav('curriculum');
                      }}
                      className="w-full py-2 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs rounded-lg shadow-md shadow-blue-600/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer group"
                    >
                      <Play className="w-3.5 h-3.5 fill-current group-hover:scale-110 transition-transform" />
                      <span>Start Module 1</span>
                    </motion.button>
                  </div>

                  {/* Box 2: Your Progress */}
                  <div className="bg-[#0D1527] rounded-xl p-4 border border-[#1E293B] flex flex-col justify-between hover:border-cyan-500/30 transition-colors">
                    <div className="mb-3">
                      <span className="text-xs font-medium text-[#94A3B8]">Your Progress</span>
                    </div>

                    <div className="flex items-center gap-4 my-auto">
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center shrink-0">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                          <path
                            className="text-[#1A263D]"
                            strokeWidth="3.5"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <motion.path
                            initial={{ strokeDasharray: "0, 100" }}
                            animate={{ strokeDasharray: `${progress.modulesPct}, 100` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="text-cyan-400"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                        <span className="absolute text-sm sm:text-base font-extrabold text-white">{progress.modulesPct}%</span>
                      </div>

                      <div className="flex-1 space-y-1.5">
                        <div className="text-xs text-[#94A3B8]">Modules Completed</div>
                        <div className="text-base sm:text-lg font-bold text-white font-mono">{progress.modulesDone} / {totalModules}</div>
                        <div className="w-full bg-[#152138] h-2 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${progress.modulesPct}%` }}
                            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                            className="bg-sky-400 h-full rounded-full shadow-[0_0_8px_rgba(56,189,248,0.5)]" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Modules Timeline Preview */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs sm:text-sm font-bold text-white">Modules</h4>
                    <button 
                      onClick={() => setActiveNav('curriculum')}
                      className="text-[11px] text-[#38BDF8] hover:underline cursor-pointer"
                    >
                      Open Full Curriculum Explorer →
                    </button>
                  </div>
                  <div className="space-y-3">
                    {curriculumModules.slice(0, 5).map((mod, index) => (
                      <motion.div
                        key={mod.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                        whileHover={{ x: 4, transition: { duration: 0.15 } }}
                        onClick={() => {
                          setSelectedModuleId(mod.id);
                          setActiveNav('curriculum');
                        }}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                          index === 0
                            ? 'bg-[#0F1B33] border-blue-500/50 shadow-md shadow-blue-500/10'
                            : 'bg-[#0D1527]/40 border-[#1E293B]/40 opacity-70 hover:opacity-90'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {index === 0 ? (
                            <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                              <Play className="w-3 h-3 fill-current" />
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-[#152138] text-[#64748B] flex items-center justify-center shrink-0">
                              <Lock className="w-3 h-3" />
                            </div>
                          )}
                          <div>
                            <h5 className={`text-xs sm:text-sm font-semibold ${index === 0 ? 'text-white font-bold' : 'text-white'}`}>
                              {mod.title}
                            </h5>
                            <p className="text-[11px] text-[#64748B]">{index === 0 ? 'Not started' : 'Unlocks after the previous module'}</p>
                          </div>
                        </div>

                        {index === 0 ? (
                          <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5 shrink-0 ml-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                            <span>Start here</span>
                          </span>
                        ) : (
                          <span className="text-xs text-[#64748B] flex items-center gap-1 shrink-0 ml-2">
                            <Lock className="w-3 h-3" />
                            <span>Locked</span>
                          </span>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>

              </motion.div>

            </main>

            {/* Right Sidebar / Panel */}
            <aside className="w-full xl:w-80 bg-[#070D1B] border-t xl:border-t-0 xl:border-l border-[#152136] p-4 sm:p-6 space-y-5 shrink-0">
              
              {/* Top User & Notification Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-[#152136]">
                <motion.button 
                  whileHover={{ rotate: [0, -12, 12, -8, 8, 0], scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveModalMessage('No new notifications yet. Welcome to CodeMyWay!')}
                  className="relative p-2 text-[#94A3B8] hover:text-white rounded-xl hover:bg-[#101A2E] transition-colors cursor-pointer"
                >
                  <Bell className="w-5 h-5" />
                                  </motion.button>

                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 border border-purple-500/30 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-md shadow-purple-600/20">
                    {studentInitial}
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-white">{studentName}</div>
                    <div className="text-[10px] text-emerald-400 font-mono">Enrolled</div>
                  </div>
                  <button
                    onClick={() => onLogout ? onLogout() : onRouteChange('login')}
                    title="Log Out of Student Dashboard"
                    className="p-1.5 text-[#94A3B8] hover:text-rose-400 rounded-lg hover:bg-[#152138] transition-colors ml-1 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Motivational Quote Box */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="p-3.5 rounded-xl bg-[#0A1120] border border-[#1A263D] hover:border-rose-500/30 flex items-start gap-2.5 transition-colors cursor-default"
              >
                <Target className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <p className="text-xs italic text-[#CBD5E1] leading-relaxed">
                  "Discipline today builds the freedom of tomorrow."
                </p>
              </motion.div>

              {/* Quick Reminders Card */}
              <div className="bg-[#0A1120] rounded-2xl p-4 border border-[#1A263D] shadow-sm space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Quick Reminders</h4>
                
                <div className="space-y-2.5">
                  <motion.div
                    whileHover={{ x: 3 }}
                    onClick={() => setActiveNav('personal')}
                    className="flex items-center gap-2.5 text-xs text-[#CBD5E1] hover:text-white cursor-pointer group"
                  >
                    <div className="w-6 h-6 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <span className="group-hover:underline">Complete your profile</span>
                  </motion.div>

                  <motion.div
                    whileHover={{ x: 3 }}
                    onClick={() => { setSelectedModuleId(firstModule.id); setActiveNav('curriculum'); }}
                    className="flex items-center gap-2.5 text-xs text-[#CBD5E1] hover:text-white cursor-pointer group"
                  >
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
                      <BookOpen className="w-3.5 h-3.5" />
                    </div>
                    <span className="group-hover:underline">Start Module 1</span>
                  </motion.div>

                  <motion.div
                    whileHover={{ x: 3 }}
                    onClick={() => setActiveNav('mentor')}
                    className="flex items-center gap-2.5 text-xs text-[#CBD5E1] hover:text-white cursor-pointer group"
                  >
                    <div className="w-6 h-6 rounded-lg bg-rose-500/15 text-rose-400 flex items-center justify-center shrink-0">
                      <Users className="w-3.5 h-3.5" />
                    </div>
                    <span className="group-hover:underline">Meet your mentor</span>
                  </motion.div>
                </div>
              </div>

              {/* Upcoming Classes & Sessions */}
              <div className="bg-[#0A1120] rounded-2xl p-4 border border-[#1A263D] shadow-sm space-y-3.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">Upcoming Classes & Sessions</h4>
                  <button 
                    onClick={() => setActiveModalMessage('Showing all scheduled live cohort sessions for the next 14 days.')}
                    className="text-[11px] font-semibold text-[#38BDF8] hover:underline cursor-pointer"
                  >
                    View All →
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-[#0D1527] border border-dashed border-[#1E293B] text-center space-y-2">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center mx-auto">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <h5 className="text-xs font-bold text-white">No upcoming sessions yet</h5>
                  <p className="text-[10px] text-[#64748B] leading-relaxed">
                    Live classes and mentor sessions will appear here once your batch schedule is published.
                  </p>
                </div>
              </div>

              {/* Quick Access Grid */}
              <div className="bg-[#0A1120] rounded-2xl p-4 border border-[#1A263D] shadow-sm space-y-3">
                <h4 className="text-xs font-bold text-white">Quick Access</h4>
                <div className="grid grid-cols-2 gap-2">
                  <motion.button 
                    whileHover={{ y: -2, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setActiveModalMessage('Opening Cohort Academic Calendar...')}
                    className="p-3 rounded-xl bg-[#0D1527] border border-[#1E293B] hover:border-blue-500/50 text-left transition-all group cursor-pointer"
                  >
                    <Calendar className="w-4 h-4 text-blue-400 mb-1.5 group-hover:scale-110 transition-transform" />
                    <span className="text-[11px] font-semibold text-white block">View Calendar</span>
                  </motion.button>

                  <motion.button 
                    whileHover={{ y: -2, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setActiveModalMessage('Downloading Phase Resources & Datasets archive (.zip)...')}
                    className="p-3 rounded-xl bg-[#0D1527] border border-[#1E293B] hover:border-purple-500/50 text-left transition-all group cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-purple-400 mb-1.5 group-hover:scale-110 transition-transform" />
                    <span className="text-[11px] font-semibold text-white block">Download Resources</span>
                  </motion.button>

                  <motion.button 
                    whileHover={{ y: -2, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setActiveModalMessage('Mentor chat window opened. Send your queries directly.')}
                    className="p-3 rounded-xl bg-[#0D1527] border border-[#1E293B] hover:border-emerald-500/50 text-left transition-all group cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-400 mb-1.5 group-hover:scale-110 transition-transform" />
                    <span className="text-[11px] font-semibold text-white block">Ask Mentor</span>
                  </motion.button>

                  <motion.button 
                    whileHover={{ y: -2, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setActiveModalMessage('24/7 Academic Support Desk is ready to assist you.')}
                    className="p-3 rounded-xl bg-[#0D1527] border border-[#1E293B] hover:border-amber-500/50 text-left transition-all group cursor-pointer"
                  >
                    <Headphones className="w-4 h-4 text-amber-400 mb-1.5 group-hover:scale-110 transition-transform" />
                    <span className="text-[11px] font-semibold text-white block">Support / Help</span>
                  </motion.button>
                </div>
              </div>

              {/* Leaderboard Position Card */}
              <motion.div 
                whileHover={{ y: -2 }}
                className="bg-[#0A1120] rounded-2xl p-4 border border-[#1A263D] hover:border-[#F59E0B]/30 shadow-sm space-y-3 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                    <Trophy className="w-4 h-4 text-[#F59E0B] animate-pulse" />
                    <span>Your Leaderboard Position</span>
                  </div>
                  <button 
                    onClick={() => setActiveNav('leaderboard')}
                    className="text-[11px] font-semibold text-[#38BDF8] hover:underline cursor-pointer"
                  >
                    View All →
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-[#1A263D]"
                        strokeWidth="3"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <motion.path
                        initial={{ strokeDasharray: "0, 100" }}
                        animate={{ strokeDasharray: "0, 100" }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="text-[#F59E0B]"
                        strokeWidth="3"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className="absolute text-sm font-extrabold text-white">--</span>
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="text-xs font-semibold text-white">Not ranked yet</div>
                    <div className="text-[10px] text-[#94A3B8]">Submit your first assignment to join the board.</div>
                    <div className="w-full bg-[#152138] h-1.5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(progress.points / 1000) * 100}%` }}
                        transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                        className="bg-blue-500 h-full rounded-full shadow-[0_0_8px_rgba(37,99,235,0.5)]" 
                      />
                    </div>
                    <div className="text-[10px] text-[#64748B] text-right font-mono">{progress.points} / 1,000 pts</div>
                  </div>
                </div>
              </motion.div>

            </aside>

          </div>
        )}

      </div>

      {/* Quick Action Notification Toast Modal */}
      <AnimatePresence>
        {activeModalMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <div className="bg-[#0D172A] border border-blue-500/50 p-4 rounded-xl shadow-2xl shadow-blue-900/40 text-white flex items-center gap-3 max-w-sm backdrop-blur-md">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <p className="text-xs text-[#CBD5E1] flex-1">{activeModalMessage}</p>
              <button
                onClick={() => setActiveModalMessage(null)}
                className="p-1 text-[#94A3B8] hover:text-white rounded transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
