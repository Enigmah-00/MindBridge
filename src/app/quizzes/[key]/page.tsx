"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function QuizPage() {
  const params = useParams<{ key: string }>();
  const key = decodeURIComponent(params.key);
  const router = useRouter();
  const [quiz, setQuiz] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string, { optionId: string; value: number }>>({});

  useEffect(() => {
    fetch(`/api/quizzes/${encodeURIComponent(key)}`).then(async r => setQuiz(await r.json()));
  }, [key]);

  async function submit() {
    const payload = {
      answers: Object.entries(answers).map(([questionId, val]) => ({
        questionId, optionId: val.optionId, value: val.value
      }))
    };
    const res = await fetch(`/api/quizzes/${encodeURIComponent(key)}`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
    });
    const j = await res.json();
    if (res.ok) {
      alert(`Submitted. Score: ${j.totalScore} (${j.band})`);
      router.push("/quizzes");
    } else {
      alert(j.error || "Submit failed");
    }
  }

  if (!quiz) return <div>Loading...</div>;

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">{quiz.title}</h1>
      <div className="space-y-6">
        {quiz.questions?.map((q: any) => (
          <div key={q.id} className="card p-4">
            <div className="font-medium mb-2">{q.order}. {q.text}</div>
            <div className="grid md:grid-cols-2 gap-2">
              {q.options.map((o: any) => (
                <label key={o.id} className="inline-flex items-center gap-2">
                  <input
                    type="radio"
                    name={`q-${q.id}`}
                    onChange={() => setAnswers(prev => ({ ...prev, [q.id]: { optionId: o.id, value: o.value } }))}
                    checked={answers[q.id]?.optionId === o.id}
                  />
                  <span>{o.label}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button onClick={submit} className="btn">Submit</button>
    </section>
  );
}