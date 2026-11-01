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
import { FacultyReviewView } from './components/dashboard/FacultyReviewView';
import { AuthPage, toStudentUser } from './components/auth/AuthPage';
import { api } from './api';

export default function App() {
  // Determine initial route based on window.location.pathname
  const getInitialRoute = (): NavigationRoute => {
    const path = window.location.pathname;
    if (path.includes('/courses/data-analyst-genai')) return 'course-details';
    if (path.includes('/skill-store')) return 'skill-store';
    if (path.includes('/student/dashboard')) return 'student-dashboard';
    if (path.includes('/faculty')) return 'faculty-reviews';
    if (path.includes('/login')) return 'login';
    return 'home';
  };

  const [currentRoute, setCurrentRoute] = useState<NavigationRoute>(getInitialRoute);

  // Authenticated User State (Server HTTP-only Cookie is the single source of truth)
  const [currentUser, setCurrentUser] = useState<StudentUser | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState<boolean>(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Validate session against GET /api/auth/me on startup & retry
  const validateSession = async () => {
    setIsSessionLoading(true);
    setConnectionError(null);
    try {
      const res = await api<{ authenticated: boolean; user: any }>('/auth/me');
      if (res.authenticated && res.user) {
        const mappedUser = toStudentUser(res.user);
        setCurrentUser(mappedUser);

        // Role-based route redirect
        if (mappedUser.role === 'INSTRUCTOR' || mappedUser.role === 'MENTOR' || mappedUser.role === 'ADMIN') {
          setCurrentRoute((prev) => (prev === 'student-dashboard' || prev === 'login' ? 'faculty-reviews' : prev));
        } else if (mappedUser.role === 'STUDENT') {
          setCurrentRoute((prev) => (prev === 'faculty-reviews' ? 'student-dashboard' : prev));
        }
      } else {
        setCurrentUser(null);
        setCurrentRoute((prev) => (prev === 'student-dashboard' || prev === 'faculty-reviews' ? 'login' : prev));
      }
    } catch (err: any) {
      // If 401, it is an invalid/expired session
      if (err.message && (err.message.includes('401') || err.message.toLowerCase().includes('unauthorized'))) {
        setCurrentUser(null);
        setCurrentRoute((prev) => (prev === 'student-dashboard' || prev === 'faculty-reviews' ? 'login' : prev));
      } else {
        // Backend unavailable or network connectivity error
        setConnectionError(err.message || 'Unable to connect to CodeMyWay auth server. Please check your network or ensure backend is running.');
      }
    } finally {
      setIsSessionLoading(false);
    }
  };

  useEffect(() => {
    validateSession();
  }, []);

  const handleLoginSuccess = (user: StudentUser) => {
    setCurrentUser(user);
    if (user.role === 'INSTRUCTOR' || user.role === 'MENTOR' || user.role === 'ADMIN') {
      setCurrentRoute('faculty-reviews');
    } else {
      setCurrentRoute('student-dashboard');
    }
  };

  const handleLogout = async () => {
    try {
      await api('/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setCurrentUser(null);
      handleRouteChange('login');
    }
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

  // Handle route change with browser history update & student route protection
  const handleRouteChange = (route: NavigationRoute) => {
    // Student route protection: If trying to access student dashboard while not an authenticated STUDENT
    if (route === 'student-dashboard' && (!currentUser?.isLoggedIn || currentUser.role !== 'STUDENT')) {
      route = 'login';
    }

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
        {/* Connection Error Screen with Retry */}
        {connectionError ? (
          <div className="min-h-[70vh] flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-[#110D1F] border border-rose-500/30 rounded-2xl p-6 sm:p-8 text-center shadow-2xl shadow-rose-950/20">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Authentication Service Unavailable</h2>
              <p className="text-xs sm:text-sm text-[#94A3B8] mb-6">
                {connectionError}
              </p>
              <button
                onClick={() => validateSession()}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-purple-900/30 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Retry Connection</span>
              </button>
            </div>
          </div>
        ) : isSessionLoading ? (
          /* Session Validation Loading Screen */
          <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
            <div className="relative w-12 h-12">
              <div className="w-12 h-12 rounded-full border-2 border-purple-500/20 border-t-purple-400 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
              </div>
            </div>
            <p className="text-xs text-[#94A3B8] font-mono tracking-wider animate-pulse">
              Verifying CodeMyWay Session...
            </p>
          </div>
        ) : (
          <>
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
              currentUser?.isLoggedIn && currentUser.role === 'STUDENT' ? (
                <StudentDashboardPage
                  onRouteChange={handleRouteChange}
                  currentUser={currentUser}
                  onLogout={handleLogout}
                />
              ) : (
                <AuthPage
                  onRouteChange={handleRouteChange}
                  onLoginSuccess={handleLoginSuccess}
                />
              )
            )}

            {currentRoute === 'faculty-reviews' && (
              currentUser?.isLoggedIn && (currentUser.role === 'INSTRUCTOR' || currentUser.role === 'MENTOR' || currentUser.role === 'ADMIN') ? (
                <FacultyReviewView
                  currentUser={currentUser}
                  onLogout={handleLogout}
                  onNavigateHome={() => handleRouteChange('home')}
                />
              ) : (
                <AuthPage
                  onRouteChange={handleRouteChange}
                  onLoginSuccess={handleLoginSuccess}
                />
              )
            )}
          </>
        )}
      </main>

      {/* Footer - Only on public website pages */}
      {currentRoute !== 'student-dashboard' && currentRoute !== 'login' && currentRoute !== 'faculty-reviews' && (
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
