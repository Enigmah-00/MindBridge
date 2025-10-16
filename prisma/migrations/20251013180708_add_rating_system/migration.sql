-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "rating" INTEGER,
ADD COLUMN     "review" TEXT,
ADD COLUMN     "reviewedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Doctor" ADD COLUMN     "avgRating" DOUBLE PRECISION,
ADD COLUMN     "totalReviews" INTEGER NOT NULL DEFAULT 0;
