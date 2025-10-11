"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type SudokuGrid = (number | null)[][];

// Easy puzzles (pre-generated)
const EASY_PUZZLES: SudokuGrid[] = [
  [
    [5, 3, null, null, 7, null, null, null, null],
    [6, null, null, 1, 9, 5, null, null, null],
    [null, 9, 8, null, null, null, null, 6, null],
    [8, null, null, null, 6, null, null, null, 3],
    [4, null, null, 8, null, 3, null, null, 1],
    [7, null, null, null, 2, null, null, null, 6],
    [null, 6, null, null, null, null, 2, 8, null],
    [null, null, null, 4, 1, 9, null, null, 5],
    [null, null, null, null, 8, null, null, 7, 9],
  ],
  [
    [null, null, 9, 7, 4, 8, null, null, null],
    [7, null, null, null, null, null, null, null, null],
    [null, 2, null, 1, null, 9, null, null, null],
    [null, null, 7, null, null, null, 2, 4, null],
    [null, 6, 4, null, 1, null, 5, 9, null],
    [null, 9, 8, null, null, null, 3, null, null],
    [null, null, null, 8, null, 3, null, 2, null],
    [null, null, null, null, null, null, null, null, 6],
    [null, null, null, 2, 7, 5, 9, null, null],
  ],
];

const SOLUTIONS: SudokuGrid[] = [
  [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9],
  ],
  [
    [5, 1, 9, 7, 4, 8, 6, 3, 2],
    [7, 8, 3, 6, 5, 2, 4, 1, 9],
    [4, 2, 6, 1, 3, 9, 7, 5, 8],
    [3, 5, 7, 9, 8, 6, 2, 4, 1],
    [2, 6, 4, 3, 1, 7, 5, 9, 8],
    [1, 9, 8, 5, 2, 4, 3, 6, 7],
    [9, 7, 5, 8, 6, 3, 1, 2, 4],
    [8, 3, 2, 4, 9, 1, 5, 7, 6],
    [6, 4, 1, 2, 7, 5, 9, 8, 3],
  ],
];

function isValidMove(grid: SudokuGrid, row: number, col: number, num: number): boolean {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (x !== col && grid[row]?.[x] === num) return false;
  }

  // Check column
  for (let x = 0; x < 9; x++) {
    if (x !== row && grid[x]?.[col] === num) return false;
  }

  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const r = boxRow + i;
      const c = boxCol + j;
      if ((r !== row || c !== col) && grid[r]?.[c] === num) return false;
    }
  }

  return true;
}

