import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Clock, Bike, ShieldCheck } from 'lucide-react';
import RatingBadge from '../common/RatingBadge';
import { useCrave } from '../../context/CraveContext';

export default function RestaurantCard({ restaurant }) {
  const { isFavourite, toggleFavourite } = useCrave();
  const favorited = isFavourite(restaurant.id);

  const handleHeartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavourite(restaurant.id);
  };

  return (
    <Link
      to={`/restaurant/${restaurant.id}`}
      className="group bg-white rounded-2xl overflow-hidden border border-stone-200/80 hover:border-stone-300 hover:shadow-lg transition-all duration-300 flex flex-col"
    >
      {/* Cover Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80';
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

        {/* Top-Right Favorite Button */}
        <button
          onClick={handleHeartClick}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-stone-700 shadow-md transition hover:scale-110 active:scale-95"
          title={favorited ? "Remove from Favourites" : "Save to Favourites"}
          aria-label="Toggle favourite"
        >
          <Heart
            className={`w-4 h-4 transition ${
              favorited ? 'text-rose-600 fill-rose-600' : 'text-stone-600'
            }`}
          />
        </button>

        {/* Offer / Free Delivery Badge */}
        {restaurant.deliveryFee === 0 && (
          <div className="absolute top-3 left-3 bg-emerald-600 text-white font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md shadow-md flex items-center gap-1">
            <Bike className="w-3 h-3" />
            <span>Free Delivery</span>
          </div>
        )}

        {/* Bottom image overlay: Delivery Time */}
        <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5 text-white text-xs font-semibold drop-shadow-md">
          <Clock className="w-3.5 h-3.5 text-white/90" />
          <span>{restaurant.deliveryTime}</span>
        </div>

        {/* OpenStreetMap verified tag */}
        <div className="absolute bottom-2.5 right-3 bg-black/60 backdrop-blur-xs text-white/90 text-[10px] px-2 py-0.5 rounded flex items-center gap-1 font-medium">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>OSM</span>
        </div>
      </div>

      {/* Info Body */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Header row: Name & Rating */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-stone-900 text-base font-heading group-hover:text-crave-600 transition leading-snug line-clamp-1">
              {restaurant.name}
            </h3>
            <RatingBadge rating={restaurant.rating} isDemo={true} />
          </div>

          {/* Cuisines */}
          <p className="text-stone-500 text-xs line-clamp-1 mb-2 font-medium">
            {restaurant.cuisines.join(', ')}
          </p>
        </div>

        {/* Bottom row: Locality and Price for two */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
          <span className="font-medium truncate max-w-[150px]">
            {restaurant.locality}, {restaurant.city}
          </span>
          <span className="font-bold text-stone-800">
            ₹{restaurant.priceForTwo} for two
          </span>
        </div>
      </div>
    </Link>
  );
}
