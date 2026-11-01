import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { generateContent } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { message } = await req.json();
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const query = message.trim();
    // 4. RAG (Retrieval-Augmented Generation) Core
    // Fetch courses matching curriculum or just load active course syllabus
    const activeCourseId = user.studentProfile?.courseId;
    let courseInfo = "";
    
    if (activeCourseId) {
      const course = await prisma.course.findUnique({
        where: { id: activeCourseId },
        include: {
          modules: {
            include: {
              classes: true
            }
          }
        }
      });
      if (course) {
        courseInfo = `Course Title: ${course.title}\nModules:\n` + 
          course.modules.map(m => `- Module ${m.order}: ${m.title} (${m.classes.length} classes)`).join("\n");
      }
    } else {
      const publicCourses = await prisma.course.findMany({ take: 3 });
      courseInfo = publicCourses.map(c => `- ${c.title} (${c.duration})`).join("\n");
    }

    // 5. AI Agent & Tool Executor
    const normalized = query.toLowerCase();
    let toolResult = "";
    let executedTool = "None";

    // Intent 1: Student progress/attendance/grades
    if (normalized.includes('progress') || normalized.includes('score') || normalized.includes('attendance') || normalized.includes('how many class') || normalized.includes('grade')) {
      executedTool = "get_student_progress";
      // Execute database logic
      const totalClasses = await prisma.class.count({
        where: { batchId: user.studentProfile?.batchId || "" }
      });
      const attendance = await prisma.attendance.findMany({
        where: { studentId: user.id }
      });
      const attendedCount = attendance.filter(a => a.status === 'PRESENT' || a.status === 'LATE').length;
      
      const submissions = await prisma.submission.findMany({
        where: { studentId: user.id }
      });
      const correctCount = submissions.filter(s => s.isCorrect).length;
      const totalScore = correctCount * 10;

      toolResult = `Student Performance Stats:\n- Attended ${attendedCount} of ${totalClasses} classes.\n- Completed ${submissions.length} assignment questions, scoring ${totalScore} accuracy points.`;
    }
    // Intent 2: Mentor sessions
    else if (normalized.includes('mentor') || normalized.includes('session') || normalized.includes('availability')) {
      executedTool = "check_mentor_availability";
      const sessions = await prisma.mentorSession.findMany({
        where: { studentId: user.id },
        include: { mentor: true }
      });

      if (sessions.length > 0) {
        toolResult = sessions.map(s => `- Topic: "${s.topic}" with ${s.mentor.name} on ${s.date} at ${s.time} (${s.status})`).join("\n");
      } else {
        toolResult = "No scheduled mentor sessions found in DB.";
      }
    }
    // Intent 3: Raise/Create support ticket
    else if (normalized.includes('ticket') || normalized.includes('support') || normalized.includes('raise') || normalized.includes('create')) {
      executedTool = "create_support_ticket";
      // Actually raise a database record in Supabase!
      try {
        const ticket = await prisma.supportTicket.create({
          data: {
            studentId: user.id,
            title: `AI Agent Ticket: ${query.substring(0, 40)}`,
            description: `Auto-generated ticket raised by student query: "${query}"`,
            category: "Technical Issue",
            status: "OPEN"
          }
        });
        toolResult = `Successfully raised support ticket: ID=${ticket.id.substring(0,8)}..., Category=Technical Issue, Status=OPEN.`;
      } catch (err: any) {
        console.error('[student/ai-agent] ticket creation failed', err);
        toolResult = 'Failed to create the support ticket. Please try again later.';
      }
    }
    // Intent 4: Normal conversation (No tool)
    else {
      toolResult = "No specific tool execution data required.";
    }

    // 6. AI/LLM Synthesis Stage (with RAG & Tool context)
    const systemPrompt = `You are the CODEDOJO Learning Assistant, integrated into a Next.js full-stack platform running on Supabase PostgreSQL.
Your goal is to answer student queries about their courses, attendance, grades, and sessions.
Below is the verified context fetched from the database:
[RAG CURRICULUM CONTEXT]
${courseInfo}

[AGENT TOOL QUERY RESULTS]
${toolResult}

Always reply in a professional, encouraging, and clear developer tone. Use Markdown.
If you used a tool (like creating a ticket or fetching scores), explicitly summarize it in your response.`;

    const userPrompt = `Student Username: ${user.name}
Student Email: ${user.email}
Query: ${query}`;
    const aiResponse = await generateContent(userPrompt, systemPrompt);
    return NextResponse.json({
      success: true,
      response: aiResponse.text,
      source: aiResponse.source,
      executedTool,
    });

  } catch (error: any) {
    console.error('[student/ai-agent]', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
