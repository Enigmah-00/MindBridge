"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Color = string;
type Tube = Color[];

const COLORS = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];
const TUBE_CAPACITY = 4;
const NUM_TUBES = 7; // 5 for colors + 2 empty

export default function ColorSortPage() {
  const [tubes, setTubes] = useState<Tube[]>([]);
  const [selectedTube, setSelectedTube] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);

  const initializeGame = () => {
    // Create array with 4 of each color
    const allColors: Color[] = [];
    COLORS.forEach((color) => {
      for (let i = 0; i < TUBE_CAPACITY; i++) {
        allColors.push(color);
      }
    });

    // Shuffle colors
    for (let i = allColors.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = allColors[i];
      allColors[i] = allColors[j]!;
      allColors[j] = temp!;
    }

    // Distribute into tubes (leave 2 empty for moves)
    const newTubes: Tube[] = [];
    for (let i = 0; i < NUM_TUBES - 2; i++) {
      newTubes.push(allColors.slice(i * TUBE_CAPACITY, (i + 1) * TUBE_CAPACITY));
    }
    newTubes.push([]); // Empty tube
    newTubes.push([]); // Empty tube

    setTubes(newTubes);
    setSelectedTube(null);
    setMoves(0);
    setIsWon(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (tubes.length === 0) return;
    
    // Check if game is won
    const won = tubes.every((tube) => {
      if (tube.length === 0) return true; // Empty tubes are ok
      if (tube.length !== TUBE_CAPACITY) return false; // Must be full or empty
      const firstColor = tube[0];
      return tube.every((color) => color === firstColor); // All same color
    });

    setIsWon(won);
  }, [tubes]);

  const getTopColor = (tube: Tube): Color | null => {
    return tube[tube.length - 1] || null;
  };

  const canPour = (fromTube: Tube, toTube: Tube): boolean => {
    if (fromTube.length === 0) return false; // Can't pour from empty
    if (toTube.length >= TUBE_CAPACITY) return false; // Can't pour into full

    const topColor = getTopColor(fromTube);
    if (!topColor) return false;

    // Can pour into empty tube
    if (toTube.length === 0) return true;

    // Can pour if top colors match
    const toTopColor = getTopColor(toTube);
    return toTopColor === topColor;
  };

  const handleTubeClick = (tubeIndex: number) => {
    if (isWon) return;

    if (selectedTube === null) {
      // Select this tube if it's not empty
      const tube = tubes[tubeIndex];
      if (tube && tube.length > 0) {
        setSelectedTube(tubeIndex);
      }
    } else if (selectedTube === tubeIndex) {
      // Deselect
      setSelectedTube(null);
    } else {
      // Try to pour from selected to this tube
      const fromTube = tubes[selectedTube];
      const toTube = tubes[tubeIndex];

      if (fromTube && toTube && canPour(fromTube, toTube)) {
        const newTubes = tubes.map((tube, i) => [...tube]);
        const color = newTubes[selectedTube]?.pop();

        if (color && newTubes[tubeIndex]) {
          // Pour all connected same-color liquids
          while (
            newTubes[selectedTube] &&
            newTubes[tubeIndex] &&
            getTopColor(newTubes[selectedTube]) === color &&
            newTubes[tubeIndex].length < TUBE_CAPACITY
          ) {
            const nextColor = newTubes[selectedTube].pop();
            if (nextColor) {
              newTubes[tubeIndex].push(nextColor);
            } else {
              break;
            }
          }

          newTubes[tubeIndex].push(color);
          setTubes(newTubes);
          setMoves((prev) => prev + 1);
        }
        setSelectedTube(null);
      } else {
        // Invalid move, select the new tube instead
        if (toTube && toTube.length > 0) {
          setSelectedTube(tubeIndex);
        } else {
          setSelectedTube(null);
        }
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto text-center">
      <Link href="/games" className="inline-block mb-6 text-blue-600 hover:underline">
        ← Back to Games
      </Link>

      <h1 className="text-3xl font-bold mb-2">Color Sort</h1>
      <p className="text-gray-600 mb-8">
        Sort the colored liquids so each tube contains only one color
      </p>

      <div className="card p-6 mb-6">
        <div className="flex justify-center gap-8 mb-6">
          <div>
            <div className="text-2xl font-bold text-blue-600">{moves}</div>
            <div className="text-sm text-gray-600">Moves</div>
          </div>
        </div>

        {isWon && (
          <div className="mb-6 p-4 bg-green-100 rounded-lg">
            <div className="text-6xl mb-2">🎉</div>
            <h2 className="text-2xl font-bold mb-2">Congratulations!</h2>
            <p className="text-gray-600 mb-4">You sorted all colors in {moves} moves!</p>
            <button onClick={initializeGame} className="btn">
              Play Again
            </button>
          </div>
        )}

        <div className="flex justify-center gap-4 mb-6 flex-wrap">
          {tubes.map((tube, tubeIndex) => (
            <button
              key={tubeIndex}
              onClick={() => handleTubeClick(tubeIndex)}
              className={`relative transition-transform ${
                selectedTube === tubeIndex ? "scale-110" : "hover:scale-105"
              }`}
            >
              {/* Tube container */}
              <div
                className={`w-16 h-40 border-4 rounded-b-3xl rounded-t-lg flex flex-col-reverse items-center p-1 ${
                  selectedTube === tubeIndex
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-400 bg-white"
                }`}
              >
                {/* Liquid segments */}
                {tube.map((color, colorIndex) => (
                  <div
                    key={colorIndex}
                    className="w-full rounded-sm transition-all"
                    style={{
                      backgroundColor: color,
                      height: `${100 / TUBE_CAPACITY}%`,
                    }}
                  />
                ))}
              </div>
            </button>
          ))}
        </div>

        <button onClick={initializeGame} className="btn bg-gray-500 hover:bg-gray-600">
          New Game
        </button>
      </div>

      <div className="card p-6 text-left">
        <h2 className="text-lg font-semibold mb-2">How to play:</h2>
        <ul className="space-y-1 text-gray-600">
          <li>• Click a tube to select it</li>
          <li>• Click another tube to pour the liquid</li>
          <li>• You can only pour if the top colors match</li>
          <li>• Sort all colors into separate tubes to win</li>
          <li>• Use the empty tubes strategically!</li>
        </ul>
      </div>
    </div>
  );
}
