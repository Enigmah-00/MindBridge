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
  if (key === "PHQ-9") {
    if (totalScore >= 20) band = "severe";
    else if (totalScore >= 15) band = "moderately severe";
    else if (totalScore >= 10) band = "moderate";
    else if (totalScore >= 5) band = "mild";
  } else if (key === "GAD-7") {
    if (totalScore >= 15) band = "severe";
    else if (totalScore >= 10) band = "moderate";
    else if (totalScore >= 5) band = "mild";
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

  const mappings: Record<string, string> = { "PHQ-9": "depression", "GAD-7": "anxiety" };
  const concern = mappings[key];
  if (concern) {
    const max = key === "PHQ-9" ? 27 : 21;
    const score = Math.min(1, totalScore / max);
    await prisma.derivedConcern.create({ data: { userId: user.id, source: `quiz:${key}`, concern, score } });
  }

  return NextResponse.json({ submissionId: submission.id, totalScore, band });
}