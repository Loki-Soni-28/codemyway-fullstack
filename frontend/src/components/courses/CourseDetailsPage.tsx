import React, { useState } from 'react';
import { NavigationRoute } from '../../types';
import { 
  ArrowRight, 
  Download, 
  Check, 
  MessageSquare,
  Sparkles,
  Terminal,
  FileSpreadsheet,
  BarChart2,
  BrainCircuit,
  Layers,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Cpu
} from 'lucide-react';
import { LiquidHeroBackground } from '../home/LiquidHeroBackground';
import courseHeroImage from '../../assets/images/course_data_analyst_hero_1792917846034.jpg';

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

const PROGRAM_SLIDES: ProgramSlide[] = [
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

interface CourseDetailsPageProps {
  onRouteChange: (route: NavigationRoute) => void;
  onOpenBrochure: (programTitle?: string) => void;
  onOpenMentorModal: (programTitle?: string) => void;
  onOpenBuyNowModal: (details?: {
    title: string;
    salePrice: string;
    originalPrice: string;
    discountText: string;
  }) => void;
}

export const CourseDetailsPage: React.FC<CourseDetailsPageProps> = ({
  onRouteChange,
  onOpenBrochure,
  onOpenMentorModal,
  onOpenBuyNowModal
}) => {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const currentSlide = PROGRAM_SLIDES[activeSlideIndex];

  const handlePrevSlide = () => {
    setActiveSlideIndex((prev) => (prev - 1 + PROGRAM_SLIDES.length) % PROGRAM_SLIDES.length);
  };

  const handleNextSlide = () => {
    setActiveSlideIndex((prev) => (prev + 1) % PROGRAM_SLIDES.length);
  };

  const handleBuyNow = () => {
    onOpenBuyNowModal({
      title: currentSlide.fullTitle,
      salePrice: currentSlide.salePrice,
      originalPrice: currentSlide.originalPrice,
      discountText: `${currentSlide.discountPercentText} · Active`
    });
  };

  return (
    <div className="space-y-16 pb-28 bg-[#08070B] text-white">
      
      {/* 1. HERO SECTION WITH FULL-SCREEN BACKGROUND & INTERACTIVE SLIDE CONTROLS */}
      <section className="relative w-full min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden py-12 sm:py-16">
        {/* Full-screen background image with soft edge blurs */}
        <LiquidHeroBackground
          imageSrc={courseHeroImage}
          className="absolute inset-0 w-full h-full"
        />

        {/* Ambient Top & Central Lighting Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[500px] bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(155,89,182,0.22),transparent_70%)] pointer-events-none z-10" />

        {/* Centered Hero Content Container */}
        <div className="relative z-20 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center my-auto">

          {/* 🌟 BIG, PROMINENT MASTER COURSE SWITCHER BAR */}
          <div className="w-full max-w-4xl mx-auto mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#180E2B]/90 border border-[#9B59B6]/50 text-xs font-bold text-[#D8B4FE] shadow-[0_0_20px_rgba(155,89,182,0.3)] mb-3 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#F1C40F] animate-pulse" />
              <span>Select Your Flagship Program</span>
              <Sparkles className="w-3.5 h-3.5 text-[#F1C40F] animate-pulse" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-2 rounded-2xl bg-[#0D071A]/95 border-2 border-[#5C4B8A]/60 shadow-[0_0_40px_rgba(155,89,182,0.35)] backdrop-blur-lg">
              {PROGRAM_SLIDES.map((slide, idx) => {
                const isSelected = activeSlideIndex === idx;
                return (
                  <button
                    key={slide.id}
                    onClick={() => setActiveSlideIndex(idx)}
                    className={`relative flex items-center justify-between p-4 sm:p-5 rounded-xl transition-all duration-300 text-left cursor-pointer group ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#2F154E] via-[#3B1F5E] to-[#24103B] border-2 border-[#C084FC] shadow-[0_0_35px_rgba(192,132,252,0.5)] scale-[1.01]'
                        : 'bg-[#150D24]/90 hover:bg-[#1E1133] border border-[#5C4B8A]/45 hover:border-[#9B59B6]/70 opacity-75 hover:opacity-100'
                    }`}
                  >
                    {/* Active Ribbon/Badge */}
                    {isSelected && (
                      <span className="absolute -top-3 left-4 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#C084FC] text-[#08070B] shadow-[0_0_15px_rgba(192,132,252,0.9)] flex items-center gap-1">
                        <Check className="w-3 h-3 stroke-[3]" /> Active Selection
                      </span>
                    )}

                    <div className="flex items-center gap-3.5">
                      <div className={`p-3 rounded-xl border shrink-0 ${
                        isSelected 
                          ? 'bg-[#9B59B6]/30 border-[#C084FC] text-[#F1C40F]' 
                          : 'bg-[#231538] border-[#5C4B8A]/40 text-[#A7A0B5]'
                      }`}>
                        {idx === 0 ? <BarChart2 className="w-6 h-6" /> : <BrainCircuit className="w-6 h-6" />}
                      </div>
                      <div>
                        <h3 className={`text-base sm:text-lg font-black font-['Sora'] leading-snug ${
                          isSelected ? 'text-white' : 'text-[#D1CADB]'
                        }`}>
                          {idx === 0 ? 'Data Analyst + GenAI' : 'Data Science & ML + GenAI'}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
                          <span className="text-[#D1CADB] font-semibold">{slide.duration}</span>
                          <span className="text-[#5C4B8A]">•</span>
                          <span className="text-[#F1C40F] font-extrabold font-mono text-sm">{slide.salePrice}</span>
                          <span className="text-[#A7A0B5] line-through font-mono text-xs">{slide.originalPrice}</span>
                        </div>
                      </div>
                    </div>

                    {/* Big Discount Badge */}
                    <div className="shrink-0 ml-3">
                      <span className={`inline-flex items-center px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black tracking-wider shadow-lg ${
                        idx === 0
                          ? 'bg-gradient-to-r from-emerald-400 to-emerald-500 text-[#08070B] shadow-[0_0_15px_rgba(52,211,153,0.5)]'
                          : 'bg-gradient-to-r from-[#F1C40F] to-[#F39C12] text-[#08070B] shadow-[0_0_18px_rgba(241,196,15,0.55)]'
                      }`}>
                        {slide.discountPercentText}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Glassmorphic Centered Card for Hero Details */}
          <div className="w-full max-w-4xl flex flex-col items-center justify-center p-6 sm:p-10 rounded-3xl bg-[#08070B]/70 backdrop-blur-[8px] border border-[#5C4B8A]/45 shadow-[0_0_60px_rgba(8,7,11,0.9)] relative transition-all duration-300">
            
            {/* Slide Arrows & Status Indicator */}
            <div className="w-full flex items-center justify-between pb-4 mb-5 border-b border-[#5C4B8A]/35">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#D1CADB]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-white font-bold">{currentSlide.shortTitle}</span>
                <span className="text-[#5C4B8A]">—</span>
                <span className="text-[#F1C40F] font-bold">{currentSlide.duration}</span>
              </div>

              {/* Prev / Next Slide Arrow Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevSlide}
                  title="Previous program track"
                  className="p-2 rounded-xl bg-[#1E1133]/90 hover:bg-[#2E1A47] border border-[#5C4B8A]/60 text-[#D1CADB] hover:text-white transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1 text-xs"
                  aria-label="Previous Track"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Prev Track</span>
                </button>
                <div className="text-xs font-mono text-[#D1CADB] px-1 font-semibold">
                  <span>0{activeSlideIndex + 1}</span>
                  <span className="text-[#5C4B8A] mx-1">/</span>
                  <span className="text-[#A7A0B5]">0{PROGRAM_SLIDES.length}</span>
                </div>
                <button
                  onClick={handleNextSlide}
                  title="Next program track"
                  className="p-2 rounded-xl bg-[#1E1133]/90 hover:bg-[#2E1A47] border border-[#5C4B8A]/60 text-[#D1CADB] hover:text-white transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1 text-xs"
                  aria-label="Next Track"
                >
                  <span className="hidden sm:inline">Next Track</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Glowing Level Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#1B102B]/90 hover:bg-[#2E1A47] border border-[#9B59B6]/70 text-[#D1CADB] rounded-full text-xs font-semibold shadow-[0_0_25px_rgba(155,89,182,0.4)] backdrop-blur-md mb-6 transition-all">
              <Sparkles className="w-3.5 h-3.5 text-[#F1C40F] animate-pulse" />
              <span className="text-white">{currentSlide.levelBadge}</span>
              <span className="text-[#5C4B8A]">·</span>
              <span className="text-[#F1C40F] font-bold">{currentSlide.audienceBadge}</span>
            </div>

            {/* Attractive Centered Hero Typography */}
            <h1 className="font-extrabold tracking-tight font-['Sora'] text-balance mb-6 max-w-3xl text-center">
              <span className="block text-xl sm:text-2xl md:text-3xl font-bold text-[#C084FC] mb-2 sm:mb-3 tracking-tight">
                {currentSlide.kicker}
              </span>
              <span className="block text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.12] bg-gradient-to-r from-white via-[#F5EDFD] to-[#D8B4FE] bg-clip-text text-transparent drop-shadow-[0_4px_35px_rgba(155,89,182,0.4)]">
                {currentSlide.titleLine1}
              </span>
              <span className="block text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.12] bg-gradient-to-r from-[#F1C40F] via-[#F39C12] to-[#F1C40F] bg-clip-text text-transparent drop-shadow-[0_4px_30px_rgba(241,196,15,0.45)] mt-1 sm:mt-2">
                {currentSlide.titleLine2}
              </span>
            </h1>

            {/* Balanced Centered Subtitle */}
            <p className="text-base sm:text-lg lg:text-xl text-[#D1CADB] max-w-xl mx-auto leading-relaxed mb-6 drop-shadow-md font-normal text-center">
              {currentSlide.subtitle}
            </p>

            {/* Early Bird Pricing Pill / Banner */}
            <div className="mb-8 inline-flex flex-wrap items-center justify-center gap-3 px-6 py-2.5 rounded-2xl bg-[#1E1133]/90 border border-[#9B59B6]/60 shadow-[0_0_25px_rgba(155,89,182,0.3)] backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-xs text-[#A7A0B5]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Early Bird Enrollment:</span>
              </div>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#F1C40F] font-mono tracking-tight drop-shadow-[0_0_12px_rgba(241,196,15,0.3)]">
                {currentSlide.salePrice}
              </span>
              <span className="text-sm text-[#A7A0B5] line-through font-mono">
                {currentSlide.originalPrice}
              </span>
              <span className="text-xs font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-700/80 px-2.5 py-0.5 rounded-md">
                {currentSlide.discountBadge}
              </span>
            </div>

            {/* Centered Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <button
                onClick={handleBuyNow}
                className="w-full sm:w-auto px-8 py-3.5 text-sm font-bold text-[#08070B] bg-[#F1C40F] hover:bg-[#F39C12] rounded-xl shadow-[0_0_25px_rgba(241,196,15,0.35)] hover:shadow-[0_0_35px_rgba(241,196,15,0.55)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Enroll Now / Buy</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onOpenMentorModal(currentSlide.fullTitle)}
                className="w-full sm:w-auto px-7 py-3.5 text-sm font-semibold text-white bg-[#190F29]/90 hover:bg-[#2E1A47] border border-[#5C4B8A] hover:border-[#9B59B6] rounded-xl backdrop-blur-md transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(92,75,138,0.25)] hover:scale-[1.02] active:scale-[0.98]"
              >
                <MessageSquare className="w-4 h-4 text-[#9B59B6]" />
                <span>Talk to a Mentor</span>
              </button>

              <button
                onClick={() => onOpenBrochure(currentSlide.fullTitle)}
                className="w-full sm:w-auto px-7 py-3.5 text-sm font-medium text-[#D1CADB] hover:text-white bg-[#120A1F]/80 hover:bg-[#1E1133] border border-[#5C4B8A]/60 rounded-xl backdrop-blur-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <Download className="w-4 h-4 text-[#A7A0B5]" />
                <span>Download Full Brochure</span>
              </button>
            </div>

            {/* Platform Highlights */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 text-xs text-[#D1CADB]/90 font-medium">
              {currentSlide.highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: h.color }} />
                  <span>{h.label}</span>
                </div>
              ))}
            </div>

            {/* Slide Pagination Dots */}
            <div className="mt-6 flex items-center justify-center gap-2">
              {PROGRAM_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlideIndex(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    activeSlideIndex === idx
                      ? 'w-7 bg-[#F1C40F] shadow-[0_0_10px_rgba(241,196,15,0.7)]'
                      : 'w-2 bg-[#5C4B8A]/60 hover:bg-[#9B59B6]'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* 2. FLAGSHIP CURRICULUM: PHASE 1 & PHASE 2 (Dynamic per selected slide) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-6">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1B102B] border border-[#9B59B6]/60 text-xs font-semibold text-[#9B59B6] shadow-[0_0_20px_rgba(155,89,182,0.25)] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#F1C40F]" />
            <span className="text-white">Flagship Curriculum</span>
            <span className="text-[#5C4B8A]">·</span>
            <span className="text-[#F1C40F] font-bold">{currentSlide.curriculumDuration}</span>
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mt-1 font-['Sora'] tracking-tight">
            {currentSlide.curriculumTitle}
          </h2>
          <p className="text-sm sm:text-base text-[#D1CADB] mt-3 max-w-xl mx-auto leading-relaxed">
            {currentSlide.curriculumDesc}
          </p>
        </div>

        {/* Curriculum Track Switcher */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {PROGRAM_SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => setActiveSlideIndex(idx)}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                activeSlideIndex === idx
                  ? 'bg-gradient-to-r from-[#9B59B6] to-[#7A3E9D] text-white shadow-[0_0_20px_rgba(155,89,182,0.6)] border border-[#D1CADB]/50'
                  : 'bg-[#150D24] text-[#A7A0B5] hover:text-white border border-[#5C4B8A]/50 hover:bg-[#1E1133]'
              }`}
            >
              <span>{idx === 0 ? 'Data Analyst + GenAI (24 Weeks)' : 'Data Science & ML + GenAI (12 Months)'}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-black ${
                idx === 1 ? 'bg-[#F1C40F] text-[#08070B]' : 'bg-emerald-400 text-[#08070B]'
              }`}>
                {slide.discountPercentText}
              </span>
            </button>
          ))}
        </div>

        {/* Phase 1 & Phase 2 High-Impact Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Phase 1 Card */}
          <div className="bg-[#170F28] rounded-3xl p-7 sm:p-8 border border-[#9B59B6]/50 shadow-[0_0_30px_rgba(155,89,182,0.25)] hover:border-[#9B59B6] hover:shadow-[0_0_45px_rgba(155,89,182,0.45)] transition-all duration-300 relative flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-[#2E1A47] border border-[#9B59B6]/60 text-[#F1C40F] rounded-lg text-xs font-bold font-mono shadow-[0_0_12px_rgba(155,89,182,0.3)]">
                  {currentSlide.phase1.tag}
                </span>
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2.5 py-1 rounded-full">
                  {currentSlide.phase1.perk}
                </span>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2 font-['Sora']">
                {currentSlide.phase1.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#D1CADB] mb-6 leading-relaxed">
                {currentSlide.phase1.desc}
              </p>

              {/* Stack items with bold icons */}
              <div className="space-y-3 mb-6">
                {currentSlide.phase1.items.map((item, idx) => {
                  const ItemIcon = item.icon;
                  return (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-[#231538] border border-[#5C4B8A]/50">
                      <ItemIcon className="w-5 h-5 text-[#9B59B6] shrink-0" />
                      <div className="text-xs sm:text-sm">
                        <strong className="text-white font-semibold">{item.title} </strong>
                        <span>{item.desc}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-[#5C4B8A]/40 flex items-center justify-between text-xs">
              <span className="text-[#A7A0B5] font-medium flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#2ECC71]" />
                {currentSlide.phase1.project}
              </span>
              <button 
                onClick={() => onOpenBrochure(currentSlide.fullTitle)} 
                className="text-[#F1C40F] font-bold hover:text-amber-300 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>Full Syllabus</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Phase 2 Card */}
          <div className="bg-[#170F28] rounded-3xl p-7 sm:p-8 border border-[#9B59B6]/50 shadow-[0_0_30px_rgba(155,89,182,0.25)] hover:border-[#9B59B6] hover:shadow-[0_0_45px_rgba(155,89,182,0.45)] transition-all duration-300 relative flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-[#2E1A47] border border-[#9B59B6]/60 text-[#F1C40F] rounded-lg text-xs font-bold font-mono shadow-[0_0_12px_rgba(155,89,182,0.3)]">
                  {currentSlide.phase2.tag}
                </span>
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2.5 py-1 rounded-full">
                  {currentSlide.phase2.perk}
                </span>
              </div>

              <h3 className="text-2xl font-bold text-white mb-2 font-['Sora']">
                {currentSlide.phase2.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#D1CADB] mb-6 leading-relaxed">
                {currentSlide.phase2.desc}
              </p>

              {/* Stack items with bold icons */}
              <div className="space-y-3 mb-6">
                {currentSlide.phase2.items.map((item, idx) => {
                  const ItemIcon = item.icon;
                  return (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-[#231538] border border-[#5C4B8A]/50">
                      <ItemIcon className="w-5 h-5 text-[#9B59B6] shrink-0" />
                      <div className="text-xs sm:text-sm">
                        <strong className="text-white font-semibold">{item.title} </strong>
                        <span>{item.desc}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-[#5C4B8A]/40 flex items-center justify-between text-xs">
              <span className="text-[#A7A0B5] font-medium flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#2ECC71]" />
                {currentSlide.phase2.project}
              </span>
              <button 
                onClick={() => onOpenBrochure(currentSlide.fullTitle)} 
                className="text-[#F1C40F] font-bold hover:text-amber-300 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>Full Syllabus</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Clean, Bold Syllabus CTA Bar */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#170F28] via-[#231538] to-[#170F28] border border-[#9B59B6]/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_0_25px_rgba(155,89,182,0.18)]">
          <div className="text-center sm:text-left">
            <h4 className="text-base font-bold text-white font-['Sora']">
              Want the complete {currentSlide.duration} curriculum roadmap?
            </h4>
            <p className="text-xs text-[#D1CADB] mt-0.5">
              Explore detailed day-by-day modules, real lab exercises, and capstone project specifications for {currentSlide.shortTitle}.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleBuyNow}
              className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-[#08070B] bg-[#F1C40F] hover:bg-[#F39C12] rounded-xl shadow-[0_0_15px_rgba(241,196,15,0.3)] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Enroll Now · {currentSlide.salePrice}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onOpenBrochure(currentSlide.fullTitle)}
              className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-white bg-[#1B102B] hover:bg-[#2E1A47] border border-[#5C4B8A] rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#9B59B6]" />
              <span>Brochure</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. STICKY BOTTOM ACTION BAR (Complies with 15% Mobile Sticky Cap) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0C0717]/95 backdrop-blur-md border-t border-[#5C4B8A]/50 shadow-[0_0_30px_rgba(46,26,71,0.8)] py-2.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Price information */}
          <div className="flex items-center gap-3">
            <div>
              <div className="text-[11px] text-[#A7A0B5] font-medium">
                Program Total ({currentSlide.shortTitle})
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold text-[#F1C40F] font-mono">
                  {currentSlide.salePrice}
                </span>
                <span className="text-xs text-[#A7A0B5] line-through font-mono hidden sm:inline">
                  {currentSlide.originalPrice}
                </span>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 border border-emerald-800/80 px-1.5 py-0.5 rounded hidden sm:inline">
                  {currentSlide.discountPercentText}
                </span>
                <span className="text-[10px] text-[#D1CADB] italic hidden sm:inline">+ Reg fee</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenMentorModal(currentSlide.fullTitle)}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-[#2E1A47] hover:bg-[#3B225C] border border-[#5C4B8A] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Talk to a Mentor
            </button>
            <button
              onClick={handleBuyNow}
              className="px-4 py-2 text-xs font-bold text-[#08070B] bg-[#F1C40F] hover:bg-[#F39C12] rounded-lg shadow-[0_0_15px_rgba(241,196,15,0.25)] transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <span>Buy Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};
