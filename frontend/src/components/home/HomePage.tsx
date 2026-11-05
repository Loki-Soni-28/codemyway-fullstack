import React, { useState } from 'react';
import { NavigationRoute } from '../../types';
import { 
  ArrowRight, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  MessageSquare,
  ShieldCheck,
  Users,
  BrainCircuit,
  FileText,
  Briefcase,
  CheckCircle2,
  BarChart3,
  Lightbulb,
  ClipboardCheck,
  MessagesSquare,
  Video,
  Laptop,
  GraduationCap,
  RefreshCw
} from 'lucide-react';
import { FAQS } from '../../data/mockData';
import { LiquidHeroBackground } from './LiquidHeroBackground';
import { CompanyMarquee } from '../common/CompanyMarquee';
import { LearningDifference } from '../common/LearningDifference';
import { PROGRAM_SLIDES } from '../courses/CourseDetailsPage';
import { ABOUT_CONFIG } from '../about/aboutConfig';
import heroImage from '../../assets/images/hero_codemyway_learning_1792917844873.jpg';

const BEGINNER_CARDS = [
  {
    icon: Lightbulb,
    title: 'Understand First. Code with Confidence.',
    desc: 'Start with familiar business examples and simple explanations. Build your analytical thinking before moving into SQL, Python, and other tools.',
    highlight: 'Learn concepts the practical way',
  },
  {
    icon: Users,
    title: 'Personalized Guidance at Every Step',
    desc: 'Ask questions, work through challenges, and receive individual feedback from mentors who understand your learning goals.',
    highlight: 'Learn with real mentor support',
  },
  {
    icon: Laptop,
    title: 'Build Projects That Prove Your Skills',
    desc: 'Apply what you learn to realistic datasets and create portfolio projects that demonstrate your ability to solve business problems.',
    highlight: 'Turn knowledge into practical work',
  },
];

const PRACTICE_POINTS = [
  { icon: Laptop, title: 'Hands-On Projects', desc: 'Apply what you learn through practical projects designed around real-world business challenges.' },
  { icon: ClipboardCheck, title: 'Structured Assignments', desc: 'Strengthen your understanding with exercises and tasks that build your skills step by step.' },
  { icon: MessagesSquare, title: 'Mentor-Guided Reviews', desc: 'Receive constructive feedback to refine your approach, improve your work, and develop better problem-solving habits.' },
  { icon: Briefcase, title: 'Build Your Portfolio', desc: 'Turn your learning into meaningful work samples that help demonstrate your technical and analytical abilities.' },
];

const SUPPORT_CARDS = [
  {
    icon: Users,
    title: 'Personalized 1:1 Mentorship',
    desc: 'Get individual guidance from experienced industry professionals. Clarify doubts, strengthen your technical skills, receive project feedback, and build a learning roadmap aligned with your goals.',
    highlight: 'Guidance Beyond the Classroom',
    tags: ['Career Roadmap', 'Project Feedback'],
  },
  {
    icon: BrainCircuit,
    title: 'AI-Powered Learning. Human-Led Guidance.',
    desc: 'Combine the convenience of AI-assisted learning with the expertise of real mentors. Get support for coding challenges, technical concepts, and assignments, with scheduled sessions for deeper problem-solving.',
    highlight: 'AI assistance + human expertise',
    tags: ['Coding Support', 'Concept Clarity'],
  },
  {
    icon: BarChart3,
    title: 'Your Progress, Clearly Measured.',
    desc: "Stay informed about your learning journey through regular assessments, milestone tracking, and personalized feedback. Understand what you've mastered and where to focus next.",
    highlight: 'Structured progress reviews',
    tags: ['Skill Progress', 'Assignment Feedback', 'Learning Milestones'],
  },
  {
    icon: Briefcase,
    title: 'Career Support That Goes Beyond Training.',
    desc: 'Prepare for your next career opportunity with resume and LinkedIn guidance, technical mock interviews, portfolio reviews, and practical advice from experienced professionals.',
    highlight: 'Prepare for real opportunities',
    tags: ['Mock Interviews', 'Resume & LinkedIn Guidance', 'Portfolio Reviews'],
  },
];

