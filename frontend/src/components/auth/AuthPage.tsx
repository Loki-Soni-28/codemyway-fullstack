import React, { useState, useEffect, useRef } from 'react';
import { NavigationRoute, StudentUser } from '../../types';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  TrendingUp, 
  Clock, 
  Sparkles, 
  GraduationCap, 
  Check, 
  Smartphone,
  ChevronLeft,
  X,
  Code2,
  BrainCircuit,
  PieChart,
  BarChart3,
  BookOpen,
  Laptop
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import codemywayLogo from '../../assets/images/codemyway_logo.png';
import { api } from '../../api';

interface ApiUser {
  id: string;
  email: string;
  name: string;
  role: string;
  phone: string | null;
  avatarUrl?: string;
  studentProfile?: any;
  enrolled?: boolean;
}

export const toStudentUser = (u: ApiUser): StudentUser => ({
  id: u.id,
  fullName: u.name,
  email: u.email,
  mobile: u.phone ?? '',
  role: u.role as any,
  avatarUrl: u.avatarUrl,
  isLoggedIn: true,
  enrolledCourse: u.studentProfile?.course?.title ?? 'Data Analyst + GenAI Cohort',
  studentProfile: u.studentProfile,
  enrolled: !!u.enrolled,
});

const GOOGLE_CLIENT_ID: string = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID ?? '';
const GSI_SRC = 'https://accounts.google.com/gsi/client';

// Renders the official "Sign in with Google" button and hands the ID token to the callback.
const GoogleSignInButton: React.FC<{
  onCredential: (credential: string) => void;
  text: 'signin_with' | 'signup_with' | 'continue_with';
}> = ({ onCredential, text }) => {
  const holder = useRef<HTMLDivElement>(null);
  const callback = useRef(onCredential);
  callback.current = onCredential;
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;
    let cancelled = false;

    const render = () => {
      const google = (window as any).google;
      if (cancelled || !google?.accounts?.id || !holder.current) return;
      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (res: { credential: string }) => callback.current(res.credential),
      });
      google.accounts.id.renderButton(holder.current, {
        type: 'standard',
        theme: 'filled_black',
        size: 'large',
        shape: 'pill',
        text,
        width: Math.min(holder.current.offsetWidth || 340, 400),
      });
    };

    if ((window as any).google?.accounts?.id) {
      render();
    } else {
      let script = document.querySelector<HTMLScriptElement>(`script[src="${GSI_SRC}"]`);
      if (!script) {
        script = document.createElement('script');
        script.src = GSI_SRC;
        script.async = true;
        document.head.appendChild(script);
      }
      script.addEventListener('load', render);
      script.addEventListener('error', () => setFailed(true));
    }
    return () => { cancelled = true; };
  }, [text]);

  if (!GOOGLE_CLIENT_ID) {
    return (
      <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-300 text-xs">
        Google sign-in isn't configured yet. Set <code>VITE_GOOGLE_CLIENT_ID</code> in <code>frontend/.env</code> and <code>GOOGLE_CLIENT_ID</code> in <code>backend/.env</code>, then restart.
      </div>
    );
  }
  if (failed) {
    return <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs">Couldn't load Google sign-in. Check your connection and try again.</div>;
  }
  return <div ref={holder} className="flex justify-center min-h-[44px]" />;
};

interface AuthPageProps {
  onRouteChange: (route: NavigationRoute) => void;
  onLoginSuccess: (user: StudentUser) => void;
  initialMode?: 'login' | 'register';
}

