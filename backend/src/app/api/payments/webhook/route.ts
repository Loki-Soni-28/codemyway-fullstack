import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyWebhookSignature } from '@/lib/razorpay';
import { fulfillPayment } from '@/lib/enrollment';

// Razorpay calls this server-to-server, so enrolment still happens if the student closes
// the tab right after paying. Configure it in the Razorpay dashboard for payment.captured
// (and order.paid) events.
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get('x-razorpay-signature');

  try {
    if (!signature || !verifyWebhookSignature(rawBody, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(rawBody);
    if (event.event === 'payment.captured' || event.event === 'order.paid') {
      const entity = event.payload?.payment?.entity;
      const orderId: unknown = entity?.order_id;
      const paymentId: unknown = entity?.id;
      if (typeof orderId === 'string' && typeof paymentId === 'string') {
        const payment = await prisma.payment.findUnique({ where: { razorpayOrderId: orderId } });
        if (payment && entity.amount === payment.amount) {
          await fulfillPayment(orderId, paymentId);
        } else {
          console.error('[api/payments/webhook] unknown order or amount mismatch', orderId);
        }
      }
    }
    return NextResponse.json({ received: true });
  } catch (e) {
    // A non-2xx response makes Razorpay retry the delivery.
    console.error('[api/payments/webhook]', e);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
