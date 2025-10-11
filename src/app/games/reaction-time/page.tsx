"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function ReactionTimePage() {
  const [gameState, setGameState] = useState<"waiting" | "ready" | "go" | "result">("waiting");
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [attempts, setAttempts] = useState<number[]>([]);
  const startTimeRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startGame = () => {
    setGameState("ready");
    setReactionTime(null);

    // Random delay between 2-5 seconds
    const delay = Math.random() * 3000 + 2000;

    timeoutRef.current = setTimeout(() => {
      setGameState("go");
      startTimeRef.current = Date.now();
    }, delay);
  };

  const handleClick = () => {
    if (gameState === "waiting") {
      // Start the game
      startGame();
    } else if (gameState === "ready") {
      // Clicked too early
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setGameState("waiting");
      alert("Too early! Wait for the green signal.");
    } else if (gameState === "go") {
      // Calculate reaction time
      const endTime = Date.now();
      const time = endTime - startTimeRef.current;
      setReactionTime(time);
      setAttempts((prev) => [...prev, time]);
      setGameState("result");
    }
  };

  const resetGame = () => {
    setGameState("waiting");
    setReactionTime(null);
    setAttempts([]);
  };

  const getAverageTime = () => {
    if (attempts.length === 0) return 0;
    const sum = attempts.reduce((a, b) => a + b, 0);
    return Math.round(sum / attempts.length);
  };

  const getBestTime = () => {
    if (attempts.length === 0) return 0;
    return Math.min(...attempts);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="max-w-2xl mx-auto text-center">
      <Link href="/games" className="inline-block mb-6 text-blue-600 hover:underline">
        ← Back to Games
      </Link>

      <h1 className="text-3xl font-bold mb-2">Reaction Time Test</h1>
      <p className="text-gray-600 mb-8">
        Test your reaction speed. Click when the screen turns green!
      </p>

      <div
        className={`card p-12 mb-6 cursor-pointer transition-all min-h-96 flex flex-col items-center justify-center ${
          gameState === "waiting"
            ? "bg-blue-50"
            : gameState === "ready"
            ? "bg-red-50"
            : gameState === "go"
            ? "bg-green-300"
            : "bg-gray-50"
        }`}
        onClick={handleClick}
      >
        {gameState === "waiting" && (
          <div>
            <div className="text-6xl mb-4">⚡</div>
            <h2 className="text-2xl font-bold mb-2">Ready to test?</h2>
            <p className="text-gray-600 mb-6">Click anywhere to start</p>
          </div>
        )}

        {gameState === "ready" && (
          <div>
            <div className="text-6xl mb-4">⏳</div>
            <h2 className="text-2xl font-bold text-red-600">Wait for it...</h2>
            <p className="text-gray-600">Don't click yet!</p>
          </div>
        )}

        {gameState === "go" && (
          <div>
            <div className="text-6xl mb-4">🎯</div>
            <h2 className="text-3xl font-bold text-green-800">CLICK NOW!</h2>
          </div>
        )}

        {gameState === "result" && reactionTime && (
          <div>
            <div className="text-6xl mb-4">✨</div>
            <h2 className="text-2xl font-bold mb-2">Your Time</h2>
            <div className="text-5xl font-bold text-blue-600 mb-6">
              {reactionTime}ms
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                startGame();
              }} 
              className="btn mb-4"
            >
              Try Again
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                resetGame();
              }}
              className="btn bg-gray-500 hover:bg-gray-600"
            >
              Reset
            </button>
          </div>
        )}
      </div>

      {attempts.length > 0 && (
        <div className="card p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Your Statistics</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {attempts.length}
              </div>
              <div className="text-sm text-gray-600">Attempts</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {getBestTime()}ms
              </div>
              <div className="text-sm text-gray-600">Best Time</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {getAverageTime()}ms
              </div>
              <div className="text-sm text-gray-600">Average</div>
            </div>
          </div>
        </div>
      )}

      <div className="card p-6 text-left">
        <h2 className="text-lg font-semibold mb-2">Reaction Time Guide:</h2>
        <ul className="space-y-1 text-gray-600">
          <li>• <strong>&lt;200ms:</strong> Excellent</li>
          <li>• <strong>200-250ms:</strong> Good</li>
          <li>• <strong>250-300ms:</strong> Average</li>
          <li>• <strong>&gt;300ms:</strong> Practice more!</li>
        </ul>
      </div>
    </div>
  );
}
