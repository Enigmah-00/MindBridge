"use client";

import { useState } from "react";
import Link from "next/link";

type TileType = "grass" | "forest" | "water" | "mountain" | "village" | "empty";

interface Tile {
  type: TileType;
  x: number;
  y: number;
}

const TILE_TYPES: TileType[] = ["grass", "forest", "water", "mountain", "village"];

const TILE_COLORS = {
  grass: "from-green-400 to-green-600",
  forest: "from-green-700 to-green-900",
  water: "from-blue-400 to-blue-600",
  mountain: "from-gray-500 to-gray-700",
  village: "from-amber-500 to-orange-600",
  empty: "from-gray-800 to-gray-900",
};

const TILE_EMOJIS = {
  grass: "🌱",
  forest: "🌲",
  water: "💧",
  mountain: "⛰️",
  village: "🏘️",
  empty: "",
};

const GRID_SIZE = 10;

function getRandomTile(): TileType {
  return TILE_TYPES[Math.floor(Math.random() * TILE_TYPES.length)] || "grass";
}

function calculateScore(tiles: Tile[]): number {
  let score = 0;
  
  // Score for each tile placed
  score += tiles.length * 10;
  
  // Bonus for adjacent similar tiles
  tiles.forEach(tile => {
    const adjacent = tiles.filter(t => 
      (Math.abs(t.x - tile.x) === 1 && t.y === tile.y) ||
      (Math.abs(t.y - tile.y) === 1 && t.x === tile.x)
    );
    
    const sameType = adjacent.filter(t => t.type === tile.type).length;
    score += sameType * 5;
  });
  
  return score;
}

export default function TileLayingGame() {
  const [tiles, setTiles] = useState<Tile[]>([
    { type: "grass", x: 5, y: 5 }, // Starting tile
  ]);
  const [currentTile, setCurrentTile] = useState<TileType>(getRandomTile());
  const [nextTile, setNextTile] = useState<TileType>(getRandomTile());
  const [score, setScore] = useState(0);
  const [tilesPlaced, setTilesPlaced] = useState(1);

  const handleTilePlacement = (x: number, y: number) => {
    // Check if position is already occupied
    if (tiles.some(t => t.x === x && t.y === y)) return;

    // Check if position is adjacent to an existing tile
    const isAdjacent = tiles.some(t => 
      (Math.abs(t.x - x) === 1 && t.y === y) ||
      (Math.abs(t.y - y) === 1 && t.x === x)
    );
    
    if (!isAdjacent) return;

    // Place the tile
    const newTiles = [...tiles, { type: currentTile, x, y }];
    setTiles(newTiles);
    setTilesPlaced(tilesPlaced + 1);

    // Update score
    setScore(calculateScore(newTiles));

    // Move next tile to current, generate new next tile
    setCurrentTile(nextTile);
    setNextTile(getRandomTile());
  };

  const resetGame = () => {
    setTiles([{ type: "grass", x: 5, y: 5 }]);
    setCurrentTile(getRandomTile());
    setNextTile(getRandomTile());
    setScore(0);
    setTilesPlaced(1);
  };

  const getTileAt = (x: number, y: number): Tile | undefined => {
    return tiles.find(t => t.x === x && t.y === y);
  };

  const isAdjacentToExisting = (x: number, y: number): boolean => {
    return tiles.some(t => 
      (Math.abs(t.x - x) === 1 && t.y === y) ||
      (Math.abs(t.y - y) === 1 && t.x === x)
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-800 p-4">
      <div className="max-w-4xl mx-auto">
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
              <span className="text-5xl">🗺️</span>
              Tile Scenery Builder
            </h1>
            <p className="text-emerald-200 text-lg">
              Build a beautiful landscape by placing tiles!
            </p>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-6 mb-8">
            <div className="bg-white/10 px-6 py-3 rounded-xl backdrop-blur-lg border border-white/20">
              <div className="text-emerald-200 text-sm">Score</div>
              <div className="text-white text-2xl font-bold">{score}</div>
            </div>
            <div className="bg-white/10 px-6 py-3 rounded-xl backdrop-blur-lg border border-white/20">
              <div className="text-emerald-200 text-sm">Tiles</div>
              <div className="text-white text-2xl font-bold">{tilesPlaced}</div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-emerald-500/20 backdrop-blur-lg border border-emerald-400/30 rounded-2xl p-4 mb-8">
            <p className="text-emerald-100 text-sm leading-relaxed">
              <strong>How to play:</strong> Click on empty spaces adjacent to placed tiles to build your landscape. 
              Match similar tiles together for bonus points! 🌱🌲💧⛰️🏘️
            </p>
          </div>

          {/* Current and Next Tile */}
          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-emerald-200 text-sm mb-2 font-semibold">Current Tile</div>
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${TILE_COLORS[currentTile]} flex items-center justify-center text-4xl shadow-2xl ring-4 ring-yellow-400/50 transform scale-110`}>
                {TILE_EMOJIS[currentTile]}
              </div>
            </div>
            <div className="text-center opacity-70">
              <div className="text-emerald-200 text-sm mb-2 font-semibold">Next Tile</div>
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${TILE_COLORS[nextTile]} flex items-center justify-center text-4xl shadow-xl`}>
                {TILE_EMOJIS[nextTile]}
              </div>
            </div>
          </div>

          {/* Game Grid */}
          <div className="flex justify-center mb-8 overflow-auto">
            <div className="inline-block bg-black/30 p-4 rounded-2xl">
              <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}>
                {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
                  const x = index % GRID_SIZE;
                  const y = Math.floor(index / GRID_SIZE);
                  const tile = getTileAt(x, y);
                  const isAdjacent = isAdjacentToExisting(x, y);
                  const canPlace = !tile && isAdjacent;

                  return (
                    <button
                      key={index}
                      onClick={() => handleTilePlacement(x, y)}
                      disabled={!canPlace}
                      className={`
                        w-12 h-12 rounded-lg transition-all duration-300
                        ${tile 
                          ? `bg-gradient-to-br ${TILE_COLORS[tile.type]} shadow-lg transform hover:scale-110` 
                          : canPlace
                            ? 'bg-white/10 hover:bg-white/20 ring-2 ring-yellow-400/50 cursor-pointer transform hover:scale-105'
                            : 'bg-gray-800/50 cursor-not-allowed'
                        }
                        flex items-center justify-center text-2xl
                      `}
                    >
                      {tile ? TILE_EMOJIS[tile.type] : canPlace ? '⊕' : ''}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 mb-8">
            <h3 className="text-white font-semibold mb-4 text-center">Tile Types</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {TILE_TYPES.map((type) => (
                <div key={type} className="flex items-center gap-2">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${TILE_COLORS[type]} flex items-center justify-center text-xl shadow-lg`}>
                    {TILE_EMOJIS[type]}
                  </div>
                  <span className="text-white/80 text-sm capitalize">{type}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-amber-500/20 backdrop-blur-lg border border-amber-400/30 rounded-2xl p-4 mb-8">
            <p className="text-amber-100 text-sm leading-relaxed text-center">
              💡 <strong>Tip:</strong> Group similar tiles together for higher scores! 
              Each adjacent tile of the same type gives +5 bonus points.
            </p>
          </div>

          {/* Reset Button */}
          <button
            onClick={resetGame}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            🔄 New Landscape
          </button>
        </div>
      </div>
    </div>
  );
}
