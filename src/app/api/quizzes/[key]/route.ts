import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET(_: NextRequest, { params }: { params: { key: string } }) {
  const key = decodeURIComponent(params.key);
  const quiz = await prisma.quiz.findUnique({
    where: { key },
    include: { questions: { include: { options: true }, orderBy: { order: "asc" } } },
  });
  if (!quiz) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(quiz);
}

export async function POST(req: NextRequest, { params }: { params: { key: string } }) {
  const { user } = await requireSession();
  const key = decodeURIComponent(params.key);
  const { answers } = await req.json() as { answers: { questionId: string; optionId: string; value: number }[] };

  const quiz = await prisma.quiz.findUnique({ where: { key } });
  if (!quiz) return NextResponse.json({ error: "Quiz not found" }, { status: 404 });

  const totalScore = answers.reduce((s, a) => s + (a.value ?? 0), 0);
  let band = "minimal";
  
  // Determine severity band based on quiz type
  if (key === "PHQ-9") {
    if (totalScore >= 20) band = "severe";
    else if (totalScore >= 15) band = "moderately severe";
    else if (totalScore >= 10) band = "moderate";
    else if (totalScore >= 5) band = "mild";
  } else if (key === "GAD-7") {
    if (totalScore >= 15) band = "severe";
    else if (totalScore >= 10) band = "moderate";
    else if (totalScore >= 5) band = "mild";
  } else if (key === "PSS-10") {
    if (totalScore >= 27) band = "high stress";
    else if (totalScore >= 14) band = "moderate stress";
    else band = "low stress";
  } else if (key === "SPIN") {
    if (totalScore >= 41) band = "very severe";
    else if (totalScore >= 31) band = "severe";
    else if (totalScore >= 21) band = "moderate";
    else if (totalScore >= 11) band = "mild";
  } else if (key === "PDSS") {
    if (totalScore >= 18) band = "severe";
    else if (totalScore >= 11) band = "moderate";
    else if (totalScore >= 6) band = "mild";
  } else if (key === "ASRS") {
    if (totalScore >= 15) band = "highly consistent with ADHD";
    else if (totalScore >= 11) band = "consistent with ADHD";
    else band = "not consistent with ADHD";
  } else if (key === "OCI-R") {
    if (totalScore >= 21) band = "probable OCD";
    else band = "subclinical";
  } else if (key === "PCL-5") {
    if (totalScore >= 33) band = "probable PTSD";
    else if (totalScore >= 23) band = "some PTSD symptoms";
    else band = "minimal symptoms";
  }

  const submission = await prisma.quizSubmission.create({
    data: {
      userId: user.id,
      quizId: quiz.id,
      totalScore,
      band,
      answers: { createMany: { data: answers.map(a => ({
        questionId: a.questionId, selectedOptionId: a.optionId, value: a.value
      })) } }
    },
  });

  // Update profile with quiz scores
  const profileUpdate: Record<string, any> = {};
  const scoreFieldMap: Record<string, string> = {
    "GAD-7": "gad7Score",
    "PHQ-9": "phq9Score",
    "PSS-10": "pss10Score",
    "SPIN": "spinScore",
    "PDSS": "pdssScore",
    "ASRS": "asrsScore",
    "OCI-R": "ociScore",
    "PCL-5": "pcl5Score",
  };

  const scoreField = scoreFieldMap[key];
  if (scoreField) {
    profileUpdate[scoreField] = totalScore;
    
    // Get or create profile
    await prisma.profile.upsert({
      where: { userId: user.id },
      update: profileUpdate,
      create: {
        userId: user.id,
        ...profileUpdate,
      },
    });
  }

  // Create derived concerns for mental health tracking
  const concernMappings: Record<string, string> = { 
    "PHQ-9": "depression", 
    "GAD-7": "anxiety",
    "PSS-10": "stress",
    "SPIN": "social_anxiety",
    "PDSS": "panic",
    "ASRS": "adhd",
    "OCI-R": "ocd",
    "PCL-5": "ptsd",
  };
  
  const concern = concernMappings[key];
  if (concern) {
    const maxScores: Record<string, number> = {
      "PHQ-9": 27,
      "GAD-7": 21,
      "PSS-10": 40,
      "SPIN": 68,
      "PDSS": 28,
      "ASRS": 24,
      "OCI-R": 72,
      "PCL-5": 80,
    };
    const max = maxScores[key] || 100;
    const score = Math.min(1, totalScore / max);
    await prisma.derivedConcern.create({ 
      data: { userId: user.id, source: `quiz:${key}`, concern, score } 
    });
  }

  return NextResponse.json({ submissionId: submission.id, totalScore, band });
}