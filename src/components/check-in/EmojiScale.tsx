'use client';

interface EmojiScaleProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export default function EmojiScale({ value, onChange, min = 1, max = 10 }: EmojiScaleProps) {
  const emojis = ['😢', '😟', '😐', '🙂', '😊', '😄', '😁', '🤩', '😍', '🥳'];
  
  const getEmoji = (val: number) => {
    const index = Math.floor((val - min) / (max - min) * (emojis.length - 1));
    return emojis[Math.min(index, emojis.length - 1)];
  };

  const getMoodLabel = (val: number) => {
    if (val <= 2) return 'Very Low';
    if (val <= 4) return 'Low';
    if (val <= 6) return 'Okay';
    if (val <= 8) return 'Good';
    return 'Excellent';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center">
        <div className="text-6xl">{getEmoji(value)}</div>
      </div>
      
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-gradient-to-r from-red-300 via-yellow-300 to-green-300 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, 
              #fca5a5 0%, 
              #fde047 ${((value - min) / (max - min)) * 100}%, 
              #d1d5db ${((value - min) / (max - min)) * 100}%, 
              #d1d5db 100%)`
          }}
        />
        <div className="absolute w-full flex justify-between text-xs text-gray-500 mt-1">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      </div>
      
      <div className="text-center">
        <span className="text-lg font-semibold text-gray-700">{value}</span>
        <span className="text-sm text-gray-500 ml-2">- {getMoodLabel(value)}</span>
      </div>
    </div>
  );
}
