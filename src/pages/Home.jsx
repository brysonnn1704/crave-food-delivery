import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  TrendingUp,
  MapPin,
  Clock,
  Bike,
  ShieldCheck,
  ChevronRight,
  Tag,
  Star,
  Flame,
  Award
} from 'lucide-react';
import { useCrave } from '../context/CraveContext';
import CuisinePills from '../components/restaurant/CuisinePills';
import RestaurantGrid from '../components/restaurant/RestaurantGrid';
import FilterBar from '../components/restaurant/FilterBar';
import MenuItemCard from '../components/menu/MenuItemCard';
import DishModal from '../components/menu/DishModal';
import { DEMO_COUPONS } from '../data/coupons';

export default function Home() {
  const {
    restaurants,
    menus,
    selectedCity,
    selectedLocality,
    vegOnly,
    recentlyViewed
  } = useCrave();

  // Category filter state
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Filters state
  const [filters, setFilters] = useState({
    vegOnly: false,
    rating4Plus: false,
    sortBy: 'default',
    fastDelivery: false,
    freeDelivery: false,
    selectedCuisine: null
  });

  // Dish modal state
  const [activeDish, setActiveDish] = useState(null);
  const [activeDishRestaurant, setActiveDishRestaurant] = useState(null);

  const handleFilterChange = (key, val) => {
    setFilters(prev => ({ ...prev, [key]: val }));
  };

  const handleResetFilters = () => {
    setFilters({
      vegOnly: false,
      rating4Plus: false,
      sortBy: 'default',
      fastDelivery: false,
      freeDelivery: false,
      selectedCuisine: null
    });
    setSelectedCategory(null);
  };

  // Filter restaurants by City, Locality, Category, and active filters
  const filteredRestaurants = useMemo(() => {
    return restaurants.filter(r => {
      // 1. City match
      if (selectedCity && r.city && r.city !== selectedCity) {
        return false;
      }

      // 2. Locality match
      if (selectedLocality && selectedLocality !== 'All Localities') {
        if (r.locality && r.locality !== selectedLocality) {
          return false;
        }
      }

      // 3. Category match
      if (selectedCategory) {
        const hasCuisine = r.cuisines.some(
          c => c.toLowerCase() === selectedCategory.toLowerCase()
        );
        if (!hasCuisine) return false;
      }

      // 4. Rating filter
      if (filters.rating4Plus && r.rating < 4.0) {
        return false;
      }

      // 5. Free delivery filter
      if (filters.freeDelivery && r.deliveryFee > 0) {
        return false;
      }

      // 6. Fast delivery (< 30 mins)
      if (filters.fastDelivery) {
        const mins = parseInt(r.deliveryTime) || 35;
        if (mins >= 30) return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'rating_desc') {
        return (b.rating || 0) - (a.rating || 0);
      }
      if (filters.sortBy === 'price_asc') {
        return (a.priceForTwo || 0) - (b.priceForTwo || 0);
      }
      if (filters.sortBy === 'price_desc') {
        return (b.priceForTwo || 0) - (a.priceForTwo || 0);
      }
      return 0;
    });
  }, [restaurants, selectedCity, selectedLocality, selectedCategory, filters]);

  // Top rated collection
  const topRatedRestaurants = useMemo(() => {
    return restaurants
      .filter(r => (r.city === selectedCity || !selectedCity) && r.rating >= 4.4)
      .slice(0, 4);
  }, [restaurants, selectedCity]);

  // Featured Popular Dishes
  const popularDishes = useMemo(() => {
    return menus
      .filter(m => (filters.vegOnly || vegOnly ? m.dietaryType === 'veg' : true))
      .slice(0, 4);
  }, [menus, filters.vegOnly, vegOnly]);

  // Recently viewed restaurants
  const recentlyViewedRestaurants = useMemo(() => {
    if (!recentlyViewed || recentlyViewed.length === 0) return [];
    return recentlyViewed
      .map(id => restaurants.find(r => r.id === id))
      .filter(Boolean)
      .slice(0, 4);
  }, [recentlyViewed, restaurants]);

  const handleOpenDish = (dish) => {
    const parentRest = restaurants.find(r => r.id === dish.restaurantId) || restaurants[0];
    setActiveDish(dish);
    setActiveDishRestaurant(parentRest);
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8] pb-20">
      {/* 1. Hero Promo Banner (Identified as Demo Offers) */}
      <div className="bg-gradient-to-r from-crave-700 via-crave-600 to-rose-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Real Restaurant Data • OpenStreetMap ODbL</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black font-heading tracking-tight leading-tight">
                Craving your favorite dishes?
              </h1>
              <p className="text-white/90 text-sm sm:text-base font-medium">
                Order from verified dining hubs in {selectedCity} with live authentic menus &amp; instant simulated delivery.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
                <Link
                  to="/offers"
                  className="px-5 py-2.5 rounded-xl bg-white text-crave-700 font-extrabold text-sm hover:bg-stone-100 transition shadow-md active:scale-95 flex items-center gap-1.5"
                >
                  <Tag className="w-4 h-4 text-crave-600" />
                  <span>Use Coupon: WELCOME50 (50% OFF)</span>
                </Link>
                <div className="text-xs text-white/80 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  <span>75 OSM Restaurants Online</span>
                </div>
              </div>
            </div>

            {/* Quick Promo Card */}
            <div className="hidden lg:block w-72 bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-white shadow-xl">
              <div className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">
                Demo Promo Code
              </div>
              <div className="text-2xl font-black font-heading tracking-wider text-white mb-2">
                CRAVEFEAST
              </div>
              <p className="text-xs text-white/80 mb-3">
                Flat ₹120 OFF on hearty family feasts &amp; biryani handis above ₹499.
              </p>
              <div className="text-[10px] bg-black/30 px-2.5 py-1 rounded-md inline-block font-mono">
                Valid till Dec 2026
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
        {/* 2. Food Category Navigation */}
        <section className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
          <CuisinePills
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </section>

        {/* 3. Filter Bar */}
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          totalResults={filteredRestaurants.length}
        />

        {/* 4. Main Restaurant Listings */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black font-heading text-stone-900 tracking-tight flex items-center gap-2">
                <span>Restaurants in {selectedLocality === 'All Localities' ? selectedCity : `${selectedLocality}, ${selectedCity}`}</span>
              </h2>
              <p className="text-xs sm:text-sm text-stone-500">
                {selectedCategory ? `Showing ${selectedCategory} culinary spots` : 'Authentic dining spots collected via OpenStreetMap'}
              </p>
            </div>
            <div className="text-xs font-bold text-stone-500 bg-stone-100 px-3 py-1.5 rounded-xl hidden sm:block">
              {filteredRestaurants.length} Verified Outlets
            </div>
          </div>

          <RestaurantGrid
            restaurants={filteredRestaurants}
            emptyMessage={`No restaurants found matching your criteria in ${selectedLocality}, ${selectedCity}. Try resetting filters or changing the locality.`}
          />
        </section>

        {/* 5. Top-Rated Dining Gems (Rating >= 4.4) */}
        {topRatedRestaurants.length > 0 && !selectedCategory && (
          <section className="pt-6 border-t border-stone-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black font-heading text-stone-900 tracking-tight">
                    Top-Rated Dining Gems
                  </h3>
                  <p className="text-xs text-stone-500">
                    Highest rated establishments in {selectedCity}
                  </p>
                </div>
              </div>
              <Link
                to="/search?rating=4.4"
                className="text-xs font-bold text-crave-600 hover:text-crave-700 flex items-center gap-1"
              >
                <span>View all</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <RestaurantGrid restaurants={topRatedRestaurants} />
          </section>
        )}

        {/* 6. Popular Dishes / Food Items Section */}
        {popularDishes.length > 0 && (
          <section className="pt-6 border-t border-stone-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black font-heading text-stone-900 tracking-tight">
                    Trending Culinary Dishes
                  </h3>
                  <p className="text-xs text-stone-500">
                    Recipes sourced from the open Indian Food 101 dataset (CC0)
                  </p>
                </div>
              </div>
              <Link
                to="/search"
                className="text-xs font-bold text-crave-600 hover:text-crave-700 flex items-center gap-1"
              >
                <span>Browse Menu Catalog</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {popularDishes.map(dish => {
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

        {/* 7. Recently Viewed Section */}
        {recentlyViewedRestaurants.length > 0 && (
          <section className="pt-6 border-t border-stone-200/80 space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-stone-100 text-stone-700">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-black font-heading text-stone-900 tracking-tight">
                  Recently Viewed by You
                </h3>
                <p className="text-xs text-stone-500">
                  Quickly jump back to menus you explored
                </p>
              </div>
            </div>

            <RestaurantGrid restaurants={recentlyViewedRestaurants} />
          </section>
        )}

        {/* 8. Data Ingestion & Transparency Callout Card */}
        <section className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 text-xs font-bold px-2.5 py-1 rounded-lg">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Ethical Data Ingestion Architecture</span>
            </div>
            <h3 className="text-lg font-bold font-heading text-stone-900">
              Real Data Collected from Permitted Sources
            </h3>
            <p className="text-xs text-stone-600 max-w-2xl leading-relaxed">
              Crave does not fabricate scraped records or bypass access controls. Restaurant entities and coordinates are sourced from OpenStreetMap (ODbL 1.0) via Overpass API. Food dishes are paired with recipes from the Indian Food 101 (CC0) dataset.
            </p>
          </div>
          <Link
            to="/settings"
            className="px-5 py-2.5 rounded-xl border border-stone-300 hover:border-stone-400 bg-stone-50 hover:bg-stone-100 text-stone-800 text-xs font-bold transition flex-shrink-0"
          >
            Inspect Ingestion Pipeline &amp; Licences
          </Link>
        </section>
      </div>

      {/* Dish Details Modal */}
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
