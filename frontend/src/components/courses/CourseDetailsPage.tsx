import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../../api';
import { NavigationRoute } from '../../types';
import { 
  ArrowRight, 
  Download, 
  Check, 
  MessageSquare,
  Terminal,
  FileSpreadsheet,
  BarChart2,
  BrainCircuit,
  TrendingUp,
  Sparkles,
  Layers,
  Cpu,
  Clock,
  CalendarDays,
  Video,
  Users,
  ChevronLeft,
} from 'lucide-react';
import { MentorCarousel } from '../common/MentorCarousel';

interface CurriculumPhaseItem {
  icon: React.ElementType;
  title: string;
  desc: string;
}

interface CurriculumPhase {
  tag: string;
  perk: string;
  title: string;
  desc: string;
  project: string;
  items: CurriculumPhaseItem[];
}

interface ProgramSlide {
  id: string;
  shortTitle: string;
  tabLabel: string;
  fullTitle: string;
  kicker: string;
  levelBadge: string;
  audienceBadge: string;
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  salePrice: string;
  originalPrice: string;
  discountBadge: string;
  saveAmountText: string;
  discountPercentText: string;
  duration: string;
  highlights: { label: string; color: string }[];
  curriculumBadge: string;
  curriculumDuration: string;
  curriculumTitle: string;
  curriculumDesc: string;
  phase1: CurriculumPhase;
  phase2: CurriculumPhase;
}

// Maps each slide to the course slug the backend sells (see prisma/seed.ts).
const COURSE_SLUGS: Record<string, string> = {
  'data-analyst-genai': 'data-analyst-with-gen-ai',
  dsml: 'data-science-ml-gen-ai',
};

const formatInr = (rupees: number) => `₹${rupees.toLocaleString('en-IN')}`;

