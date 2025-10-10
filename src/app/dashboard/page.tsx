import { prisma } from "@/lib/prisma";
import { getSession, requireSession } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await requireSession();
  const { user } = session;

  const profile = await prisma.profile.findUnique({ where: { userId: user.id } });

  const doctor = user.role === "DOCTOR"
    ? await prisma.doctor.findUnique({ where: { userId: user.id } })
    : null;

  const todayUtc = new Date();
  todayUtc.setUTCHours(0,0,0,0);

  const doctorAppointments = doctor ? await prisma.appointment.findMany({
    where: { doctorId: doctor.id, date: todayUtc, status: { in: ["BOOKED", "COMPLETED"] } },
    orderBy: [{ serialNumber: "asc" }],
    include: { patient: { select: { username: true, id: true } } }
  }) : [];

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <section className="card p-6">
        <h2 className="text-xl font-semibold mb-2">Hello, {user.username}</h2>
        <p className="text-gray-600">
          Role: <strong>{user.role}</strong>
        </p>
        {user.role === "USER" && (
          <ul className="mt-4 list-disc pl-6 text-gray-700">
            <li>Complete your profile to get personalized suggestions.</li>
            <li>Take PHQ-9 and GAD-7 screeners.</li>
            <li>Find and book a nearby doctor.</li>
          </ul>
        )}
        {user.role === "DOCTOR" && (
          <ul className="mt-4 list-disc pl-6 text-gray-700">
            <li>Set your weekly availability.</li>
            <li>See your daily appointments and serials.</li>
          </ul>
        )}
      </section>

      {user.role === "USER" && (
        <section className="card p-6">
          <h3 className="font-semibold mb-3">Profile status</h3>
          {profile ? (
            <div className="text-sm text-gray-700">
              <div>City: {profile.city ?? "-"}</div>
              <div>Sleep hrs: {profile.sleepHours ?? "-"}</div>
              <div>Exercise min/wk: {profile.exerciseMinutes ?? "-"}</div>
            </div>
          ) : (
            <div className="text-gray-600">No profile yet. Visit Profile to fill details.</div>
          )}
        </section>
      )}

      {user.role === "DOCTOR" && (
        <section className="card p-6 md:col-span-2">
          <h3 className="font-semibold mb-3">Today&apos;s appointments</h3>
          {doctorAppointments.length === 0 ? (
            <div className="text-gray-600">No appointments today.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2">Serial</th>
                    <th className="py-2">Patient</th>
                    <th className="py-2">Start</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {doctorAppointments.map((a) => (
                    <tr key={a.id} className="border-b">
                      <td className="py-2">{a.serialNumber}</td>
                      <td className="py-2">{a.patient.username}</td>
                      <td className="py-2">{Math.floor(a.startMinute/60).toString().padStart(2,"0")}:{(a.startMinute%60).toString().padStart(2,"0")}</td>
                      <td className="py-2">{a.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </div>
  );
}