-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userMessage" TEXT NOT NULL,
    "botResponse" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ChatMessage_userId_timestamp_idx" ON "ChatMessage"("userId", "timestamp");
