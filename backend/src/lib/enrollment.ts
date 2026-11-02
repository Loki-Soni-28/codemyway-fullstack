import { prisma } from './db';

// Marks a payment as paid and enrols the student. Safe to call repeatedly (browser verify
// and webhook both call it): only the first call changes anything.
export async function fulfillPayment(razorpayOrderId: string, razorpayPaymentId: string) {
  return prisma.$transaction(async (tx) => {
    const claimed = await tx.payment.updateMany({
      where: { razorpayOrderId, status: { not: 'PAID' } },
      data: { status: 'PAID', razorpayPaymentId, paidAt: new Date() },
    });

    const payment = await tx.payment.findUnique({ where: { razorpayOrderId } });
    if (!payment || claimed.count === 0) return payment;

    const [batch, mentor, existing, course] = await Promise.all([
      tx.batch.findFirst({ where: { courseId: payment.courseId }, orderBy: { createdAt: 'asc' } }),
      tx.user.findFirst({ where: { role: 'MENTOR' } }),
      tx.studentProfile.findUnique({ where: { userId: payment.userId } }),
      tx.course.findUnique({ where: { id: payment.courseId } }),
    ]);

    await tx.studentProfile.upsert({
      where: { userId: payment.userId },
      create: {
        userId: payment.userId,
        courseId: payment.courseId,
        batchId: batch?.id ?? null,
        mentorId: mentor?.id ?? null,
      },
      update: {
        courseId: payment.courseId,
        batchId: batch?.id ?? null,
        mentorId: existing?.mentorId ?? mentor?.id ?? null,
        status: 'ACTIVE',
      },
    });

    if (payment.discountClaimId) {
      await tx.discountClaim.updateMany({
        where: { id: payment.discountClaimId, redeemedAt: null },
        data: { redeemedAt: new Date() },
      });
    }

    await tx.notification.create({
      data: {
        userId: payment.userId,
        message: `Payment received. You are enrolled in ${course?.title ?? 'your course'}.`,
      },
    });

    return payment;
  });
}
