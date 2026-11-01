// Business details used by the Privacy, Terms, Refund and Contact pages.
// Confirm every value below before going live; Razorpay and customers rely on these.
export const POLICY_CONFIG = {
  companyName: 'CodeMyWay Technologies Pvt. Ltd.',
  siteUrl: 'https://codemyway.tech',
  supportEmail: 'support@codemyway.tech',
  // Optional: shown on the Contact page only when filled in. Razorpay's live-mode review
  // usually expects a phone number and a registered address.
  supportPhone: '',
  address: '',
  supportHours: '',
  jurisdiction: 'Bengaluru, Karnataka',
  lastUpdated: '1 November 2026',
  // Refund rules: these are business decisions, adjust to your actual policy.
  refundWindowDays: 7,
  refundMaxClasses: 1,
  refundProcessingDays: 7,
};
