import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== 'STUDENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const profile = user.studentProfile;
  if (!profile || !profile.courseId) {
    return NextResponse.json({ error: 'No active cohort enrolled' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const {
      projectId,
      projectDescription,
      githubRepoUrl,
      liveDashboardUrl,
      demoVideoUrl,
      files
    } = body;

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    if (!projectDescription || !projectDescription.trim()) {
      return NextResponse.json({ error: 'Project description is required' }, { status: 400 });
    }

    // Verify project exists and belongs to the student's enrolled course
    const project = await prisma.courseProject.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (project.courseId !== profile.courseId) {
      return NextResponse.json({ error: 'Access denied: Project belongs to another course' }, { status: 403 });
    }

    // Check existing submission (Upsert / Re-submission logic)
    const existingSubmission = await prisma.projectSubmission.findUnique({
      where: {
        studentId_projectId: {
          studentId: user.id,
          projectId: project.id
        }
      },
      include: { review: true }
    });

    if (existingSubmission && existingSubmission.status === 'Approved') {
      return NextResponse.json({ error: 'This project has already been approved and cannot be re-submitted' }, { status: 400 });
    }

    let submission;
    const newVersion = existingSubmission ? existingSubmission.version + 1 : 1;
    const status = existingSubmission && existingSubmission.status === 'Revision Required' ? 'Resubmitted' : 'Submitted';

    const filesJson = files ? JSON.stringify(files) : null;

    if (existingSubmission) {
      submission = await prisma.projectSubmission.update({
        where: { id: existingSubmission.id },
        data: {
          version: newVersion,
          projectDescription: projectDescription.trim(),
          githubRepoUrl: githubRepoUrl?.trim() || null,
          liveDashboardUrl: liveDashboardUrl?.trim() || null,
          demoVideoUrl: demoVideoUrl?.trim() || null,
          files: filesJson,
          status,
          submittedAt: new Date()
        }
      });
    } else {
      submission = await prisma.projectSubmission.create({
        data: {
          projectId: project.id,
          studentId: user.id,
          version: 1,
          projectDescription: projectDescription.trim(),
          githubRepoUrl: githubRepoUrl?.trim() || null,
          liveDashboardUrl: liveDashboardUrl?.trim() || null,
          demoVideoUrl: demoVideoUrl?.trim() || null,
          files: filesJson,
          status: 'Submitted'
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: existingSubmission ? 'Project re-submitted successfully' : 'Project submitted successfully',
      submission: {
        id: submission.id,
        version: submission.version,
        status: submission.status,
        submittedAt: submission.submittedAt.toISOString()
      }
    });

  } catch (error: any) {
    console.error('Project submission API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
