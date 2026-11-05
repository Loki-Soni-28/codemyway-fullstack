import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Flame, 
  Clock, 
  CheckCircle, 
  ArrowRight, 
  Percent,
  Gift,
  Zap,
  User,
  Phone,
  Mail
} from 'lucide-react';
import { api } from '../../api';
import { useCountdown } from '../../offer';

interface DiscountPopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  percent: number;
  endsAt: string | null;
  onClaimDiscount?: () => void;
}

export const DiscountPopupModal: React.FC<DiscountPopupModalProps> = ({
  isOpen,
  onClose,
  percent,
  endsAt,
  onClaimDiscount
}) => {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const timeLeft = useCountdown(endsAt);

  // The modal stays mounted while closed, so clear any previous error each time it opens or closes.
  useEffect(() => {
    setError('');
    setSending(false);
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email || sending) return;
    setSending(true);
    setError('');
    try {
      await api('/public/discount-claim', { method: 'POST', body: JSON.stringify(formData) });
      setIsSubmitted(true);
      onClaimDiscount?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Modal Dialog Box */}
      <div className="relative w-full max-w-lg bg-[#110B1F] border border-[#5C4B8A] rounded-2xl p-6 sm:p-8 text-white overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Background Ambient Violet & Gold Glows */}
        <div className="absolute -top-24 -left-24 w-56 h-56 bg-[#9B59B6]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-56 h-56 bg-[#F1C40F]/15 rounded-full blur-3xl pointer-events-none" />
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#A7A0B5] hover:text-white rounded-full bg-[#1F1433]/70 hover:bg-[#2E1A47] border border-[#5C4B8A]/40 transition-colors z-20 cursor-pointer"
          aria-label="Close discount popup"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <div className="space-y-5 relative z-10">
            
            {/* Header Badge */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#2E1A47] border border-[#9B59B6] text-[#F1C40F] rounded-full text-xs font-bold tracking-wide shadow-[0_0_15px_rgba(241,196,15,0.25)]">
                <Flame className="w-3.5 h-3.5 text-[#F1C40F] animate-pulse" />
                <span>NEW BATCH COMING SOON</span>
              </span>
            </div>

            {/* Main Headline */}
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#F1C40F] via-[#F39C12] to-[#F1C40F] font-['Sora'] drop-shadow-[0_2px_20px_rgba(241,196,15,0.35)]">
                  FLAT {percent}% OFF
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-1 font-['Sora'] tracking-tight">
                Data Analyst + GenAI Flagship Batch
              </h3>
              <p className="text-xs sm:text-sm text-[#D1CADB] mt-1.5 leading-relaxed">
                Build job-ready data analytics skills in 24 weeks with SQL, Python, BI and GenAI workflows, real projects and 1:1 mentorship.
              </p>
            </div>

            {/* Promo Voucher & Coupon Box (Price Removed) */}
            <div className="p-4 rounded-2xl bg-[#1A102E] border border-[#5C4B8A]/60 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#2ECC71]/20 text-[#2ECC71] border border-[#2ECC71]/40">
                    {percent}% EARLY-BIRD DISCOUNT
                  </span>
                </div>
                <div className="text-xs text-[#D1CADB]">
                  Valid for Upcoming Data Analyst + GenAI Cohort
                </div>
              </div>

              <div className="w-full sm:w-auto bg-[#0C0717] px-4 py-2.5 rounded-xl border border-[#5C4B8A]/60 text-xs text-[#D1CADB] sm:max-w-[200px]">
                Reserved for your email and applied automatically at checkout.
              </div>
            </div>

            {/* Countdown to the real offer deadline */}
            {timeLeft && (
            <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#2E1A47]/30 border border-[#5C4B8A]/40 text-xs">
              <div className="flex items-center gap-2 text-[#D1CADB]">
                <Clock className="w-4 h-4 text-[#F1C40F] animate-spin-slow" />
                <span className="font-medium">Early-Bird Discount Closes In:</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono font-bold text-white text-xs">
                <span className="bg-[#120A1F] px-1.5 py-0.5 rounded border border-[#5C4B8A]/60">
                  {String(timeLeft.days).padStart(2, '0')}d
                </span>
                <span>:</span>
                <span className="bg-[#120A1F] px-1.5 py-0.5 rounded border border-[#5C4B8A]/60">
                  {String(timeLeft.hours).padStart(2, '0')}h
                </span>
                <span>:</span>
                <span className="bg-[#120A1F] px-1.5 py-0.5 rounded border border-[#5C4B8A]/60">
                  {String(timeLeft.minutes).padStart(2, '0')}m
                </span>
                <span>:</span>
                <span className="bg-[#120A1F] px-1.5 py-0.5 rounded border border-[#5C4B8A]/60 text-[#F1C40F]">
                  {String(timeLeft.seconds).padStart(2, '0')}s
                </span>
              </div>
            </div>
            )}

            {/* Lead Capture Form */}
            <form onSubmit={handleSubmit} className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-medium text-[#D1CADB] mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#A7A0B5] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-[#080511] border border-[#5C4B8A]/70 text-white placeholder-[#A7A0B5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9B59B6] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#D1CADB] mb-1">WhatsApp Mobile</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#A7A0B5] absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-[#080511] border border-[#5C4B8A]/70 text-white placeholder-[#A7A0B5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9B59B6] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#D1CADB] mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#A7A0B5] absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      placeholder="you@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-[#080511] border border-[#5C4B8A]/70 text-white placeholder-[#A7A0B5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9B59B6] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {error && <p role="alert" className="text-xs text-red-400">{error}</p>}

              {/* Action Buttons */}
              <button
                type="submit"
                disabled={sending}
                className="w-full mt-2 py-3.5 px-4 text-sm font-bold text-[#08070B] bg-[#F1C40F] hover:bg-[#F39C12] rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_25px_rgba(241,196,15,0.35)] hover:shadow-[0_0_35px_rgba(241,196,15,0.5)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>{sending ? 'Reserving...' : `Claim ${percent}% Discount`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs text-[#A7A0B5] hover:text-[#D1CADB] transition-colors cursor-pointer py-1"
                >
                  No thanks, I'll skip this offer for now
                </button>
              </div>

            </form>

          </div>
        ) : (
          /* Submission Confirmation View */
          <div className="text-center py-6 space-y-4 relative z-10">
            <div className="w-16 h-16 bg-[#2ECC71]/20 text-[#2ECC71] border border-[#2ECC71]/60 rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(46,204,113,0.3)]">
              <CheckCircle className="w-9 h-9" />
            </div>

            <div>
              <span className="text-xs font-bold text-[#F1C40F] uppercase tracking-wider">
                Discount Reserved!
              </span>
              <h4 className="text-2xl font-bold text-white mt-1 font-['Sora']">
                Congratulations, {formData.name || 'Learner'}! 🎉
              </h4>
              <p className="text-xs text-[#D1CADB] max-w-sm mx-auto mt-2 leading-relaxed">
                Your <strong>{percent}% early-bird discount</strong> is reserved for <strong>{formData.email}</strong>.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#1A102E] border border-[#5C4B8A]/60 max-w-sm mx-auto text-left text-xs text-[#D1CADB] leading-relaxed">
              Sign up or log in with <strong className="text-white">this same email</strong>, then enrol on the course page. The discount is applied automatically at checkout. It works once, for the Data Analyst + GenAI program.
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  onClose();
                }}
                className="w-full py-3 px-4 text-xs font-bold text-[#08070B] bg-[#F1C40F] hover:bg-[#F39C12] rounded-xl transition-colors cursor-pointer shadow-[0_0_20px_rgba(241,196,15,0.3)]"
              >
                Continue Exploring Programs
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
