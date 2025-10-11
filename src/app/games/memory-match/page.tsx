"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Card = {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
};

const EMOJIS = ["🌸", "🌺", "🌻", "🌷", "🌹", "🪷", "🏵️", "🌼"];

export default function MemoryMatchPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [isWon, setIsWon] = useState(false);

  const initializeGame = () => {
    const gameEmojis = EMOJIS.slice(0, 8);
    const cardPairs = [...gameEmojis, ...gameEmojis];
    const shuffled = cardPairs
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));

    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setIsWon(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (matches === EMOJIS.length) {
      setIsWon(true);
    }
  }, [matches]);

  const handleCardClick = (cardId: number) => {
    const card = cards.find((c) => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched || flippedCards.length === 2)
      return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    setCards(
      cards.map((c) =>
        c.id === cardId ? { ...c, isFlipped: true } : c
      )
    );

    if (newFlippedCards.length === 2) {
      setMoves((prev) => prev + 1);

      const [firstId, secondId] = newFlippedCards;
      const firstCard = cards.find((c) => c.id === firstId);
      const secondCard = cards.find((c) => c.id === secondId);

      if (firstCard && secondCard && firstCard.emoji === secondCard.emoji) {
        // Match found
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((c) =>
              c.id === firstId || c.id === secondId
                ? { ...c, isMatched: true }
                : c
            )
          );
          setMatches((prev) => prev + 1);
          setFlippedCards([]);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((c) =>
              c.id === firstId || c.id === secondId
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto text-center">
      <Link href="/games" className="inline-block mb-6 text-blue-600 hover:underline">
        ← Back to Games
      </Link>

      <h1 className="text-3xl font-bold mb-2">Memory Match</h1>
      <p className="text-gray-600 mb-8">
        Find all matching pairs of cards. Take your time!
      </p>

      <div className="card p-6 mb-6">
        <div className="flex justify-center gap-8 mb-6">
          <div>
            <div className="text-2xl font-bold text-blue-600">{moves}</div>
            <div className="text-sm text-gray-600">Moves</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {matches}/{EMOJIS.length}
            </div>
            <div className="text-sm text-gray-600">Matches</div>
          </div>
        </div>

        {isWon ? (
          <div className="mb-6">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold mb-2">Congratulations!</h2>
            <p className="text-gray-600 mb-4">
              You completed the game in {moves} moves!
            </p>
            <button onClick={initializeGame} className="btn">
              Play Again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-3 max-w-lg mx-auto">
            {cards.map((card) => (
              <button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                className={`aspect-square rounded-lg text-4xl font-bold transition-all transform ${
                  card.isFlipped || card.isMatched
                    ? "bg-white border-2 border-blue-300"
                    : "bg-gradient-to-br from-blue-400 to-purple-500 hover:scale-105"
                } ${card.isMatched ? "opacity-50" : ""}`}
                disabled={card.isFlipped || card.isMatched}
              >
                {card.isFlipped || card.isMatched ? card.emoji : "?"}
              </button>
            ))}
          </div>
        )}

        <button
          onClick={initializeGame}
          className="mt-6 btn bg-gray-500 hover:bg-gray-600"
        >
          New Game
        </button>
      </div>

      <div className="card p-6 text-left">
        <h2 className="text-lg font-semibold mb-2">How to play:</h2>
        <ul className="space-y-1 text-gray-600">
          <li>• Click on cards to flip them over</li>
          <li>• Find two matching cards</li>
          <li>• Try to complete with the fewest moves</li>
          <li>• Take your time - this is about relaxation!</li>
        </ul>
      </div>
    </div>
  );
}
