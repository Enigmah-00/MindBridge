import { prisma } from "@/lib/prisma";
import { getSession, requireSession } from "@/lib/auth";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await requireSession();
  const { user } = session;

  const profile = await prisma.profile.findUnique({ where: { userId: user.id } });

  const doctor = user.role === "DOCTOR"
    ? await prisma.doctor.findUnique({ 
        where: { userId: user.id },
        include: {
          specialties: {
            include: { specialty: true }
          }
        }
      })
    : null;

  const todayUtc = new Date();
  todayUtc.setUTCHours(0,0,0,0);

  const doctorAppointments = doctor ? await prisma.appointment.findMany({
    where: { doctorId: doctor.id, date: todayUtc, status: { in: ["BOOKED", "COMPLETED"] } },
    orderBy: [{ serialNumber: "asc" }],
    include: { patient: { select: { username: true, id: true } } }
  }) : [];

  // Get unread messages count
  const unreadMessagesCount = await prisma.message.count({
    where: { receiverId: user.id, read: false }
  });

  // Get recent messages for doctors
  const recentMessages = user.role === "DOCTOR" ? await prisma.message.findMany({
    where: { receiverId: user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      sender: {
        select: { id: true, username: true, profile: true }
      }
    }
  }) : [];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <section className="card p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h2 className="text-2xl font-bold mb-2">
          {user.role === "DOCTOR" ? "👨‍⚕️" : "👋"} Hello, {user.username}!
        </h2>
        <p className="text-gray-700">
          Role: <span className="font-semibold text-blue-600">{user.role}</span>
        </p>
        {unreadMessagesCount > 0 && (
          <Link href="/messages" className="inline-block mt-3 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
            💬 You have {unreadMessagesCount} unread message{unreadMessagesCount > 1 ? 's' : ''}
          </Link>
        )}
      </section>

      {/* User Dashboard */}
      {user.role === "USER" && (
        <div className="grid md:grid-cols-2 gap-6">
          <section className="card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              📋 Quick Actions
            </h3>
            <div className="space-y-3">
              <Link href="/profile" className="block p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition">
                <div className="font-medium">Complete Your Profile</div>
                <div className="text-sm text-gray-600">Get personalized suggestions</div>
              </Link>
              <Link href="/quizzes" className="block p-3 bg-green-50 hover:bg-green-100 rounded-lg transition">
                <div className="font-medium">Take Mental Health Screeners</div>
                <div className="text-sm text-gray-600">PHQ-9 and GAD-7 assessments</div>
              </Link>
              <Link href="/doctors" className="block p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition">
                <div className="font-medium">Find a Doctor</div>
                <div className="text-sm text-gray-600">Browse and message doctors</div>
              </Link>
            </div>
          </section>

          <section className="card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              👤 Profile Status
            </h3>
            {profile ? (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">{profile.city ?? "Not set"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sleep hours:</span>
                  <span className="font-medium">{profile.sleepHours ?? "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Exercise (min/week):</span>
                  <span className="font-medium">{profile.exerciseMinutes ?? "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Diet quality:</span>
                  <span className="font-medium">{profile.dietQuality ? `${profile.dietQuality}/5` : "-"}</span>
                </div>
              </div>
            ) : (
              <div className="text-gray-600 text-center py-4">
                <p className="mb-3">No profile yet.</p>
                <Link href="/profile" className="btn">
                  Create Profile
                </Link>
              </div>
            )}
          </section>
        </div>
      )}

      {/* Doctor Dashboard */}
      {user.role === "DOCTOR" && doctor && (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Doctor Info */}
          <section className="card p-6 md:col-span-3">
            <h3 className="text-lg font-semibold mb-4">🩺 Your Practice</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-600">Name</div>
                <div className="font-medium">{doctor.name}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Location</div>
                <div className="font-medium">{doctor.city}, {doctor.country}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Telehealth</div>
                <div className="font-medium">{doctor.telehealth ? "✅ Enabled" : "❌ Disabled"}</div>
              </div>
            </div>
            <div className="mt-3">
              <div className="text-sm text-gray-600 mb-2">Specialties</div>
              <div className="flex flex-wrap gap-2">
                {doctor.specialties.map((s: any) => (
                  <span key={s.specialtyId} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {s.specialty.name}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* Today's Appointments */}
          <section className="card p-6 md:col-span-2">
            <h3 className="text-lg font-semibold mb-4 flex items-center justify-between">
              📅 Today&apos;s Appointments
              <Link href="/appointments" className="text-sm text-blue-600 hover:underline">
                View all
              </Link>
            </h3>
            {doctorAppointments.length === 0 ? (
              <div className="text-gray-600 text-center py-8">
                No appointments scheduled for today
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left border-b-2 border-gray-200">
                      <th className="py-2 font-semibold">Serial</th>
                      <th className="py-2 font-semibold">Patient</th>
                      <th className="py-2 font-semibold">Time</th>
                      <th className="py-2 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctorAppointments.map((a: any) => (
                      <tr key={a.id} className="border-b hover:bg-gray-50">
                        <td className="py-3">{a.serialNumber}</td>
                        <td className="py-3">
                          <Link href={`/messages/${a.patient.id}`} className="text-blue-600 hover:underline">
                            {a.patient.username}
                          </Link>
                        </td>
                        <td className="py-3">
                          {Math.floor(a.startMinute/60).toString().padStart(2,"0")}:
                          {(a.startMinute%60).toString().padStart(2,"0")}
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded text-xs ${
                            a.status === "BOOKED" ? "bg-green-100 text-green-800" :
                            a.status === "COMPLETED" ? "bg-blue-100 text-blue-800" :
                            "bg-gray-100 text-gray-800"
                          }`}>
                            {a.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Recent Messages */}
          <section className="card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center justify-between">
              💬 Recent Messages
              <Link href="/messages" className="text-sm text-blue-600 hover:underline">
                View all
              </Link>
            </h3>
            {recentMessages.length === 0 ? (
              <div className="text-gray-600 text-center py-8 text-sm">
                No messages yet
              </div>
            ) : (
              <div className="space-y-3">
                {recentMessages.map((msg: any) => (
                  <Link
                    key={msg.id}
                    href={`/messages/${msg.senderId}`}
                    className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">
                          {msg.sender.username}
                        </div>
                        <div className="text-xs text-gray-600 truncate">
                          {msg.content}
                        </div>
                      </div>
                      {!msg.read && (
                        <span className="ml-2 w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(msg.createdAt).toLocaleString()}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}