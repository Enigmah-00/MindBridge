/**
 * ML Risk Assessment API
 * Predicts mental health risk level using machine learning
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getRiskPredictor } from '@/lib/ml/risk-predictor';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { user } = await requireSession();
    
    // Get user's profile and quiz scores
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    });
    
    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found. Please complete your profile first.' },
        { status: 404 }
      );
    }
    
    // Check if user has taken at least one quiz
    const hasQuizData = profile.gad7Score !== null || profile.phq9Score !== null || profile.pss10Score !== null;
    
    if (!hasQuizData) {
      return NextResponse.json(
        {
          error: 'No assessment data found',
          message: 'Please complete at least one mental health assessment to get your risk analysis.',
          suggestion: 'Take the GAD-7 (Anxiety) or PHQ-9 (Depression) assessment to get started.',
        },
        { status: 400 }
      );
    }
    
    // Prepare user data for ML model
    const userData = {
      gad7Score: profile.gad7Score,
      phq9Score: profile.phq9Score,
      pss10Score: profile.pss10Score,
      spinScore: profile.spinScore,
      pdssScore: profile.pdssScore,
      asrsScore: profile.asrsScore,
      ociScore: profile.ociScore,
      pcl5Score: profile.pcl5Score,
      sleepHours: profile.sleepHours,
      exerciseMinutes: profile.exerciseMinutes,
      screenTimeHours: profile.screenTimeHours,
      workStress: profile.workStress,
      dietQuality: profile.dietQuality,
      socialInteraction: profile.socialInteraction,
      substanceUse: profile.substanceUse,
      age: profile.age,
    };
    
    // Get risk predictor and run prediction
    const predictor = await getRiskPredictor();
    const prediction = await predictor.predict(userData);
    
    // Add contextual information
    const response = {
      ...prediction,
      timestamp: new Date().toISOString(),
      dataCompleteness: calculateDataCompleteness(profile),
      insights: generateInsights(prediction, userData),
    };
    
    return NextResponse.json(response);
    
  } catch (error: any) {
    console.error('Risk assessment error:', error);
    return NextResponse.json(
      { error: 'Failed to assess risk', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Calculate how complete the user's data is
 */
function calculateDataCompleteness(profile: any): {
  percentage: number;
  missingAreas: string[];
} {
  const fields = [
    'gad7Score', 'phq9Score', 'pss10Score',
    'sleepHours', 'exerciseMinutes', 'workStress',
    'dietQuality', 'socialInteraction', 'age'
  ];
  
  const filledFields = fields.filter(f => profile[f] !== null && profile[f] !== undefined);
  const percentage = Math.round((filledFields.length / fields.length) * 100);
  
  const missingAreas: string[] = [];
  if (!profile.gad7Score && !profile.phq9Score && !profile.pss10Score) {
    missingAreas.push('Mental health assessments');
  }
  if (!profile.sleepHours) missingAreas.push('Sleep data');
  if (!profile.exerciseMinutes) missingAreas.push('Exercise data');
  if (!profile.dietQuality) missingAreas.push('Diet information');
  
  return { percentage, missingAreas };
}

/**
 * Generate contextual insights
 */
function generateInsights(prediction: any, userData: any): string[] {
  const insights: string[] = [];
  
  if (prediction.riskLevel === 'Low') {
    insights.push('Your mental health indicators are within healthy ranges.');
    insights.push('Continue your current healthy habits to maintain well-being.');
  } else if (prediction.riskLevel === 'Moderate') {
    insights.push('Some areas show moderate concern that could benefit from attention.');
    insights.push('Early intervention now can prevent more serious issues later.');
  } else if (prediction.riskLevel === 'High') {
    insights.push('Multiple indicators suggest significant mental health challenges.');
    insights.push('Professional support is strongly recommended at this stage.');
  } else if (prediction.riskLevel === 'Critical') {
    insights.push('⚠️ Your assessment indicates urgent need for professional help.');
    insights.push('Please contact a mental health professional or crisis hotline immediately.');
  }
  
  // Add specific insights based on data
  if (userData.phq9Score && userData.phq9Score >= 15) {
    insights.push('Your depression score indicates moderate to severe symptoms.');
  }
  if (userData.gad7Score && userData.gad7Score >= 10) {
    insights.push('Your anxiety level is in the moderate to severe range.');
  }
  if (userData.sleepHours && userData.sleepHours < 6) {
    insights.push('Sleep deprivation is significantly impacting your mental health.');
  }
  
  return insights;
}

/**
 * GET endpoint to retrieve last risk assessment
 */
export async function GET(req: NextRequest) {
  try {
    const { user } = await requireSession();
    
    // Return cached prediction if available (implement caching later)
    // For now, return a message to use POST
    return NextResponse.json({
      message: 'Use POST method to generate a new risk assessment',
      endpoint: '/api/ml/risk-assessment',
    });
    
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
}
