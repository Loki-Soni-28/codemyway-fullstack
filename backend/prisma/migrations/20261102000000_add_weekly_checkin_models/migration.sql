-- CreateEnum
CREATE TYPE "WeeklyCheckInStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'COMPLETED', 'SKIPPED');

-- CreateEnum
CREATE TYPE "CheckInStudentStatus" AS ENUM ('ASSIGNED', 'SCHEDULED', 'REVIEW_PENDING', 'COMPLETED', 'MISSED');

-- CreateEnum
CREATE TYPE "CheckInFeedbackStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "CheckInAuditAction" AS ENUM ('CHECKIN_CREATED', 'CHECKIN_STATUS_CHANGED', 'CHECKIN_COMPLETED', 'STUDENTS_ALLOCATED', 'STUDENT_REASSIGNED', 'STUDENT_SCHEDULED', 'FEEDBACK_DRAFT_SAVED', 'FEEDBACK_PUBLISHED', 'ACTION_ITEM_CREATED', 'ACTION_ITEM_STATUS_CHANGED');

-- CreateEnum
CREATE TYPE "OutboxNotificationStatus" AS ENUM ('PENDING', 'PROCESSING', 'SENT', 'FAILED');

-- CreateTable
CREATE TABLE "BatchTeacher" (
    "id" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BatchTeacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeeklyCheckIn" (
    "id" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "weekNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "status" "WeeklyCheckInStatus" NOT NULL DEFAULT 'DRAFT',
    "scheduledStartDate" TIMESTAMP(3) NOT NULL,
    "scheduledEndDate" TIMESTAMP(3) NOT NULL,
    "defaultDurationMinutes" INTEGER NOT NULL DEFAULT 30,
    "skipReason" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeeklyCheckIn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeeklyCheckInStudent" (
    "id" TEXT NOT NULL,
    "checkInId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "status" "CheckInStudentStatus" NOT NULL DEFAULT 'ASSIGNED',
    "scheduledStartAt" TIMESTAMP(3),
    "scheduledEndAt" TIMESTAMP(3),
    "meetingUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeeklyCheckInStudent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeeklyCheckInFeedback" (
    "id" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "status" "CheckInFeedbackStatus" NOT NULL DEFAULT 'DRAFT',
    "strengths" TEXT,
    "areasForImprovement" TEXT,
    "generalFeedback" TEXT,
    "nextWeekGoals" TEXT,
    "attendanceRating" INTEGER,
    "taskCompletionScore" INTEGER,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeeklyCheckInFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeeklyCheckInActionItem" (
    "id" TEXT NOT NULL,
    "feedbackId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeeklyCheckInActionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeeklyCheckInAuditLog" (
    "id" TEXT NOT NULL,
    "checkInId" TEXT NOT NULL,
    "actorId" TEXT,
    "action" "CheckInAuditAction" NOT NULL,
    "metadata" JSONB,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WeeklyCheckInAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckInNotificationOutbox" (
    "id" TEXT NOT NULL,
    "checkInId" TEXT NOT NULL,
    "assignmentId" TEXT,
    "eventType" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" "OutboxNotificationStatus" NOT NULL DEFAULT 'PENDING',
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "lockedAt" TIMESTAMP(3),
    "leaseUntil" TIMESTAMP(3),
    "lastError" TEXT,
    "idempotencyKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CheckInNotificationOutbox_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BatchTeacher_teacherId_isActive_idx" ON "BatchTeacher"("teacherId", "isActive");

-- CreateIndex
CREATE INDEX "BatchTeacher_batchId_isActive_idx" ON "BatchTeacher"("batchId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "BatchTeacher_batchId_teacherId_key" ON "BatchTeacher"("batchId", "teacherId");

-- CreateIndex
CREATE INDEX "WeeklyCheckIn_batchId_status_idx" ON "WeeklyCheckIn"("batchId", "status");

-- CreateIndex
CREATE INDEX "WeeklyCheckIn_scheduledStartDate_scheduledEndDate_idx" ON "WeeklyCheckIn"("scheduledStartDate", "scheduledEndDate");

-- CreateIndex
CREATE UNIQUE INDEX "WeeklyCheckIn_batchId_weekNumber_key" ON "WeeklyCheckIn"("batchId", "weekNumber");

-- CreateIndex
CREATE INDEX "WeeklyCheckInStudent_checkInId_teacherId_idx" ON "WeeklyCheckInStudent"("checkInId", "teacherId");

-- CreateIndex
CREATE INDEX "WeeklyCheckInStudent_teacherId_status_idx" ON "WeeklyCheckInStudent"("teacherId", "status");

-- CreateIndex
CREATE INDEX "WeeklyCheckInStudent_studentId_status_idx" ON "WeeklyCheckInStudent"("studentId", "status");

-- CreateIndex
CREATE INDEX "WeeklyCheckInStudent_scheduledStartAt_scheduledEndAt_idx" ON "WeeklyCheckInStudent"("scheduledStartAt", "scheduledEndAt");

-- CreateIndex
CREATE UNIQUE INDEX "WeeklyCheckInStudent_checkInId_studentId_key" ON "WeeklyCheckInStudent"("checkInId", "studentId");

-- CreateIndex
CREATE UNIQUE INDEX "WeeklyCheckInFeedback_assignmentId_key" ON "WeeklyCheckInFeedback"("assignmentId");

-- CreateIndex
CREATE INDEX "WeeklyCheckInFeedback_status_idx" ON "WeeklyCheckInFeedback"("status");

-- CreateIndex
CREATE INDEX "WeeklyCheckInFeedback_publishedAt_idx" ON "WeeklyCheckInFeedback"("publishedAt");

-- CreateIndex
CREATE INDEX "WeeklyCheckInActionItem_feedbackId_isCompleted_idx" ON "WeeklyCheckInActionItem"("feedbackId", "isCompleted");

-- CreateIndex
CREATE INDEX "WeeklyCheckInAuditLog_checkInId_occurredAt_idx" ON "WeeklyCheckInAuditLog"("checkInId", "occurredAt");

-- CreateIndex
CREATE INDEX "WeeklyCheckInAuditLog_actorId_occurredAt_idx" ON "WeeklyCheckInAuditLog"("actorId", "occurredAt");

-- CreateIndex
CREATE UNIQUE INDEX "CheckInNotificationOutbox_idempotencyKey_key" ON "CheckInNotificationOutbox"("idempotencyKey");

-- CreateIndex
CREATE INDEX "CheckInNotificationOutbox_status_leaseUntil_createdAt_idx" ON "CheckInNotificationOutbox"("status", "leaseUntil", "createdAt");

-- CreateIndex
CREATE INDEX "CheckInNotificationOutbox_checkInId_idx" ON "CheckInNotificationOutbox"("checkInId");

-- AddForeignKey
ALTER TABLE "BatchTeacher" ADD CONSTRAINT "BatchTeacher_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BatchTeacher" ADD CONSTRAINT "BatchTeacher_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyCheckIn" ADD CONSTRAINT "WeeklyCheckIn_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyCheckIn" ADD CONSTRAINT "WeeklyCheckIn_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyCheckInStudent" ADD CONSTRAINT "WeeklyCheckInStudent_checkInId_fkey" FOREIGN KEY ("checkInId") REFERENCES "WeeklyCheckIn"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyCheckInStudent" ADD CONSTRAINT "WeeklyCheckInStudent_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyCheckInStudent" ADD CONSTRAINT "WeeklyCheckInStudent_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyCheckInFeedback" ADD CONSTRAINT "WeeklyCheckInFeedback_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "WeeklyCheckInStudent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyCheckInActionItem" ADD CONSTRAINT "WeeklyCheckInActionItem_feedbackId_fkey" FOREIGN KEY ("feedbackId") REFERENCES "WeeklyCheckInFeedback"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyCheckInAuditLog" ADD CONSTRAINT "WeeklyCheckInAuditLog_checkInId_fkey" FOREIGN KEY ("checkInId") REFERENCES "WeeklyCheckIn"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyCheckInAuditLog" ADD CONSTRAINT "WeeklyCheckInAuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Custom Check Constraints
ALTER TABLE "WeeklyCheckInFeedback"
  ADD CONSTRAINT "check_attendance_rating"
  CHECK ("attendanceRating" IS NULL OR ("attendanceRating" >= 1 AND "attendanceRating" <= 5));

ALTER TABLE "WeeklyCheckInFeedback"
  ADD CONSTRAINT "check_task_completion_score"
  CHECK ("taskCompletionScore" IS NULL OR ("taskCompletionScore" >= 0 AND "taskCompletionScore" <= 100));

ALTER TABLE "WeeklyCheckIn"
  ADD CONSTRAINT "check_positive_week_number"
  CHECK ("weekNumber" > 0);

ALTER TABLE "WeeklyCheckIn"
  ADD CONSTRAINT "check_window_ordering"
  CHECK ("scheduledStartDate" < "scheduledEndDate");

ALTER TABLE "WeeklyCheckIn"
  ADD CONSTRAINT "check_duration_minutes"
  CHECK ("defaultDurationMinutes" IN (15, 30, 45, 60));

ALTER TABLE "WeeklyCheckIn"
  ADD CONSTRAINT "check_skip_reason_present"
  CHECK ("status" != 'SKIPPED' OR ("skipReason" IS NOT NULL AND length(trim("skipReason")) > 0));

ALTER TABLE "WeeklyCheckInStudent"
  ADD CONSTRAINT "check_session_timestamps"
  CHECK (
    ("scheduledStartAt" IS NULL AND "scheduledEndAt" IS NULL) OR
    ("scheduledStartAt" IS NOT NULL AND "scheduledEndAt" IS NOT NULL AND "scheduledStartAt" < "scheduledEndAt")
  );

-- Custom PostgreSQL Append-Only Trigger for WeeklyCheckInAuditLog
CREATE OR REPLACE FUNCTION prevent_audit_tampering()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'WeeklyCheckInAuditLog is append-only. Modification and deletion are prohibited.';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "trig_audit_append_only"
BEFORE UPDATE OR DELETE ON "WeeklyCheckInAuditLog"
FOR EACH ROW EXECUTE FUNCTION prevent_audit_tampering();
