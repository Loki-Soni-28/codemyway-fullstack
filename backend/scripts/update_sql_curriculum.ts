import { prisma } from '../src/lib/db';

export const SQL_MODULE_CLASSES = [
  {
    id: 'c1100001-0000-4000-8000-000000000001',
    title: 'Class 01: Database Fundamentals & BigQuery Setup',
    weekNumber: 1,
    order: 1,
    date: '2026-09-01',
    startTime: '19:00',
    endTime: '20:30',
    topicHeadlines: [
      'Introduction to Databases and DBMS',
      'RDBMS and Database vs Data Warehouse',
      'Database Schema and ER Diagrams',
      'Data Types and Database Keys',
      'BigQuery Setup'
    ]
  },
  {
    id: 'c1100001-0000-4000-8000-000000000002',
    title: 'Class 02: SQL Basics & Data Extraction',
    weekNumber: 1,
    order: 2,
    date: '2026-09-03',
    startTime: '19:00',
    endTime: '20:30',
    topicHeadlines: [
      'SELECT and FROM',
      'DISTINCT',
      'Aliases',
      'ORDER BY',
      'LIMIT and OFFSET',
      'Inline Calculations',
      'Basic SQL Queries'
    ]
  },
  {
    id: 'c1100001-0000-4000-8000-000000000003',
    title: 'Class 03: Filtering & Conditional Logic',
    weekNumber: 1,
    order: 3,
    date: '2026-09-05',
    startTime: '19:00',
    endTime: '20:30',
    topicHeadlines: [
      'WHERE Clause',
      'AND, OR and NOT',
      'Comparison Operators',
      'BETWEEN, IN and LIKE',
      'NULL vs Blank',
      'IS NULL and IS NOT NULL',
      'CASE and IF',
      'DISTINCT and Filtering Practice'
    ]
  },
  {
    id: 'c1100001-0000-4000-8000-000000000004',
    title: 'Class 04: SQL Functions & Data Aggregation',
    weekNumber: 2,
    order: 4,
    date: '2026-09-08',
    startTime: '19:00',
    endTime: '20:30',
    topicHeadlines: [
      'String Functions',
      'Numeric Functions',
      'Date and Time Functions',
      'ROUND',
      'COUNT, SUM and AVG',
      'MIN and MAX',
      'COUNT Variations'
    ]
  },
  {
    id: 'c1100001-0000-4000-8000-000000000005',
    title: 'Class 05: GROUP BY, HAVING & Query Execution',
    weekNumber: 2,
    order: 5,
    date: '2026-09-10',
    startTime: '19:00',
    endTime: '20:30',
    topicHeadlines: [
      'GROUP BY',
      'HAVING',
      'WHERE vs HAVING',
      'Aggregate Analysis',
      'SQL Query Execution Order',
      'Grouped Business Analysis'
    ]
  },
  {
    id: 'c1100001-0000-4000-8000-000000000006',
    title: 'Class 06: SQL Joins & Multi-Table Analysis',
    weekNumber: 2,
    order: 6,
    date: '2026-09-12',
    startTime: '19:00',
    endTime: '20:30',
    topicHeadlines: [
      'INNER JOIN',
      'LEFT JOIN',
      'RIGHT JOIN',
      'FULL OUTER JOIN',
      'SELF JOIN',
      'CROSS JOIN',
      'NON-EQUI JOIN',
      'Joining Multiple Tables',
      'UNION and UNION ALL'
    ]
  },
  {
    id: 'c1100001-0000-4000-8000-000000000007',
    title: 'Class 07: Advanced SQL – Subqueries, CTEs, Views & Window Functions',
    weekNumber: 3,
    order: 7,
    date: '2026-09-15',
    startTime: '19:00',
    endTime: '20:30',
    topicHeadlines: [
      'Subqueries and Nested Queries',
      'Derived Tables',
      'CTEs',
      'Views',
      'Window Functions',
      'OVER and PARTITION BY',
      'ROW_NUMBER, RANK and DENSE_RANK',
      'NTILE',
      'LEAD and LAG',
      'Running and Moving Calculations',
      'Window Frames: ROWS and RANGE',
      'FIRST_VALUE, LAST_VALUE and NTH_VALUE'
    ]
  },
  {
    id: 'c1100001-0000-4000-8000-000000000008',
    title: 'Class 08: SQL Minor Project + GenAI',
    weekNumber: 3,
    order: 8,
    isMinorProject: true,
    isGenAI: true,
    date: '2026-09-17',
    startTime: '19:00',
    endTime: '20:30',
    topicHeadlines: [
      'Business Problem Understanding',
      'Dataset Exploration',
      'SQL-Based Data Analysis',
      'Business Insights',
      'Recommendations',
      'GenAI-Assisted SQL Workflow',
      'Project Presentation'
    ]
  }
];

