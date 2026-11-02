// Creates (or updates) a test account that is already enrolled in the Data Analyst course,
// for trying the student portal and dashboard without paying.
//
//   npx tsx prisma/create-test-admin.ts <email> "<Full Name>" [ADMIN|STUDENT]   (default ADMIN)
//
// Sign in with Google using the same email. Remove these accounts, or demote any ADMIN,
// before go-live.
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

const prisma = new PrismaClient();
const COURSE_SLUG = 'data-analyst-with-gen-ai';

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();
  const name = process.argv[3]?.trim() || email?.split('@')[0];
  const role = (process.argv[4] ?? 'ADMIN').toUpperCase();
  if (role !== 'ADMIN' && role !== 'STUDENT') throw new Error('Role must be ADMIN or STUDENT');
  if (!email || !email.includes('@')) {
    throw new Error('Usage: npx tsx prisma/create-test-admin.ts <email> "<Full Name>" [ADMIN|STUDENT]');
  }

  const course = await prisma.course.findUnique({ where: { slug: COURSE_SLUG } });
  if (!course) throw new Error(`Course "${COURSE_SLUG}" not found. Run the seed first.`);

  const batch = await prisma.batch.findFirst({ where: { courseId: course.id }, orderBy: { createdAt: 'asc' } });
  const mentor = await prisma.user.findFirst({ where: { role: 'MENTOR' } });

  const user = await prisma.user.upsert({
    where: { email },
    update: { role },
    create: {
      email,
      name: name!,
      role,
      // Sign-in is through Google, so the password is random and never shown.
      passwordHash: await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 12),
    },
  });

  await prisma.studentProfile.upsert({
    where: { userId: user.id },
    update: { courseId: course.id, batchId: batch?.id ?? null, mentorId: mentor?.id ?? null, status: 'ACTIVE' },
    create: { userId: user.id, courseId: course.id, batchId: batch?.id ?? null, mentorId: mentor?.id ?? null },
  });

  console.log(`${email} is now ${role} and enrolled in ${course.title}${batch ? ` (${batch.name})` : ''}.`);
}

main()
  .catch((e) => {
    console.error(e.message ?? e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