interface HomePageProps {
  onRouteChange: (route: NavigationRoute) => void;
  onOpenBrochure: () => void;
  onOpenMentorModal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ 
  onRouteChange, 
  onOpenBrochure, 
  onOpenMentorModal 
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [projectTab, setProjectTab] = useState(0);

  return (
    <div className="space-y-24 sm:space-y-32 pb-24 sm:pb-32 bg-[#08070B] text-white">
      
      {/* 1. HERO SECTION WITH FULL-SCREEN BACKGROUND & TRUE CENTERED CONTENT */}
      <section className="relative w-full min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden py-12 sm:py-16">
        {/* Full-screen background image with soft edge blurs */}
        <LiquidHeroBackground
          imageSrc={heroImage}
          className="absolute inset-0 w-full h-full"
        />

        {/* Ambient Top & Central Lighting Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[500px] bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(155,89,182,0.22),transparent_70%)] pointer-events-none z-10" />

        {/* Centered Hero Content Container */}
        <div className="relative z-20 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center my-auto">
          
          {/* Glassmorphic Centered Card for Perfect Contrast & Readability over Full-Screen Image */}
          <div className="w-full max-w-3xl flex flex-col items-center justify-center p-6 sm:p-10 rounded-2xl bg-[#08070B]/55 backdrop-blur-[5px] border border-[#5C4B8A]/40 shadow-[0_0_60px_rgba(8,7,11,0.9)]">
            
            {/* Glowing Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#1B102B]/90 hover:bg-[#2E1A47] border border-[#5C4B8A]/60 text-[#D1CADB] rounded-full text-xs font-semibold backdrop-blur-md mb-6 transition-all">
              <Sparkles className="w-3.5 h-3.5 text-[#F1C40F] animate-pulse" />
              <span className="text-white">Flagship Program 2026 Admissions Open</span>
              <span className="text-[#5C4B8A]">·</span>
              <span className="text-[#F1C40F] font-bold">Early-Bird Available</span>
            </div>

            {/* Attractive Centered Hero Typography */}
            <h1 className="font-extrabold tracking-tight font-['Sora'] text-balance mb-6 max-w-3xl text-center">
              <span className="block text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.08] bg-gradient-to-r from-white via-[#F5EDFD] to-[#D8B4FE] bg-clip-text text-transparent drop-">
                Hack the pivot.
              </span>
              <span className="block text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.08] bg-gradient-to-r from-[#F1C40F] via-[#F39C12] to-[#F1C40F] bg-clip-text text-transparent drop-shadow-[0_4px_30px_rgba(241,196,15,0.45)] mt-1 sm:mt-2">
                Own the data.
              </span>
            </h1>

            {/* Balanced Centered Subtitle */}
            <p className="text-base sm:text-lg lg:text-xl text-[#D1CADB] max-w-xl mx-auto leading-relaxed mb-8 drop-shadow-md font-normal text-center">
              Build practical technology skills with structured learning, mentor guidance, hands-on projects and real-world career preparation.
            </p>

            {/* Centered Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <button
                onClick={() => onRouteChange('course-details')}
                className="w-full sm:w-auto px-8 py-3.5 text-sm font-bold text-[#08070B] bg-[#F1C40F] hover:bg-[#F39C12] rounded-xl shadow-[0_0_25px_rgba(241,196,15,0.35)] hover:shadow-[0_0_35px_rgba(241,196,15,0.55)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Explore Programs</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Platform Highlights */}
            <div className="mt-8 pt-6 w-full border-t border-white/10 grid grid-cols-3 gap-2 text-xs font-medium text-[#E5DDF2]">
              {[
                { icon: Video, label: 'Live Learning' },
                { icon: Laptop, label: 'Hands-On Projects' },
                { icon: Users, label: 'Mentor Guidance' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center justify-center gap-2">
                  <Icon className="w-4 h-4 text-[#F1C40F] shrink-0" />
                  <span>{label}</span>
                </div>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* 3. WHO CAN JOIN */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-semibold text-[#C084FC] uppercase tracking-widest">Who can join?</span>
          <h2 className="text-2xl sm:text-3xl font-bold font-['Sora'] mt-2">Wherever You Are Today, Your Learning Journey Can Start Here.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { icon: GraduationCap, title: 'Students & Fresh Graduates', desc: 'Build a strong foundation in analytics and develop practical skills beyond classroom theory.' },
            { icon: Briefcase, title: 'Working Professionals', desc: 'Add data and AI skills to your existing experience and explore new professional opportunities.' },
            { icon: RefreshCw, title: 'Career Switchers', desc: 'Transition into technical learning with structured lessons, beginner-friendly guidance, and hands-on practice.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group p-6 rounded-2xl bg-[#170F28] border border-[#5C4B8A]/50 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#C084FC] hover:bg-[#1E1334] hover:shadow-[0_0_32px_rgba(192,132,252,0.22)]"
            >
              <Icon className="w-6 h-6 text-[#C084FC] group-hover:text-[#F1C40F] transition-colors" />
              <h3 className="mt-4 font-bold text-white font-['Sora']">{title}</h3>
              <p className="mt-2 text-sm text-[#D1CADB] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. WHY CODEMYWAY: START FROM ZERO */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1B102B] border border-[#5C4B8A]/60 text-[11px] font-bold uppercase tracking-wide text-[#F1C40F] mb-5">
            <Sparkles className="w-3.5 h-3.5 text-[#F1C40F]" />
            <span>No tech background? You belong here.</span>
          </div>
          <h2 className="font-extrabold font-['Sora'] tracking-tight leading-tight">
            <span className="block text-3xl sm:text-4xl lg:text-5xl text-white">Start from Zero.</span>
            <span className="block mt-2 text-3xl sm:text-4xl lg:text-5xl text-[#C084FC]">Build Skills That Matter.</span>
          </h2>
          <p className="text-sm sm:text-base text-[#D1CADB] mt-5 max-w-2xl mx-auto leading-relaxed">
            Whether you're a student, a working professional, or exploring a career change, CodeMyWay helps you learn data analytics step by step, with practical lessons, expert guidance, and hands-on projects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {BEGINNER_CARDS.map(({ icon: Icon, title, desc, highlight }) => (
            <div
              key={title}
              className="group flex flex-col p-6 rounded-2xl bg-[#170F28] border border-[#5C4B8A]/50 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#C084FC] hover:bg-[#1E1334] hover:shadow-[0_0_32px_rgba(192,132,252,0.22)]"
            >
              <div className="w-11 h-11 rounded-xl bg-[#2E1A47] text-[#C084FC] flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:text-[#F1C40F]">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-white font-['Sora'] leading-snug">{title}</h3>
              <p className="mt-2 text-sm text-[#D1CADB] leading-relaxed">{desc}</p>
              <div className="mt-auto pt-5">
                <div className="pt-4 border-t border-[#5C4B8A]/35 flex items-center gap-2 text-xs font-semibold text-[#F1C40F]">
                  <CheckCircle2 className="w-4 h-4 text-[#2ECC71] shrink-0" />
                  <span>{highlight}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-[#D1CADB]">You don't need to know everything before you begin. You just need the willingness to learn.</p>
          <button
            onClick={() => onRouteChange('course-details')}
            className="mt-4 px-7 py-3 text-sm font-bold text-[#08070B] bg-[#F5C518] hover:bg-[#F1C40F] rounded-xl transition-all inline-flex items-center gap-2 cursor-pointer hover:scale-[1.03] active:scale-[0.98]"
          >
            <span>Explore Beginner-Friendly Programs</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 5. MENTORS: industry experience strip */}
      <CompanyMarquee onMeetMentors={() => { onRouteChange('mentors'); window.scrollTo({ top: 0 }); }} />

      {/* 6. LEARNING JOURNEY */}
      <LearningDifference />

      {/* 7. PROJECTS */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0E0A18] rounded-3xl p-6 sm:p-10 border border-[#5C4B8A]/50">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C084FC]">Learn by doing</span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-white font-['Sora'] tracking-tight">Turn Your Skills into Real-World Experience.</h2>
            <p className="mt-3 text-sm sm:text-base text-[#D1CADB] leading-relaxed">
              Apply your knowledge through hands-on projects, structured assignments, and personalized mentor feedback. Build practical skills and a portfolio that showcases your capabilities.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {PRACTICE_POINTS.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group p-5 rounded-2xl bg-[#170F28] border border-[#5C4B8A]/50 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#C084FC] hover:bg-[#1E1334] hover:shadow-[0_0_32px_rgba(192,132,252,0.22)]"
              >
                <Icon className="w-5 h-5 text-[#C084FC] group-hover:text-[#F1C40F] transition-colors" />
                <h3 className="mt-3 text-sm font-bold text-white font-['Sora']">{title}</h3>
                <p className="mt-1.5 text-xs text-[#D1CADB] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* Program tabs: projects for the selected program */}
          <div className="mt-10 grid grid-cols-2 gap-2 p-1 rounded-full bg-[#170F28] border border-[#5C4B8A]/40">
            {PROGRAM_SLIDES.map((program, idx) => (
              <button
                key={program.id}
                onClick={() => setProjectTab(idx)}
                className={`py-2.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                  projectTab === idx ? 'bg-[#2E1A47] text-white' : 'text-[#A7A0B5] hover:text-white'
                }`}
              >
                {program.tabLabel.replace(' + GenAI', idx === 0 ? ' + GenAI' : '')}
              </button>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
            {[PROGRAM_SLIDES[projectTab].phase1, PROGRAM_SLIDES[projectTab].phase2].map((phase) => (
              <div
                key={phase.tag}
                className="group flex flex-col p-6 rounded-2xl bg-[#170F28] border border-[#5C4B8A]/50 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#C084FC] hover:bg-[#1E1334] hover:shadow-[0_0_32px_rgba(192,132,252,0.22)]"
              >
                <div className="text-[11px] font-bold uppercase tracking-wide text-[#F1C40F]">{phase.tag}</div>
                <h3 className="mt-3 text-lg font-bold text-white font-['Sora'] leading-snug">{phase.project}</h3>
                <p className="mt-2 text-sm text-[#D1CADB] leading-relaxed">{phase.desc}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {phase.items.slice(0, 3).map((item) => (
                    <li key={item.title} className="px-2.5 py-1 rounded-full bg-[#2A1744] text-[11px] text-[#D8B4FE]">{item.title.replace(/:$/, '')}</li>
                  ))}
                </ul>
                <div className="mt-auto pt-5">
                  <div className="pt-4 border-t border-[#5C4B8A]/35 flex items-center gap-2 text-sm font-semibold text-white">
                    <CheckCircle2 className="w-4 h-4 text-[#2ECC71] shrink-0" />
                    <span>Mentor-reviewed portfolio project</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl bg-[#231538] p-5 text-center">
            <div className="text-lg font-bold text-white font-['Sora']">Learn It. Apply It. Improve It. Showcase It.</div>
            <p className="mt-1.5 text-sm text-[#D1CADB]">A practical learning experience designed to turn knowledge into demonstrable skills.</p>
          </div>
        </div>
      </section>

      {/* 8. BEYOND THE CLASSROOM: MENTORSHIP & CAREER SUPPORT */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0E0A18] rounded-3xl p-6 sm:p-10 border border-[#5C4B8A]/50">

          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-semibold text-[#C084FC] uppercase tracking-widest">Beyond the classroom</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 font-['Sora'] tracking-tight">
              Your Growth, Guided by Experts.
            </h2>
            <p className="text-sm sm:text-base text-[#D1CADB] mt-3 leading-relaxed">
              Learning doesn't stop after class. Get personalized guidance, practical support, and career-focused preparation throughout your journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {SUPPORT_CARDS.map(({ icon: Icon, title, desc, highlight, tags }) => (
              <div
                key={title}
                className="group flex flex-col rounded-2xl p-6 bg-[#170F28] border border-[#5C4B8A]/50 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#C084FC] hover:bg-[#1E1334] hover:shadow-[0_0_32px_rgba(192,132,252,0.22)]"
              >
                <div className="w-11 h-11 rounded-xl bg-[#2E1A47] text-[#C084FC] flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:text-[#F1C40F] group-hover:shadow-[0_0_20px_rgba(241,196,15,0.35)]">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-white font-['Sora'] leading-snug">{title}</h3>
                <p className="mt-2 text-sm text-[#D1CADB] leading-relaxed">{desc}</p>

                <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-white">
                  <CheckCircle2 className="w-4 h-4 text-[#2ECC71] shrink-0" />
                  <span>{highlight}</span>
                </div>

                <div className="mt-auto pt-5">
                  <div className="pt-4 border-t border-[#5C4B8A]/35 flex flex-wrap gap-2">
                    {tags.map((t) => (
                      <span key={t} className="px-2.5 py-1 rounded-full bg-[#2A1744] text-[#D8B4FE] text-[11px] font-medium transition-colors group-hover:bg-[#35205A]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-sm text-[#D1CADB]">Discover how personalized mentorship can support your learning journey.</p>
            <button
              onClick={onOpenMentorModal}
              className="mt-4 px-7 py-3 text-sm font-bold text-[#08070B] bg-[#F5C518] hover:bg-[#F1C40F] rounded-xl transition-all inline-flex items-center gap-2 cursor-pointer hover:scale-[1.03] active:scale-[0.98]"
            >
              <span>Talk to a Mentor</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* 9. STUDENT EXPERIENCES: shown only once real testimonials are added in aboutConfig.ts */}
      {ABOUT_CONFIG.testimonials.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C084FC]">Student experiences</span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-white font-['Sora'] tracking-tight">In Their Words</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {ABOUT_CONFIG.testimonials.map((t) => (
              <figure key={t.name} className="p-6 rounded-2xl bg-[#170F28] border border-[#5C4B8A]/50 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#C084FC] hover:shadow-[0_0_32px_rgba(192,132,252,0.22)]">
                <blockquote className="text-sm text-[#D1CADB] leading-relaxed">"{t.quote}"</blockquote>
                <figcaption className="mt-4 text-xs">
                  <strong className="text-white">{t.name}</strong>
                  <span className="text-[#A7A0B5]"> · {t.background}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* 10. FAQS */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold text-[#C084FC] uppercase tracking-widest">Here to help</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 font-['Sora'] tracking-tight">Frequently Asked Questions</h2>
          <p className="text-sm sm:text-base text-[#D1CADB] mt-3 leading-relaxed">
            From choosing the right program to understanding mentorship and career support, find answers to your most common questions.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                openFaqIndex === idx
                  ? 'bg-[#1E1235] border-[#C084FC]'
                  : 'bg-[#170F28] border-[#5C4B8A]/50 hover:border-[#C084FC]/80 hover:bg-[#1B1230]'
              }`}
            >
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                className="w-full py-4 px-5 text-left text-sm font-semibold text-white flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
              >
                <span>{faq.q}</span>
                {openFaqIndex === idx ? (
                  <ChevronUp className="w-4 h-4 text-[#F1C40F] shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#A7A0B5] shrink-0" />
                )}
              </button>
              {openFaqIndex === idx && (
                <div className="px-5 pb-5 text-sm text-[#D1CADB] leading-relaxed border-t border-[#5C4B8A]/30 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 p-6 sm:p-8 rounded-2xl bg-[#170F28] border border-[#5C4B8A]/50 text-center">
          <h3 className="text-xl font-bold text-white font-['Sora']">Still Have Questions?</h3>
          <p className="mt-2 text-sm text-[#D1CADB] leading-relaxed">
            Our team can help you explore the programs, understand the learning format, and choose the right starting point.
          </p>
          <button
            onClick={onOpenMentorModal}
            className="mt-5 px-7 py-3 text-sm font-bold text-[#08070B] bg-[#F5C518] hover:bg-[#F1C40F] rounded-xl transition-all inline-flex items-center gap-2 cursor-pointer hover:scale-[1.03] active:scale-[0.98]"
          >
            <span>Book Free Counselling</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

    </div>
  );
};
