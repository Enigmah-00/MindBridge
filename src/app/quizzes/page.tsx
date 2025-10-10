import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function QuizzesPage() {
  const quizzes = await prisma.quiz.findMany({ select: { key: true, title: true, description: true } });

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Quizzes</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {quizzes.map((q) => (
          <Link key={q.key} href={`/quizzes/${encodeURIComponent(q.key)}`} className="card p-5 hover:shadow-md transition">
            <h3 className="font-semibold">{q.title}</h3>
            <p className="text-gray-600 text-sm">{q.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}