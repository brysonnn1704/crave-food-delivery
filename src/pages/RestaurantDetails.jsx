import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Clock,
  Phone,
  ShieldCheck,
  Heart,
  Share2,
  Search,
  Bike,
  Star,
  ExternalLink,
  ChevronRight,
  ShoppingBag,
  Info
} from 'lucide-react';
import { useCrave } from '../context/CraveContext';
import RatingBadge from '../components/common/RatingBadge';
import DietaryBadge from '../components/common/DietaryBadge';
import MenuCategorySection from '../components/menu/MenuCategorySection';
import DishModal from '../components/menu/DishModal';
import DataTransparencyBadge from '../components/common/DataTransparencyBadge';
import EmptyState from '../components/common/EmptyState';

export default function RestaurantDetails() {
  const { id } = useParams();
  const {
    restaurants,
    menus,
    isFavourite,
    toggleFavourite,
    addRecentlyViewed,
    cartItems,
    cartRestaurant,
    cartItemCount,
    cartSubtotal
  } = useCrave();

  const [menuSearch, setMenuSearch] = useState('');
  const [vegOnly, setVegOnly] = useState(false);
  const [activeCategoryTab, setActiveCategoryTab] = useState('all');
  const [activeDish, setActiveDish] = useState(null);

  // Find restaurant
  const restaurant = useMemo(() => {
    return restaurants.find(r => r.id === id);
  }, [restaurants, id]);

  useEffect(() => {
    if (restaurant) {
      addRecentlyViewed(restaurant.id);
    }
  }, [restaurant]);

  // Fetch all menu items for this restaurant
  const restaurantMenuItems = useMemo(() => {
    if (!restaurant) return [];
    return menus.filter(m => m.restaurantId === restaurant.id);
  }, [menus, restaurant]);

  // Filtered menu items
  const filteredMenuItems = useMemo(() => {
    return restaurantMenuItems.filter(item => {
      if (vegOnly && item.dietaryType !== 'veg') return false;
      if (menuSearch.trim()) {
        const query = menuSearch.toLowerCase().trim();
        const matchName = item.name.toLowerCase().includes(query);
        const matchDesc = (item.description || '').toLowerCase().includes(query);
        const matchCat = (item.category || '').toLowerCase().includes(query);
        if (!matchName && !matchDesc && !matchCat) return false;
      }
      return true;
    });
  }, [restaurantMenuItems, vegOnly, menuSearch]);

  // Group items by category in preferred order
  const CATEGORY_ORDER = [
    'Recommended',
    'Starters',
    'Main Course',
    'Biryani',
    'Breads',
    'Desserts',
    'Beverages'
  ];

  const groupedCategories = useMemo(() => {
    const map = {};
    filteredMenuItems.forEach(item => {
      const cat = item.category || 'Main Course';
      if (!map[cat]) map[cat] = [];
      map[cat].push(item);
    });

    const ordered = [];
    CATEGORY_ORDER.forEach(cat => {
      if (map[cat] && map[cat].length > 0) {
        ordered.push({ name: cat, items: map[cat] });
        delete map[cat];
      }
    });

    // Append remaining categories
    Object.keys(map).forEach(cat => {
      if (map[cat].length > 0) {
        ordered.push({ name: cat, items: map[cat] });
      }
    });

    return ordered;
  }, [filteredMenuItems]);

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-[#f8f8f8] py-12">
        <div className="max-w-3xl mx-auto px-4">
          <EmptyState
            title="Restaurant Not Found"
            message="The requested restaurant ID could not be located in the OpenStreetMap imported dataset."
            actionLabel="Return to Discover"
            actionHref="/"
          />
        </div>
      </div>
    );
  }

  const isFav = isFavourite(restaurant.id);
  const isCartFromThisRestaurant = cartRestaurant && cartRestaurant.id === restaurant.id && cartItemCount > 0;

  return (
    <div className="min-h-screen bg-[#f8f8f8] pb-24">
      {/* 1. Breadcrumbs */}
      <div className="bg-white border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-xs text-stone-500 flex items-center gap-1.5">
          <Link to="/" className="hover:text-crave-600 transition">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <Link to={`/search?locality=${encodeURIComponent(restaurant.locality)}`} className="hover:text-crave-600 transition">
            {restaurant.city}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
          <span className="text-stone-900 font-semibold truncate">{restaurant.name}</span>
        </div>
      </div>

      {/* 2. Restaurant Header Showcase */}
      <div className="bg-white border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start justify-between">
            {/* Left: Info */}
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-4xl font-black font-heading text-stone-900 tracking-tight">
                  {restaurant.name}
                </h1>
                <DataTransparencyBadge
                  sourceUrl={restaurant.sourceUrl}
                  license={restaurant.sourceLicense}
                  compact={true}
                />
              </div>

              <p className="text-sm font-semibold text-stone-500">
                {restaurant.cuisines.join(' • ')}
              </p>

              <div className="flex items-center gap-2 text-xs text-stone-600">
                <MapPin className="w-4 h-4 text-crave-600 flex-shrink-0" />
                <span>{restaurant.address}</span>
              </div>

              {/* Timing & Phone */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 pt-1">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>{restaurant.openingHours}</span>
                </div>
                {restaurant.phone && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-stone-400" />
                    <span>{restaurant.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Bike className="w-4 h-4 text-crave-600" />
                  <span>{restaurant.deliveryTime} • ₹{restaurant.deliveryFee === 0 ? 'Free Delivery' : `${restaurant.deliveryFee} Fee`}</span>
                </div>
              </div>

              {/* Actions row: Heart & Share */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => toggleFavourite(restaurant.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition ${
                    isFav
                      ? 'bg-rose-50 border-rose-300 text-rose-600 shadow-xs'
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-600 text-rose-600' : ''}`} />
                  <span>{isFav ? 'Favourited' : 'Add to Favourites'}</span>
                </button>
                <a
                  href={restaurant.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-700 bg-stone-50 hover:bg-stone-100 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>OSM Node Info</span>
                </a>
              </div>
            </div>

            {/* Right: Rating Box & Image */}
            <div className="flex items-center gap-4 self-stretch lg:self-auto">
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-center flex-shrink-0">
                <RatingBadge rating={restaurant.rating} reviewCount={restaurant.reviewCount} isDemo={true} size="md" />
                <span className="block text-[10px] text-stone-400 font-medium mt-1">
                  Demo Score
                </span>
              </div>
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden bg-stone-100 shadow-sm flex-shrink-0">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Menu Navigation & Search Sticky Bar */}
      <div className="sticky top-[72px] z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
          {/* Menu Search */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder={`Search within ${restaurant.name} menu...`}
              value={menuSearch}
              onChange={(e) => setMenuSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 bg-stone-50 text-xs focus:ring-2 focus:ring-crave-500 focus:bg-white focus:outline-none"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2">
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
          </div>
        </div>
      </div>

      {/* 4. Menu Items Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {restaurantMenuItems.length === 0 ? (
          <EmptyState
            title="Menu Currently Unavailable"
            message="This establishment does not have itemized dish records in the open dataset. Real establishments from OpenStreetMap may not always have dish listings."
            actionLabel="Discover Other Restaurants"
            actionHref="/"
          />
        ) : filteredMenuItems.length === 0 ? (
          <EmptyState
            title="No matching dishes"
            message={`No items found matching "${menuSearch}".`}
            actionLabel="Reset Menu Search"
            actionHref={`/restaurant/${restaurant.id}`}
          />
        ) : (
          <div className="space-y-12">
            {groupedCategories.map(group => (
              <MenuCategorySection
                key={group.name}
                category={group.name}
                items={group.items}
                restaurant={restaurant}
                onOpenDishModal={setActiveDish}
              />
            ))}
          </div>
        )}
      </div>

      {/* 5. Floating Bottom Cart Pill (If user added items from this restaurant) */}
      {isCartFromThisRestaurant && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-md px-4 animate-slide-up">
          <Link
            to="/cart"
            className="w-full bg-stone-900 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between border border-stone-800 hover:bg-black transition group active:scale-98"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-crave-600 text-white flex items-center justify-center font-bold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold tracking-wider uppercase text-stone-400">
                  {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'} in cart
                </div>
                <div className="text-base font-black font-heading text-white">
                  ₹{cartSubtotal} <span className="text-xs font-normal text-stone-400">plus taxes</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm font-bold text-crave-400 group-hover:text-crave-300">
              <span>View Cart</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      )}

      {/* Dish Modal */}
      {activeDish && (
        <DishModal
          item={activeDish}
          restaurant={restaurant}
          isOpen={!!activeDish}
          onClose={() => setActiveDish(null)}
        />
      )}
    </div>
  );
}
