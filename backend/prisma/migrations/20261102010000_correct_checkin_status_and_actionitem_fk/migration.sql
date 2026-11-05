-- Step 1: Drop the check constraint that references the enum
ALTER TABLE "WeeklyCheckIn" DROP CONSTRAINT IF EXISTS "check_skip_reason_present";

-- Step 2: Drop the status index
DROP INDEX IF EXISTS "WeeklyCheckIn_batchId_status_idx";

-- Step 3: Create the replacement enum with the exact approved values
CREATE TYPE "WeeklyCheckInStatus_new" AS ENUM ('DRAFT', 'ACTIVE', 'COMPLETED', 'SKIPPED');

-- Step 4: Drop default, convert column directly to new enum type, mapping any PUBLISHED to ACTIVE
ALTER TABLE "WeeklyCheckIn" ALTER COLUMN "status" DROP DEFAULT;

ALTER TABLE "WeeklyCheckIn"
  ALTER COLUMN "status" TYPE "WeeklyCheckInStatus_new"
  USING (
    CASE "status"::text
      WHEN 'PUBLISHED' THEN 'ACTIVE'::"WeeklyCheckInStatus_new"
      ELSE "status"::text::"WeeklyCheckInStatus_new"
    END
  );

-- Step 5: Replace old enum type with new enum type
ALTER TYPE "WeeklyCheckInStatus" RENAME TO "WeeklyCheckInStatus_old";
ALTER TYPE "WeeklyCheckInStatus_new" RENAME TO "WeeklyCheckInStatus";
DROP TYPE "WeeklyCheckInStatus_old";

-- Step 6: Restore default, index, and check constraint
ALTER TABLE "WeeklyCheckIn" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
CREATE INDEX "WeeklyCheckIn_batchId_status_idx" ON "WeeklyCheckIn"("batchId", "status");
ALTER TABLE "WeeklyCheckIn"
  ADD CONSTRAINT "check_skip_reason_present"
  CHECK ("status" != 'SKIPPED' OR ("skipReason" IS NOT NULL AND length(trim("skipReason")) > 0));

-- Step 7: Update foreign key on WeeklyCheckInActionItem to onDelete: Restrict
ALTER TABLE "WeeklyCheckInActionItem" DROP CONSTRAINT "WeeklyCheckInActionItem_feedbackId_fkey";
ALTER TABLE "WeeklyCheckInActionItem" ADD CONSTRAINT "WeeklyCheckInActionItem_feedbackId_fkey" FOREIGN KEY ("feedbackId") REFERENCES "WeeklyCheckInFeedback"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
