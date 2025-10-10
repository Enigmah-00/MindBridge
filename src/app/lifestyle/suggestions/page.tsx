import { requireSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { suggestionsFromProfile } from "@/lib/suggestions";

export const dynamic = 'force-dynamic';

export default async function SuggestionsPage() {
  const { user } = await requireSession();
  const profile = await prisma.profile.findUnique({ where: { userId: user.id } });
  if (!profile) {
    return <div className="card p-6">No profile found. Please fill your profile first.</div>;
  }
  const suggestions = suggestionsFromProfile(profile);

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Lifestyle Suggestions</h1>
      {suggestions.length === 0 ? (
        <div className="card p-6">Looking good! No critical areas detected. Keep tracking regularly.</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {suggestions.map((s, i) => (
            <div key={i} className="card p-5">
              <div className="text-sm text-gray-500">{s.area.toUpperCase()}</div>
              <h3 className="font-semibold">{s.issue}</h3>
              <div className="text-xs text-gray-500 mb-2">Severity: {s.severity}</div>
              <p className="text-sm text-gray-700 mb-2">Reason: {s.reason}</p>
              <div className="text-sm">
                <div className="font-semibold">Possible effects:</div>
                <ul className="list-disc pl-6 text-gray-700">
                  {s.possibleEffects.map((e, idx) => <li key={idx}>{e}</li>)}
                </ul>
              </div>
              <div className="text-sm mt-2">
                <div className="font-semibold">What to do:</div>
                <ul className="list-disc pl-6 text-gray-700">
                  {s.actions.map((e, idx) => <li key={idx}>{e}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}