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
  Laptop,
  PlayCircle,
  ClipboardCheck,
  Layers,
  UserSquare
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
        theme: 'outline',
        size: 'large',
        shape: 'rectangular',
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

const PORTAL_FEATURES = [
  { icon: PlayCircle, title: 'Live & Recorded Classes', desc: 'Attend interactive sessions and revisit recordings anytime.' },
  { icon: ClipboardCheck, title: 'Assignments & Quizzes', desc: 'Practice, build consistency, and track your understanding.' },
  { icon: Layers, title: 'Projects & Submissions', desc: 'Work on real-world projects and get mentor feedback.' },
  { icon: UserSquare, title: 'Resume Building', desc: 'Create and improve your professional resume.' },
];

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

  // The email comes from the chosen Google account; mobile is collected at sign-up only.
  const [mobile, setMobile] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [googleError, setGoogleError] = useState('');

  const validateFields = (): string => {
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

  const inputCls = 'w-full px-4 py-3 bg-transparent border border-white/10 focus:border-orange-500/70 focus:ring-1 focus:ring-orange-500/40 rounded-lg text-sm text-white placeholder-[#64748B] outline-none transition-all';

  const identityBlock = (googleText: 'signin_with' | 'signup_with') => (
    <div className="space-y-5">
      {(fieldError || googleError) && (
        <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
          <X className="w-4 h-4 shrink-0 text-rose-400 cursor-pointer" onClick={() => { setFieldError(''); setGoogleError(''); }} />
          <span>{fieldError || googleError}</span>
        </div>
      )}

      {authMode === 'register' && (
      <div className="space-y-1">
        <label className="text-sm text-[#E2E8F0] block mb-2">Phone Number</label>
        <div className="relative">
          <input
            type="tel"
            value={mobile}
            onChange={(e) => { setMobile(e.target.value.replace(/[^0-9]/g, '')); setFieldError(''); }}
            maxLength={10}
            placeholder="Enter your phone number here"
            className={inputCls}
          />
        </div>
      </div>
      )}

      {/* The Google button only works once the phone number is valid (sign-up); clicking early explains why. */}
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

  const isLogin = authMode === 'login';

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#07060A] text-white flex flex-col selection:bg-purple-500/40 relative overflow-hidden font-sans">
      {/* Subtle ambient glow */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[640px] h-[640px] bg-purple-700/10 rounded-full blur-[140px] pointer-events-none" />

      <main className="flex-1 w-full flex items-center justify-center px-4 py-8 z-10">
        <div className="w-full max-w-4xl rounded-3xl border border-[#5C4B8A]/40 bg-gradient-to-br from-[#1A1030]/80 via-[#0E0A18]/80 to-[#120A22]/80 backdrop-blur-xl p-5 sm:p-7 lg:p-8 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-7 lg:gap-9 items-center shadow-2xl shadow-black/50">

          {/* Left: what you get */}
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-['Sora'] tracking-tight leading-[1.12]">
              <span className="text-[#ECE6F5]">Everything You Need to Succeed, </span>
              <span className="bg-gradient-to-r from-[#F1C40F] to-[#F39C12] bg-clip-text text-transparent">in One Place.</span>
            </h1>
            <p className="mt-4 max-w-md text-sm text-[#D1CADB] leading-relaxed">
              Access your classes, practice your skills, complete projects, and get career-ready with your dedicated student dashboard.
            </p>
            <ul className="mt-6 space-y-3">
              {PORTAL_FEATURES.map(({ icon: Icon, title, desc }) => (
                <li key={title} className="group flex items-center gap-4">
                  <span className="w-10 h-10 shrink-0 rounded-lg bg-[#2A1744] border border-[#5C4B8A]/50 flex items-center justify-center text-[#C084FC] transition-all duration-300 group-hover:border-[#C084FC] group-hover:text-[#F1C40F] group-hover:shadow-[0_0_20px_rgba(192,132,252,0.3)]">
                    <Icon className="w-4 h-4" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-white">{title}</span>
                    <span className="block text-xs text-[#A7A0B5]">{desc}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: sign in / sign up card */}
          <motion.div
            key={authMode}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative rounded-3xl border border-[#C084FC]/50 bg-[#150E24]/90 p-6 sm:p-7 shadow-[0_0_40px_rgba(192,132,252,0.12)]"
          >
            <span className="absolute -top-4 right-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#F1C40F]/50 bg-[#2A1A10] text-[11px] font-semibold text-[#F1C40F] leading-tight">
              <GraduationCap className="w-5 h-5" />
              <span>Student<br />Portal</span>
            </span>

            <h2 className="text-2xl font-extrabold font-['Sora'] leading-tight">
              {isLogin ? 'Welcome Back to' : 'Join'}
              <span className="block text-[#C084FC]">CodeMyWay</span>
            </h2>
            <p className="mt-3 text-sm text-[#A7A0B5]">
              {isLogin ? 'Sign in to access your learning dashboard.' : 'Create your account to start learning.'}
            </p>

            <div className="mt-5">{identityBlock(isLogin ? 'signin_with' : 'signup_with')}</div>

            <p className="mt-4 text-center text-xs text-[#A7A0B5]">
              Use the Google account associated with your CodeMyWay enrollment.
            </p>

            <p className="mt-5 text-center text-sm text-[#A7A0B5]">
              {isLogin ? 'New to CodeMyWay?' : 'Already have an account?'}{' '}
              <button
                onClick={() => { setAuthMode(isLogin ? 'register' : 'login'); setFieldError(''); setGoogleError(''); }}
                className="text-[#F1C40F] hover:text-amber-300 font-bold underline underline-offset-4 transition-colors cursor-pointer"
              >
                {isLogin ? 'Create an Account' : 'Sign In'}
              </button>
            </p>
          </motion.div>
        </div>
      </main>

      <footer className="py-5 text-center text-xs text-[#64748B] z-10">
        CodeMyWay · Where Skill Becomes Career
      </footer>
    </div>
  );
};
