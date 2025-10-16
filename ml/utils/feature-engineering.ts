/**
 * Feature Engineering Utilities for MindBridge ML Models
 * Prepares raw user data for machine learning inference
 */

export interface RawUserData {
  // Quiz scores
  gad7Score?: number | null;      // Anxiety (0-21)
  phq9Score?: number | null;      // Depression (0-27)
  pss10Score?: number | null;     // Stress (0-40)
  spinScore?: number | null;      // Social Anxiety (0-68)
  pdssScore?: number | null;      // Panic Disorder (0-28)
  asrsScore?: number | null;      // ADHD (0-24)
  ociScore?: number | null;       // OCD (0-72)
  pcl5Score?: number | null;      // PTSD (0-80)
  
  // Lifestyle factors
  sleepHours?: number | null;
  exerciseMinutes?: number | null;
  screenTimeHours?: number | null;
  workStress?: number | null;     // 1-5 scale
  dietQuality?: number | null;    // 1-5 scale
  socialInteraction?: number | null; // 1-5 scale
  substanceUse?: number | null;   // 1-5 scale
  
  // Demographics
  age?: number | null;
}

export interface EngineedFeatures {
  // Normalized quiz scores (0-1)
  gad7_norm: number;
  phq9_norm: number;
  pss10_norm: number;
  spin_norm: number;
  pdss_norm: number;
  asrs_norm: number;
  oci_norm: number;
  pcl5_norm: number;
  
  // Normalized lifestyle (0-1)
  sleep_norm: number;
  exercise_norm: number;
  screenTime_norm: number;
  workStress_norm: number;
  dietQuality_norm: number;
  socialInteraction_norm: number;
  substanceUse_norm: number;
  
  // Derived features
  totalMentalHealthScore: number;  // Combined severity
  lifestyleHealthScore: number;    // Overall lifestyle quality
  riskFactorCount: number;         // Number of high-risk factors
  protectiveFactorCount: number;   // Number of protective factors
  
  // Age normalized
  age_norm: number;
}

/**
 * Normalization parameters for each feature
 * Based on clinical scales and research data
 */
export const NORMALIZATION_PARAMS = {
  // Quiz score ranges
  gad7: { min: 0, max: 21 },      // GAD-7 Anxiety
  phq9: { min: 0, max: 27 },      // PHQ-9 Depression
  pss10: { min: 0, max: 40 },     // PSS-10 Stress
  spin: { min: 0, max: 68 },      // SPIN Social Anxiety
  pdss: { min: 0, max: 28 },      // PDSS Panic
  asrs: { min: 0, max: 24 },      // ASRS ADHD
  oci: { min: 0, max: 72 },       // OCI-R OCD
  pcl5: { min: 0, max: 80 },      // PCL-5 PTSD
  
  // Lifestyle ranges
  sleepHours: { min: 0, max: 14, optimal: 8 },
  exerciseMinutes: { min: 0, max: 500, optimal: 150 },
  screenTimeHours: { min: 0, max: 18, optimal: 2 },
  workStress: { min: 1, max: 5 },
  dietQuality: { min: 1, max: 5 },
  socialInteraction: { min: 1, max: 5 },
  substanceUse: { min: 1, max: 5 },
  
  // Demographics
  age: { min: 13, max: 100 },
};

/**
 * Clinical severity thresholds
 */
export const SEVERITY_THRESHOLDS = {
  gad7: { mild: 5, moderate: 10, severe: 15 },
  phq9: { mild: 5, moderate: 10, moderatelySevere: 15, severe: 20 },
  pss10: { low: 13, moderate: 20, high: 27 },
  spin: { mild: 19, moderate: 32, severe: 45 },
};

/**
 * Normalize a value to 0-1 range
 */
function normalize(value: number | null | undefined, min: number, max: number): number {
  if (value === null || value === undefined || isNaN(value)) {
    return 0;
  }
  const clamped = Math.max(min, Math.min(max, value));
  return (clamped - min) / (max - min);
}

