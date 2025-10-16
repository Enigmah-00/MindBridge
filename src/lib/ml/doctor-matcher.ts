/**
 * Intelligent Doctor Matching Algorithm
 * Matches patients with optimal doctors based on ML-powered scoring
 */

import { engineerFeatures, getQuizSeverity, type RawUserData } from '../../../ml/utils/feature-engineering';

export interface DoctorData {
  id: string;
  name: string;
  specialties: string[];
  city?: string | null;
  country?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  telehealth: boolean;
  feePerVisit?: number | null;
  avgRating?: number | null;
  totalReviews: number;
  appointmentCount: number;
}

export interface PatientPreferences {
  maxDistance?: number; // in km
  preferTelehealth?: boolean;
  maxFee?: number;
  specialtyPreference?: string[];
}

export interface DoctorMatch {
  doctor: DoctorData;
  matchScore: number; // 0-1
  matchPercentage: number; // 0-100
  reasons: string[];
  specialtyMatch: number;
  distanceScore: number;
  qualityScore: number;
  availabilityScore: number;
  distance?: number; // in km
}

/**
 * Calculate distance between two lat/lng points using Haversine formula
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Infer patient's primary concerns from quiz scores
 */
function inferConcerns(userData: RawUserData): string[] {
  const concerns: string[] = [];
  
  if (userData.gad7Score && userData.gad7Score >= 10) {
    concerns.push('anxiety');
  }
  if (userData.phq9Score && userData.phq9Score >= 10) {
    concerns.push('depression');
  }
  if (userData.pss10Score && userData.pss10Score >= 20) {
    concerns.push('stress');
  }
  if (userData.spinScore && userData.spinScore >= 19) {
    concerns.push('social-anxiety');
  }
  if (userData.pdssScore && userData.pdssScore >= 8) {
    concerns.push('panic');
  }
  if (userData.asrsScore && userData.asrsScore >= 14) {
    concerns.push('adhd');
  }
  if (userData.ociScore && userData.ociScore >= 21) {
    concerns.push('ocd');
  }
  if (userData.pcl5Score && userData.pcl5Score >= 33) {
    concerns.push('ptsd');
  }
  
  // If no specific concerns, check for mild symptoms
  if (concerns.length === 0) {
    if (userData.gad7Score && userData.gad7Score >= 5) concerns.push('mild-anxiety');
    if (userData.phq9Score && userData.phq9Score >= 5) concerns.push('mild-depression');
  }
  
  return concerns;
}

/**
 * Map concerns to specialist types
 */
function concernToSpecialtyMap(concern: string): string[] {
  const map: Record<string, string[]> = {
    'anxiety': ['psychiatry', 'therapy', 'anxiety-disorders'],
    'depression': ['psychiatry', 'therapy', 'mood-disorders'],
    'stress': ['therapy', 'stress-management', 'counseling'],
    'social-anxiety': ['therapy', 'anxiety-disorders', 'social-skills'],
    'panic': ['psychiatry', 'anxiety-disorders', 'panic-disorder'],
    'adhd': ['psychiatry', 'adhd-specialist', 'cognitive-therapy'],
    'ocd': ['psychiatry', 'ocd-specialist', 'cognitive-behavioral-therapy'],
    'ptsd': ['psychiatry', 'trauma-therapy', 'ptsd-specialist'],
    'mild-anxiety': ['therapy', 'counseling'],
    'mild-depression': ['therapy', 'counseling'],
    'sleep': ['sleep-medicine', 'psychiatry'],
  };
  
  return map[concern] || ['therapy', 'psychiatry'];
}

/**
 * Calculate specialty match score
 */
function calculateSpecialtyMatch(
  patientConcerns: string[],
  doctorSpecialties: string[],
  preferences: PatientPreferences
): { score: number; reasons: string[] } {
  if (patientConcerns.length === 0) {
    return { score: 0.5, reasons: ['General mental health support'] };
  }
  
  const normalizedDoctorSpecialties = doctorSpecialties.map(s => 
    s.toLowerCase().replace(/\s+/g, '-')
  );
  
  let matchCount = 0;
  const reasons: string[] = [];
  
  for (const concern of patientConcerns) {
    const requiredSpecialties = concernToSpecialtyMap(concern);
    
    for (const required of requiredSpecialties) {
      if (normalizedDoctorSpecialties.some(ds => ds.includes(required) || required.includes(ds))) {
        matchCount++;
        
        // Add reason for first few matches
        if (reasons.length < 2) {
          const concernName = concern.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
          reasons.push(`Specializes in ${concernName}`);
        }
        break; // Count each concern only once
      }
    }
  }
  
  const score = Math.min(1.0, matchCount / Math.max(1, patientConcerns.length));
  
  if (reasons.length === 0) {
    reasons.push('Experienced mental health professional');
  }
  
  return { score, reasons };
}

/**
 * Calculate distance score (closer is better)
 */
