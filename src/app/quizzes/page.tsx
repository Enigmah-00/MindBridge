"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Quiz {
  key: string;
  title: string;
  description: string;
  questionCount: number;
  estimatedMinutes: number;
  category: string;
  icon: string;
}

export const dynamic = 'force-dynamic';

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/quizzes")
      .then((res) => res.json())
      .then((data) => {
        setQuizzes(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="max-w-5xl mx-auto space-y-6">
        <div className="card p-6 text-center">
          <p className="text-gray-600">Loading assessments...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold">
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Mental Health Assessments
          </span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Take validated screening tools to better understand your mental health and track your progress
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium border border-blue-200">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span>All assessments are confidential and evidence-based</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((q, index) => {
          const categoryColors: any = {
            'Anxiety': 'from-blue-500 to-blue-600',
            'Depression': 'from-purple-500 to-purple-600',
            'Stress': 'from-orange-500 to-orange-600',
            'Social Anxiety': 'from-pink-500 to-pink-600',
            'Panic Disorder': 'from-red-500 to-red-600',
            'ADHD': 'from-yellow-500 to-yellow-600',
            'OCD': 'from-indigo-500 to-indigo-600',
            'PTSD': 'from-gray-500 to-gray-600',
          };
          
          return (
            <Link 
              key={q.key} 
              href={`/quizzes/${encodeURIComponent(q.key)}`} 
              className="group card-interactive p-6 space-y-4 animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${categoryColors[q.category] || 'from-gray-500 to-gray-600'} flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform`}>
                  {q.icon}
                </div>
                <span className="badge bg-gray-100 text-gray-700">
                  {q.category}
                </span>
              </div>
              
              <div>
                <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">
                  {q.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {q.description}
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs text-gray-500 pt-3 border-t">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {q.questionCount} questions
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  ~{q.estimatedMinutes} min
                </span>
              </div>

              <div className="btn btn-primary w-full group-hover:shadow-lg transition-all">
                <span>Start Assessment</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </Link>
          );
        })}
      </div>

      {quizzes.length === 0 && (
        <div className="card p-8 text-center text-gray-500 space-y-3">
          <p className="font-medium text-gray-700">No quizzes available. Seed the database to unlock assessments.</p>
          <div>
            <p className="text-sm uppercase tracking-wide text-gray-400">Local development</p>
            <code className="block mt-1 text-sm">npm run seed:dev</code>
          </div>
          <div>
            <p className="text-sm uppercase tracking-wide text-gray-400">Production / Vercel</p>
            <code className="block mt-1 text-sm">curl -X POST https://&lt;your-app&gt;.vercel.app/api/seed</code>
          </div>
        </div>
      )}
    </section>
  );
}