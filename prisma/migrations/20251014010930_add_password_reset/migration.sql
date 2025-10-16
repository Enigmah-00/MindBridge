-- AlterTable
ALTER TABLE "User" 
  ALTER COLUMN "email" SET NOT NULL,
  ADD COLUMN "resetToken" TEXT,
  ADD COLUMN "resetTokenExpiry" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "User_resetToken_key" ON "User"("resetToken");