export const PROGRAM_SLIDES: ProgramSlide[] = [
  {
    id: 'data-analyst-genai',
    shortTitle: 'Data Analyst + GenAI',
    tabLabel: 'Data Analyst + GenAI',
    fullTitle: 'Data Analyst + GenAI Career Track',
    kicker: 'CodeMyWay Flagship Program',
    levelBadge: 'Beginner to Advanced',
    audienceBadge: 'No Prior Coding Required',
    titleLine1: 'Data Analyst + GenAI',
    titleLine2: 'Career Track.',
    subtitle: 'Master modern business intelligence, SQL schema querying, advanced spreadsheet modeling, Python scientific dataframes, and automated GenAI analytical workflows.',
    salePrice: '₹24,999',
    originalPrice: '₹36,000',
    discountBadge: '30% OFF · Save ₹11,000',
    saveAmountText: 'Save ₹11,000',
    discountPercentText: '30% OFF',
    duration: '24 Weeks (6 Months)',
    highlights: [
      { label: '24 Weeks (6 Months)', color: '#F1C40F' },
      { label: 'Live Cohort + 1:5 Lab Pods', color: '#9B59B6' },
      { label: '1 to 1 Dedicated Mentorship', color: '#2ECC71' },
      { label: '100% Placement Backing', color: '#38BDF8' },
    ],
    curriculumBadge: '24-Week Career Transformation',
    curriculumDuration: '24-Week Career Transformation',
    curriculumTitle: 'Data Analyst + GenAI',
    curriculumDesc: 'Two progressive 12-week phases designed to take you from raw data foundations to production Python, rigorous statistical thinking, and modern GenAI workflows.',
    phase1: {
      tag: 'Phase 1 · Weeks 1–12',
      perk: '4 Free 1:1 Mentorship Sessions',
      title: 'Analytical Foundations & Core Tooling',
      desc: 'Establish unbreakable relational database mastery, automated ETL pipelines, and executive BI dashboards.',
      project: 'Major Project 1 + Mock Interview 1',
      items: [
        { icon: Terminal, title: 'SQL Mastery:', desc: 'Joins, window functions, schema normalization & subqueries' },
        { icon: FileSpreadsheet, title: 'Advanced Excel & Power Query:', desc: 'Dynamic arrays (XLOOKUP, LAMBDA) & ETL pipelines' },
        { icon: BarChart2, title: 'Tableau BI Storytelling:', desc: 'Executive KPI dashboards & parameterized stories' },
        { icon: BrainCircuit, title: 'GenAI Product Analysis:', desc: 'Automated SQL drafting & rapid cohort analytics' },
      ]
    },
    phase2: {
      tag: 'Phase 2 · Weeks 13–24',
      perk: '4 Free 1:1 Mentorship Sessions',
      title: 'Applied Python & Statistical Intelligence',
      desc: 'Advance from business reports to automated programming, vector dataframes, and rigorous hypothesis testing.',
      project: 'Major Project 2 + Mock Interview 2',
      items: [
        { icon: Terminal, title: 'Python Programming:', desc: 'Data structures, functions, clean scripts & error handling' },
        { icon: Layers, title: 'NumPy & Pandas:', desc: 'Multi-index dataframes, vectorization & statistical plots' },
        { icon: TrendingUp, title: 'Statistics & Probability:', desc: 'Hypothesis testing, p-values, t-tests & ANOVA' },
        { icon: BrainCircuit, title: 'A/B Testing & Product Experiments:', desc: 'Sample sizing, statistical power & decision memos' },
      ]
    }
  },
  {
    id: 'dsml',
    shortTitle: 'Data Science and Machine Learning + GenAI',
    tabLabel: 'Data Science & ML + GenAI',
    fullTitle: 'Data Science and Machine Learning + GenAI Career Track',
    kicker: 'CodeMyWay Advanced Fellowship',
    levelBadge: 'Foundations to Advanced AI',
    audienceBadge: 'Math & Logic Foundations',
    titleLine1: 'Data Science & Machine Learning',
    titleLine2: '+ GenAI Career Track.',
    subtitle: 'Master 12 months of production ML pipelines, mathematical foundations, deep neural networks, transformer LLM fine-tuning, agentic AI, and scalable cloud MLOps architectures.',
    salePrice: '₹49,999',
    originalPrice: '₹82,999',
    discountBadge: '40% OFF · Save ₹33,000',
    saveAmountText: 'Save ₹33,000',
    discountPercentText: '40% OFF',
    duration: '12 Month Course (1 Year)',
    highlights: [
      { label: '12 Months (1 Year)', color: '#F1C40F' },
      { label: 'Live GPU Clusters & AI Labs', color: '#9B59B6' },
      { label: '1 to 1 FAANG / AI Mentors', color: '#2ECC71' },
      { label: '100% Placement Backing', color: '#38BDF8' },
    ],
    curriculumBadge: '12-Month Comprehensive Fellowship',
    curriculumDuration: '12-Month Intensive Program',
    curriculumTitle: 'Data Science and Machine Learning + GenAI',
    curriculumDesc: 'Comprehensive 12-month roadmap taking you from mathematical foundations and machine learning algorithms to deep learning, PyTorch, LLMs, and enterprise cloud MLOps.',
    phase1: {
      tag: 'Phase 1 · Months 1–6 (Weeks 1–24)',
      perk: '6 Free 1:1 Mentorship Sessions',
      title: 'Applied Machine Learning & Advanced Mathematical Foundations',
      desc: 'Master linear algebra, multivariate calculus, Scikit-Learn algorithms, feature engineering, and statistical inference.',
      project: 'End-to-End Predictive Model + Mock Interview 1',
      items: [
        { icon: Terminal, title: 'Applied Math & Python:', desc: 'Linear algebra, matrix operations, multivariate calculus & NumPy optimizations' },
        { icon: TrendingUp, title: 'Supervised & Unsupervised ML:', desc: 'Regression, classification, random forests, XGBoost, PCA & clustering' },
        { icon: Layers, title: 'Feature Engineering & EDA:', desc: 'Imputation, categorical encoding, outlier handling & automated pipelines' },
        { icon: BrainCircuit, title: 'Model Evaluation & Tuning:', desc: 'Cross-validation, ROC-AUC, Hyperopt, Optuna & bias-variance trade-offs' },
      ]
    },
    phase2: {
      tag: 'Phase 2 · Months 7–12 (Weeks 25–48)',
      perk: '6 Free 1:1 Mentorship Sessions',
      title: 'Deep Learning, GenAI Transformers & Production MLOps',
      desc: 'Build production-grade deep learning systems with PyTorch, fine-tune transformer models, and deploy scalable inference APIs.',
      project: 'LLM / Deep Learning Capstone + System Design Interview',
      items: [
        { icon: BrainCircuit, title: 'Deep Learning & PyTorch:', desc: 'Backprop, CNNs for computer vision, RNNs, and custom PyTorch training loops' },
        { icon: Sparkles, title: 'Transformers & GenAI LLMs:', desc: 'Attention mechanisms, BERT, GPT, LoRA/PEFT fine-tuning & RAG architectures' },
        { icon: Cpu, title: 'MLOps & Model Deployment:', desc: 'FastAPI microservices, Docker containerization, MLflow tracking & CI/CD' },
        { icon: BarChart2, title: 'Cloud Scale & Monitoring:', desc: 'Cloud GPU inference, drift detection, Prometheus monitoring & latency optimization' },
      ]
    }
  }
];

