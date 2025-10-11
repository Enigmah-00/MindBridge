"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// Predefined puzzles (5x5 for simplicity)
const PUZZLES = [
  {
    name: "Heart",
    solution: [
      [0, 1, 0, 1, 0],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [0, 1, 1, 1, 0],
      [0, 0, 1, 0, 0],
    ],
  },
  {
    name: "Arrow",
    solution: [
      [0, 0, 1, 0, 0],
      [0, 1, 1, 1, 0],
      [1, 1, 1, 1, 1],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
    ],
  },
  {
    name: "House",
    solution: [
      [0, 0, 1, 0, 0],
      [0, 1, 1, 1, 0],
      [1, 1, 1, 1, 1],
      [1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1],
    ],
  },
];

function calculateClues(solution: number[][]) {
  const size = solution.length;
  const rowClues = solution.map((row) => {
    const groups: number[] = [];
    let count = 0;
    row.forEach((cell, i) => {
      if (cell === 1) {
        count++;
      } else if (count > 0) {
        groups.push(count);
        count = 0;
      }
      if (i === row.length - 1 && count > 0) groups.push(count);
    });
    return groups.length > 0 ? groups : [0];
  });

  const colClues: number[][] = [];
  for (let col = 0; col < size; col++) {
    const groups: number[] = [];
    let count = 0;
    for (let row = 0; row < size; row++) {
      const cellRow = solution[row];
      if (cellRow && cellRow[col] === 1) {
        count++;
      } else if (count > 0) {
        groups.push(count);
        count = 0;
      }
      if (row === size - 1 && count > 0) groups.push(count);
    }
    colClues.push(groups.length > 0 ? groups : [0]);
  }

  return { rowClues, colClues };
}

export default function NonogramGame() {
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [grid, setGrid] = useState<number[][]>([]);
  const [rowClues, setRowClues] = useState<number[][]>([]);
  const [colClues, setColClues] = useState<number[][]>([]);
  const [solved, setSolved] = useState(false);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    initPuzzle(currentPuzzle);
  }, [currentPuzzle]);

  const initPuzzle = (index: number) => {
    const puzzle = PUZZLES[index];
    if (!puzzle) return;
    const size = puzzle.solution.length;
    setGrid(Array(size).fill(null).map(() => Array(size).fill(0)));
    const { rowClues: rc, colClues: cc } = calculateClues(puzzle.solution);
    setRowClues(rc);
    setColClues(cc);
    setSolved(false);
    setMoves(0);
  };

  const handleCellClick = (row: number, col: number, rightClick = false) => {
    if (solved) return;

    const newGrid = grid.map((r) => [...r]);
    const currentRow = newGrid[row];
    if (!currentRow) return;
    
    if (rightClick) {
      // Right click: cycle through 0 (empty) -> 2 (marked X) -> 0
      currentRow[col] = currentRow[col] === 2 ? 0 : 2;
    } else {
      // Left click: cycle through 0 (empty) -> 1 (filled) -> 0
      currentRow[col] = currentRow[col] === 1 ? 0 : 1;
    }
    setGrid(newGrid);
    setMoves(moves + 1);

    // Check if solved
    checkSolution(newGrid);
  };

  const checkSolution = (currentGrid: number[][]) => {
    const puzzle = PUZZLES[currentPuzzle];
    if (!puzzle) return;
    const solution = puzzle.solution;
    const isSolved = currentGrid.every((row, i) => {
      const solutionRow = solution[i];
      if (!solutionRow) return false;
      return row.every((cell, j) => cell === solutionRow[j] || (cell === 2 && solutionRow[j] === 0));
    });
    setSolved(isSolved);
  };

  const nextPuzzle = () => {
    setCurrentPuzzle((prev) => (prev + 1) % PUZZLES.length);
  };

  const resetPuzzle = () => {
    initPuzzle(currentPuzzle);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-4">
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
              <span className="text-5xl">🧩</span>
              Nonogram (Picross)
            </h1>
            <p className="text-purple-200 text-lg">
              {PUZZLES[currentPuzzle]?.name || "Puzzle"} - Fill the grid using number clues!
            </p>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-6 mb-8">
            <div className="bg-white/10 px-6 py-3 rounded-xl backdrop-blur-lg border border-white/20">
              <div className="text-purple-200 text-sm">Moves</div>
              <div className="text-white text-2xl font-bold">{moves}</div>
            </div>
            <div className="bg-white/10 px-6 py-3 rounded-xl backdrop-blur-lg border border-white/20">
              <div className="text-purple-200 text-sm">Puzzle</div>
              <div className="text-white text-2xl font-bold">{currentPuzzle + 1}/{PUZZLES.length}</div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-purple-500/20 backdrop-blur-lg border border-purple-400/30 rounded-2xl p-4 mb-8">
            <p className="text-purple-100 text-sm leading-relaxed">
              <strong>How to play:</strong> Left-click to fill a cell (black), right-click to mark with X (helper). 
              Numbers show consecutive filled cells in each row/column.
            </p>
          </div>

          {/* Nonogram Grid */}
          <div className="flex justify-center mb-8">
            <div className="inline-block">
              {/* Column clues */}
              <div className="flex mb-2" style={{ marginLeft: '60px' }}>
                {colClues.map((clue, i) => (
                  <div key={i} className="w-12 h-12 flex flex-col items-center justify-end pb-1">
                    {clue.map((num, j) => (
                      <div key={j} className="text-white text-xs font-bold">{num}</div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Grid with row clues */}
              {grid.map((row, i) => (
                <div key={i} className="flex items-center">
                  {/* Row clue */}
                  <div className="w-14 h-12 flex items-center justify-end pr-2">
                    {rowClues[i]?.map((num, j) => (
                      <span key={j} className="text-white text-xs font-bold mx-0.5">{num}</span>
                    ))}
                  </div>

                  {/* Grid cells */}
                  {row.map((cell, j) => (
                    <div
                      key={j}
                      onClick={() => handleCellClick(i, j, false)}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        handleCellClick(i, j, true);
                      }}
                      className={`
                        w-12 h-12 border-2 cursor-pointer transition-all duration-200
                        ${cell === 0 ? 'bg-white/20 hover:bg-white/30' : ''}
                        ${cell === 1 ? 'bg-indigo-600 hover:bg-indigo-700' : ''}
                        ${cell === 2 ? 'bg-red-500/30 hover:bg-red-500/40' : ''}
                        ${(i % 5 === 0 && i !== 0) ? 'border-t-white/40' : 'border-t-white/20'}
                        ${(j % 5 === 0 && j !== 0) ? 'border-l-white/40' : 'border-l-white/20'}
                        border-r-white/20 border-b-white/20
                        flex items-center justify-center
                        ${solved ? 'animate-pulse' : ''}
                      `}
                    >
                      {cell === 2 && <span className="text-red-400 text-2xl font-bold">×</span>}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Solved Message */}
          {solved && (
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-lg border border-green-400/30 rounded-2xl p-6 mb-8 text-center animate-bounce">
              <div className="text-4xl mb-2">🎉</div>
              <h3 className="text-2xl font-bold text-white mb-2">Puzzle Solved!</h3>
              <p className="text-green-200">You completed it in {moves} moves!</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={resetPuzzle}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Reset Puzzle
            </button>
            <button
              onClick={nextPuzzle}
              disabled={!solved}
              className={`flex-1 font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform shadow-lg
                ${solved 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white hover:scale-105' 
                  : 'bg-gray-500/30 text-gray-400 cursor-not-allowed'
                }`}
            >
              Next Puzzle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
