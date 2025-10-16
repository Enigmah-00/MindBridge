"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface AnalyticsData {
  // Day Analysis
  appointmentsByDay: { day: string; count: number; dayName: string }[];
  peakDay: { day: string; count: number; dayName: string };
  
  // Fee Analysis
  feeRanges: {
    range: string;
    avgAppointments: number;
    doctorCount: number;
    totalAppointments: number;
  }[];
  optimalFeeRange: string;
  
  // Overall Stats
  totalDoctors: number;
  totalAppointments: number;
  totalPatients: number;
  avgAppointmentsPerDoctor: number;
  
  // Revenue Insights
  avgFee: number;
  estimatedTotalRevenue: number;
  topEarningRange: { range: string; revenue: number };
  
  // Patient Behavior
  mostBookedSpecialty: { name: string; count: number };
  telehealthVsInPerson: { telehealth: number; inPerson: number };
  peakBookingHour: { hour: string; count: number };
  
  // Doctor Performance
  topDoctors: {
    name: string;
    appointments: number;
    fee: number;
    revenue: number;
    avgRating?: number | null;
    totalReviews?: number;
  }[];
}

export default function BusinessInsightsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "days" | "fees" | "doctors">("overview");

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch("/api/analytics/business");
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load analytics</p>
          <button onClick={fetchAnalytics} className="btn btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const maxDayCount = Math.max(...analytics.appointmentsByDay.map(d => d.count));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">📊 Business Insights</h1>
          <p className="text-gray-600">Platform-wide analytics and trends</p>
        </div>
        <Link href="/dashboard" className="btn btn-secondary">
          Back to Dashboard
        </Link>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{analytics.totalPatients}</div>
              <div className="text-sm text-gray-600">Active Patients</div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {analytics.avgFee > 0 ? `৳${analytics.avgFee}` : "—"}
              </div>
              <div className="text-sm text-gray-600">Avg. Fee</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === "overview"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("days")}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === "days"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Day Analysis
          </button>
          <button
            onClick={() => setActiveTab("fees")}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === "fees"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Fee Analysis
          </button>
          <button
            onClick={() => setActiveTab("doctors")}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === "doctors"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Top Doctors
          </button>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Peak Day Insight */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="text-2xl">📈</span>
              Peak Booking Day
            </h3>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {analytics.peakDay.dayName}
              </div>
              <div className="text-gray-700 text-lg">
                {analytics.peakDay.count} appointments on average
              </div>
              <div className="mt-4 text-sm text-gray-600">
                💡 <strong>Insight:</strong> Schedule more doctors on {analytics.peakDay.dayName} to meet demand
              </div>
            </div>
          </div>

          {/* Optimal Fee Range */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="text-2xl">💵</span>
              Optimal Fee Range
            </h3>
            {analytics.optimalFeeRange ? (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {analytics.optimalFeeRange}
                </div>
                <div className="text-gray-700 text-lg">
                  Gets most patient bookings
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  💡 <strong>Insight:</strong> Doctors in this range have the highest booking rates
                </div>
              </div>
            ) : (
              <div className="p-6 bg-gray-50 rounded-lg text-center">
                <p className="text-gray-600 mb-2">No fee data available</p>
                <p className="text-sm text-gray-500">Set your consultation fee to see optimal pricing insights</p>
              </div>
            )}
          </div>

          {/* Revenue Insights */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="text-2xl">💰</span>
              Revenue Analysis
            </h3>
            {analytics.estimatedTotalRevenue > 0 ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-amber-50 rounded-lg">
                  <span className="text-gray-700">Estimated Total Revenue</span>
                  <span className="text-2xl font-bold text-amber-600">
                    ৳{analytics.estimatedTotalRevenue.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                  <span className="text-gray-700">Top Earning Range</span>
                  <span className="text-xl font-bold text-purple-600">
                    {analytics.topEarningRange.range}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                  <span className="text-gray-700">Avg. per Doctor</span>
                  <span className="text-xl font-bold text-blue-600">
                    {analytics.avgAppointmentsPerDoctor.toFixed(1)} bookings
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-gray-50 rounded-lg text-center">
                <p className="text-gray-600 mb-2">No revenue data available</p>
                <p className="text-sm text-gray-500">Doctors need to set their consultation fees in their profiles</p>
              </div>
            )}
          </div>

          {/* Patient Behavior */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="text-2xl">👥</span>
              Patient Preferences
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-indigo-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Most Booked Specialty</div>
                <div className="text-xl font-bold text-indigo-600">
                  {analytics.mostBookedSpecialty.name}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {analytics.mostBookedSpecialty.count} appointments
                </div>
              </div>
              
              <div className="p-4 bg-cyan-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-2">Telehealth vs In-Person</div>
                <div className="flex gap-4">
                  <div>
                    <div className="text-lg font-bold text-cyan-600">
                      {analytics.telehealthVsInPerson.telehealth}
                    </div>
                    <div className="text-xs text-gray-600">Telehealth</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-cyan-600">
                      {analytics.telehealthVsInPerson.inPerson}
                    </div>
                    <div className="text-xs text-gray-600">In-Person</div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-teal-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Peak Booking Hour</div>
                <div className="text-xl font-bold text-teal-600">
                  {analytics.peakBookingHour.hour}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {analytics.peakBookingHour.count} appointments
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Day Analysis Tab */}
      {activeTab === "days" && (
        <div className="card p-6">
          <h3 className="text-xl font-semibold mb-6">Appointments by Day of Week</h3>
          <div className="space-y-4">
            {analytics.appointmentsByDay.map((day) => (
              <div key={day.day} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700 w-32">{day.dayName}</span>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 rounded-full h-8 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full flex items-center justify-end pr-3 text-white text-sm font-medium transition-all duration-500"
                        style={{ width: `${(day.count / maxDayCount) * 100}%` }}
                      >
                        {day.count > 0 && day.count}
                      </div>
                    </div>
                  </div>
                  <span className="text-gray-600 w-24 text-right">{day.count} bookings</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-6 bg-blue-50 rounded-xl">
            <h4 className="font-semibold text-blue-900 mb-3">📊 Business Recommendations:</h4>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• <strong>{analytics.peakDay.dayName}</strong> shows highest patient volume - consider increasing doctor availability</li>
              <li>• Lower traffic days could benefit from promotional offers or flexible scheduling</li>
              <li>• Balance doctor schedules across the week for optimal resource utilization</li>
            </ul>
          </div>
        </div>
      )}

      {/* Fee Analysis Tab */}
      {activeTab === "fees" && (
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="text-xl font-semibold mb-6">Fee Range Performance</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Fee Range (BDT)</th>
                    <th className="text-center py-3 px-4">Doctors</th>
                    <th className="text-center py-3 px-4">Total Appointments</th>
                    <th className="text-center py-3 px-4">Avg per Doctor</th>
                    <th className="text-center py-3 px-4">Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.feeRanges.map((range, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <span className="font-semibold text-gray-900">{range.range}</span>
                      </td>
                      <td className="text-center py-4 px-4 text-gray-700">{range.doctorCount}</td>
                      <td className="text-center py-4 px-4 text-gray-700">{range.totalAppointments}</td>
                      <td className="text-center py-4 px-4">
                        <span className="font-semibold text-blue-600">
                          {range.avgAppointments.toFixed(1)}
                        </span>
                      </td>
                      <td className="text-center py-4 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
                              style={{
                                width: `${Math.min(
                                  (range.avgAppointments /
                                    Math.max(...analytics.feeRanges.map(r => r.avgAppointments))) *
                                    100,
                                  100
                                )}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card p-6 bg-gradient-to-br from-green-50 to-emerald-50">
            <h4 className="font-semibold text-green-900 mb-4 text-lg">💡 Pricing Strategy Insights:</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-green-800">
              <div className="bg-white/50 p-4 rounded-lg">
                <strong className="text-green-900">Best Performer:</strong>
                <p className="mt-2">{analytics.optimalFeeRange} attracts the most patients per doctor</p>
              </div>
              <div className="bg-white/50 p-4 rounded-lg">
                <strong className="text-green-900">Sweet Spot:</strong>
                <p className="mt-2">Fees between ৳500-1000 balance affordability and quality perception</p>
              </div>
              <div className="bg-white/50 p-4 rounded-lg">
                <strong className="text-green-900">Market Position:</strong>
                <p className="mt-2">Lower fees increase accessibility, higher fees signal expertise</p>
              </div>
              <div className="bg-white/50 p-4 rounded-lg">
                <strong className="text-green-900">Recommendation:</strong>
                <p className="mt-2">New doctors should start in {analytics.optimalFeeRange} range</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Doctors Tab */}
      {activeTab === "doctors" && (
        <div className="card p-6">
          <h3 className="text-xl font-semibold mb-6">Top Rated Doctors</h3>
          {analytics.topDoctors.length > 0 ? (
            <div className="space-y-4">
              {analytics.topDoctors.map((doctor, idx) => (
                <div
                  key={idx}
                  className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold">
                        #{idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-semibold text-gray-900">{doctor.name}</span>
                          {doctor.avgRating && doctor.avgRating > 0 && (
                            <span className="text-yellow-500 text-lg">
                              {'⭐'.repeat(Math.round(doctor.avgRating))}
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          {doctor.appointments} appointments • ৳{doctor.fee} per visit
                        </div>
                        {doctor.avgRating && doctor.avgRating > 0 && doctor.totalReviews && doctor.totalReviews > 0 ? (
                          <div className="text-sm text-yellow-600 font-medium mt-1">
                            {doctor.avgRating.toFixed(1)} stars ({doctor.totalReviews} {doctor.totalReviews === 1 ? 'review' : 'reviews'})
                          </div>
                        ) : (
                          <div className="text-xs text-gray-400 italic mt-1">
                            No reviews yet
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        ৳{doctor.revenue.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Total Revenue</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 bg-gray-50 rounded-lg text-center">
              <div className="text-4xl mb-4">⭐</div>
              <p className="text-gray-600 mb-2">No doctors registered yet</p>
              <p className="text-sm text-gray-500">Doctors will appear here once they join the platform. Rankings are based on patient ratings and reviews.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
