import type { Profile } from "@prisma/client";

export type Suggestion = {
  area: string;
  issue: string;
  possibleEffects: string[];
  actions: string[];
  severity: "low" | "moderate" | "high";
  reason: string;
};

export function suggestionsFromProfile(p: Profile): Suggestion[] {
  const out: Suggestion[] = [];
  if (p.sleepHours != null && p.sleepHours < 6) {
    out.push({
      area: "sleep",
      issue: "Insufficient sleep",
      possibleEffects: ["Mood dysregulation", "Anxiety increase", "Cognitive decline"],
      actions: [
        "Keep a consistent sleep schedule",
        "Limit screens 1 hour before bed",
        "Get 15–30 minutes of morning light"
      ],
      severity: p.sleepHours < 5 ? "high" : "moderate",
      reason: `Reported ${p.sleepHours}h sleep`,
    });
  }
  if (p.exerciseMinutes != null && p.exerciseMinutes < 90) {
    out.push({
      area: "exercise",
      issue: "Low physical activity",
      possibleEffects: ["Lower mood", "Higher stress"],
      actions: ["Aim for 150 min/week moderate exercise", "Short daily walks"],
      severity: "moderate",
      reason: `Reported ${p.exerciseMinutes} min/week`,
    });
  }
  if (p.workStress != null && p.workStress >= 4) {
    out.push({
      area: "stress",
      issue: "High work stress",
      possibleEffects: ["Burnout risk", "Anxiety", "Sleep disruption"],
      actions: ["Micro-breaks", "Boundaries and recovery time", "Breathing techniques"],
      severity: "high",
      reason: `Reported work stress ${p.workStress}/5`,
    });
  }
  // Add dietQuality, socialInteraction, substanceUse, screenTimeHours as needed
  return out;
}

export function deriveConcernsFromProfile(p: Profile) {
  const concerns: { concern: string; score: number }[] = [];
  if (p.sleepHours != null && p.sleepHours < 6) {
    concerns.push({ concern: "sleep", score: 0.7 });
  }
  if (p.workStress != null && p.workStress >= 4) {
    concerns.push({ concern: "anxiety", score: 0.6 });
  }
  return concerns;
}