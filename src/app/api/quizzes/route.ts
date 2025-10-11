import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

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

  // Add metadata to each quiz with proper categorization
  const categoryMap: Record<string, string> = {
    "GAD-7": "Anxiety",
    "PHQ-9": "Depression",
    "PSS-10": "Stress",
    "SPIN": "Social Anxiety",
    "PDSS": "Panic Disorder",
    "ASRS": "ADHD",
    "OCI-R": "OCD",
    "PCL-5": "PTSD",
  };

  const iconMap: Record<string, string> = {
    "GAD-7": "😰",
    "PHQ-9": "💭",
    "PSS-10": "😓",
    "SPIN": "👥",
    "PDSS": "💓",
    "ASRS": "🎯",
    "OCI-R": "🔄",
    "PCL-5": "🛡️",
  };

  const enhancedQuizzes = quizzes.map((quiz: any) => ({
    key: quiz.key,
    title: quiz.title,
    description: quiz.description,
    questionCount: quiz.questions.length,
    estimatedMinutes: Math.ceil(quiz.questions.length * 0.5), // ~30 seconds per question
    category: categoryMap[quiz.key] || "Mental Health",
    icon: iconMap[quiz.key] || "🧠",
  }));

  return NextResponse.json(enhancedQuizzes);
}