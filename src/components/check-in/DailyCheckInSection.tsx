"use client";

import { useState, useEffect } from "react";
import StarRating from "./StarRating";
import EmojiScale from "./EmojiScale";
import CheckInStreak from "./CheckInStreak";

interface CheckInData {
  id?: string;
  date?: Date | string;
  sleepHours: number;
  sleepQuality: number;
  morningMood: number;
  morningEnergy: number;
  medicationTaken: boolean;
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
}

export default function DailyCheckInSection() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [todayCheckIn, setTodayCheckIn] = useState<CheckInData | null>(null);
  const [isExpanded, setIsExpanded] = useState(false); // Start collapsed

  // Initialize with default values
  const [formData, setFormData] = useState<CheckInData>({
    sleepHours: 7,
    sleepQuality: 3,
    morningMood: 5,
    morningEnergy: 5,
    medicationTaken: false,
    eveningMood: 5,
    overallDayRating: 5,
    exerciseMinutes: 0,
    socialInteractions: 0,
    socialQuality: 5,
    stressLevel: 5,
    stressEvents: "",
    anxietyLevel: 5,
    depressionIndicator: 5,
    intrusiveThoughts: false,
    panicAttacks: false,
    selfHarmThoughts: false,
    gratitudeNote: "",
    dailyWins: "",
    copingStrategies: "",
  });

  // Load today's check-in data
  useEffect(() => {
    loadTodayCheckIn();
    
    // Expand if linked from card
    if (window.location.hash === '#checkin') {
      setIsExpanded(true);
    }
  }, []);

  const loadTodayCheckIn = async () => {
    try {
      const res = await fetch("/api/check-in/today");
      const data = await res.json();
      
      if (data.checkIn) {
        setTodayCheckIn(data.checkIn);
        setFormData({
          sleepHours: data.checkIn.sleepHours || 7,
          sleepQuality: data.checkIn.sleepQuality || 3,
          morningMood: data.checkIn.morningMood || 5,
          morningEnergy: data.checkIn.morningEnergy || 5,
          medicationTaken: data.checkIn.medicationTaken || false,
          eveningMood: data.checkIn.eveningMood || 5,
          overallDayRating: data.checkIn.overallDayRating || 5,
          exerciseMinutes: data.checkIn.exerciseMinutes || 0,
          socialInteractions: data.checkIn.socialInteractions || 0,
          socialQuality: data.checkIn.socialQuality || 5,
          stressLevel: data.checkIn.stressLevel || 5,
          stressEvents: data.checkIn.stressEvents || "",
          anxietyLevel: data.checkIn.anxietyLevel || 5,
          depressionIndicator: data.checkIn.depressionIndicator || 5,
          intrusiveThoughts: data.checkIn.intrusiveThoughts || false,
          panicAttacks: data.checkIn.panicAttacks || false,
          selfHarmThoughts: data.checkIn.selfHarmThoughts || false,
          gratitudeNote: data.checkIn.gratitudeNote || "",
          dailyWins: data.checkIn.dailyWins || "",
          copingStrategies: data.checkIn.copingStrategies || "",
        });
      }
    } catch (error) {
      console.error("Failed to load check-in:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage("");

    try {
      const res = await fetch("/api/check-in/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        setTodayCheckIn(data.checkIn);
        setSaveMessage("✅ Saved successfully!");
        
        setTimeout(() => setSaveMessage(""), 3000);
      } else {
        setSaveMessage("❌ Failed to save");
      }
    } catch (error) {
      console.error("Save failed:", error);
      setSaveMessage("❌ Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof CheckInData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <section className="card p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="card p-6 hover:shadow-xl transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-3xl">📊</span>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Daily Check-In</h3>
            <p className="text-sm text-gray-600">Track your mental health journey</p>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {isExpanded ? "▲" : "▼"}
        </button>
      </div>

      {/* Streak Display */}
      <div className="mb-6">
        <CheckInStreak />
      </div>

      {/* Expandable Form */}
      {isExpanded && (
        <div className="space-y-8 animate-fade-in">
          {/* Morning Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
              <span className="text-2xl">🌅</span>
              <h4 className="text-lg font-semibold text-gray-900">Morning Check-In</h4>
            </div>

            {/* Sleep Hours */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hours of Sleep: <span className="text-blue-600 font-bold">{formData.sleepHours}h</span>
              </label>
              <input
                type="range"
                min="0"
                max="12"
                step="0.5"
                value={formData.sleepHours}
                onChange={(e) => updateField("sleepHours", parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0h</span>
                <span>6h</span>
                <span>12h</span>
              </div>
            </div>

            {/* Sleep Quality */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sleep Quality</label>
              <StarRating
                value={formData.sleepQuality}
                onChange={(val) => updateField("sleepQuality", val)}
                max={5}
              />
            </div>

            {/* Morning Mood */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Morning Mood</label>
              <EmojiScale
                value={formData.morningMood}
                onChange={(val) => updateField("morningMood", val)}
              />
            </div>

            {/* Morning Energy */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Energy Level</label>
              <EmojiScale
                value={formData.morningEnergy}
                onChange={(val) => updateField("morningEnergy", val)}
              />
            </div>

            {/* Medication */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="medication"
                checked={formData.medicationTaken}
                onChange={(e) => updateField("medicationTaken", e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="medication" className="text-sm font-medium text-gray-700 cursor-pointer">
                I took my medication today
              </label>
            </div>
          </div>

          {/* Evening Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
              <span className="text-2xl">🌙</span>
              <h4 className="text-lg font-semibold text-gray-900">Evening Reflection</h4>
            </div>

            {/* Overall Day Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Overall Day Rating</label>
              <StarRating
                value={formData.overallDayRating}
                onChange={(val) => updateField("overallDayRating", val)}
                max={10}
              />
            </div>

            {/* Evening Mood */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Evening Mood</label>
              <EmojiScale
                value={formData.eveningMood}
                onChange={(val) => updateField("eveningMood", val)}
              />
            </div>

            {/* Exercise */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exercise (minutes): <span className="text-green-600 font-bold">{formData.exerciseMinutes}</span>
              </label>
              <input
                type="range"
                min="0"
                max="120"
                step="5"
                value={formData.exerciseMinutes}
                onChange={(e) => updateField("exerciseMinutes", parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
            </div>

            {/* Social Interactions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Social Interactions: <span className="text-purple-600 font-bold">{formData.socialInteractions}</span>
              </label>
              <input
                type="range"
                min="0"
                max="10"
                value={formData.socialInteractions}
                onChange={(e) => updateField("socialInteractions", parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
            </div>

            {/* Social Quality */}
            {formData.socialInteractions > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Social Quality</label>
                <EmojiScale
                  value={formData.socialQuality}
                  onChange={(val) => updateField("socialQuality", val)}
                />
              </div>
            )}

            {/* Stress Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stress Level</label>
              <EmojiScale
                value={formData.stressLevel}
                onChange={(val) => updateField("stressLevel", val)}
              />
            </div>

            {/* Stress Events */}
            {formData.stressLevel > 6 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What caused stress today? (Optional)
                </label>
                <textarea
                  value={formData.stressEvents}
                  onChange={(e) => updateField("stressEvents", e.target.value)}
                  placeholder="Describe any stressful events..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                />
              </div>
            )}

            {/* Anxiety */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Anxiety Level</label>
              <EmojiScale
                value={formData.anxietyLevel}
                onChange={(val) => updateField("anxietyLevel", val)}
              />
            </div>

            {/* Depression Indicator */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How sad or down did you feel?
              </label>
              <EmojiScale
                value={formData.depressionIndicator}
                onChange={(val) => updateField("depressionIndicator", val)}
              />
            </div>

            {/* Mental Health Checkboxes */}
            <div className="space-y-2 bg-red-50 p-4 rounded-lg border border-red-200">
              <p className="text-sm font-medium text-red-900 mb-2">Did you experience any of the following?</p>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="intrusiveThoughts"
                  checked={formData.intrusiveThoughts}
                  onChange={(e) => updateField("intrusiveThoughts", e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded"
                />
                <label htmlFor="intrusiveThoughts" className="text-sm text-gray-700">
                  Intrusive thoughts
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="panicAttacks"
                  checked={formData.panicAttacks}
                  onChange={(e) => updateField("panicAttacks", e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded"
                />
                <label htmlFor="panicAttacks" className="text-sm text-gray-700">
                  Panic attacks
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="selfHarm"
                  checked={formData.selfHarmThoughts}
                  onChange={(e) => updateField("selfHarmThoughts", e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded"
                />
                <label htmlFor="selfHarm" className="text-sm text-gray-700">
                  Thoughts of self-harm
                </label>
              </div>

              {(formData.intrusiveThoughts || formData.panicAttacks || formData.selfHarmThoughts) && (
                <div className="mt-3 p-3 bg-red-100 rounded-lg">
                  <p className="text-sm text-red-900 font-medium">
                    ⚠️ If you're in crisis, please contact:
                  </p>
                  <p className="text-sm text-red-800 mt-1">
                    <strong>Crisis Helpline:</strong> 988 (US) or visit /resources
                  </p>
                </div>
              )}
            </div>

            {/* Gratitude */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                💙 Gratitude Note (Optional)
              </label>
              <textarea
                value={formData.gratitudeNote}
                onChange={(e) => updateField("gratitudeNote", e.target.value)}
                placeholder="What are you grateful for today?"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={2}
              />
            </div>

            {/* Daily Wins */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🎯 Daily Wins (Optional)
              </label>
              <textarea
                value={formData.dailyWins}
                onChange={(e) => updateField("dailyWins", e.target.value)}
                placeholder="What went well today?"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={2}
              />
            </div>

            {/* Coping Strategies */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🛠️ Coping Strategies Used (Optional)
              </label>
              <textarea
                value={formData.copingStrategies}
                onChange={(e) => updateField("copingStrategies", e.target.value)}
                placeholder="What helped you cope today?"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={2}
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                {saveMessage && (
                  <span className={`text-sm font-medium ${saveMessage.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
                    {saveMessage}
                  </span>
                )}
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {saving ? "Saving..." : "💾 Save Check-In"}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Last updated: {todayCheckIn?.date ? new Date(todayCheckIn.date).toLocaleString() : "Not saved yet"}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
