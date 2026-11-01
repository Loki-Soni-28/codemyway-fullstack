import React, { useState } from 'react';
import { NavigationRoute } from '../../types';
import { 
  Sparkles, 
  ArrowRight, 
  Bell, 
  Layers, 
  Code2, 
  Database, 
  BarChart3, 
  Cpu, 
  Flame,
  Check,
  Zap,
  Target,
  Terminal,
  Radio
} from 'lucide-react';
import { motion } from 'motion/react';
import skillStoreHeroImage from '../../assets/images/skill_store_workspace_1792917846265.jpg';

interface SkillStorePageProps {
  onRouteChange: (route: NavigationRoute) => void;
  onOpenNotifyModal: (courseTitle: string, isPrebooking: boolean) => void;
  onOpenEnrollModal?: (courseTitle: string) => void;
}

export const SkillStorePage: React.FC<SkillStorePageProps> = ({
  onRouteChange,
  onOpenNotifyModal
}) => {
  const [emailInput, setEmailInput] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setIsSubscribed(true);
  };

  const upcomingSkills = [
    { name: 'SQL Schema & Window Functions', icon: Database, color: 'text-[#9B59B6]', bgGlow: '' },
    { name: 'Executive Tableau & Power BI', icon: BarChart3, color: 'text-[#F1C40F]', bgGlow: 'hover:shadow-[0_0_15px_rgba(241,196,15,0.4)]' },
    { name: 'Python & Pandas Vectorization', icon: Code2, color: 'text-[#2ECC71]', bgGlow: 'hover:shadow-[0_0_15px_rgba(46,204,113,0.4)]' },
    { name: 'GenAI Automation & LLM APIs', icon: Cpu, color: 'text-[#38BDF8]', bgGlow: 'hover:shadow-[0_0_15px_rgba(56,189,248,0.4)]' },
    { name: 'A/B Hypothesis & Experimentation', icon: Layers, color: 'text-[#E056FD]', bgGlow: 'hover:shadow-[0_0_15px_rgba(224,86,253,0.4)]' }
  ];

  // Floating background decorative glyphs
  const floatingGlyphs = [
    { text: '</>', top: '15%', left: '8%', delay: 0, duration: 7, size: 'text-2xl', color: 'text-[#9B59B6]/30' },
    { text: '{ SQL }', top: '28%', right: '10%', delay: 1.5, duration: 8, size: 'text-lg', color: 'text-[#F1C40F]/30' },
    { text: 'λ => AI', top: '70%', left: '6%', delay: 2, duration: 9, size: 'text-xl', color: 'text-[#38BDF8]/30' },
    { text: '0101', top: '75%', right: '8%', delay: 0.8, duration: 6.5, size: 'text-sm font-mono', color: 'text-[#2ECC71]/30' },
    { text: '✦', top: '12%', right: '22%', delay: 3, duration: 5, size: 'text-xl', color: 'text-[#C084FC]/40' },
    { text: 'df.query()', top: '55%', right: '5%', delay: 1, duration: 7.5, size: 'text-xs font-mono', color: 'text-[#9B59B6]/35' },
    { text: '∑(x)', top: '50%', left: '4%', delay: 2.5, duration: 8.5, size: 'text-sm font-mono', color: 'text-[#F1C40F]/25' }
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-between bg-[#08070B] text-white relative overflow-hidden pb-16">
      
      {/* 1. AMBIENT LIGHTING, RADAR WAVES & FLOATING GLYPHS */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none">
        <img
          src={skillStoreHeroImage}
          alt="Skill Store Workspace"
          className="w-full h-full object-cover object-center opacity-25 scale-105"
          style={{
            filter: 'brightness(0.55) contrast(1.2)',
          }}
        />

        {/* Multi-tier dark gradients for cinematic depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#08070B] via-[#08070B]/85 to-[#08070B] pointer-events-none" />
        
        {/* Animated Concentric Radar Pulse Rings behind the center card */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
          <div className="w-[380px] h-[380px] sm:w-[540px] sm:h-[540px] rounded-full border border-[#9B59B6]/20 animate-radar-wave" />
          <div className="w-[280px] h-[280px] sm:w-[420px] sm:h-[420px] rounded-full border border-[#F1C40F]/20 animate-radar-wave [animation-delay:1.5s]" />
          <div className="w-[180px] h-[180px] sm:w-[300px] sm:h-[300px] rounded-full border border-[#9B59B6]/25 animate-radar-wave [animation-delay:2.8s]" />
        </div>

        {/* Ambient Pulsing Aura Orbs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[600px] bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(155,89,182,0.25),transparent_75%)] animate-pulse-glow pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-[radial-gradient(circle,rgba(241,196,15,0.14)_0%,transparent_70%)] pointer-events-none blur-3xl animate-pulse-glow [animation-delay:2s]" />

        {/* Floating tech glyphs in the background */}
        {floatingGlyphs.map((glyph, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ 
              opacity: [0.2, 0.7, 0.2],
              y: [0, -18, 0],
              rotate: [0, index % 2 === 0 ? 5 : -5, 0]
            }}
            transition={{
              duration: glyph.duration,
              delay: glyph.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className={`absolute ${glyph.size} ${glyph.color} font-bold select-none pointer-events-none hidden md:block`}
            style={{
              top: glyph.top,
              left: glyph.left,
              right: glyph.right
            }}
          >
            {glyph.text}
          </motion.div>
        ))}
      </div>

      {/* 2. MAIN CONTENT WITH STAGGERED SPRING ANIMATION */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full my-auto py-12 sm:py-16">
        
        {/* Breadcrumb with fade-in */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-2 text-xs text-[#A7A0B5] mb-8"
        >
          <button 
            onClick={() => onRouteChange('home')} 
            className="hover:text-white transition-colors cursor-pointer"
          >
            Home
          </button>
          <span>/</span>
          <span className="text-[#9B59B6] font-semibold">Skill Store</span>
          <span>/</span>
          <span className="text-[#F1C40F] font-mono flex items-center gap-1">
            <Radio className="w-3 h-3 text-[#F1C40F] animate-pulse" />
            Coming Soon
          </span>
        </motion.div>

        {/* Floating Pill Badges around the Card (Desktop only for neatness) */}
        <div className="relative">
          {/* Left Floating Pill */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ 
              opacity: 1, 
              x: 0,
              y: [0, -8, 0]
            }}
            transition={{
              x: { duration: 0.6, delay: 0.3 },
              y: { duration: 5, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute -top-4 -left-6 z-20 hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1A102E]/90 border border-[#5C4B8A]/60 backdrop-blur-md text-xs font-semibold text-white pointer-events-none"
          >
            <Zap className="w-3.5 h-3.5 text-[#F1C40F]" />
            <span>Modular · Self-Paced</span>
          </motion.div>

          {/* Right Floating Pill */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ 
              opacity: 1, 
              x: 0,
              y: [0, 8, 0]
            }}
            transition={{
              x: { duration: 0.6, delay: 0.4 },
              y: { duration: 5.5, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute -bottom-4 -right-6 z-20 hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1A102E]/90 border border-[#2ECC71]/50 shadow-[0_0_20px_rgba(46,204,113,0.3)] backdrop-blur-md text-xs font-semibold text-white pointer-events-none"
          >
            <Target className="w-3.5 h-3.5 text-[#2ECC71]" />
            <span>Interactive Sandboxes</span>
          </motion.div>

          {/* Aesthetic Centerpiece Card with Animated Border Beam & Levitation */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-2xl bg-[#120A1F]/80 backdrop-blur-xl border border-[#5C4B8A]/60 p-7 sm:p-12 lg:p-16 text-center group"
          >
            
            {/* Animated Laser Border Beam Sweep (Top & Bottom) */}
            <div className="absolute top-0 left-0 right-0 h-[2px] overflow-hidden">
              <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-[#F1C40F] to-transparent animate-laser-sweep" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-[1.5px] overflow-hidden">
              <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-[#9B59B6] to-transparent animate-laser-sweep [animation-delay:1.8s]" />
            </div>
            
            {/* Corner Ambient Glow Orbs */}
            <div className="absolute -top-16 -right-16 w-52 h-52 bg-[radial-gradient(circle,rgba(155,89,182,0.35)_0%,transparent_70%)] rounded-full blur-2xl pointer-events-none animate-pulse-glow" />
            <div className="absolute -bottom-16 -left-16 w-52 h-52 bg-[radial-gradient(circle,rgba(241,196,15,0.25)_0%,transparent_70%)] rounded-full blur-2xl pointer-events-none animate-pulse-glow [animation-delay:2.5s]" />

            {/* Glowing Status Badge with Ping Indicator */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1B102B]/90 border border-[#5C4B8A]/60 text-xs font-semibold text-[#D1CADB] backdrop-blur-md mb-6 hover:border-[#9B59B6] transition-all cursor-default"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2ECC71] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2ECC71]"></span>
              </span>
              <span className="text-white">Curated Micro-Courses</span>
              <span className="text-[#5C4B8A]">·</span>
              <span className="text-[#F1C40F] font-bold">In Active Development</span>
            </motion.div>

            {/* Aesthetic Headline with Animated Text Shimmer */}
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight font-['Sora'] leading-tight mb-4"
            >
              <span className="block text-xl sm:text-2xl text-[#C084FC] font-semibold mb-2 tracking-wide font-sans">
                CodeMyWay Skill Store
              </span>
              <span className="bg-gradient-to-r from-white via-[#F5EDFD] to-[#D8B4FE] bg-clip-text text-transparent drop-">
                Coming
              </span>{' '}
              <span className="bg-gradient-to-r from-[#F1C40F] via-[#F39C12] via-[#FFD700] to-[#F1C40F] bg-clip-text text-transparent drop-shadow-[0_4px_35px_rgba(241,196,15,0.55)] animate-text-shimmer inline-block">
                Soon.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-sm sm:text-base lg:text-lg text-[#D1CADB] max-w-2xl mx-auto leading-relaxed mb-8"
            >
              We’re crafting self-paced, high-impact modular micro-courses so you can master individual, verifiable tech capabilities at your own pace without full semester commitments.
            </motion.p>

            {/* Interactive VIP Early Access Box with Glow */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="max-w-md mx-auto mb-10"
            >
              {!isSubscribed ? (
                <form onSubmit={handleNotifySubmit} className="space-y-3">
                  <div className="flex flex-col sm:flex-row items-center gap-2 p-1.5 rounded-2xl bg-[#0C0717]/90 border border-[#5C4B8A]/60 focus-within:border-[#9B59B6] focus-within:transition-all">
                    <input
                      type="email"
                      required
                      placeholder="Enter your email for early VIP access..."
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs sm:text-sm bg-transparent text-white placeholder-[#A7A0B5] focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-5 py-2.5 bg-[#F1C40F] hover:bg-[#F39C12] active:scale-95 text-[#08070B] font-bold text-xs sm:text-sm rounded-xl shadow-[0_0_18px_rgba(241,196,15,0.35)] hover:shadow-[0_0_25px_rgba(241,196,15,0.6)] transition-all whitespace-nowrap cursor-pointer flex items-center justify-center gap-1.5 group"
                    >
                      <Bell className="w-3.5 h-3.5 text-[#08070B] group-hover:rotate-12 transition-transform" />
                      <span>Get Notified</span>
                    </button>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-[11px] text-[#A7A0B5]">
                    <Flame className="w-3 h-3 text-[#F1C40F] animate-pulse" />
                    <span>First 100 learners unlock <strong className="text-white">40% OFF</strong> initial course drop</span>
                  </div>
                </form>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 rounded-2xl bg-[#1A2E1A]/80 border border-[#2ECC71]/50 text-white flex items-center justify-center gap-3 shadow-[0_0_25px_rgba(46,204,113,0.3)]"
                >
                  <div className="w-7 h-7 rounded-full bg-[#2ECC71]/20 border border-[#2ECC71] flex items-center justify-center text-[#2ECC71]">
                    <Check className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-xs sm:text-sm text-[#2ECC71]">You’re on the priority waitlist!</p>
                    <p className="text-[11px] text-[#D1CADB]">We will email you first when the first modules drop.</p>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Upcoming Micro-Skills Preview Chips with Staggered Entrance & Interactive Hover */}
            <div className="border-t border-[#5C4B8A]/30 pt-8">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#9B59B6] font-bold block mb-4">
                Upcoming Skill Tracks in Production
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
                {upcomingSkills.map((skill, index) => {
                  const IconComponent = skill.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.08, duration: 0.4 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#1A102E]/85 border border-[#5C4B8A]/50 text-xs text-[#D1CADB] shadow-sm hover:border-[#9B59B6] hover:text-white transition-all cursor-default ${skill.bgGlow}`}
                    >
                      <IconComponent className={`w-3.5 h-3.5 ${skill.color} transition-transform group-hover:scale-110`} />
                      <span>{skill.name}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

          </motion.div>
        </div>

        {/* 3. FLAGSHIP PROGRAM CALLOUT GATEWAY WITH HOVER GLOW */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#170F28] via-[#231538] to-[#170F28] border border-[#5C4B8A]/60 hover:border-[#5C4B8A]/60 transition-all flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left group"
        >
          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-semibold text-[#F1C40F]">
              <Sparkles className="w-3.5 h-3.5 text-[#F1C40F] animate-pulse" />
              <span>Don’t want to wait for standalone modules?</span>
            </div>
            <p className="text-xs sm:text-sm text-[#D1CADB]">
              Enroll in our live 24-week <strong className="text-white font-semibold">Data Analyst + GenAI Flagship Program</strong> with 1:1 mentor backing.
            </p>
          </div>

          <button
            onClick={() => onRouteChange('course-details')}
            className="px-5 py-2.5 text-xs font-bold text-[#08070B] bg-[#F1C40F] hover:bg-[#F39C12] rounded-xl shadow-[0_0_15px_rgba(241,196,15,0.3)] hover:shadow-[0_0_25px_rgba(241,196,15,0.55)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 group/btn"
          >
            <span>View Flagship Program</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </motion.div>

      </div>

    </div>
  );
};
