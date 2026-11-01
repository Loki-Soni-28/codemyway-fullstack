/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { NavigationRoute, StudentUser } from './types';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { BrochureModal, TalkToMentorModal, BuyNowCheckoutModal, NotifyMeModal } from './components/common/Modals';
import { DiscountPopupModal } from './components/common/DiscountPopupModal';
import { TopCountdownBanner } from './components/common/TopCountdownBanner';
import { Gift } from 'lucide-react';
import { HomePage } from './components/home/HomePage';
import { CourseDetailsPage } from './components/courses/CourseDetailsPage';
import { SkillStorePage } from './components/skill-store/SkillStorePage';
import { StudentDashboardPage } from './components/dashboard/StudentDashboardPage';
import { AuthPage } from './components/auth/AuthPage';
import { useOffer } from './offer';
import { api, ApiError } from './api';
import { PolicyPage, PolicyKind } from './components/legal/PolicyPage';
import { AboutPage } from './components/about/AboutPage';
import { NotEnrolledPage } from './components/dashboard/NotEnrolledPage';

const POLICY_PATHS: Record<PolicyKind, string> = {
  privacy: '/privacy',
  terms: '/terms',
  refund: '/refund-policy',
  contact: '/contact',
};

export default function App() {
  // Determine initial route based on window.location.pathname
  const getInitialRoute = (): NavigationRoute => {
    const path = window.location.pathname;
    if (path.includes('/courses/data-analyst-genai')) return 'course-details';
    if (path.includes('/skill-store')) return 'skill-store';
    if (path.includes('/student/dashboard')) return 'student-dashboard';
    if (path.includes('/login')) return 'login';
    if (path === '/about') return 'about';
    for (const [route, routePath] of Object.entries(POLICY_PATHS)) {
      if (path === routePath) return route as NavigationRoute;
    }
    return 'home';
  };

  const [currentRoute, setCurrentRoute] = useState<NavigationRoute>(getInitialRoute);

  // Authenticated Student State (persisted in localStorage)
  const [currentUser, setCurrentUser] = useState<StudentUser | null>(() => {
    try {
      const saved = localStorage.getItem('codemyway_student_user');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return null;
  });

  const saveUser = (user: StudentUser) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('codemyway_student_user', JSON.stringify(user));
    } catch {
      // ignore
    }
  };
  const handleLoginSuccess = saveUser;

  const handleLogout = () => {
    api('/auth/logout', { method: 'POST' }).catch(() => {});
    setCurrentUser(null);
    try {
      localStorage.removeItem('codemyway_student_user');
    } catch {
      // ignore
    }
    handleRouteChange('login');
  };

  // The saved login is only a UI hint. Re-check it with the server so enrolment status is
  // current and an expired session is cleared.
  useEffect(() => {
    if (!currentUser) return;
    api<{ user: { enrolled: boolean } }>('/auth/me')
      .then(({ user }) => {
        if (user.enrolled !== !!currentUser.enrolled) saveUser({ ...currentUser, enrolled: user.enrolled });
      })
      .catch((err) => {
        // Only a rejected session logs the user out. A network or server error must not.
        if (!(err instanceof ApiError && err.status === 401)) return;
        setCurrentUser(null);
        try {
          localStorage.removeItem('codemyway_student_user');
        } catch {
          // ignore
        }
      });
  }, []);

  // Global modals
  const [isBrochureOpen, setIsBrochureOpen] = useState(false);
  const [brochureTitle, setBrochureTitle] = useState('Data Analyst + GenAI');
  const [isMentorModalOpen, setIsMentorModalOpen] = useState(false);
  const [isBuyNowOpen, setIsBuyNowOpen] = useState(false);
  const [checkoutData, setCheckoutData] = useState<{ courseSlug: string; title: string }>({
    courseSlug: 'data-analyst-with-gen-ai',
    title: 'Data Analyst + GenAI',
  });
  const [isDiscountOpen, setIsDiscountOpen] = useState(false);
  const offer = useOffer();
  const offerActive = !!offer?.active;
  
  // Show countdown banner by default for visitors unless manually dismissed in this session
  const [showTopCountdown, setShowTopCountdown] = useState<boolean>(() => {
    try {
      if (sessionStorage.getItem('codemyway_top_countdown_dismissed') === 'true') {
        return false;
      }
    } catch {
      // fallback
    }
    return true;
  });

  const handleDismissTopCountdown = () => {
    setShowTopCountdown(false);
    try {
      sessionStorage.setItem('codemyway_top_countdown_dismissed', 'true');
    } catch {
      // ignore
    }
  };

  const handleCloseDiscountModal = () => {
    setIsDiscountOpen(false);
    setShowTopCountdown(true);
    try {
      sessionStorage.removeItem('codemyway_top_countdown_dismissed');
    } catch {
      // ignore
    }
  };
  const [notifyModalData, setNotifyModalData] = useState<{ open: boolean; title: string; isPrebooking: boolean }>({
    open: false,
    title: '',
    isPrebooking: false
  });

  // Open the early-bird popup as soon as the site loads (once per browser session). It is
  // skipped for people who already claimed it on this browser or are already enrolled.
  useEffect(() => {
    if (!offerActive || currentUser?.enrolled) return;
    try {
      if (sessionStorage.getItem('codemyway_discount_popup_shown') || localStorage.getItem('codemyway_discount_claimed')) return;
      sessionStorage.setItem('codemyway_discount_popup_shown', 'true');
    } catch {
      // storage blocked: still show it
    }
    setIsDiscountOpen(true);
  }, [offerActive]);

  // Handle route change with browser history update
  const handleRouteChange = (route: NavigationRoute) => {
    setCurrentRoute(route);
    let targetPath = '/';
    if (route === 'course-details') targetPath = '/courses/data-analyst-genai';
    else if (route === 'skill-store') targetPath = '/skill-store';
    else if (route === 'student-dashboard') targetPath = '/student/dashboard';
    else if (route === 'login') targetPath = '/login';
    else if (route === 'about') targetPath = '/about';
    else if (route in POLICY_PATHS) targetPath = POLICY_PATHS[route as PolicyKind];

    if (window.location.pathname !== targetPath) {
      window.history.pushState({ route }, '', targetPath);
    }
  };

  // Listen to popstate (back/forward button)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(getInitialRoute());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Logged in but not enrolled: show the public site chrome with a prompt instead of the dashboard
  const dashboardBlocked = currentRoute === 'student-dashboard' && !!currentUser && !currentUser.enrolled;
  const showPublicChrome = (currentRoute !== 'student-dashboard' && currentRoute !== 'login') || dashboardBlocked;

  return (
    <div className="min-h-screen flex flex-col bg-[#08070B] text-white selection:bg-[#9B59B6]/40 selection:text-[#F1C40F]">
      {/* Sticky Top Bar (Countdown Banner + Header) - Only on public website pages */}
      {showPublicChrome && (
        <div className="sticky top-0 z-40 w-full">
          {offerActive && showTopCountdown && (
            <TopCountdownBanner
              percent={offer!.percent}
              endsAt={offer!.endsAt}
              onOpenDiscount={() => setIsDiscountOpen(true)}
              onDismiss={handleDismissTopCountdown}
            />
          )}
          <Header
            currentRoute={currentRoute}
            onOpenMentors={() => {
              handleRouteChange('home');
              setTimeout(() => document.getElementById('mentors')?.scrollIntoView({ behavior: 'smooth' }), 150);
            }}
            onRouteChange={handleRouteChange}
            currentUser={currentUser}
            onLogout={handleLogout}
          />
        </div>
      )}

      {/* Main Page Area */}
      <main className="flex-1">
        {currentRoute === 'home' && (
          <HomePage
            onRouteChange={handleRouteChange}
            onOpenBrochure={() => {
              setBrochureTitle('Data Analyst + GenAI');
              setIsBrochureOpen(true);
            }}
            onOpenMentorModal={() => setIsMentorModalOpen(true)}
          />
        )}

        {currentRoute === 'course-details' && (
          <CourseDetailsPage
            onRouteChange={handleRouteChange}
            onOpenBrochure={(title) => {
              setBrochureTitle(title || 'Data Analyst + GenAI');
              setIsBrochureOpen(true);
            }}
            onOpenMentorModal={() => setIsMentorModalOpen(true)}
            onOpenBuyNowModal={(details) => {
              if (!currentUser) {
                handleRouteChange('login');
                return;
              }
              if (details) {
                setCheckoutData(details);
              }
              setIsBuyNowOpen(true);
            }}
          />
        )}

        {currentRoute === 'skill-store' && (
          <SkillStorePage
            onRouteChange={handleRouteChange}
            onOpenNotifyModal={(title, isPrebooking) => {
              setNotifyModalData({ open: true, title, isPrebooking });
            }}
            onOpenEnrollModal={(title) => {
              setBrochureTitle(title);
              setIsBrochureOpen(true);
            }}
          />
        )}

        {currentRoute === 'login' && (
          <AuthPage
            onRouteChange={handleRouteChange}
            onLoginSuccess={handleLoginSuccess}
          />
        )}

        {currentRoute === 'about' && (
          <AboutPage onRouteChange={handleRouteChange} onOpenMentorModal={() => setIsMentorModalOpen(true)} />
        )}

        {dashboardBlocked && (
          <NotEnrolledPage currentUser={currentUser!} onRouteChange={handleRouteChange} onLogout={handleLogout} />
        )}

        {(currentRoute === 'privacy' || currentRoute === 'terms' || currentRoute === 'refund' || currentRoute === 'contact') && (
          <PolicyPage kind={currentRoute} onRouteChange={handleRouteChange} onRequestCall={() => setIsMentorModalOpen(true)} />
        )}

        {currentRoute === 'student-dashboard' && !dashboardBlocked && (
          <StudentDashboardPage
            onRouteChange={handleRouteChange}
            currentUser={currentUser}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Footer - Only on public website pages */}
      {showPublicChrome && (
        <Footer
          onRouteChange={handleRouteChange}
          onOpenBrochure={() => {
            setBrochureTitle('Data Analyst + GenAI');
            setIsBrochureOpen(true);
          }}
          onOpenMentorModal={() => setIsMentorModalOpen(true)}
        />
      )}

      {/* Global Modals */}
      <BrochureModal
        isOpen={isBrochureOpen}
        onClose={() => setIsBrochureOpen(false)}
        programTitle={brochureTitle}
      />

      <TalkToMentorModal
        isOpen={isMentorModalOpen}
        onClose={() => setIsMentorModalOpen(false)}
      />

      <BuyNowCheckoutModal
        isOpen={isBuyNowOpen}
        courseSlug={checkoutData.courseSlug}
        programTitle={checkoutData.title}
        onClose={() => setIsBuyNowOpen(false)}
        onPaid={() => {
          if (currentUser) saveUser({ ...currentUser, enrolled: true });
          setIsBuyNowOpen(false);
          handleRouteChange('student-dashboard');
        }}
        onLoginRequired={() => {
          setIsBuyNowOpen(false);
          handleRouteChange('login');
        }}
      />

      <NotifyMeModal
        isOpen={notifyModalData.open}
        courseTitle={notifyModalData.title}
        isPrebooking={notifyModalData.isPrebooking}
        onClose={() => setNotifyModalData({ open: false, title: '', isPrebooking: false })}
      />

      {/* 30% OFF Upcoming Batch Popup Modal (Never shown on Student Dashboard) */}
      {offerActive && (
        <DiscountPopupModal
          isOpen={isDiscountOpen && currentRoute !== 'student-dashboard'}
          onClose={handleCloseDiscountModal}
          percent={offer!.percent}
          endsAt={offer!.endsAt}
          onClaimDiscount={() => {
            try {
              localStorage.setItem('codemyway_discount_claimed', 'true');
            } catch {
              // ignore
            }
          }}
        />
      )}

      {/* Floating 30% OFF Batch Offer Pill to Re-open anytime (Never shown on Student Dashboard) */}
      {offerActive && !isDiscountOpen && currentRoute !== 'student-dashboard' && (
        <button
          onClick={() => setIsDiscountOpen(true)}
          className="fixed bottom-16 sm:bottom-20 right-6 z-40 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#9B59B6] to-[#7A3E9D] hover:from-[#A86AC3] hover:to-[#8C47B3] text-white text-xs font-bold border border-[#D1CADB]/30 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
          title="Open early-bird offer"
        >
          <span className="w-2 h-2 rounded-full bg-[#F1C40F] animate-ping" />
          <Gift className="w-4 h-4 text-[#F1C40F]" />
          <span>{offer!.percent}% OFF<span className="hidden sm:inline"> New Batch</span></span>
        </button>
      )}

    </div>
  );
}
