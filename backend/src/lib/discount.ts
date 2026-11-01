import { prisma } from './db';

// The early-bird offer shown in the popup/banner. It only applies to people who claimed it
// (DiscountClaim), only for this course, and only once.
export const OFFER_COURSE_SLUG = 'data-analyst-with-gen-ai';
export const OFFER_PERCENT = 30;
const DEFAULT_CLAIM_VALID_DAYS = 14;

// OFFER_ENDS_AT (ISO date) closes the offer and drives the countdown. Unset = open, no timer.
export function getOffer() {
  const raw = process.env.OFFER_ENDS_AT;
  const endsAt = raw ? new Date(raw) : null;
  const validEnd = endsAt && !Number.isNaN(endsAt.getTime()) ? endsAt : null;
  return {
    active: !validEnd || validEnd.getTime() > Date.now(),
    endsAt: validEnd,
    percent: OFFER_PERCENT,
    courseSlug: OFFER_COURSE_SLUG,
  };
}

export function claimExpiry() {
  const { endsAt } = getOffer();
  return endsAt ?? new Date(Date.now() + DEFAULT_CLAIM_VALID_DAYS * 24 * 60 * 60 * 1000);
}

// The unredeemed, unexpired claim for this email, if it applies to the given course.
export async function findActiveClaim(email: string, courseSlug: string) {
  if (courseSlug !== OFFER_COURSE_SLUG) return null;
  const claim = await prisma.discountClaim.findUnique({ where: { email: email.toLowerCase() } });
  if (!claim || claim.redeemedAt || claim.courseSlug !== courseSlug || claim.expiresAt.getTime() <= Date.now()) {
    return null;
  }
  return claim;
}

export function discountedRupees(price: number, percent: number) {
  return Math.round((price * (100 - percent)) / 100);
}
