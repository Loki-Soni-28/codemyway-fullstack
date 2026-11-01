import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { validateSessionCollisions, validateTeacherCapacity } from '@/lib/checkInValidation';

interface RouteContext {
  params: Promise<{ checkInId: string }>;
}

export async function POST(req: NextRequest, context: RouteContext) {
  const user = await getSessionUser();
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 401 });
  }

  const { checkInId } = await context.params;

  try {
    const body = await req.json();
    const { allocations } = body;

    if (!Array.isArray(allocations) || allocations.length === 0) {
      return NextResponse.json(
        { error: 'allocations must be a non-empty array of { studentId, teacherId, scheduledStartAt?, scheduledEndAt?, meetingUrl? }' },
        { status: 400 }
      );
    }

    const checkIn = await prisma.weeklyCheckIn.findUnique({
      where: { id: checkInId },
      include: { batch: true },
    });

    if (!checkIn) {
      return NextResponse.json({ error: 'Weekly check-in not found' }, { status: 404 });
    }

    if (checkIn.status === 'COMPLETED' || checkIn.status === 'SKIPPED') {
      return NextResponse.json(
        { error: `Cannot allocate students to a ${checkIn.status} check-in.` },
        { status: 400 }
      );
    }

    // Reject duplicate student IDs within the payload
    const studentIds = allocations.map((a: any) => a.studentId);
    if (new Set(studentIds).size !== studentIds.length) {
      return NextResponse.json(
        { error: 'Duplicate student IDs found within allocation payload.' },
        { status: 400 }
      );
    }

    // 1. Verify all students belong to this batch with ACTIVE enrollment
    const studentProfiles = await prisma.studentProfile.findMany({
      where: {
        userId: { in: studentIds },
        batchId: checkIn.batchId,
        status: 'ACTIVE',
      },
      select: { userId: true },
    });

    if (studentProfiles.length !== studentIds.length) {
      const validIds = new Set(studentProfiles.map((p) => p.userId));
      const invalid = studentIds.filter((id: string) => !validIds.has(id));
      return NextResponse.json(
        { error: `The following students are not active in batch ${checkIn.batch.name}: ${invalid.join(', ')}` },
        { status: 400 }
      );
    }

    // 2. Verify all teachers are active BatchTeachers for this batch
    const teacherIds = Array.from(new Set(allocations.map((a: any) => a.teacherId)));
    const activeBatchTeachers = await prisma.batchTeacher.findMany({
      where: {
        batchId: checkIn.batchId,
        teacherId: { in: teacherIds },
        isActive: true,
      },
      select: { teacherId: true },
    });

    if (activeBatchTeachers.length !== teacherIds.length) {
      const validTeacherIds = new Set(activeBatchTeachers.map((bt) => bt.teacherId));
      const invalid = teacherIds.filter((id) => !validTeacherIds.has(id));
      return NextResponse.json(
        { error: `The following teachers are not eligible BatchTeachers for batch ${checkIn.batch.name}: ${invalid.join(', ')}` },
        { status: 400 }
      );
    }

    // 3. Prevent modifying existing assignments with published feedback
    const existingAssignments = await prisma.weeklyCheckInStudent.findMany({
      where: {
        checkInId,
        studentId: { in: studentIds },
      },
      include: { feedback: true },
    });

    for (const ea of existingAssignments) {
      if (ea.feedback && ea.feedback.status === 'PUBLISHED') {
        return NextResponse.json(
          { error: `Assignment for student ${ea.studentId} already has PUBLISHED feedback and cannot be reallocated or modified.` },
          { status: 400 }
        );
      }
      if (ea.status === 'COMPLETED' || ea.status === 'MISSED') {
        return NextResponse.json(
          { error: `Assignment for student ${ea.studentId} is already ${ea.status} and cannot be modified.` },
          { status: 400 }
        );
      }
    }

    // 4. Concurrency check: Lock involved user rows in deterministic order inside transaction
    const allInvolvedUserIds = Array.from(new Set([...studentIds, ...teacherIds])).sort();

    const result = await prisma.$transaction(async (tx) => {
      // Deterministic user row locking to prevent race conditions & deadlocks
      if (allInvolvedUserIds.length > 0) {
        await tx.$queryRaw`
          SELECT "id" FROM "User"
          WHERE "id" = ANY(${allInvolvedUserIds}::text[])
          ORDER BY "id" ASC
          FOR UPDATE
        `;
      }

      // Check teacher capacity (max 5 students per check-in)
      const teacherCounts: Record<string, number> = {};
      for (const a of allocations) {
        // Only count as adding if student is not already assigned to this teacher in this checkIn
        const existing = existingAssignments.find((ea) => ea.studentId === a.studentId);
        if (!existing || existing.teacherId !== a.teacherId) {
          teacherCounts[a.teacherId] = (teacherCounts[a.teacherId] || 0) + 1;
        }
      }

      for (const [tid, count] of Object.entries(teacherCounts)) {
        const currentCount = await tx.weeklyCheckInStudent.count({
          where: { checkInId, teacherId: tid },
        });
        if (currentCount + count > 5) {
          throw new Error(`Teacher ${tid} would exceed maximum capacity of 5 students (current: ${currentCount}, adding: ${count})`);
        }
      }

      // Validate session collisions if scheduling timestamps provided
      const proposedSessions = allocations
        .filter((a: any) => a.scheduledStartAt && a.scheduledEndAt)
        .map((a: any) => {
          const existing = existingAssignments.find((ea) => ea.studentId === a.studentId);
          return {
            assignmentId: existing?.id,
            teacherId: a.teacherId,
            studentId: a.studentId,
            scheduledStartAt: new Date(a.scheduledStartAt),
            scheduledEndAt: new Date(a.scheduledEndAt),
          };
        });

      if (proposedSessions.length > 0) {
        const collisionResult = await validateSessionCollisions(proposedSessions, tx);
        if (collisionResult.hasCollision) {
          throw new Error(collisionResult.reason || 'Scheduling collision detected');
        }
      }

      // Upsert allocations preserving existing schedules if optional fields omitted
      const createdOrUpdated = [];
      for (const a of allocations) {
        const existing = existingAssignments.find((ea) => ea.studentId === a.studentId);

        const scheduledStartAt = a.scheduledStartAt !== undefined
          ? (a.scheduledStartAt ? new Date(a.scheduledStartAt) : null)
          : existing?.scheduledStartAt;

        const scheduledEndAt = a.scheduledEndAt !== undefined
          ? (a.scheduledEndAt ? new Date(a.scheduledEndAt) : null)
          : existing?.scheduledEndAt;

        const meetingUrl = a.meetingUrl !== undefined ? a.meetingUrl : existing?.meetingUrl;

        let status = existing ? existing.status : 'ASSIGNED';
        if (scheduledStartAt && scheduledEndAt) {
          if (status === 'ASSIGNED') status = 'SCHEDULED';
        }

        const res = await tx.weeklyCheckInStudent.upsert({
          where: {
            checkInId_studentId: { checkInId, studentId: a.studentId },
          },
          create: {
            checkInId,
            studentId: a.studentId,
            teacherId: a.teacherId,
            status,
            scheduledStartAt,
            scheduledEndAt,
            meetingUrl,
          },
          update: {
            teacherId: a.teacherId,
            status,
            scheduledStartAt,
            scheduledEndAt,
            meetingUrl,
          },
        });

        createdOrUpdated.push(res);
      }

      // Create audit log entry
      await tx.weeklyCheckInAuditLog.create({
        data: {
          checkInId,
          actorId: user.id,
          action: 'STUDENTS_ALLOCATED',
          metadata: {
            allocatedCount: allocations.length,
            studentIds,
          },
        },
      });

      return createdOrUpdated;
    });

    return NextResponse.json({ success: true, assignments: result });
  } catch (error: any) {
    console.error('Error allocating check-in students:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 400 });
  }
}
