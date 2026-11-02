import { PrismaClient } from '../backend/node_modules/@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const courses = await prisma.course.findMany({
    include: {
      modules: {
        orderBy: { order: 'asc' },
        include: {
          classes: {
            orderBy: [{ date: 'asc' }, { startTime: 'asc' }]
          }
        }
      },
      batches: true
    }
  });

  console.log(`Found ${courses.length} courses:`);
  for (const c of courses) {
    console.log(`\nCOURSE: ${c.title} (slug: ${c.slug}, id: ${c.id})`);
    console.log(`Batches: ${c.batches.map(b => `${b.name} (${b.id})`).join(', ')}`);
    console.log(`Modules (${c.modules.length}):`);
    for (const m of c.modules) {
      console.log(`  - Module ${m.order}: ${m.title} (id: ${m.id}) -> ${m.classes.length} classes`);
      for (const cls of m.classes) {
        console.log(`      * Class: ${cls.title} (date: ${cls.date}, time: ${cls.startTime}, batchId: ${cls.batchId}, id: ${cls.id})`);
        console.log(`        preRead: ${cls.preRead?.slice(0, 100)}...`);
      }
    }
  }

  const attendanceCount = await prisma.attendance.count();
  const submissionCount = await prisma.submission.count();
  console.log(`\nExisting student records: ${attendanceCount} attendance, ${submissionCount} submissions.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
