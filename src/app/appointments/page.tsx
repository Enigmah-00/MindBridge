"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

type Doctor = { id: string; name: string; location: string; specialties: string[] };
type Slot = { startMinute: number; endMinute: number; slotMinutes: number };

function AppointmentsContent() {
  const searchParams = useSearchParams();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [date, setDate] = useState<string>("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [my, setMy] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [bookingSlot, setBookingSlot] = useState<number | null>(null);

  useEffect(() => {
    // Quick doctor list from seeds
    fetch("/api/doctors/list").then(async r => {
      const data = await r.json();
      setDoctors(data);
      
      // Pre-select doctor from URL parameter
      const doctorId = searchParams.get("doctorId");
      if (doctorId) {
        setSelected(doctorId);
        const doc = data.find((d: Doctor) => d.id === doctorId);
        if (doc) setSelectedDoctor(doc);
      }
    });
    refreshMy();
    
    // Set today's date as default
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    setDate(`${yyyy}-${mm}-${dd}`);
  }, [searchParams]);

  async function refreshMy() {
    const r = await fetch("/api/appointments");
    if (r.ok) setMy(await r.json());
  }

  async function loadSlots() {
    if (!selected || !date) {
      alert("Please select a doctor and date");
      return;
    }
    setLoading(true);
    try {
      const r = await fetch(`/api/availibility/${selected}?date=${date}`);
      if (r.ok) {
        const data = await r.json();
        setSlots(data);
        if (data.length === 0) {
          alert("No available slots for this date. Please try another date.");
        }
      } else {
        alert("Failed to load slots");
        setSlots([]);
      }
    } catch (e) {
      alert("Error loading slots");
      setSlots([]);
    } finally {
      setLoading(false);
    }
  }

  async function book(startMinute: number) {
    if (bookingSlot !== null) return; // Prevent double booking
    setBookingSlot(startMinute);
    
    try {
      const r = await fetch("/api/appointments", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ doctorId: selected, date, startMinute }) 
      });
      const j = await r.json();
      if (r.ok) {
        alert(`✅ Appointment booked successfully!\n\nSerial Number: ${j.serialNumber}\nDoctor: ${selectedDoctor?.name}\nDate: ${date}\nTime: ${formatTime(startMinute)}`);
        refreshMy();
        setSlots([]); // Clear slots to force reload
        setDate(""); // Reset date
      } else {
        alert(`❌ ${j.error || "Booking failed"}`);
      }
    } catch (e) {
      alert("❌ Error booking appointment");
    } finally {
      setBookingSlot(null);
    }
  }
  
  function formatTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }
  
  function handleDoctorChange(doctorId: string) {
    setSelected(doctorId);
    const doc = doctors.find(d => d.id === doctorId);
    setSelectedDoctor(doc || null);
    setSlots([]); // Clear slots when doctor changes
  }

  return (
    <section className="space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold">
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Book an Appointment
          </span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Schedule a consultation with your preferred mental health specialist
        </p>
      </div>

      {/* Booking Form */}
      <div className="card p-8 space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span className="text-3xl">📅</span>
          <span>Select Date & Time</span>
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="label">Select Doctor *</label>
            <select 
              className="input" 
              value={selected} 
              onChange={e => handleDoctorChange(e.target.value)}
            >
              <option value="">Choose a doctor...</option>
              {doctors.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name} - {d.location}
                </option>
              ))}
            </select>
            {selectedDoctor && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-sm font-medium text-blue-900 mb-1">{selectedDoctor.name}</div>
                <div className="text-xs text-blue-700">📍 {selectedDoctor.location}</div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedDoctor.specialties.map((spec, idx) => (
                    <span key={idx} className="badge bg-blue-100 text-blue-700 text-xs">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div>
            <label className="label">Select Date *</label>
            <input 
              type="date"
              className="input" 
              value={date} 
              onChange={e => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
            <p className="text-xs text-gray-500 mt-2">Choose a date to see available time slots</p>
          </div>
        </div>

        <button 
          onClick={loadSlots} 
          className="btn btn-primary w-full text-lg py-3"
          disabled={!selected || !date || loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Loading slots...</span>
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <span>Search Available Slots</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
          )}
        </button>
      </div>

      {/* Available Slots */}
      {slots.length > 0 && (
        <div className="card p-8 animate-slide-up">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-3xl">⏰</span>
            <span>Available Time Slots</span>
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            Click on a time slot to book your appointment with {selectedDoctor?.name}
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {slots.map((s, i) => (
              <button 
                key={i} 
                onClick={() => book(s.startMinute)} 
                disabled={bookingSlot === s.startMinute}
                className={`px-4 py-3 rounded-lg font-medium transition-all text-sm ${
                  bookingSlot === s.startMinute
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 text-blue-700 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
                }`}
              >
                {formatTime(s.startMinute)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* My Appointments */}
      <div className="card p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span className="text-3xl">📋</span>
          <span>My Appointments</span>
        </h3>
        {my.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <p className="text-gray-600 text-lg mb-4">No appointments scheduled yet</p>
            <p className="text-sm text-gray-500">Book your first appointment above to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left border-b-2 border-gray-200">
                  <th className="py-3 px-4 font-semibold text-gray-700">Doctor</th>
                  <th className="py-3 px-4 font-semibold text-gray-700">Date</th>
                  <th className="py-3 px-4 font-semibold text-gray-700">Time</th>
                  <th className="py-3 px-4 font-semibold text-gray-700">Serial #</th>
                  <th className="py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {my.map((a) => (
                  <tr key={a.id} className="border-b hover:bg-gray-50 transition">
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-900">{a.doctor.name}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-600">
                        {new Date(a.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm font-medium text-gray-700">
                        {formatTime(a.startMinute)}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        #{a.serialNumber}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        a.status === "BOOKED" ? "bg-green-100 text-green-800" :
                        a.status === "COMPLETED" ? "bg-blue-100 text-blue-800" :
                        a.status === "CANCELLED" ? "bg-red-100 text-red-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {a.status === "BOOKED" && (
                        <button 
                          className="btn btn-danger text-sm py-1.5 px-4" 
                          onClick={async () => {
                            if (confirm(`Are you sure you want to cancel this appointment with ${a.doctor.name}?`)) {
                              const r = await fetch(`/api/appointments/${a.id}/cancel`, { method: "PATCH" });
                              if (r.ok) { 
                                alert("✅ Appointment cancelled successfully"); 
                                refreshMy(); 
                              } else {
                                alert("❌ Failed to cancel appointment");
                              }
                            }
                          }}
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default function AppointmentsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading appointments...</p>
        </div>
      </div>
    }>
      <AppointmentsContent />
    </Suspense>
  );
}