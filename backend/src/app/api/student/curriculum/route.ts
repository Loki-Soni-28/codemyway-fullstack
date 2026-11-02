import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  const user = await getSessionUser();
  if (!user || (user.role !== 'STUDENT' && user.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const profile = user.studentProfile;
  if (!profile || !profile.batchId) {
    return NextResponse.json({ error: 'No active batch assigned' }, { status: 404 });
  }

  try {
    // Fetch course details, modules, and classes
    const course = await prisma.course.findUnique({
      where: { id: profile.courseId },
      include: {
        modules: {
          orderBy: { order: 'asc' },
          include: {
            classes: {
              where: { batchId: profile.batchId },
              orderBy: [
                { date: 'asc' },
                { startTime: 'asc' }
              ],
              include: {
                instructor: true,
                assignments: {
                  include: {
                    questions: {
                      include: {
                        submissions: {
                          where: { studentId: user.id }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Fetch student's attendance records to evaluate completed classes
    const attendance = await prisma.attendance.findMany({
      where: { studentId: user.id }
    });

    // Format module stats
    const modulesWithStats = course.modules.map((mod) => {
      const totalClasses = mod.classes.length;
      
      // Class status evaluation
      const classesFormatted = mod.classes.map((cls) => {
        const hasAttended = attendance.find(a => a.classId === cls.id && (a.status === 'PRESENT' || a.status === 'LATE'));
        
        let status = 'LOCKED';
        if (cls.status === 'COMPLETED') {
          status = 'COMPLETED';
        } else if (cls.status === 'LIVE') {
          status = 'IN_PROGRESS';
        } else if (cls.status === 'UPCOMING') {
          // If the previous class is completed, this is "UPCOMING", otherwise "LOCKED"
          status = 'UPCOMING';
        }

        // Evaluate assignment progress for this class
        let assignmentSolved = 0;
        let assignmentTotal = 0;
        const assignment = cls.assignments[0];
        if (assignment) {
          assignmentTotal = assignment.questions.length;
          assignment.questions.forEach((q) => {
            if (q.submissions && q.submissions.length > 0) {
              assignmentSolved++;
            }
          });
        }

        let parsedPreRead: any = null;
        try {
          if (cls.preRead) parsedPreRead = JSON.parse(cls.preRead);
        } catch {
          parsedPreRead = null;
        }

        const weekNumber = parsedPreRead?.weekNumber ?? (cls.title.includes('Week 2') || cls.title.includes('Class 04') || cls.title.includes('Class 05') || cls.title.includes('Class 06') ? 2 : (cls.title.includes('Week 3') || cls.title.includes('Class 07') || cls.title.includes('Class 08') ? 3 : 1));
        const order = parsedPreRead?.order ?? (parseInt(cls.title.match(/Class 0?(\d+)/i)?.[1] || '1', 10));
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
          duration: `${cls.startTime} - ${cls.endTime}`,
          zoomLink: cls.zoomLink,
          recordingUrl: cls.recordingUrl,
          instructorName: cls.instructor.name,
          hasRecording: !!cls.recordingUrl,
          hasMaterials: !!cls.preRead,
          preRead: parsedPreRead,
          postRead: cls.postRead ? JSON.parse(cls.postRead) : null,
          status,
          hasAttended: !!hasAttended,
          assignment: assignment ? {
            id: assignment.id,
            title: assignment.title,
            solved: assignmentSolved,
            total: assignmentTotal
          } : null
        };
      });

      // Sort classes deterministically by order then weekNumber
      classesFormatted.sort((a, b) => (a.order || 0) - (b.order || 0));

      const completedClasses = classesFormatted.filter(c => c.status === 'COMPLETED').length;
      const progressPercent = totalClasses > 0 ? Math.round((completedClasses / totalClasses) * 100) : 0;

      return {
        id: mod.id,
        title: mod.title,
        order: mod.order,
        durationWeeks: mod.title === 'SQL' || mod.order === 1 ? '3 Weeks' : `${totalClasses} Lectures`,
        progressPercent,
        completedClasses,
        totalClasses,
        classes: classesFormatted
      };
    });

    return NextResponse.json({
      success: true,
      courseTitle: course.title,
      courseDescription: course.description,
      modules: modulesWithStats
    });

  } catch (error: any) {
    console.error('Curriculum query error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
