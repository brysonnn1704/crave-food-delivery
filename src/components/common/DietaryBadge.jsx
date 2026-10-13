import React from 'react';

/**
 * Standard Indian food dietary indicator:
 * - Green square with solid dot = Vegetarian
 * - Red/brown square with solid triangle = Non-Vegetarian
 */
export default function DietaryBadge({ type, size = 'sm', showLabel = false }) {
  const isVeg = type === 'veg' || type === 'vegan';
  const sizeClasses = size === 'sm' ? 'w-4 h-4 p-[2px]' : 'w-5 h-5 p-[3px]';

  return (
    <div className="inline-flex items-center gap-1.5" title={isVeg ? 'Vegetarian' : 'Non-Vegetarian'}>
      <div
        className={`border ${
          isVeg ? 'border-emerald-600' : 'border-rose-700'
        } rounded-sm flex items-center justify-center bg-white ${sizeClasses}`}
        aria-label={isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
      >
        {isVeg ? (
          <div className="w-2 h-2 rounded-full bg-emerald-600" />
        ) : (
          <div className="w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-b-[6px] border-b-rose-700" />
        )}
      </div>
      {showLabel && (
        <span className={`font-medium ${isVeg ? 'text-emerald-700' : 'text-rose-700'} text-xs capitalize`}>
          {isVeg ? 'Veg' : 'Non-Veg'}
        </span>
      )}
    </div>
  );
}
