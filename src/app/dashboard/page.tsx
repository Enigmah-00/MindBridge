import { prisma } from "@/lib/prisma";
import { getSession, requireSession } from "@/lib/auth";
import Link from "next/link";
import DailyCheckInSection from "@/components/check-in/DailyCheckInSection";
import DailyCheckInCard from "@/components/check-in/DailyCheckInCard";

export const dynamic = 'force-dynamic';

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
  
  // Get all patients for the doctor (those who booked or messaged)
  const allPatients = user.role === "DOCTOR" && doctor ? await (async () => {
    const appointments = await prisma.appointment.findMany({
      where: { doctorId: doctor.id },
      select: {
        patientUserId: true,
        status: true,
        date: true,
        patient: {
          select: {
            id: true,
            username: true,
            profile: true,
          }
        }
      },
      orderBy: { date: 'desc' }
    });

    const messages = await prisma.message.findMany({
      where: { receiverId: user.id },
      select: {
        senderId: true,
        createdAt: true,
        sender: {
          select: {
            id: true,
            username: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const patientsMap = new Map();
    appointments.forEach((apt: any) => {
      if (!patientsMap.has(apt.patientUserId)) {
        patientsMap.set(apt.patientUserId, {
          userId: apt.patient.id,
          username: apt.patient.username,
          profile: apt.patient.profile,
          hasAppointment: true,
          hasMessaged: false,
          lastAppointment: apt.date,
          totalAppointments: 1,
        });
      } else {
        patientsMap.get(apt.patientUserId).totalAppointments += 1;
      }
    });

    messages.forEach((msg: any) => {
      if (!patientsMap.has(msg.senderId)) {
        patientsMap.set(msg.senderId, {
          userId: msg.sender.id,
          username: msg.sender.username,
          hasAppointment: false,
          hasMessaged: true,
          lastMessageDate: msg.createdAt,
          totalAppointments: 0,
        });
      } else {
        patientsMap.get(msg.senderId).hasMessaged = true;
      }
    });

    return Array.from(patientsMap.values());
  })() : [];

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
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <span className="text-4xl">{user.role === "DOCTOR" ? "👨‍⚕️" : "👋"}</span>
                <span>Welcome back, {user.username}!</span>
              </h2>
              <p className="text-blue-100">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                  <span className="w-2 h-2 rounded-full bg-green-400"></span>
                  <span className="font-medium">{user.role}</span>
                </span>
              </p>
            </div>
            {unreadMessagesCount > 0 && (
              <Link href="/messages" className="btn bg-white text-blue-600 hover:bg-blue-50 shadow-lg">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <span>{unreadMessagesCount} new message{unreadMessagesCount > 1 ? 's' : ''}</span>
              </Link>
            )}
          </div>
        </div>
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-48 h-48 bg-purple-400/10 rounded-full blur-3xl"></div>
      </section>

      {/* User Dashboard */}
      {user.role === "USER" && (
        <>
          <div className="grid md:grid-cols-2 gap-6">
            <section className="card p-6 hover:shadow-2xl transition-all duration-300">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900">
                <span className="text-2xl">📋</span>
                <span>Quick Actions</span>
              </h3>
            <div className="space-y-3">
              <Link href="/profile" className="group block p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 hover:from-blue-100 hover:to-blue-200/50 rounded-xl transition-all border border-blue-200/50 hover:border-blue-300 hover:-translate-y-0.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                    👤
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">Complete Your Profile</div>
                    <div className="text-sm text-gray-600">Get personalized suggestions</div>
                  </div>
                </div>
              </Link>
              <Link href="/quizzes" className="group block p-4 bg-gradient-to-r from-green-50 to-green-100/50 hover:from-green-100 hover:to-green-200/50 rounded-xl transition-all border border-green-200/50 hover:border-green-300 hover:-translate-y-0.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-600 text-white flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                    🧠
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">Take Mental Health Screeners</div>
                    <div className="text-sm text-gray-600">8 comprehensive assessments</div>
                  </div>
                </div>
              </Link>
              <Link href="/games" className="group block p-4 bg-gradient-to-r from-yellow-50 to-yellow-100/50 hover:from-yellow-100 hover:to-yellow-200/50 rounded-xl transition-all border border-yellow-200/50 hover:border-yellow-300 hover:-translate-y-0.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-yellow-600 text-white flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                    🎮
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">Play Mindful Games</div>
                    <div className="text-sm text-gray-600">Relax with breathing, memory & more</div>
                  </div>
                </div>
              </Link>
              <Link href="/doctors" className="group block p-4 bg-gradient-to-r from-purple-50 to-purple-100/50 hover:from-purple-100 hover:to-purple-200/50 rounded-xl transition-all border border-purple-200/50 hover:border-purple-300 hover:-translate-y-0.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-600 text-white flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                    👨‍⚕️
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">Find a Doctor</div>
                    <div className="text-sm text-gray-600">Browse and message doctors</div>
                  </div>
                </div>
              </Link>
              <Link href="/chatbot" className="group block p-4 bg-gradient-to-r from-indigo-50 to-pink-100/50 hover:from-indigo-100 hover:to-pink-200/50 rounded-xl transition-all border border-indigo-200/50 hover:border-indigo-300 hover:-translate-y-0.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-indigo-600 to-pink-600 text-white flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                    🤖
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">AI Mental Health Support</div>
                    <div className="text-sm text-gray-600">Chat with our AI companion</div>
                  </div>
                </div>
              </Link>
              <Link href="/resources" className="group block p-4 bg-gradient-to-r from-purple-50 to-blue-100/50 hover:from-purple-100 hover:to-blue-200/50 rounded-xl transition-all border border-purple-200/50 hover:border-purple-300 hover:-translate-y-0.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                    📚
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">Mental Health Resources</div>
                    <div className="text-sm text-gray-600">Learn about conditions & get support</div>
                  </div>
                </div>
              </Link>
            </div>
          </section>

          {/* Daily Check-In Card - Compact */}
          <DailyCheckInCard />

          <section className="card p-6 hover:shadow-2xl transition-all duration-300">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900">
              <span className="text-2xl">👤</span>
              <span>Profile Status</span>
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

          {/* Assessment Scores Section */}
          {profile && (
            <section className="card p-8 md:col-span-2 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2 text-gray-900">
                  <span className="text-2xl">🧠</span>
                  <span>Mental Health Assessments</span>
                </h3>
                <Link href="/quizzes" className="btn btn-primary text-sm">
                  Take assessments
                </Link>
              </div>
              {!profile.gad7Score && !profile.phq9Score && !profile.pss10Score && !profile.spinScore && 
               !profile.pdssScore && !profile.asrsScore && !profile.ociScore && !profile.pcl5Score ? (
                <div className="text-center py-8 text-gray-600">
                  <p className="mb-3">You haven&apos;t taken any assessments yet.</p>
                  <Link href="/quizzes" className="btn bg-green-600 hover:bg-green-700 text-white">
                    Take Your First Assessment
                  </Link>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {profile.gad7Score !== null && (
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-blue-900">😰 GAD-7 (Anxiety)</span>
                        <span className="text-2xl font-bold text-blue-600">{profile.gad7Score}/21</span>
                      </div>
                      <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-600 rounded-full" 
                          style={{width: `${(profile.gad7Score / 21) * 100}%`}}
                        />
                      </div>
                      <div className="text-xs text-blue-700 mt-2">
                        {profile.gad7Score < 5 ? "Minimal anxiety" :
                         profile.gad7Score < 10 ? "Mild anxiety" :
                         profile.gad7Score < 15 ? "Moderate anxiety" : "Severe anxiety"}
                      </div>
                    </div>
                  )}
                  
                  {profile.phq9Score !== null && (
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-purple-900">😔 PHQ-9 (Depression)</span>
                        <span className="text-2xl font-bold text-purple-600">{profile.phq9Score}/27</span>
                      </div>
                      <div className="h-2 bg-purple-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-purple-600 rounded-full" 
                          style={{width: `${(profile.phq9Score / 27) * 100}%`}}
                        />
                      </div>
                      <div className="text-xs text-purple-700 mt-2">
                        {profile.phq9Score < 5 ? "Minimal depression" :
                         profile.phq9Score < 10 ? "Mild depression" :
                         profile.phq9Score < 15 ? "Moderate depression" :
                         profile.phq9Score < 20 ? "Moderately severe" : "Severe depression"}
                      </div>
                    </div>
                  )}
                  
                  {profile.pss10Score !== null && (
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-orange-900">😣 PSS-10 (Stress)</span>
                        <span className="text-2xl font-bold text-orange-600">{profile.pss10Score}/40</span>
                      </div>
                      <div className="h-2 bg-orange-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-orange-600 rounded-full" 
                          style={{width: `${(profile.pss10Score / 40) * 100}%`}}
                        />
                      </div>
                      <div className="text-xs text-orange-700 mt-2">
                        {profile.pss10Score < 14 ? "Low stress" :
                         profile.pss10Score < 27 ? "Moderate stress" : "High stress"}
                      </div>
                    </div>
                  )}
                  
                  {profile.spinScore !== null && (
                    <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-lg border border-pink-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-pink-900">😶 SPIN (Social Anxiety)</span>
                        <span className="text-2xl font-bold text-pink-600">{profile.spinScore}/68</span>
                      </div>
                      <div className="h-2 bg-pink-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-pink-600 rounded-full" 
                          style={{width: `${(profile.spinScore / 68) * 100}%`}}
                        />
                      </div>
                      <div className="text-xs text-pink-700 mt-2">
                        {profile.spinScore < 21 ? "Minimal" :
                         profile.spinScore < 31 ? "Mild" :
                         profile.spinScore < 41 ? "Moderate" : "Severe"}
                      </div>
                    </div>
                  )}
                  
                  {profile.pdssScore !== null && (
                    <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-red-900">😱 PDSS (Panic Disorder)</span>
                        <span className="text-2xl font-bold text-red-600">{profile.pdssScore}/28</span>
                      </div>
                      <div className="h-2 bg-red-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-red-600 rounded-full" 
                          style={{width: `${(profile.pdssScore / 28) * 100}%`}}
                        />
                      </div>
                      <div className="text-xs text-red-700 mt-2">
                        {profile.pdssScore < 6 ? "Minimal" :
                         profile.pdssScore < 10 ? "Mild" :
                         profile.pdssScore < 15 ? "Moderate" : "Severe"}
                      </div>
                    </div>
                  )}
                  
                  {profile.asrsScore !== null && (
                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-yellow-900">🎯 ASRS (ADHD)</span>
                        <span className="text-2xl font-bold text-yellow-600">{profile.asrsScore}/24</span>
                      </div>
                      <div className="h-2 bg-yellow-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-yellow-600 rounded-full" 
                          style={{width: `${(profile.asrsScore / 24) * 100}%`}}
                        />
                      </div>
                      <div className="text-xs text-yellow-700 mt-2">
                        {profile.asrsScore < 14 ? "Low likelihood" : "High likelihood - consult professional"}
                      </div>
                    </div>
                  )}
                  
                  {profile.ociScore !== null && (
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-lg border border-indigo-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-indigo-900">🔄 OCI-R (OCD)</span>
                        <span className="text-2xl font-bold text-indigo-600">{profile.ociScore}/72</span>
                      </div>
                      <div className="h-2 bg-indigo-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-600 rounded-full" 
                          style={{width: `${(profile.ociScore / 72) * 100}%`}}
                        />
                      </div>
                      <div className="text-xs text-indigo-700 mt-2">
                        {profile.ociScore < 21 ? "Subclinical" : "Clinical range - consult professional"}
                      </div>
                    </div>
                  )}
                  
                  {profile.pcl5Score !== null && (
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">💭 PCL-5 (PTSD)</span>
                        <span className="text-2xl font-bold text-gray-600">{profile.pcl5Score}/80</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gray-600 rounded-full" 
                          style={{width: `${(profile.pcl5Score / 80) * 100}%`}}
                        />
                      </div>
                      <div className="text-xs text-gray-700 mt-2">
                        {profile.pcl5Score < 31 ? "Below cutoff" : "Above cutoff - consult professional"}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </section>
          )}
          </div>

          {/* Full Daily Check-In Section - Collapsible */}
          <div id="checkin" className="scroll-mt-8">
            <DailyCheckInSection />
          </div>
        </>
      )}

      {/* Doctor Dashboard */}
      {user.role === "DOCTOR" && doctor && (
        <div className="space-y-6">
          {/* Doctor Info */}
          <section className="card p-8 hover:shadow-2xl transition-all duration-300">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900">
              <span className="text-2xl">🩺</span>
              <span>Your Practice</span>
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                <div className="text-sm text-blue-600 font-medium mb-1">Professional Name</div>
                <div className="font-bold text-lg text-blue-900">{doctor.name}</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                <div className="text-sm text-purple-600 font-medium mb-1">Location</div>
                <div className="font-bold text-lg text-purple-900">{doctor.city}, {doctor.country}</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                <div className="text-sm text-green-600 font-medium mb-1">Telehealth</div>
                <div className="font-bold text-lg text-green-900">{doctor.telehealth ? "✅ Enabled" : "❌ Disabled"}</div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t">
              <div className="text-sm text-gray-600 font-semibold mb-3">Specialties</div>
              <div className="flex flex-wrap gap-2">
                {doctor.specialties.map((s: any) => (
                  <span key={s.specialtyId} className="badge bg-blue-100 text-blue-800 px-4 py-2 text-sm font-medium">
                    {s.specialty.name}
                  </span>
                ))}
              </div>
            </div>
          </section>
          
          {/* Quick Links for Doctors */}
          <section className="card p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900">
              <span className="text-xl">⚡</span>
              <span>Quick Actions</span>
            </h3>
            <div className="grid md:grid-cols-3 gap-3">
              <Link href="/analytics" className="group block p-4 bg-gradient-to-r from-indigo-50 to-indigo-100/50 hover:from-indigo-100 hover:to-indigo-200/50 rounded-xl transition-all border border-indigo-200/50 hover:border-indigo-300 hover:-translate-y-0.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                    📊
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">Business Insights</div>
                    <div className="text-sm text-gray-600">View analytics & trends</div>
                  </div>
                </div>
              </Link>
              <Link href="/availibility" className="group block p-4 bg-gradient-to-r from-cyan-50 to-cyan-100/50 hover:from-cyan-100 hover:to-cyan-200/50 rounded-xl transition-all border border-cyan-200/50 hover:border-cyan-300 hover:-translate-y-0.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-600 text-white flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                    🗓️
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">Set Availability</div>
                    <div className="text-sm text-gray-600">Manage your schedule</div>
                  </div>
                </div>
              </Link>
              <Link href="/profile" className="group block p-4 bg-gradient-to-r from-amber-50 to-amber-100/50 hover:from-amber-100 hover:to-amber-200/50 rounded-xl transition-all border border-amber-200/50 hover:border-amber-300 hover:-translate-y-0.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-600 text-white flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                    👤
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">Update Profile</div>
                    <div className="text-sm text-gray-600">Edit fees & specialties</div>
                  </div>
                </div>
              </Link>
            </div>
          </section>
          
          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="card p-6 hover:shadow-lg transition-all">
              <div className="text-3xl mb-2">👥</div>
              <div className="text-2xl font-bold text-gray-900">{allPatients.length}</div>
              <div className="text-sm text-gray-600">Total Patients</div>
            </div>
            <div className="card p-6 hover:shadow-lg transition-all">
              <div className="text-3xl mb-2">📅</div>
              <div className="text-2xl font-bold text-gray-900">{allPatients.filter((p: any) => p.hasAppointment).length}</div>
              <div className="text-sm text-gray-600">With Appointments</div>
            </div>
            <div className="card p-6 hover:shadow-lg transition-all">
              <div className="text-3xl mb-2">💬</div>
              <div className="text-2xl font-bold text-gray-900">{allPatients.filter((p: any) => p.hasMessaged).length}</div>
              <div className="text-sm text-gray-600">Messaged You</div>
            </div>
            <div className="card p-6 hover:shadow-lg transition-all">
              <div className="text-3xl mb-2">🕐</div>
              <div className="text-2xl font-bold text-gray-900">{doctorAppointments.length}</div>
              <div className="text-sm text-gray-600">Today's Appointments</div>
            </div>
          </div>

          {/* Today's Appointments */}
          <section className="card p-8 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2 text-gray-900">
                <span className="text-2xl">📅</span>
                <span>Today's Appointments</span>
              </h3>
              <Link href="/appointments" className="btn btn-primary text-sm">
                View all
              </Link>
            </div>
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

          {/* My Patients */}
          <section className="card p-8 md:col-span-3 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2 text-gray-900">
                <span className="text-2xl">👥</span>
                <span>My Patients</span>
              </h3>
            </div>
            {allPatients.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">👥</div>
                <p className="text-gray-600 text-lg">No patients yet</p>
                <p className="text-sm text-gray-500 mt-2">Patients who book appointments or message you will appear here</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="text-left border-b-2 border-gray-200">
                      <th className="py-3 px-4 font-semibold text-gray-700">Patient</th>
                      <th className="py-3 px-4 font-semibold text-gray-700">Appointments</th>
                      <th className="py-3 px-4 font-semibold text-gray-700">Status</th>
                      <th className="py-3 px-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allPatients.map((patient: any) => (
                      <tr key={patient.userId} className="border-b hover:bg-gray-50 transition">
                        <td className="py-4 px-4">
                          <div className="font-medium text-gray-900">{patient.username}</div>
                          {patient.profile && (
                            <div className="text-xs text-gray-500 mt-1">
                              {patient.profile.age ? `${patient.profile.age} years` : ''} 
                              {patient.profile.gender ? ` • ${patient.profile.gender}` : ''}
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm">
                            <span className="font-semibold text-gray-900">{patient.totalAppointments}</span>
                            <span className="text-gray-600"> total</span>
                          </div>
                          {patient.lastAppointment && (
                            <div className="text-xs text-gray-500 mt-1">
                              Last: {new Date(patient.lastAppointment).toLocaleDateString()}
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-col gap-1">
                            {patient.hasAppointment && (
                              <span className="badge bg-green-100 text-green-800 text-xs">
                                � Booked
                              </span>
                            )}
                            {patient.hasMessaged && (
                              <span className="badge bg-blue-100 text-blue-800 text-xs">
                                💬 Messaged
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex gap-2">
                            <Link 
                              href={`/messages/${patient.userId}`}
                              className="btn btn-primary text-sm py-1.5 px-4"
                            >
                              Message
                            </Link>
                            <Link 
                              href={`/doctors/patients/${patient.userId}`}
                              className="btn btn-secondary text-sm py-1.5 px-4"
                            >
                              View Profile
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Recent Messages */}
          <section className="card p-8 md:col-span-3 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2 text-gray-900">
                <span className="text-2xl">💬</span>
                <span>Recent Messages</span>
              </h3>
              <Link href="/messages" className="btn btn-primary text-sm">
                View all
              </Link>
            </div>
            {recentMessages.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">💬</div>
                <p className="text-gray-600 text-lg">No messages yet</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {recentMessages.slice(0, 6).map((msg: any) => (
                  <Link
                    key={msg.id}
                    href={`/messages/${msg.senderId}`}
                    className="block p-4 bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-xl transition-all border border-blue-200 hover:-translate-y-0.5"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 truncate">
                          {msg.sender.username}
                        </div>
                      </div>
                      {!msg.read && (
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 truncate mb-2">
                      {msg.content}
                    </div>
                    <div className="text-xs text-gray-500">
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