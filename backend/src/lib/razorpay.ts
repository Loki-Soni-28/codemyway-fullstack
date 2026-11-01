import * as crypto from 'crypto';

// Razorpay is called over plain HTTPS so no SDK dependency is needed. Credentials are read
// per call so `next build` works without secrets.
function credentials() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    throw new Error('RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are not set.');
  }
  return { keyId, keySecret };
}

export const getRazorpayKeyId = () => credentials().keyId;

export async function createRazorpayOrder(amountPaise: number, receipt: string, notes: Record<string, string>) {
  const { keyId, keySecret } = credentials();
  const res = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`,
    },
    body: JSON.stringify({ amount: amountPaise, currency: 'INR', receipt, notes }),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.id) {
    console.error('[razorpay] order creation failed', res.status, data?.error);
    throw new Error('Could not create payment order');
  }
  return data as { id: string; amount: number; currency: string };
}

function hmacMatches(payload: string, secret: string, signature: string) {
  const expected = Buffer.from(crypto.createHmac('sha256', secret).update(payload).digest('hex'));
  const given = Buffer.from(signature);
  return expected.length === given.length && crypto.timingSafeEqual(expected, given);
}

// Signature returned to the browser after a successful checkout.
export function verifyCheckoutSignature(orderId: string, paymentId: string, signature: string) {
  return hmacMatches(`${orderId}|${paymentId}`, credentials().keySecret, signature);
}

// Signature on webhook calls, computed over the raw request body.
export function verifyWebhookSignature(rawBody: string, signature: string) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) throw new Error('RAZORPAY_WEBHOOK_SECRET is not set.');
  return hmacMatches(rawBody, secret, signature);
}
