import React, { useState } from 'react';
import { NavigationRoute, StudentUser } from '../../types';
import { Menu, X, ArrowRight, GraduationCap, LogIn, LogOut, User } from 'lucide-react';
import codemywayLogo from '../../assets/images/codemyway_logo.png';

interface HeaderProps {
  currentRoute: NavigationRoute;
  onRouteChange: (route: NavigationRoute) => void;
  onOpenBrochure?: () => void;
  currentUser?: StudentUser | null;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentRoute, 
  onRouteChange,
  currentUser,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (route: NavigationRoute) => {
    onRouteChange(route);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="w-full bg-[#08070B]/90 backdrop-blur-md border-b border-[#5C4B8A]/40 transition-colors">
      {/* Strict 3-Zone Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: CodeMyWay Official Brand Logo */}
        <button
          onClick={() => handleNav('home')}
          className="whitespace-nowrap shrink-0 flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9B59B6] rounded cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
          aria-label="CodeMyWay Home"
        >
          <img
            src={codemywayLogo}
            alt="CodeMyWay - Where Skill Becomes Career"
            className="h-9 sm:h-10 w-auto object-contain drop-shadow-[0_2px_15px_rgba(155,89,182,0.35)]"
          />
        </button>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#D1CADB]">
          <button
            onClick={() => handleNav('home')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white cursor-pointer ${
              currentRoute === 'home' ? 'text-[#9B59B6] font-semibold border-b-2 border-[#9B59B6] pb-0.5' : ''
            }`}
          >
            Home
          </button>
          
          <button
            onClick={() => handleNav('course-details')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white cursor-pointer ${
              currentRoute === 'course-details' ? 'text-[#9B59B6] font-semibold border-b-2 border-[#9B59B6] pb-0.5' : ''
            }`}
          >
            Flagship
          </button>

          <button
            onClick={() => handleNav('skill-store')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white cursor-pointer ${
              currentRoute === 'skill-store' ? 'text-[#9B59B6] font-semibold border-b-2 border-[#9B59B6] pb-0.5' : ''
            }`}
          >
            Skill Store
          </button>

          {currentUser?.isLoggedIn ? (
            currentUser.role === 'INSTRUCTOR' || currentUser.role === 'MENTOR' || currentUser.role === 'ADMIN' ? (
              <button
                onClick={() => handleNav('faculty-reviews')}
                className={`whitespace-nowrap shrink-0 transition-colors hover:text-white flex items-center gap-1.5 cursor-pointer ${
                  currentRoute === 'faculty-reviews' ? 'text-[#9B59B6] font-semibold border-b-2 border-[#9B59B6] pb-0.5' : ''
                }`}
              >
                <GraduationCap className="w-4 h-4 text-[#9B59B6]" />
                <span>Faculty Reviews</span>
              </button>
            ) : (
              <button
                onClick={() => handleNav('student-dashboard')}
                className={`whitespace-nowrap shrink-0 transition-colors hover:text-white flex items-center gap-1.5 cursor-pointer ${
                  currentRoute === 'student-dashboard' ? 'text-[#9B59B6] font-semibold border-b-2 border-[#9B59B6] pb-0.5' : ''
                }`}
              >
                <GraduationCap className="w-4 h-4 text-[#9B59B6]" />
                <span>Dashboard</span>
              </button>
            )
          ) : (
            <button
              onClick={() => handleNav('login')}
              className={`whitespace-nowrap shrink-0 transition-colors hover:text-white flex items-center gap-1.5 cursor-pointer ${
                currentRoute === 'login' ? 'text-[#9B59B6] font-semibold border-b-2 border-[#9B59B6] pb-0.5' : ''
              }`}
            >
              <LogIn className="w-4 h-4 text-[#9B59B6]" />
              <span>Student Portal</span>
            </button>
          )}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {currentUser?.isLoggedIn ? (
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => handleNav('student-dashboard')}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-purple-600/25 hover:bg-purple-600/35 border border-purple-500/40 rounded-lg flex items-center gap-2 transition-all cursor-pointer shadow-sm shadow-purple-600/20"
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white flex items-center justify-center text-[10px] font-bold">
                  {currentUser.fullName ? currentUser.fullName.charAt(0) : 'A'}
                </div>
                <span>{currentUser.fullName.split(' ')[0]}</span>
                <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-500/30">
                  Online
                </span>
              </button>
              <button
                onClick={() => onLogout?.()}
                title="Log Out of Student Portal"
                className="p-1.5 text-[#94A3B8] hover:text-rose-400 rounded-lg hover:bg-[#1E162D] transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNav('login')}
                className="px-3 py-1.5 text-xs font-semibold text-[#D1CADB] hover:text-white bg-[#1A1228] hover:bg-[#251A3A] border border-[#483566] rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5 text-purple-400" />
                <span>Login</span>
              </button>
              <button
                onClick={() => handleNav('login')}
                className="px-4 py-2 text-xs font-bold text-[#08070B] bg-[#F1C40F] hover:bg-[#F39C12] rounded-lg shadow-[0_0_15px_rgba(241,196,15,0.25)] transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer hover:shadow-[0_0_20px_rgba(241,196,15,0.4)]"
              >
                <span>Student Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#D1CADB] hover:text-white focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#5C4B8A]/40 bg-[#120A1F] px-4 pt-3 pb-5 space-y-3">
          <button
            onClick={() => handleNav('home')}
            className={`block w-full text-left py-2 text-sm font-medium ${
              currentRoute === 'home' ? 'text-[#9B59B6] font-bold' : 'text-[#D1CADB]'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNav('course-details')}
            className={`block w-full text-left py-2 text-sm font-medium ${
              currentRoute === 'course-details' ? 'text-[#9B59B6] font-bold' : 'text-[#D1CADB]'
            }`}
          >
            Flagship
          </button>
          <button
            onClick={() => handleNav('skill-store')}
            className={`block w-full text-left py-2 text-sm font-medium ${
              currentRoute === 'skill-store' ? 'text-[#9B59B6] font-bold' : 'text-[#D1CADB]'
            }`}
          >
            Skill Store (Micro-Courses)
          </button>
          <button
            onClick={() => handleNav(currentUser?.isLoggedIn ? 'student-dashboard' : 'login')}
            className={`block w-full text-left py-2 text-sm font-medium ${
              currentRoute === 'login' || currentRoute === 'student-dashboard' ? 'text-[#9B59B6] font-bold' : 'text-[#D1CADB]'
            }`}
          >
            {currentUser?.isLoggedIn ? 'Student Dashboard' : 'Student Login / Portal'}
          </button>
          <div className="pt-2 border-t border-[#5C4B8A]/30">
            <button
              onClick={() => handleNav(currentUser?.isLoggedIn ? 'student-dashboard' : 'login')}
              className="w-full py-2.5 px-4 text-xs font-bold text-[#08070B] bg-[#F1C40F] hover:bg-[#F39C12] rounded-lg text-center transition-colors"
            >
              {currentUser?.isLoggedIn ? 'Open Student Dashboard' : 'Login to Student Portal'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
