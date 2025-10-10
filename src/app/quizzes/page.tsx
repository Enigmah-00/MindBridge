import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function QuizzesPage() {
  const quizzes = await prisma.quiz.findMany({
    select: {
      key: true,
      title: true,
      description: true,
      questions: {
        select: { id: true }
      }
    },
    orderBy: { key: "asc" }
  });

  return (
    <section className="max-w-5xl mx-auto space-y-6">
      <div className="card p-6">
        <h1 className="text-2xl font-semibold mb-2">📋 Mental Health Assessments</h1>
        <p className="text-gray-600">Take validated screening tools to better understand your mental health</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {quizzes.map((q) => {
          const category = q.key.includes("PHQ") ? "Depression" : q.key.includes("GAD") ? "Anxiety" : "Mental Health";
          const estimatedMinutes = Math.ceil(q.questions.length * 0.5);
          const icon = q.key.includes("PHQ") ? "💭" : q.key.includes("GAD") ? "😰" : "🧠";
          
          return (
            <Link 
              key={q.key} 
              href={`/quizzes/${encodeURIComponent(q.key)}`} 
              className="card p-6 hover:shadow-lg transition-all hover:scale-[1.02] space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="text-3xl">{icon}</div>
                <span className="text-xs px-2 py-1 bg-brand-100 text-brand-700 rounded-full">
                  {category}
                </span>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-1">{q.title}</h3>
                <p className="text-gray-600 text-sm">{q.description}</p>
              </div>

              <div className="flex items-center gap-4 text-xs text-gray-500 border-t pt-3">
                <span>📝 {q.questions.length} questions</span>
                <span>⏱️ ~{estimatedMinutes} min</span>
              </div>

              <button className="btn w-full mt-2">
                Take Assessment →
              </button>
            </Link>
          );
        })}
      </div>

      {quizzes.length === 0 && (
        <div className="card p-8 text-center text-gray-500">
          <p>No quizzes available. Please run the database seed.</p>
          <code className="block mt-2 text-sm">npm run seed</code>
        </div>
      )}
    </section>
  );
}