import { NextResponse } from 'next/server';
import { verifyJwt } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('mb_token')?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyJwt(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Check if check-in exists for today
    const existingCheckIn = await prisma.dailyCheckIn.findFirst({
      where: {
        userId: user.id,
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    // Calculate risk score based on provided data
    const riskScore = calculateRiskScore(body);
    const riskLevel = getRiskLevel(riskScore);
    const recommendedActions = getRecommendedActions(riskScore, riskLevel);

    // Prepare data - only include fields that are provided
    const checkInData: any = {
      userId: user.id,
      date: today,
      riskScore,
      riskLevel,
      recommendedActions: JSON.stringify(recommendedActions),
      morningComplete: body.morningComplete !== false, // Default to true if not specified
      eveningComplete: body.eveningComplete !== false, // Default to true if not specified
    };

    // Add fields only if they exist in the request body
    const fields = [
      'sleepHours', 'sleepQuality', 'morningMood', 'morningEnergy', 'medicationTaken',
      'eveningMood', 'overallDayRating', 'exerciseMinutes', 'socialInteractions',
      'socialQuality', 'stressLevel', 'stressEvents', 'anxietyLevel', 
      'depressionIndicator', 'intrusiveThoughts', 'panicAttacks', 'selfHarmThoughts',
      'gratitudeNote', 'dailyWins', 'copingStrategies'
    ];

    fields.forEach(field => {
      if (body[field] !== undefined && body[field] !== null) {
        checkInData[field] = body[field];
      }
    });

    let checkIn;
    if (existingCheckIn) {
      // Update existing check-in (merge with existing data)
      checkIn = await prisma.dailyCheckIn.update({
        where: { id: existingCheckIn.id },
        data: checkInData,
      });
    } else {
      // Create new check-in
      checkIn = await prisma.dailyCheckIn.create({
        data: checkInData,
      });
    }

    return NextResponse.json({ success: true, checkIn, riskScore, riskLevel, recommendedActions });
  } catch (error) {
    console.error("Check-in submission error:", error);
    return NextResponse.json({ error: "Failed to submit check-in" }, { status: 500 });
  }
}

// Simple risk calculation algorithm (will be replaced with ML model in Phase 3)
function calculateRiskScore(checkIn: any): number {
  let score = 50; // Base score

  // Sleep factors
  if (checkIn.sleepHours) {
    if (checkIn.sleepHours < 5) score += 15;
    else if (checkIn.sleepHours < 6) score += 10;
    else if (checkIn.sleepHours < 7) score += 5;
    else if (checkIn.sleepHours > 9) score += 5;
  }

  if (checkIn.sleepQuality && checkIn.sleepQuality < 3) {
    score += 10;
  }

  // Mood factors
  if (checkIn.morningMood && checkIn.morningMood < 4) score += 15;
  if (checkIn.eveningMood && checkIn.eveningMood < 4) score += 15;

  // Energy
  if (checkIn.morningEnergy && checkIn.morningEnergy < 3) score += 10;

  // Stress
  if (checkIn.stressLevel) {
    if (checkIn.stressLevel > 7) score += 15;
    else if (checkIn.stressLevel > 5) score += 10;
  }

  // Mental health indicators
  if (checkIn.anxietyLevel && checkIn.anxietyLevel > 7) score += 15;
  if (checkIn.depressionIndicator && checkIn.depressionIndicator > 7) score += 15;

  // Critical indicators
  if (checkIn.selfHarmThoughts) score += 30;
  if (checkIn.panicAttacks) score += 15;
  if (checkIn.intrusiveThoughts) score += 10;

  // Protective factors
  if (checkIn.exerciseMinutes && checkIn.exerciseMinutes > 20) score -= 10;
  if (checkIn.socialInteractions && checkIn.socialInteractions > 3) score -= 5;
  if (checkIn.copingStrategies && checkIn.copingStrategies.length > 10) score -= 5;
  if (checkIn.gratitudeNote && checkIn.gratitudeNote.length > 10) score -= 5;

  // Clamp between 0 and 100
  return Math.max(0, Math.min(100, score));
}

function getRiskLevel(score: number): string {
  if (score >= 75) return 'critical';
  if (score >= 60) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
}

function getRecommendedActions(riskLevel: string): string[] {
  switch (riskLevel) {
    case 'critical':
      return [
        'Please reach out to a mental health professional immediately',
        'Contact: National Suicide Prevention Lifeline at 988',
        'Talk to a trusted friend or family member',
        'Consider visiting your nearest emergency room if you feel unsafe',
      ];
    case 'high':
      return [
        'Schedule an appointment with a therapist or counselor',
        'Practice deep breathing or meditation for 10 minutes',
        'Reach out to a friend or family member',
        'Avoid alcohol and caffeine',
      ];
    case 'medium':
      return [
        'Try a 20-minute walk or light exercise',
        'Practice mindfulness or meditation',
        'Connect with a friend',
        'Ensure you get 7-8 hours of sleep tonight',
      ];
    default:
      return [
        'Keep up the good work!',
        'Maintain your healthy habits',
        'Stay connected with loved ones',
        'Continue prioritizing self-care',
      ];
  }
}
