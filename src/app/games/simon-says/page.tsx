"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

type Color = "red" | "blue" | "green" | "yellow";

export default function SimonSaysPage() {
  const [sequence, setSequence] = useState<Color[]>([]);
  const [userSequence, setUserSequence] = useState<Color[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeColor, setActiveColor] = useState<Color | null>(null);
  const [gameState, setGameState] = useState<"waiting" | "showing" | "user-turn" | "game-over">("waiting");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const colors: Color[] = ["red", "blue", "green", "yellow"];

  const colorClasses = {
    red: "bg-red-500 hover:bg-red-600 active:bg-red-700",
    blue: "bg-blue-500 hover:bg-blue-600 active:bg-blue-700",
    green: "bg-green-500 hover:bg-green-600 active:bg-green-700",
    yellow: "bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700",
  };

  const startGame = () => {
    const randomColor = colors[Math.floor(Math.random() * 4)] as Color;
    const newSequence = [randomColor];
    setSequence(newSequence);
    setUserSequence([]);
    setScore(0);
    setIsPlaying(true);
    setGameState("showing");
    playSequence(newSequence);
  };

  const playSequence = async (seq: Color[]) => {
    setGameState("showing");
    for (let i = 0; i < seq.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const color = seq[i];
      if (color) {
        setActiveColor(color);
        playSound(color);
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
      setActiveColor(null);
    }
    setGameState("user-turn");
  };

  const playSound = (color: Color) => {
    // Frequencies for each color
    const frequencies: Record<Color, number> = {
      red: 261.63,    // C4
      blue: 329.63,   // E4
      green: 392.00,  // G4
      yellow: 523.25, // C5
    };

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequencies[color];
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  const handleColorClick = (color: Color) => {
    if (gameState !== "user-turn") return;

    setActiveColor(color);
    playSound(color);
    setTimeout(() => setActiveColor(null), 200);

    const newUserSequence = [...userSequence, color];
    setUserSequence(newUserSequence);

    // Check if the user's input is correct
    if (color !== sequence[newUserSequence.length - 1]) {
      // Wrong color
      gameOver();
      return;
    }

    // Check if user completed the sequence
    if (newUserSequence.length === sequence.length) {
      // Correct! Add next color
      setScore((prev) => prev + 1);
      setUserSequence([]);
      setTimeout(() => {
        const randomColor = colors[Math.floor(Math.random() * 4)] as Color;
        const newSequence = [...sequence, randomColor];
        setSequence(newSequence);
        playSequence(newSequence);
      }, 1000);
    }
  };

  const gameOver = () => {
    setGameState("game-over");
    setIsPlaying(false);
    if (score > highScore) {
      setHighScore(score);
    }
  };

  return (
    <div className="max-w-2xl mx-auto text-center">
      <Link href="/games" className="inline-block mb-6 text-blue-600 hover:underline">
        ← Back to Games
      </Link>

      <h1 className="text-3xl font-bold mb-2">Simon Says</h1>
      <p className="text-gray-600 mb-8">
        Watch the pattern, then repeat it!
      </p>

      <div className="card p-6 mb-6">
        <div className="flex justify-center gap-8 mb-6">
          <div>
            <div className="text-2xl font-bold text-blue-600">{score}</div>
            <div className="text-sm text-gray-600">Score</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">{highScore}</div>
            <div className="text-sm text-gray-600">High Score</div>
          </div>
        </div>

        {gameState === "showing" && (
          <div className="mb-6 text-lg font-semibold text-gray-700">
            Watch carefully...
          </div>
        )}

        {gameState === "user-turn" && (
          <div className="mb-6 text-lg font-semibold text-green-600">
            Your turn! Repeat the pattern
          </div>
        )}

        {gameState === "game-over" && (
          <div className="mb-6">
            <div className="text-6xl mb-4">😅</div>
            <h2 className="text-2xl font-bold mb-2">Game Over!</h2>
            <p className="text-gray-600 mb-4">Your score: {score}</p>
          </div>
        )}

        {/* Simon Game Board */}
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-6">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => handleColorClick(color)}
              disabled={gameState !== "user-turn"}
              className={`aspect-square rounded-lg transition-all transform ${
                colorClasses[color]
              } ${
                activeColor === color ? "scale-95 brightness-150" : ""
              } ${
                gameState !== "user-turn" ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
              }`}
            />
          ))}
        </div>

        {!isPlaying ? (
          <button onClick={startGame} className="btn w-full">
            {gameState === "waiting" ? "Start Game" : "Play Again"}
          </button>
        ) : (
          <div className="text-sm text-gray-500">
            Sequence length: {sequence.length}
          </div>
        )}
      </div>

      <div className="card p-6 text-left">
        <h2 className="text-lg font-semibold mb-2">How to play:</h2>
        <ul className="space-y-1 text-gray-600">
          <li>• Watch the sequence of colors light up</li>
          <li>• Each color has its own sound</li>
          <li>• Repeat the sequence by clicking the colors</li>
          <li>• Each round adds one more color to remember</li>
          <li>• How long can you keep going?</li>
        </ul>
      </div>
    </div>
  );
}
