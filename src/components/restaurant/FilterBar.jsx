import React from 'react';
import { SlidersHorizontal, X, ArrowUpDown, Star, Sparkles, Bike } from 'lucide-react';
import DietaryBadge from '../common/DietaryBadge';

export default function FilterBar({
  filters,
  onFilterChange,
  onResetFilters,
  totalResults
}) {
  const hasActiveFilters =
    filters.vegOnly ||
    filters.rating4Plus ||
    filters.sortBy !== 'default' ||
    filters.fastDelivery ||
    filters.freeDelivery ||
    filters.selectedCuisine;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-3 border-y border-stone-200/70 bg-white/70 backdrop-blur-xs sticky top-[72px] z-30">
      {/* Left: Scrollable Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {/* Filter Icon label */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-stone-500 uppercase tracking-wider pl-1 pr-2 border-r border-stone-200">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filters</span>
        </div>

        {/* Veg Only Toggle */}
        <button
          onClick={() => onFilterChange('vegOnly', !filters.vegOnly)}
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
            filters.vegOnly
              ? 'bg-emerald-50 text-emerald-700 border-emerald-500 shadow-xs'
              : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
          }`}
        >
          <DietaryBadge type="veg" size="sm" />
          <span>Pure Veg</span>
        </button>

        {/* Rating 4.0+ */}
        <button
          onClick={() => onFilterChange('rating4Plus', !filters.rating4Plus)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
            filters.rating4Plus
              ? 'bg-amber-50 text-amber-700 border-amber-500 shadow-xs'
              : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
          }`}
        >
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>Rating 4.0+</span>
        </button>

        {/* Fast Delivery (< 30 mins) */}
        <button
          onClick={() => onFilterChange('fastDelivery', !filters.fastDelivery)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
            filters.fastDelivery
              ? 'bg-crave-50 text-crave-700 border-crave-500 shadow-xs'
              : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-crave-500" />
          <span>Fast Delivery (&lt;30m)</span>
        </button>

        {/* Free Delivery */}
        <button
          onClick={() => onFilterChange('freeDelivery', !filters.freeDelivery)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
            filters.freeDelivery
              ? 'bg-emerald-50 text-emerald-700 border-emerald-500 shadow-xs'
              : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
          }`}
        >
          <Bike className="w-3.5 h-3.5 text-emerald-600" />
          <span>Free Delivery</span>
        </button>

        {/* Sort Select */}
        <div className="relative inline-flex items-center">
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange('sortBy', e.target.value)}
            className="appearance-none pl-7 pr-8 py-1.5 rounded-xl text-xs font-bold bg-stone-50 text-stone-700 border border-stone-200 hover:bg-stone-100 focus:outline-none cursor-pointer"
          >
            <option value="default">Sort By: Recommended</option>
            <option value="rating_desc">Highest Rated</option>
            <option value="price_asc">Cost: Low to High</option>
            <option value="price_desc">Cost: High to Low</option>
          </select>
          <ArrowUpDown className="w-3.5 h-3.5 text-stone-500 absolute left-2.5 pointer-events-none" />
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-crave-600 hover:bg-crave-50 transition"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* Right: Results Count */}
      <div className="text-xs text-stone-500 font-medium">
        Showing <strong>{totalResults}</strong> restaurants
      </div>
    </div>
  );
}
