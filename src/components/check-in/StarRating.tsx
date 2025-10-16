'use client';

import { useState } from 'react';

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function StarRating({ value, onChange, max = 5, size = 'md' }: StarRatingProps) {
  const [hover, setHover] = useState(0);

  const sizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <div className="flex gap-1">
      {[...Array(max)].map((_, index) => {
        const starValue = index + 1;
        return (
          <button
            key={index}
            type="button"
            onClick={() => onChange(starValue)}
            onMouseEnter={() => setHover(starValue)}
            onMouseLeave={() => setHover(0)}
            className={`${sizes[size]} transition-all ${
              starValue <= (hover || value)
                ? 'text-yellow-400'
                : 'text-gray-300'
            } hover:scale-110`}
          >
            ★
          </button>
        );
      })}
      <span className="ml-2 text-sm text-gray-600">{value}/{max}</span>
    </div>
  );
}
