import React from 'react';
import { FOOD_CATEGORIES } from '../../data/categories';

export default function CuisinePills({ selectedCategory, onSelectCategory }) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black font-heading text-stone-900 tracking-tight">
            Inspiration for your order
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Explore authentic cuisines and cravings
          </p>
        </div>
        {selectedCategory && (
          <button
            onClick={() => onSelectCategory(null)}
            className="text-xs font-bold text-crave-600 hover:text-crave-700 bg-crave-50 hover:bg-crave-100 px-3 py-1.5 rounded-lg transition"
          >
            Show All
          </button>
        )}
      </div>

      <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar pb-3 pt-1">
        {FOOD_CATEGORIES.map(cat => {
          const isSelected = selectedCategory === cat.name;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(isSelected ? null : cat.name)}
              className="flex flex-col items-center flex-shrink-0 group focus:outline-none transition-transform active:scale-95"
            >
              <div
                className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden p-1 transition-all duration-300 shadow-sm ${
                  isSelected
                    ? 'ring-4 ring-crave-600 scale-105'
                    : 'group-hover:ring-2 group-hover:ring-stone-300 group-hover:scale-102'
                }`}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-full"
                  loading="lazy"
                />
              </div>
              <span
                className={`mt-2 text-xs sm:text-sm font-bold tracking-tight text-center transition ${
                  isSelected ? 'text-crave-600 font-black' : 'text-stone-700 group-hover:text-stone-900'
                }`}
              >
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
