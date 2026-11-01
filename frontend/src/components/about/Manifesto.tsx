import React from 'react';
import { NavigationRoute } from '../../types';
import { ArrowRight, BookOpen, BrainCircuit, Briefcase, Clock, Quote, Sparkles, Users } from 'lucide-react';

export const Manifesto: React.FC<{ onRouteChange: (route: NavigationRoute) => void }> = ({ onRouteChange }) => (
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#231538] via-[#1A0F2E] to-[#140C24] border border-[#5C4B8A]/60 hover:border-[#F1C40F]/70 hover:-translate-y-1 transition-all duration-300 p-5 sm:p-7 lg:p-8 flex flex-col justify-between group">
          
          {/* Top Edge Glow Laser Line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#9B59B6]/70 group-hover:via-[#F1C40F] to-transparent transition-all duration-500" />
          
          {/* Corner Ambient Radial Glow Orbs */}
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-[radial-gradient(circle,rgba(155,89,182,0.25)_0%,transparent_70%)] rounded-full blur-xl pointer-events-none group-hover:scale-125 group-hover:bg-[radial-gradient(circle,rgba(241,196,15,0.25)_0%,transparent_70%)] transition-all duration-500" />
          <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-[radial-gradient(circle,rgba(155,89,182,0.15)_0%,transparent_70%)] rounded-full blur-xl pointer-events-none transition-all duration-500" />

          {/* Article Header / Metadata (Compact) */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-2.5 pb-4 border-b border-[#5C4B8A]/30 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2E1A47] to-[#1C0E33] border border-[#5C4B8A]/60 text-[#F1C40F] flex items-center justify-center group-hover:scale-105 group-hover:border-[#F1C40F]/80 transition-all">
                <BookOpen className="w-4 h-4 text-[#F1C40F]" />
              </div>
              <div>
                <span className="text-[10px] font-semibold text-[#9B59B6] uppercase tracking-wider block">Manifesto</span>
                <span className="text-white font-bold text-xs font-['Sora']">Inside the Vision</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-xs">
              <span className="px-2.5 py-0.5 rounded-full bg-[#1B102B]/90 border border-[#5C4B8A]/60 text-[#D8B4FE] text-[11px] font-mono font-bold shadow-sm group-hover:border-[#F1C40F]/60 group-hover:text-[#F1C40F] transition-all flex items-center gap-1.5">
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
            <div className="p-2.5 rounded-xl bg-[#2E1A47]/60 border border-[#5C4B8A]/60 flex items-center justify-between text-xs backdrop-blur-sm group-hover:border-[#5C4B8A]/60 transition-all">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#9B59B6]/20 border border-[#5C4B8A]/60 text-[#D8B4FE] flex items-center justify-center shrink-0">
                  <Users className="w-3 h-3 text-[#F1C40F]" />
                </div>
                <span className="text-[#D1CADB] font-medium text-[11px]">Dedicated Mentors</span>
              </div>
              <span className="text-[#F1C40F] font-mono text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#1B102B] border border-[#F1C40F]/30">
                1:1 Live
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#2E1A47]/60 border border-[#5C4B8A]/60 flex items-center justify-between text-xs backdrop-blur-sm group-hover:border-[#5C4B8A]/60 transition-all">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#9B59B6]/20 border border-[#5C4B8A]/60 text-[#D8B4FE] flex items-center justify-center shrink-0">
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
);
