"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const GRID_SIZE = 4; // 4x4 grid (15-puzzle)

function createSolvedPuzzle(): number[] {
  return Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => i);
}

function isSolvable(puzzle: number[]): boolean {
  let inversions = 0;
  const flatPuzzle = puzzle.filter(n => n !== 0);
  
  for (let i = 0; i < flatPuzzle.length - 1; i++) {
    for (let j = i + 1; j < flatPuzzle.length; j++) {
      const a = flatPuzzle[i];
      const b = flatPuzzle[j];
      if (a !== undefined && b !== undefined && a > b) {
        inversions++;
      }
    }
  }
  
  const emptyRow = Math.floor(puzzle.indexOf(0) / GRID_SIZE);
  return (GRID_SIZE % 2 === 1) ? (inversions % 2 === 0) : ((inversions + emptyRow) % 2 === 1);
}

function shufflePuzzle(): number[] {
  let puzzle: number[];
  do {
    puzzle = createSolvedPuzzle();
    for (let i = puzzle.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = puzzle[i];
      const temp2 = puzzle[j];
      if (temp !== undefined && temp2 !== undefined) {
        puzzle[i] = temp2;
        puzzle[j] = temp;
      }
    }
  } while (!isSolvable(puzzle));
  return puzzle;
}

export default function SlidingPuzzleGame() {
  const [tiles, setTiles] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [solved, setSolved] = useState(false);

  useEffect(() => {
    initGame();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && !solved) {
      interval = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, solved]);

  const initGame = () => {
    setTiles(shufflePuzzle());
    setMoves(0);
    setTime(0);
    setIsRunning(false);
    setSolved(false);
  };

  const canMove = (index: number, emptyIndex: number): boolean => {
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;
    const emptyRow = Math.floor(emptyIndex / GRID_SIZE);
    const emptyCol = emptyIndex % GRID_SIZE;

    return (
      (row === emptyRow && Math.abs(col - emptyCol) === 1) ||
      (col === emptyCol && Math.abs(row - emptyRow) === 1)
    );
  };

  const moveTile = (index: number) => {
    if (solved) return;

    if (!isRunning) setIsRunning(true);

    const emptyIndex = tiles.indexOf(0);
    if (canMove(index, emptyIndex)) {
      const newTiles = [...tiles];
      const temp = newTiles[index];
      const temp2 = newTiles[emptyIndex];
      if (temp !== undefined && temp2 !== undefined) {
        newTiles[index] = temp2;
        newTiles[emptyIndex] = temp;
      }
      setTiles(newTiles);
      setMoves(moves + 1);

      // Check if solved
      const isSolved = newTiles.every((tile, i) => tile === i);
      if (isSolved) {
        setSolved(true);
        setIsRunning(false);
      }
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-800 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="text-white/80 hover:text-white transition-colors flex items-center gap-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Games
          </Link>
        </div>

        {/* Game Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
              <span className="text-5xl">🔢</span>
              15-Puzzle
            </h1>
            <p className="text-blue-200 text-lg">
              Slide the tiles to arrange them in order!
            </p>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-6 mb-8">
            <div className="bg-white/10 px-6 py-3 rounded-xl backdrop-blur-lg border border-white/20">
              <div className="text-blue-200 text-sm">Moves</div>
              <div className="text-white text-2xl font-bold">{moves}</div>
            </div>
            <div className="bg-white/10 px-6 py-3 rounded-xl backdrop-blur-lg border border-white/20">
              <div className="text-blue-200 text-sm">Time</div>
              <div className="text-white text-2xl font-bold">{formatTime(time)}</div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-500/20 backdrop-blur-lg border border-blue-400/30 rounded-2xl p-4 mb-8">
            <p className="text-blue-100 text-sm leading-relaxed">
              <strong>How to play:</strong> Click on tiles adjacent to the empty space to slide them. 
              Arrange all numbers in order from 1-15 with the empty space at the bottom right.
            </p>
          </div>

          {/* Puzzle Grid */}
          <div className="flex justify-center mb-8">
            <div className="grid grid-cols-4 gap-2 bg-black/30 p-4 rounded-2xl">
              {tiles.map((tile, index) => (
                <button
                  key={index}
                  onClick={() => moveTile(index)}
                  disabled={tile === 0 || solved}
                  className={`
                    w-20 h-20 rounded-xl font-bold text-2xl transition-all duration-200
                    ${tile === 0 
                      ? 'bg-transparent cursor-default' 
                      : 'bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg transform hover:scale-105 active:scale-95'
                    }
                    ${solved ? 'animate-pulse' : ''}
                    ${canMove(index, tiles.indexOf(0)) && tile !== 0 && !solved ? 'ring-2 ring-yellow-400/50' : ''}
                  `}
                >
                  {tile !== 0 ? tile : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Solved Message */}
          {solved && (
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-lg border border-green-400/30 rounded-2xl p-6 mb-8 text-center animate-bounce">
              <div className="text-4xl mb-2">🎉</div>
              <h3 className="text-2xl font-bold text-white mb-2">Puzzle Solved!</h3>
              <p className="text-green-200">Time: {formatTime(time)} | Moves: {moves}</p>
            </div>
          )}

          {/* Buttons */}
          <button
            onClick={initGame}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            New Game
          </button>
        </div>
      </div>
    </div>
  );
}
