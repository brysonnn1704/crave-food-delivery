import React from 'react';
import { Star } from 'lucide-react';

export default function RatingBadge({ rating, reviewCount, isDemo = true, size = 'sm' }) {
  if (!rating) {
    return (
      <span className="inline-flex items-center text-xs font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
        Unrated
      </span>
    );
  }

  const isGreen = rating >= 4.0;
  const isYellow = rating >= 3.5 && rating < 4.0;

  const bgClass = isGreen
    ? 'bg-emerald-700 text-white'
    : isYellow
    ? 'bg-amber-600 text-white'
    : 'bg-stone-600 text-white';

  const sizeClasses = size === 'sm' ? 'text-xs px-1.5 py-0.5' : 'text-sm px-2.5 py-1';

  return (
    <div className="inline-flex items-center gap-1.5">
      <span
        className={`inline-flex items-center gap-1 font-bold rounded ${bgClass} ${sizeClasses}`}
        title={isDemo ? "Simulated community rating benchmark (OSM does not store ratings)" : "Rating"}
      >
        <span>{rating.toFixed(1)}</span>
        <Star className={size === 'sm' ? "w-3 h-3 fill-white" : "w-3.5 h-3.5 fill-white"} />
      </span>
      {reviewCount && (
        <span className="text-xs text-stone-500">
          ({reviewCount})
        </span>
      )}
    </div>
  );
}
