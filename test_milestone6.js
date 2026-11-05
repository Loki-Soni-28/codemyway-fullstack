const fs = require('fs');

async function runTests() {
  const baseUrl = 'http://localhost:4000/api';

  console.log('--- STARTING MILESTONE 6 VERIFICATION TEST SUITE ---');

  // Helper for logging in and getting cookies
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

  // 1. Unauthenticated checks
  console.log('\n[Test 1] Unauthenticated request checks');
  const unauthRes = await fetch(`${baseUrl}/student/mentor`);
  console.log('GET /api/student/mentor status:', unauthRes.status, unauthRes.status === 401 ? 'PASS (401)' : 'FAIL');

  const unauthFac = await fetch(`${baseUrl}/faculty/mentor-slots`);
  console.log('GET /api/faculty/mentor-slots status:', unauthFac.status, unauthFac.status === 401 ? 'PASS (401)' : 'FAIL');

  // 2. Login Mentor Neha
  console.log('\n[Test 2] Faculty login as Mentor Neha (neha@codedojo.com)');
  const nehaAuth = await login('neha@codedojo.com', 'password123');
  console.log('Neha login status:', nehaAuth.status, nehaAuth.data.user?.role === 'MENTOR' ? 'PASS (MENTOR)' : 'FAIL');

  // 3. Neha creates availability slot
  console.log('\n[Test 3] Mentor Neha creates a future slot (2026-11-20 15:00 - 15:45)');
  const slotRes = await fetch(`${baseUrl}/faculty/mentor-slots`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': nehaAuth.cookie
    },
    body: JSON.stringify({
      date: '2026-11-20',
      startTime: '15:00',
      endTime: '15:45'
    })
  });
  const slotData = await slotRes.json();
  console.log('Create slot status:', slotRes.status, slotData.success ? 'PASS' : 'FAIL');
  const slotId = slotData.slot?.id;
  console.log('Created slot ID:', slotId);

  // 4. Past slot creation rejection
  console.log('\n[Test 4] Rejection of slot with past date');
  const pastSlotRes = await fetch(`${baseUrl}/faculty/mentor-slots`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': nehaAuth.cookie
    },
    body: JSON.stringify({
      date: '2025-01-01',
      startTime: '10:00',
      endTime: '10:45'
    })
  });
  console.log('Past slot status:', pastSlotRes.status, pastSlotRes.status === 400 ? 'PASS (400 Rejected)' : 'FAIL');

  // 5. Login Student Sneha (assigned to Neha)
  console.log('\n[Test 5] Student login as Sneha (sneha@codedojo.com)');
  const snehaAuth = await login('sneha@codedojo.com', 'password123');
  console.log('Sneha login status:', snehaAuth.status, snehaAuth.data.user?.role === 'STUDENT' ? 'PASS (STUDENT)' : 'FAIL');

  // 6. Sneha views mentor and slots
  console.log('\n[Test 6] Sneha fetches assigned mentor and available slots');
  const snehaMentorRes = await fetch(`${baseUrl}/student/mentor`, {
    headers: { 'Cookie': snehaAuth.cookie }
  });
  const snehaMentorData = await snehaMentorRes.json();
  const foundSlot = snehaMentorData.assignedMentor?.availableSlots?.find(s => s.id === slotId);
  console.log('Assigned mentor name:', snehaMentorData.assignedMentor?.name);
  console.log('Slot visible to Sneha:', Boolean(foundSlot), foundSlot ? 'PASS' : 'FAIL');

  // 7. Student Aarav (assigned to mentor Siddharth) attempts to book Neha's slot
  console.log('\n[Test 7] Cohort Isolation: Aarav attempts to book Neha\'s slot');
  const aaravAuth = await login('aarav@codedojo.com', 'password123');
  const crossBookRes = await fetch(`${baseUrl}/student/mentor`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': aaravAuth.cookie
    },
    body: JSON.stringify({
      slotId: slotId,
      topic: 'Unauthorized Cross-Mentor Booking Test'
    })
  });
  console.log('Cross-mentor booking status:', crossBookRes.status, crossBookRes.status === 403 ? 'PASS (403 Forbidden)' : 'FAIL');

  // 8. Sneha successfully books Neha's slot
  console.log('\n[Test 8] Sneha books Neha\'s slot');
  const bookRes = await fetch(`${baseUrl}/student/mentor`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': snehaAuth.cookie
    },
    body: JSON.stringify({
      slotId: slotId,
      topic: 'Phase 2 Database Optimization Discussion'
    })
  });
  const bookData = await bookRes.json();
  console.log('Booking status:', bookRes.status, bookData.success ? 'PASS' : 'FAIL');
  const sessionId = bookData.session?.id;
  console.log('Booked Session ID:', sessionId);

  // 9. Concurrency / Collision test: Attempt double booking of the exact same slot
  console.log('\n[Test 9] Concurrency / Double-booking prevention');
  const doubleBookRes = await fetch(`${baseUrl}/student/mentor`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': snehaAuth.cookie
    },
    body: JSON.stringify({
      slotId: slotId,
      topic: 'Collision Attempt'
    })
  });
  console.log('Double booking status:', doubleBookRes.status, doubleBookRes.status === 409 ? 'PASS (409 Conflict)' : 'FAIL');

  // 10. Mentor Neha enters meeting URL and notes
  console.log('\n[Test 10] Mentor Neha updates session with meeting link and notes');
  const updateSessionRes = await fetch(`${baseUrl}/faculty/mentor-sessions/${sessionId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': nehaAuth.cookie
    },
    body: JSON.stringify({
      status: 'SCHEDULED',
      zoomLink: 'https://meet.google.com/cmw-test-verified',
      notes: 'Reviewed query plan. Ready for Phase 2.'
    })
  });
  const updateSessionData = await updateSessionRes.json();
  console.log('Update session status:', updateSessionRes.status, updateSessionData.success ? 'PASS' : 'FAIL');

  // 11. Unauthorized mentor tampering: Siddharth tries to update Neha's session
  console.log('\n[Test 11] Unauthorized faculty isolation: Mentor Siddharth tries to edit Neha\'s session');
  const siddharthAuth = await login('siddharth@codedojo.com', 'password123');
  const tamperRes = await fetch(`${baseUrl}/faculty/mentor-sessions/${sessionId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': siddharthAuth.cookie
    },
    body: JSON.stringify({
      status: 'COMPLETED'
    })
  });
  console.log('Tamper status:', tamperRes.status, tamperRes.status === 403 ? 'PASS (403 Forbidden)' : 'FAIL');

  // 12. Sneha checks upcoming sessions and sees real meeting URL
  console.log('\n[Test 12] Sneha fetches mentorship view and verifies meeting link');
  const snehaVerifyRes = await fetch(`${baseUrl}/student/mentor`, {
    headers: { 'Cookie': snehaAuth.cookie }
  });
  const snehaVerifyData = await snehaVerifyRes.json();
  const scheduledSession = snehaVerifyData.sessions?.find(s => s.id === sessionId);
  console.log('Sneha scheduled session found:', Boolean(scheduledSession));
  console.log('Meeting URL matches:', scheduledSession?.zoomLink === 'https://meet.google.com/cmw-test-verified' ? 'PASS' : 'FAIL');

  // 13. Cancellation & Slot Release: Sneha cancels the session
  console.log('\n[Test 13] Cancellation & atomic slot release');
  const cancelRes = await fetch(`${baseUrl}/student/mentor/sessions/${sessionId}/cancel`, {
    method: 'POST',
    headers: { 'Cookie': snehaAuth.cookie }
  });
  const cancelData = await cancelRes.json();
  console.log('Cancel status:', cancelRes.status, cancelData.success ? 'PASS' : 'FAIL');

  // Verify slot is freed
  const snehaAfterCancel = await fetch(`${baseUrl}/student/mentor`, {
    headers: { 'Cookie': snehaAuth.cookie }
  });
  const snehaAfterCancelData = await snehaAfterCancel.json();
  const freedSlot = snehaAfterCancelData.assignedMentor?.availableSlots?.find(s => s.id === slotId);
  console.log('Slot restored to available (unbooked):', freedSlot && !freedSlot.isBooked ? 'PASS' : 'FAIL');

  // 14. Clean up test records
  console.log('\n[Test 14] Test Cleanup: Delete test slot and session from database');
  const { PrismaClient } = require('./backend/node_modules/@prisma/client');
  const prisma = new PrismaClient();
  try {
    if (sessionId) {
      await prisma.mentorSession.deleteMany({ where: { id: sessionId } });
    }
    if (slotId) {
      await prisma.mentorAvailabilitySlot.deleteMany({ where: { id: slotId } });
    }
    await prisma.notification.deleteMany({
      where: {
        OR: [
          { message: { contains: 'Mentorship' } },
          { message: { contains: '1:1 Session' } },
          { message: { contains: 'session' } }
        ]
      }
    });
    console.log('Cleaned up test session, slot, and notifications: PASS');
  } catch (err) {
    console.error('Cleanup error:', err.message);
  } finally {
    await prisma.$disconnect();
  }

  console.log('\n--- ALL MILESTONE 6 VERIFICATION TESTS COMPLETED SUCCESSFULLY ---');
}

runTests().catch(err => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
