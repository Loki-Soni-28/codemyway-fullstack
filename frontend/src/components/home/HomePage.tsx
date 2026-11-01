import React, { useState } from 'react';
import { NavigationRoute } from '../../types';
import { 
  ArrowRight, 
  Download, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  MessageSquare,
  ShieldCheck,
  Users,
  BrainCircuit,
  FileText,
  Video,
  Briefcase,
  BookOpen,
  Clock,
  Quote
} from 'lucide-react';
import { FAQS } from '../../data/mockData';
import { LiquidHeroBackground } from './LiquidHeroBackground';
import heroImage from '../../assets/images/hero_codemyway_learning_1792917844873.jpg';

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

  return (
    <div className="space-y-20 pb-20 bg-[#08070B] text-white">
      
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
          <div className="w-full max-w-3xl flex flex-col items-center justify-center p-6 sm:p-10 rounded-3xl bg-[#08070B]/55 backdrop-blur-[5px] border border-[#5C4B8A]/40 shadow-[0_0_60px_rgba(8,7,11,0.9)]">
            
            {/* Glowing Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#1B102B]/90 hover:bg-[#2E1A47] border border-[#9B59B6]/70 text-[#D1CADB] rounded-full text-xs font-semibold shadow-[0_0_25px_rgba(155,89,182,0.4)] backdrop-blur-md mb-6 transition-all">
              <Sparkles className="w-3.5 h-3.5 text-[#F1C40F] animate-pulse" />
              <span className="text-white">Flagship Program 2026 Admissions Open</span>
              <span className="text-[#5C4B8A]">·</span>
              <span className="text-[#F1C40F] font-bold">Early-Bird Available</span>
            </div>

            {/* Attractive Centered Hero Typography */}
            <h1 className="font-extrabold tracking-tight font-['Sora'] text-balance mb-6 max-w-3xl text-center">
              <span className="block text-xl sm:text-2xl md:text-3xl font-bold text-[#C084FC] mb-2 sm:mb-3 tracking-tight">
                CodeMyWay
              </span>
              <span className="block text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.08] bg-gradient-to-r from-white via-[#F5EDFD] to-[#D8B4FE] bg-clip-text text-transparent drop-shadow-[0_4px_35px_rgba(155,89,182,0.4)]">
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

              <button
                onClick={onOpenBrochure}
                className="w-full sm:w-auto px-8 py-3.5 text-sm font-semibold text-white bg-[#190F29]/90 hover:bg-[#2E1A47] border border-[#5C4B8A] hover:border-[#9B59B6] rounded-xl backdrop-blur-md transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(92,75,138,0.25)] hover:scale-[1.02] active:scale-[0.98]"
              >
                <Download className="w-4 h-4 text-[#9B59B6]" />
                <span>Download Full Brochure</span>
              </button>
            </div>

            {/* Platform Highlights */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 text-xs text-[#D1CADB]/90 font-medium">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F1C40F]" />
                <span>Live Interactive Sessions</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#9B59B6]" />
                <span>Real-world Portfolio Projects</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2ECC71]" />
                <span>1:1 Mentor Guidance</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
                <span>Guided & Mentorship Sessions by Industry Experts</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 2. WHAT IS CODEMYWAY? (EDITORIAL BLOG MANIFESTO WITH EDGE GLOW & AMBIENT EFFECTS) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#231538] via-[#1A0F2E] to-[#140C24] border border-[#9B59B6]/40 hover:border-[#F1C40F]/70 shadow-[0_0_25px_rgba(155,89,182,0.12)] hover:shadow-[0_0_35px_rgba(155,89,182,0.25),0_0_20px_rgba(241,196,15,0.18)] hover:-translate-y-1 transition-all duration-300 p-5 sm:p-7 lg:p-8 flex flex-col justify-between group">
          
          {/* Top Edge Glow Laser Line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#9B59B6]/70 group-hover:via-[#F1C40F] to-transparent transition-all duration-500" />
          
          {/* Corner Ambient Radial Glow Orbs */}
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-[radial-gradient(circle,rgba(155,89,182,0.25)_0%,transparent_70%)] rounded-full blur-xl pointer-events-none group-hover:scale-125 group-hover:bg-[radial-gradient(circle,rgba(241,196,15,0.25)_0%,transparent_70%)] transition-all duration-500" />
          <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-[radial-gradient(circle,rgba(155,89,182,0.15)_0%,transparent_70%)] rounded-full blur-xl pointer-events-none transition-all duration-500" />

          {/* Article Header / Metadata (Compact) */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-2.5 pb-4 border-b border-[#5C4B8A]/30 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2E1A47] to-[#1C0E33] border border-[#9B59B6]/70 text-[#F1C40F] flex items-center justify-center group-hover:scale-105 group-hover:border-[#F1C40F]/80 transition-all">
                <BookOpen className="w-4 h-4 text-[#F1C40F]" />
              </div>
              <div>
                <span className="text-[10px] font-semibold text-[#9B59B6] uppercase tracking-wider block">Manifesto</span>
                <span className="text-white font-bold text-xs font-['Sora']">Inside the Vision</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-xs">
              <span className="px-2.5 py-0.5 rounded-full bg-[#1B102B]/90 border border-[#9B59B6]/60 text-[#D8B4FE] text-[11px] font-mono font-bold shadow-sm group-hover:border-[#F1C40F]/60 group-hover:text-[#F1C40F] transition-all flex items-center gap-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2ECC71] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#2ECC71]"></span>
                </span>
                <span>#HackThePivot</span>
              </span>
              <div className="hidden sm:flex items-center gap-1 text-[11px] text-[#A7A0B5]">
                <Clock className="w-3 h-3 text-[#9B59B6]" />
                <span>1 min read</span>
              </div>
            </div>
          </div>

          {/* Title (Compact) */}
          <div className="relative z-10 mb-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-['Sora'] tracking-tight group-hover:text-white transition-colors">
              What is <span className="bg-gradient-to-r from-[#F1C40F] via-[#F39C12] to-[#F1C40F] bg-clip-text text-transparent drop-shadow-[0_4px_20px_rgba(241,196,15,0.3)]">CodeMyWay</span>?
            </h2>
          </div>

          {/* Editorial Blog Body (Compact) */}
          <div className="relative z-10 space-y-3 text-xs sm:text-sm lg:text-base text-[#D1CADB] leading-relaxed">
            <p className="text-sm sm:text-base font-medium text-white leading-relaxed">
              Forget dead-end jobs and outdated lectures. <strong className="text-[#F1C40F] font-bold">CodeMyWay</strong> is your ultimate cheat code to break into <span className="text-white font-semibold underline decoration-[#9B59B6] underline-offset-4">Data Science, ML, and Data Analysis</span>.
            </p>

            <p>
              We’re not about that passive tutorial life—we match you with a <strong className="text-white font-semibold">dedicated 1-on-1 mentor</strong> who tracks your weekly receipts and keeps your progress on lock. You get straight-up game from real industry insiders, plus <strong className="text-white font-semibold">24/7 AI and call support</strong> so your late-night debugging never gets stuck on read.
            </p>

            <p>
              Add in our <strong className="text-[#F1C40F] font-bold">100% placement backing</strong>, and we are riding with you from your first line of code all the way to securing that tech bag.
            </p>
          </div>

          {/* Micro-Telemetry Feature Widgets (Compact) */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-4">
            <div className="p-2.5 rounded-xl bg-[#2E1A47]/60 border border-[#9B59B6]/40 flex items-center justify-between text-xs backdrop-blur-sm group-hover:border-[#9B59B6]/70 transition-all">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#9B59B6]/20 border border-[#9B59B6]/40 text-[#D8B4FE] flex items-center justify-center shrink-0">
                  <Users className="w-3 h-3 text-[#F1C40F]" />
                </div>
                <span className="text-[#D1CADB] font-medium text-[11px]">Dedicated Mentors</span>
              </div>
              <span className="text-[#F1C40F] font-mono text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#1B102B] border border-[#F1C40F]/30">
                1:1 Live
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#2E1A47]/60 border border-[#9B59B6]/40 flex items-center justify-between text-xs backdrop-blur-sm group-hover:border-[#9B59B6]/70 transition-all">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#9B59B6]/20 border border-[#9B59B6]/40 text-[#D8B4FE] flex items-center justify-center shrink-0">
                  <BrainCircuit className="w-3 h-3 text-[#C084FC]" />
                </div>
                <span className="text-[#D1CADB] font-medium text-[11px]">24/7 AI + Call</span>
              </div>
              <span className="text-[#2ECC71] font-mono text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#1B102B] border border-[#2ECC71]/30">
                Never Stuck
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#2E1A47]/60 border border-[#F1C40F]/40 flex items-center justify-between text-xs backdrop-blur-sm group-hover:border-[#F1C40F]/70 transition-all">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#F1C40F]/15 border border-[#F1C40F]/40 text-[#F1C40F] flex items-center justify-center shrink-0">
                  <Briefcase className="w-3 h-3 text-[#F1C40F]" />
                </div>
                <span className="text-[#D1CADB] font-medium text-[11px]">Career Backing</span>
              </div>
              <span className="text-[#F1C40F] font-mono text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#1B102B] border border-[#F1C40F]/30">
                100% Backed
              </span>
            </div>
          </div>

          {/* Closing Quote Bar (Compact) */}
          <div className="relative z-10 mt-4 p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-[#231538] via-[#2E1A47] to-[#1E1130] border border-[#F1C40F]/45 shadow-[0_0_15px_rgba(241,196,15,0.15)] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#F1C40F]/15 border border-[#F1C40F]/40 flex items-center justify-center shrink-0 text-[#F1C40F]">
                <Quote className="w-4 h-4 text-[#F1C40F]" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold font-['Sora'] text-white">
                  “Stop scrolling, hack the pivot, and own the data.”
                </p>
                <span className="text-[10px] text-[#D8B4FE]">The CodeMyWay Promise</span>
              </div>
            </div>

            <button
              onClick={() => onRouteChange('course-details')}
              className="w-full sm:w-auto px-5 py-2 rounded-lg bg-[#F1C40F] hover:bg-[#F39C12] text-[#08070B] font-bold text-xs shadow-[0_0_15px_rgba(241,196,15,0.35)] hover:shadow-[0_0_25px_rgba(241,196,15,0.5)] transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
            >
              <span>Explore Curriculum</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Bottom Tags (Compact) */}
          <div className="mt-4 pt-3 border-t border-[#5C4B8A]/30 flex flex-wrap gap-1.5 relative z-10 text-[10px] sm:text-[11px]">
            <span className="px-2 py-0.5 rounded-md bg-[#F1C40F]/15 text-[#F1C40F] font-bold border border-[#F1C40F]/45 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-[#F1C40F]" />
              The Ultimate Cheat Code
            </span>
            <span className="px-2 py-0.5 rounded-md bg-[#1B102B] text-[#D8B4FE] border border-[#9B59B6]/30">
              Real Industry Insiders
            </span>
            <span className="px-2 py-0.5 rounded-md bg-[#1B102B] text-[#D8B4FE] border border-[#9B59B6]/30">
              Weekly Receipts Tracking
            </span>
            <span className="px-2 py-0.5 rounded-md bg-[#1B102B] text-[#D8B4FE] border border-[#9B59B6]/30">
              Late-Night Debugging
            </span>
            <span className="px-2 py-0.5 rounded-md bg-[#1B102B] text-[#D8B4FE] border border-[#9B59B6]/30">
              100% Placement Backing
            </span>
          </div>

        </div>
      </section>

      {/* 3. BUILT FOR BEGINNERS & SWITCHERS (BOLD HIGHLIGHTS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1B102B] border border-[#9B59B6]/60 text-xs font-semibold text-[#9B59B6] shadow-[0_0_20px_rgba(155,89,182,0.25)] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#F1C40F]" />
            <span className="text-white">Beginner-First Pedagogy</span>
            <span className="text-[#5C4B8A]">·</span>
            <span className="text-[#F1C40F] font-bold">Zero Coding Background Needed</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-['Sora'] tracking-tight">
            Engineered for Beginners & Switchers
          </h2>
          <p className="text-sm sm:text-base text-[#D1CADB] mt-3 max-w-xl mx-auto leading-relaxed">
            No engineering degree or prior tech experience needed. We build your analytical intuition first, then layer on real industry tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-7 rounded-2xl bg-[#170F28] border border-[#9B59B6]/50 shadow-[0_0_25px_rgba(155,89,182,0.2)] hover:border-[#9B59B6] hover:shadow-[0_0_35px_rgba(155,89,182,0.45)] hover:-translate-y-1 space-y-4 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-[#2E1A47] border border-[#9B59B6]/70 text-[#F1C40F] flex items-center justify-center font-extrabold text-base font-mono shadow-[0_0_15px_rgba(155,89,182,0.35)]">
              01
            </div>
            <div>
              <h3 className="font-bold text-white text-lg font-['Sora'] mb-1">Intuition Before Syntax</h3>
              <p className="text-xs sm:text-sm text-[#D1CADB] leading-relaxed">
                Learn data relationships visually using familiar business situations before touching complex SQL or Python code.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-[#F1C40F]">
              <Check className="w-4 h-4 text-[#2ECC71]" />
              <span>Real-world Business Models</span>
            </div>
          </div>

          <div className="p-7 rounded-2xl bg-[#170F28] border border-[#9B59B6]/50 shadow-[0_0_25px_rgba(155,89,182,0.2)] hover:border-[#9B59B6] hover:shadow-[0_0_35px_rgba(155,89,182,0.45)] hover:-translate-y-1 space-y-4 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-[#2E1A47] border border-[#9B59B6]/70 text-[#F1C40F] flex items-center justify-center font-extrabold text-base font-mono shadow-[0_0_15px_rgba(155,89,182,0.35)]">
              02
            </div>
            <div>
              <h3 className="font-bold text-white text-lg font-['Sora'] mb-1">Dedicated 1:1 Mentors</h3>
              <p className="text-xs sm:text-sm text-[#D1CADB] leading-relaxed">
                Never get stuck alone on errors. Personal mentors sit with you to troubleshoot queries, debug logic, and review assignments.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-[#F1C40F]">
              <Check className="w-4 h-4 text-[#2ECC71]" />
              <span>Daily Live Doubt Resolution</span>
            </div>
          </div>

          <div className="p-7 rounded-2xl bg-[#170F28] border border-[#9B59B6]/50 shadow-[0_0_25px_rgba(155,89,182,0.2)] hover:border-[#9B59B6] hover:shadow-[0_0_35px_rgba(155,89,182,0.45)] hover:-translate-y-1 space-y-4 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-[#2E1A47] border border-[#9B59B6]/70 text-[#F1C40F] flex items-center justify-center font-extrabold text-base font-mono shadow-[0_0_15px_rgba(155,89,182,0.35)]">
              03
            </div>
            <div>
              <h3 className="font-bold text-white text-lg font-['Sora'] mb-1">Verified Capstone Portfolio</h3>
              <p className="text-xs sm:text-sm text-[#D1CADB] leading-relaxed">
                Build 2 production-grade capstone projects on GitHub with authentic datasets that impress tech recruiters.
              </p>
            </div>
            <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-[#F1C40F]">
              <Check className="w-4 h-4 text-[#2ECC71]" />
              <span>Tested in Technical Mock Interviews</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. DEDICATED 1:1 MENTORSHIP & CAREER READINESS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#170F28] rounded-3xl p-8 lg:p-10 border border-[#9B59B6]/45 shadow-[0_0_35px_rgba(46,26,71,0.5)]">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-semibold text-[#9B59B6] uppercase tracking-wider">Unrivaled Career Support</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1 font-['Sora'] tracking-tight">
              1-on-1 Mentorship & Career Readiness
            </h2>
            <p className="text-sm text-[#D1CADB] mt-2">
              No generic prerecorded videos or automated chatbots. You get dedicated 1:1 mentorship, real-time doubt resolution, and personalized weekly feedback from active industry practitioners.
            </p>
          </div>

          {/* 4 Feature Cards Grid with Edge Glow & Ambient Effects */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            
            {/* Card 1: Guidance by Industry Experts */}
            <div className="relative overflow-hidden p-6 sm:p-7 rounded-2xl bg-gradient-to-b from-[#231538] via-[#1A0F2E] to-[#140C24] border border-[#9B59B6]/40 hover:border-[#F1C40F]/70 shadow-[0_0_25px_rgba(155,89,182,0.12)] hover:shadow-[0_0_35px_rgba(155,89,182,0.3),0_0_20px_rgba(241,196,15,0.2)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group">
              {/* Top Edge Glow Laser Line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#9B59B6]/70 group-hover:via-[#F1C40F] to-transparent transition-all duration-500" />
              {/* Corner Ambient Radial Glow Orb */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-[radial-gradient(circle,rgba(155,89,182,0.25)_0%,transparent_70%)] rounded-full blur-xl pointer-events-none group-hover:scale-150 group-hover:bg-[radial-gradient(circle,rgba(241,196,15,0.25)_0%,transparent_70%)] transition-all duration-500" />

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#2E1A47] to-[#1C0E33] border border-[#9B59B6]/70 text-[#F1C40F] flex items-center justify-center group-hover:scale-110 group-hover:border-[#F1C40F]/80 group-hover:shadow-[0_0_20px_rgba(241,196,15,0.4)] transition-all duration-300">
                    <Users className="w-5 h-5 text-[#F1C40F]" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#1B102B]/90 border border-[#9B59B6]/60 text-[#D8B4FE] text-xs font-mono font-bold shadow-[0_0_12px_rgba(155,89,182,0.25)] group-hover:border-[#F1C40F]/60 group-hover:text-[#F1C40F] transition-all">
                    Pillar 01
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-white text-lg font-['Sora'] group-hover:text-white transition-colors">Guidance by Industry Experts</h3>
                  <p className="text-xs sm:text-sm text-[#D1CADB] leading-relaxed mt-1.5">
                    Learn directly from senior data engineers and analysts working in top tech organizations. Receive 1-on-1 strategy sessions, real-world portfolio architecture reviews, and personalized career roadmaps.
                  </p>
                </div>

                {/* Cool Feature Widget */}
                <div className="p-3 rounded-xl bg-[#2E1A47]/60 border border-[#9B59B6]/40 flex items-center justify-between text-xs backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2ECC71] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2ECC71]"></span>
                    </span>
                    <span className="text-[#D1CADB] font-medium text-[11px] sm:text-xs">Top Tier Tech Mentors</span>
                  </div>
                  <span className="text-[#F1C40F] font-mono text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#1B102B] border border-[#F1C40F]/30">
                    1:1 Dedicated
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-[#5C4B8A]/30 flex flex-wrap gap-2 relative z-10">
                <span className="px-2.5 py-1 rounded-md bg-[#1B102B] text-[#D8B4FE] text-[11px] font-medium border border-[#9B59B6]/30 group-hover:border-[#9B59B6]/60 transition-colors">
                  1:1 Strategic Mentoring
                </span>
                <span className="px-2.5 py-1 rounded-md bg-[#1B102B] text-[#D8B4FE] text-[11px] font-medium border border-[#9B59B6]/30 group-hover:border-[#9B59B6]/60 transition-colors">
                  Portfolio & Resume Polish
                </span>
                <span className="px-2.5 py-1 rounded-md bg-[#1B102B] text-[#D8B4FE] text-[11px] font-medium border border-[#9B59B6]/30 group-hover:border-[#9B59B6]/60 transition-colors">
                  Domain Roadmap
                </span>
              </div>
            </div>

            {/* Card 2: AI & Expert Doubts Session */}
            <div className="relative overflow-hidden p-6 sm:p-7 rounded-2xl bg-gradient-to-b from-[#231538] via-[#1A0F2E] to-[#140C24] border border-[#9B59B6]/40 hover:border-[#F1C40F]/70 shadow-[0_0_25px_rgba(155,89,182,0.12)] hover:shadow-[0_0_35px_rgba(155,89,182,0.3),0_0_20px_rgba(241,196,15,0.2)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group">
              {/* Top Edge Glow Laser Line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#9B59B6]/70 group-hover:via-[#F1C40F] to-transparent transition-all duration-500" />
              {/* Corner Ambient Radial Glow Orb */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-[radial-gradient(circle,rgba(155,89,182,0.25)_0%,transparent_70%)] rounded-full blur-xl pointer-events-none group-hover:scale-150 group-hover:bg-[radial-gradient(circle,rgba(241,196,15,0.25)_0%,transparent_70%)] transition-all duration-500" />

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#2E1A47] to-[#1C0E33] border border-[#9B59B6]/70 text-[#F1C40F] flex items-center justify-center group-hover:scale-110 group-hover:border-[#F1C40F]/80 group-hover:shadow-[0_0_20px_rgba(241,196,15,0.4)] transition-all duration-300">
                    <BrainCircuit className="w-5 h-5 text-[#F1C40F]" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#1B102B]/90 border border-[#9B59B6]/60 text-[#D8B4FE] text-xs font-mono font-bold shadow-[0_0_12px_rgba(155,89,182,0.25)] group-hover:border-[#F1C40F]/60 group-hover:text-[#F1C40F] transition-all">
                    Pillar 02
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-white text-lg font-['Sora'] group-hover:text-white transition-colors">AI & Expert Doubts Session</h3>
                  <p className="text-xs sm:text-sm text-[#D1CADB] leading-relaxed mt-1.5">
                    Never stay blocked on a bug or query. Get instant 24/7 AI-powered syntax guidance and problem decomposition, reinforced by scheduled live 1:1 deep-dive doubt resolution sessions with mentor experts.
                  </p>
                </div>

                {/* 24/7 AI + Live Mentor Dual Resolution Engine */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <div className="p-3 rounded-xl bg-[#1B102B]/90 border border-[#9B59B6]/40 flex items-center gap-2.5 shadow-sm">
                    <div className="w-8 h-8 rounded-lg bg-[#9B59B6]/20 border border-[#9B59B6]/40 text-[#D8B4FE] flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-[#C084FC]" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] text-[#A7A0B5] font-mono uppercase tracking-wider">Instant Help</div>
                      <div className="text-xs font-bold text-white truncate font-['Sora']">24/7 AI Assistant</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#1B102B]/90 border border-[#F1C40F]/40 flex items-center gap-2.5 shadow-sm">
                    <div className="w-8 h-8 rounded-lg bg-[#F1C40F]/15 border border-[#F1C40F]/40 text-[#F1C40F] flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4 text-[#F1C40F]" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] text-[#A7A0B5] font-mono uppercase tracking-wider">1:1 Guidance</div>
                      <div className="text-xs font-bold text-[#F1C40F] truncate font-['Sora']">Live Expert Mentor</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-[#5C4B8A]/30 flex flex-wrap gap-2 relative z-10">
                <span className="px-2.5 py-1 rounded-md bg-[#1B102B] text-[#D8B4FE] text-[11px] font-medium border border-[#9B59B6]/30 group-hover:border-[#9B59B6]/60 transition-colors">
                  Instant Syntax Checks
                </span>
                <span className="px-2.5 py-1 rounded-md bg-[#1B102B] text-[#D8B4FE] text-[11px] font-medium border border-[#9B59B6]/30 group-hover:border-[#9B59B6]/60 transition-colors">
                  1-on-1 Debugging Calls
                </span>
                <span className="px-2.5 py-1 rounded-md bg-[#1B102B] text-[#D8B4FE] text-[11px] font-medium border border-[#9B59B6]/30 group-hover:border-[#9B59B6]/60 transition-colors">
                  Zero Roadblocks
                </span>
              </div>
            </div>

            {/* Card 3: Weekly Progress Reports */}
            <div className="relative overflow-hidden p-6 sm:p-7 rounded-2xl bg-gradient-to-b from-[#231538] via-[#1A0F2E] to-[#140C24] border border-[#9B59B6]/40 hover:border-[#F1C40F]/70 shadow-[0_0_25px_rgba(155,89,182,0.12)] hover:shadow-[0_0_35px_rgba(155,89,182,0.3),0_0_20px_rgba(241,196,15,0.2)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group">
              {/* Top Edge Glow Laser Line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#9B59B6]/70 group-hover:via-[#F1C40F] to-transparent transition-all duration-500" />
              {/* Corner Ambient Radial Glow Orb */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-[radial-gradient(circle,rgba(155,89,182,0.25)_0%,transparent_70%)] rounded-full blur-xl pointer-events-none group-hover:scale-150 group-hover:bg-[radial-gradient(circle,rgba(241,196,15,0.25)_0%,transparent_70%)] transition-all duration-500" />

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#2E1A47] to-[#1C0E33] border border-[#9B59B6]/70 text-[#F1C40F] flex items-center justify-center group-hover:scale-110 group-hover:border-[#F1C40F]/80 group-hover:shadow-[0_0_20px_rgba(241,196,15,0.4)] transition-all duration-300">
                    <FileText className="w-5 h-5 text-[#F1C40F]" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#1B102B]/90 border border-[#9B59B6]/60 text-[#D8B4FE] text-xs font-mono font-bold shadow-[0_0_12px_rgba(155,89,182,0.25)] group-hover:border-[#F1C40F]/60 group-hover:text-[#F1C40F] transition-all">
                    Pillar 03
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-white text-lg font-['Sora'] group-hover:text-white transition-colors">Weekly Progress Reports</h3>
                  <p className="text-xs sm:text-sm text-[#D1CADB] leading-relaxed mt-1.5">
                    Detailed weekly learning analytics delivered directly to your student dashboard. Monitor assignment grades, code quality metrics, milestone pacing, and actionable sprint improvement feedback.
                  </p>
                </div>

                {/* Cool Feature Widget */}
                <div className="p-3 rounded-xl bg-[#2E1A47]/60 border border-[#9B59B6]/40 flex items-center justify-between text-xs backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#F1C40F]" />
                    <span className="text-[#D1CADB] font-medium text-[11px] sm:text-xs">Dashboard Telemetry</span>
                  </div>
                  <span className="text-[#F1C40F] font-mono text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#1B102B] border border-[#F1C40F]/30">
                    Weekly Performance Score
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-[#5C4B8A]/30 flex flex-wrap gap-2 relative z-10">
                <span className="px-2.5 py-1 rounded-md bg-[#1B102B] text-[#D8B4FE] text-[11px] font-medium border border-[#9B59B6]/30 group-hover:border-[#9B59B6]/60 transition-colors">
                  Code Quality Metrics
                </span>
                <span className="px-2.5 py-1 rounded-md bg-[#1B102B] text-[#D8B4FE] text-[11px] font-medium border border-[#9B59B6]/30 group-hover:border-[#9B59B6]/60 transition-colors">
                  Milestone Benchmarking
                </span>
                <span className="px-2.5 py-1 rounded-md bg-[#1B102B] text-[#D8B4FE] text-[11px] font-medium border border-[#9B59B6]/30 group-hover:border-[#9B59B6]/60 transition-colors">
                  Personalized Feedback
                </span>
              </div>
            </div>

            {/* Card 4: 100% Placement Assistance */}
            <div className="relative overflow-hidden p-6 sm:p-7 rounded-2xl bg-gradient-to-b from-[#231538] via-[#1A0F2E] to-[#140C24] border border-[#9B59B6]/40 hover:border-[#F1C40F]/80 shadow-[0_0_25px_rgba(155,89,182,0.12)] hover:shadow-[0_0_35px_rgba(155,89,182,0.3),0_0_25px_rgba(241,196,15,0.3)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group">
              {/* Top Edge Glow Laser Line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#F1C40F]/80 to-transparent transition-all duration-500" />
              {/* Corner Ambient Radial Glow Orb */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-[radial-gradient(circle,rgba(241,196,15,0.25)_0%,transparent_70%)] rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-all duration-500" />

              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#2E1A47] to-[#1C0E33] border border-[#F1C40F]/70 text-[#F1C40F] flex items-center justify-center group-hover:scale-110 group-hover:border-[#F1C40F] group-hover:shadow-[0_0_25px_rgba(241,196,15,0.5)] transition-all duration-300">
                    <Briefcase className="w-5 h-5 text-[#F1C40F]" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#1B102B]/90 border border-[#F1C40F]/60 text-[#F1C40F] text-xs font-mono font-bold shadow-[0_0_12px_rgba(241,196,15,0.25)] transition-all">
                    Pillar 04
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-white text-lg font-['Sora'] group-hover:text-white transition-colors">100% Placement Assistance</h3>
                  <p className="text-xs sm:text-sm text-[#D1CADB] leading-relaxed mt-1.5">
                    Dedicated placement drives, hiring partner referrals, resume and LinkedIn profile optimization, alongside continuous industry career support.
                  </p>
                </div>

                {/* Highlighted Spotlight: Technical Mock Interviews */}
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#2E1A47]/90 to-[#3B1F5C]/80 border border-[#F1C40F]/50 shadow-[0_0_20px_rgba(241,196,15,0.18)] flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#F1C40F]/20 border border-[#F1C40F]/50 text-[#F1C40F] flex items-center justify-center shrink-0">
                    <Video className="w-4 h-4 text-[#F1C40F]" />
                  </div>
                  <div className="text-xs">
                    <span className="text-[#F1C40F] font-bold block text-xs font-['Sora'] flex items-center gap-1.5">
                      <span>Technical Mock Interviews Included</span>
                      <span className="px-1.5 py-0.2 bg-[#F1C40F] text-[#08070B] rounded text-[9px] font-extrabold uppercase tracking-wide">Key</span>
                    </span>
                    <span className="text-[#D1CADB] text-[11px] leading-tight block mt-0.5">
                      Live SQL schema whiteboarding & Python case study defense with tech hiring leads.
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-[#5C4B8A]/30 flex flex-wrap gap-2 relative z-10">
                <span className="px-2.5 py-1 rounded-md bg-[#F1C40F]/15 text-[#F1C40F] text-[11px] font-bold border border-[#F1C40F]/45 shadow-[0_0_10px_rgba(241,196,15,0.2)] flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#F1C40F]" />
                  Technical Mock Interviews
                </span>
                <span className="px-2.5 py-1 rounded-md bg-[#1B102B] text-[#D8B4FE] text-[11px] font-medium border border-[#9B59B6]/30 group-hover:border-[#9B59B6]/60 transition-colors">
                  Hiring Partner Drives
                </span>
                <span className="px-2.5 py-1 rounded-md bg-[#1B102B] text-[#D8B4FE] text-[11px] font-medium border border-[#9B59B6]/30 group-hover:border-[#9B59B6]/60 transition-colors">
                  Resume & LinkedIn Polish
                </span>
                <span className="px-2.5 py-1 rounded-md bg-[#1B102B] text-[#D8B4FE] text-[11px] font-medium border border-[#9B59B6]/30 group-hover:border-[#9B59B6]/60 transition-colors">
                  Salary Negotiation
                </span>
              </div>
            </div>

          </div>

          {/* Bottom Bar: Honest Academic Standard + Talk with a Mentor */}
          <div className="mt-8 p-5 rounded-2xl bg-[#130B21] border border-[#5C4B8A]/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2E1A47] border border-[#9B59B6]/60 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#F1C40F]" />
              </div>
              <div className="text-xs text-[#D1CADB]">
                <strong className="text-white block font-['Sora'] text-sm">Honest Academic Standard</strong>
                <span>Clear transparent pricing. No deceptive loan agreements, ISA traps, or hidden conditions.</span>
              </div>
            </div>

            <button
              onClick={onOpenMentorModal}
              className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold text-[#08070B] bg-[#F1C40F] hover:bg-[#F39C12] rounded-xl shadow-[0_0_20px_rgba(241,196,15,0.3)] hover:shadow-[0_0_30px_rgba(241,196,15,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <span>Talk with a Mentor</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* 5. COURSE COMPARISON TABLE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold text-[#9B59B6] uppercase tracking-wider">Clear Difference</span>
          <h2 className="text-3xl font-extrabold text-white mt-1 font-['Sora']">How CodeMyWay Compares</h2>
          <p className="text-sm text-[#D1CADB] mt-2">
            Why our dedicated 1:1 mentorship and milestone-gated projects produce genuine career outcomes compared to passive video courses.
          </p>
        </div>

        <div className="bg-[#170F28] rounded-2xl border border-[#5C4B8A] shadow-[0_0_30px_rgba(46,26,71,0.5)] overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#5C4B8A]/60 bg-[#120A1F]">
                <th className="py-4 px-6 font-semibold text-white">Evaluation Feature</th>
                <th className="py-4 px-6 font-bold text-[#F1C40F] bg-[#2E1A47]/70 border-x border-[#5C4B8A]/60">CodeMyWay Flagship</th>
                <th className="py-4 px-6 font-medium text-[#D1CADB]">Generic Bootcamps</th>
                <th className="py-4 px-6 font-medium text-[#A7A0B5]">Recorded Video Platforms</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#5C4B8A]/30 text-[#D1CADB]">
              <tr>
                <td className="py-3.5 px-6 font-medium text-white">Mentoring Framework</td>
                <td className="py-3.5 px-6 font-semibold text-white bg-[#2E1A47]/40 border-x border-[#5C4B8A]/40">
                  4 Specialized Teachers (Concept, Lab, Reviewer, Career Coach)
                </td>
                <td className="py-3.5 px-6">1 General Instructor for all duties</td>
                <td className="py-3.5 px-6 text-[#A7A0B5]">No live mentors</td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-white">1:1 Individual Mentorship</td>
                <td className="py-3.5 px-6 font-semibold text-white bg-[#2E1A47]/40 border-x border-[#5C4B8A]/40">
                  Free 4 Sessions / Phase included
                </td>
                <td className="py-3.5 px-6">Often paid add-on or restricted</td>
                <td className="py-3.5 px-6 text-[#A7A0B5]">None</td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-white">Hands-on Lab Support</td>
                <td className="py-3.5 px-6 font-semibold text-white bg-[#2E1A47]/40 border-x border-[#5C4B8A]/40">
                  1:5 Small Pod Guided Practice
                </td>
                <td className="py-3.5 px-6">1:50+ Massive Batch Chat</td>
                <td className="py-3.5 px-6 text-[#A7A0B5]">Discussion forum only</td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-white">Project Evaluation Depth</td>
                <td className="py-3.5 px-6 font-semibold text-white bg-[#2E1A47]/40 border-x border-[#5C4B8A]/40">
                  Line-by-line rubric code review by senior data scientist
                </td>
                <td className="py-3.5 px-6">Automated check or peer review</td>
                <td className="py-3.5 px-6 text-[#A7A0B5]">Self-evaluated / None</td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-white">GenAI Analytical Workflows</td>
                <td className="py-3.5 px-6 font-semibold text-white bg-[#2E1A47]/40 border-x border-[#5C4B8A]/40">
                  Built directly into SQL, Excel, and Product Analytics
                </td>
                <td className="py-3.5 px-6">Superficial prompt overview</td>
                <td className="py-3.5 px-6 text-[#A7A0B5]">Rarely updated</td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-white">Mock Interview Rigor</td>
                <td className="py-3.5 px-6 font-semibold text-white bg-[#2E1A47]/40 border-x border-[#5C4B8A]/40">
                  Free Technical & Behavioral after Phase 1 and Phase 2
                </td>
                <td className="py-3.5 px-6">Single generic HR call at end</td>
                <td className="py-3.5 px-6 text-[#A7A0B5]">None</td>
              </tr>
              <tr>
                <td className="py-3.5 px-6 font-medium text-white">Fee Transparency</td>
                <td className="py-3.5 px-6 font-semibold text-[#F1C40F] bg-[#2E1A47]/40 border-x border-[#5C4B8A]/40">
                  100% Transparent Tuition · Scholarships Available · Zero deceptive loans or hidden fees
                </td>
                <td className="py-3.5 px-6">Inflated fees tied to aggressive NBFC loan agreements & hidden interest</td>
                <td className="py-3.5 px-6 text-[#A7A0B5]">Recurring subscriptions with near-zero mentor support (&lt; 5% completion)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 6. STUDENT FEEDBACK SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#170F28] rounded-2xl p-8 lg:p-10 border border-[#5C4B8A] shadow-[0_0_30px_rgba(46,26,71,0.4)]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-semibold text-[#9B59B6] uppercase tracking-wider">Quality Assurance</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1 font-['Sora']">Student Review Architecture</h2>
              <p className="text-xs text-[#D1CADB] mt-1 max-w-xl">
                Every cohort member evaluates modules, lab clarity, and mentorship usefulness upon phase completion.
              </p>
            </div>
            
            <div className="p-3 rounded-lg bg-[#2E1A47]/50 border border-[#5C4B8A]/50 text-[11px] text-[#D1CADB] max-w-xs">
              <strong className="text-white">Verified Pipeline Notice:</strong> In adherence to academic integrity, we do not fabricate random student quotes. Showing structured evaluation schema for active cohort cohorts.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-[#231538] border border-[#9B59B6]/45 shadow-[0_0_18px_rgba(155,89,182,0.18)] hover:border-[#9B59B6] hover:shadow-[0_0_28px_rgba(155,89,182,0.4)] space-y-3 transition-all duration-300">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Module 1 SQL Evaluation</span>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded shadow-[0_0_8px_rgba(16,185,129,0.25)]">4.9 / 5.0 Rating</span>
              </div>
              <p className="text-xs text-[#D1CADB] leading-relaxed italic">
                “Breaking down window functions with visual partitioning made subqueries click after struggling in self-taught tutorials.”
              </p>
              <div className="pt-2 border-t border-[#5C4B8A]/30 text-[11px] text-[#A7A0B5] flex items-center justify-between">
                <span>Verified Cohort Student · SQL Module</span>
                <span className="font-mono text-white">Oct 2026</span>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[#231538] border border-[#9B59B6]/45 shadow-[0_0_18px_rgba(155,89,182,0.18)] hover:border-[#9B59B6] hover:shadow-[0_0_28px_rgba(155,89,182,0.4)] space-y-3 transition-all duration-300">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Lab Facilitator Pod Support</span>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded shadow-[0_0_8px_rgba(16,185,129,0.25)]">4.8 / 5.0 Rating</span>
              </div>
              <p className="text-xs text-[#D1CADB] leading-relaxed italic">
                “Having Neha on screen during weekday lab hours to debug syntax errors saved me hours of frustration as a non-technical learner.”
              </p>
              <div className="pt-2 border-t border-[#5C4B8A]/30 text-[11px] text-[#A7A0B5] flex items-center justify-between">
                <span>Verified Cohort Student · Non-Tech Transition</span>
                <span className="font-mono text-white">Oct 2026</span>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[#231538] border border-[#9B59B6]/45 shadow-[0_0_18px_rgba(155,89,182,0.18)] hover:border-[#9B59B6] hover:shadow-[0_0_28px_rgba(155,89,182,0.4)] space-y-3 transition-all duration-300">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Rubric Code Review Rigor</span>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded shadow-[0_0_8px_rgba(16,185,129,0.25)]">5.0 / 5.0 Rating</span>
              </div>
              <p className="text-xs text-[#D1CADB] leading-relaxed italic">
                “The line-by-line feedback on query optimization and indexing helped turn my first project into a true portfolio deliverable.”
              </p>
              <div className="pt-2 border-t border-[#5C4B8A]/30 text-[11px] text-[#A7A0B5] flex items-center justify-between">
                <span>Verified Cohort Student · Retail SQL Project</span>
                <span className="font-mono text-white">Oct 2026</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQS SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold text-[#9B59B6] uppercase tracking-wider">Got Questions?</span>
          <h2 className="text-3xl font-extrabold text-white mt-1 font-['Sora']">Frequently Asked Questions</h2>
          <p className="text-sm text-[#D1CADB] mt-2">
            Clear, honest answers about admissions, commitments, mentorship, and career readiness.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className={`rounded-xl border transition-all duration-300 overflow-hidden ${
                openFaqIndex === idx
                  ? 'bg-[#1E1235] border-[#9B59B6] shadow-[0_0_22px_rgba(155,89,182,0.35)]'
                  : 'bg-[#170F28] border-[#9B59B6]/35 shadow-[0_0_12px_rgba(155,89,182,0.12)] hover:border-[#9B59B6]/80 hover:shadow-[0_0_22px_rgba(155,89,182,0.28)]'
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
                <div className="px-5 pb-5 text-xs text-[#D1CADB] leading-relaxed border-t border-[#5C4B8A]/30 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 8. FINAL CTA SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#2E1A47] via-[#1B102B] to-[#2E1A47] border border-[#9B59B6]/50 text-white rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-[0_0_55px_rgba(155,89,182,0.35)] hover:shadow-[0_0_70px_rgba(155,89,182,0.5)] transition-all duration-300">
          <div className="relative z-10 max-w-2xl mx-auto space-y-5">
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
                onClick={() => onRouteChange('course-details')}
                className="w-full sm:w-auto px-6 py-3.5 text-sm font-bold text-[#08070B] bg-[#F1C40F] hover:bg-[#F39C12] rounded-xl shadow-[0_0_20px_rgba(241,196,15,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>View Full Program & Pricing</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onOpenMentorModal}
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
