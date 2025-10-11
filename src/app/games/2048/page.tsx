"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Tile = number;
type Board = Tile[][];

const GRID_SIZE = 4;

export default function Game2048Page() {
  const [board, setBoard] = useState<Board>([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const initializeBoard = (): Board => {
    const newBoard: Board = Array(GRID_SIZE)
      .fill(0)
      .map(() => Array(GRID_SIZE).fill(0));
    addRandomTile(newBoard);
    addRandomTile(newBoard);
    return newBoard;
  };

  const addRandomTile = (board: Board): void => {
    const emptyCells: [number, number][] = [];
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (board[i]?.[j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }
    if (emptyCells.length > 0) {
      const cell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      if (cell) {
        const [row, col] = cell;
        if (board[row]) {
          board[row][col] = Math.random() < 0.9 ? 2 : 4;
        }
      }
    }
  };

  const resetGame = () => {
    setBoard(initializeBoard());
    setScore(0);
    setGameOver(false);
    setWon(false);
  };

  useEffect(() => {
    resetGame();
    const saved = localStorage.getItem("2048-best");
    if (saved) setBestScore(parseInt(saved));
  }, []);

  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem("2048-best", score.toString());
    }
  }, [score, bestScore]);

  const move = (direction: "up" | "down" | "left" | "right") => {
    if (gameOver) return;

    const newBoard = JSON.parse(JSON.stringify(board)) as Board;
    let moved = false;
    let scoreGained = 0;

    const slide = (row: Tile[]): { row: Tile[]; score: number } => {
      let arr = row.filter((val) => val !== 0);
      let localScore = 0;

      for (let i = 0; i < arr.length - 1; i++) {
        const current = arr[i];
        const next = arr[i + 1];
        if (current !== undefined && current === next) {
          arr[i] = current * 2;
          localScore += arr[i] || 0;
          arr.splice(i + 1, 1);
          if (arr[i] === 2048 && !won) {
            setWon(true);
          }
        }
      }

      while (arr.length < GRID_SIZE) {
        arr.push(0);
      }

      return { row: arr, score: localScore };
    };

    if (direction === "left") {
      for (let i = 0; i < GRID_SIZE; i++) {
        const boardRow = newBoard[i];
        if (!boardRow) continue;
        const original = [...boardRow];
        const { row, score } = slide(boardRow);
        newBoard[i] = row;
        if (JSON.stringify(original) !== JSON.stringify(row)) moved = true;
        scoreGained += score;
      }
    } else if (direction === "right") {
      for (let i = 0; i < GRID_SIZE; i++) {
        const boardRow = newBoard[i];
        if (!boardRow) continue;
        const original = [...boardRow];
        const reversed = boardRow.reverse();
        const { row, score } = slide(reversed);
        newBoard[i] = row.reverse();
        if (JSON.stringify(original) !== JSON.stringify(newBoard[i])) moved = true;
        scoreGained += score;
      }
    } else if (direction === "up") {
      for (let j = 0; j < GRID_SIZE; j++) {
        const column = newBoard.map((row) => row?.[j] ?? 0);
        const original = [...column];
        const { row, score } = slide(column);
        for (let i = 0; i < GRID_SIZE; i++) {
          const boardRow = newBoard[i];
          if (boardRow) {
            boardRow[j] = row[i] ?? 0;
          }
        }
        if (JSON.stringify(original) !== JSON.stringify(row)) moved = true;
        scoreGained += score;
      }
    } else if (direction === "down") {
      for (let j = 0; j < GRID_SIZE; j++) {
        const column = newBoard.map((row) => row?.[j] ?? 0);
        const original = [...column];
        const reversed = column.reverse();
        const { row, score } = slide(reversed);
        const finalColumn = row.reverse();
        for (let i = 0; i < GRID_SIZE; i++) {
          const boardRow = newBoard[i];
          if (boardRow) {
            boardRow[j] = finalColumn[i] ?? 0;
          }
        }
        if (JSON.stringify(original) !== JSON.stringify(finalColumn)) moved = true;
        scoreGained += score;
      }
    }

    if (moved) {
      addRandomTile(newBoard);
      setBoard(newBoard);
      setScore(score + scoreGained);

      // Check for game over
      if (!canMove(newBoard)) {
        setGameOver(true);
      }
    }
  };

  const canMove = (board: Board): boolean => {
    // Check for empty cells
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (board[i]?.[j] === 0) return true;
      }
    }

    // Check for adjacent same tiles
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        const current = board[i]?.[j];
        if (current === undefined) continue;
        if (
          (i < GRID_SIZE - 1 && board[i + 1]?.[j] === current) ||
          (j < GRID_SIZE - 1 && board[i]?.[j + 1] === current)
        ) {
          return true;
        }
      }
    }

    return false;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }
      
      switch (e.key) {
        case "ArrowUp":
          move("up");
          break;
        case "ArrowDown":
          move("down");
          break;
        case "ArrowLeft":
          move("left");
          break;
        case "ArrowRight":
          move("right");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [board, gameOver]);

  const getTileColor = (value: number): string => {
    const colors: Record<number, string> = {
      0: "bg-gray-200",
      2: "bg-yellow-100",
      4: "bg-yellow-200",
      8: "bg-orange-300",
      16: "bg-orange-400",
      32: "bg-orange-500",
      64: "bg-red-400",
      128: "bg-yellow-400",
      256: "bg-yellow-500",
      512: "bg-yellow-600",
      1024: "bg-orange-600",
      2048: "bg-orange-700",
    };
    return colors[value] || "bg-pink-500";
  };

  return (
    <div className="max-w-2xl mx-auto text-center">
      <Link href="/games" className="inline-block mb-6 text-blue-600 hover:underline">
        ← Back to Games
      </Link>

      <h1 className="text-3xl font-bold mb-2">2048</h1>
      <p className="text-gray-600 mb-8">
        Combine numbers to reach 2048!
      </p>

      <div className="card p-6 mb-6">
        <div className="flex justify-center gap-8 mb-6">
          <div>
            <div className="text-2xl font-bold text-blue-600">{score}</div>
            <div className="text-sm text-gray-600">Score</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">{bestScore}</div>
            <div className="text-sm text-gray-600">Best</div>
          </div>
        </div>

        {(gameOver || won) && (
          <div className="mb-6 p-4 bg-gray-100 rounded-lg">
            <div className="text-4xl mb-2">{won ? "🎉" : "😅"}</div>
            <h2 className="text-2xl font-bold mb-2">
              {won ? "You Win!" : "Game Over"}
            </h2>
            <p className="text-gray-600 mb-4">Final score: {score}</p>
            <button onClick={resetGame} className="btn">
              Try Again
            </button>
          </div>
        )}

        <div className="inline-block p-4 bg-gray-300 rounded-lg mb-6">
          <div className="grid grid-cols-4 gap-3">
            {board.map((row, i) =>
              row.map((cell, j) => (
                <div
                  key={`${i}-${j}`}
                  className={`w-16 h-16 rounded-lg flex items-center justify-center font-bold text-lg ${getTileColor(
                    cell
                  )} ${cell > 0 ? "text-gray-800" : ""}`}
                >
                  {cell > 0 ? cell : ""}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto mb-4">
          <div></div>
          <button
            onClick={() => move("up")}
            className="btn bg-gray-500 hover:bg-gray-600 py-3"
          >
            ↑
          </button>
          <div></div>
          <button
            onClick={() => move("left")}
            className="btn bg-gray-500 hover:bg-gray-600 py-3"
          >
            ←
          </button>
          <button
            onClick={() => move("down")}
            className="btn bg-gray-500 hover:bg-gray-600 py-3"
          >
            ↓
          </button>
          <button
            onClick={() => move("right")}
            className="btn bg-gray-500 hover:bg-gray-600 py-3"
          >
            →
          </button>
        </div>

        <button onClick={resetGame} className="btn bg-blue-500 hover:bg-blue-600">
          New Game
        </button>
      </div>

      <div className="card p-6 text-left">
        <h2 className="text-lg font-semibold mb-2">How to play:</h2>
        <ul className="space-y-1 text-gray-600">
          <li>• Use arrow keys or buttons to move tiles</li>
          <li>• Tiles with the same number merge into one</li>
          <li>• Create a tile with the number 2048 to win!</li>
          <li>• Keep playing to get an even higher score</li>
        </ul>
      </div>
    </div>
  );
}