/**
 * Calculate severity category for a quiz score
 */
export function getQuizSeverity(quizKey: string, score: number | null | undefined): 'none' | 'mild' | 'moderate' | 'severe' | 'critical' {
  if (score === null || score === undefined) return 'none';
  
  const thresholds = SEVERITY_THRESHOLDS[quizKey as keyof typeof SEVERITY_THRESHOLDS];
  if (!thresholds) return 'none';
  
  if (quizKey === 'phq9') {
    const t = thresholds as typeof SEVERITY_THRESHOLDS.phq9;
    if (score < t.mild) return 'none';
    if (score < t.moderate) return 'mild';
    if (score < t.moderatelySevere) return 'moderate';
    if (score < t.severe) return 'severe';
    return 'critical';
  } else if (quizKey === 'gad7' || quizKey === 'spin') {
    const t = thresholds as typeof SEVERITY_THRESHOLDS.gad7;
    if (score < t.mild) return 'none';
    if (score < t.moderate) return 'mild';
    if (score < t.severe) return 'moderate';
    return 'severe';
  } else if (quizKey === 'pss10') {
    const t = thresholds as typeof SEVERITY_THRESHOLDS.pss10;
    if (score < t.low) return 'mild';
    if (score < t.moderate) return 'moderate';
    if (score < t.high) return 'severe';
    return 'critical';
  }
  
  return 'none';
}

/**
 * Main feature engineering function
 * Converts raw user data into ML-ready features
 */
export function engineerFeatures(data: RawUserData): EngineedFeatures {
  const params = NORMALIZATION_PARAMS;
  
  // Normalize quiz scores
  const gad7_norm = normalize(data.gad7Score, params.gad7.min, params.gad7.max);
  const phq9_norm = normalize(data.phq9Score, params.phq9.min, params.phq9.max);
  const pss10_norm = normalize(data.pss10Score, params.pss10.min, params.pss10.max);
  const spin_norm = normalize(data.spinScore, params.spin.min, params.spin.max);
  const pdss_norm = normalize(data.pdssScore, params.pdss.min, params.pdss.max);
  const asrs_norm = normalize(data.asrsScore, params.asrs.min, params.asrs.max);
  const oci_norm = normalize(data.ociScore, params.oci.min, params.oci.max);
  const pcl5_norm = normalize(data.pcl5Score, params.pcl5.min, params.pcl5.max);
  
  // Normalize lifestyle factors
  const sleep_norm = 1 - Math.abs((data.sleepHours ?? 7) - params.sleepHours.optimal) / params.sleepHours.optimal;
  const exercise_norm = normalize(data.exerciseMinutes, params.exerciseMinutes.min, params.exerciseMinutes.optimal);
  const screenTime_norm = 1 - normalize(data.screenTimeHours, params.screenTimeHours.min, params.screenTimeHours.max);
  const workStress_norm = normalize(data.workStress, params.workStress.min, params.workStress.max);
  const dietQuality_norm = normalize(data.dietQuality, params.dietQuality.min, params.dietQuality.max);
  const socialInteraction_norm = normalize(data.socialInteraction, params.socialInteraction.min, params.socialInteraction.max);
  const substanceUse_norm = 1 - normalize(data.substanceUse, params.substanceUse.min, params.substanceUse.max);
  
  // Derived features
  const totalMentalHealthScore = (gad7_norm + phq9_norm + pss10_norm + spin_norm + pdss_norm + asrs_norm + oci_norm + pcl5_norm) / 8;
  
  const lifestyleHealthScore = (
    sleep_norm + exercise_norm + screenTime_norm + 
    (1 - workStress_norm) + dietQuality_norm + socialInteraction_norm + substanceUse_norm
  ) / 7;
  
  // Risk factor count (high severity on any quiz)
  let riskFactorCount = 0;
  if (getQuizSeverity('gad7', data.gad7Score) === 'severe' || getQuizSeverity('gad7', data.gad7Score) === 'critical') riskFactorCount++;
  if (getQuizSeverity('phq9', data.phq9Score) === 'severe' || getQuizSeverity('phq9', data.phq9Score) === 'critical') riskFactorCount++;
  if (getQuizSeverity('pss10', data.pss10Score) === 'severe' || getQuizSeverity('pss10', data.pss10Score) === 'critical') riskFactorCount++;
  if ((data.sleepHours ?? 7) < 5) riskFactorCount++;
  if ((data.workStress ?? 1) >= 4) riskFactorCount++;
  
  // Protective factor count
  let protectiveFactorCount = 0;
  if ((data.sleepHours ?? 7) >= 7 && (data.sleepHours ?? 7) <= 9) protectiveFactorCount++;
  if ((data.exerciseMinutes ?? 0) >= 150) protectiveFactorCount++;
  if ((data.socialInteraction ?? 1) >= 4) protectiveFactorCount++;
  if ((data.dietQuality ?? 1) >= 4) protectiveFactorCount++;
  
  const age_norm = normalize(data.age, params.age.min, params.age.max);
  
  return {
    gad7_norm,
    phq9_norm,
    pss10_norm,
    spin_norm,
    pdss_norm,
    asrs_norm,
    oci_norm,
    pcl5_norm,
    sleep_norm,
    exercise_norm,
    screenTime_norm,
    workStress_norm,
    dietQuality_norm,
    socialInteraction_norm,
    substanceUse_norm,
    totalMentalHealthScore,
    lifestyleHealthScore,
    riskFactorCount,
    protectiveFactorCount,
    age_norm,
  };
}

