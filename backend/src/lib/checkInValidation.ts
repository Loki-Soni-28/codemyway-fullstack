import { prisma } from './db';
import { Prisma } from '@prisma/client';

export interface CollisionCheckSession {
  assignmentId?: string;
  teacherId: string;
  studentId: string;
  scheduledStartAt: Date;
  scheduledEndAt: Date;
}

export interface CollisionCheckResult {
  hasCollision: boolean;
  reason?: string;
  conflictingAssignmentId?: string;
}

/**
 * Validates a list of proposed session times:
 * 1. Against each other within the same bulk payload.
 * 2. Against existing database sessions for both teacher and student (cross-checkIn and intra-checkIn).
 */
export async function validateSessionCollisions(
  proposed: CollisionCheckSession[],
  tx?: Prisma.TransactionClient
): Promise<CollisionCheckResult> {
  const db = tx || prisma;

  // 1. Check collisions within the proposed batch itself
  for (let i = 0; i < proposed.length; i++) {
    const a = proposed[i];
    if (a.scheduledStartAt >= a.scheduledEndAt) {
      return {
        hasCollision: true,
        reason: `Session start time must be before end time for student ${a.studentId}`,
      };
    }

    for (let j = i + 1; j < proposed.length; j++) {
      const b = proposed[j];
      const timeOverlaps = a.scheduledStartAt < b.scheduledEndAt && a.scheduledEndAt > b.scheduledStartAt;
      if (timeOverlaps) {
        if (a.teacherId === b.teacherId) {
          return {
            hasCollision: true,
            reason: `Teacher ${a.teacherId} has overlapping proposed sessions in the same request`,
          };
        }
        if (a.studentId === b.studentId) {
          return {
            hasCollision: true,
            reason: `Student ${a.studentId} has overlapping proposed sessions in the same request`,
          };
        }
      }
    }
  }

  // 2. Check each proposed session against active sessions in the database
  for (const session of proposed) {
    const excludeIds = session.assignmentId ? [session.assignmentId] : [];

    const existingConflict = await db.weeklyCheckInStudent.findFirst({
      where: {
        id: { notIn: excludeIds },
        status: { in: ['ASSIGNED', 'SCHEDULED', 'REVIEW_PENDING'] },
        scheduledStartAt: { not: null },
        scheduledEndAt: { not: null },
        OR: [{ teacherId: session.teacherId }, { studentId: session.studentId }],
        AND: [
          { scheduledStartAt: { lt: session.scheduledEndAt } },
          { scheduledEndAt: { gt: session.scheduledStartAt } },
        ],
      },
      select: {
        id: true,
        teacherId: true,
        studentId: true,
        scheduledStartAt: true,
        scheduledEndAt: true,
      },
    });

    if (existingConflict) {
      const isTeacher = existingConflict.teacherId === session.teacherId;
      return {
        hasCollision: true,
        reason: `${isTeacher ? 'Teacher' : 'Student'} has an existing overlapping session (${existingConflict.id}) between ${existingConflict.scheduledStartAt?.toISOString()} and ${existingConflict.scheduledEndAt?.toISOString()}`,
        conflictingAssignmentId: existingConflict.id,
      };
    }
  }

  return { hasCollision: false };
}

/**
 * Validates teacher capacity for a given checkIn:
 * Ensures no teacher exceeds 5 active students per weekly check-in.
 */
export async function validateTeacherCapacity(
  checkInId: string,
  teacherAllocations: Array<{ teacherId: string; studentCount: number }>,
  tx?: Prisma.TransactionClient
): Promise<{ valid: boolean; reason?: string }> {
  const db = tx || prisma;

  for (const alloc of teacherAllocations) {
    // Count currently assigned students in this checkIn
    const currentCount = await db.weeklyCheckInStudent.count({
      where: {
        checkInId,
        teacherId: alloc.teacherId,
      },
    });

    if (currentCount + alloc.studentCount > 5) {
      return {
        valid: false,
        reason: `Teacher ${alloc.teacherId} would exceed maximum capacity of 5 students (current: ${currentCount}, adding: ${alloc.studentCount})`,
      };
    }
  }

  return { valid: true };
}