// Shared hover treatment: cards lift and glow in the site's purple.
const HOVER_CARD = 'transition-all duration-300 hover:-translate-y-1 hover:border-[#C084FC] hover:bg-[#1A1030] hover:shadow-[0_0_30px_rgba(192,132,252,0.22)]';

// Copy for the individual program page, one entry per program.
const DETAIL: Record<string, {
  heroTitle: string;
  heroSub: string;
  durationLabel: string;
  audience: { title: string; desc: string }[];
  tools: string[];
  inclusions: string[];
  faqs: { q: string; a: string }[];
}> = {
  'data-analyst-genai': {
    heroTitle: 'Become Confident in Data Analytics and AI-Powered Workflows.',
    heroSub: '24-week mentor-led program with practical assignments, business projects and career preparation.',
    durationLabel: '24 Weeks',
    audience: [
      { title: 'Beginners', desc: 'No prior coding is required. You start from raw data foundations and build up step by step.' },
      { title: 'Career switchers', desc: 'Move into analytics from another field with a structured path, projects and mock interviews.' },
      { title: 'Working professionals', desc: 'Already comfortable with spreadsheets? Add SQL, Python, BI dashboards and GenAI to your toolkit.' },
    ],
    tools: ['SQL', 'Advanced Excel', 'Power Query', 'Tableau', 'Python', 'NumPy', 'Pandas', 'Statistics', 'A/B Testing', 'GenAI'],
    inclusions: [
      'Live cohort classes with 1:5 lab pods',
      '1 to 1 dedicated mentorship, including 8 free mentor sessions',
      'Two major projects and two mock interviews',
      '100% placement backing',
    ],
    faqs: [
      { q: 'Do I need coding experience?', a: 'No. The program is designed for beginners and takes you from data foundations to Python.' },
      { q: 'How long is the program?', a: '24 weeks (6 months), delivered as two 12-week phases.' },
      { q: 'Will I get mentor support?', a: 'Yes. You get dedicated 1 to 1 mentorship, with 4 free mentor sessions in each phase.' },
      { q: 'How do I enroll?', a: 'Click Enroll Now to complete checkout, or talk to a mentor first if you have questions.' },
    ],
  },
  dsml: {
    heroTitle: 'Build Production-Ready Machine Learning and GenAI Skills.',
    heroSub: '12-month mentor-led program covering machine learning, deep learning, LLMs and deployment, with capstone projects and career preparation.',
    durationLabel: '12 Months',
    audience: [
      { title: 'Analysts levelling up', desc: 'Already working with data and ready to move into predictive modelling and machine learning.' },
      { title: 'Engineers and graduates', desc: 'Comfortable with math and logic and aiming for a data science or AI engineering role.' },
      { title: 'Ambitious career builders', desc: 'Want a full-year, in-depth path from foundations to deployed GenAI systems.' },
    ],
    tools: ['Python', 'Linear Algebra', 'Scikit-Learn', 'XGBoost', 'Feature Engineering', 'PyTorch', 'Transformers', 'LLM Fine-tuning', 'RAG', 'FastAPI', 'Docker', 'MLflow'],
    inclusions: [
      'Live GPU clusters and AI labs',
      '1 to 1 mentorship with FAANG / AI mentors, including 12 free mentor sessions',
      'End-to-end predictive model and LLM / deep learning capstone',
      '100% placement backing',
    ],
    faqs: [
      { q: 'What background do I need?', a: 'Math and logic foundations help. The first phase covers applied math and Python before machine learning.' },
      { q: 'How long is the program?', a: '12 months (1 year), delivered as two 6-month phases.' },
      { q: 'Will I get mentor support?', a: 'Yes. You get 1 to 1 mentorship, with 6 free mentor sessions in each phase.' },
      { q: 'How do I enroll?', a: 'Click Enroll Now to complete checkout, or talk to a mentor first if you have questions.' },
    ],
  },
};