/**
 * Convert engineered features to tensor input array
 */
export function featuresToTensorInput(features: EngineedFeatures): number[] {
  return [
    features.gad7_norm,
    features.phq9_norm,
    features.pss10_norm,
    features.spin_norm,
    features.sleep_norm,
    features.exercise_norm,
    features.screenTime_norm,
    features.workStress_norm,
    features.dietQuality_norm,
    features.socialInteraction_norm,
    features.substanceUse_norm,
    features.totalMentalHealthScore,
    features.lifestyleHealthScore,
    features.riskFactorCount / 5, // Normalize count
    features.protectiveFactorCount / 4, // Normalize count
    features.age_norm,
  ];
}

/**
 * Get feature importance explanation
 */
export function explainFeatureImportance(features: EngineedFeatures): Array<{feature: string, value: number, impact: 'positive' | 'negative' | 'neutral'}> {
  const explanations = [];
  
  if (features.phq9_norm > 0.7) {
    explanations.push({ feature: 'Depression Score', value: features.phq9_norm, impact: 'negative' as const });
  }
  if (features.gad7_norm > 0.7) {
    explanations.push({ feature: 'Anxiety Score', value: features.gad7_norm, impact: 'negative' as const });
  }
  if (features.pss10_norm > 0.7) {
    explanations.push({ feature: 'Stress Level', value: features.pss10_norm, impact: 'negative' as const });
  }
  if (features.sleep_norm < 0.5) {
    explanations.push({ feature: 'Sleep Quality', value: features.sleep_norm, impact: 'negative' as const });
  }
  if (features.workStress_norm > 0.7) {
    explanations.push({ feature: 'Work Stress', value: features.workStress_norm, impact: 'negative' as const });
  }
  if (features.exercise_norm > 0.7) {
    explanations.push({ feature: 'Physical Activity', value: features.exercise_norm, impact: 'positive' as const });
  }
  if (features.socialInteraction_norm > 0.7) {
    explanations.push({ feature: 'Social Support', value: features.socialInteraction_norm, impact: 'positive' as const });
  }
  
  return explanations.sort((a, b) => b.value - a.value);
}