export default function SudokuGame() {
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [grid, setGrid] = useState<SudokuGrid>([]);
  const [initialGrid, setInitialGrid] = useState<SudokuGrid>([]);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [solved, setSolved] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);

  useEffect(() => {
    initPuzzle(currentPuzzle);
  }, [currentPuzzle]);

  const initPuzzle = (index: number) => {
    const puzzleSource = EASY_PUZZLES[index];
    if (!puzzleSource) return;
    const puzzle = puzzleSource.map(row => [...row]);
    setGrid(puzzle);
    setInitialGrid(puzzle.map(row => [...row]));
    setMistakes(0);
    setSolved(false);
    setHintsUsed(0);
    setSelectedCell(null);
  };

  const handleCellClick = (row: number, col: number) => {
    if (initialGrid[row]?.[col] !== null) return; // Can't change initial numbers
    setSelectedCell({ row, col });
  };

  const handleNumberClick = (num: number) => {
    if (!selectedCell || solved) return;
    const { row, col } = selectedCell;
    
    if (initialGrid[row]?.[col] !== null) return;

    const newGrid = grid.map(r => [...r]);
    const currentRow = newGrid[row];
    if (!currentRow) return;

    currentRow[col] = num;
    setGrid(newGrid);

    // Check if valid
    if (!isValidMove(newGrid, row, col, num)) {
      setMistakes(mistakes + 1);
    }

    // Check if solved
    checkSolved(newGrid);
  };

  const handleClear = () => {
    if (!selectedCell || solved) return;
    const { row, col } = selectedCell;
    
    if (initialGrid[row]?.[col] !== null) return;

    const newGrid = grid.map(r => [...r]);
    const currentRow = newGrid[row];
    if (!currentRow) return;
    
    currentRow[col] = null;
    setGrid(newGrid);
  };

  const handleHint = () => {
    if (!selectedCell || solved || hintsUsed >= 3) return;
    const { row, col } = selectedCell;
    
    if (initialGrid[row]?.[col] !== null) return;

    const solution = SOLUTIONS[currentPuzzle];
    const correctNumber = solution?.[row]?.[col];
    if (correctNumber === undefined) return;

    const newGrid = grid.map(r => [...r]);
    const currentRow = newGrid[row];
    if (!currentRow) return;
    
    currentRow[col] = correctNumber;
    setGrid(newGrid);
    setHintsUsed(hintsUsed + 1);

    checkSolved(newGrid);
  };

  const checkSolved = (currentGrid: SudokuGrid) => {
    const solution = SOLUTIONS[currentPuzzle];
    const isSolved = currentGrid.every((row, i) =>
      row.every((cell, j) => cell === solution?.[i]?.[j])
    );
    setSolved(isSolved);
  };

  const nextPuzzle = () => {
    setCurrentPuzzle((prev) => (prev + 1) % EASY_PUZZLES.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-cyan-900 to-blue-800 p-4">
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
              Sudoku
            </h1>
            <p className="text-cyan-200 text-lg">
              Fill the 9×9 grid with digits 1-9!
            </p>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-6 mb-8">
            <div className="bg-white/10 px-6 py-3 rounded-xl backdrop-blur-lg border border-white/20">
              <div className="text-cyan-200 text-sm">Mistakes</div>
              <div className="text-white text-2xl font-bold text-red-400">{mistakes}</div>
            </div>
            <div className="bg-white/10 px-6 py-3 rounded-xl backdrop-blur-lg border border-white/20">
              <div className="text-cyan-200 text-sm">Hints</div>
              <div className="text-white text-2xl font-bold">{hintsUsed}/3</div>
            </div>
            <div className="bg-white/10 px-6 py-3 rounded-xl backdrop-blur-lg border border-white/20">
              <div className="text-cyan-200 text-sm">Puzzle</div>
              <div className="text-white text-2xl font-bold">{currentPuzzle + 1}/{EASY_PUZZLES.length}</div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-cyan-500/20 backdrop-blur-lg border border-cyan-400/30 rounded-2xl p-4 mb-8">
            <p className="text-cyan-100 text-sm leading-relaxed">
              <strong>How to play:</strong> Click a cell, then click a number below. 
              Each row, column, and 3×3 box must contain digits 1-9 without repetition.
            </p>
          </div>

          {/* Sudoku Grid */}
          <div className="flex justify-center mb-8">
            <div className="inline-block bg-black/30 p-2 rounded-2xl">
              {grid.map((row, i) => (
                <div key={i} className="flex">
                  {row.map((cell, j) => {
                    const isInitial = initialGrid[i]?.[j] !== null;
                    const isSelected = selectedCell?.row === i && selectedCell?.col === j;
                    const isInvalid = cell !== null && !isValidMove(grid, i, j, cell);
                    
                    return (
                      <div
                        key={j}
                        onClick={() => handleCellClick(i, j)}
                        className={`
                          w-10 h-10 flex items-center justify-center text-lg font-bold cursor-pointer
                          transition-all duration-200
                          ${isInitial ? 'bg-gray-700 text-white cursor-default' : 'bg-white/10 hover:bg-white/20 text-cyan-200'}
                          ${isSelected ? 'ring-2 ring-yellow-400 bg-yellow-400/20' : ''}
                          ${isInvalid ? 'bg-red-500/30 text-red-300' : ''}
                          ${j % 3 === 2 && j !== 8 ? 'border-r-2 border-white/40' : 'border-r border-white/20'}
                          ${i % 3 === 2 && i !== 8 ? 'border-b-2 border-white/40' : 'border-b border-white/20'}
                          ${solved ? 'animate-pulse bg-green-500/30' : ''}
                        `}
                      >
                        {cell}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Number Pad */}
          <div className="grid grid-cols-9 gap-2 mb-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => handleNumberClick(num)}
                disabled={!selectedCell || solved}
                className={`
                  py-3 rounded-xl font-bold text-lg transition-all duration-200
                  ${selectedCell && !solved
                    ? 'bg-gradient-to-br from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white transform hover:scale-105 active:scale-95 shadow-lg'
                    : 'bg-gray-600/30 text-gray-500 cursor-not-allowed'
                  }
                `}
              >
                {num}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={handleClear}
              disabled={!selectedCell || solved}
              className={`
                py-3 rounded-xl font-semibold transition-all duration-200
                ${selectedCell && !solved
                  ? 'bg-red-500/80 hover:bg-red-600 text-white transform hover:scale-105'
                  : 'bg-gray-600/30 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              Clear Cell
            </button>
            <button
              onClick={handleHint}
              disabled={!selectedCell || solved || hintsUsed >= 3}
              className={`
                py-3 rounded-xl font-semibold transition-all duration-200
                ${selectedCell && !solved && hintsUsed < 3
                  ? 'bg-yellow-500/80 hover:bg-yellow-600 text-white transform hover:scale-105'
                  : 'bg-gray-600/30 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              💡 Hint ({3 - hintsUsed} left)
            </button>
          </div>

          {/* Solved Message */}
          {solved && (
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-lg border border-green-400/30 rounded-2xl p-6 mb-6 text-center animate-bounce">
              <div className="text-4xl mb-2">🎉</div>
              <h3 className="text-2xl font-bold text-white mb-2">Puzzle Solved!</h3>
              <p className="text-green-200">Mistakes: {mistakes} | Hints: {hintsUsed}</p>
            </div>
          )}

          {/* Main Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => initPuzzle(currentPuzzle)}
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
