'use client';

import { useEffect, useState } from 'react';

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalCheckIns: number;
  lastCheckIn: Date | null;
}

export default function CheckInStreak() {
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStreak();
  }, []);

  const fetchStreak = async () => {
    try {
      const res = await fetch('/api/check-in/streak');
      if (res.ok) {
        const data = await res.json();
        setStreakData(data);
      }
    } catch (error) {
      console.error('Error fetching streak:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-xl text-white animate-pulse">
        <div className="h-20 bg-white/20 rounded"></div>
      </div>
    );
  }

  if (!streakData) return null;

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-xl text-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-90">Current Streak</p>
          <p className="text-4xl font-bold">{streakData.currentStreak} days</p>
        </div>
        <div className="text-6xl">{streakData.currentStreak > 0 ? '🔥' : '😴'}</div>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm opacity-90">Longest Streak</p>
          <p className="text-2xl font-bold">{streakData.longestStreak} days</p>
        </div>
        <div>
          <p className="text-sm opacity-90">Total Check-Ins</p>
          <p className="text-2xl font-bold">{streakData.totalCheckIns}</p>
        </div>
      </div>
      
      {streakData.currentStreak >= 7 && (
        <div className="mt-4 bg-white/20 p-3 rounded-lg">
          <p className="text-sm">
            🎯 Amazing! You've checked in for{' '}
            {streakData.currentStreak >= 30 ? 'a full month' : 
             streakData.currentStreak >= 7 ? 'a full week' : 
             `${streakData.currentStreak} days in a row`}. Keep it up!
          </p>
        </div>
      )}
      
      {streakData.currentStreak === 0 && streakData.totalCheckIns > 0 && (
        <div className="mt-4 bg-white/20 p-3 rounded-lg">
          <p className="text-sm">
            💪 Start a new streak today! Your longest was {streakData.longestStreak} days.
          </p>
        </div>
      )}
    </div>
  );
}
