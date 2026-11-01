import React from 'react';
import { NavigationRoute } from '../../types';
import { ShieldCheck, Sparkles } from 'lucide-react';
import codemywayLogo from '../../assets/images/codemyway_logo.png';

interface FooterProps {
  onRouteChange: (route: NavigationRoute) => void;
  onOpenBrochure?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onRouteChange, onOpenBrochure }) => {
  return (
    <footer className="bg-[#050408] text-[#D1CADB] border-t border-[#5C4B8A]/40 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="space-y-3">
            <button
              onClick={() => { onRouteChange('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="flex items-center text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9B59B6] rounded cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
              aria-label="CodeMyWay Home"
            >
              <img
                src={codemywayLogo}
                alt="CodeMyWay - Where Skill Becomes Career"
                className="h-10 sm:h-11 w-auto object-contain drop-shadow-[0_2px_15px_rgba(155,89,182,0.35)]"
              />
            </button>
            <p className="text-[#A7A0B5] text-xs leading-relaxed">
              Premium technology education and career platform empowering beginners, career switchers, and working professionals with rigorous, hands-on learning.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-[#9B59B6] font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Structured learning with 4-teacher support</span>
            </div>
          </div>

          {/* Programs */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs tracking-wider uppercase font-['Sora']">Flagship Programs</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => onRouteChange('course-details')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Data Analyst + GenAI (24 Weeks)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onRouteChange('course-details')}
                  className="text-[#A7A0B5] hover:text-white transition-colors text-left cursor-pointer"
                >
                  Phase 1: Analytical Foundations (SQL/Excel/Tableau)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onRouteChange('course-details')}
                  className="text-[#A7A0B5] hover:text-white transition-colors text-left cursor-pointer"
                >
                  Phase 2: Applied Python & Statistics
                </button>
              </li>
              <li>
                {onOpenBrochure && (
                  <button 
                    onClick={onOpenBrochure}
                    className="text-[#9B59B6] hover:text-violet-300 transition-colors font-medium text-left cursor-pointer"
                  >
                    Download Program Brochure
                  </button>
                )}
              </li>
            </ul>
          </div>

          {/* Skill Store */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs tracking-wider uppercase font-['Sora']">Skill Store Catalog</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => onRouteChange('skill-store')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  SQL for Product Analytics
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onRouteChange('skill-store')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Advanced Excel & Power Query
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onRouteChange('skill-store')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Tableau BI Dashboards
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onRouteChange('skill-store')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  GenAI Analytical Workflows
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onRouteChange('skill-store')}
                  className="text-[#F1C40F] hover:text-amber-300 transition-colors text-left cursor-pointer"
                >
                  Coming Soon: Interview Prep & Projects
                </button>
              </li>
            </ul>
          </div>

          {/* Student & Prototype Info */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-xs tracking-wider uppercase font-['Sora']">Student Portal</h4>
            <ul className="space-y-2 mb-4">
              <li>
                <button 
                  onClick={() => onRouteChange('login')}
                  className="hover:text-white transition-colors text-left cursor-pointer text-[#F1C40F] font-semibold"
                >
                  Student Login / Register
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onRouteChange('student-dashboard')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Student Dashboard Access
                </button>
              </li>
              <li>
                <span className="text-[#A7A0B5]">1:1 Mentorship Session Portal</span>
              </li>
              <li>
                <span className="text-[#A7A0B5]">Assignment & Project Evaluation</span>
              </li>
            </ul>
            <div className="p-3 rounded-xl bg-[#1B102B] border border-[#5C4B8A]/40 text-[11px] text-[#D1CADB] space-y-1">
              <div className="text-white font-medium flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#9B59B6]" />
                <span>Transparent Academic Standard</span>
              </div>
              <p className="text-[#A7A0B5]">
                We focus strictly on verifiable competencies, mock interviews, and code portfolio quality. No fabricated job guarantees or unconfirmed placement claims.
              </p>
            </div>
          </div>
        </div>

        {/* Legal & Prototype notice */}
        <div className="border-t border-[#5C4B8A]/30 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-[#A7A0B5]">
          <p>© 2026 CodeMyWay Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Prototype Environment</span>
            <span>·</span>
            <span>Fee Transparency Notice</span>
            <span>·</span>
            <span>Academic Code of Ethics</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
