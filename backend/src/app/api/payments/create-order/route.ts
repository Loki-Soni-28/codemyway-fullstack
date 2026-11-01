import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { rateLimit } from '@/lib/rateLimit';
import { discountedRupees, findActiveClaim } from '@/lib/discount';
import { createRazorpayOrder, getRazorpayKeyId } from '@/lib/razorpay';

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Please log in to enrol.' }, { status: 401 });
    }

    const limited = rateLimit(`create-order:${user.id}`, 10, 10 * 60 * 1000);
    if (!limited.ok) {
      return NextResponse.json(
        { error: 'Too many attempts. Please try again in a few minutes.' },
        { status: 429, headers: { 'Retry-After': String(limited.retryAfter) } },
      );
    }

    const body = await req.json().catch(() => null);
    const slug = body?.courseSlug;
    if (typeof slug !== 'string' || !slug) {
      return NextResponse.json({ error: 'courseSlug is required' }, { status: 400 });
    }

    // The amount always comes from the database, never from the browser.
    const course = await prisma.course.findFirst({ where: { slug, published: true } });
    if (!course || course.price <= 0) {
      return NextResponse.json({ error: 'This course is not available for purchase.' }, { status: 404 });
    }

    const alreadyPaid = await prisma.payment.findFirst({
      where: { userId: user.id, courseId: course.id, status: 'PAID' },
    });
    if (alreadyPaid) {
      return NextResponse.json({ error: 'You have already purchased this course.' }, { status: 409 });
    }

    // 30% early-bird applies only to a student who claimed it with this account's email.
    const claim = await findActiveClaim(user.email, course.slug);
    const discountPercent = claim?.percent ?? 0;
    const amount = (discountPercent ? discountedRupees(course.price, discountPercent) : course.price) * 100;
    const order = await createRazorpayOrder(amount, `cmw_${Date.now()}`, {
      userId: user.id,
      courseId: course.id,
    });

    await prisma.payment.create({
      data: {
        userId: user.id,
        courseId: course.id,
        amount,
        razorpayOrderId: order.id,
        discountPercent,
        discountClaimId: claim?.id ?? null,
      },
    });

    return NextResponse.json({
      keyId: getRazorpayKeyId(),
      orderId: order.id,
      amount,
      currency: order.currency,
      courseTitle: course.title,
      prefill: { name: user.name, email: user.email, contact: user.phone ?? '' },
    });
  } catch (e) {
    console.error('[api/payments/create-order]', e);
    return NextResponse.json({ error: 'Could not start payment. Please try again.' }, { status: 500 });
  }
}
