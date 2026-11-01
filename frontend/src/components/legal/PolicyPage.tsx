import React from 'react';
import { NavigationRoute } from '../../types';
import { POLICY_CONFIG as C } from './policyConfig';

export type PolicyKind = 'privacy' | 'terms' | 'refund' | 'contact';

interface Section {
  heading: string;
  body: string[];
}

const SUPPORT = C.supportEmail;

const POLICIES: Record<PolicyKind, { title: string; sections: Section[] }> = {
  privacy: {
    title: 'Privacy Policy',
    sections: [
      {
        heading: 'Who we are',
        body: [`${C.companyName} ("CodeMyWay", "we") runs ${C.siteUrl}. This policy explains what personal data we collect and how we use it. Questions: ${SUPPORT}.`],
      },
      {
        heading: 'What we collect',
        body: [
          'Details you give us: name, email address, mobile number and your background when you request a brochure, book a call, claim an offer, create an account or enrol.',
          'Account data: your Google account name and email if you sign in with Google. We never receive your Google password.',
          'Learning data: your progress, attendance, submissions and messages with mentors and support.',
          'Payment data: payments are handled by Razorpay. We receive the payment status, order and payment IDs and the amount. We do not receive or store your card, UPI or bank details.',
          'Technical data: basic logs such as IP address and browser type, used for security and to keep the site working.',
        ],
      },
      {
        heading: 'How we use it',
        body: [
          'To respond to your enquiries, provide the programs you enrol in, process payments, issue receipts and certificates, and send service messages about your batch.',
          'To send information about programs and offers you asked about. You can ask us to stop at any time.',
          'To keep the platform secure and prevent fraud.',
        ],
      },
      {
        heading: 'Who we share it with',
        body: [
          'Service providers who help us run the site (hosting, database, payments, email and messaging). They may only use your data to provide their service to us.',
          'Authorities when the law requires it. We do not sell your personal data.',
        ],
      },
      {
        heading: 'Retention and your rights',
        body: [
          'We keep your data for as long as needed to provide the service and meet legal and accounting obligations.',
          `You can ask to access, correct or delete your personal data, or withdraw consent for marketing, by writing to ${SUPPORT}. We will respond within a reasonable time.`,
        ],
      },
      {
        heading: 'Cookies',
        body: ['We use a sign-in cookie to keep you logged in and small browser storage entries to remember simple preferences. We do not use advertising cookies unless we tell you.'],
      },
      {
        heading: 'Changes',
        body: ['We may update this policy and will change the date below when we do.'],
      },
    ],
  },
  terms: {
    title: 'Terms & Conditions',
    sections: [
      {
        heading: 'Using the site',
        body: [`By using ${C.siteUrl} or enrolling in a program you agree to these terms. You must provide accurate information and keep your account secure. Accounts are personal and may not be shared.`],
      },
      {
        heading: 'Programs and enrolment',
        body: [
          'Enrolment is confirmed when your payment succeeds. Program content, schedules, mentors and batch dates may change when needed; we will inform you of material changes.',
          'Some programs charge a separate registration fee. Any such fee is shown to you before it is billed.',
        ],
      },
      {
        heading: 'Fees and payments',
        body: [
          'Prices are in Indian Rupees and are shown at checkout before you pay. Payments are processed by Razorpay using UPI, cards or netbanking.',
          'Promotional discounts apply only to the person who claimed them, only for the stated program, only once, and only until the stated end date. We may refuse or cancel a discount obtained by misuse.',
          `Refunds are governed by our Refund & Cancellation Policy at ${C.siteUrl}/refund-policy.`,
        ],
      },
      {
        heading: 'Acceptable use',
        body: [
          'Do not share, record or redistribute class recordings or course material, attempt to access other users\' data, or disrupt the platform. We may suspend accounts that break these rules.',
        ],
      },
      {
        heading: 'Intellectual property',
        body: ['All course content, branding and software belong to us or our licensors. You get a personal, non-transferable licence to use them for your own learning.'],
      },
      {
        heading: 'Outcomes',
        body: ['We teach skills and support your career preparation. We cannot promise any particular job, salary or interview outcome.'],
      },
      {
        heading: 'Liability and governing law',
        body: [
          'To the extent the law allows, our liability is limited to the fees you paid for the program concerned.',
          `These terms are governed by the laws of India. Courts in ${C.jurisdiction} have jurisdiction.`,
        ],
      },
    ],
  },
  refund: {
    title: 'Refund & Cancellation Policy',
    sections: [
      {
        heading: 'Cancellation and refund window',
        body: [
          `You may cancel your enrolment and request a refund within ${C.refundWindowDays} days of payment, provided you have attended no more than ${C.refundMaxClasses} live class(es) in your batch.`,
          `After that window, or once the limit above is exceeded, fees are non-refundable. Email ${SUPPORT} from the address used at enrolment, with your payment ID.`,
        ],
      },
      {
        heading: 'If we cancel or reschedule',
        body: ['If we cancel a batch or cannot offer you a seat, you will receive a full refund of the fees paid for it. If we reschedule, you may accept the new dates or ask for a refund.'],
      },
      {
        heading: 'Discounted enrolments',
        body: ['If you paid a discounted price, the refund is the amount you actually paid.'],
      },
      {
        heading: 'How refunds are paid',
        body: [
          `Approved refunds are sent to the original payment method through Razorpay within ${C.refundProcessingDays} working days of approval. Your bank may take additional time to show the credit.`,
          'The separate registration fee, where charged, is refundable on the same terms unless stated otherwise when it is billed.',
        ],
      },
    ],
  },
  contact: {
    title: 'Contact Us',
    sections: [
      {
        heading: 'Get in touch',
        body: [
          `${C.companyName}`,
          `Email: ${SUPPORT}`,
          ...(C.supportPhone ? [`Phone: ${C.supportPhone}`] : []),
          ...(C.address ? [`Address: ${C.address}`] : []),
          ...(C.supportHours ? [`Support hours: ${C.supportHours}`] : []),
        ],
      },
      {
        heading: 'Payment or enrolment problems',
        body: [`Write to ${SUPPORT} with your registered email and, if you paid, your Razorpay payment ID. We will reply as soon as we can.`],
      },
    ],
  },
};

interface PolicyPageProps {
  kind: PolicyKind;
  onRouteChange: (route: NavigationRoute) => void;
  onRequestCall?: () => void;
}

export const PolicyPage: React.FC<PolicyPageProps> = ({ kind, onRouteChange, onRequestCall }) => {
  const policy = POLICIES[kind];
  return (
    <div className="bg-[#08070B] text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <button
          onClick={() => onRouteChange('home')}
          className="text-xs text-[#A7A0B5] hover:text-white mb-6 cursor-pointer"
        >
          ← Back to home
        </button>
        <h1 className="text-3xl font-bold font-['Sora'] mb-2">{policy.title}</h1>
        {kind !== 'contact' && (
          <p className="text-xs text-[#A7A0B5] mb-8">Last updated: {C.lastUpdated}</p>
        )}
        <div className="space-y-8">
          {policy.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-lg font-semibold font-['Sora'] mb-2">{section.heading}</h2>
              <div className="space-y-2 text-sm text-[#D1CADB] leading-relaxed">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
        {kind === 'contact' && onRequestCall && (
          <button
            onClick={onRequestCall}
            className="mt-8 w-full sm:w-auto px-6 py-3 text-sm font-bold text-[#08070B] bg-[#F1C40F] hover:bg-[#F39C12] rounded-xl transition-colors cursor-pointer"
          >
            Request a Call
          </button>
        )}
      </div>
    </div>
  );
};
