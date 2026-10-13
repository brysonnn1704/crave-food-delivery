import React from 'react';
import { Heart, ArrowLeft, UtensilsCrossed } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCrave } from '../context/CraveContext';
import RestaurantGrid from '../components/restaurant/RestaurantGrid';
import EmptyState from '../components/common/EmptyState';

export default function Favourites() {
  const { restaurants, favourites } = useCrave();

  const favRestaurants = restaurants.filter(r => favourites.includes(r.id));

  return (
    <div className="min-h-screen bg-[#f8f8f8] py-8 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black font-heading text-stone-900 tracking-tight">
                Your Saved Favourites
              </h1>
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                {favourites.length}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Quick access to your preferred dining spots and cafes
            </p>
          </div>
        </div>

        {favRestaurants.length === 0 ? (
          <EmptyState
            title="No Favourites Saved Yet"
            message="Tap the heart icon on any restaurant card to save your favorite spots for quick ordering."
            actionLabel="Discover Restaurants"
            actionHref="/"
            icon={Heart}
          />
        ) : (
          <RestaurantGrid
            restaurants={favRestaurants}
            emptyMessage="No favourite restaurants found."
          />
        )}
      </div>
    </div>
  );
}
