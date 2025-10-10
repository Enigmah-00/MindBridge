import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const quizzes = await prisma.quiz.findMany({ select: { key: true, title: true, description: true } });
  return NextResponse.json(quizzes);
}