function calculateDistanceScore(
  distance: number | undefined,
  preferTelehealth: boolean,
  telehealth: boolean
): number {
  // If telehealth is available and preferred, distance doesn't matter
  if (telehealth && preferTelehealth) {
    return 1.0;
  }
  
  if (distance === undefined) {
    return telehealth ? 0.8 : 0.5; // Moderate score if distance unknown
  }
  
  // Score decreases with distance
  // 0-10km: 1.0, 10-25km: 0.8, 25-50km: 0.6, 50-100km: 0.4, 100+km: 0.2
  if (distance <= 10) return 1.0;
  if (distance <= 25) return 0.8;
  if (distance <= 50) return 0.6;
  if (distance <= 100) return 0.4;
  return 0.2;
}

/**
 * Calculate quality score based on ratings and experience
 */
function calculateQualityScore(
  avgRating: number | null | undefined,
  totalReviews: number,
  appointmentCount: number
): number {
  let score = 0.5; // Base score
  
  // Rating contribution (0-0.4)
  if (avgRating && avgRating > 0) {
    score += (avgRating / 5) * 0.4;
  }
  
  // Review count contribution (0-0.2)
  const reviewScore = Math.min(1.0, totalReviews / 50) * 0.2;
  score += reviewScore;
  
  // Experience contribution (0-0.2)
  const experienceScore = Math.min(1.0, appointmentCount / 100) * 0.2;
  score += experienceScore;
  
  return Math.min(1.0, score);
}

/**
 * Main doctor matching function
 */
export function matchDoctors(
  doctors: DoctorData[],
  userData: RawUserData,
  patientLocation?: { latitude: number; longitude: number },
  preferences: PatientPreferences = {}
): DoctorMatch[] {
  // Infer patient concerns from quiz scores
  const patientConcerns = inferConcerns(userData);
  
  // Calculate match score for each doctor
  const matches: DoctorMatch[] = doctors.map(doctor => {
    // 1. Specialty Match (40% weight)
    const { score: specialtyMatch, reasons: specialtyReasons } = calculateSpecialtyMatch(
      patientConcerns,
      doctor.specialties,
      preferences
    );
    
    // 2. Distance Score (25% weight)
    let distance: number | undefined;
    if (patientLocation && doctor.latitude && doctor.longitude) {
      distance = calculateDistance(
        patientLocation.latitude,
        patientLocation.longitude,
        doctor.latitude,
        doctor.longitude
      );
    }
    
    const distanceScore = calculateDistanceScore(
      distance,
      preferences.preferTelehealth || false,
      doctor.telehealth
    );
    
    // 3. Quality Score (25% weight)
    const qualityScore = calculateQualityScore(
      doctor.avgRating,
      doctor.totalReviews,
      doctor.appointmentCount
    );
    
    // 4. Availability Score (10% weight)
    // Higher appointment count suggests more availability/capacity
    const availabilityScore = doctor.appointmentCount > 0 ? 0.8 : 0.5;
    
    // Calculate weighted match score
    const matchScore =
      specialtyMatch * 0.4 +
      distanceScore * 0.25 +
      qualityScore * 0.25 +
      availabilityScore * 0.1;
    
    // Build reasons
    const reasons: string[] = [...specialtyReasons];
    
    if (doctor.telehealth) {
      reasons.push('Offers telehealth appointments');
    }
    
    if (distance !== undefined && distance <= 10) {
      reasons.push(`Nearby location (${distance.toFixed(1)} km away)`);
    }
    
    if (doctor.avgRating && doctor.avgRating >= 4.5) {
      reasons.push(`Highly rated (${doctor.avgRating.toFixed(1)}/5.0 stars)`);
    }
    
    if (doctor.totalReviews >= 20) {
      reasons.push(`Experienced with ${doctor.totalReviews}+ patient reviews`);
    }
    
    // Fee check
    if (preferences.maxFee && doctor.feePerVisit && doctor.feePerVisit <= preferences.maxFee) {
      reasons.push(`Consultation fee within budget`);
    }
    
    return {
      doctor,
      matchScore,
      matchPercentage: Math.round(matchScore * 100),
      reasons: reasons.slice(0, 4), // Top 4 reasons
      specialtyMatch,
      distanceScore,
      qualityScore,
      availabilityScore,
      distance,
    };
  });
  
  // Filter by preferences
  let filteredMatches = matches;
  
  if (preferences.maxDistance !== undefined && patientLocation) {
    filteredMatches = filteredMatches.filter(
      m => m.distance === undefined || m.distance <= preferences.maxDistance! || m.doctor.telehealth
    );
  }
  
  if (preferences.maxFee !== undefined) {
    filteredMatches = filteredMatches.filter(
      m => !m.doctor.feePerVisit || m.doctor.feePerVisit <= preferences.maxFee!
    );
  }
  
  // Sort by match score (highest first)
  filteredMatches.sort((a, b) => b.matchScore - a.matchScore);
  
  return filteredMatches;
}

/**
 * Get top N doctor recommendations
 */
export function getTopRecommendations(
  doctors: DoctorData[],
  userData: RawUserData,
  patientLocation?: { latitude: number; longitude: number },
  preferences: PatientPreferences = {},
  limit: number = 5
): DoctorMatch[] {
  const matches = matchDoctors(doctors, userData, patientLocation, preferences);
  return matches.slice(0, limit);
}
