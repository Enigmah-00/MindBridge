import Link from "next/link";

export default function GamesPage() {
  const games = [
    {
      id: "breathing-pacer",
      name: "Breathing Pacer",
      description: "Guided breathing exercise with calming animation",
      icon: "🫁",
      color: "bg-blue-500",
    },
    {
      id: "reaction-time",
      name: "Reaction Time Test",
      description: "Test and improve your reaction speed",
      icon: "⚡",
      color: "bg-yellow-500",
    },
    {
      id: "memory-match",
      name: "Memory Match",
      description: "Find matching pairs at a relaxing pace",
      icon: "🎴",
      color: "bg-purple-500",
    },
    {
      id: "simon-says",
      name: "Simon Says",
      description: "Repeat the light and sound sequence",
      icon: "🎵",
      color: "bg-green-500",
    },
    {
      id: "2048",
      name: "2048",
      description: "Classic sliding number puzzle game",
      icon: "🔢",
      color: "bg-orange-500",
    },
    {
      id: "color-sort",
      name: "Color Sort",
      description: "Sort colored liquids into matching tubes",
      icon: "🧪",
      color: "bg-pink-500",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Mindful Games</h1>
        <p className="text-gray-600">
          Relax, focus, and improve your mental wellbeing through these engaging activities
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <Link
            key={game.id}
            href={`/games/${game.id}`}
            className="card p-6 hover:shadow-lg transition-shadow"
          >
            <div className={`w-16 h-16 ${game.color} rounded-lg flex items-center justify-center text-3xl mb-4`}>
              {game.icon}
            </div>
            <h2 className="text-xl font-semibold mb-2">{game.name}</h2>
            <p className="text-gray-600 text-sm">{game.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
