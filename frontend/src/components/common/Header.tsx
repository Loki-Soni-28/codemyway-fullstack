import React, { useState } from 'react';
import { NavigationRoute, StudentUser } from '../../types';
import { Menu, X, GraduationCap, LogOut } from 'lucide-react';
import codemywayLogo from '../../assets/images/codemyway_logo.png';

interface HeaderProps {
  currentRoute: NavigationRoute;
  onRouteChange: (route: NavigationRoute) => void;
  onOpenMentors: () => void;
  currentUser?: StudentUser | null;
  onLogout?: () => void;
}

interface NavItem {
  label: string;
  isActive: boolean;
  onSelect: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRoute,
  onRouteChange,
  onOpenMentors,
  currentUser,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (route: NavigationRoute) => {
    onRouteChange(route);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems: NavItem[] = [
    { label: 'Home', isActive: currentRoute === 'home', onSelect: () => handleNav('home') },
    {
      label: 'Programs',
      isActive: currentRoute === 'course-details' || currentRoute === 'skill-store',
      onSelect: () => handleNav('course-details'),
    },
    {
      label: 'Mentors',
      isActive: currentRoute === 'mentors',
      onSelect: () => {
        setMobileMenuOpen(false);
        onOpenMentors();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    },
    { label: 'About Us', isActive: currentRoute === 'about', onSelect: () => handleNav('about') },
    { label: 'Contact', isActive: currentRoute === 'contact', onSelect: () => handleNav('contact') },
  ];

  const isStaff = currentUser?.role === 'INSTRUCTOR' || currentUser?.role === 'MENTOR' || currentUser?.role === 'ADMIN';
  const portalRoute: NavigationRoute = isStaff ? 'faculty-reviews' : 'student-dashboard';
  const portalLabel = isStaff ? 'Faculty Reviews' : 'My Dashboard';

  const activeCls = 'text-[#9B59B6] font-semibold border-b-2 border-[#9B59B6] pb-0.5';

  return (
    <header className="w-full bg-[#08070B]/90 backdrop-blur-md border-b border-[#5C4B8A]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">

        {/* Brand */}
        <button
          onClick={() => handleNav('home')}
          className="whitespace-nowrap shrink-0 flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9B59B6] rounded cursor-pointer"
          aria-label="CodeMyWay Home"
        >
          <img
            src={codemywayLogo}
            alt="CodeMyWay - Where Skill Becomes Career"
            className="h-9 sm:h-10 w-auto object-contain"
          />
        </button>

        {/* Navigation: Home, Programs, Mentors, About Us, Contact */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#D1CADB]" aria-label="Main">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={item.onSelect}
              className={`whitespace-nowrap shrink-0 transition-colors hover:text-white cursor-pointer ${item.isActive ? activeCls : ''}`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Account + primary action */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {currentUser?.isLoggedIn ? (
            <>
              <button
                onClick={() => handleNav(portalRoute)}
                title={portalLabel}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-purple-600/25 hover:bg-purple-600/35 border border-purple-500/40 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white flex items-center justify-center text-[10px] font-bold">
                  {currentUser.fullName ? currentUser.fullName.charAt(0) : 'A'}
                </div>
                <span>{currentUser.fullName.split(' ')[0]}</span>
              </button>
              <button
                onClick={() => onLogout?.()}
                title="Log out"
                aria-label="Log out"
                className="p-1.5 text-[#94A3B8] hover:text-rose-400 rounded-lg hover:bg-[#1E162D] transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={() => handleNav('login')}
              className="px-3 py-1.5 text-xs font-semibold text-[#D1CADB] hover:text-white bg-[#1A1228] hover:bg-[#251A3A] border border-[#483566] rounded-lg transition-colors cursor-pointer"
            >
              Login
            </button>
          )}
          <button
            onClick={() => handleNav('course-details')}
            className="px-4 py-2 text-xs font-bold text-[#08070B] bg-[#F1C40F] hover:bg-[#F39C12] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
          >
            Enroll Now
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#D1CADB] hover:text-white focus:outline-none"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#5C4B8A]/40 bg-[#120A1F] px-4 pt-3 pb-5">
          <nav className="flex flex-col" aria-label="Main">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={item.onSelect}
                className={`w-full text-left py-3 text-base font-medium border-b border-[#5C4B8A]/20 ${
                  item.isActive ? 'text-[#9B59B6] font-bold' : 'text-[#D1CADB]'
                }`}
              >
                {item.label}
              </button>
            ))}
            {currentUser?.isLoggedIn ? (
              <>
                <button
                  onClick={() => handleNav(portalRoute)}
                  className="w-full text-left py-3 text-base font-medium border-b border-[#5C4B8A]/20 text-[#D1CADB] flex items-center gap-2"
                >
                  <GraduationCap className="w-4 h-4 text-[#9B59B6]" />
                  <span>{portalLabel}</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout?.();
                  }}
                  className="w-full text-left py-3 text-base font-medium text-rose-300"
                >
                  Log out
                </button>
              </>
            ) : (
              <button
                onClick={() => handleNav('login')}
                className="w-full text-left py-3 text-base font-medium text-[#D1CADB]"
              >
                Login
              </button>
            )}
          </nav>
          <button
            onClick={() => handleNav('course-details')}
            className="mt-3 w-full py-3 px-4 text-sm font-bold text-[#08070B] bg-[#F1C40F] hover:bg-[#F39C12] rounded-xl text-center transition-colors"
          >
            Enroll Now
          </button>
        </div>
      )}
    </header>
  );
};
