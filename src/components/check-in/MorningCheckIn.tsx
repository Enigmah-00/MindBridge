'use client';

import { useState } from 'react';
import StarRating from './StarRating';
import EmojiScale from './EmojiScale';

interface MorningData {
  sleepHours: number;
  sleepQuality: number;
  morningMood: number;
  morningEnergy: number;
  medicationTaken: boolean;
  morningComplete: boolean;
}

interface MorningCheckInProps {
  onComplete: (data: MorningData) => void;
  onSkip?: () => void;
}

export default function MorningCheckIn({ onComplete, onSkip }: MorningCheckInProps) {
  const [sleepHours, setSleepHours] = useState(7);
  const [sleepQuality, setSleepQuality] = useState(3);
  const [morningMood, setMorningMood] = useState(5);
  const [morningEnergy, setMorningEnergy] = useState(5);
  const [medicationTaken, setMedicationTaken] = useState(false);

  const handleSubmit = () => {
    onComplete({
      sleepHours,
      sleepQuality,
      morningMood,
      morningEnergy,
      medicationTaken,
      morningComplete: true,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Good morning! 🌅</h2>
        <p className="text-gray-600 mt-1">Let's start your day with a quick 2-minute check-in.</p>
      </div>

      {/* Question 1: Sleep Hours */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          How many hours did you sleep?
        </label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="0"
            max="12"
            step="0.5"
            value={sleepHours}
            onChange={(e) => setSleepHours(Number(e.target.value))}
            className="flex-1 h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-lg font-semibold text-gray-900 min-w-[80px]">
            {sleepHours} hours
          </span>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>0h</span>
          <span>6h</span>
          <span>12h</span>
        </div>
      </div>

      {/* Question 2: Sleep Quality */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          How was your sleep quality?
        </label>
        <StarRating value={sleepQuality} onChange={setSleepQuality} max={5} size="lg" />
        <p className="text-xs text-gray-500">1 = Terrible, 5 = Excellent</p>
      </div>

      {/* Question 3: Morning Mood */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          How's your mood this morning?
        </label>
        <EmojiScale value={morningMood} onChange={setMorningMood} min={1} max={10} />
      </div>

      {/* Question 4: Energy Level */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          How's your energy level?
        </label>
        <EmojiScale value={morningEnergy} onChange={setMorningEnergy} min={1} max={10} />
      </div>

      {/* Question 5: Medication */}
      <div className="space-y-2">
        <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
          <input
            type="checkbox"
            checked={medicationTaken}
            onChange={(e) => setMedicationTaken(e.target.checked)}
            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
          />
          <div>
            <span className="text-sm font-medium text-gray-900">
              I took my medication today
            </span>
            <p className="text-xs text-gray-500">Check this if you're on any prescribed medication</p>
          </div>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4">
        <button
          onClick={handleSubmit}
          className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Complete Morning Check-In ✓
        </button>
        {onSkip && (
          <button
            onClick={onSkip}
            className="px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors"
          >
            Skip for now
          </button>
        )}
      </div>
    </div>
  );
}
