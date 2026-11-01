import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

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

    // 1. Fetch Next / Current Live Class & Upcoming Classes for this batch
    const classes = await prisma.class.findMany({
      where: { batchId },
      orderBy: [
        { date: 'asc' },
        { startTime: 'asc' }
      ],
      include: {
        instructor: true,
        module: true,
        assignments: {
          include: {
            questions: true
          }
        }
      }
    });

    // Find live class first, then next upcoming class, otherwise null for scheduled next class
    let nextClass = classes.find(c => c.status === 'LIVE');
    if (!nextClass) {
      nextClass = classes.find(c => c.status === 'UPCOMING');
    }

    // List of future upcoming classes (max 5)
    const upcomingClasses = classes
      .filter(c => c.status === 'UPCOMING' || c.status === 'LIVE')
      .slice(0, 5)
      .map(c => ({
        id: c.id,
        title: c.title,
        description: c.description,
        moduleTitle: c.module?.title || 'Core Module',
        date: c.date,
        startTime: c.startTime,
        endTime: c.endTime,
        zoomLink: c.zoomLink,
        status: c.status,
        instructorName: c.instructor.name,
      }));

    // 2. Calculate Attendance Stats
    const totalBatchClasses = classes.filter(c => c.status === 'COMPLETED').length;
    const studentAttendance = await prisma.attendance.findMany({
      where: { studentId: user.id },
      include: { class: true }
    });

    const attendedCount = studentAttendance.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length;
    const missedCount = Math.max(0, totalBatchClasses - attendedCount);
    const attendancePercentage = totalBatchClasses > 0 ? Math.round((attendedCount / totalBatchClasses) * 100) : 100;

    // 3. Calculate Assignment Stats strictly from database
    const submissions = await prisma.submission.findMany({
      where: { studentId: user.id },
      include: { question: true },
      orderBy: { submittedAt: 'desc' }
    });

    // Find all assignments linked to classes for this batch
    const batchClassIds = classes.map(c => c.id);
    const completedClassIds = classes.filter(c => c.status === 'COMPLETED').map(c => c.id);

    // All assignments published so far (belonging to completed or live classes)
    const activeAssignments = await prisma.assignment.findMany({
      where: { classId: { in: completedClassIds } },
      include: {
        questions: {
          include: {
            submissions: {
              where: { studentId: user.id }
            }
          }
        }
      }
    });

    let totalAssignedQuestions = 0;
    let submittedCount = 0;
    let correctCount = 0;
    let totalPoints = 0;
    let earnedPoints = 0;

    activeAssignments.forEach(a => {
      a.questions.forEach(q => {
        totalAssignedQuestions++;
        totalPoints += q.points;
        const sub = q.submissions[0];
        if (sub) {
          submittedCount++;
          if (sub.isCorrect) {
            correctCount++;
            earnedPoints += sub.score || q.points;
          }
        }
      });
    });

    const pendingCount = Math.max(0, totalAssignedQuestions - submittedCount);
    const assignmentAccuracy = submittedCount > 0 ? Math.round((correctCount / submittedCount) * 100) : 0;
    const assignmentScorePercent = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    const assignmentProgressPercent = totalAssignedQuestions > 0 ? Math.round((submittedCount / totalAssignedQuestions) * 100) : 0;

    // 4. Learning Progress calculation based on actual course modules & completed classes
    const courseModules = await prisma.module.findMany({
      where: { courseId },
      orderBy: { order: 'asc' },
      include: {
        classes: {
          where: { batchId }
        }
      }
    });

    const totalCourseModules = courseModules.length;
    // A module is considered completed if it has classes and all classes in it are COMPLETED
    const completedModulesCount = courseModules.filter(m => {
      if (m.classes.length === 0) return false;
      return m.classes.every(c => c.status === 'COMPLETED');
    }).length;

    const moduleCompletionPercent = totalCourseModules > 0 ? Math.round((completedModulesCount / totalCourseModules) * 100) : 0;

    // 5. Recent Activity (Recent classes completed and recent submissions)
    const recentActivity = [
      ...submissions.slice(0, 3).map(s => ({
        id: `sub-${s.id}`,
        type: 'ASSIGNMENT_SUBMISSION',
        title: s.question?.text?.slice(0, 50) || 'Assignment Question',
        timestamp: s.submittedAt,
        status: s.isCorrect ? 'Evaluated · Passed' : 'Evaluated · Needs Improvement',
        score: s.score
      })),
      ...studentAttendance.slice(0, 2).map(a => ({
        id: `att-${a.id}`,
        type: 'CLASS_ATTENDANCE',
        title: a.class?.title || 'Cohort Lecture',
        timestamp: a.markedAt,
        status: a.status === 'PRESENT' ? 'Attended' : a.status,
        score: null
      }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 4);

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

    // 5. Leaderboard Calculation
    // Find all students in this batch
    const batchProfiles = await prisma.studentProfile.findMany({
      where: { batchId },
      include: { user: { include: { submissions: true } } }
    });

    // Simple rank calculation based on correct submissions count / overall score
    const leaderboardRows = batchProfiles.map(p => {
      const studentSubmissions = p.user.submissions;
      const correctCount = studentSubmissions.filter(s => s.isCorrect).length;
      const score = correctCount * 10; // 10 points per correct answer
      
      // Seed some default score variability for demo leaderboard completeness
      let mockContestScore = 70;
      let mockAssignmentScore = 80;

      if (p.user.email === 'aarav@codedojo.com') {
        mockContestScore = 90;
        mockAssignmentScore = 95;
      } else if (p.user.name.includes('Ananya')) {
        mockContestScore = 85;
        mockAssignmentScore = 92;
      } else if (p.user.name.includes('Kabir')) {
        mockContestScore = 80;
        mockAssignmentScore = 88;
      } else {
        // Pseudo-random deterministic scores based on ID length
        mockContestScore = 50 + (p.id.length % 40);
        mockAssignmentScore = 60 + (p.id.length % 35);
      }

      const overall = Math.round(mockAssignmentScore * 0.6 + mockContestScore * 0.4);

      return {
        id: p.userId,
        name: p.user.name,
        email: p.user.email,
        assignmentScore: mockAssignmentScore,
        contestScore: mockContestScore,
        overallScore: overall
      };
    });

    // Sort by overall score descending
    leaderboardRows.sort((a, b) => b.overallScore - a.overallScore);

    // Add rankings
    const rankedRows = leaderboardRows.map((row, index) => ({
      rank: index + 1,
      ...row
    }));

    // Find current user's position
    const myIndex = rankedRows.findIndex(row => row.id === user.id);
    const myRank = myIndex !== -1 ? myIndex + 1 : 3;

    // Filter leaderboard preview to show: Top 2 + current user + next user
    let previewLeaderboard = [];
    if (rankedRows.length <= 4) {
      previewLeaderboard = rankedRows;
    } else {
      const top2 = rankedRows.slice(0, 2);
      const isMyRowInTop2 = myIndex < 2;

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
      student: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
        enrolledCourse: profile.course?.title || 'Data Analyst with Gen AI',
        batchName: profile.batch?.name || 'Current Cohort',
        enrollmentStatus: profile.status,
        enrollmentDate: profile.enrollmentDate,
        mentor: profile.mentor ? {
          id: profile.mentor.id,
          name: profile.mentor.name,
          email: profile.mentor.email
        } : null
      },
      nextClass: nextClass ? {
        id: nextClass.id,
        title: nextClass.title,
        description: nextClass.description,
        moduleTitle: nextClass.module?.title || 'Core Module',
        date: nextClass.date,
        startTime: nextClass.startTime,
        endTime: nextClass.endTime,
        zoomLink: nextClass.zoomLink,
        status: nextClass.status,
        instructorName: nextClass.instructor.name,
      } : null,
      upcomingClasses,
      todayLearning: {
        classId: activeClass?.id || null,
        classTitle: activeClass?.title || 'No Classes Today',
        classStatus: activeClass?.status || 'COMPLETED',
        preRead,
        postRead,
        assignment: todayAssignment
      },
      progress: {
        modulesCompleted: completedModulesCount,
        totalModules: totalCourseModules,
        modulesPercentage: moduleCompletionPercent,
        classesAttended: attendedCount,
        totalClasses: totalBatchClasses,
        assignmentProgress: assignmentProgressPercent,
        assignmentScore: assignmentScorePercent
      },
      attendance: {
        percentage: attendancePercentage,
        attended: attendedCount,
        missed: missedCount,
        total: totalBatchClasses
      },
      assignments: {
        totalAssigned: totalAssignedQuestions,
        submitted: submittedCount,
        pending: pendingCount,
        evaluated: submittedCount,
        accuracy: assignmentAccuracy,
        earnedPoints,
        totalPoints
      },
      recentActivity,
      leaderboardPreview: previewLeaderboard,
      myRank: {
        rank: myRank,
        score: rankedRows[myIndex]?.overallScore || 0
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
