import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET: Instructor or Mentor views submitted projects within their authorized scope
export async function GET(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || (user.role !== 'INSTRUCTOR' && user.role !== 'MENTOR' && user.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Unauthorized: Faculty or Mentor role required' }, { status: 401 });
  }

  try {
    let studentIds: string[] = [];

    if (user.role === 'ADMIN') {
      // Admin can view all student submissions
      const allStudents = await prisma.user.findMany({ where: { role: 'STUDENT' }, select: { id: true } });
      studentIds = allStudents.map(s => s.id);
    } else if (user.role === 'MENTOR') {
      // Mentor can only review students assigned to them
      const assignedProfiles = await prisma.studentProfile.findMany({
        where: { mentorId: user.id },
        select: { userId: true }
      });
      studentIds = assignedProfiles.map(p => p.userId);
    } else if (user.role === 'INSTRUCTOR') {
      // Instructor can review students in batches they teach
      const instructorClasses = await prisma.class.findMany({
        where: { instructorId: user.id },
        select: { batchId: true }
      });
      const batchIds = Array.from(new Set(instructorClasses.map(c => c.batchId)));
      const batchStudents = await prisma.studentProfile.findMany({
        where: { batchId: { in: batchIds } },
        select: { userId: true }
      });
      studentIds = batchStudents.map(p => p.userId);
    }

    const submissions = await prisma.projectSubmission.findMany({
      where: {
        studentId: { in: studentIds }
      },
      include: {
        project: {
          include: {
            course: {
              select: { title: true }
            }
          }
        },
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true
          }
        },
        review: {
          include: {
            reviewer: {
              select: { id: true, name: true, role: true }
            }
          }
        }
      },
      orderBy: { submittedAt: 'desc' }
    });

    const formatted = submissions.map(sub => ({
      id: sub.id,
      projectId: sub.projectId,
      projectTitle: sub.project.title,
      courseTitle: sub.project.course.title,
      difficulty: sub.project.difficulty,
      student: {
        id: sub.student.id,
        name: sub.student.name,
        email: sub.student.email
      },
      version: sub.version,
      projectDescription: sub.projectDescription,
      githubRepoUrl: sub.githubRepoUrl,
      liveDashboardUrl: sub.liveDashboardUrl,
      demoVideoUrl: sub.demoVideoUrl,
      files: sub.files ? JSON.parse(sub.files) : [],
      status: sub.status,
      submittedAt: sub.submittedAt.toISOString(),
      review: sub.review ? {
        id: sub.review.id,
        overallScore: sub.review.overallScore,
        maxScore: sub.review.maxScore,
        writtenFeedback: sub.review.writtenFeedback,
        status: sub.review.status,
        reviewedAt: sub.review.reviewedAt.toISOString(),
        reviewerName: sub.review.reviewer.name
      } : null
    }));

    return NextResponse.json({
      success: true,
      submissions: formatted
    });

  } catch (error: any) {
    console.error('Faculty fetch submissions error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Instructor or Mentor reviews a specific submission
export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || (user.role !== 'INSTRUCTOR' && user.role !== 'MENTOR' && user.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Unauthorized: Faculty or Mentor role required' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      submissionId,
      status, // "Under Review", "Revision Required", "Approved"
      overallScore,
      writtenFeedback,
      criteriaBreakdown,
      strengths,
      improvementAreas,
      revisionInstructions
    } = body;

    if (!submissionId) {
      return NextResponse.json({ error: 'Submission ID is required' }, { status: 400 });
    }

    const validStatuses = ['Under Review', 'Revision Required', 'Approved'];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json({ error: `Status must be one of: ${validStatuses.join(', ')}` }, { status: 400 });
    }

    if (!writtenFeedback || !writtenFeedback.trim()) {
      return NextResponse.json({ error: 'Written feedback is required' }, { status: 400 });
    }

    // Verify submission exists
    const submission = await prisma.projectSubmission.findUnique({
      where: { id: submissionId },
      include: {
        student: {
          include: {
            studentProfile: true
          }
        },
        project: true
      }
    });

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    // Scope check: Verify that this instructor/mentor is authorized for this student
    if (user.role === 'MENTOR') {
      if (submission.student.studentProfile?.mentorId !== user.id) {
        return NextResponse.json({ error: 'Forbidden: You are not assigned as mentor for this student' }, { status: 403 });
      }
    } else if (user.role === 'INSTRUCTOR') {
      const studentBatchId = submission.student.studentProfile?.batchId;
      if (!studentBatchId) {
        return NextResponse.json({ error: 'Forbidden: Student has no active batch assigned' }, { status: 403 });
      }
      const teachesBatch = await prisma.class.findFirst({
        where: {
          instructorId: user.id,
          batchId: studentBatchId
        }
      });
      if (!teachesBatch) {
        return NextResponse.json({ error: 'Forbidden: You do not instruct this student’s cohort' }, { status: 403 });
      }
    }

    // Create or update Review
    const criteriaJson = criteriaBreakdown ? JSON.stringify(criteriaBreakdown) : null;
    const strengthsJson = strengths ? JSON.stringify(strengths) : null;
    const improvementsJson = improvementAreas ? JSON.stringify(improvementAreas) : null;

    const review = await prisma.projectReview.upsert({
      where: { submissionId: submission.id },
      create: {
        submissionId: submission.id,
        reviewerId: user.id,
        status,
        overallScore: typeof overallScore === 'number' ? overallScore : null,
        maxScore: 100,
        writtenFeedback: writtenFeedback.trim(),
        criteriaBreakdown: criteriaJson,
        strengths: strengthsJson,
        improvementAreas: improvementsJson,
        revisionInstructions: revisionInstructions?.trim() || null
      },
      update: {
        reviewerId: user.id,
        status,
        overallScore: typeof overallScore === 'number' ? overallScore : null,
        writtenFeedback: writtenFeedback.trim(),
        criteriaBreakdown: criteriaJson,
        strengths: strengthsJson,
        improvementAreas: improvementsJson,
        revisionInstructions: revisionInstructions?.trim() || null,
        reviewedAt: new Date()
      }
    });

    // Update submission status to reflect the review
    await prisma.projectSubmission.update({
      where: { id: submission.id },
      data: { status }
    });

    // Notify Student
    await prisma.notification.create({
      data: {
        userId: submission.studentId,
        message: `Your project "${submission.project.title}" has been reviewed by ${user.name}: Status is now "${status}".`,
        isRead: false
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Review saved and student notified',
      review: {
        id: review.id,
        status: review.status,
        overallScore: review.overallScore,
        writtenFeedback: review.writtenFeedback,
        reviewedAt: review.reviewedAt.toISOString()
      }
    });

  } catch (error: any) {
    console.error('Faculty review save error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