interface CourseDetailsPageProps {
  onRouteChange: (route: NavigationRoute) => void;
  onOpenBrochure: (programTitle?: string) => void;
  onOpenMentorModal: (programTitle?: string) => void;
  onOpenBuyNowModal: (details?: {
    courseSlug: string;
    title: string;
  }) => void;
}

// Card copy for the catalog (the long-form copy stays in PROGRAM_SLIDES for the curriculum).
const CATALOG_CARD: Record<string, { badge: string; name: string; blurb: string; duration: string; skills: string[] }> = {
  'data-analyst-genai': {
    badge: 'Beginner friendly',
    name: 'Data Analyst + GenAI',
    blurb: 'Build analytical skills with SQL, Python, dashboards and practical AI workflows.',
    duration: '24 Weeks · 6 Months',
    skills: ['SQL', 'Python', 'Excel', 'Tableau', 'GenAI'],
  },
  dsml: {
    badge: 'Advanced pathway',
    name: 'Data Science & ML + GenAI',
    blurb: 'Develop deeper skills in machine learning, data science and AI-driven applications.',
    duration: '12 Months · 1 Year',
    skills: ['Python', 'Statistics', 'ML', 'Deep Learning', 'GenAI'],
  },
};

// Programs with live prices from the backend, so every page matches what checkout charges.
export const usePricedPrograms = () => {
  // Prices come from the backend so the page always matches what checkout charges.
  const [prices, setPrices] = useState<Record<string, { price: number; priceOriginal: number | null }> | 'failed' | null>(null);

  useEffect(() => {
    api<{ courses: { slug: string; price: number; priceOriginal: number | null }[] }>('/public/courses')
      .then(({ courses }) => setPrices(Object.fromEntries(courses.map((c) => [c.slug, c]))))
      .catch(() => setPrices('failed'));
  }, []);

  // The saving is shown in rupees, worked out from the listed prices, so it can never
  // disagree with the numbers beside it (a rounded percent can).
  const slides = useMemo(() => PROGRAM_SLIDES.map((slide) => {
    const course = prices && prices !== 'failed' ? prices[COURSE_SLUGS[slide.id]] : undefined;
    if (!course) {
      const text = prices === 'failed' || prices ? '—' : '…';
      return { ...slide, salePrice: text, originalPrice: '', discountBadge: '', saveAmountText: '', discountPercentText: '' };
    }
    const sale = formatInr(course.price);
    if (!course.priceOriginal || course.priceOriginal <= course.price) {
      return { ...slide, salePrice: sale, originalPrice: '', discountBadge: '', saveAmountText: '', discountPercentText: '' };
    }
    const save = `Save ${formatInr(course.priceOriginal - course.price)}`;
    return { ...slide, salePrice: sale, originalPrice: formatInr(course.priceOriginal), discountBadge: save, saveAmountText: save, discountPercentText: '' };
  }), [prices]);
  return slides;
};

export type PricedProgram = ReturnType<typeof usePricedPrograms>[number];

