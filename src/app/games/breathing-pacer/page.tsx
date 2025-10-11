"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function BreathingPacerPage() {
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [isActive, setIsActive] = useState(false);
  const [count, setCount] = useState(0);
  const [totalBreaths, setTotalBreaths] = useState(0);

  const durations = {
    inhale: 4000,   // 4 seconds
    hold: 2000,     // 2 seconds
    exhale: 6000,   // 6 seconds
  };

  useEffect(() => {
    if (!isActive) return;

    const duration = durations[phase];
    const interval = 100;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += interval;
      setCount(Math.floor((duration - elapsed) / 1000) + 1);

      if (elapsed >= duration) {
        if (phase === "inhale") {
          setPhase("hold");
        } else if (phase === "hold") {
          setPhase("exhale");
        } else {
          setPhase("inhale");
          setTotalBreaths((prev) => prev + 1);
        }
      }
    }, interval);

    return () => clearInterval(timer);
  }, [isActive, phase]);

  const handleStart = () => {
    setIsActive(true);
    setPhase("inhale");
    setCount(4);
  };

  const handleStop = () => {
    setIsActive(false);
    setPhase("inhale");
    setCount(0);
  };

  const getPhaseText = () => {
    switch (phase) {
      case "inhale":
        return "Breathe In";
      case "hold":
        return "Hold";
      case "exhale":
        return "Breathe Out";
    }
  };

  return (
    <div className="max-w-2xl mx-auto text-center">
      <Link href="/games" className="inline-block mb-6 text-blue-600 hover:underline">
        ← Back to Games
      </Link>

      <h1 className="text-3xl font-bold mb-2">Breathing Pacer</h1>
      <p className="text-gray-600 mb-8">
        Follow the circle to practice mindful breathing
      </p>

      <div className="card p-8 mb-6">
        <div className="relative w-64 h-64 mx-auto mb-8">
          {/* Breathing Circle */}
          <div
            className={`absolute inset-0 rounded-full transition-all duration-1000 flex items-center justify-center ${
              phase === "inhale"
                ? "bg-blue-200 scale-100"
                : phase === "hold"
                ? "bg-purple-200 scale-100"
                : "bg-green-200 scale-50"
            }`}
            style={{
              transitionDuration:
                phase === "inhale"
                  ? "4000ms"
                  : phase === "hold"
                  ? "2000ms"
                  : "6000ms",
            }}
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">
                {isActive ? getPhaseText() : "Ready"}
              </div>
              {isActive && (
                <div className="text-4xl font-bold text-gray-900 mt-2">
                  {count}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {!isActive ? (
            <button onClick={handleStart} className="btn w-full">
              Start Breathing Exercise
            </button>
          ) : (
            <button
              onClick={handleStop}
              className="btn bg-red-500 hover:bg-red-600 w-full"
            >
              Stop
            </button>
          )}

          {totalBreaths > 0 && (
            <div className="text-gray-600">
              Completed breaths: <span className="font-semibold">{totalBreaths}</span>
            </div>
          )}
        </div>
      </div>

      <div className="card p-6 text-left">
        <h2 className="text-lg font-semibold mb-2">How it works:</h2>
        <ul className="space-y-2 text-gray-600">
          <li>• <strong>Inhale</strong> for 4 seconds (circle expands)</li>
          <li>• <strong>Hold</strong> for 2 seconds (circle stays)</li>
          <li>• <strong>Exhale</strong> for 6 seconds (circle shrinks)</li>
          <li>• Practice for 5-10 minutes for best results</li>
        </ul>
      </div>
    </div>
  );
}
