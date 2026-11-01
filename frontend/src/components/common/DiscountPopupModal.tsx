import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Flame, 
  Clock, 
  Copy, 
  Check, 
  CheckCircle, 
  ArrowRight, 
  Percent,
  Gift,
  Zap,
  User,
  Phone,
  Mail
} from 'lucide-react';

interface DiscountPopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaimDiscount?: (code: string) => void;
}

export const DiscountPopupModal: React.FC<DiscountPopupModalProps> = ({
  isOpen,
  onClose,
  onClaimDiscount
}) => {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const [isCopied, setIsCopied] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Live countdown timer state (e.g. 2 days, 14 hours, 32 mins, 45 secs)
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 32,
    seconds: 45
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCopyCode = () => {
    navigator.clipboard?.writeText('BATCH30');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setIsSubmitted(true);
    if (onClaimDiscount) {
      onClaimDiscount('BATCH30');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Modal Dialog Box */}
      <div className="relative w-full max-w-lg bg-[#110B1F] border border-[#5C4B8A] rounded-3xl p-6 sm:p-8 shadow-[0_0_80px_rgba(155,89,182,0.45)] text-white overflow-hidden animate-in zoom-in-95 duration-200">
        
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
              <span className="text-xs text-[#A7A0B5] font-medium hidden sm:inline">
                Limited Early-Bird Seats
              </span>
            </div>

            {/* Main Headline */}
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#F1C40F] via-[#F39C12] to-[#F1C40F] font-['Sora'] drop-shadow-[0_2px_20px_rgba(241,196,15,0.35)]">
                  FLAT 30% OFF
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-1 font-['Sora'] tracking-tight">
                Data Analyst + GenAI Flagship Batch
              </h3>
              <p className="text-xs sm:text-sm text-[#D1CADB] mt-1.5 leading-relaxed">
                Land your first high-paying job in marketing in just 5 months. Master industry-ready skills with real-world campaigns, 1:1 mentor pods, and complete placement backing.
              </p>
            </div>

            {/* Promo Voucher & Coupon Box (Price Removed) */}
            <div className="p-4 rounded-2xl bg-[#1A102E] border border-[#9B59B6]/50 shadow-[0_0_20px_rgba(155,89,182,0.2)] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#2ECC71]/20 text-[#2ECC71] border border-[#2ECC71]/40">
                    30% SCHOLARSHIP VOUCHER
                  </span>
                </div>
                <div className="text-xs text-[#D1CADB]">
                  Valid for Upcoming Data Analyst + GenAI Cohort
                </div>
              </div>

              {/* Coupon Box */}
              <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-3 bg-[#0C0717] px-4 py-2.5 rounded-xl border border-[#9B59B6]/60 shadow-[0_0_15px_rgba(155,89,182,0.25)]">
                <div className="text-left">
                  <div className="text-[10px] text-[#9B59B6] font-mono uppercase font-bold">PROMO CODE</div>
                  <div className="text-base font-extrabold tracking-wider text-[#F1C40F] font-mono">BATCH30</div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="p-2 rounded-lg bg-[#2E1A47] hover:bg-[#3B225C] text-white transition-colors cursor-pointer ml-1"
                  title="Copy coupon code"
                >
                  {isCopied ? <Check className="w-4 h-4 text-[#2ECC71]" /> : <Copy className="w-4 h-4 text-[#D1CADB]" />}
                </button>
              </div>
            </div>

            {/* Countdown Urgency Timer */}
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

              {/* Action Buttons */}
              <button
                type="submit"
                className="w-full mt-2 py-3.5 px-4 text-sm font-bold text-[#08070B] bg-[#F1C40F] hover:bg-[#F39C12] rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_25px_rgba(241,196,15,0.35)] hover:shadow-[0_0_35px_rgba(241,196,15,0.5)] hover:scale-[1.01] active:scale-[0.99]"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Claim 30% Discount & Reserve Seat</span>
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
                Discount Code Reserved!
              </span>
              <h4 className="text-2xl font-bold text-white mt-1 font-['Sora']">
                Congratulations, {formData.name || 'Learner'}! 🎉
              </h4>
              <p className="text-xs text-[#D1CADB] max-w-sm mx-auto mt-2 leading-relaxed">
                Your <strong>30% Early-Bird Scholarship</strong> has been locked in for the upcoming batch.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#1A102E] border border-[#5C4B8A]/60 max-w-sm mx-auto text-left space-y-2">
              <div className="flex items-center justify-between text-xs text-[#A7A0B5]">
                <span>Applied Coupon:</span>
                <span className="font-mono font-bold text-[#F1C40F] text-sm">BATCH30</span>
              </div>
              <div className="flex items-center justify-between text-xs text-[#A7A0B5]">
                <span>Scholarship Status:</span>
                <span className="font-mono font-bold text-[#2ECC71] text-sm">30% OFF Locked In</span>
              </div>
              <div className="text-[11px] text-[#A7A0B5] pt-1 border-t border-[#5C4B8A]/30">
                Admissions counselor will send the onboarding link to <strong>{formData.phone}</strong> via WhatsApp.
              </div>
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
