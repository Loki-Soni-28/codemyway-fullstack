import React, { useState, useEffect } from 'react';
import { api } from '../../api';
import { 
  BookOpen, 
  Play, 
  Check, 
  CheckCircle2, 
  Clock, 
  Flame, 
  Bell, 
  Award, 
  Trophy, 
  Code2, 
  ChevronRight, 
  ChevronLeft, 
  ChevronDown,
  FileText, 
  Sparkles, 
  Star, 
  MessageSquare, 
  HelpCircle, 
  Bookmark, 
  Copy, 
  RotateCcw, 
  ExternalLink,
  Info,
  Calendar,
  Layers,
  ArrowRight,
  ArrowLeft,
  X,
  Send,
  Video,
  Download,
  CheckCircle,
  Headphones,
  Laptop,
  GraduationCap,
  ShieldCheck,
  FileSpreadsheet,
  PieChart,
  BarChart3,
  BrainCircuit,
  Briefcase,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface CurriculumProblem {
  id: string;
  qNumber: number;
  title: string;
  type: 'code' | 'mcq';
  difficulty: 'Very Easy' | 'Easy' | 'Medium' | 'Hard';
  score: string;
  status: 'Solved' | 'Unsolved' | 'Attempted';
  submissions: number;
  askedIn?: string;
  solvedBy: number;
  description: string;
  solutionSnippet?: string;
  options?: string[];
  myAnswer?: string | null;
  isCorrect?: boolean | null;
  correctAnswer?: string;
}

export interface CurriculumClassItem {
  id: string;
  dayNumber: string;
  title: string;
  dateFormatted: string;
  time: string;
  mandatory: boolean;
  status: 'completed' | 'in-progress' | 'upcoming';
  lecturePercent: string;
  assignmentCount: string;
  additionalProblemsCount: string;
  masteryMode?: string;
  attendance: string;
  problemsSolved: string;
  recordingDuration?: string;
  preRead: {
    title: string;
    readTime: string;
    summary: string;
    keyPoints: string[];
    codeExample?: string;
  };
  session: {
    title: string;
    time: string;
    duration: string;
    attendanceCoins: number;
    archiveCoins: number;
    flashcards: { id: number; question: string; answer: string }[];
  };
  assignments: CurriculumProblem[];
  additionalProblems: CurriculumProblem[];
}

export interface CurriculumModuleItem {
  id: number;
  moduleNumber: number;
  phase: 1 | 2;
  title: string;
  durationWeeks: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  mockInterviewStatus: string;
  attendancePercent: string;
  modulePsp: string;
  classes: CurriculumClassItem[];
}

// -------------------------------------------------------------
// DEFAULT RICH ASSIGNMENTS & PROBLEMS
// -------------------------------------------------------------
const SAMPLE_PROBLEMS: CurriculumProblem[] = [
  {
    id: 'Q1',
    qNumber: 1,
    title: 'Q1. Check even/odd',
    type: 'code',
    difficulty: 'Very Easy',
    score: '100.0/100',
    status: 'Solved',
    submissions: 1,
    askedIn: 'Amazon',
    solvedBy: 7,
    description: 'Given an integer n, print "Even" if the number is even, and "Odd" if it is odd.',
    solutionSnippet: `def check_even_odd(n):\n    return "Even" if n % 2 == 0 else "Odd"`
  },
  {
    id: 'Q2',
    qNumber: 2,
    title: 'Q2. Max of two',
    type: 'code',
    difficulty: 'Very Easy',
    score: '100.0/100',
    status: 'Solved',
    submissions: 1,
    askedIn: 'Flipkart',
    solvedBy: 7,
    description: 'Given two integers a and b, return the maximum value using conditional operators.',
    solutionSnippet: `def max_of_two(a, b):\n    return a if a > b else b`
  },
  {
    id: 'Q3',
    qNumber: 3,
    title: 'Q3. Min of two',
    type: 'code',
    difficulty: 'Very Easy',
    score: '100.0/100',
    status: 'Solved',
    submissions: 1,
    askedIn: 'Google',
    solvedBy: 7,
    description: 'Write a program to find and return the minimum of two input integers.',
    solutionSnippet: `def min_of_two(a, b):\n    return b if b < a else a`
  },
  {
    id: 'Q4',
    qNumber: 4,
    title: 'Q4. Conversion in Python-2',
    type: 'mcq',
    difficulty: 'Easy',
    score: '50.0/50',
    status: 'Solved',
    submissions: 1,
    askedIn: '-',
    solvedBy: 7,
    description: 'Predict the output: bool("False") and bool(0) and int("101", 2).',
    solutionSnippet: `# Output is 0 because bool(0) evaluates to False in logical AND chain.`
  },
  {
    id: 'Q5',
    qNumber: 5,
    title: 'Q5. Conversion in Python-3',
    type: 'mcq',
    difficulty: 'Easy',
    score: '50.0/50',
    status: 'Solved',
    submissions: 1,
    askedIn: '-',
    solvedBy: 7,
    description: 'Identify the result of typecasting float("3.14") to int and round behavior.',
    solutionSnippet: `# int(float("3.14")) truncates to 3.`
  },
  {
    id: 'Q6',
    qNumber: 6,
    title: 'Q6. Set the values',
    type: 'code',
    difficulty: 'Very Easy',
    score: '100.0/100',
    status: 'Solved',
    submissions: 1,
    askedIn: 'Microsoft',
    solvedBy: 7,
    description: 'Assign conditional variable values based on user input threshold.',
    solutionSnippet: `def set_values(val, limit):\n    return "Allowed" if val <= limit else "Exceeded"`
  },
  {
    id: 'Q7',
    qNumber: 7,
    title: 'Q7. Conditional Leap Year Check',
    type: 'code',
    difficulty: 'Easy',
    score: '100.0/100',
    status: 'Solved',
    submissions: 1,
    askedIn: 'Swiggy',
    solvedBy: 7,
    description: 'Determine if a given year is a leap year using boolean conditional logic.',
    solutionSnippet: `def is_leap_year(year):\n    return (year % 4 == 0 and year % 100 != 0) or (year % 400 == 0)`
  },
  {
    id: 'Q8',
    qNumber: 8,
    title: 'Q8. Rock Paper Scissors Logic',
    type: 'code',
    difficulty: 'Easy',
    score: '100.0/100',
    status: 'Solved',
    submissions: 1,
    askedIn: 'Uber',
    solvedBy: 7,
    description: 'Implement referee rules for Rock, Paper, Scissors choices using nested conditions.',
    solutionSnippet: `def rps_winner(p1, p2):\n    if p1 == p2: return "Tie"\n    wins = {("rock", "scissors"), ("scissors", "paper"), ("paper", "rock")}\n    return "P1" if (p1, p2) in wins else "P2"`
  },
  {
    id: 'Q9',
    qNumber: 9,
    title: 'Q9. Grade Calculator with Nested Conditions',
    type: 'code',
    difficulty: 'Easy',
    score: '100.0/100',
    status: 'Solved',
    submissions: 1,
    askedIn: '-',
    solvedBy: 7,
    description: 'Output A, B, C, D or F based on percentage score with boundary conditions.',
    solutionSnippet: `def get_grade(score):\n    if score >= 90: return "A"\n    elif score >= 80: return "B"\n    elif score >= 70: return "C"\n    elif score >= 60: return "D"\n    return "F"`
  }
];

const SAMPLE_BONUS_PROBLEMS: CurriculumProblem[] = [
  {
    id: 'AP1',
    qNumber: 1,
    title: 'Bonus 1. Bitwise XOR Swap without Temp Variable',
    type: 'code',
    difficulty: 'Medium',
    score: '100.0/100',
    status: 'Solved',
    submissions: 1,
    askedIn: 'Adobe',
    solvedBy: 6,
    description: 'Swap two integer variables using bitwise XOR operator without using third variable.',
    solutionSnippet: `a = a ^ b\nb = a ^ b\na = a ^ b`
  },
  {
    id: 'AP2',
    qNumber: 2,
    title: 'Bonus 2. Quadrant Finder for Coordinate Points',
    type: 'code',
    difficulty: 'Easy',
    score: '100.0/100',
    status: 'Solved',
    submissions: 1,
    askedIn: 'TCS',
    solvedBy: 7,
    description: 'Determine which quadrant (1, 2, 3, or 4) a point (x, y) belongs to.',
    solutionSnippet: `if x > 0 and y > 0: return 1\nelif x < 0 and y > 0: return 2\nelif x < 0 and y < 0: return 3\nelse: return 4`
  },
  {
    id: 'AP3',
    qNumber: 3,
    title: 'Bonus 3. Electricity Bill Tiered Tariff Calculation',
    type: 'code',
    difficulty: 'Medium',
    score: '100.0/100',
    status: 'Solved',
    submissions: 1,
    askedIn: 'Paytm',
    solvedBy: 7,
    description: 'Calculate total bill amount given unit slabs with surcharge.',
    solutionSnippet: `# Tiered computation logic`
  }
];

// -------------------------------------------------------------
// COMPLETE 9 MODULES CURRICULUM DATA
// PHASE 1: SQL, Excel, Tableau, Product Analysis
// PHASE 2: Core Python, Python Libraries, Statistics and Probability, Gen AI for Data Analysis, Interview Prep
// -------------------------------------------------------------
const COMPLETE_CURRICULUM_MODULES: CurriculumModuleItem[] = [
  // ==========================================
  // PHASE 1
  // ==========================================
  {
    id: 1,
    moduleNumber: 1,
    phase: 1,
    title: 'SQL for Data Analytics',
    durationWeeks: '4 weeks',
    status: 'completed',
    mockInterviewStatus: 'Not Required',
    attendancePercent: '100%',
    modulePsp: '100%',
    classes: [
      {
        id: 'm1-d1',
        dayNumber: 'DAY 1, 01 APR',
        title: 'SQL: Schema Architecture, Tables & BigQuery Setup',
        dateFormatted: 'Wed, 01 Apr 2026',
        time: '9:00 PM Wed, 01 Apr',
        mandatory: true,
        status: 'completed',
        lecturePercent: '100.0%',
        assignmentCount: '5/5',
        additionalProblemsCount: '4/4',
        attendance: '100%',
        problemsSolved: '9 / 9',
        preRead: {
          title: '3NF Relational Schemas, Constraints & Keys',
          readTime: '10 min read',
          summary: 'Learn table relationships, primary keys, and foreign keys in transactional databases.',
          keyPoints: ['Eliminate data redundancy using 3NF tables', 'Primary Key guarantees unique row identity']
        },
        session: {
          title: 'SQL: Schema Architecture & BigQuery Setup',
          time: '9:00 PM Wed, 01 Apr',
          duration: '2h 00m',
          attendanceCoins: 8,
          archiveCoins: 3,
          flashcards: [{ id: 1, question: 'What is a Foreign Key constraint?', answer: 'A column in one table referring to the Primary Key in another table to preserve referential integrity.' }]
        },
        assignments: SAMPLE_PROBLEMS.slice(0, 5),
        additionalProblems: SAMPLE_BONUS_PROBLEMS.slice(0, 2)
      },
      {
        id: 'm1-d2',
        dayNumber: 'DAY 2, 03 APR',
        title: 'SQL: Filtering, Aggregations & GROUP BY',
        dateFormatted: 'Fri, 03 Apr 2026',
        time: '9:00 PM Fri, 03 Apr',
        mandatory: true,
        status: 'completed',
        lecturePercent: '100.0%',
        assignmentCount: '7/7',
        additionalProblemsCount: '5/5',
        attendance: '100%',
        problemsSolved: '12 / 12',
        preRead: {
          title: 'WHERE vs HAVING and Aggregate Rollups',
          readTime: '9 min read',
          summary: 'Aggregate metrics with SUM, AVG, COUNT, MIN, MAX and conditional HAVING filters.',
          keyPoints: ['WHERE filters rows before aggregation; HAVING filters aggregated groups']
        },
        session: {
          title: 'SQL: Filtering & Aggregations',
          time: '9:00 PM Fri, 03 Apr',
          duration: '2h 15m',
          attendanceCoins: 8,
          archiveCoins: 3,
          flashcards: [{ id: 1, question: 'Can you use aggregate functions in a WHERE clause?', answer: 'No, aggregate functions belong in HAVING or SELECT, because WHERE executes before grouping.' }]
        },
        assignments: SAMPLE_PROBLEMS.slice(0, 7),
        additionalProblems: SAMPLE_BONUS_PROBLEMS
      },
      {
        id: 'm1-d3',
        dayNumber: 'DAY 3, 06 APR',
        title: 'SQL: Multi-Table Joins & Common Table Expressions (CTEs)',
        dateFormatted: 'Mon, 06 Apr 2026',
        time: '9:00 PM Mon, 06 Apr',
        mandatory: true,
        status: 'completed',
        lecturePercent: '100.0%',
        assignmentCount: '8/8',
        additionalProblemsCount: '6/6',
        attendance: '100%',
        problemsSolved: '14 / 14',
        preRead: {
          title: 'INNER, LEFT, RIGHT JOINs and Readable CTEs',
          readTime: '12 min read',
          summary: 'Combine datasets seamlessly using join predicates and WITH clauses for clean code.',
          keyPoints: ['LEFT JOIN preserves all left-table records even when right side is NULL']
        },
        session: {
          title: 'SQL: Multi-Table Joins & CTEs',
          time: '9:00 PM Mon, 06 Apr',
          duration: '2h 30m',
          attendanceCoins: 8,
          archiveCoins: 3,
          flashcards: [{ id: 1, question: 'What is a Common Table Expression (CTE)?', answer: 'A temporary named result set defined via WITH clause that improves readability and enables recursive queries.' }]
        },
        assignments: SAMPLE_PROBLEMS.slice(0, 8),
        additionalProblems: SAMPLE_BONUS_PROBLEMS
      },
      {
        id: 'm1-d4',
        dayNumber: 'DAY 4, 08 APR',
        title: 'SQL: Analytical Window Functions & Rolling Metrics',
        dateFormatted: 'Wed, 08 Apr 2026',
        time: '9:00 PM Wed, 08 Apr',
        mandatory: true,
        status: 'completed',
        lecturePercent: '100.0%',
        assignmentCount: '9/9',
        additionalProblemsCount: '8/8',
        attendance: '100%',
        problemsSolved: '17 / 17',
        preRead: {
          title: 'OVER (PARTITION BY ... ORDER BY ...) Deep Dive',
          readTime: '11 min read',
          summary: 'Compute running revenue sums, moving 7-day averages, RANK, and DENSE_RANK without collapsing rows.',
          keyPoints: ['Window functions compute values across related row partitions without grouping them into single rows']
        },
        session: {
          title: 'SQL: Analytical Window Functions',
          time: '9:00 PM Wed, 08 Apr',
          duration: '2h 45m',
          attendanceCoins: 8,
          archiveCoins: 3,
          flashcards: [{ id: 1, question: 'What is the difference between RANK() and DENSE_RANK()?', answer: 'RANK() skips rank numbers after ties (1, 1, 3), whereas DENSE_RANK() does not skip (1, 1, 2).' }]
        },
        assignments: SAMPLE_PROBLEMS,
        additionalProblems: SAMPLE_BONUS_PROBLEMS
      }
    ]
  },
  {
    id: 2,
    moduleNumber: 2,
    phase: 1,
    title: 'Advanced Excel & Spreadsheets',
    durationWeeks: '3 weeks',
    status: 'completed',
    mockInterviewStatus: 'Not Required',
    attendancePercent: '100%',
    modulePsp: '100%',
    classes: [
      {
        id: 'm2-d1',
        dayNumber: 'DAY 1, 10 APR',
        title: 'Excel: Modern Lookup Formulas (XLOOKUP, INDEX/MATCH)',
        dateFormatted: 'Fri, 10 Apr 2026',
        time: '9:00 PM Fri, 10 Apr',
        mandatory: true,
        status: 'completed',
        lecturePercent: '100.0%',
        assignmentCount: '6/6',
        additionalProblemsCount: '4/4',
        attendance: '100%',
        problemsSolved: '10 / 10',
        preRead: {
          title: 'Retiring VLOOKUP: Exact Matching & Spill Formulas',
          readTime: '8 min read',
          summary: 'Master dynamic array spill operators, nested XLOOKUP, and horizontal arrays.',
          keyPoints: ['XLOOKUP searches right-to-left and defaults to exact match']
        },
        session: {
          title: 'Excel: Modern Lookup Formulas',
          time: '9:00 PM Fri, 10 Apr',
          duration: '2h 10m',
          attendanceCoins: 8,
          archiveCoins: 3,
          flashcards: [{ id: 1, question: 'Why is XLOOKUP superior to VLOOKUP?', answer: 'It can look to the left, does not break when inserting columns, and provides a built-in if_not_found fallback.' }]
        },
        assignments: SAMPLE_PROBLEMS.slice(0, 6),
        additionalProblems: SAMPLE_BONUS_PROBLEMS.slice(0, 2)
      },
      {
        id: 'm2-d2',
        dayNumber: 'DAY 2, 13 APR',
        title: 'Excel: Power Query ETL & Ingestion Automation',
        dateFormatted: 'Mon, 13 Apr 2026',
        time: '9:00 PM Mon, 13 Apr',
        mandatory: true,
        status: 'completed',
        lecturePercent: '100.0%',
        assignmentCount: '7/7',
        additionalProblemsCount: '5/5',
        attendance: '100%',
        problemsSolved: '12 / 12',
        preRead: {
          title: 'Extract, Transform & Load in Modern Spreadsheets',
          readTime: '9 min read',
          summary: 'Ingest messy multi-branch CSVs, unpivot columns, and set up 1-click refreshes.',
          keyPoints: ['Power Query records repeatable transformation steps in M code']
        },
        session: {
          title: 'Excel: Power Query ETL Automation',
          time: '9:00 PM Mon, 13 Apr',
          duration: '2h 20m',
          attendanceCoins: 8,
          archiveCoins: 3,
          flashcards: [{ id: 1, question: 'What does Unpivot do in Power Query?', answer: 'Converts wide column-based tables into tall row-based attribute-value pairs suited for pivot analysis.' }]
        },
        assignments: SAMPLE_PROBLEMS.slice(0, 7),
        additionalProblems: SAMPLE_BONUS_PROBLEMS
      },
      {
        id: 'm2-d3',
        dayNumber: 'DAY 3, 15 APR',
        title: 'Excel: Interactive Pivot Tables & Executive Dashboards',
        dateFormatted: 'Wed, 15 Apr 2026',
        time: '9:00 PM Wed, 15 Apr',
        mandatory: true,
        status: 'completed',
        lecturePercent: '100.0%',
        assignmentCount: '8/8',
        additionalProblemsCount: '6/6',
        attendance: '100%',
        problemsSolved: '14 / 14',
        preRead: {
          title: 'Slicers, Timelines & Calculated Fields',
          readTime: '10 min read',
          summary: 'Design executive summary dashboards with connected slicer filtering.',
          keyPoints: ['Connect single slicer to multiple pivot tables via Report Connections']
        },
        session: {
          title: 'Excel: Interactive Pivot Dashboards',
          time: '9:00 PM Wed, 15 Apr',
          duration: '2h 30m',
          attendanceCoins: 8,
          archiveCoins: 3,
          flashcards: [{ id: 1, question: 'How do you create a KPI metric in a Pivot Table?', answer: 'Use Fields, Items, & Sets -> Calculated Field to define formulas like Profit / Revenue.' }]
        },
        assignments: SAMPLE_PROBLEMS.slice(0, 8),
        additionalProblems: SAMPLE_BONUS_PROBLEMS
      }
    ]
  },
  {
    id: 3,
    moduleNumber: 3,
    phase: 1,
    title: 'Tableau Business Intelligence & Dashboards',
    durationWeeks: '3 weeks',
    status: 'completed',
    mockInterviewStatus: 'Not Required',
    attendancePercent: '100%',
    modulePsp: '100%',
    classes: [
      {
        id: 'm3-d1',
        dayNumber: 'DAY 1, 18 APR',
        title: 'Tableau: Dimensions vs Measures & Core Visualizations',
        dateFormatted: 'Sat, 18 Apr 2026',
        time: '9:00 PM Sat, 18 Apr',
        mandatory: true,
        status: 'completed',
        lecturePercent: '100.0%',
        assignmentCount: '6/6',
        additionalProblemsCount: '4/4',
        attendance: '100%',
        problemsSolved: '10 / 10',
        preRead: {
          title: 'Discrete (Blue) vs Continuous (Green) Pills',
          readTime: '8 min read',
          summary: 'Understand how Tableau aggregates measures into headers and axes.',
          keyPoints: ['Blue pills create headers; Green pills create continuous axes']
        },
        session: {
          title: 'Tableau: Dimensions & Measures',
          time: '9:00 PM Sat, 18 Apr',
          duration: '2h 15m',
          attendanceCoins: 8,
          archiveCoins: 3,
          flashcards: [{ id: 1, question: 'What does color coding in Tableau pills represent?', answer: 'Blue indicates Discrete fields; Green indicates Continuous fields.' }]
        },
        assignments: SAMPLE_PROBLEMS.slice(0, 6),
        additionalProblems: SAMPLE_BONUS_PROBLEMS.slice(0, 2)
      },
      {
        id: 'm3-d2',
        dayNumber: 'DAY 2, 21 APR',
        title: 'Tableau: Level of Detail (LOD) Expressions & Dual-Axis',
        dateFormatted: 'Tue, 21 Apr 2026',
        time: '9:00 PM Tue, 21 Apr',
        mandatory: true,
        status: 'completed',
        lecturePercent: '100.0%',
        assignmentCount: '8/8',
        additionalProblemsCount: '6/6',
        attendance: '100%',
        problemsSolved: '14 / 14',
        preRead: {
          title: 'FIXED, INCLUDE, and EXCLUDE Calculations',
          readTime: '12 min read',
          summary: 'Compute metrics independent of view granularity using FIXED LOD formulas.',
          keyPoints: ['FIXED computes at the specified dimension level regardless of dimensions on the shelf']
        },
        session: {
          title: 'Tableau: LOD Expressions & Dual-Axis',
          time: '9:00 PM Tue, 21 Apr',
          duration: '2h 40m',
          attendanceCoins: 8,
          archiveCoins: 3,
          flashcards: [{ id: 1, question: 'When do you use a FIXED LOD expression?', answer: 'When you need to compute a value (like Customer Lifetime Spend) above or below the view level of detail.' }]
        },
        assignments: SAMPLE_PROBLEMS.slice(0, 8),
        additionalProblems: SAMPLE_BONUS_PROBLEMS
      }
    ]
  },
  {
    id: 4,
    moduleNumber: 4,
    phase: 1,
    title: 'Product Analysis & Business Metrics',
    durationWeeks: '2 weeks',
    status: 'completed',
    mockInterviewStatus: 'Phase 1 Mock Interview (SQL & BI)',
    attendancePercent: '100%',
    modulePsp: '100%',
    classes: [
      {
        id: 'm4-d1',
        dayNumber: 'DAY 1, 25 APR',
        title: 'Product: North Star Metrics, Funnels & Retention Cohorts',
        dateFormatted: 'Sat, 25 Apr 2026',
        time: '9:00 PM Sat, 25 Apr',
        mandatory: true,
        status: 'completed',
        lecturePercent: '100.0%',
        assignmentCount: '6/6',
        additionalProblemsCount: '5/5',
        attendance: '100%',
        problemsSolved: '11 / 11',
        preRead: {
          title: 'MAU, DAU, Stickiness, and N-Day Retention Curves',
          readTime: '10 min read',
          summary: 'Model user drop-offs, onboarding funnels, and retention curves for tech products.',
          keyPoints: ['Stickiness = DAU / MAU ratio', 'Flat retention curves indicate product-market fit']
        },
        session: {
          title: 'Product: North Star Metrics & Retention',
          time: '9:00 PM Sat, 25 Apr',
          duration: '2h 15m',
          attendanceCoins: 8,
          archiveCoins: 3,
          flashcards: [{ id: 1, question: 'What is a cohort in product analytics?', answer: 'A group of users sharing a common characteristic over a time period (e.g. users acquired in Week 12).' }]
        },
        assignments: SAMPLE_PROBLEMS.slice(0, 6),
        additionalProblems: SAMPLE_BONUS_PROBLEMS.slice(0, 2)
      },
      {
        id: 'm4-d2',
        dayNumber: 'DAY 2, 28 APR',
        title: 'Product: Unit Economics (CAC, LTV) & Phase 1 Capstone Defense',
        dateFormatted: 'Tue, 28 Apr 2026',
        time: '9:00 PM Tue, 28 Apr',
        mandatory: true,
        status: 'completed',
        lecturePercent: '100.0%',
        assignmentCount: '8/8',
        additionalProblemsCount: '6/6',
        attendance: '100%',
        problemsSolved: '14 / 14',
        preRead: {
          title: 'Customer Acquisition Cost & Payback Period Modeling',
          readTime: '11 min read',
          summary: 'Analyze business unit economics, payback periods, and present Phase 1 capstone findings.',
          keyPoints: ['Healthy SaaS LTV/CAC ratio is typically 3:1 or higher']
        },
        session: {
          title: 'Product: Unit Economics & Capstone',
          time: '9:00 PM Tue, 28 Apr',
          duration: '2h 30m',
          attendanceCoins: 8,
          archiveCoins: 3,
          flashcards: [{ id: 1, question: 'How is Customer Lifetime Value (LTV) calculated?', answer: 'LTV = Average Revenue Per User (ARPU) * Gross Margin / Churn Rate.' }]
        },
        assignments: SAMPLE_PROBLEMS.slice(0, 8),
        additionalProblems: SAMPLE_BONUS_PROBLEMS
      }
    ]
  },

  // ==========================================
  // PHASE 2
  // ==========================================
  {
    id: 5,
    moduleNumber: 5,
    phase: 2,
    title: 'Core Python',
    durationWeeks: '4 weeks',
    status: 'completed',
    mockInterviewStatus: 'Not Required',
    attendancePercent: '100%',
    modulePsp: '100%',
    classes: [
      {
        id: 'm5-d2',
        dayNumber: 'DAY 2, 17 MAY',
        title: 'Python: Introduction To Python and Data Types',
        dateFormatted: 'Fri, 17 May 2026',
        time: '9:00 PM Fri, 17 May',
        mandatory: true,
        status: 'completed',
        lecturePercent: '100.0%',
        assignmentCount: '6/6',
        additionalProblemsCount: '5/5',
        attendance: '100%',
        problemsSolved: '11 / 11',
        preRead: {
          title: 'Dynamic Typing, Memory Allocations & Primitive Types',
          readTime: '8 min read',
          summary: 'Understand Python memory model for ints, floats, booleans, and strings.',
          keyPoints: ['Variables are object references in heap memory', 'Strings and tuples are immutable']
        },
        session: {
          title: 'Python: Introduction To Python and Data Types',
          time: '9:00 PM Fri, 17 May',
          duration: '2h 15m',
          attendanceCoins: 8,
          archiveCoins: 3,
          flashcards: [{ id: 1, question: 'What is the type of 10 / 2 in Python 3?', answer: 'float (5.0) — division operator / always returns a float in Python 3.' }]
        },
        assignments: SAMPLE_PROBLEMS.slice(0, 6),
        additionalProblems: SAMPLE_BONUS_PROBLEMS.slice(0, 2)
      },
      {
        id: 'm5-d3',
        dayNumber: 'DAY 3, 20 MAY',
        title: 'Python: Operators and Control Statements',
        dateFormatted: 'Mon, 20 May 2026',
        time: '9:00 PM Mon, 20 May',
        mandatory: true,
        status: 'completed',
        lecturePercent: '100.0%',
        assignmentCount: '9/9',
        additionalProblemsCount: '10/10',
        attendance: '100%',
        problemsSolved: '19 / 19',
        preRead: {
          title: 'Operators Precedence, Short-Circuit Evaluation & Branching',
          readTime: '10 min read',
          summary: 'Deep dive into arithmetic, logical, membership (in), and identity (is) operators.',
          keyPoints: ['Logical and/or short-circuit evaluate', '== compares value equality while is tests identity'],
          codeExample: `age = 22\nstatus = "Adult" if 18 <= age < 60 else "Senior" if age >= 60 else "Minor"`
        },
        session: {
          title: 'Python: Operators and Control Statements',
          time: '9:00 PM Mon, 20 May',
          duration: '2h 30m',
          attendanceCoins: 8,
          archiveCoins: 3,
          flashcards: [
            { id: 1, question: 'What is the result of 2 ** 3 ** 2 in Python?', answer: '512 (Exponentiation evaluates right-to-left: 3**2 = 9, then 2**9 = 512).' },
            { id: 2, question: 'What does "short-circuiting" mean in logical operators?', answer: 'The second operand is only evaluated if the first operand is insufficient to determine the result.' }
          ]
        },
        assignments: SAMPLE_PROBLEMS,
        additionalProblems: SAMPLE_BONUS_PROBLEMS
      },
      {
        id: 'm5-d4',
        dayNumber: 'DAY 4, 22 MAY',
        title: 'Python: Iteration',
        dateFormatted: 'Wed, 22 May 2026',
        time: '9:00 PM Wed, 22 May',
        mandatory: true,
        status: 'completed',
        lecturePercent: '100.0%',
        assignmentCount: '7/7',
        additionalProblemsCount: '4/4',
        attendance: '100%',
        problemsSolved: '11 / 11',
        preRead: {
          title: 'Looping Paradigms: while and for loops in Python',
          readTime: '8 min read',
          summary: 'Master range(), break, continue, pass, and loop else clauses.',
          keyPoints: ['range(start, stop, step) produces an immutable sequence', 'Loop else runs if no break occurred']
        },
        session: {
          title: 'Python: Iteration',
          time: '9:00 PM Wed, 22 May',
          duration: '2h 10m',
          attendanceCoins: 8,
          archiveCoins: 3,
          flashcards: [{ id: 1, question: 'Does a loop else block run if a break statement is hit?', answer: 'No, break skips the else clause completely.' }]
        },
        assignments: SAMPLE_PROBLEMS.slice(0, 7),
        additionalProblems: SAMPLE_BONUS_PROBLEMS.slice(0, 2)
      },
      {
        id: 'm5-d5',
        dayNumber: 'DAY 5, 24 MAY',
        title: 'Python: Lab Session on Iteration',
        dateFormatted: 'Fri, 24 May 2026',
        time: '9:00 PM Fri, 24 May',
        mandatory: true,
        status: 'completed',
        lecturePercent: '100.0%',
        assignmentCount: '8/8',
        additionalProblemsCount: '7/7',
        attendance: '100%',
        problemsSolved: '15 / 15',
        preRead: {
          title: 'Nested Loops & Algorithmic Problem Solving',
          readTime: '7 min read',
          summary: 'Two-dimensional loops, pattern generation, and prime number sieves.',
          keyPoints: ['Outer loop controls row index, inner loop controls column elements']
        },
        session: {
          title: 'Python: Lab Session on Iteration',
          time: '9:00 PM Fri, 24 May',
          duration: '2h 45m',
          attendanceCoins: 8,
          archiveCoins: 3,
          flashcards: [{ id: 1, question: 'What is the time complexity of two nested loops of size N?', answer: 'O(N^2).' }]
        },
        assignments: SAMPLE_PROBLEMS.slice(0, 8),
        additionalProblems: SAMPLE_BONUS_PROBLEMS
      },
      {
        id: 'm5-d6',
        dayNumber: 'DAY 6, 27 MAY',
        title: 'Python: Functions',
        dateFormatted: 'Mon, 27 May 2026',
        time: '9:00 PM Mon, 27 May',
        mandatory: true,
        status: 'completed',
        lecturePercent: '100.0%',
        assignmentCount: '7/7',
        additionalProblemsCount: '3/3',
        attendance: '100%',
        problemsSolved: '10 / 10',
        preRead: {
          title: 'First-Class Functions, Scope & LEGB Rule',
          readTime: '12 min read',
          summary: 'Positional arguments, *args, **kwargs, lambda functions, and scope lookup order.',
          keyPoints: ['LEGB order: Local -> Enclosing -> Global -> Built-in']
        },
        session: {
          title: 'Python: Functions',
          time: '9:00 PM Mon, 27 May',
          duration: '2h 20m',
          attendanceCoins: 8,
          archiveCoins: 3,
          flashcards: [{ id: 1, question: 'Why should you avoid mutable default arguments like def fn(x=[]):?', answer: 'The list is bound once at definition time and shared across subsequent calls.' }]
        },
        assignments: SAMPLE_PROBLEMS.slice(0, 7),
        additionalProblems: SAMPLE_BONUS_PROBLEMS.slice(0, 2)
      },
      {
        id: 'm5-d7',
        dayNumber: 'DAY 7, 29 MAY',
        title: 'Python: 1D List',
        dateFormatted: 'Wed, 29 May 2026',
        time: '9:00 PM Wed, 29 May',
        mandatory: true,
        status: 'completed',
        lecturePercent: '100.0%',
        assignmentCount: '8/8',
        additionalProblemsCount: '6/6',
        attendance: '100%',
        problemsSolved: '14 / 14',
        preRead: {
          title: 'Array Slicing, List Comprehensions & Resizing',
          readTime: '9 min read',
          summary: 'Dynamic resizing, negative indexing, and memory allocation of Python lists.',
          keyPoints: ['Negative indexing: -1 is the last item', 'Slicing format: list[start:stop:step]']
        },
        session: {
          title: 'Python: 1D List',
          time: '9:00 PM Wed, 29 May',
          duration: '2h 15m',
          attendanceCoins: 8,
          archiveCoins: 3,
          flashcards: [{ id: 1, question: 'What is the amortized cost of list.append()?', answer: 'O(1) amortized because Python pre-allocates extra memory capacity.' }]
        },
        assignments: SAMPLE_PROBLEMS.slice(0, 8),
        additionalProblems: SAMPLE_BONUS_PROBLEMS
      },
      {
        id: 'm5-d8',
        dayNumber: 'DAY 8, 01 JUN',
        title: 'Python: 2D List',
        dateFormatted: 'Mon, 01 Jun 2026',
        time: '9:00 PM Mon, 01 Jun',
        mandatory: true,
        status: 'completed',
        lecturePercent: '100.0%',
        assignmentCount: '6/6',
        additionalProblemsCount: '5/5',
        masteryMode: 'Achieved',
        attendance: '100%',
        problemsSolved: '11 / 11',
        preRead: {
          title: 'Matrix Mathematics, Grids & Traversal',
          readTime: '11 min read',
          summary: 'Representing tabular data, matrix transpose, and row/column traversal algorithms.',
          keyPoints: ['Correct grid initialization: [[0]*cols for _ in range(rows)]']
        },
        session: {
          title: 'Python: 2D List',
          time: '9:00 PM Mon, 01 Jun',
          duration: '2h 40m',
          attendanceCoins: 8,
          archiveCoins: 3,
          flashcards: [{ id: 1, question: 'Why does [[0]*3]*3 fail when changing one cell?', answer: 'The outer list duplicates references to the exact same inner list 3 times.' }]
        },
        assignments: SAMPLE_PROBLEMS.slice(0, 6),
        additionalProblems: SAMPLE_BONUS_PROBLEMS.slice(0, 2)
      }
    ]
  },
  {
    id: 6,
    moduleNumber: 6,
    phase: 2,
    title: 'Python Libraries',
    durationWeeks: '4 weeks',
    status: 'in-progress',
    mockInterviewStatus: 'Not Required',
    attendancePercent: '95%',
    modulePsp: '92%',
    classes: [
      {
        id: 'm6-d1',
        dayNumber: 'DAY 1, 05 JUN',
        title: 'NumPy: Multidimensional Arrays & Vectorized Computing',
        dateFormatted: 'Fri, 05 Jun 2026',
        time: '9:00 PM Fri, 05 Jun',
        mandatory: true,
        status: 'completed',
        lecturePercent: '100.0%',
        assignmentCount: '8/8',
        additionalProblemsCount: '5/5',
        attendance: '100%',
        problemsSolved: '13 / 13',
        preRead: {
          title: 'Contiguous C-Memory Buffers and SIMD Vectorization',
          readTime: '9 min read',
          summary: 'Why NumPy executes 50x faster than standard Python loops.',
          keyPoints: ['NumPy arrays are homogeneous and stored in contiguous memory blocks']
        },
        session: {
          title: 'NumPy: Multidimensional Arrays',
          time: '9:00 PM Fri, 05 Jun',
          duration: '2h 15m',
          attendanceCoins: 8,
          archiveCoins: 3,
          flashcards: [{ id: 1, question: 'What is vectorization?', answer: 'Performing element-wise computations without explicit Python loops.' }]
        },
        assignments: SAMPLE_PROBLEMS.slice(0, 8),
        additionalProblems: SAMPLE_BONUS_PROBLEMS.slice(0, 2)
      },
      {
        id: 'm6-d2',
        dayNumber: 'DAY 2, 08 JUN',
        title: 'Pandas: DataFrames, Ingestion & Data Cleaning',
        dateFormatted: 'Mon, 08 Jun 2026',
        time: '9:00 PM Mon, 08 Jun',
        mandatory: true,
        status: 'completed',
        lecturePercent: '100.0%',
        assignmentCount: '8/8',
        additionalProblemsCount: '6/6',
        attendance: '100%',
        problemsSolved: '14 / 14',
        preRead: {
          title: 'Series vs DataFrames, .loc vs .iloc, and Null Handling',
          readTime: '11 min read',
          summary: 'Ingesting CSVs, missing value imputation, and groupby aggregation.',
          keyPoints: ['Use .loc for label indexing and .iloc for integer positional indexing']
        },
        session: {
          title: 'Pandas: DataFrames & Cleaning',
          time: '9:00 PM Mon, 08 Jun',
          duration: '2h 30m',
          attendanceCoins: 8,
          archiveCoins: 3,
          flashcards: [{ id: 1, question: 'Difference between df.dropna() and df.fillna()?', answer: 'dropna removes missing rows/columns; fillna replaces nulls with defined values.' }]
        },
        assignments: SAMPLE_PROBLEMS.slice(0, 8),
        additionalProblems: SAMPLE_BONUS_PROBLEMS
      },
      {
        id: 'm6-d3',
        dayNumber: 'DAY 3, 11 JUN',
        title: 'Matplotlib & Seaborn: Statistical Visualizations & EDA',
        dateFormatted: 'Thu, 11 Jun 2026',
        time: '9:00 PM Thu, 11 Jun',
        mandatory: true,
        status: 'in-progress',
        lecturePercent: '100.0%',
        assignmentCount: '7/8',
        additionalProblemsCount: '5/6',
        attendance: '100%',
        problemsSolved: '12 / 14',
        preRead: {
          title: 'Subplots, Distribution Plots, Heatmaps & Boxplots',
          readTime: '10 min read',
          summary: 'Plot distributions, correlation matrices, and detect outliers visually.',
          keyPoints: ['Heatmaps display Pearson correlation coefficients between numerical columns']
        },
        session: {
          title: 'Matplotlib & Seaborn EDA',
          time: '9:00 PM Thu, 11 Jun',
          duration: '2h 20m',
          attendanceCoins: 8,
          archiveCoins: 3,
          flashcards: [{ id: 1, question: 'What does a Boxplot display?', answer: 'Median, interquartile range (IQR Q1-Q3), whiskers, and outliers.' }]
        },
        assignments: SAMPLE_PROBLEMS.slice(0, 7),
        additionalProblems: SAMPLE_BONUS_PROBLEMS.slice(0, 2)
      }
    ]
  },
  {
    id: 7,
    moduleNumber: 7,
    phase: 2,
    title: 'Statistics and Probability',
    durationWeeks: '3 weeks',
    status: 'in-progress',
    mockInterviewStatus: 'Not Required',
    attendancePercent: '90%',
    modulePsp: '88%',
    classes: [
      {
        id: 'm7-d1',
        dayNumber: 'DAY 1, 16 JUN',
        title: 'Stats: Descriptive Metrics, Normal Curve & Central Limit Theorem',
        dateFormatted: 'Tue, 16 Jun 2026',
        time: '9:00 PM Tue, 16 Jun',
        mandatory: true,
        status: 'completed',
        lecturePercent: '100.0%',
        assignmentCount: '6/6',
        additionalProblemsCount: '5/5',
        attendance: '100%',
        problemsSolved: '11 / 11',
        preRead: {
          title: 'Variance, Standard Deviation and the 68-95-99.7 Empirical Rule',
          readTime: '10 min read',
          summary: 'Understanding skewness, standard deviation and sampling distributions.',
          keyPoints: ['Central Limit Theorem: sample means approach normality as sample size increases']
        },
        session: {
          title: 'Stats: Descriptive Metrics & CLT',
          time: '9:00 PM Tue, 16 Jun',
          duration: '2h 15m',
          attendanceCoins: 8,
          archiveCoins: 3,
          flashcards: [{ id: 1, question: 'What does standard deviation quantify?', answer: 'The dispersion or spread of data points relative to the mean.' }]
        },
        assignments: SAMPLE_PROBLEMS.slice(0, 6),
        additionalProblems: SAMPLE_BONUS_PROBLEMS.slice(0, 2)
      },
      {
        id: 'm7-d2',
        dayNumber: 'DAY 2, 19 JUN',
        title: 'Stats: Hypothesis Testing (Z-Test, T-Test, P-Values) & A/B Testing',
        dateFormatted: 'Fri, 19 Jun 2026',
        time: '9:00 PM Fri, 19 Jun',
        mandatory: true,
        status: 'in-progress',
        lecturePercent: '100.0%',
        assignmentCount: '6/7',
        additionalProblemsCount: '4/5',
        attendance: '100%',
        problemsSolved: '10 / 12',
        preRead: {
          title: 'Null Hypothesis, Type I/II Errors & Alpha Thresholds',
          readTime: '11 min read',
          summary: 'Design statistical experiments, compute statistical power, and evaluate conversion lifts.',
          keyPoints: ['P-value < 0.05 indicates statistical significance to reject the Null Hypothesis']
        },
        session: {
          title: 'Stats: Hypothesis Testing & A/B Experiments',
          time: '9:00 PM Fri, 19 Jun',
          duration: '2h 30m',
          attendanceCoins: 8,
          archiveCoins: 3,
          flashcards: [{ id: 1, question: 'What is a Type I error?', answer: 'Rejecting the Null Hypothesis when it was actually true (False Positive).' }]
        },
        assignments: SAMPLE_PROBLEMS.slice(0, 7),
        additionalProblems: SAMPLE_BONUS_PROBLEMS.slice(0, 2)
      }
    ]
  },
  {
    id: 8,
    moduleNumber: 8,
    phase: 2,
    title: 'Gen AI for Data Analysis',
    durationWeeks: '3 weeks',
    status: 'upcoming',
    mockInterviewStatus: 'Not Required',
    attendancePercent: 'Upcoming',
    modulePsp: 'Upcoming',
    classes: [
      {
        id: 'm8-d1',
        dayNumber: 'DAY 1, 24 JUN',
        title: 'GenAI: Prompt Engineering, Tokenization & Structured LLM Outputs',
        dateFormatted: 'Wed, 24 Jun 2026',
        time: '9:00 PM Wed, 24 Jun',
        mandatory: true,
        status: 'upcoming',
        lecturePercent: '0%',
        assignmentCount: '0/6',
        additionalProblemsCount: '0/5',
        attendance: 'Upcoming',
        problemsSolved: '0 / 11',
        preRead: {
          title: 'Context Windows, Few-Shot Prompting & JSON Schema Enforcement',
          readTime: '9 min read',
          summary: 'Guiding large language models to generate reliable SQL queries and Python transformations.',
          keyPoints: ['Few-shot examples dramatically improve LLM syntax correctness']
        },
        session: {
          title: 'GenAI: Prompt Engineering for Data',
          time: '9:00 PM Wed, 24 Jun',
          duration: '2h 15m',
          attendanceCoins: 8,
          archiveCoins: 3,
          flashcards: [{ id: 1, question: 'What is Function Calling in LLMs?', answer: 'Allowing the LLM to output structured JSON arguments to invoke external APIs or database tools.' }]
        },
        assignments: SAMPLE_PROBLEMS.slice(0, 6),
        additionalProblems: SAMPLE_BONUS_PROBLEMS.slice(0, 2)
      },
      {
        id: 'm8-d2',
        dayNumber: 'DAY 2, 27 JUN',
        title: 'GenAI: Building Autonomous Data Agents with LangChain & LangGraph',
        dateFormatted: 'Sat, 27 Jun 2026',
        time: '9:00 PM Sat, 27 Jun',
        mandatory: true,
        status: 'upcoming',
        lecturePercent: '0%',
        assignmentCount: '0/8',
        additionalProblemsCount: '0/5',
        attendance: 'Upcoming',
        problemsSolved: '0 / 13',
        preRead: {
          title: 'Tool Use, Memory Buffers & Multi-Turn Debugging Loops',
          readTime: '12 min read',
          summary: 'Build an autonomous agent that ingests user questions, writes SQL, fixes errors, and outputs charts.',
          keyPoints: ['Self-correcting query loop: execute SQL -> catch syntax error -> reflect -> regenerate']
        },
        session: {
          title: 'GenAI: Autonomous Data Agents',
          time: '9:00 PM Sat, 27 Jun',
          duration: '2h 45m',
          attendanceCoins: 8,
          archiveCoins: 3,
          flashcards: [{ id: 1, question: 'What is RAG in data analysis?', answer: 'Retrieval Augmented Generation: fetching relevant schema metadata or documents before prompting the model.' }]
        },
        assignments: SAMPLE_PROBLEMS.slice(0, 8),
        additionalProblems: SAMPLE_BONUS_PROBLEMS.slice(0, 2)
      }
    ]
  },
  {
    id: 9,
    moduleNumber: 9,
    phase: 2,
    title: 'Interview Prep',
    durationWeeks: '2 weeks',
    status: 'upcoming',
    mockInterviewStatus: 'Phase 2 Mock Interview (Full Tech & GenAI)',
    attendancePercent: 'Upcoming',
    modulePsp: 'Upcoming',
    classes: [
      {
        id: 'm9-d1',
        dayNumber: 'DAY 1, 02 JUL',
        title: 'Interview: Technical Coding Rounds (SQL & Python Live Drills)',
        dateFormatted: 'Thu, 02 Jul 2026',
        time: '9:00 PM Thu, 02 Jul',
        mandatory: true,
        status: 'upcoming',
        lecturePercent: '0%',
        assignmentCount: '0/6',
        additionalProblemsCount: '0/5',
        attendance: 'Upcoming',
        problemsSolved: '0 / 11',
        preRead: {
          title: 'Live Whiteboarding Patterns & Time Complexity Communication',
          readTime: '10 min read',
          summary: 'How to communicate problem understanding, edge cases, and optimal solutions during coding rounds.',
          keyPoints: ['Always state time and space complexity before writing the first line of code']
        },
        session: {
          title: 'Interview: Technical Coding Drills',
          time: '9:00 PM Thu, 02 Jul',
          duration: '2h 30m',
          attendanceCoins: 8,
          archiveCoins: 3,
          flashcards: [{ id: 1, question: 'What should you do when stuck in a live coding interview?', answer: 'Talk out loud, state assumptions, evaluate small test cases, and explain trade-offs to the interviewer.' }]
        },
        assignments: SAMPLE_PROBLEMS.slice(0, 6),
        additionalProblems: SAMPLE_BONUS_PROBLEMS.slice(0, 2)
      },
      {
        id: 'm9-d2',
        dayNumber: 'DAY 2, 05 JUL',
        title: 'Interview: Portfolio Defense, Metric Drops & Live Mock Interview',
        dateFormatted: 'Sun, 05 Jul 2026',
        time: '9:00 PM Sun, 05 Jul',
        mandatory: true,
        status: 'upcoming',
        lecturePercent: '0%',
        assignmentCount: '0/8',
        additionalProblemsCount: '0/6',
        attendance: 'Upcoming',
        problemsSolved: '0 / 14',
        preRead: {
          title: 'Case Study Framework: STAR Method for Data Leaders',
          readTime: '11 min read',
          summary: 'Presenting GitHub repositories, answering "Why this metric?", and negotiating salary offers.',
          keyPoints: ['Use STAR method: Situation, Task, Action, and Quantitative Business Result']
        },
        session: {
          title: 'Interview: Portfolio Defense & Mock Panel',
          time: '9:00 PM Sun, 05 Jul',
          duration: '3h 00m',
          attendanceCoins: 8,
          archiveCoins: 3,
          flashcards: [{ id: 1, question: 'What is the STAR interview format?', answer: 'Situation, Task, Action taken, and measurable Business Result.' }]
        },
        assignments: SAMPLE_PROBLEMS.slice(0, 8),
        additionalProblems: SAMPLE_BONUS_PROBLEMS
      }
    ]
  }
];

interface CoreCurriculumViewProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
  onOpenSupportModal?: () => void;
}

