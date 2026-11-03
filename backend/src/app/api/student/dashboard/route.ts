import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { computeBatchLeaderboard } from '@/lib/leaderboard';

export async function GET() {
  const user = await getSessionUser();
  if (!user || user.role !== 'STUDENT') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const profile = user.studentProfile;
  if (!profile) {
    return NextResponse.json({ error: 'Student profile not found' }, { status: 404 });
  }

  try {
    const courseId = profile.courseId;
    const batchId = profile.batchId;

    if (!batchId) {
      return NextResponse.json({ error: 'Batch not assigned' }, { status: 400 });
    }

    // 1. Fetch Next / Current Live Class
    const classes = await prisma.class.findMany({
      where: { batchId },
      orderBy: [
        { date: 'asc' },
        { startTime: 'asc' }
      ],
      include: {
        instructor: true,
        assignments: {
          include: {
            questions: true
          }
        }
      }
    });

    // Find live class first, then next upcoming class, otherwise last completed class
    let nextClass = classes.find(c => c.status === 'LIVE');
    if (!nextClass) {
      nextClass = classes.find(c => c.status === 'UPCOMING');
    }
    if (!nextClass && classes.length > 0) {
      nextClass = classes[classes.length - 1]; // last completed
    }

    // 2. Calculate Attendance Stats
    const totalBatchClasses = classes.filter(c => c.status === 'COMPLETED').length;
    const studentAttendance = await prisma.attendance.findMany({
      where: { studentId: user.id },
      include: { class: true }
    });

    const attendedCount = studentAttendance.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length;
    const missedCount = Math.max(0, totalBatchClasses - attendedCount);
    const attendancePercentage = totalBatchClasses > 0 ? Math.round((attendedCount / totalBatchClasses) * 100) : 100;

    // 3. Calculate Assignment Stats
    const submissions = await prisma.submission.findMany({
      where: { studentId: user.id },
      include: { question: true }
    });

    // Find all questions in assignments linked to completed classes
    const completedClassIds = classes.filter(c => c.status === 'COMPLETED').map(c => c.id);
    const activeAssignments = await prisma.assignment.findMany({
      where: { classId: { in: completedClassIds } },
      include: { questions: true }
    });

    let totalPoints = 0;
    let earnedPoints = 0;
    let totalQuestionsCount = 0;
    let completedQuestionsCount = 0;

    activeAssignments.forEach(a => {
      a.questions.forEach(q => {
        totalPoints += q.points;
        totalQuestionsCount++;
        const sub = submissions.find(s => s.questionId === q.id);
        if (sub) {
          completedQuestionsCount++;
          if (sub.isCorrect) {
            earnedPoints += q.points;
          }
        }
      });
    });

    const assignmentScorePercent = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    const assignmentProgressPercent = totalQuestionsCount > 0 ? Math.round((completedQuestionsCount / totalQuestionsCount) * 100) : 0;

    // 4. Retrieve Upcoming Mentor Session
    const mentorSessions = await prisma.mentorSession.findMany({
      where: { studentId: user.id },
      orderBy: [
        { date: 'asc' },
        { time: 'asc' }
      ],
      include: { mentor: true }
    });

    const upcomingSession = mentorSessions.find(s => s.status === 'SCHEDULED');

    // 5. Leaderboard (real scores from submissions)
    const rankedRows = await computeBatchLeaderboard(batchId);
    const myIndex = rankedRows.findIndex(row => row.id === user.id);
    const myRow = myIndex !== -1 ? rankedRows[myIndex] : null;

    // Modules count as completed once every class the batch has in them is completed.
    const courseModules = profile.course?.modules ?? [];
    const modulesCompleted = courseModules.filter(m => {
      const moduleClasses = classes.filter(c => c.moduleId === m.id);
      return moduleClasses.length > 0 && moduleClasses.every(c => c.status === 'COMPLETED');
    }).length;

    // Filter leaderboard preview to show: Top 2 + current user + next user
    let previewLeaderboard = [];
    if (rankedRows.length <= 4) {
      previewLeaderboard = rankedRows;
    } else {
      const top2 = rankedRows.slice(0, 2);
      const isMyRowInTop2 = myIndex === -1 || myIndex < 2;

      if (isMyRowInTop2) {
        previewLeaderboard = rankedRows.slice(0, 4);
      } else {
        previewLeaderboard = [
          ...top2,
          rankedRows[myIndex],
          ...(myIndex + 1 < rankedRows.length ? [rankedRows[myIndex + 1]] : [])
        ];
      }
    }

    // 6. Today's learning path sequence
    // Look up the next class's pre/post reads and assignment progress
    const activeClass = nextClass || classes[0];
    let preRead = null;
    let postRead = null;
    let todayAssignment = null;

    if (activeClass) {
      preRead = activeClass.preRead ? JSON.parse(activeClass.preRead) : null;
      postRead = activeClass.postRead ? JSON.parse(activeClass.postRead) : null;
      
      const classAssignment = activeClass.assignments[0];
      if (classAssignment) {
        const qCount = classAssignment.questions.length;
        const qSolved = submissions.filter(s => classAssignment.questions.some(q => q.id === s.questionId)).length;
        todayAssignment = {
          id: classAssignment.id,
          title: classAssignment.title,
          totalQuestions: qCount,
          solvedQuestions: qSolved
        };
      }
    }

    return NextResponse.json({
      success: true,
      nextClass: nextClass ? {
        id: nextClass.id,
        title: nextClass.title,
        description: nextClass.description,
        date: nextClass.date,
        startTime: nextClass.startTime,
        endTime: nextClass.endTime,
        zoomLink: nextClass.zoomLink,
        status: nextClass.status,
        instructorName: nextClass.instructor.name,
      } : null,
      todayLearning: {
        classId: activeClass?.id || null,
        classTitle: activeClass?.title || 'No Classes Today',
        classStatus: activeClass?.status || 'COMPLETED',
        preRead,
        postRead,
        assignment: todayAssignment
      },
      progress: {
        overall: myRow?.overallScore ?? assignmentScorePercent,
        modulesCompleted,
        totalModules: courseModules.length,
        classesAttended: attendedCount,
        totalClasses: totalBatchClasses,
        assignmentScore: assignmentScorePercent,
        contestScore: myRow?.contestScore ?? 0
      },
      attendance: {
        percentage: attendancePercentage,
        attended: attendedCount,
        missed: missedCount,
        total: totalBatchClasses
      },
      leaderboardPreview: previewLeaderboard,
      myRank: {
        rank: myRow?.rank ?? null,
        score: myRow?.overallScore ?? 0
      },
      upcomingMentorSession: upcomingSession ? {
        id: upcomingSession.id,
        mentorName: upcomingSession.mentor.name,
        date: upcomingSession.date,
        time: upcomingSession.time,
        topic: upcomingSession.topic,
        zoomLink: upcomingSession.zoomLink,
        status: upcomingSession.status
      } : null
    });

  } catch (error: any) {
    console.error('Student dashboard API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
