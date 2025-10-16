'use client';

import { useState } from 'react';
import StarRating from './StarRating';
import EmojiScale from './EmojiScale';

interface EveningData {
  sleepHours?: number;
  sleepQuality?: number;
  morningMood?: number;
  morningEnergy?: number;
  medicationTaken?: boolean;
  eveningMood: number;
  overallDayRating: number;
  exerciseMinutes: number;
  socialInteractions: number;
  socialQuality: number;
  stressLevel: number;
  stressEvents: string;
  anxietyLevel: number;
  depressionIndicator: number;
  intrusiveThoughts: boolean;
  panicAttacks: boolean;
  selfHarmThoughts: boolean;
  gratitudeNote: string;
  dailyWins: string;
  copingStrategies: string;
  eveningComplete: boolean;
}

interface EveningCheckInProps {
  morningData?: any;
  onComplete: (data: EveningData) => void;
  onSkip?: () => void;
}

export default function EveningCheckIn({ morningData, onComplete, onSkip }: EveningCheckInProps) {
  const [overallDayRating, setOverallDayRating] = useState(5);
  const [eveningMood, setEveningMood] = useState(5);
  const [exerciseMinutes, setExerciseMinutes] = useState(0);
  const [socialInteractions, setSocialInteractions] = useState(0);
  const [socialQuality, setSocialQuality] = useState(5);
  const [stressLevel, setStressLevel] = useState(5);
  const [stressEvents, setStressEvents] = useState('');
  const [anxietyLevel, setAnxietyLevel] = useState(5);
  const [depressionIndicator, setDepressionIndicator] = useState(5);
  const [intrusiveThoughts, setIntrusiveThoughts] = useState(false);
  const [panicAttacks, setPanicAttacks] = useState(false);
  const [selfHarmThoughts, setSelfHarmThoughts] = useState(false);
  const [gratitudeNote, setGratitudeNote] = useState('');
  const [dailyWins, setDailyWins] = useState('');
  const [copingStrategies, setCopingStrategies] = useState('');

  const handleSubmit = () => {
    onComplete({
      ...morningData,
      eveningMood,
      overallDayRating,
      exerciseMinutes,
      socialInteractions,
      socialQuality,
      stressLevel,
      stressEvents,
      anxietyLevel,
      depressionIndicator,
      intrusiveThoughts,
      panicAttacks,
      selfHarmThoughts,
      gratitudeNote,
      dailyWins,
      copingStrategies,
      eveningComplete: true,
    });
  };

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">How was your day? 🌆</h2>
        <p className="text-gray-600 mt-1">Let's reflect on your day with a 3-minute check-in.</p>
      </div>

      {morningData && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm font-medium text-blue-900">This morning you reported:</p>
          <p className="text-sm text-blue-700 mt-1">
            Sleep: {morningData.sleepHours}h • Mood: {morningData.morningMood}/10
          </p>
        </div>
      )}

      {/* Overall Day Rating */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Overall, how was your day?
        </label>
        <EmojiScale value={overallDayRating} onChange={setOverallDayRating} min={1} max={10} />
      </div>

      {/* Evening Mood */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          How's your mood right now?
        </label>
        <EmojiScale value={eveningMood} onChange={setEveningMood} min={1} max={10} />
      </div>

      {/* Exercise */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          How many minutes of exercise today?
        </label>
        <input
          type="number"
          value={exerciseMinutes}
          onChange={(e) => setExerciseMinutes(Number(e.target.value))}
          min={0}
          max={300}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="0"
        />
        <p className="text-xs text-gray-500">Any physical activity counts!</p>
      </div>

      {/* Social Interactions */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          How many social interactions did you have?
        </label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={0}
            max={20}
            value={socialInteractions}
            onChange={(e) => setSocialInteractions(Number(e.target.value))}
            className="flex-1 h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-lg font-semibold text-gray-900 min-w-[60px]">
            {socialInteractions}
          </span>
        </div>
        {socialInteractions > 0 && (
          <div className="mt-2">
            <label className="block text-sm text-gray-600 mb-1">Quality of interactions:</label>
            <StarRating value={socialQuality} onChange={setSocialQuality} max={10} />
          </div>
        )}
      </div>

      {/* Stress Level */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          What was your stress level today?
        </label>
        <EmojiScale value={stressLevel} onChange={setStressLevel} min={1} max={10} />
        {stressLevel > 6 && (
          <textarea
            value={stressEvents}
            onChange={(e) => setStressEvents(e.target.value)}
            placeholder="What caused stress today? (optional)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={2}
          />
        )}
      </div>

      {/* Mental Health Indicators */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
        <p className="text-sm font-medium text-gray-700 mb-3">
          Mental Health Check (confidential):
        </p>

        <div className="space-y-2">
          <label className="block text-sm text-gray-600">Anxiety level:</label>
          <EmojiScale value={anxietyLevel} onChange={setAnxietyLevel} min={1} max={10} />
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-gray-600">Feeling down/depressed:</label>
          <EmojiScale value={depressionIndicator} onChange={setDepressionIndicator} min={1} max={10} />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-3 p-3 bg-white rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="checkbox"
              checked={intrusiveThoughts}
              onChange={(e) => setIntrusiveThoughts(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">I experienced intrusive thoughts</span>
          </label>

          <label className="flex items-center gap-3 p-3 bg-white rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="checkbox"
              checked={panicAttacks}
              onChange={(e) => setPanicAttacks(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">I had a panic attack</span>
          </label>

          <label className="flex items-center gap-3 p-3 bg-white rounded-lg cursor-pointer hover:bg-red-50 transition-colors">
            <input
              type="checkbox"
              checked={selfHarmThoughts}
              onChange={(e) => setSelfHarmThoughts(e.target.checked)}
              className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
            />
            <span className="text-sm text-gray-700">I had thoughts of self-harm</span>
          </label>
        </div>
      </div>

      {/* Coping Strategies */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          What coping strategies did you use today?
        </label>
        <textarea
          value={copingStrategies}
          onChange={(e) => setCopingStrategies(e.target.value)}
          placeholder="E.g., meditation, talking to a friend, exercise, listening to music..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={2}
        />
      </div>

      {/* Gratitude & Wins */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            What's one thing you're grateful for today? 🙏
          </label>
          <textarea
            value={gratitudeNote}
            onChange={(e) => setGratitudeNote(e.target.value)}
            placeholder="Even small things count..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            What went well today? 🎉
          </label>
          <textarea
            value={dailyWins}
            onChange={(e) => setDailyWins(e.target.value)}
            placeholder="Celebrate your wins, big or small..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={2}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4 sticky bottom-0 bg-white pb-4">
        <button
          onClick={handleSubmit}
          className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Complete Day Check-In ✓
        </button>
        {onSkip && (
          <button
            onClick={onSkip}
            className="px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors"
          >
            Skip
          </button>
        )}
      </div>
    </div>
  );
}