interface BackendCurriculumResponse {
  success: boolean;
  courseTitle: string;
  courseDescription: string;
  modules: Array<{
    id: string;
    title: string;
    order: number;
    progressPercent: number;
    completedClasses: number;
    totalClasses: number;
    classes: Array<{
      id: string;
      title: string;
      description: string | null;
      date: string;
      startTime: string;
      endTime?: string;
      duration?: string;
      zoomLink?: string;
      recordingUrl?: string | null;
      instructorName?: string;
      hasRecording?: boolean;
      hasMaterials?: boolean;
      preRead?: any;
      postRead?: any;
      status: string;
      hasAttended: boolean;
      assignment?: {
        id: string;
        title: string;
        solved: number;
        total: number;
      } | null;
    }>;
  }>;
}

export const CoreCurriculumView: React.FC<CoreCurriculumViewProps> = ({ 
  onToggleSidebar,
  isSidebarOpen,
  onOpenSupportModal 
}) => {
  // Real Curriculum API State
  const [curriculumData, setCurriculumData] = useState<BackendCurriculumResponse | null>(null);
  const [isLoadingCurriculum, setIsLoadingCurriculum] = useState<boolean>(true);
  const [curriculumError, setCurriculumError] = useState<string | null>(null);

  // Class detail lazy-fetch cache & loading state
  const [detailedClassLoading, setDetailedClassLoading] = useState<boolean>(false);

  const fetchCurriculum = async () => {
    setIsLoadingCurriculum(true);
    setCurriculumError(null);
    try {
      const data = await api<BackendCurriculumResponse>('/student/curriculum');
      if (data && data.success) {
        setCurriculumData(data);
        if (data.modules.length > 0) {
          setSelectedModuleId(data.modules[0].id as any);
        }
      }
    } catch (err: any) {
      console.error('Failed to load curriculum:', err);
      setCurriculumError(err.message || 'Unable to load your cohort curriculum.');
    } finally {
      setIsLoadingCurriculum(false);
    }
  };

  useEffect(() => {
    fetchCurriculum();
  }, []);

  // Top Bar Tabs: ONLY Core Skills And Curriculum & Skill Certification
  const [topTab, setTopTab] = useState<'curriculum' | 'certification'>('curriculum');
  
  // Selected Module on Left Sidebar (Default to first module ID)
  const [selectedModuleId, setSelectedModuleId] = useState<string | number>(1);
  
  // Active Class Detail View (Null = Class List View, Item = Class View)
  const [activeClass, setActiveClass] = useState<CurriculumClassItem | null>(null);

  // Inner Class Tabs: 'preread' | 'session' | 'assignment' | 'additional' | 'feedback'
  const [classInnerTab, setClassInnerTab] = useState<'preread' | 'session' | 'assignment' | 'additional' | 'feedback'>('session');

  // Assignment Sub-filters (Question quick select: 'all' | 'Q1' | 'Q2' etc.)
  const [selectedQuestionFilter, setSelectedQuestionFilter] = useState<string>('all');

  // Flashcards state inside Session view
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState<number>(0);
  const [isFlashcardFlipped, setIsFlashcardFlipped] = useState<boolean>(false);

  // Video Playing Modal
  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);

  // Code Problem Solver / Review Modal
  const [activeProblemModal, setActiveProblemModal] = useState<CurriculumProblem | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState<boolean>(false);
  const [submissionFeedback, setSubmissionFeedback] = useState<{
    status: 'correct' | 'incorrect' | 'error';
    message: string;
    score?: number;
    explanation?: string;
  } | null>(null);

  // Sync selectedAnswer when opening a problem modal
  const handleOpenProblem = (problem: CurriculumProblem) => {
    setActiveProblemModal(problem);
    setSelectedAnswer(problem.myAnswer || '');
    setSubmissionFeedback(null);
  };

  // Submit Answer handler
  const handleSubmitAnswer = async () => {
    if (!activeProblemModal || !selectedAnswer.trim()) return;

    setIsSubmittingAnswer(true);
    setSubmissionFeedback(null);

    try {
      const res = await api<{
        success: boolean;
        submission: {
          id: string;
          isCorrect: boolean;
          score: number;
          correctAnswer: string;
          explanation?: string;
        };
      }>('/student/submit-answer', {
        method: 'POST',
        body: {
          questionId: activeProblemModal.id,
          answer: selectedAnswer.trim(),
          timeSpent: 60
        }
      });

      if (res && res.success) {
        const sub = res.submission;
        setSubmissionFeedback({
          status: sub.isCorrect ? 'correct' : 'incorrect',
          message: sub.isCorrect
            ? `Correct! You earned ${sub.score} points.`
            : `Incorrect. The correct answer was: ${sub.correctAnswer}`,
          score: sub.score,
          explanation: sub.explanation
        });

        // Update modal state
        setActiveProblemModal(prev => prev ? {
          ...prev,
          myAnswer: selectedAnswer.trim(),
          isCorrect: sub.isCorrect,
          correctAnswer: sub.correctAnswer,
          score: `${sub.score}/${prev.score.split('/')[1] || 10}`,
          status: sub.isCorrect ? 'Solved' : 'Attempted',
          solutionSnippet: sub.explanation || prev.solutionSnippet
        } : null);

        // Update activeClass assignments list
        setActiveClass(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            assignments: prev.assignments.map(a => {
              if (a.id === activeProblemModal.id) {
                return {
                  ...a,
                  myAnswer: selectedAnswer.trim(),
                  isCorrect: sub.isCorrect,
                  correctAnswer: sub.correctAnswer,
                  score: `${sub.score}/${a.score.split('/')[1] || 10}`,
                  status: sub.isCorrect ? 'Solved' : 'Attempted',
                  solutionSnippet: sub.explanation || a.solutionSnippet
                };
              }
              return a;
            })
          };
        });
      }
    } catch (err: any) {
      console.error('Failed to submit answer:', err);
      setSubmissionFeedback({
        status: 'error',
        message: err.message || 'Failed to submit answer. Please try again.'
      });
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  // Feedback form state
  const [feedbackRating, setFeedbackRating] = useState<number>(5);
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false);

  // Map Backend Modules to Frontend UI CurriculumModuleItem representation
  const dynamicModules: CurriculumModuleItem[] = (curriculumData?.modules && curriculumData.modules.length > 0)
    ? curriculumData.modules.map((m, index) => {
        const total = m.totalClasses;
        const attended = m.classes.filter(c => c.hasAttended).length;
        const attRate = total > 0 ? `${Math.round((attended / total) * 100)}%` : '0%';
        const pspScore = `${m.progressPercent}%`;

        // Determine Phase dynamically: First half is Phase 1 (Core Foundation), second half is Phase 2 (Advanced)
        const phaseNum: 1 | 2 = (index < Math.ceil(curriculumData.modules.length / 2)) ? 1 : 2;

        return {
          id: m.id as any,
          moduleNumber: m.order || index + 1,
          phase: phaseNum,
          title: m.title,
          durationWeeks: `${m.totalClasses} Lectures`,
          status: m.progressPercent === 100 ? 'completed' : m.progressPercent > 0 ? 'in-progress' : 'upcoming',
          mockInterviewStatus: index === 0 ? 'Foundation Assessment' : 'Phase Evaluation',
          attendancePercent: attRate,
          modulePsp: pspScore,
          classes: m.classes.map((c, cIdx) => ({
            id: c.id,
            dayNumber: `Class ${String(cIdx + 1).padStart(2, '0')}`,
            title: c.title,
            dateFormatted: c.date ? `${c.date} · ${c.startTime || '19:00'}` : 'Schedule Pending',
            time: c.startTime || '19:00',
            mandatory: true,
            status: c.status === 'COMPLETED' ? 'completed' : c.status === 'IN_PROGRESS' || c.status === 'LIVE' ? 'in-progress' : 'upcoming',
            lecturePercent: c.hasAttended ? '100%' : '0%',
            assignmentCount: c.assignment ? `${c.assignment.solved}/${c.assignment.total}` : '0/0',
            additionalProblemsCount: '0/0',
            attendance: c.hasAttended ? 'Present' : 'Absent',
            problemsSolved: c.assignment ? `${c.assignment.solved}` : '0',
            recordingDuration: c.duration || '1h 30m',
            preRead: {
              title: c.preRead?.objectives ? `Pre-read: ${c.title}` : `Preparation for ${c.title}`,
              readTime: '15 mins read',
              summary: c.description || (c.preRead?.objectives ? c.preRead.objectives.join('. ') : 'Review module fundamentals before joining the live session.'),
              keyPoints: c.preRead?.objectives || ['Review core topics before class', 'Prepare questions for the instructor', 'Complete any pending prior module practice'],
              codeExample: undefined
            },
            session: {
              title: c.title,
              time: `${c.date} (${c.startTime || '19:00'})`,
              duration: c.duration || '1h 30m',
              attendanceCoins: 50,
              archiveCoins: 25,
              flashcards: [
                { id: 1, question: `What is the core focus of ${c.title}?`, answer: c.description || 'Deep architectural mastery and practical implementations.' },
                { id: 2, question: 'How is attendance credited?', answer: 'Attendance is marked when participating live in the scheduled batch lecture.' }
              ]
            },
            assignments: c.assignment ? [
              {
                id: c.assignment.id,
                qNumber: 1,
                title: c.assignment.title,
                type: 'mcq' as const,
                difficulty: 'Medium' as const,
                score: `${c.assignment.solved * 10}/${c.assignment.total * 10}`,
                status: c.assignment.solved === c.assignment.total ? 'Solved' : 'Attempted',
                submissions: c.assignment.solved,
                solvedBy: c.assignment.solved,
                description: `Complete the assignment for ${c.title} to test your understanding.`
              }
            ] : [],
            additionalProblems: []
          }))
        };
      })
    : COMPLETE_CURRICULUM_MODULES;

  const currentModule = dynamicModules.find(m => String(m.id) === String(selectedModuleId)) || dynamicModules[0];

  // Handler to open class directly & fetch class details from /api/student/classes/[classId]
  const handleOpenClass = async (cls: CurriculumClassItem) => {
    setActiveClass(cls);
    setClassInnerTab('session');
    setSelectedQuestionFilter('all');
    setCurrentFlashcardIndex(0);
    setIsFlashcardFlipped(false);

    // Call class details API to ensure we have the most accurate, live recordingUrl and assignments
    try {
      setDetailedClassLoading(true);
      const res = await api<{ success: boolean; class: any }>(`/student/classes/${cls.id}`);
      if (res && res.success && res.class) {
        const detailed = res.class;
        setActiveClass((prev) => {
          if (!prev || prev.id !== cls.id) return prev;
          return {
            ...prev,
            title: detailed.title || prev.title,
            recordingDuration: detailed.recordingUrl ? (prev.recordingDuration || '1h 30m') : undefined,
            attendance: detailed.attendanceStatus === 'PRESENT' ? 'Present' : detailed.attendanceStatus,
            session: {
              ...prev.session,
              title: detailed.title || prev.session.title,
              time: `${detailed.date} (${detailed.startTime} - ${detailed.endTime})`,
            },
            preRead: detailed.preRead ? {
              title: `Pre-read: ${detailed.title}`,
              readTime: '15 mins read',
              summary: detailed.description || 'Review foundational concepts before the lecture.',
              keyPoints: detailed.preRead.objectives || prev.preRead.keyPoints,
              codeExample: undefined
            } : prev.preRead,
            assignments: (detailed.assignments && detailed.assignments.length > 0)
              ? detailed.assignments.flatMap((a: any) =>
                  a.questions.map((q: any, qIdx: number) => ({
                    id: q.id,
                    qNumber: qIdx + 1,
                    title: `Q${qIdx + 1}. ${q.text.slice(0, 45)}...`,
                    type: (q.type?.toLowerCase() === 'coding' ? 'code' : 'mcq') as any,
                    difficulty: (a.difficulty === 'HARD' ? 'Hard' : a.difficulty === 'EASY' ? 'Easy' : 'Medium') as any,
                    score: `${q.score || 0}/${q.points || 10}`,
                    status: (q.isCorrect ? 'Solved' : q.myAnswer ? 'Attempted' : 'Unsolved') as any,
                    submissions: q.myAnswer ? 1 : 0,
                    solvedBy: 1,
                    description: q.text,
                    options: Array.isArray(q.options) ? q.options : undefined,
                    myAnswer: q.myAnswer || null,
                    isCorrect: q.isCorrect !== undefined ? q.isCorrect : null,
                    correctAnswer: q.correctAnswer,
                    solutionSnippet: q.explanation || undefined
                  }))
                )
              : prev.assignments
          };
        });
      }
    } catch (err) {
      console.warn('Could not fetch class detail, retaining base curriculum data:', err);
    } finally {
      setDetailedClassLoading(false);
    }
  };

  // Switch to next/previous class inside class view
  const handleNavigateClass = (direction: 'next' | 'prev') => {
    if (!activeClass || !currentModule) return;
    const currentIndex = currentModule.classes.findIndex(c => c.id === activeClass.id);
    if (direction === 'prev' && currentIndex > 0) {
      handleOpenClass(currentModule.classes[currentIndex - 1]);
    } else if (direction === 'next' && currentIndex < currentModule.classes.length - 1) {
      handleOpenClass(currentModule.classes[currentIndex + 1]);
    }
  };

  // Filtered assignments
  const activeAssignments = activeClass ? (
    selectedQuestionFilter === 'all' 
      ? activeClass.assignments 
      : activeClass.assignments.filter(p => p.id === selectedQuestionFilter)
  ) : [];

  // Grouped modules for Phase 1 and Phase 2
  const phase1Modules = dynamicModules.filter(m => m.phase === 1);
  const phase2Modules = dynamicModules.filter(m => m.phase === 2);

  return (
    <div className="w-full bg-[#F8FAFC] text-[#0F172A] min-h-screen font-sans border-t border-[#E2E8F0]">
      
      {/* ========================================================
          1. TOP GLOBAL CURRICULUM NAVIGATION BAR
             (Removed "Other Classes" and "CodeMyWay Lectures Video Library")
         ======================================================== */}
      <nav className="bg-white border-b border-[#E2E8F0] px-4 sm:px-6 lg:px-8 py-0 sticky top-0 z-30 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Left Primary Tabs with Sidebar Toggle */}
          <div className="flex items-center gap-2 sm:gap-6 overflow-x-auto no-scrollbar pt-1">
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="p-2 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors cursor-pointer mr-1 shrink-0"
                title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
              >
                <Layers className="w-4 h-4 text-[#2563EB]" />
              </button>
            )}

            <button
              onClick={() => { setTopTab('curriculum'); setActiveClass(null); }}
              className={`py-3.5 px-3 text-xs sm:text-sm font-semibold transition-all relative whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                topTab === 'curriculum'
                  ? 'text-[#2563EB] font-bold'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <span>Core Skills And Curriculum</span>
              {topTab === 'curriculum' && (
                <motion.div 
                  layoutId="activeTopTabIndicator" 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB] rounded-t-full" 
                />
              )}
            </button>

            <button
              onClick={() => setTopTab('certification')}
              className={`py-3.5 px-3 text-xs sm:text-sm font-semibold transition-all relative whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                topTab === 'certification'
                  ? 'text-[#2563EB] font-bold'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <span>Skill Certification</span>
              {topTab === 'certification' && (
                <motion.div 
                  layoutId="activeTopTabIndicator" 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB] rounded-t-full" 
                />
              )}
            </button>
          </div>

          {/* Right Status Badges & Ask Support */}
          <div className="flex items-center gap-3 sm:gap-4 pb-2 md:pb-0 shrink-0 self-end md:self-auto">
            {/* Streak & Timer */}
            <div className="flex items-center gap-1.5 text-xs text-[#475569] font-medium bg-[#F1F5F9] px-2.5 py-1 rounded-full">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="font-bold text-[#0F172A]">0</span>
              <span className="text-[#94A3B8]">·</span>
              <span className="text-amber-600 font-semibold">3 hours left</span>
            </div>

            {/* Notification Bell */}
            <button className="relative p-1.5 text-[#64748B] hover:text-[#0F172A] rounded-full hover:bg-[#F1F5F9] transition-colors cursor-pointer">
              <Bell className="w-4 h-4" />
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center absolute -top-1 -right-1 ring-2 ring-white">
                6
              </span>
            </button>

            {/* Ask Support Button */}
            <button
              onClick={onOpenSupportModal}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-xs font-semibold text-[#0F172A] shadow-xs hover:border-[#94A3B8] transition-all cursor-pointer"
            >
              <Headphones className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Ask Support</span>
            </button>
          </div>

        </div>
      </nav>

      {/* ========================================================
          2. MAIN CONTENT BODY
             STATE A: Module Class List View (Matches Screenshot 1)
             STATE B: Inside Class View (Matches Screenshots 2 & 3)
         ======================================================== */}
      
      {isLoadingCurriculum ? (
        <div className="flex flex-col items-center justify-center p-20 space-y-4">
          <div className="w-10 h-10 rounded-full border-2 border-blue-500/20 border-t-[#2563EB] animate-spin" />
          <p className="text-xs text-[#64748B] font-mono tracking-wider animate-pulse">Loading Enrolled Cohort Curriculum...</p>
        </div>
      ) : curriculumError ? (
        <div className="max-w-md mx-auto my-16 p-6 rounded-2xl bg-white border border-rose-200 text-center space-y-4 shadow-sm">
          <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
          <h3 className="text-sm font-bold text-[#0F172A]">Curriculum Connection Error</h3>
          <p className="text-xs text-[#64748B]">{curriculumError}</p>
          <button
            onClick={() => fetchCurriculum()}
            className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
          >
            Retry Loading
          </button>
        </div>
      ) : !activeClass ? (
        /* ======================================================
            STATE A: MODULES LIST (LEFT) + CLASSES LIST (RIGHT)
           ====================================================== */
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT SIDEBAR: PHASE 1 & PHASE 2 MODULE CARDS */}
            <aside className="lg:col-span-4 space-y-6">
              
              {/* PHASE 1 SECTION */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#2563EB] text-white text-[10px] font-bold tracking-wider font-mono uppercase">
                      PHASE 1
                    </span>
                    <span className="text-xs font-bold text-[#0F172A]">Core Foundation & BI</span>
                  </div>
                  <span className="text-[10px] font-semibold text-[#64748B] font-mono">Modules 1–4</span>
                </div>

                <div className="space-y-3">
                  {phase1Modules.map((mod) => {
                    const isSelected = selectedModuleId === mod.id;
                    return (
                      <div
                        key={mod.id}
                        onClick={() => setSelectedModuleId(mod.id)}
                        className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer relative bg-white ${
                          isSelected
                            ? 'border-[#2563EB] ring-2 ring-[#2563EB]/15 shadow-sm'
                            : 'border-[#E2E8F0] hover:border-[#CBD5E1] hover:shadow-xs'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1 font-mono">
                          <span>MODULE - {mod.moduleNumber}</span>
                          <span className="text-[10px] text-[#2563EB] font-sans font-semibold">{mod.durationWeeks}</span>
                        </div>

                        <h3 className={`text-sm font-bold leading-snug mb-3 ${
                          isSelected ? 'text-[#1E40AF]' : 'text-[#0F172A]'
                        }`}>
                          {mod.title}
                        </h3>

                        {/* Classes Action Pill */}
                        <div className={`p-2 rounded-lg flex items-center justify-between text-xs font-semibold transition-colors mb-2.5 ${
                          isSelected 
                            ? 'bg-[#2563EB] text-white shadow-xs' 
                            : 'bg-[#F8FAFC] text-[#334155] border border-[#E2E8F0]'
                        }`}>
                          <div className="flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Classes</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className={`text-[11px] flex items-center gap-1 font-medium ${
                              isSelected ? 'text-blue-100' : 'text-emerald-600'
                            }`}>
                              <Check className="w-3 h-3 stroke-[3]" />
                              <span>Completed</span>
                            </span>
                            <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-[#94A3B8]'}`} />
                          </div>
                        </div>

                        {/* Mock Interview Status */}
                        <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-xs text-[#64748B]">
                          <div className="flex items-center gap-1.5 text-[11px]">
                            <Info className="w-3.5 h-3.5 text-[#94A3B8]" />
                            <span>Mock Interview</span>
                          </div>
                          <span className={`text-[11px] font-semibold ${
                            mod.mockInterviewStatus.includes('Mock Interview') 
                              ? 'text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.2 rounded-md' 
                              : 'text-[#64748B]'
                          }`}>
                            {mod.mockInterviewStatus}
                          </span>
                        </div>

                        {isSelected && (
                          <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#2563EB] rounded-full text-white flex items-center justify-center shadow-xs">
                            <ChevronRight className="w-3 h-3 ml-0.5" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Milestone 1 End of Phase Divider */}
                <div className="p-3 rounded-xl bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border border-blue-200 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#2563EB] shrink-0" />
                    <div>
                      <span className="font-bold text-[#1E3A8A] block">End of Phase 1 Milestone</span>
                      <span className="text-[10px] text-[#475569]">SQL & BI Capstone Review</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-mono">
                    Completed
                  </span>
                </div>
              </div>

              {/* PHASE 2 SECTION */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#7C3AED] text-white text-[10px] font-bold tracking-wider font-mono uppercase">
                      PHASE 2
                    </span>
                    <span className="text-xs font-bold text-[#0F172A]">Python, Stats & GenAI</span>
                  </div>
                  <span className="text-[10px] font-semibold text-[#64748B] font-mono">Modules 5–9</span>
                </div>

                <div className="space-y-3">
                  {phase2Modules.map((mod) => {
                    const isSelected = selectedModuleId === mod.id;
                    return (
                      <div
                        key={mod.id}
                        onClick={() => setSelectedModuleId(mod.id)}
                        className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer relative bg-white ${
                          isSelected
                            ? 'border-[#7C3AED] ring-2 ring-[#7C3AED]/15 shadow-sm'
                            : 'border-[#E2E8F0] hover:border-[#CBD5E1] hover:shadow-xs'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-1 font-mono">
                          <span>MODULE - {mod.moduleNumber}</span>
                          <span className="text-[10px] text-[#7C3AED] font-sans font-semibold">{mod.durationWeeks}</span>
                        </div>

                        <h3 className={`text-sm font-bold leading-snug mb-3 ${
                          isSelected ? 'text-[#6D28D9]' : 'text-[#0F172A]'
                        }`}>
                          {mod.title}
                        </h3>

                        {/* Classes Action Pill */}
                        <div className={`p-2 rounded-lg flex items-center justify-between text-xs font-semibold transition-colors mb-2.5 ${
                          isSelected 
                            ? 'bg-[#7C3AED] text-white shadow-xs' 
                            : 'bg-[#F8FAFC] text-[#334155] border border-[#E2E8F0]'
                        }`}>
                          <div className="flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Classes</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            {mod.status === 'completed' && (
                              <span className={`text-[11px] flex items-center gap-1 font-medium ${
                                isSelected ? 'text-purple-100' : 'text-emerald-600'
                              }`}>
                                <Check className="w-3 h-3 stroke-[3]" />
                                <span>Completed</span>
                              </span>
                            )}
                            {mod.status === 'in-progress' && (
                              <span className={`text-[11px] flex items-center gap-1 font-medium ${
                                isSelected ? 'text-purple-100' : 'text-blue-600'
                              }`}>
                                <span>In Progress</span>
                              </span>
                            )}
                            {mod.status === 'upcoming' && (
                              <span className={`text-[11px] flex items-center gap-1 font-medium ${
                                isSelected ? 'text-purple-100' : 'text-[#64748B]'
                              }`}>
                                <span>Upcoming</span>
                              </span>
                            )}
                            <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-[#94A3B8]'}`} />
                          </div>
                        </div>

                        {/* Mock Interview Status */}
                        <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-xs text-[#64748B]">
                          <div className="flex items-center gap-1.5 text-[11px]">
                            <Info className="w-3.5 h-3.5 text-[#94A3B8]" />
                            <span>Mock Interview</span>
                          </div>
                          <span className={`text-[11px] font-semibold ${
                            mod.mockInterviewStatus.includes('Mock Interview') 
                              ? 'text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.2 rounded-md' 
                              : 'text-[#64748B]'
                          }`}>
                            {mod.mockInterviewStatus}
                          </span>
                        </div>

                        {isSelected && (
                          <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#7C3AED] rounded-full text-white flex items-center justify-center shadow-xs">
                            <ChevronRight className="w-3 h-3 ml-0.5" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Milestone 2 Final Capstone Banner */}
                <div className="p-3 rounded-xl bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 border border-purple-200 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-[#7C3AED] shrink-0" />
                    <div>
                      <span className="font-bold text-[#5B21B6] block">Phase 2 Capstone & Placement</span>
                      <span className="text-[10px] text-[#475569]">Full Technical Defense</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full font-mono">
                    Milestone 2
                  </span>
                </div>
              </div>

            </aside>

            {/* RIGHT MAIN CONTENT: DAY-WISE CLASSES FOR SELECTED MODULE */}
            <main className="lg:col-span-8 bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
              
              {/* Module Header Bar */}
              <div className="p-5 sm:p-6 border-b border-[#F1F5F9] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[11px] font-mono font-bold uppercase text-[#64748B]">
                      PHASE {currentModule.phase} · MODULE - {currentModule.moduleNumber}
                    </span>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-full">
                      {currentModule.durationWeeks}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight">
                    {currentModule.title}
                  </h2>
                </div>

                {/* Right Module Stats */}
                <div className="flex items-center gap-3">
                  <div className="px-3.5 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-center">
                    <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs">
                      <GraduationCap className="w-4 h-4 text-emerald-600" />
                      <span>{currentModule.attendancePercent}</span>
                    </div>
                    <span className="text-[10px] text-[#64748B] block mt-0.5">Attendance %</span>
                  </div>

                  <div className="px-3.5 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-center">
                    <div className="flex items-center gap-1.5 text-blue-600 font-bold text-xs">
                      <Trophy className="w-4 h-4 text-blue-600" />
                      <span>{currentModule.modulePsp}</span>
                    </div>
                    <span className="text-[10px] text-[#64748B] block mt-0.5">Module PSP</span>
                  </div>
                </div>
              </div>

              {/* Day-by-Day Classes List */}
              <div className="divide-y divide-[#F1F5F9]">
                {currentModule?.classes && currentModule.classes.length > 0 ? (
                  currentModule.classes.map((cls) => (
                    <div
                      key={cls.id}
                      onClick={() => handleOpenClass(cls)}
                      className="p-4 sm:p-5 hover:bg-[#F8FAFC] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 cursor-pointer group"
                    >
                      {/* Left: Day & Title */}
                      <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                        <span className="text-xs font-mono font-bold text-[#64748B] whitespace-nowrap shrink-0 min-w-[100px]">
                          {cls.dayNumber}
                        </span>
                        <h4 className="text-xs sm:text-sm font-semibold text-[#0F172A] group-hover:text-[#2563EB] transition-colors leading-relaxed">
                          {cls.title}
                        </h4>
                      </div>

                      {/* Right: Telemetry (Lecture %, Assignment, Additional Problem, Arrow) */}
                      <div className="flex items-center gap-3 sm:gap-6 shrink-0 self-end md:self-auto text-xs">
                        {cls.masteryMode && (
                          <div className="hidden sm:flex items-center gap-1 text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                            <Trophy className="w-3 h-3 text-amber-500" />
                            <span>{cls.masteryMode}</span>
                          </div>
                        )}

                        <div className="text-right">
                          <span className="text-[10px] text-[#94A3B8] block">Lecture</span>
                          <span className="text-xs font-bold text-emerald-600">{cls.lecturePercent}</span>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-[#94A3B8] block">Assignment</span>
                          <span className="text-xs font-bold text-[#0F172A] font-mono">{cls.assignmentCount}</span>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-[#94A3B8] block">Additional Problem</span>
                          <span className="text-xs font-bold text-[#0F172A] font-mono">{cls.additionalProblemsCount}</span>
                        </div>

                        <div className="p-1 rounded-md text-[#CBD5E1] group-hover:text-[#2563EB] group-hover:translate-x-1 transition-all">
                          <ChevronRight className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-[#0F172A]">No Classes Scheduled in this Module Yet</h4>
                    <p className="text-xs text-[#64748B] max-w-sm mx-auto">
                      Lectures and assignments for this module will be published according to your cohort schedule.
                    </p>
                  </div>
                )}
              </div>

            </main>

          </div>
        </div>
      ) : (
        /* ======================================================
            STATE B: INSIDE CLASS VIEW (MATCHES SCREENSHOTS 2 & 3)
           ====================================================== */
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-4">
          
          {/* 1. CLASS TOP HEADER & BREADCRUMB BAR */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setActiveClass(null)}
                className="p-2 rounded-lg border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors cursor-pointer shrink-0"
                title="Back to All Classes"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base sm:text-lg font-extrabold text-[#0F172A] tracking-tight">
                    {activeClass.dayNumber} - {activeClass.title}
                  </h2>
                  <ChevronDown className="w-4 h-4 text-[#94A3B8] cursor-pointer" />
                  {activeClass.mandatory && (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md uppercase tracking-wider">
                      Mandatory
                    </span>
                  )}
                </div>
                <div className="text-xs text-[#64748B] mt-0.5">
                  {activeClass.dateFormatted}
                </div>
              </div>
            </div>

            {/* Right Class Progress & PSP Metrics */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0 self-end md:self-auto">
              <div className="flex items-center gap-1.5 text-xs text-[#475569] font-medium bg-[#F1F5F9] px-2.5 py-1 rounded-full">
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="font-bold text-[#0F172A]">0</span>
                <span className="text-[#94A3B8]">·</span>
                <span className="text-amber-600 font-semibold">19 hours left</span>
              </div>

              <div className="px-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center gap-2 text-xs">
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                <div>
                  <span className="font-bold text-emerald-600">{activeClass.attendance}</span>
                  <span className="text-[10px] text-[#64748B] ml-1 hidden sm:inline">Class Attendance</span>
                </div>
              </div>

              <div className="px-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center gap-2 text-xs">
                <Code2 className="w-4 h-4 text-blue-600" />
                <div>
                  <span className="font-bold text-[#0F172A] font-mono">{activeClass.problemsSolved}</span>
                  <span className="text-[10px] text-[#64748B] ml-1 hidden sm:inline">Problems Solved</span>
                </div>
              </div>
            </div>

          </div>

          {/* 2. INNER SUB-NAVIGATION TABS */}
          {/* Pre-read, Session (Live / Recorded Class), Assignment, Additional Problems, Feedback */}
          <div className="border-b border-[#E2E8F0] bg-white rounded-t-xl px-4 sm:px-6 pt-1 flex items-center gap-2 sm:gap-6 overflow-x-auto no-scrollbar shadow-xs">
            
            {/* Tab: Pre-read */}
            <button
              onClick={() => setClassInnerTab('preread')}
              className={`py-3 px-3 text-xs sm:text-sm font-semibold transition-all relative whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                classInnerTab === 'preread'
                  ? 'text-[#2563EB] font-bold'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Pre-read</span>
              {classInnerTab === 'preread' && (
                <motion.div layoutId="activeInnerTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB]" />
              )}
            </button>

            {/* Tab: Session (Live / Recorded Class) */}
            <button
              onClick={() => setClassInnerTab('session')}
              className={`py-3 px-3 text-xs sm:text-sm font-semibold transition-all relative whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                classInnerTab === 'session'
                  ? 'text-[#2563EB] font-bold'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <Video className="w-3.5 h-3.5 text-blue-600" />
              <span>Session {activeClass.lecturePercent}</span>
              {classInnerTab === 'session' && (
                <motion.div layoutId="activeInnerTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB]" />
              )}
            </button>

            {/* Tab: Assignment */}
            <button
              onClick={() => setClassInnerTab('assignment')}
              className={`py-3 px-3 text-xs sm:text-sm font-semibold transition-all relative whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                classInnerTab === 'assignment'
                  ? 'text-[#2563EB] font-bold'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Assignment {activeClass.assignmentCount}</span>
              {classInnerTab === 'assignment' && (
                <motion.div layoutId="activeInnerTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB]" />
              )}
            </button>

            {/* Tab: Additional Problems */}
            <button
              onClick={() => setClassInnerTab('additional')}
              className={`py-3 px-3 text-xs sm:text-sm font-semibold transition-all relative whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                classInnerTab === 'additional'
                  ? 'text-[#2563EB] font-bold'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <span>Additional Problems {activeClass.additionalProblemsCount}</span>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded-md">New</span>
              {classInnerTab === 'additional' && (
                <motion.div layoutId="activeInnerTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB]" />
              )}
            </button>

            {/* Tab: Feedback */}
            <button
              onClick={() => setClassInnerTab('feedback')}
              className={`py-3 px-3 text-xs sm:text-sm font-semibold transition-all relative whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                classInnerTab === 'feedback'
                  ? 'text-[#2563EB] font-bold'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Feedback</span>
              {classInnerTab === 'feedback' && (
                <motion.div layoutId="activeInnerTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB]" />
              )}
            </button>

          </div>

          {/* 3. SUB-TAB VIEWPORT CONTENTS */}
          <div className="bg-white rounded-b-xl border border-t-0 border-[#E2E8F0] shadow-xs min-h-[500px] p-5 sm:p-7">
            
            {/* ----------------------------------------------------
                A. PRE-READ SECTION
               ---------------------------------------------------- */}
            {classInnerTab === 'preread' && (
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E2E8F0] gap-3">
                  <div>
                    <span className="text-xs font-semibold text-[#2563EB] uppercase tracking-wider block">Pre-Class Preparation</span>
                    <h3 className="text-xl font-bold text-[#0F172A] mt-0.5">{activeClass.preRead.title}</h3>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#64748B] bg-[#F1F5F9] px-3 py-1.5 rounded-lg shrink-0">
                    <Clock className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>{activeClass.preRead.readTime}</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/60 text-xs sm:text-sm text-[#1E3A8A] leading-relaxed">
                  <p className="font-semibold mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span>Core Intuition & Class Goals</span>
                  </p>
                  <p>{activeClass.preRead.summary}</p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-[#0F172A]">Key Concepts to Master Before Lecture:</h4>
                  <ul className="space-y-2">
                    {activeClass.preRead.keyPoints.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#334155]">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {activeClass.preRead.codeExample && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase text-[#64748B] tracking-wider">Cheat Sheet & Syntax Reference:</h4>
                    <pre className="p-4 rounded-xl bg-[#0F172A] text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed border border-[#334155]">
                      <code>{activeClass.preRead.codeExample}</code>
                    </pre>
                  </div>
                )}

                <div className="pt-4 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3">
                  <button 
                    onClick={() => setClassInnerTab('session')}
                    className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <span>Proceed to Session Recording</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#CBD5E1] text-xs font-semibold text-[#475569] hover:bg-[#F8FAFC] transition-colors cursor-pointer">
                    <Download className="w-4 h-4" />
                    <span>Download Pre-Read PDF Notes</span>
                  </button>
                </div>
              </div>
            )}

            {/* ----------------------------------------------------
                B. SESSION (LIVE / RECORDED CLASS) SECTION
               ---------------------------------------------------- */}
            {classInnerTab === 'session' && (
              <div className="space-y-8">
                
                {/* 1. Curved Session Recording Hero Banner */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#DCEAFE] via-[#E0E7FF] to-[#DBEAFE] border border-blue-200/80 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
                  
                  {/* Left: Video Preview Thumbnail */}
                  <div 
                    onClick={() => setIsVideoModalOpen(true)}
                    className="relative w-full md:w-80 h-44 rounded-xl bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#0A0F1D] border border-blue-300/60 shadow-md flex flex-col items-center justify-center p-4 text-center cursor-pointer group shrink-0 overflow-hidden"
                  >
                    <div className="text-[10px] text-blue-200 font-mono mb-2">
                      {activeClass.dateFormatted}
                    </div>
                    <div className="text-white text-xs font-bold px-2 line-clamp-2 mb-3">
                      {activeClass.title}
                    </div>

                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md group-hover:scale-110 group-hover:bg-white text-white group-hover:text-[#2563EB] border border-white/40 flex items-center justify-center transition-all shadow-lg">
                      <Play className="w-6 h-6 ml-0.5 fill-current" />
                    </div>

                    <div className="absolute bottom-2 right-2 text-[10px] text-white/80 bg-black/60 px-2 py-0.5 rounded font-mono">
                      {activeClass.session.duration}
                    </div>
                  </div>

                  {/* Right: Session Info & Watch Button */}
                  <div className="flex-1 space-y-3">
                    <span className="inline-block px-3 py-1 rounded-md bg-[#F59E0B] text-white font-extrabold text-xs uppercase tracking-wider shadow-xs">
                      Session Recording
                    </span>

                    <h3 className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight">
                      {activeClass.session.title}
                    </h3>

                    <div className="flex items-center gap-2 text-xs sm:text-sm text-[#475569] font-medium">
                      <Calendar className="w-4 h-4 text-[#2563EB]" />
                      <span>{activeClass.session.time}</span>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => setIsVideoModalOpen(true)}
                        className="px-6 py-3 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white font-bold text-xs sm:text-sm shadow-md shadow-rose-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        <span>Watch Recording</span>
                      </button>
                    </div>
                  </div>

                </div>

                {/* 2. Rewards Coins Strip */}
                <div className="flex flex-wrap items-center gap-4 text-xs">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E]">
                    <div className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold">
                      $
                    </div>
                    <span className="font-bold">{activeClass.session.attendanceCoins} Coins</span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      Added for full live attendance
                    </span>
                  </div>

                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E]">
                    <div className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold">
                      $
                    </div>
                    <span className="font-bold">{activeClass.session.archiveCoins} Coins</span>
                    <span className="text-[#B45309]">Watch archived session.</span>
                  </div>
                </div>

                {/* 3. Revise with Flashcards */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-extrabold text-[#0F172A] tracking-tight">
                        Revise with Flashcards
                      </h3>
                      <p className="text-xs text-[#64748B]">Rapid revision to solidify class logic</p>
                    </div>

                    <div className="text-xs text-[#64748B] font-mono">
                      {currentFlashcardIndex + 1} / {activeClass.session.flashcards.length}
                    </div>
                  </div>

                  {activeClass.session.flashcards.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                      
                      {/* Main Flip Card */}
                      <div className="md:col-span-8">
                        <div
                          onClick={() => setIsFlashcardFlipped(!isFlashcardFlipped)}
                          className="min-h-[180px] p-6 rounded-2xl border-2 border-dashed border-[#CBD5E1] bg-[#F8FAFC] hover:border-[#2563EB] transition-all cursor-pointer flex flex-col justify-between group shadow-xs"
                        >
                          <div className="flex items-center justify-between text-xs text-[#64748B]">
                            <span className="font-mono uppercase font-bold text-[#2563EB]">
                              {isFlashcardFlipped ? 'ANSWER' : 'QUESTION'}
                            </span>
                            <span className="text-[11px] group-hover:text-[#2563EB] flex items-center gap-1">
                              <RotateCcw className="w-3.5 h-3.5" />
                              Click to flip
                            </span>
                          </div>

                          <div className="my-auto py-4 text-center">
                            <p className="text-base sm:text-lg font-bold text-[#0F172A]">
                              {isFlashcardFlipped 
                                ? activeClass.session.flashcards[currentFlashcardIndex].answer
                                : activeClass.session.flashcards[currentFlashcardIndex].question}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0]">
                            <button
                              disabled={currentFlashcardIndex === 0}
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsFlashcardFlipped(false);
                                setCurrentFlashcardIndex(prev => Math.max(0, prev - 1));
                              }}
                              className="px-3 py-1.5 rounded-lg border border-[#CBD5E1] text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white cursor-pointer"
                            >
                              Previous
                            </button>

                            <button
                              disabled={currentFlashcardIndex === activeClass.session.flashcards.length - 1}
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsFlashcardFlipped(false);
                                setCurrentFlashcardIndex(prev => Math.min(activeClass.session.flashcards.length - 1, prev + 1));
                              }}
                              className="px-4 py-1.5 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Side Match Game Card */}
                      <div className="md:col-span-4 p-5 rounded-2xl bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] border border-blue-200 flex flex-col justify-between">
                        <div>
                          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold mb-2">
                            <Sparkles className="w-4 h-4" />
                          </div>
                          <h4 className="text-sm font-bold text-[#1E3A8A]">Test with a Match Game</h4>
                          <p className="text-xs text-[#475569] mt-1 leading-relaxed">
                            Match operators, types, and logic blocks against the clock to boost problem-solving speed.
                          </p>
                        </div>

                        <button 
                          onClick={() => setClassInnerTab('assignment')}
                          className="mt-4 w-full py-2.5 rounded-xl bg-white hover:bg-blue-50 text-[#2563EB] font-bold text-xs border border-blue-300 shadow-xs transition-colors cursor-pointer"
                        >
                          Jump to Assignments
                        </button>
                      </div>

                    </div>
                  )}
                </div>

              </div>
            )}

            {/* ----------------------------------------------------
                C. ASSIGNMENT SECTION
               ---------------------------------------------------- */}
            {classInnerTab === 'assignment' && (
              <div className="space-y-5">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
                  <div>
                    <h3 className="text-lg font-bold text-[#0F172A]">Class Assignments</h3>
                    <p className="text-xs text-[#64748B]">Solve coding problems to boost your Problem Solving Percentage (PSP)</p>
                  </div>

                  <div className="text-xs text-emerald-600 font-bold bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5 self-start sm:self-auto">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{activeClass.assignments.filter(a => a.status === 'Solved').length} / {activeClass.assignments.length} Solved</span>
                  </div>
                </div>

                {/* Left Question Numbers (All, Q1, Q2...) + Right Problems Table */}
                <div className="flex flex-col md:flex-row gap-5 items-start">
                  
                  {/* Left Question Strip */}
                  <div className="w-full md:w-20 flex md:flex-col gap-1.5 overflow-x-auto md:overflow-visible shrink-0 pb-2 md:pb-0">
                    <button
                      onClick={() => setSelectedQuestionFilter('all')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        selectedQuestionFilter === 'all'
                          ? 'bg-[#2563EB] text-white shadow-xs font-bold'
                          : 'bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0]'
                      }`}
                    >
                      All
                    </button>

                    {activeClass.assignments.map((item) => {
                      const isSelected = selectedQuestionFilter === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setSelectedQuestionFilter(item.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-between gap-1 ${
                            isSelected
                              ? 'bg-[#2563EB] text-white shadow-xs font-bold'
                              : 'bg-[#F8FAFC] text-[#475569] border border-[#E2E8F0] hover:border-[#CBD5E1]'
                          }`}
                        >
                          <span>{item.id}</span>
                          {item.status === 'Solved' && (
                            <Check className={`w-3 h-3 stroke-[3] ${isSelected ? 'text-white' : 'text-emerald-500'}`} />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Right Table View */}
                  <div className="flex-1 w-full overflow-x-auto rounded-xl border border-[#E2E8F0]">
                    <table className="w-full text-left text-xs text-[#0F172A] border-collapse min-w-[700px]">
                      
                      <thead className="bg-[#F8FAFC] text-[#64748B] border-b border-[#E2E8F0] uppercase text-[10px] font-bold tracking-wider">
                        <tr>
                          <th className="py-3 px-4">Name of the Problem</th>
                          <th className="py-3 px-3">Type</th>
                          <th className="py-3 px-3">Difficulty</th>
                          <th className="py-3 px-3">Score</th>
                          <th className="py-3 px-3">Status</th>
                          <th className="py-3 px-3">Submissions</th>
                          <th className="py-3 px-3">Asked In</th>
                          <th className="py-3 px-3 text-center">Actions</th>
                          <th className="py-3 px-4 text-right">Solved By</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-[#E2E8F0] bg-white">
                        {activeAssignments.map((problem) => (
                          <tr key={problem.id} className="hover:bg-[#F8FAFC]/80 transition-colors">
                            
                            <td className="py-3.5 px-4 font-semibold text-[#0F172A]">
                              <button
                                onClick={() => handleOpenProblem(problem)}
                                className="text-left hover:text-[#2563EB] transition-colors cursor-pointer"
                              >
                                {problem.title}
                              </button>
                            </td>

                            <td className="py-3.5 px-3">
                              <span className="p-1 rounded bg-[#F1F5F9] text-[#64748B] font-mono font-bold text-[11px]">
                                {problem.type === 'code' ? '</>' : '::'}
                              </span>
                            </td>

                            <td className="py-3.5 px-3">
                              <span className={`text-[11px] font-semibold ${
                                problem.difficulty === 'Very Easy' || problem.difficulty === 'Easy'
                                  ? 'text-emerald-600'
                                  : problem.difficulty === 'Medium'
                                  ? 'text-amber-600'
                                  : 'text-rose-600'
                              }`}>
                                {problem.difficulty}
                              </span>
                            </td>

                            <td className="py-3.5 px-3 font-mono font-medium text-[#475569]">
                              {problem.score}
                            </td>

                            <td className="py-3.5 px-3">
                              {problem.status === 'Solved' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                                  <Check className="w-3 h-3 stroke-[3]" />
                                  <span>Solved</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold">
                                  <span>Unsolved</span>
                                </span>
                              )}
                            </td>

                            <td className="py-3.5 px-3 text-[#64748B]">
                              {problem.submissions} submissions
                            </td>

                            <td className="py-3.5 px-3 text-[#64748B]">
                              {problem.askedIn || '-'}
                            </td>

                            <td className="py-3.5 px-3">
                              <div className="flex items-center justify-center gap-2">
                                <button className="p-1 text-[#94A3B8] hover:text-[#0F172A] transition-colors cursor-pointer" title="Bookmark">
                                  <Bookmark className="w-3.5 h-3.5" />
                                </button>
                                <button className="p-1 text-[#94A3B8] hover:text-[#0F172A] transition-colors cursor-pointer" title="Hints">
                                  <HelpCircle className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleOpenProblem(problem)}
                                  className="px-3.5 py-1 rounded-md bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                                >
                                  Solve
                                </button>
                              </div>
                            </td>

                            <td className="py-3.5 px-4 text-right font-mono text-[#475569]">
                              {problem.solvedBy}
                            </td>

                          </tr>
                        ))}
                      </tbody>

                    </table>
                  </div>

                </div>

                <div className="pt-2 text-[11px] text-[#64748B] italic">
                  All the problems are mandatory to solve and will count towards your PSP (Problem Solving Percentage)
                </div>

              </div>
            )}

            {/* ----------------------------------------------------
                D. ADDITIONAL PROBLEMS SECTION
               ---------------------------------------------------- */}
            {classInnerTab === 'additional' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                  <div>
                    <h3 className="text-lg font-bold text-[#0F172A]">Additional Practice Problems</h3>
                    <p className="text-xs text-[#64748B]">Extra challenge questions to test advanced edge cases and interview readiness</p>
                  </div>
                </div>

                <div className="rounded-xl border border-[#E2E8F0] overflow-x-auto">
                  <table className="w-full text-left text-xs text-[#0F172A] border-collapse min-w-[700px]">
                    <thead className="bg-[#F8FAFC] text-[#64748B] border-b border-[#E2E8F0] uppercase text-[10px] font-bold tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Problem Name</th>
                        <th className="py-3 px-3">Difficulty</th>
                        <th className="py-3 px-3">Score</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3">Company Tag</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0] bg-white">
                      {activeClass.additionalProblems.map((prob) => (
                        <tr key={prob.id} className="hover:bg-[#F8FAFC]">
                          <td className="py-3 px-4 font-semibold text-[#0F172A]">{prob.title}</td>
                          <td className="py-3 px-3 font-semibold text-emerald-600">{prob.difficulty}</td>
                          <td className="py-3 px-3 font-mono">{prob.score}</td>
                          <td className="py-3 px-3">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[11px] font-bold">
                              <Check className="w-3 h-3" /> Solved
                            </span>
                          </td>
                          <td className="py-3 px-3 text-[#64748B]">{prob.askedIn}</td>
                          <td className="py-3 px-4 text-right">
                            <button 
                              onClick={() => setActiveProblemModal(prob)}
                              className="px-3 py-1 rounded bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer"
                            >
                              Review
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ----------------------------------------------------
                E. FEEDBACK SECTION
               ---------------------------------------------------- */}
            {classInnerTab === 'feedback' && (
              <div className="max-w-2xl mx-auto space-y-5 py-4">
                <div className="text-center space-y-1">
                  <h3 className="text-lg font-bold text-[#0F172A]">Class & Instructor Feedback</h3>
                  <p className="text-xs text-[#64748B]">Help your instructor and mentor tailor upcoming live cohorts to your pace</p>
                </div>

                {feedbackSubmitted ? (
                  <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                    <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
                    <h4 className="text-base font-bold text-emerald-900">Thank you for your feedback!</h4>
                    <p className="text-xs text-emerald-700">Your response has been logged and shared with the academic dean.</p>
                  </div>
                ) : (
                  <div className="space-y-4 p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
                    <div>
                      <label className="block text-xs font-semibold text-[#334155] mb-2">How satisfied were you with this lecture?</label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setFeedbackRating(star)}
                            className="p-1 hover:scale-110 transition-transform cursor-pointer"
                          >
                            <Star className={`w-6 h-6 ${
                              star <= feedbackRating ? 'text-amber-400 fill-amber-400' : 'text-[#CBD5E1]'
                            }`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#334155] mb-1.5">What did you like most or need extra help with?</label>
                      <textarea
                        rows={4}
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        placeholder="e.g. Loved the practical demos on joins, but would like 1 more practice session on window functions..."
                        className="w-full p-3 rounded-xl border border-[#CBD5E1] bg-white text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
                      />
                    </div>

                    <button
                      onClick={() => setFeedbackSubmitted(true)}
                      className="w-full py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Class Feedback</span>
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* 4. BOTTOM CLASS PAGINATION FOOTER */}
          <div className="flex items-center justify-between text-xs font-semibold pt-2 text-[#2563EB]">
            <button
              onClick={() => handleNavigateClass('prev')}
              className="flex items-center gap-1.5 hover:underline cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Class</span>
            </button>

            <button
              onClick={() => handleNavigateClass('next')}
              className="flex items-center gap-1.5 hover:underline cursor-pointer"
            >
              <span>Next Class</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* ========================================================
          VIDEO RECORDING PLAYER MODAL
         ======================================================== */}
      <AnimatePresence>
        {isVideoModalOpen && activeClass && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-4xl bg-[#0B1120] text-white rounded-2xl border border-[#1E293B] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-4 bg-[#101A2E] border-b border-[#1E293B] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-rose-500" />
                  <span className="text-xs font-bold font-mono text-rose-400">SESSION RECORDING</span>
                  <span className="text-xs text-[#94A3B8]">·</span>
                  <h4 className="text-xs font-bold text-white truncate max-w-md">{activeClass.title}</h4>
                </div>
                <button
                  onClick={() => setIsVideoModalOpen(false)}
                  className="p-1 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#1E293B] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="relative aspect-video bg-black flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-rose-600/30 border border-rose-500 flex items-center justify-center text-white mb-4 animate-pulse">
                  <Play className="w-8 h-8 fill-white ml-1" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{activeClass.title}</h3>
                <p className="text-xs text-[#94A3B8] max-w-md">
                  Recorded Live Lecture · {activeClass.session.duration} · Full HD 1080p Stream
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <span className="text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-full font-mono">
                    Attendance Verified (100%)
                  </span>
                  <span className="text-xs text-amber-400 bg-amber-950/60 border border-amber-500/40 px-3 py-1 rounded-full font-mono">
                    +8 Coins Credited
                  </span>
                </div>
              </div>

              <div className="p-4 bg-[#101A2E] border-t border-[#1E293B] flex items-center justify-between text-xs text-[#94A3B8]">
                <span>Speed: 1.0x · Subtitles: English</span>
                <button 
                  onClick={() => setIsVideoModalOpen(false)}
                  className="px-4 py-1.5 rounded-lg bg-[#2563EB] hover:bg-blue-600 text-white font-semibold cursor-pointer"
                >
                  Close Player
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================
          PROBLEM SOLVER & SOLUTION MODAL
         ======================================================== */}
      <AnimatePresence>
        {activeProblemModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-3xl bg-white text-[#0F172A] rounded-2xl border border-[#CBD5E1] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-4 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded bg-blue-100 text-blue-700 font-mono text-xs font-bold">
                    {activeProblemModal.id}
                  </span>
                  <h4 className="text-sm font-bold text-[#0F172A]">{activeProblemModal.title}</h4>
                </div>
                <button
                  onClick={() => setActiveProblemModal(null)}
                  className="p-1 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="flex items-center gap-3 text-xs">
                  <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {activeProblemModal.difficulty}
                  </span>
                  <span className="text-[#64748B]">Score: <strong className="text-[#0F172A] font-mono">{activeProblemModal.score}</strong></span>
                  <span className="text-[#64748B]">Company: <strong className="text-[#0F172A]">{activeProblemModal.askedIn || 'Standard Tech'}</strong></span>
                </div>

                <div className="space-y-1.5">
                  <h5 className="text-xs font-bold uppercase text-[#64748B] tracking-wider">Problem Statement:</h5>
                  <p className="text-xs sm:text-sm text-[#334155] leading-relaxed p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                    {activeProblemModal.description}
                  </p>
                </div>

                {/* Multiple Choice Options or Text Input */}
                {activeProblemModal.options && activeProblemModal.options.length > 0 ? (
                  <div className="space-y-2">
                    <h5 className="text-xs font-bold uppercase text-[#64748B] tracking-wider">Select Your Answer:</h5>
                    <div className="grid grid-cols-1 gap-2">
                      {activeProblemModal.options.map((option, idx) => {
                        const isSelected = selectedAnswer === option;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setSelectedAnswer(option)}
                            className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${
                              isSelected
                                ? 'bg-blue-50 border-[#2563EB] text-[#1E40AF] ring-2 ring-blue-500/20'
                                : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#334155] hover:border-[#CBD5E1]'
                            }`}
                          >
                            <span>{option}</span>
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected ? 'border-[#2563EB] bg-[#2563EB]' : 'border-[#94A3B8]'
                            }`}>
                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <h5 className="text-xs font-bold uppercase text-[#64748B] tracking-wider">Your Answer / Code:</h5>
                    <textarea
                      value={selectedAnswer}
                      onChange={(e) => setSelectedAnswer(e.target.value)}
                      placeholder="Write your answer or code query here..."
                      rows={4}
                      className="w-full p-3 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-xs sm:text-sm text-[#0F172A] font-mono focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                    />
                  </div>
                )}

                {/* Submission Feedback Banner */}
                {submissionFeedback && (
                  <div className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-xs ${
                    submissionFeedback.status === 'correct'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : submissionFeedback.status === 'incorrect'
                      ? 'bg-rose-50 border-rose-200 text-rose-800'
                      : 'bg-amber-50 border-amber-200 text-amber-800'
                  }`}>
                    {submissionFeedback.status === 'correct' ? (
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 stroke-[3]" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-bold">{submissionFeedback.message}</p>
                      {submissionFeedback.explanation && (
                        <p className="mt-1 text-[11px] opacity-90">{submissionFeedback.explanation}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Submitted / Verified Solution Section */}
                {activeProblemModal.solutionSnippet && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-bold uppercase text-[#64748B] tracking-wider">Solution Explanation:</h5>
                      {activeProblemModal.isCorrect && (
                        <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                          <Check className="w-3 h-3 stroke-[3]" /> Verified Correct
                        </span>
                      )}
                    </div>
                    <pre className="p-4 rounded-xl bg-[#0F172A] text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed border border-[#334155]">
                      <code>{activeProblemModal.solutionSnippet}</code>
                    </pre>
                  </div>
                )}
              </div>

              <div className="p-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between text-xs">
                <span className="text-[#64748B]">
                  {activeProblemModal.myAnswer ? `Status: ${activeProblemModal.status}` : 'Not yet submitted'}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveProblemModal(null)}
                    className="px-3.5 py-1.5 rounded-lg border border-[#CBD5E1] hover:bg-[#F1F5F9] text-[#475569] font-semibold cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={isSubmittingAnswer || !selectedAnswer.trim()}
                    className="px-4 py-1.5 rounded-lg bg-[#2563EB] hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold cursor-pointer flex items-center gap-1.5"
                  >
                    {isSubmittingAnswer ? (
                      <>
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Answer</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
