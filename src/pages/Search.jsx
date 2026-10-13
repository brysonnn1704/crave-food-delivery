import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search as SearchIcon,
  X,
  Filter,
  UtensilsCrossed,
  SlidersHorizontal,
  MapPin,
  ArrowUpDown,
  Star
} from 'lucide-react';
import { useCrave } from '../context/CraveContext';
import RestaurantGrid from '../components/restaurant/RestaurantGrid';
import MenuItemCard from '../components/menu/MenuItemCard';
import DishModal from '../components/menu/DishModal';
import DietaryBadge from '../components/common/DietaryBadge';
import EmptyState from '../components/common/EmptyState';
import { FOOD_CATEGORIES } from '../data/categories';

export default function Search() {
  const { restaurants, menus, selectedCity, selectedLocality } = useCrave();
  const [searchParams, setSearchParams] = useSearchParams();

  const queryParam = searchParams.get('q') || '';
  const localityParam = searchParams.get('locality') || '';

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'restaurants' | 'dishes'
  const [selectedCuisine, setSelectedCuisine] = useState(null);
  const [vegOnly, setVegOnly] = useState(false);
  const [sortBy, setSortBy] = useState('default');
  const [selectedLoc, setSelectedLoc] = useState(localityParam || 'all');

  // Modal for dish detail
  const [activeDish, setActiveDish] = useState(null);
  const [activeDishRestaurant, setActiveDishRestaurant] = useState(null);

  useEffect(() => {
    setSearchQuery(queryParam);
  }, [queryParam]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim()) {
      setSearchParams({ q: val.trim() });
    } else {
      setSearchParams({});
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchParams({});
  };

  // Distinct localities from dataset
  const availableLocalities = useMemo(() => {
    const locs = new Set();
    restaurants.forEach(r => {
      if (r.locality) locs.add(r.locality);
    });
    return Array.from(locs);
  }, [restaurants]);

  // Filtered restaurants
  const matchedRestaurants = useMemo(() => {
    const term = searchQuery.toLowerCase().trim();
    return restaurants.filter(r => {
      // Search term
      if (term) {
        const nameMatch = r.name.toLowerCase().includes(term);
        const cuisineMatch = r.cuisines.some(c => c.toLowerCase().includes(term));
        const localityMatch = r.locality.toLowerCase().includes(term);
        if (!nameMatch && !cuisineMatch && !localityMatch) return false;
      }

      // Locality
      if (selectedLoc !== 'all' && r.locality !== selectedLoc) {
        return false;
      }

      // Cuisine
      if (selectedCuisine) {
        const hasCuisine = r.cuisines.some(c => c.toLowerCase() === selectedCuisine.toLowerCase());
        if (!hasCuisine) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating_desc') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'price_asc') return (a.priceForTwo || 0) - (b.priceForTwo || 0);
      if (sortBy === 'price_desc') return (b.priceForTwo || 0) - (a.priceForTwo || 0);
      return 0;
    });
  }, [restaurants, searchQuery, selectedLoc, selectedCuisine, sortBy]);

  // Filtered dishes
  const matchedDishes = useMemo(() => {
    const term = searchQuery.toLowerCase().trim();
    return menus.filter(m => {
      // Veg only
      if (vegOnly && m.dietaryType !== 'veg') return false;

      // Search term
      if (term) {
        const nameMatch = m.name.toLowerCase().includes(term);
        const descMatch = (m.description || '').toLowerCase().includes(term);
        const catMatch = (m.category || '').toLowerCase().includes(term);
        if (!nameMatch && !descMatch && !catMatch) return false;
      }

      // Locality check via parent restaurant
      if (selectedLoc !== 'all') {
        const parent = restaurants.find(r => r.id === m.restaurantId);
        if (parent && parent.locality !== selectedLoc) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      return 0;
    });
  }, [menus, searchQuery, vegOnly, selectedLoc, sortBy, restaurants]);

  const handleOpenDish = (dish) => {
    const parentRest = restaurants.find(r => r.id === dish.restaurantId) || restaurants[0];
    setActiveDish(dish);
    setActiveDishRestaurant(parentRest);
  };

  const totalResults =
    activeTab === 'restaurants'
      ? matchedRestaurants.length
      : activeTab === 'dishes'
      ? matchedDishes.length
      : matchedRestaurants.length + matchedDishes.length;

  return (
    <div className="min-h-screen bg-[#f8f8f8] py-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Search Header Input */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm space-y-4">
          <div className="relative">
            <SearchIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              autoFocus
              placeholder="Search for restaurants, biryani, pizzas, dosas, desserts..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-12 pr-10 py-3.5 rounded-2xl border border-stone-200 bg-stone-50 text-base focus:outline-none focus:ring-2 focus:ring-crave-500 focus:bg-white text-stone-900 font-medium transition"
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1"
                aria-label="Clear search"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Quick Cuisine Chips */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider flex-shrink-0">
              Popular:
            </span>
            {FOOD_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  if (selectedCuisine === cat.name) {
                    setSelectedCuisine(null);
                  } else {
                    setSelectedCuisine(cat.name);
                    setSearchQuery(cat.name);
                    setSearchParams({ q: cat.name });
                  }
                }}
                className={`text-xs font-bold px-3 py-1 rounded-xl transition flex-shrink-0 border ${
                  selectedCuisine === cat.name
                    ? 'bg-crave-600 text-white border-crave-600 shadow-xs'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Filter & View Switcher Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-stone-200/80">
          {/* Tab buttons: All, Restaurants, Dishes */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'all'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All ({matchedRestaurants.length + matchedDishes.length})
            </button>
            <button
              onClick={() => setActiveTab('restaurants')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'restaurants'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Restaurants ({matchedRestaurants.length})
            </button>
            <button
              onClick={() => setActiveTab('dishes')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'dishes'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Dishes ({matchedDishes.length})
            </button>
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2">
            {/* Pure Veg */}
            <button
              onClick={() => setVegOnly(!vegOnly)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                vegOnly
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-500 shadow-xs'
                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              <DietaryBadge type="veg" size="sm" />
              <span>Veg Only</span>
            </button>

            {/* Locality Filter */}
            <select
              value={selectedLoc}
              onChange={(e) => setSelectedLoc(e.target.value)}
              className="text-xs font-bold py-1.5 px-3 rounded-xl border border-stone-200 bg-stone-50 text-stone-700 focus:outline-none cursor-pointer"
            >
              <option value="all">All Localities</option>
              {availableLocalities.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-bold py-1.5 px-3 rounded-xl border border-stone-200 bg-stone-50 text-stone-700 focus:outline-none cursor-pointer"
            >
              <option value="default">Sort: Relevant</option>
              <option value="rating_desc">Highest Rated</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Results Sections */}
        {totalResults === 0 ? (
          <EmptyState
            title="No matches found"
            message={`We couldn't find any restaurants or dishes matching "${searchQuery}". Try searching for popular items like Biryani, Dosa, Pizza, or Burger.`}
            actionLabel="Reset Search"
            actionHref="/search"
          />
        ) : (
          <div className="space-y-10">
            {/* Restaurants Section */}
            {(activeTab === 'all' || activeTab === 'restaurants') && matchedRestaurants.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold font-heading text-stone-900">
                    Restaurants ({matchedRestaurants.length})
                  </h3>
                  {activeTab === 'all' && (
                    <button
                      onClick={() => setActiveTab('restaurants')}
                      className="text-xs font-bold text-crave-600 hover:text-crave-700"
                    >
                      See all restaurants
                    </button>
                  )}
                </div>

                <RestaurantGrid
                  restaurants={activeTab === 'all' ? matchedRestaurants.slice(0, 8) : matchedRestaurants}
                />
              </section>
            )}

            {/* Dishes Section */}
            {(activeTab === 'all' || activeTab === 'dishes') && matchedDishes.length > 0 && (
              <section className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold font-heading text-stone-900">
                    Dishes &amp; Recipes ({matchedDishes.length})
                  </h3>
                  {activeTab === 'all' && (
                    <button
                      onClick={() => setActiveTab('dishes')}
                      className="text-xs font-bold text-crave-600 hover:text-crave-700"
                    >
                      See all dishes
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(activeTab === 'all' ? matchedDishes.slice(0, 6) : matchedDishes).map(dish => {
                    const parentRest = restaurants.find(r => r.id === dish.restaurantId) || restaurants[0];
                    return (
                      <MenuItemCard
                        key={dish.id}
                        item={dish}
                        restaurant={parentRest}
                        onOpenDishModal={handleOpenDish}
                      />
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        )}
      </div>

      {/* Dish Modal */}
      {activeDish && activeDishRestaurant && (
        <DishModal
          item={activeDish}
          restaurant={activeDishRestaurant}
          isOpen={!!activeDish}
          onClose={() => {
            setActiveDish(null);
            setActiveDishRestaurant(null);
          }}
        />
      )}
    </div>
  );
}
