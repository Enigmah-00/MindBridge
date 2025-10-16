"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

type Doctor = { id: string; name: string; location: string; specialties: string[] };
type Slot = { startMinute: number; endMinute: number; slotMinutes: number };

function AppointmentsContent() {
  const searchParams = useSearchParams();
  const [userRole, setUserRole] = useState<string>("");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [date, setDate] = useState<string>("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [my, setMy] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [bookingSlot, setBookingSlot] = useState<number | null>(null);
  
  // Review Modal States
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewAppointment, setReviewAppointment] = useState<any>(null);
  const [hoveredStar, setHoveredStar] = useState<number>(0);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    // Check user role
    fetch("/api/auth/me").then(async r => {
      if (r.ok) {
        const user = await r.json();
        setUserRole(user.role);
      }
    });
  }, []);

  useEffect(() => {
    if (!userRole) return; // Wait for role to be loaded
    
    // Only load doctors for USER role
    if (userRole === "USER") {
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
      
      // Set today's date as default
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      setDate(`${yyyy}-${mm}-${dd}`);
    }
    
    refreshMy();
  }, [searchParams, userRole]);

  async function refreshMy() {
    // Fetch appointments based on role
    const endpoint = userRole === "DOCTOR" ? "/api/appointments/doctor" : "/api/appointments";
    const r = await fetch(endpoint);
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
  
  function openReviewModal(appointment: any) {
    setReviewAppointment(appointment);
    setSelectedRating(0);
    setReviewText("");
    setHoveredStar(0);
    setShowReviewModal(true);
  }
  
  function closeReviewModal() {
    setShowReviewModal(false);
    setReviewAppointment(null);
    setSelectedRating(0);
    setReviewText("");
    setHoveredStar(0);
  }
  
  async function submitReview() {
    if (selectedRating === 0) {
      alert("Please select a rating");
      return;
    }
    
    setSubmittingReview(true);
    try {
      const r = await fetch(`/api/appointments/${reviewAppointment.id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: selectedRating, review: reviewText || null })
      });
      
      if (r.ok) {
        alert("✅ Review submitted successfully!");
        closeReviewModal();
        refreshMy();
      } else {
        const err = await r.json();
        alert(`❌ ${err.error || "Failed to submit review"}`);
      }
    } catch (e) {
      alert("❌ Error submitting review");
    } finally {
      setSubmittingReview(false);
    }
  }

  // Doctor's view - show their appointments
  if (userRole === "DOCTOR") {
    return (
      <section className="space-y-8 animate-fade-in">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              My Appointments
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            View all patient appointments scheduled with you
          </p>
        </div>

        {/* Appointments List for Doctor */}
        <div className="card p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-3xl">📋</span>
            <span>Patient Appointments</span>
          </h2>
          
          {my.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📅</div>
              <p className="text-xl text-gray-600 mb-2">No appointments yet</p>
              <p className="text-sm text-gray-500">Patients will appear here when they book appointments with you</p>
            </div>
          ) : (
            <div className="space-y-4">
              {my.map((apt) => {
                const aptDate = new Date(apt.date);
                const dateStr = aptDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                });
                const timeStr = formatTime(apt.startMinute);
                const isPast = aptDate < new Date();
                const isToday = aptDate.toDateString() === new Date().toDateString();

                return (
                  <div
                    key={apt.id}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      isToday
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300'
                        : isPast
                        ? 'bg-gray-50 border-gray-200 opacity-75'
                        : 'bg-white border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold">
                            #{apt.serialNumber}
                          </div>
                          <div>
                            <div className="text-xl font-bold text-gray-900">
                              {apt.patient.username}
                            </div>
                            <div className="text-sm text-gray-500">
                              Patient ID: {apt.patient.id.slice(0, 8)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-2 text-gray-700">
                            <span className="text-xl">📅</span>
                            <div>
                              <div className="text-sm text-gray-500">Date</div>
                              <div className="font-semibold">{dateStr}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 text-gray-700">
                            <span className="text-xl">🕐</span>
                            <div>
                              <div className="text-sm text-gray-500">Time</div>
                              <div className="font-semibold">{timeStr}</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-semibold ${
                            apt.status === 'COMPLETED'
                              ? 'bg-green-100 text-green-700'
                              : apt.status === 'CANCELLED'
                              ? 'bg-red-100 text-red-700'
                              : isToday
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {apt.status === 'COMPLETED' ? '✓ Completed' : 
                           apt.status === 'CANCELLED' ? '✗ Cancelled' :
                           isToday ? 'Today' : 'Upcoming'}
                        </span>
                        
                        {isToday && apt.status === 'BOOKED' && (
                          <div className="text-xs text-blue-600 font-semibold animate-pulse">
                            • Appointment Today
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    );
  }

  // User's view - book appointments
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
                      {/* Show review button for past appointments without review */}
                      {(() => {
                        const aptDateTime = new Date(a.date);
                        aptDateTime.setMinutes(a.startMinute);
                        const isPast = aptDateTime < new Date();
                        const hasReview = a.rating !== null;
                        
                        if (isPast && !hasReview && a.status !== "CANCELLED") {
                          return (
                            <button 
                              className="btn bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-sm py-2 px-4 shadow-md hover:shadow-lg transition-all" 
                              onClick={() => openReviewModal(a)}
                            >
                              ⭐ Rate Doctor
                            </button>
                          );
                        }
                        
                        if (hasReview) {
                          return (
                            <div className="flex items-center gap-1">
                              <div className="flex text-amber-400">
                                {[...Array(5)].map((_, i) => (
                                  <span key={i} className={`text-lg ${i < (a.rating || 0) ? 'text-amber-400' : 'text-gray-300'}`}>
                                    ★
                                  </span>
                                ))}
                              </div>
                              <span className="text-xs text-gray-500 ml-1">({a.rating}/5)</span>
                            </div>
                          );
                        }
                        
                        return null;
                      })()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && reviewAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-slide-up">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">Rate Your Experience</h3>
                  <p className="text-amber-100 text-sm mt-1">Dr. {reviewAppointment.doctor.name}</p>
                </div>
                <button 
                  onClick={closeReviewModal}
                  className="text-white hover:text-amber-100 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Star Rating */}
              <div className="text-center">
                <p className="text-gray-700 font-medium mb-4">How would you rate your appointment?</p>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      onClick={() => setSelectedRating(star)}
                      className="focus:outline-none transform transition-all hover:scale-110"
                    >
                      <svg
                        className={`w-12 h-12 transition-colors ${
                          star <= (hoveredStar || selectedRating)
                            ? 'text-amber-400 fill-current'
                            : 'text-gray-300'
                        }`}
                        fill={star <= (hoveredStar || selectedRating) ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        />
                      </svg>
                    </button>
                  ))}
                </div>
                {selectedRating > 0 && (
                  <p className="text-sm text-gray-600 mt-3 animate-fade-in">
                    {selectedRating === 5 && "🎉 Excellent!"}
                    {selectedRating === 4 && "😊 Great!"}
                    {selectedRating === 3 && "👍 Good"}
                    {selectedRating === 2 && "😐 Fair"}
                    {selectedRating === 1 && "😞 Poor"}
                  </p>
                )}
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Share your experience (optional)
                </label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Tell us about your appointment..."
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-400 focus:outline-none transition-colors resize-none"
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1 text-right">
                  {reviewText.length}/500 characters
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={closeReviewModal}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                  disabled={submittingReview}
                >
                  Cancel
                </button>
                <button
                  onClick={submitReview}
                  disabled={selectedRating === 0 || submittingReview}
                  className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all ${
                    selectedRating === 0 || submittingReview
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-md hover:shadow-lg'
                  }`}
                >
                  {submittingReview ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Submitting...</span>
                    </span>
                  ) : (
                    'Submit Review'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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