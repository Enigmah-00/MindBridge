import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const quizzes = await prisma.quiz.findMany({
    select: {
      key: true,
      title: true,
      description: true,
      questions: {
        select: {
          id: true
        }
      }
    },
    orderBy: { key: "asc" }
  });

  // Add metadata to each quiz
  const enhancedQuizzes = quizzes.map((quiz) => ({
    key: quiz.key,
    title: quiz.title,
    description: quiz.description,
    questionCount: quiz.questions.length,
    estimatedMinutes: Math.ceil(quiz.questions.length * 0.5), // ~30 seconds per question
    category: quiz.key.includes("PHQ") ? "Depression" : quiz.key.includes("GAD") ? "Anxiety" : "Mental Health"
  }));

  return NextResponse.json(enhancedQuizzes);
}