export const ProgramCards: React.FC<{ slides: PricedProgram[]; onSelect: (id: string) => void }> = ({ slides, onSelect }) => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {slides.map((slide, idx) => {
            const card = CATALOG_CARD[slide.id];
            const featured = idx === 0;
            return (
              <article
                key={slide.id}
                className={`${HOVER_CARD} group flex flex-col rounded-3xl overflow-hidden border border-[#5C4B8A]/50 bg-[#150E24]`}
              >
                {/* Top: badge, title, blurb */}
                <div className="bg-[#2A1744]/60 p-6">
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${featured ? 'bg-emerald-950/70 text-emerald-400' : 'bg-white/10 text-white'}`}>
                      {card.badge}
                    </span>
                    {idx === 0 ? <BarChart2 className="w-5 h-5 text-[#C084FC]" /> : <BrainCircuit className="w-5 h-5 text-[#C084FC]" />}
                  </div>
                  <h2 className="mt-5 text-xl sm:text-2xl font-bold font-['Sora']">{card.name}</h2>
                  <p className="mt-2 text-sm text-[#D1CADB] leading-relaxed">{card.blurb}</p>
                </div>

                {/* Middle: duration + skills */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Clock className="w-4 h-4 text-[#C084FC]" />
                    <span>{card.duration}</span>
                  </div>

                  <div className="mt-5 text-xs text-[#A7A0B5]">Skills you will learn</div>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {card.skills.map((s) => (
                      <li key={s} className="px-3 py-1 rounded-full bg-[#2A1744] text-xs text-[#E5DDF2]">{s}</li>
                    ))}
                  </ul>

                  {/* Price last */}
                  <div className="mt-6 text-xs text-[#A7A0B5]">Displayed program price</div>
                  <div className="mt-1 flex flex-wrap items-baseline gap-x-3">
                    <span className="text-3xl font-extrabold text-[#F5C518] font-mono">{slide.salePrice}</span>
                    {slide.originalPrice && <span className="text-sm text-[#A7A0B5] line-through font-mono">{slide.originalPrice}</span>}
                    {slide.saveAmountText && <span className="text-xs font-semibold text-emerald-400">{slide.saveAmountText}</span>}
                  </div>
                  <div className="mt-1 mb-5 text-xs text-[#A7A0B5]">Confirm taxes and registration fees</div>

                  <button
                    onClick={() => onSelect(slide.id)}
                    className="w-full mt-auto py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer border border-[#C084FC]/70 text-white group-hover:bg-[#F5C518] group-hover:border-[#F5C518] group-hover:text-[#08070B] hover:bg-[#F1C40F]"
                  >
                    <span>View Program Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
);

export const CourseDetailsPage: React.FC<CourseDetailsPageProps> = ({
  onOpenBrochure,
  onOpenMentorModal,
  onOpenBuyNowModal
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectProgram = (id: string | null) => {
    setSelectedId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const slides = usePricedPrograms();

  const handleBuyNow = (slide: (typeof slides)[number]) => {
    onOpenBuyNowModal({ courseSlug: COURSE_SLUGS[slide.id] ?? slide.id, title: slide.fullTitle });
  };

  const selected = slides.find((s) => s.id === selectedId);
  if (selected) {
    const detail = DETAIL[selected.id];
    const phases = [selected.phase1, selected.phase2];
    const sectionTitle = (n: number, text: string) => (
      <h2 className="text-2xl sm:text-3xl font-bold font-['Sora'] tracking-tight mb-6">
        <span className="text-[#C084FC] mr-3 font-mono text-xl">{String(n).padStart(2, '0')}</span>{text}
      </h2>
    );

    return (
      <div className="space-y-16 sm:space-y-20 pb-20 bg-[#08070B] text-white">

        {/* Hero */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14">
          <button
            onClick={() => selectProgram(null)}
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-[#A7A0B5] hover:text-white transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>All programs</span>
          </button>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C084FC]">{selected.shortTitle}</span>
          <h1 className="mt-3 max-w-3xl text-3xl sm:text-5xl font-extrabold font-['Sora'] tracking-tight leading-tight">{detail.heroTitle}</h1>
          <p className="mt-4 max-w-2xl text-base sm:text-lg text-[#A7A0B5] leading-relaxed">{detail.heroSub}</p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl">
            {[
              { icon: CalendarDays, label: detail.durationLabel },
              { icon: Video, label: 'Live Classes' },
              { icon: Users, label: 'Mentorship' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className={`${HOVER_CARD} flex flex-col items-center gap-2 py-5 rounded-2xl border border-white/10 bg-[#120C20]`}>
                <Icon className="w-5 h-5 text-[#C084FC]" />
                <span className="text-sm font-semibold">{label}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleBuyNow(selected)}
              className="px-6 py-3 text-sm font-bold text-[#08070B] bg-[#F5C518] hover:bg-[#F1C40F] rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
            >
              <span>Enroll Now · {selected.salePrice}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onOpenMentorModal(selected.fullTitle)}
              className="px-5 py-3 text-sm font-semibold text-white border border-white/15 hover:border-[#9B59B6] rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-[#9B59B6]" />
              <span>Talk to a Mentor</span>
            </button>
            <button
              onClick={() => onOpenBrochure(selected.fullTitle)}
              className="px-3 py-3 text-sm text-[#A7A0B5] hover:text-white flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Brochure</span>
            </button>
          </div>
        </section>

        {/* 1. Who should join */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {sectionTitle(1, 'Who should join this program?')}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {detail.audience.map((a) => (
              <div key={a.title} className={`${HOVER_CARD} rounded-2xl border border-white/10 bg-[#120C20] p-6`}>
                <h3 className="font-semibold text-white">{a.title}</h3>
                <p className="mt-2 text-sm text-[#A7A0B5] leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Skills and tools */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {sectionTitle(2, 'Skills and tools you will learn')}
          <ul className="flex flex-wrap gap-3">
            {detail.tools.map((t) => (
              <li key={t} className="px-4 py-2 rounded-full bg-[#2A1744] border border-transparent hover:border-[#C084FC] hover:-translate-y-0.5 transition-all duration-300 text-sm text-[#E5DDF2]">{t}</li>
            ))}
          </ul>
        </section>

        {/* 3. Module-wise curriculum */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {sectionTitle(3, 'Complete module-wise curriculum')}
          <p className="-mt-3 mb-6 max-w-2xl text-sm text-[#A7A0B5] leading-relaxed">{selected.curriculumDesc}</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {phases.map((phase) => (
              <div key={phase.tag} className={`${HOVER_CARD} bg-[#120C20] rounded-2xl p-6 sm:p-7 border border-white/10 flex flex-col`}>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-semibold text-[#F1C40F] font-mono">{phase.tag}</span>
                  <span className="text-[11px] text-emerald-400">{phase.perk}</span>
                </div>
                <h3 className="text-xl font-bold text-white font-['Sora'] mb-1.5">{phase.title}</h3>
                <p className="text-sm text-[#A7A0B5] mb-5 leading-relaxed">{phase.desc}</p>
                <ul className="space-y-3 mb-5">
                  {phase.items.map((item, idx) => {
                    const ItemIcon = item.icon;
                    return (
                      <li key={idx} className="flex items-start gap-3 text-sm">
                        <ItemIcon className="w-4 h-4 text-[#9B59B6] shrink-0 mt-0.5" />
                        <span className="text-[#D1CADB]"><strong className="text-white font-semibold">{item.title} </strong>{item.desc}</span>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-auto pt-3 border-t border-white/10 text-xs text-[#A7A0B5] flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[#2ECC71]" />
                  {phase.project}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Projects */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {sectionTitle(4, 'Projects you will build')}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {phases.map((phase, i) => (
              <div key={phase.tag} className={`${HOVER_CARD} rounded-2xl border border-white/10 bg-[#120C20] p-6`}>
                <span className="text-xs font-semibold text-[#F1C40F] font-mono">{phase.tag}</span>
                <h3 className="mt-2 font-semibold text-white">{phase.project}</h3>
                <p className="mt-2 text-sm text-[#A7A0B5] leading-relaxed">
                  {i === 0 ? 'Applies the first half of the curriculum to a real-world problem, reviewed by your mentor.' : 'Brings the full toolkit together in a portfolio piece you can show to employers.'}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Mentors */}
        <section>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">{sectionTitle(5, 'Meet your mentors')}</div>
          <MentorCarousel />
        </section>

        {/* 6. Schedule and format */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {sectionTitle(6, 'Class schedule and learning format')}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {selected.highlights.map((h) => (
              <div key={h.label} className={`${HOVER_CARD} rounded-2xl border border-white/10 bg-[#120C20] p-5 flex items-center gap-3`}>
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: h.color }} />
                <span className="text-sm font-medium">{h.label}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-[#A7A0B5]">Batch dates and weekly timings are shared with you when you enroll or talk to a mentor.</p>
        </section>

        {/* 7. Fees, inclusions, payment */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {sectionTitle(7, 'Fees, inclusions and payment')}
          <div className={`${HOVER_CARD} rounded-2xl border border-white/10 bg-[#120C20] p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8`}>
            <div>
              <div className="text-xs text-[#A7A0B5]">Program fee</div>
              <div className="mt-1 flex flex-wrap items-baseline gap-x-3">
                <span className="text-4xl font-extrabold text-[#F5C518] font-mono">{selected.salePrice}</span>
                {selected.originalPrice && <span className="text-sm text-[#A7A0B5] line-through font-mono">{selected.originalPrice}</span>}
                {selected.saveAmountText && <span className="text-xs font-semibold text-emerald-400">{selected.saveAmountText}</span>}
              </div>
              <div className="mt-1 text-xs text-[#A7A0B5]">Confirm taxes and registration fees at checkout</div>
              <button
                onClick={() => handleBuyNow(selected)}
                className="mt-6 px-6 py-3 text-sm font-bold text-[#08070B] bg-[#F5C518] hover:bg-[#F1C40F] rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
              >
                <span>Enroll Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <ul className="space-y-3">
              {detail.inclusions.map((inc) => (
                <li key={inc} className="flex items-start gap-2.5 text-sm text-[#D1CADB]">
                  <Check className="w-4 h-4 text-[#2ECC71] shrink-0 mt-0.5" />
                  <span>{inc}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 8. FAQs and enrollment */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {sectionTitle(8, 'FAQs and enrollment')}
          <div className="space-y-3">
            {detail.faqs.map((f) => (
              <details key={f.q} className={`${HOVER_CARD} group rounded-2xl border border-white/10 bg-[#120C20] px-6 py-4`}>
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4 font-semibold text-white">
                  <span>{f.q}</span>
                  <span className="text-[#C084FC] text-xl leading-none group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-3 text-sm text-[#A7A0B5] leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
          <div className="mt-10 text-center">
            <button
              onClick={() => handleBuyNow(selected)}
              className="px-8 py-3.5 text-sm font-bold text-[#08070B] bg-[#F5C518] hover:bg-[#F1C40F] rounded-xl inline-flex items-center gap-2 cursor-pointer transition-colors"
            >
              <span>Enroll Now · {selected.salePrice}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

      </div>
    );
  }

  return (
    <div className="space-y-20 sm:space-y-24 pb-20 bg-[#08070B] text-white">

      {/* 1. PROGRAM CATALOG: both programs side by side, price after the details */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C084FC]">Explore our programs</span>
          <h1 className="mt-3 text-3xl sm:text-4xl font-bold font-['Sora'] tracking-tight">Find the Right Program for Your Career.</h1>
          <p className="mt-4 text-sm sm:text-base text-[#A7A0B5] leading-relaxed">
            Whether you are starting with data analytics or advancing into machine learning, discover practical, mentor-led programs designed around your goals.
          </p>
        </div>

        <ProgramCards slides={slides} onSelect={selectProgram} />
      </section>

      {/* CTA: moved here from the home page */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#2E1A47] via-[#1B102B] to-[#2E1A47] border border-[#5C4B8A]/60 text-white rounded-2xl p-8 sm:p-12 text-center">
          <div className="max-w-2xl mx-auto space-y-5">
            <span className="px-3.5 py-1 bg-[#120A1F] border border-[#5C4B8A]/60 rounded-full text-xs font-medium text-[#F1C40F]">
              Transform Your Career Trajectory
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-['Sora'] text-white">
              Ready to Master Data Analytics & GenAI?
            </h2>
            <p className="text-sm text-[#D1CADB] leading-relaxed">
              Join the upcoming live cohort with structured 4-teacher support, hands-on portfolio projects, and dedicated mock interviews.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-3">
              <button
                onClick={() => selectProgram(PROGRAM_SLIDES[0].id)}
                className="w-full sm:w-auto px-6 py-3.5 text-sm font-bold text-[#08070B] bg-[#F1C40F] hover:bg-[#F39C12] rounded-xl shadow-[0_0_20px_rgba(241,196,15,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>View Full Program & Pricing</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onOpenMentorModal()}
                className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-white bg-[#190F29] hover:bg-[#2E1A47] border border-[#5C4B8A] rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-[#9B59B6]" />
                <span>Schedule Mentor Call</span>
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