export const AuthPage: React.FC<AuthPageProps> = ({ 
  onRouteChange, 
  onLoginSuccess,
  initialMode = 'login' 
}) => {
  // Current mode: 'login' (Existing Students) | 'register' (First Time Visit / New Students)
  const [authMode, setAuthMode] = useState<'login' | 'register'>(initialMode);

  // Email + mobile are both required; the Google account must match the email.
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [googleError, setGoogleError] = useState('');

  const validateFields = (): string => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return 'Please enter a valid email address.';
    // Mobile is collected at sign-up only.
    if (authMode === 'register' && !/^[6-9][0-9]{9}$/.test(mobile)) return 'Please enter a valid 10-digit mobile number.';
    return '';
  };

  // Google sign-in (works for both existing and new students; new ones are created on first login)
  const handleGoogleCredential = async (credential: string) => {
    setGoogleError('');
    const problem = validateFields();
    if (problem) {
      setFieldError(problem);
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await api<{ user: ApiUser }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          type: 'google',
          credential,
          email: email.trim(),
          ...(authMode === 'register' && { phone: mobile }),
        }),
      });
      // App routes by role (student dashboard or faculty/admin) once the user is set.
      onLoginSuccess(toStudentUser(res.user));
    } catch (err) {
      setGoogleError(err instanceof Error ? err.message : 'Google sign-in failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputCls = 'w-full pl-10 pr-4 py-2.5 bg-[#141022] border border-[#2B233F] focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-xl text-xs sm:text-sm text-white placeholder-[#64748B] outline-none transition-all';

  const identityBlock = (googleText: 'signin_with' | 'signup_with') => (
    <div className="space-y-4">
      {(fieldError || googleError) && (
        <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
          <X className="w-4 h-4 shrink-0 text-rose-400 cursor-pointer" onClick={() => { setFieldError(''); setGoogleError(''); }} />
          <span>{fieldError || googleError}</span>
        </div>
      )}

      <div className="space-y-1">
        <label className="text-xs font-semibold text-[#CBD5E1] block">Email Address <span className="text-rose-400">*</span></label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]"><Mail className="w-4 h-4" /></div>
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setFieldError(''); }}
            placeholder="Enter your Gmail address"
            className={inputCls}
          />
        </div>
      </div>

      {authMode === 'register' && (
      <div className="space-y-1">
        <label className="text-xs font-semibold text-[#CBD5E1] block">Mobile Number <span className="text-rose-400">*</span></label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]"><Phone className="w-4 h-4" /></div>
          <input
            type="tel"
            value={mobile}
            onChange={(e) => { setMobile(e.target.value.replace(/[^0-9]/g, '')); setFieldError(''); }}
            maxLength={10}
            placeholder="Enter your 10-digit mobile number"
            className={inputCls}
          />
        </div>
      </div>
      )}

      {/* The Google button only works once both fields are valid; clicking early explains why. */}
      <div
        className="relative"
        onClickCapture={(e) => {
          const problem = validateFields();
          if (problem) {
            e.stopPropagation();
            e.preventDefault();
            setFieldError(problem);
          }
        }}
      >
        <div className={validateFields() ? 'opacity-50' : ''}>
          <GoogleSignInButton text={googleText} onCredential={handleGoogleCredential} />
        </div>
        {validateFields() && <div className="absolute inset-0 cursor-not-allowed" />}
      </div>

      {isSubmitting && (
        <div className="flex items-center justify-center gap-2 text-xs text-[#94A3B8]">
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span>Signing you in...</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#08070B] text-white flex flex-col justify-between selection:bg-[#9B59B6]/40 selection:text-[#F1C40F] relative overflow-x-hidden font-sans">
      
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-indigo-600/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Top Navigation Bar */}
      <header className="w-full border-b border-[#1E192D]/70 bg-[#0A0812]/80 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between z-20">
        <div 
          onClick={() => onRouteChange('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <img
            src={codemywayLogo}
            alt="CodeMyWay"
            className="h-8 sm:h-9 w-auto object-contain drop-shadow-[0_2px_12px_rgba(168,85,247,0.3)] transition-transform group-hover:scale-105"
          />
          <div className="hidden sm:block border-l border-[#2B233F] pl-3">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#94A3B8] font-mono block">
              STUDENT DASHBOARD
            </span>
            <span className="text-xs text-[#CBD5E1] font-medium">Access Learning Portal</span>
          </div>
        </div>

        {/* Top Right Actions */}
        <div className="flex items-center gap-3">
          {/* Quick Mode Toggle Pill */}
          <div className="flex items-center bg-[#141022] p-1 rounded-xl border border-[#2B233F]">
            <button
              onClick={() => {
                setAuthMode('login');
                setFieldError('');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                authMode === 'login'
                  ? 'bg-[#8B5CF6] text-white shadow-md shadow-purple-600/25'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              Existing Student
            </button>
            <button
              onClick={() => {
                setAuthMode('register');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                authMode === 'register'
                  ? 'bg-[#8B5CF6] text-white shadow-md shadow-purple-600/25'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              New Student (First Time)
            </button>
          </div>

          <button
            onClick={() => onRouteChange('home')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-[#94A3B8] hover:text-white hover:bg-[#1A152E] border border-[#2B233F] transition-all cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Back to Website</span>
          </button>
        </div>
      </header>

      {/* Main Authentication Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col items-center justify-center z-10">
        
        {/* ========================================================
            PAGE 1: EXISTING STUDENTS LOGIN PAGE
           ======================================================== */}
        {authMode === 'login' ? (
          <div className="w-full max-w-md sm:max-w-lg space-y-6">
            
            {/* Header + Visual Illustration */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-purple-400 font-mono text-xs font-bold px-2 py-0.5 rounded bg-purple-950/60 border border-purple-800/40">
                    &lt; / &gt; CodeMyWay
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-[#94A3B8] font-bold">
                    STUDENT DASHBOARD
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Welcome Back!
                </h1>
                <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
                  Continue your learning journey
                </p>
              </div>

              {/* Glowing 3D Dashboard Icon / Illustration */}
              <motion.div 
                whileHover={{ rotate: 5, scale: 1.05 }}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-purple-900/60 via-[#1C1335] to-indigo-900/40 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.25)] shrink-0 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent pointer-events-none" />
                <div className="relative flex flex-col items-center">
                  <GraduationCap className="w-7 h-7 sm:w-8 sm:h-8 text-purple-300 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                  <div className="flex items-center gap-1 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-[9px] font-mono text-purple-200">Active</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Login Card */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="bg-[#0E0C17]/90 rounded-2xl border border-[#271E3B] p-6 sm:p-7 shadow-2xl shadow-purple-950/30 backdrop-blur-xl space-y-5"
            >
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Login to your account
                </h2>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  Enter your email, then continue with Google
                </p>
              </div>

              {identityBlock('signin_with')}

              {/* Bottom Switch to Register */}
              <div className="pt-2 border-t border-[#221B33] text-center text-xs text-[#94A3B8]">
                <span>Don't have an account? </span>
                <button
                  onClick={() => {
                    setAuthMode('register');
                          }}
                  className="text-[#F59E0B] hover:text-amber-300 font-bold ml-1 transition-colors cursor-pointer"
                >
                  Create New Account
                </button>
              </div>

            </motion.div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-3 text-center text-[11px] text-[#94A3B8] pt-2">
              <div className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-[#0E0C17]/60 border border-[#221B33]">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Secure Login</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-[#0E0C17]/60 border border-[#221B33]">
                <TrendingUp className="w-4 h-4 text-sky-400" />
                <span>Track Progress</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-[#0E0C17]/60 border border-[#221B33]">
                <Clock className="w-4 h-4 text-purple-400" />
                <span>Access Anytime</span>
              </div>
            </div>

          </div>
        ) : (
          /* ========================================================
              PAGE 2: FIRST TIME VISIT / NEW STUDENTS SIGN UP
             ======================================================== */
          <div className="w-full max-w-md sm:max-w-lg space-y-6">
            
            {/* Header + Visual Illustration */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-purple-400 font-mono text-xs font-bold px-2 py-0.5 rounded bg-purple-950/60 border border-purple-800/40">
                    &lt; / &gt; CodeMyWay
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-[#94A3B8] font-bold">
                    STUDENT DASHBOARD
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Welcome to CodeMyWay!
                </h1>
                <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
                  Let's get you started on your learning journey
                </p>
              </div>

              {/* Glowing 3D Open Book Illustration */}
              <motion.div 
                whileHover={{ rotate: -5, scale: 1.05 }}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-purple-900/60 via-[#1C1335] to-indigo-900/40 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.25)] shrink-0 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent pointer-events-none" />
                <div className="relative flex flex-col items-center">
                  <BookOpen className="w-7 h-7 sm:w-8 sm:h-8 text-purple-300 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                  <div className="flex items-center gap-1 mt-1">
                    <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                    <span className="text-[9px] font-mono text-purple-200">Start Free</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Create Account Card */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="bg-[#0E0C17]/90 rounded-2xl border border-[#271E3B] p-6 sm:p-7 shadow-2xl shadow-purple-950/30 backdrop-blur-xl space-y-5"
            >
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Create your account
                </h2>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  Enter your email and mobile number, then continue with Google
                </p>
              </div>

              {identityBlock('signup_with')}

              {/* Bottom Switch to Login */}
              <div className="pt-2 border-t border-[#221B33] text-center text-xs text-[#94A3B8]">
                <span>Already have an account? </span>
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setFieldError('');
                  }}
                  className="text-[#F59E0B] hover:text-amber-300 font-bold ml-1 transition-colors cursor-pointer"
                >
                  Login Here
                </button>
              </div>

            </motion.div>

          </div>
        )}

      </main>

      {/* Trust & Guarantee Bottom Bar */}
      <footer className="w-full py-4 border-t border-[#1E192D]/70 bg-[#0A0812]/90 text-center text-xs text-[#64748B]">
        <span>CodeMyWay Student Dashboard · Where Skill Becomes Career</span>
      </footer>

    </div>
  );
};
