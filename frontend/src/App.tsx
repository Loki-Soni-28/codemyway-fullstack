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

export default function App() {
  // Determine initial route based on window.location.pathname
  const getInitialRoute = (): NavigationRoute => {
    const path = window.location.pathname;
    if (path.includes('/courses/data-analyst-genai')) return 'course-details';
    if (path.includes('/skill-store')) return 'skill-store';
    if (path.includes('/student/dashboard')) return 'student-dashboard';
    if (path.includes('/login')) return 'login';
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

  const handleLoginSuccess = (user: StudentUser) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('codemyway_student_user', JSON.stringify(user));
    } catch {
      // ignore
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('codemyway_student_user');
    } catch {
      // ignore
    }
    handleRouteChange('login');
  };

  // Global modals
  const [isBrochureOpen, setIsBrochureOpen] = useState(false);
  const [brochureTitle, setBrochureTitle] = useState('Data Analyst + GenAI');
  const [isMentorModalOpen, setIsMentorModalOpen] = useState(false);
  const [isBuyNowOpen, setIsBuyNowOpen] = useState(false);
  const [checkoutData, setCheckoutData] = useState<{
    title: string;
    salePrice: string;
    originalPrice: string;
    discountText: string;
  }>({
    title: 'Data Analyst + GenAI',
    salePrice: '₹24,999',
    originalPrice: '₹36,000',
    discountText: '30% OFF · Active'
  });
  const [isDiscountOpen, setIsDiscountOpen] = useState(false);
  
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

  // Automatically trigger 30% discount popup on website open
  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem('codemyway_discount_popup_shown');
    // Open after a smooth 1.2s delay for maximum delight
    const timer = setTimeout(() => {
      setIsDiscountOpen(true);
      sessionStorage.setItem('codemyway_discount_popup_shown', 'true');
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  // Handle route change with browser history update
  const handleRouteChange = (route: NavigationRoute) => {
    setCurrentRoute(route);
    let targetPath = '/';
    if (route === 'course-details') targetPath = '/courses/data-analyst-genai';
    else if (route === 'skill-store') targetPath = '/skill-store';
    else if (route === 'student-dashboard') targetPath = '/student/dashboard';
    else if (route === 'login') targetPath = '/login';

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

  return (
    <div className="min-h-screen flex flex-col bg-[#08070B] text-white selection:bg-[#9B59B6]/40 selection:text-[#F1C40F]">
      {/* Sticky Top Bar (Countdown Banner + Header) - Only on public website pages */}
      {currentRoute !== 'student-dashboard' && currentRoute !== 'login' && (
        <div className="sticky top-0 z-40 w-full">
          {showTopCountdown && (
            <TopCountdownBanner
              onOpenDiscount={() => setIsDiscountOpen(true)}
              onDismiss={handleDismissTopCountdown}
            />
          )}
          <Header
            currentRoute={currentRoute}
            onRouteChange={handleRouteChange}
            currentUser={currentUser}
            onLogout={handleLogout}
            onOpenBrochure={() => {
              setBrochureTitle('Data Analyst + GenAI');
              setIsBrochureOpen(true);
            }}
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

        {currentRoute === 'student-dashboard' && (
          <StudentDashboardPage
            onRouteChange={handleRouteChange}
            currentUser={currentUser}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Footer - Only on public website pages */}
      {currentRoute !== 'student-dashboard' && currentRoute !== 'login' && (
        <Footer
          onRouteChange={handleRouteChange}
          onOpenBrochure={() => {
            setBrochureTitle('Data Analyst + GenAI');
            setIsBrochureOpen(true);
          }}
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
        programTitle={checkoutData.title}
        salePrice={checkoutData.salePrice}
        originalPrice={checkoutData.originalPrice}
        discountText={checkoutData.discountText}
        onClose={() => {
          setIsBuyNowOpen(false);
          handleRouteChange('student-dashboard');
        }}
      />

      <NotifyMeModal
        isOpen={notifyModalData.open}
        courseTitle={notifyModalData.title}
        isPrebooking={notifyModalData.isPrebooking}
        onClose={() => setNotifyModalData({ open: false, title: '', isPrebooking: false })}
      />

      {/* 30% OFF Upcoming Batch Popup Modal (Never shown on Student Dashboard) */}
      <DiscountPopupModal
        isOpen={isDiscountOpen && currentRoute !== 'student-dashboard'}
        onClose={handleCloseDiscountModal}
        onClaimDiscount={(code) => {
          // Can automatically redirect to checkout or courses
          setBrochureTitle('Data Analyst + GenAI (30% Discount Reserved)');
        }}
      />

      {/* Floating 30% OFF Batch Offer Pill to Re-open anytime (Never shown on Student Dashboard) */}
      {!isDiscountOpen && currentRoute !== 'student-dashboard' && (
        <button
          onClick={() => setIsDiscountOpen(true)}
          className="fixed bottom-16 sm:bottom-20 right-6 z-40 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#9B59B6] to-[#7A3E9D] hover:from-[#A86AC3] hover:to-[#8C47B3] text-white text-xs font-bold shadow-[0_0_25px_rgba(155,89,182,0.6)] border border-[#D1CADB]/30 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
          title="Open 30% discount offer"
        >
          <span className="w-2 h-2 rounded-full bg-[#F1C40F] animate-ping" />
          <Gift className="w-4 h-4 text-[#F1C40F]" />
          <span>30% OFF New Batch</span>
        </button>
      )}

    </div>
  );
}
