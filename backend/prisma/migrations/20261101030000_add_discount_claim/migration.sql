-- AlterTable
ALTER TABLE "Payment" ADD COLUMN "discountPercent" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "discountClaimId" TEXT;

-- CreateTable
CREATE TABLE "DiscountClaim" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "courseSlug" TEXT NOT NULL,
    "percent" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "redeemedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DiscountClaim_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DiscountClaim_email_key" ON "DiscountClaim"("email");
