import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  MapPin,
  Search,
  Tag,
  Heart,
  ShoppingBag,
  User,
  ChevronDown,
  Sparkles,
  UtensilsCrossed
} from 'lucide-react';
import { useCrave } from '../../context/CraveContext';
import LocationModal from './LocationModal';

export default function Header() {
  const {
    selectedCity,
    selectedLocality,
    cartItemCount,
    favourites
  } = useCrave();

  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/search');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-stone-200/80 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 gap-4 py-3">
            {/* Left: Brand Logo & Location */}
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-xl bg-crave-600 flex items-center justify-center text-white shadow-md shadow-crave-500/20 group-hover:scale-105 transition">
                  <UtensilsCrossed className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black font-heading tracking-tight text-crave-600 leading-none">
                    crave
                  </span>
                  <span className="text-[10px] tracking-wider text-stone-400 font-semibold uppercase">
                    Delivery
                  </span>
                </div>
              </Link>

              {/* Location Selector Button */}
              <button
                onClick={() => setLocationModalOpen(true)}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 hover:border-stone-300 transition text-left"
                title="Change delivery location"
              >
                <div className="p-1 rounded-md bg-crave-100 text-crave-600">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <div className="font-bold text-stone-800 flex items-center gap-1">
                    <span className="truncate max-w-[120px]">{selectedLocality}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                  </div>
                  <div className="text-stone-500 text-[11px] truncate max-w-[120px]">{selectedCity}</div>
                </div>
              </button>
            </div>

            {/* Middle: Prominent Search Bar */}
            <form onSubmit={handleSearchSubmit} className="flex-1 max-w-lg hidden md:block">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search for restaurants, biryani, pizza, or dishes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:ring-2 focus:ring-crave-500 focus:bg-white text-stone-800 transition"
                />
              </div>
            </form>

            {/* Right: Navigation Items */}
            <nav className="flex items-center gap-1 sm:gap-2">
              {/* Offers link */}
              <Link
                to="/offers"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition ${
                  location.pathname === '/offers'
                    ? 'text-crave-600 bg-crave-50'
                    : 'text-stone-700 hover:text-crave-600 hover:bg-stone-50'
                }`}
              >
                <Tag className="w-4 h-4 text-amber-500" />
                <span className="hidden lg:inline">Offers</span>
              </Link>

              {/* Favourites */}
              <Link
                to="/favourites"
                className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition ${
                  location.pathname === '/favourites'
                    ? 'text-crave-600 bg-crave-50'
                    : 'text-stone-700 hover:text-crave-600 hover:bg-stone-50'
                }`}
                title="Saved Restaurants"
              >
                <Heart className={`w-4 h-4 ${favourites.length > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
                <span className="hidden lg:inline">Favourites</span>
                {favourites.length > 0 && (
                  <span className="text-xs bg-rose-100 text-rose-700 font-bold px-1.5 py-0.2 rounded-full ml-0.5">
                    {favourites.length}
                  </span>
                )}
              </Link>

              {/* Profile */}
              <Link
                to="/profile"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition ${
                  location.pathname === '/profile'
                    ? 'text-crave-600 bg-crave-50'
                    : 'text-stone-700 hover:text-crave-600 hover:bg-stone-50'
                }`}
              >
                <User className="w-4 h-4" />
                <span className="hidden lg:inline">Profile</span>
              </Link>

              {/* Cart Button with live counter */}
              <Link
                to="/cart"
                className="flex items-center gap-2 ml-1 px-4 py-2.5 rounded-xl bg-crave-600 hover:bg-crave-700 text-white font-bold text-sm shadow-md shadow-crave-600/20 transition active:scale-95"
              >
                <div className="relative">
                  <ShoppingBag className="w-4 h-4" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2.5 w-4 h-4 rounded-full bg-white text-crave-600 text-[10px] font-black flex items-center justify-center border-2 border-crave-600 animate-pulse">
                      {cartItemCount}
                    </span>
                  )}
                </div>
                <span>Cart</span>
              </Link>
            </nav>
          </div>

          {/* Mobile search input */}
          <div className="pb-3 md:hidden">
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={() => setLocationModalOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 text-xs font-semibold"
              >
                <MapPin className="w-3.5 h-3.5 text-crave-600" />
                <span>{selectedLocality}, {selectedCity}</span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>
            </div>
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search restaurants or food..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 bg-stone-50 text-xs focus:outline-none focus:ring-2 focus:ring-crave-500 focus:bg-white text-stone-800"
                />
              </div>
            </form>
          </div>
        </div>
      </header>

      {/* Location Modal */}
      <LocationModal
        isOpen={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
      />
    </>
  );
}
