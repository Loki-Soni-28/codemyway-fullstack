import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { discountedRupees, findActiveClaim } from '@/lib/discount';

// What this logged-in student would pay for a course, including any discount they claimed.
export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Please log in to enrol.' }, { status: 401 });
    }

    const slug = req.nextUrl.searchParams.get('courseSlug');
    const course = slug ? await prisma.course.findFirst({ where: { slug, published: true } }) : null;
    if (!course || course.price <= 0) {
      return NextResponse.json({ error: 'This course is not available for purchase.' }, { status: 404 });
    }

    const claim = await findActiveClaim(user.email, course.slug);
    const discountPercent = claim?.percent ?? 0;
    return NextResponse.json({
      title: course.title,
      price: course.price,
      priceOriginal: course.priceOriginal,
      discountPercent,
      finalPrice: discountPercent ? discountedRupees(course.price, discountPercent) : course.price,
    });
  } catch (e) {
    console.error('[api/payments/quote]', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