async function applySqlCurriculumUpdate() {
  console.log('--- Applying Module 1 (SQL) 3-Week / 8-Class Curriculum Update ---');

  // 1. Locate Course: Data Analyst with Gen AI
  const course = await prisma.course.findFirst({
    where: {
      OR: [
        { slug: 'data-analyst-with-gen-ai' },
        { title: { contains: 'Data Analyst' } }
      ]
    },
    include: {
      batches: true,
      modules: { orderBy: { order: 'asc' } }
    }
  });

  if (!course) {
    throw new Error('Course "Data Analyst with Gen AI" not found in database.');
  }

  const batch = course.batches[0];
  if (!batch) {
    throw new Error(`Batch for course "${course.title}" not found.`);
  }

  const instructor = await prisma.user.findFirst({
    where: { role: 'INSTRUCTOR' }
  });
  if (!instructor) {
    throw new Error('No instructor user found in database.');
  }

  console.log(`Target Course: ${course.title} (${course.id})`);
  console.log(`Target Batch: ${batch.name} (${batch.id})`);
  console.log(`Assigned Instructor: ${instructor.name} (${instructor.id})`);

  // 2. Locate or Upsert Module 1 as "SQL"
  let sqlModule = course.modules.find(m => m.order === 1);
  if (sqlModule) {
    sqlModule = await prisma.module.update({
      where: { id: sqlModule.id },
      data: {
        title: 'SQL',
        order: 1
      }
    });
    console.log(`Updated Module 1 title to "SQL" (id: ${sqlModule.id})`);
  } else {
    sqlModule = await prisma.module.create({
      data: {
        title: 'SQL',
        order: 1,
        courseId: course.id
      }
    });
    console.log(`Created Module 1 as "SQL" (id: ${sqlModule.id})`);
  }

  // 3. Upsert the 8 Classes deterministically
  for (const item of SQL_MODULE_CLASSES) {
    const preReadPayload = JSON.stringify({
      weekNumber: item.weekNumber,
      order: item.order,
      isMinorProject: !!item.isMinorProject,
      isGenAI: !!item.isGenAI,
      topicHeadlines: item.topicHeadlines,
      objectives: item.topicHeadlines
    });

    const cls = await prisma.class.upsert({
      where: { id: item.id },
      update: {
        title: item.title,
        moduleId: sqlModule.id,
        batchId: batch.id,
        instructorId: instructor.id,
        date: item.date,
        startTime: item.startTime,
        endTime: item.endTime,
        zoomLink: 'https://meet.google.com/cmw-sql-live',
        preRead: preReadPayload,
        description: `Week ${item.weekNumber} · Class 0${item.order} of Module 1: SQL.`
      },
      create: {
        id: item.id,
        title: item.title,
        moduleId: sqlModule.id,
        batchId: batch.id,
        instructorId: instructor.id,
        date: item.date,
        startTime: item.startTime,
        endTime: item.endTime,
        zoomLink: 'https://meet.google.com/cmw-sql-live',
        status: item.order <= 2 ? 'COMPLETED' : item.order === 3 ? 'UPCOMING' : 'UPCOMING',
        preRead: preReadPayload,
        description: `Week ${item.weekNumber} · Class 0${item.order} of Module 1: SQL.`
      }
    });

    console.log(`  [Week ${item.weekNumber}] ${cls.title} (id: ${cls.id}) -> Synced`);
  }

  // 4. Update CourseLesson records for this module
  await prisma.courseLesson.deleteMany({ where: { moduleId: sqlModule.id } });
  for (let i = 0; i < SQL_MODULE_CLASSES.length; i++) {
    const item = SQL_MODULE_CLASSES[i];
    await prisma.courseLesson.create({
      data: {
        moduleId: sqlModule.id,
        title: item.title,
        order: item.order,
        description: item.topicHeadlines.join(', ')
      }
    });
  }

  console.log(`Synchronized ${SQL_MODULE_CLASSES.length} CourseLesson records.`);
  console.log('--- Curriculum Update Completed Successfully ---');
}

applySqlCurriculumUpdate()
  .catch((err) => {
    console.error('Migration script error:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
