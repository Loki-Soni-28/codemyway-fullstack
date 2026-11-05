import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

async function requireAdmin() {
  const user = await getSessionUser();
  if (!user || user.role !== 'ADMIN') {
    return null;
  }
  return user;
}

export async function GET(req: NextRequest) {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const courseSlug = searchParams.get('courseSlug') || 'data-analyst-with-gen-ai';

  try {
    const course = await prisma.course.findFirst({
      where: {
        OR: [
          { slug: courseSlug },
          { title: { contains: 'Data Analyst' } }
        ]
      },
      include: {
        batches: true,
        modules: {
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const batch = course.batches[0];
    const sqlModule = course.modules.find(m => m.order === 1) || course.modules[0];

    if (!sqlModule) {
      return NextResponse.json({ error: 'SQL Module not found' }, { status: 404 });
    }

    const classes = await prisma.class.findMany({
      where: {
        moduleId: sqlModule.id,
        ...(batch ? { batchId: batch.id } : {})
      },
      include: {
        instructor: { select: { id: true, name: true, email: true } },
        attendance: { select: { id: true } },
        assignments: { select: { id: true } }
      }
    });

    const formattedClasses = classes.map((cls) => {
      let parsedPreRead: any = null;
      try {
        if (cls.preRead) parsedPreRead = JSON.parse(cls.preRead);
      } catch {
        parsedPreRead = null;
      }

      const weekNumber = parsedPreRead?.weekNumber ?? (cls.title.includes('Week 2') || cls.title.includes('Class 04') || cls.title.includes('Class 05') || cls.title.includes('Class 06') ? 2 : (cls.title.includes('Week 3') || cls.title.includes('Class 07') || cls.title.includes('Class 08') ? 3 : 1));
      const order = parsedPreRead?.order ?? parseInt(cls.title.match(/Class 0?(\d+)/i)?.[1] || '1', 10);
      const topicHeadlines = parsedPreRead?.topicHeadlines || parsedPreRead?.objectives || [];
      const isMinorProject = !!(parsedPreRead?.isMinorProject || cls.title.toLowerCase().includes('minor project'));
      const isGenAI = !!(parsedPreRead?.isGenAI || cls.title.toLowerCase().includes('genai'));

      return {
        id: cls.id,
        title: cls.title,
        description: cls.description,
        weekNumber,
        order,
        topicHeadlines,
        isMinorProject,
        isGenAI,
        date: cls.date,
        startTime: cls.startTime,
        endTime: cls.endTime,
        zoomLink: cls.zoomLink,
        status: cls.status,
        instructor: cls.instructor,
        hasAttendanceRecords: cls.attendance.length > 0,
        hasAssignments: cls.assignments.length > 0
      };
    });

    formattedClasses.sort((a, b) => (a.order || 0) - (b.order || 0));

    // Grouping by weeks for easy admin consumption
    const weeksMap: Record<number, typeof formattedClasses> = {};
    for (const c of formattedClasses) {
      if (!weeksMap[c.weekNumber]) weeksMap[c.weekNumber] = [];
      weeksMap[c.weekNumber].push(c);
    }

    return NextResponse.json({
      success: true,
      course: {
        id: course.id,
        title: course.title,
        slug: course.slug
      },
      batch: batch ? {
        id: batch.id,
        name: batch.name
      } : null,
      module: {
        id: sqlModule.id,
        title: sqlModule.title,
        order: sqlModule.order,
        durationWeeks: '3 Weeks',
        totalClasses: formattedClasses.length,
        classes: formattedClasses,
        weeks: [1, 2, 3].map(wNum => ({
          weekNumber: wNum,
          weekTitle: wNum === 1 ? 'Week 1 — SQL Foundations' : wNum === 2 ? 'Week 2 — Data Analysis with SQL' : 'Week 3 — Advanced SQL & Minor Project',
          classes: weeksMap[wNum] || []
        }))
      }
    });

  } catch (error: any) {
    console.error('Admin curriculum query error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { moduleId, moduleTitle, classes } = body;

    if (!moduleId) {
      return NextResponse.json({ error: 'moduleId is required' }, { status: 400 });
    }

    if (!Array.isArray(classes)) {
      return NextResponse.json({ error: 'classes must be an array' }, { status: 400 });
    }

    // 1. Validation: Validate every class title and week
    const orders: number[] = [];
    const ids: string[] = [];

    for (let i = 0; i < classes.length; i++) {
      const c = classes[i];
      if (!c.id) {
        return NextResponse.json({ error: `Class at index ${i} is missing an ID` }, { status: 400 });
      }
      if (!c.title || !c.title.trim()) {
        return NextResponse.json({ error: `Class ${i + 1} title cannot be empty` }, { status: 400 });
      }
      const weekNum = parseInt(c.weekNumber, 10);
      if (isNaN(weekNum) || weekNum < 1 || weekNum > 12) {
        return NextResponse.json({ error: `Class "${c.title}" has an invalid week number (${c.weekNumber}). Must be between 1 and 12.` }, { status: 400 });
      }
      const orderNum = parseInt(c.order, 10);
      if (isNaN(orderNum) || orderNum < 1) {
        return NextResponse.json({ error: `Class "${c.title}" has an invalid order number (${c.order}). Must be >= 1.` }, { status: 400 });
      }

      orders.push(orderNum);
      ids.push(c.id);
    }

    // 2. Validation: No duplicate order numbers
    if (new Set(orders).size !== orders.length) {
      return NextResponse.json({ error: 'Duplicate class order detected within the module. Every class must have a unique order.' }, { status: 400 });
    }

    // 3. Validation: No duplicate IDs
    if (new Set(ids).size !== ids.length) {
      return NextResponse.json({ error: 'Duplicate class IDs detected in payload.' }, { status: 400 });
    }

    // 4. Persistence Transaction
    await prisma.$transaction(async (tx) => {
      // Optional: Update module title
      if (moduleTitle && moduleTitle.trim()) {
        await tx.module.update({
          where: { id: moduleId },
          data: { title: moduleTitle.trim() }
        });
      }

      // Update each class
      for (const c of classes) {
        const existing = await tx.class.findUnique({
          where: { id: c.id }
        });

        if (!existing) {
          throw new Error(`Class with ID "${c.id}" not found.`);
        }

        let existingPreRead: any = {};
        try {
          if (existing.preRead) existingPreRead = JSON.parse(existing.preRead);
        } catch {
          existingPreRead = {};
        }

        const isMinorProject = c.isMinorProject ?? (c.order === 8 || c.title.toLowerCase().includes('minor project'));
        const isGenAI = c.isGenAI ?? (c.order === 8 || c.title.toLowerCase().includes('genai'));
        const cleanHeadlines = Array.isArray(c.topicHeadlines)
          ? c.topicHeadlines.map((h: any) => String(h).trim()).filter(Boolean)
          : [];

        const updatedPreRead = {
          ...existingPreRead,
          weekNumber: parseInt(c.weekNumber, 10),
          order: parseInt(c.order, 10),
          isMinorProject,
          isGenAI,
          badge: isMinorProject ? 'Minor Project + GenAI' : undefined,
          topicHeadlines: cleanHeadlines,
          objectives: cleanHeadlines
        };

        await tx.class.update({
          where: { id: c.id },
          data: {
            title: c.title.trim(),
            description: c.description !== undefined ? c.description : existing.description,
            preRead: JSON.stringify(updatedPreRead)
          }
        });
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Curriculum classes and topic headlines updated successfully in database.'
    });

  } catch (error: any) {
    console.error('Admin curriculum update error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update curriculum' }, { status: 500 });
  }
}
