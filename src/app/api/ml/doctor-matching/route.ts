/**
 * ML Doctor Matching API
 * Intelligently matches patients with optimal doctors
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { matchDoctors, getTopRecommendations } from '@/lib/ml/doctor-matcher';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { user } = await requireSession();
    const body = await req.json();
    
    const {
      limit = 10,
      preferences = {},
    } = body;
    
    // Get user's profile for quiz scores and location
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    });
    
    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }
    
    // Prepare user data
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
    
    // Get patient location
    const patientLocation = profile.latitude && profile.longitude
      ? { latitude: profile.latitude, longitude: profile.longitude }
      : undefined;
    
    // Fetch all doctors with their data
    const doctors = await prisma.doctor.findMany({
      include: {
        specialties: {
          include: {
            specialty: true,
          },
        },
        appointments: {
          where: {
            status: 'COMPLETED',
          },
        },
        user: {
          select: {
            id: true,
          },
        },
      },
    });
    
    // Transform doctor data for matching algorithm
    const doctorData = doctors.map(doc => ({
      id: doc.id,
      name: doc.name,
      specialties: doc.specialties.map(s => s.specialty.name),
      city: doc.city,
      country: doc.country,
      latitude: doc.latitude,
      longitude: doc.longitude,
      telehealth: doc.telehealth,
      feePerVisit: (doc as any).feePerVisit || null,
      avgRating: (doc as any).avgRating || null,
      totalReviews: (doc as any).totalReviews || 0,
      appointmentCount: doc.appointments.length,
    }));
    
    // Run matching algorithm
    const matches = getTopRecommendations(
      doctorData,
      userData,
      patientLocation,
      preferences,
      limit
    );
    
    // Add additional context for UI
    const response = {
      matches,
      patientConcerns: inferConcerns(userData),
      totalDoctors: doctorData.length,
      matchingStrategy: {
        specialtyWeight: 0.4,
        distanceWeight: 0.25,
        qualityWeight: 0.25,
        availabilityWeight: 0.1,
      },
      timestamp: new Date().toISOString(),
    };
    
    return NextResponse.json(response);
    
  } catch (error: any) {
    console.error('Doctor matching error:', error);
    return NextResponse.json(
      { error: 'Failed to match doctors', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Helper function to infer concerns (duplicated for API use)
 */
function inferConcerns(userData: any): string[] {
  const concerns: string[] = [];
  
  if (userData.gad7Score && userData.gad7Score >= 10) {
    concerns.push('Anxiety');
  }
  if (userData.phq9Score && userData.phq9Score >= 10) {
    concerns.push('Depression');
  }
  if (userData.pss10Score && userData.pss10Score >= 20) {
    concerns.push('Stress');
  }
  if (userData.spinScore && userData.spinScore >= 19) {
    concerns.push('Social Anxiety');
  }
  
  if (concerns.length === 0) {
    concerns.push('General Mental Wellness');
  }
  
  return concerns;
}

/**
 * GET endpoint - get recommended doctors for current user
 */
export async function GET(req: NextRequest) {
  try {
    const { user } = await requireSession();
    
    // Use default preferences
    const limit = 5;
    
    // Get user's profile
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    });
    
    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }
    
    // Prepare minimal user data
    const userData = {
      gad7Score: profile.gad7Score,
      phq9Score: profile.phq9Score,
      pss10Score: profile.pss10Score,
      spinScore: profile.spinScore,
    };
    
    const patientLocation = profile.latitude && profile.longitude
      ? { latitude: profile.latitude, longitude: profile.longitude }
      : undefined;
    
    // Fetch doctors
    const doctors = await prisma.doctor.findMany({
      include: {
        specialties: {
          include: {
            specialty: true,
          },
        },
        appointments: {
          where: {
            status: 'COMPLETED',
          },
        },
      },
    });
    
    const doctorData = doctors.map(doc => ({
      id: doc.id,
      name: doc.name,
      specialties: doc.specialties.map(s => s.specialty.name),
      city: doc.city,
      country: doc.country,
      latitude: doc.latitude,
      longitude: doc.longitude,
      telehealth: doc.telehealth,
      feePerVisit: (doc as any).feePerVisit || null,
      avgRating: (doc as any).avgRating || null,
      totalReviews: (doc as any).totalReviews || 0,
      appointmentCount: doc.appointments.length,
    }));
    
    const matches = getTopRecommendations(
      doctorData,
      userData,
      patientLocation,
      {},
      limit
    );
    
    return NextResponse.json({ matches });
    
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to get recommendations' },
      { status: 500 }
    );
  }
}
