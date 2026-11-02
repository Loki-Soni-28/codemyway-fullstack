import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  const user = await getSessionUser();
  if (!user || (user.role !== 'STUDENT' && user.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const profile = user.studentProfile;
  if (!profile || !profile.courseId) {
    return NextResponse.json({ error: 'No active enrolled course found' }, { status: 403 });
  }

  try {
    // 1. Fetch all projects assigned to this student's enrolled course
    const projects = await prisma.courseProject.findMany({
      where: { courseId: profile.courseId },
      include: {
        submissions: {
          where: { studentId: user.id },
          include: {
            review: {
              include: {
                reviewer: {
                  select: {
                    id: true,
                    name: true,
                    role: true,
                    avatarUrl: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    // 2. Format projects with the student's submission status and review feedback
    const formattedProjects = projects.map(p => {
      const submission = p.submissions[0] || null;
      let reviewData = null;
      if (submission && submission.review) {
        const rev = submission.review;
        reviewData = {
          reviewerName: rev.reviewer.name,
          reviewerRole: rev.reviewer.role,
          reviewerAvatar: rev.reviewer.avatarUrl,
          reviewDate: rev.reviewedAt.toISOString(),
          overallScore: rev.overallScore,
          maxScore: rev.maxScore,
          writtenFeedback: rev.writtenFeedback,
          criteriaBreakdown: rev.criteriaBreakdown ? JSON.parse(rev.criteriaBreakdown) : [],
          strengths: rev.strengths ? JSON.parse(rev.strengths) : [],
          improvementAreas: rev.improvementAreas ? JSON.parse(rev.improvementAreas) : [],
          revisionInstructions: rev.revisionInstructions || undefined,
          status: rev.status
        };
      }

      const files = submission?.files ? JSON.parse(submission.files) : [];

      return {
        id: p.id,
        courseId: p.courseId,
        title: p.title,
        problemStatement: p.problemStatement,
        technologies: p.technologies ? p.technologies.split(',').map((s: string) => s.trim()) : [],
        skillsCovered: p.skillsCovered ? p.skillsCovered.split(',').map((s: string) => s.trim()) : [],
        difficulty: p.difficulty,
        outcome: p.outcome,
        type: p.type || 'minor',
        resources: p.resources ? JSON.parse(p.resources) : [],
        submission: submission ? {
          id: submission.id,
          version: submission.version,
          projectDescription: submission.projectDescription,
          githubRepoUrl: submission.githubRepoUrl,
          liveDashboardUrl: submission.liveDashboardUrl,
          demoVideoUrl: submission.demoVideoUrl,
          files,
          status: submission.status,
          submittedAt: submission.submittedAt.toISOString(),
          review: reviewData
        } : null
      };
    });

    return NextResponse.json({
      success: true,
      projects: formattedProjects
    });

  } catch (error: any) {
    console.error('Fetch student projects API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
