"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface CheckInData {
  id?: string;
  date?: Date | string;
  sleepHours?: number;
  morningMood?: number;
  eveningMood?: number;
  stressLevel?: number;
  riskScore?: number;
  riskLevel?: string;
}

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalCheckIns: number;
}

export default function DailyCheckInCard() {
  const [loading, setLoading] = useState(true);
  const [todayCheckIn, setTodayCheckIn] = useState<CheckInData | null>(null);
  const [streak, setStreak] = useState<StreakData>({ currentStreak: 0, longestStreak: 0, totalCheckIns: 0 });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [checkInRes, streakRes] = await Promise.all([
        fetch("/api/check-in/today"),
        fetch("/api/check-in/streak")
      ]);
      
      if (checkInRes.ok) {
        const data = await checkInRes.json();
        setTodayCheckIn(data.checkIn);
      }
      
      if (streakRes.ok) {
        const data = await streakRes.json();
        setStreak(data);
      }
    } catch (error) {
      console.error("Failed to load check-in data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="card p-6 hover:shadow-2xl transition-all duration-300">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-2/3"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </section>
    );
  }

  const getRiskColor = (level?: string) => {
    switch (level) {
      case "low": return "text-green-600 bg-green-50 border-green-200";
      case "medium": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "high": return "text-orange-600 bg-orange-50 border-orange-200";
      case "critical": return "text-red-600 bg-red-50 border-red-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStreakEmoji = (streak: number) => {
    if (streak >= 30) return "🔥🔥🔥";
    if (streak >= 14) return "🔥🔥";
    if (streak >= 7) return "🔥";
    return "📊";
  };

  return (
    <section className="card p-6 hover:shadow-2xl transition-all duration-300 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📊</span>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Daily Check-In</h3>
            <p className="text-xs text-gray-500">Track your journey</p>
          </div>
        </div>
        <Link 
          href="#checkin" 
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          Update →
        </Link>
      </div>

      {/* Streak */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-xl text-white mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs opacity-90">Current Streak</p>
            <p className="text-2xl font-bold">{streak.currentStreak} days</p>
          </div>
          <div className="text-4xl">{getStreakEmoji(streak.currentStreak)}</div>
        </div>
        <div className="flex gap-4 mt-2 text-xs opacity-90">
          <span>Longest: {streak.longestStreak}</span>
          <span>Total: {streak.totalCheckIns}</span>
        </div>
      </div>

      {/* Today's Status */}
      {todayCheckIn ? (
        <div className="space-y-3">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
              <p className="text-xs text-blue-600 mb-1">Sleep</p>
              <p className="text-lg font-bold text-blue-900">
                {todayCheckIn.sleepHours ? `${todayCheckIn.sleepHours}h` : "-"}
              </p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
              <p className="text-xs text-purple-600 mb-1">Mood</p>
              <p className="text-lg font-bold text-purple-900">
                {todayCheckIn.morningMood || todayCheckIn.eveningMood 
                  ? `${Math.round(((todayCheckIn.morningMood || 0) + (todayCheckIn.eveningMood || 0)) / (todayCheckIn.morningMood && todayCheckIn.eveningMood ? 2 : 1))}/10`
                  : "-"
                }
              </p>
            </div>
          </div>

          {/* Risk Level */}
          {todayCheckIn.riskLevel && (
            <div className={`p-3 rounded-lg border ${getRiskColor(todayCheckIn.riskLevel)}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide">Risk Level</p>
                  <p className="text-sm font-bold capitalize">{todayCheckIn.riskLevel}</p>
                </div>
                <div className="text-xl">
                  {todayCheckIn.riskLevel === "low" && "✅"}
                  {todayCheckIn.riskLevel === "medium" && "⚠️"}
                  {todayCheckIn.riskLevel === "high" && "🔴"}
                  {todayCheckIn.riskLevel === "critical" && "🚨"}
                </div>
              </div>
            </div>
          )}

          {/* Update CTA */}
          <Link 
            href="#checkin"
            className="block w-full py-2 text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all text-sm"
          >
            Update Check-In
          </Link>
        </div>
      ) : (
        <div className="text-center py-6">
          <div className="text-4xl mb-3">📝</div>
          <p className="text-gray-600 text-sm mb-3">No check-in yet today</p>
          <Link 
            href="#checkin"
            className="inline-block px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all text-sm"
          >
            Start Check-In
          </Link>
        </div>
      )}

      {/* Quick Tip */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 flex items-start gap-2">
          <span>💡</span>
          <span>Regular check-ins help our AI provide better mental health insights</span>
        </p>
      </div>
    </section>
  );
}
