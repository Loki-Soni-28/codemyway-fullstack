import React, { useState } from 'react';
import { X, CheckCircle, ArrowRight, ShieldCheck, Download, Calendar, Mail, Phone, User, Sparkles } from 'lucide-react';
import { PROGRAM_INFO } from '../../data/mockData';
import { api } from '../../api';

type LeadSource = 'BROCHURE' | 'TALK_TO_MENTOR' | 'APPLY';

const submitLead = (source: LeadSource, name: string, email: string, phone: string, details?: Record<string, string>) =>
  api('/public/leads', { method: 'POST', body: JSON.stringify({ source, name, email, phone, details }) });

const LeadError: React.FC<{ message: string }> = ({ message }) =>
  message ? <p role="alert" className="text-xs text-red-400">{message}</p> : null;

interface BrochureModalProps {
  isOpen: boolean;
  onClose: () => void;
  programTitle?: string;
}

export const BrochureModal: React.FC<BrochureModalProps> = ({ isOpen, onClose, programTitle = 'Data Analyst + GenAI' }) => {
  const [formData, setFormData] = useState({ name: '', email: '', mobile: '', background: 'Fresher / Non-Tech Transition' });
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.mobile || sending) return;
    setSending(true);
    setError('');
    try {
      await submitLead('BROCHURE', formData.name, formData.email, formData.mobile, { background: formData.background, program: programTitle });
      setStep('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#170F28] rounded-2xl max-w-md w-full p-6 shadow-[0_0_50px_rgba(46,26,71,0.8)] border border-[#5C4B8A] relative overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-white">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#A7A0B5] hover:text-white rounded-lg hover:bg-[#2E1A47] transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'form' ? (
          <div>
            <div className="mb-5">
              <span className="text-xs font-semibold text-[#9B59B6] uppercase tracking-wider">Curriculum Brochure</span>
              <h3 className="text-xl font-bold text-white mt-1 font-['Sora']">Download Full Brochure</h3>
              <p className="text-xs text-[#D1CADB] mt-1">
                Receive the detailed week-by-week curriculum syllabus, project briefs, and mentoring calendar for <span className="font-semibold text-white">{programTitle}</span>.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-[#D1CADB] mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#A7A0B5] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-[#0C0717] border border-[#5C4B8A]/60 text-white placeholder-[#A7A0B5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B59B6] focus:border-transparent"
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
                    placeholder="priya@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-[#0C0717] border border-[#5C4B8A]/60 text-white placeholder-[#A7A0B5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B59B6] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#D1CADB] mb-1">Mobile Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#A7A0B5] absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-[#0C0717] border border-[#5C4B8A]/60 text-white placeholder-[#A7A0B5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B59B6] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#D1CADB] mb-1">Current Background</label>
                <select
                  value={formData.background}
                  onChange={(e) => setFormData({ ...formData, background: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-[#0C0717] border border-[#5C4B8A]/60 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B59B6] focus:border-transparent"
                >
                  <option value="Fresher / Non-Tech Transition">College Fresher / Non-Tech Transition</option>
                  <option value="Working Professional in Tech">Working Professional in Tech / IT</option>
                  <option value="Business & Operations Specialist">Business, Sales, or Operations</option>
                  <option value="Student">Undergraduate / Postgraduate Student</option>
                </select>
              </div>

              {/* Transparent prototype note */}
              <div className="p-2.5 rounded-lg bg-[#2E1A47]/40 border border-[#5C4B8A]/50 text-[11px] text-[#D1CADB] flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#9B59B6] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Prototype Note:</strong> In production, an instant SMS OTP is verified. In this prototype, clicking download provides immediate preview access.
                </span>
              </div>

              <LeadError message={error} />
              <button
                type="submit"
                disabled={sending}
                className="w-full py-2.5 px-4 text-sm font-bold text-[#08070B] bg-[#F1C40F] hover:bg-[#F39C12] rounded-lg shadow-[0_0_15px_rgba(241,196,15,0.25)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                {sending ? 'Sending...' : 'Download Brochure PDF'}
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-4 space-y-4">
            <div className="w-12 h-12 bg-emerald-950/80 text-emerald-400 border border-emerald-700/60 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white font-['Sora']">Brochure Sent Successfully!</h4>
              <p className="text-xs text-[#D1CADB] mt-1 max-w-xs mx-auto">
                We have generated your personalized curriculum package for <span className="font-semibold text-white">{formData.name}</span>.
              </p>
            </div>
            <div className="p-3 bg-[#2E1A47]/50 border border-[#5C4B8A]/50 rounded-xl text-left text-xs text-[#D1CADB] space-y-1">
              <div className="font-semibold text-white">Included in package:</div>
              <div>• 24-Week detailed syllabus breakdown</div>
              <div>• 4-Teacher mentoring model schedule</div>
              <div>• Major project rubric templates</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setStep('form');
                  onClose();
                }}
                className="w-full py-2 px-4 text-xs font-semibold text-white bg-[#2E1A47] hover:bg-[#3B225C] border border-[#5C4B8A] rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface TalkToMentorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TalkToMentorModal: React.FC<TalkToMentorModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    topic: 'Career transition from non-tech to Data Analytics',
    preferredSlot: 'Tomorrow afternoon'
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setError('');
    try {
      await submitLead('TALK_TO_MENTOR', formData.name, formData.email, formData.phone, { topic: formData.topic, preferredSlot: formData.preferredSlot });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#170F28] rounded-2xl max-w-md w-full p-6 shadow-[0_0_50px_rgba(46,26,71,0.8)] border border-[#5C4B8A] relative overflow-hidden text-white">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#A7A0B5] hover:text-white rounded-lg hover:bg-[#2E1A47] transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div>
            <div className="mb-4">
              <span className="text-xs font-semibold text-[#9B59B6] uppercase tracking-wider">Admissions & Guidance</span>
              <h3 className="text-xl font-bold text-white mt-1 font-['Sora']">Talk to a Senior Mentor</h3>
              <p className="text-xs text-[#D1CADB] mt-1">
                Schedule a 15-minute 1:1 conversation to discuss your background, eligibility, curriculum suitability, and career path.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-[#D1CADB] mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Verma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-[#0C0717] border border-[#5C4B8A]/60 text-white placeholder-[#A7A0B5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B59B6] focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#D1CADB] mb-1">Phone</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 00000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-[#0C0717] border border-[#5C4B8A]/60 text-white placeholder-[#A7A0B5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B59B6] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#D1CADB] mb-1">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="you@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-[#0C0717] border border-[#5C4B8A]/60 text-white placeholder-[#A7A0B5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B59B6] focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#D1CADB] mb-1">Primary Discussion Topic</label>
                <select
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-[#0C0717] border border-[#5C4B8A]/60 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B59B6] focus:border-transparent"
                >
                  <option value="Career transition from non-tech to Data Analytics">Career transition from non-tech to Data Analytics</option>
                  <option value="Understanding 4-Teacher Mentorship schedule">Understanding 4-Teacher Mentorship schedule</option>
                  <option value="GenAI curriculum relevance for current market">GenAI curriculum relevance for current market</option>
                  <option value="Fee structure & early-bird registration details">Fee structure & early-bird registration details</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#D1CADB] mb-1">Preferred Time Window</label>
                <select
                  value={formData.preferredSlot}
                  onChange={(e) => setFormData({ ...formData, preferredSlot: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-[#0C0717] border border-[#5C4B8A]/60 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B59B6] focus:border-transparent"
                >
                  <option value="Tomorrow morning (10:00 - 12:00 IST)">Tomorrow morning (10:00 - 12:00 IST)</option>
                  <option value="Tomorrow afternoon (14:00 - 17:00 IST)">Tomorrow afternoon (14:00 - 17:00 IST)</option>
                  <option value="Tomorrow evening (18:00 - 20:30 IST)">Tomorrow evening (18:00 - 20:30 IST)</option>
                  <option value="Weekend slot">Upcoming Weekend</option>
                </select>
              </div>

              <div className="p-2.5 rounded-lg bg-[#2E1A47]/40 border border-[#5C4B8A]/50 text-[11px] text-[#D1CADB]">
                <span>Direct mentorship consultation call. No high-pressure sales pitches.</span>
              </div>

              <LeadError message={error} />
              <button
                type="submit"
                disabled={sending}
                className="w-full py-2.5 px-4 text-sm font-bold text-[#08070B] bg-[#F1C40F] hover:bg-[#F39C12] rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(241,196,15,0.25)] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Calendar className="w-4 h-4" />
                {sending ? 'Sending...' : 'Schedule Consultation Call'}
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-5 space-y-3">
            <div className="w-12 h-12 bg-emerald-950/80 text-emerald-400 border border-emerald-700/60 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-bold text-white font-['Sora']">Consultation Scheduled!</h4>
            <p className="text-xs text-[#D1CADB] max-w-xs mx-auto">
              Our academic advisor has received your request for <strong className="text-white">{formData.name}</strong>. You will receive an appointment invite on {formData.phone}.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="mt-3 w-full py-2 px-4 text-xs font-semibold text-white bg-[#2E1A47] hover:bg-[#3B225C] border border-[#5C4B8A] rounded-lg transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

interface BuyNowCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessDemo?: () => void;
  programTitle?: string;
  originalPrice?: string;
  salePrice?: string;
  discountText?: string;
}

export const BuyNowCheckoutModal: React.FC<BuyNowCheckoutModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccessDemo,
  programTitle = 'Data Analyst + GenAI',
  originalPrice = '₹36,000',
  salePrice = '₹24,999',
  discountText = '30% OFF · Active'
}) => {
  const [step, setStep] = useState<'checkout' | 'completed'>('checkout');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');

  if (!isOpen) return null;

  const handlePay = () => {
    setStep('completed');
    if (onSuccessDemo) onSuccessDemo();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#170F28] rounded-2xl max-w-lg w-full p-6 shadow-[0_0_60px_rgba(46,26,71,0.9)] border border-[#5C4B8A] relative overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-white">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#A7A0B5] hover:text-white rounded-lg hover:bg-[#2E1A47] transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'checkout' ? (
          <div>
            <div className="mb-4">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9B59B6] uppercase tracking-wider mb-1">
                <span>Prototype Checkout</span>
                <span className="text-[#A7A0B5]">·</span>
                <span className="text-[#F1C40F] font-normal">Simulation Mode</span>
              </div>
              <h3 className="text-xl font-bold text-white font-['Sora']">Enroll in {programTitle}</h3>
              <p className="text-xs text-[#D1CADB] mt-0.5">
                Review your pricing structure, fee transparency, and prototype enrollment.
              </p>
            </div>

            {/* Price breakdown */}
            <div className="p-4 bg-[#2E1A47]/40 rounded-xl border border-[#9B59B6]/45 shadow-[0_0_20px_rgba(155,89,182,0.18)] space-y-2 mb-4">
              <div className="flex justify-between text-xs text-[#D1CADB]">
                <span>Standard Program Tuition</span>
                <span className="line-through text-[#A7A0B5] font-mono">{originalPrice}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-white">
                <span className="flex items-center gap-1.5">
                  Early-Bird Enrolled Price
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-1.5 py-0.5 rounded">{discountText}</span>
                </span>
                <span className="text-[#F1C40F] font-mono text-base font-bold">{salePrice}</span>
              </div>
              <div className="border-t border-[#5C4B8A]/40 pt-2 flex justify-between text-xs text-[#A7A0B5]">
                <span className="max-w-[240px]">Registration Fee (Separate additional fee)</span>
                <span className="italic text-[#D1CADB] text-right">To be confirmed</span>
              </div>
              <div className="text-[11px] text-[#D1CADB] bg-[#0C0717] p-2 rounded border border-[#5C4B8A]/40 mt-1">
                <strong className="text-white">Transparent Fee Policy:</strong> Registration fee is billed separately upon batch seat confirmation by admissions. No hidden charges or unconfirmed seat fees.
              </div>
            </div>

            {/* Simulated Payment Selector */}
            <div className="space-y-2 mb-4">
              <label className="block text-xs font-semibold text-[#D1CADB]">Simulate Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-2.5 rounded-lg border text-xs font-medium text-center transition-all cursor-pointer ${
                    paymentMethod === 'upi'
                      ? 'border-[#9B59B6] bg-[#2E1A47] text-white font-semibold shadow-[0_0_10px_rgba(155,89,182,0.3)]'
                      : 'border-[#5C4B8A]/40 bg-[#0C0717] text-[#D1CADB] hover:border-[#5C4B8A]'
                  }`}
                >
                  UPI (QR / ID)
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-2.5 rounded-lg border text-xs font-medium text-center transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'border-[#9B59B6] bg-[#2E1A47] text-white font-semibold shadow-[0_0_10px_rgba(155,89,182,0.3)]'
                      : 'border-[#5C4B8A]/40 bg-[#0C0717] text-[#D1CADB] hover:border-[#5C4B8A]'
                  }`}
                >
                  Card / EMI
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-2.5 rounded-lg border text-xs font-medium text-center transition-all cursor-pointer ${
                    paymentMethod === 'netbanking'
                      ? 'border-[#9B59B6] bg-[#2E1A47] text-white font-semibold shadow-[0_0_10px_rgba(155,89,182,0.3)]'
                      : 'border-[#5C4B8A]/40 bg-[#0C0717] text-[#D1CADB] hover:border-[#5C4B8A]'
                  }`}
                >
                  NetBanking
                </button>
              </div>
            </div>

            <div className="p-2.5 bg-[#2E1A47]/40 rounded-lg border border-[#F1C40F]/30 text-[11px] text-[#D1CADB] mb-4 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#F1C40F] shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">Prototype Notice:</strong> This is a design prototype. Clicking Confirm will NOT deduct actual funds; it simulates onboarding and unlocks your demo student dashboard.
              </span>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-4 text-xs font-semibold text-[#D1CADB] bg-[#2E1A47]/60 hover:bg-[#2E1A47] rounded-lg transition-colors cursor-pointer border border-[#5C4B8A]/50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePay}
                className="flex-1 py-2.5 px-4 text-sm font-bold text-[#08070B] bg-[#F1C40F] hover:bg-[#F39C12] rounded-lg shadow-[0_0_15px_rgba(241,196,15,0.25)] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Confirm Enrollment (Simulated)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-5 space-y-4">
            <div className="w-14 h-14 bg-emerald-950/80 text-emerald-400 border border-emerald-700/60 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-white font-['Sora']">Prototype Enrollment Confirmed!</h4>
              <p className="text-xs text-[#D1CADB] mt-1 max-w-sm mx-auto">
                Welcome to CodeMyWay! You are now provisioned in the prototype student dashboard with enrolled access to Data Analyst + GenAI.
              </p>
            </div>
            <div className="p-3 bg-[#2E1A47]/50 border border-[#5C4B8A]/60 rounded-xl text-left text-xs text-[#D1CADB] space-y-1">
              <div>• Roll ID: <span className="font-mono text-[#F1C40F] font-bold">CMW-2026-DA42</span></div>
              <div>• Assigned Phase: <span className="font-medium text-white">Phase 1 Foundations</span></div>
              <div>• Free 1:1 Mentorship Quota: <span className="font-medium text-[#9B59B6]">4 Sessions Active</span></div>
            </div>
            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 text-sm font-bold text-[#08070B] bg-[#F1C40F] hover:bg-[#F39C12] rounded-lg transition-colors cursor-pointer"
            >
              Go to Student Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

interface NotifyMeModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseTitle: string;
  isPrebooking?: boolean;
}

export const NotifyMeModal: React.FC<NotifyMeModalProps> = ({ isOpen, onClose, courseTitle, isPrebooking = false }) => {
  const [formData, setFormData] = useState({ name: '', email: '', mobile: '' });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#170F28] rounded-2xl max-w-md w-full p-6 shadow-[0_0_50px_rgba(46,26,71,0.8)] border border-[#5C4B8A] relative overflow-hidden text-white">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#A7A0B5] hover:text-white rounded-lg hover:bg-[#2E1A47] transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div>
            <div className="mb-4">
              <span className="text-xs font-semibold text-[#9B59B6] uppercase tracking-wider">
                {isPrebooking ? 'Early Spot Reservation' : 'Interest Registration'}
              </span>
              <h3 className="text-xl font-bold text-white mt-1 font-['Sora']">
                {isPrebooking ? 'Pre-book Your Cohort Spot' : 'Get Notified on Launch'}
              </h3>
              <p className="text-xs text-[#D1CADB] mt-1">
                {courseTitle}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#D1CADB] mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ankit Singh"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-[#0C0717] border border-[#5C4B8A]/60 text-white placeholder-[#A7A0B5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B59B6] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#D1CADB] mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="ankit@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-[#0C0717] border border-[#5C4B8A]/60 text-white placeholder-[#A7A0B5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B59B6] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#D1CADB] mb-1">Mobile (WhatsApp Updates)</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 11111"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-[#0C0717] border border-[#5C4B8A]/60 text-white placeholder-[#A7A0B5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9B59B6] focus:border-transparent"
                />
              </div>

              <div className="p-2.5 rounded-lg bg-[#2E1A47]/40 border border-[#5C4B8A]/50 text-[11px] text-[#D1CADB]">
                <span>We respect your time. No spam; only verified cohort schedule releases and syllabus updates.</span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 text-sm font-bold text-[#08070B] bg-[#F1C40F] hover:bg-[#F39C12] rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(241,196,15,0.25)]"
              >
                <Sparkles className="w-4 h-4" />
                {isPrebooking ? 'Pre-book My Spot' : 'Notify Me Upon Availability'}
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-5 space-y-3">
            <div className="w-12 h-12 bg-emerald-950/80 text-emerald-400 border border-emerald-700/60 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-bold text-white font-['Sora']">Interest Registered!</h4>
            <p className="text-xs text-[#D1CADB] max-w-xs mx-auto">
              You are on the priority notification list for <strong className="text-white">{courseTitle}</strong>.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="mt-2 w-full py-2 px-4 text-xs font-semibold text-white bg-[#2E1A47] hover:bg-[#3B225C] border border-[#5C4B8A] rounded-lg transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
