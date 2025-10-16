-- CreateTable
CREATE TABLE "DailyCheckIn" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sleepHours" DOUBLE PRECISION,
    "sleepQuality" INTEGER,
    "morningMood" INTEGER,
    "morningEnergy" INTEGER,
    "eveningMood" INTEGER,
    "overallDayRating" INTEGER,
    "exerciseMinutes" INTEGER,
    "exerciseIntensity" TEXT,
    "socialInteractions" INTEGER,
    "socialQuality" INTEGER,
    "stressLevel" INTEGER,
    "stressEvents" TEXT,
    "copingStrategies" TEXT,
    "mealsEaten" INTEGER,
    "mealQuality" INTEGER,
    "caffeineIntake" INTEGER,
    "alcoholIntake" INTEGER,
    "screenTimeHours" DOUBLE PRECISION,
    "outdoorTimeMinutes" INTEGER,
    "anxietyLevel" INTEGER,
    "depressionIndicator" INTEGER,
    "intrusiveThoughts" BOOLEAN,
    "panicAttacks" BOOLEAN,
    "selfHarmThoughts" BOOLEAN,
    "medicationTaken" BOOLEAN,
    "therapySession" BOOLEAN,
    "gratitudeNote" TEXT,
    "dailyWins" TEXT,
    "difficultMoments" TEXT,
    "triggersEncountered" TEXT,
    "riskScore" DOUBLE PRECISION,
    "riskLevel" TEXT,
    "recommendedActions" TEXT,
    "aiInsights" TEXT,
    "morningComplete" BOOLEAN NOT NULL DEFAULT false,
    "eveningComplete" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyCheckIn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MentalHealthSnapshot" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "overallRiskScore" DOUBLE PRECISION NOT NULL,
    "riskLevel" TEXT NOT NULL,
    "urgency" TEXT NOT NULL,
    "anxietyScore" DOUBLE PRECISION,
    "depressionScore" DOUBLE PRECISION,
    "stressScore" DOUBLE PRECISION,
    "socialScore" DOUBLE PRECISION,
    "sleepScore" DOUBLE PRECISION,
    "riskFactors" TEXT NOT NULL,
    "protectiveFactors" TEXT NOT NULL,
    "trendDirection" TEXT,
    "changeRate" DOUBLE PRECISION,
    "lifeEvents" TEXT,
    "recentChanges" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MentalHealthSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterventionRecommendation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "interventionType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "estimatedDuration" INTEGER,
    "difficulty" TEXT,
    "priority" INTEGER NOT NULL,
    "relevanceScore" DOUBLE PRECISION NOT NULL,
    "reasonsWhy" TEXT NOT NULL,
    "expectedBenefit" TEXT,
    "actionSteps" TEXT NOT NULL,
    "resourceLinks" TEXT,
    "status" TEXT NOT NULL DEFAULT 'suggested',
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "userFeedback" INTEGER,
    "effectiveness" DOUBLE PRECISION,
    "completionNotes" TEXT,
    "wouldRecommendAgain" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InterventionRecommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrisisEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "triggerSource" TEXT NOT NULL,
    "triggerContent" TEXT NOT NULL,
    "crisisType" TEXT NOT NULL,
    "severityLevel" INTEGER NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "recentMessages" TEXT,
    "recentCheckIns" TEXT,
    "historyRelevant" TEXT,
    "responseProvided" TEXT NOT NULL,
    "resourcesOffered" TEXT NOT NULL,
    "humanEscalated" BOOLEAN NOT NULL DEFAULT false,
    "escalatedTo" TEXT,
    "escalatedAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'active',
    "resolution" TEXT,
    "userSafe" BOOLEAN,
    "followUpScheduled" BOOLEAN NOT NULL DEFAULT false,
    "safetyPlanCreated" BOOLEAN NOT NULL DEFAULT false,
    "emergencyContacts" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CrisisEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPreference" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "preferredCheckInTime" TEXT,
    "reminderFrequency" TEXT,
    "communicationStyle" TEXT,
    "preferredActivities" TEXT,
    "avoidActivities" TEXT,
    "effectiveStrategies" TEXT,
    "emergencyContacts" TEXT,
    "safetyPlan" TEXT,
    "therapistInfo" TEXT,
    "shareWithTherapist" BOOLEAN NOT NULL DEFAULT false,
    "therapistUserId" TEXT,
    "userSegment" TEXT,
    "engagementLevel" TEXT,
    "responsePatterns" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutcomeTracking" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "measurementDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "symptomImprovement" DOUBLE PRECISION,
    "functionalStatus" INTEGER,
    "qualityOfLife" INTEGER,
    "checkInStreak" INTEGER,
    "interventionsUsed" INTEGER,
    "interventionsCompleted" INTEGER,
    "riskTrend" TEXT,
    "crisisEvents" INTEGER,
    "crisisPrevented" INTEGER,
    "therapyAttendance" INTEGER,
    "medicationAdherence" DOUBLE PRECISION,
    "perceivedProgress" INTEGER,
    "satisfactionScore" INTEGER,
    "wouldRecommend" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OutcomeTracking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DailyCheckIn_userId_date_idx" ON "DailyCheckIn"("userId", "date");

-- CreateIndex
CREATE INDEX "DailyCheckIn_userId_riskLevel_idx" ON "DailyCheckIn"("userId", "riskLevel");

-- CreateIndex
CREATE UNIQUE INDEX "DailyCheckIn_userId_date_key" ON "DailyCheckIn"("userId", "date");

-- CreateIndex
CREATE INDEX "MentalHealthSnapshot_userId_timestamp_idx" ON "MentalHealthSnapshot"("userId", "timestamp");

-- CreateIndex
CREATE INDEX "MentalHealthSnapshot_userId_riskLevel_idx" ON "MentalHealthSnapshot"("userId", "riskLevel");

-- CreateIndex
CREATE INDEX "InterventionRecommendation_userId_status_idx" ON "InterventionRecommendation"("userId", "status");

-- CreateIndex
CREATE INDEX "InterventionRecommendation_userId_timestamp_idx" ON "InterventionRecommendation"("userId", "timestamp");

-- CreateIndex
CREATE INDEX "CrisisEvent_userId_timestamp_idx" ON "CrisisEvent"("userId", "timestamp");

-- CreateIndex
CREATE INDEX "CrisisEvent_userId_status_idx" ON "CrisisEvent"("userId", "status");

-- CreateIndex
CREATE INDEX "CrisisEvent_crisisType_status_idx" ON "CrisisEvent"("crisisType", "status");

-- CreateIndex
CREATE UNIQUE INDEX "UserPreference_userId_key" ON "UserPreference"("userId");

-- CreateIndex
CREATE INDEX "OutcomeTracking_userId_measurementDate_idx" ON "OutcomeTracking"("userId", "measurementDate");
