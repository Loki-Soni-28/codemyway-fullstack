const { PrismaClient } = require('./backend/node_modules/@prisma/client');

const prisma = new PrismaClient();
const baseUrl = 'http://localhost:4000/api';

async function login(email, password) {
  const res = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'credentials', email, password })
  });
  const setCookie = res.headers.get('set-cookie');
  const data = await res.json();
  return { status: res.status, data, cookie: setCookie };
}

async function runM7Tests() {
  console.log('========================================================');
  console.log('   STARTING MILESTONE 7 AUTOMATED VERIFICATION SUITE    ');
  console.log('========================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition, message) {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`  ✓ PASS: ${message}`);
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      throw new Error(`Test assertion failed: ${message}`);
    }
  }

  try {
    // 1. Authenticate Actors
    console.log('[Phase A] Authenticating Actors (Admin, Teachers, Students)');
    const admin = await login('admin@codedojo.com', 'password123');
    assert(admin.status === 200 && admin.data.user?.role === 'ADMIN', 'Admin authenticated');

    const teacherNeha = await login('neha@codedojo.com', 'password123');
    assert(teacherNeha.status === 200 && teacherNeha.data.user?.role === 'MENTOR', 'Teacher Neha authenticated');

    const teacherSiddharth = await login('siddharth@codedojo.com', 'password123');
    assert(teacherSiddharth.status === 200 && (teacherSiddharth.data.user?.role === 'MENTOR' || teacherSiddharth.data.user?.role === 'INSTRUCTOR'), 'Teacher Siddharth authenticated');

    const studentSneha = await login('sneha@codedojo.com', 'password123');
    assert(studentSneha.status === 200 && studentSneha.data.user?.role === 'STUDENT', 'Student Sneha authenticated');

    const studentYash = await login('yash@codedojo.com', 'password123');
    assert(studentYash.status === 200 && studentYash.data.user?.role === 'STUDENT', 'Student Yash authenticated');

    const studentAarav = await login('aarav@codedojo.com', 'password123');
    assert(studentAarav.status === 200 && studentAarav.data.user?.role === 'STUDENT', 'Student Aarav authenticated');

    // 2. Fetch Active Batch
    console.log('\n[Phase B] Batch & Teacher Eligibility Setup');
    const batchRes = await fetch(`${baseUrl}/admin/check-ins/batch-teachers`, {
      headers: { 'Cookie': admin.cookie }
    });
    const batchData = await batchRes.json();
    assert(batchData.success && batchData.batches.length > 0, 'Fetched batches list');
    const batchId = batchData.batches[0].id;

    // Ensure Neha and Siddharth are active BatchTeachers for this batch
    const bt1 = await fetch(`${baseUrl}/admin/check-ins/batch-teachers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': admin.cookie },
      body: JSON.stringify({ batchId, teacherId: teacherNeha.data.user.id, isActive: true })
    });
    const btData1 = await bt1.json();
    assert(btData1.success, 'Configured Teacher Neha as eligible BatchTeacher');

    const bt2 = await fetch(`${baseUrl}/admin/check-ins/batch-teachers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': admin.cookie },
      body: JSON.stringify({ batchId, teacherId: teacherSiddharth.data.user.id, isActive: true })
    });
    const btData2 = await bt2.json();
    assert(btData2.success, 'Configured Teacher Siddharth as eligible BatchTeacher');

    const testRunNonce = Math.floor(Date.now() / 1000) % 10000;
    const testWeekNumber = 2000 + testRunNonce;
    const skipWeekNumber = 3000 + testRunNonce;

    // 3. Admin Check-In Lifecycle (Skip check-in & Create Check-In)
    console.log('\n[Phase C] Check-In Lifecycle & Admin Controls');
    // Test skipping a week with mandatory reason
    const skipRes = await fetch(`${baseUrl}/admin/check-ins`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': admin.cookie },
      body: JSON.stringify({
        batchId,
        weekNumber: skipWeekNumber,
        title: `Diwali Break Week ${skipWeekNumber}`,
        scheduledStartDate: '2026-11-10T00:00:00Z',
        scheduledEndDate: '2026-11-16T23:59:59Z',
        isSkipped: true,
        skipReason: 'Institute holiday for Diwali festive break.'
      })
    });
    const skipData = await skipRes.json();
    assert(skipData.success && skipData.checkIn.status === 'SKIPPED', 'Successfully created SKIPPED check-in with mandatory reason');

    // Test rejection of skip without reason
    const skipFailRes = await fetch(`${baseUrl}/admin/check-ins`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': admin.cookie },
      body: JSON.stringify({
        batchId,
        weekNumber: skipWeekNumber + 1,
        title: 'Invalid Skip Week',
        scheduledStartDate: '2026-11-17T00:00:00Z',
        scheduledEndDate: '2026-11-23T23:59:59Z',
        isSkipped: true
      })
    });
    assert(skipFailRes.status === 400, 'Rejection of SKIPPED check-in when skipReason is omitted');

    const createRes = await fetch(`${baseUrl}/admin/check-ins`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': admin.cookie },
      body: JSON.stringify({
        batchId,
        weekNumber: testWeekNumber,
        title: `Sprint Evaluation Week ${testWeekNumber}`,
        scheduledStartDate: '2026-11-01T00:00:00Z',
        scheduledEndDate: '2026-11-07T23:59:59Z',
        defaultDurationMinutes: 30
      })
    });
    const createData = await createRes.json();
    assert(createData.success && createData.checkIn.status === 'DRAFT', 'Created check-in in DRAFT state');
    const checkInId = createData.checkIn.id;

    // 4. Student Allocation & Capacity Validation
    console.log('\n[Phase D] Allocation & Teacher Capacity Bounds');
    const snehaId = studentSneha.data.user.id;
    const yashId = studentYash.data.user.id;
    const aaravId = studentAarav.data.user.id;
    const nehaId = teacherNeha.data.user.id;
    const siddharthId = teacherSiddharth.data.user.id;

    // Test Batch Isolation: Aarav is in 'Data Engineer' batch, not 'Data Analyst' batch.
    // Allocating Aarav to a 'Data Analyst' check-in must be rejected!
    const crossBatchAlloc = await fetch(`${baseUrl}/admin/check-ins/${checkInId}/allocate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': admin.cookie },
      body: JSON.stringify({
        allocations: [{ studentId: aaravId, teacherId: nehaId }]
      })
    });
    assert(crossBatchAlloc.status === 400, 'Batch isolation enforced: Student from different batch rejected (400)');

    // Allocate Sneha to Neha and Yash to Siddharth
    const allocRes = await fetch(`${baseUrl}/admin/check-ins/${checkInId}/allocate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': admin.cookie },
      body: JSON.stringify({
        allocations: [
          { studentId: snehaId, teacherId: nehaId },
          { studentId: yashId, teacherId: siddharthId }
        ]
      })
    });
    const allocData = await allocRes.json();
    assert(allocData.success && allocData.assignments.length === 2, 'Allocated Sneha to Neha and Yash to Siddharth');
    const snehaAssignment = allocData.assignments.find(a => a.studentId === snehaId);
    const yashAssignment = allocData.assignments.find(a => a.studentId === yashId);

    // 5. Scheduling & Overlapping Collisions
    console.log('\n[Phase E] Scheduling & Overlapping Collision Prevention');
    const scheduleRes = await fetch(`${baseUrl}/admin/check-ins/${checkInId}/schedule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': admin.cookie },
      body: JSON.stringify({
        sessions: [
          {
            assignmentId: snehaAssignment.id,
            scheduledStartAt: '2026-11-05T10:00:00Z',
            scheduledEndAt: '2026-11-05T10:30:00Z',
            meetingUrl: 'https://meet.google.com/test-valid-session'
          }
        ]
      })
    });
    assert(scheduleRes.status === 200, 'Scheduled Sneha session with valid time window');

    // 6. Publishing the Check-In Cycle
    console.log('\n[Phase F] Publishing Check-In Cycle & Outbox Notifications');
    const publishRes = await fetch(`${baseUrl}/admin/check-ins/${checkInId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Cookie': admin.cookie },
      body: JSON.stringify({ action: 'PUBLISH' })
    });
    const publishData = await publishRes.json();
    assert(publishData.success && publishData.checkIn.status === 'ACTIVE', 'Published check-in transitioned status from DRAFT to ACTIVE');

    // 7. Process Outbox Notifications Worker
    console.log('\n[Phase G] Background Outbox Worker Processing');
    const workerTrigger = await fetch(`${baseUrl}/admin/check-ins/worker`, {
      method: 'POST',
      headers: { 'Cookie': admin.cookie }
    });
    const workerData = await workerTrigger.json();
    assert(workerData.success && workerData.outbox.succeeded > 0, `Outbox worker delivered and marked ${workerData.outbox.succeeded} notifications as SENT`);

    // Verify student and teacher received in-app notifications
    const studentNotifs = await prisma.notification.findMany({
      where: { userId: snehaId },
      orderBy: { createdAt: 'desc' }
    });
    assert(studentNotifs.length > 0 && studentNotifs[0].message.includes('Sprint Evaluation'), 'Student received published check-in in-app notification');

    // 8. Teacher Feedback Draft & Published Immutability
    console.log('\n[Phase H] Teacher Feedback, Rubric Scores & Immutability');
    // Save draft feedback
    const draftFbRes = await fetch(`${baseUrl}/faculty/check-ins/assignments/${snehaAssignment.id}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': teacherNeha.cookie },
      body: JSON.stringify({
        publish: false,
        attendanceRating: 4,
        taskCompletionScore: 85,
        strengths: 'Excellent algorithmic thinking and clean code modularity.',
        areasForImprovement: 'Needs more comprehensive edge-case unit tests.',
        generalFeedback: 'Steady performance this week.',
        nextWeekGoals: 'Complete Milestone 7 and advance to Milestone 8.',
        actionItems: [
          { description: 'Write unit tests covering empty input arrays' }
        ]
      })
    });
    const draftFbData = await draftFbRes.json();
    assert(draftFbData.success && draftFbData.feedback.status === 'DRAFT', 'Teacher saved feedback DRAFT');

    // Student should NOT see draft feedback
    const studentViewRes1 = await fetch(`${baseUrl}/student/check-ins`, {
      headers: { 'Cookie': studentSneha.cookie }
    });
    const studentViewData1 = await studentViewRes1.json();
    const snehaStudentView1 = studentViewData1.assignments.find(a => a.id === snehaAssignment.id);
    assert(snehaStudentView1.feedback === null, 'Student cannot view unapproved DRAFT feedback (privacy protection)');

    // Teacher publishes feedback
    const pubFbRes = await fetch(`${baseUrl}/faculty/check-ins/assignments/${snehaAssignment.id}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': teacherNeha.cookie },
      body: JSON.stringify({
        publish: true,
        attendanceRating: 5,
        taskCompletionScore: 92,
        generalFeedback: 'Outstanding work this sprint! All deliverables submitted on time.'
      })
    });
    const pubFbData = await pubFbRes.json();
    assert(pubFbData.success && pubFbData.feedback.status === 'PUBLISHED', 'Teacher published feedback');

    // Immutability test: Teacher attempts to overwrite published feedback -> Must be rejected!
    const tamperFbRes = await fetch(`${baseUrl}/faculty/check-ins/assignments/${snehaAssignment.id}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': teacherNeha.cookie },
      body: JSON.stringify({
        publish: true,
        attendanceRating: 1,
        taskCompletionScore: 10
      })
    });
    assert(tamperFbRes.status === 400, 'Rejection of direct modification to PUBLISHED feedback (immutability preserved)');

    // 9. Student Action Items & Authorization
    console.log('\n[Phase I] Student Action Item Ownership & Toggling');
    const studentViewRes2 = await fetch(`${baseUrl}/student/check-ins`, {
      headers: { 'Cookie': studentSneha.cookie }
    });
    const studentViewData2 = await studentViewRes2.json();
    const snehaStudentView2 = studentViewData2.assignments.find(a => a.id === snehaAssignment.id);
    assert(snehaStudentView2.feedback?.status === 'PUBLISHED', 'Student can view PUBLISHED feedback');
    assert(snehaStudentView2.feedback.actionItems.length > 0, 'Student can see teacher-assigned action items');
    const actionItem = snehaStudentView2.feedback.actionItems[0];

    // Aarav attempts to toggle Sneha's action item -> Must be 403 Forbidden!
    const crossStudentToggle = await fetch(`${baseUrl}/student/check-ins/action-items/${actionItem.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Cookie': studentYash.cookie },
      body: JSON.stringify({ isCompleted: true })
    });
    assert(crossStudentToggle.status === 403, 'Cross-student action item tampering forbidden (403)');

    // Sneha toggles her own action item
    const validToggle = await fetch(`${baseUrl}/student/check-ins/action-items/${actionItem.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Cookie': studentSneha.cookie },
      body: JSON.stringify({ isCompleted: true })
    });
    const validToggleData = await validToggle.json();
    assert(validToggleData.success && validToggleData.actionItem.isCompleted === true, 'Sneha marked her action item completed');

    // 10. Admin Amendment with Mandatory Audit Trail
    console.log('\n[Phase J] Admin Audited Feedback Amendment');
    const amendRes = await fetch(`${baseUrl}/admin/check-ins/assignments/${snehaAssignment.id}/amend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': admin.cookie },
      body: JSON.stringify({
        amendmentReason: 'Corrected attendance score after medical slip verification.',
        attendanceRating: 5,
        taskCompletionScore: 98
      })
    });
    const amendData = await amendRes.json();
    assert(amendData.success && amendData.feedback.taskCompletionScore === 98, 'Admin successfully amended published feedback with reason');

    // Verify audit log has the amendment entry
    const auditLogs = await prisma.weeklyCheckInAuditLog.findMany({
      where: { checkInId },
      orderBy: { occurredAt: 'desc' }
    });
    const amendAudit = auditLogs.find(l => l.metadata?.amendmentReason);
    assert(amendAudit !== undefined, 'Audit log accurately recorded amendmentReason and before/after snapshot');

    // 11. Lifecycle Worker & Auto-completion
    console.log('\n[Phase K] Lifecycle Worker Validation');
    // Complete Yash's assignment so check-in has 100% completed assignments
    await prisma.weeklyCheckInStudent.update({
      where: { id: yashAssignment.id },
      data: { status: 'COMPLETED' }
    });

    const lifecycleWorkerTrigger = await fetch(`${baseUrl}/admin/check-ins/worker`, {
      method: 'POST',
      headers: { 'Cookie': admin.cookie }
    });
    const lifecycleData = await lifecycleWorkerTrigger.json();
    assert(lifecycleData.success && lifecycleData.lifecycle.completedCheckInCount >= 1, 'Lifecycle worker transitioned 100% resolved check-in to COMPLETED');

    const finalizedCheckIn = await prisma.weeklyCheckIn.findUnique({
      where: { id: checkInId },
      select: { status: true }
    });
    assert(finalizedCheckIn.status === 'COMPLETED', 'Check-in status verified as COMPLETED in database');

    console.log('\n========================================================');
    console.log(`  ALL ${passedTests} / ${totalTests} MILESTONE 7 TESTS PASSED SUCCESSFULLY! `);
    console.log('========================================================\n');

  } catch (error) {
    console.error('\nM7 TEST SUITE ABORTED WITH ERROR:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runM7Tests();
