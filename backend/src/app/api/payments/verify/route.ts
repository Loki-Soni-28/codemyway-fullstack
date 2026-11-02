import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { verifyCheckoutSignature } from '@/lib/razorpay';
import { fulfillPayment } from '@/lib/enrollment';

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Please log in again.' }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const { razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: signature } = body ?? {};
    if (typeof orderId !== 'string' || typeof paymentId !== 'string' || typeof signature !== 'string') {
      return NextResponse.json({ error: 'Invalid payment details' }, { status: 400 });
    }

    const payment = await prisma.payment.findUnique({ where: { razorpayOrderId: orderId } });
    if (!payment || payment.userId !== user.id) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    if (!verifyCheckoutSignature(orderId, paymentId, signature)) {
      return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 });
    }

    await fulfillPayment(orderId, paymentId);
    return NextResponse.json({ success: true });
  } catch (e) {
    // The webhook still enrols the student if this fails after a real payment.
    console.error('[api/payments/verify]', e);
    return NextResponse.json(
      { error: 'Could not confirm payment. If money was deducted, you will be enrolled shortly.' },
      { status: 500 },
    );
  }
}
