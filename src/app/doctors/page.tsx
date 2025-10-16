"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Doctor {
  id: string;
  name: string;
  location: string;
  telehealth: boolean;
  specialties: string[];
  userId?: string;
  availability: string[];
  hasAvailability: boolean;
  avgRating?: number;
  totalReviews?: number;
}

export default function DoctorsListPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTelehealth, setFilterTelehealth] = useState<boolean | null>(null);

  useEffect(() => {
    loadDoctors();
  }, []);

  async function loadDoctors() {
    setLoading(true);
    try {
      const res = await fetch("/api/doctors/list");
      if (!res.ok) {
        console.error("Failed to fetch doctors:", res.status, res.statusText);
        setDoctors([]);
        setLoading(false);
        return;
      }
      const text = await res.text();
      if (!text) {
        console.error("Empty response from API");
        setDoctors([]);
        setLoading(false);
        return;
      }
      const data = JSON.parse(text);
      setDoctors(data);
    } catch (error) {
      console.error("Error loading doctors:", error);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  }

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialties.some((s) =>
        s.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesTelehealth =
      filterTelehealth === null || doc.telehealth === filterTelehealth;
    return matchesSearch && matchesTelehealth;
  });

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold">🩺 Find a Doctor</h1>

      {/* Filters */}
      <div className="card p-4 space-y-4">
        <input
          type="text"
          placeholder="Search by name, location, or specialty..."
          className="input w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex gap-3">
          <button
            onClick={() => setFilterTelehealth(null)}
            className={`btn ${filterTelehealth === null ? "bg-blue-600 text-white" : ""}`}
          >
            All Doctors
          </button>
          <button
            onClick={() => setFilterTelehealth(true)}
            className={`btn ${filterTelehealth === true ? "bg-blue-600 text-white" : ""}`}
          >
            Telehealth Available
          </button>
          <button
            onClick={() => setFilterTelehealth(false)}
            className={`btn ${filterTelehealth === false ? "bg-blue-600 text-white" : ""}`}
          >
            In-Person Only
          </button>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="card p-6 text-center text-gray-500">
          Loading doctors...
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="card p-6 text-center text-gray-500">
          No doctors found matching your criteria.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className="card p-5 space-y-3 hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{doctor.name}</h3>
                  <div className="text-sm text-gray-600 mt-1">
                    📍 {doctor.location}
                  </div>
                </div>
                {doctor.telehealth && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    Telehealth
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <div className="text-sm font-medium text-gray-700">
                  Specialties:
                </div>
                <div className="flex flex-wrap gap-1">
                  {doctor.specialties.map((spec, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Rating Display */}
              <div className="border-t pt-3">
                {doctor.avgRating && doctor.totalReviews && doctor.totalReviews > 0 ? (
                  <div className="flex items-center gap-2">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-lg ${i < Math.round(doctor.avgRating!) ? 'text-amber-400' : 'text-gray-300'}`}>
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-700 font-medium">
                      {doctor.avgRating.toFixed(1)}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({doctor.totalReviews} {doctor.totalReviews === 1 ? 'review' : 'reviews'})
                    </span>
                  </div>
                ) : (
                  <div className="text-xs text-gray-400 italic">
                    No reviews yet
                  </div>
                )}
              </div>

              {/* Availability Section */}
              {doctor.hasAvailability ? (
                <div className="space-y-1 border-t pt-3">
                  <div className="text-sm font-medium text-green-700 flex items-center gap-1">
                    ⏰ Available Hours (BD Time)
                  </div>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {doctor.availability.map((avail, idx) => (
                      <div
                        key={idx}
                        className="text-xs text-gray-700 bg-green-50 px-2 py-1 rounded"
                      >
                        {avail}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="border-t pt-3">
                  <div className="text-xs text-gray-500 italic">
                    ⏰ Availability not set yet
                  </div>
                </div>
              )}

              <div className="pt-3 flex gap-2">
                <Link
                  href={`/appointments?doctorId=${doctor.id}`}
                  className="btn flex-1 text-sm"
                >
                  📅 Book
                </Link>
                {doctor.userId && (
                  <Link
                    href={`/messages/${doctor.userId}`}
                    className="btn flex-1 text-sm bg-green-600 hover:bg-green-700 text-white"
                  >
                    💬 Message
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
