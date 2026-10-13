import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, UtensilsCrossed, ShieldCheck, MapPin, Bike } from 'lucide-react';
import { useCrave } from '../context/CraveContext';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import EmptyState from '../components/common/EmptyState';

export default function Cart() {
  const { cartItems, cartRestaurant, clearCart } = useCrave();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8f8f8] py-12">
        <div className="max-w-2xl mx-auto px-4">
          <EmptyState
            title="Your Cart is Empty"
            message="Good food is always cooking! Explore restaurants and dishes in your city to fill your cart."
            actionLabel="Discover Restaurants"
            actionHref="/"
            icon={ShoppingBag}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f8f8] py-8 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link
              to={cartRestaurant ? `/restaurant/${cartRestaurant.id}` : "/"}
              className="p-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-stone-900 transition"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black font-heading text-stone-900 tracking-tight">
                Review Your Cart
              </h1>
              <p className="text-xs text-stone-500">
                Check your selected items, add notes, and apply coupons
              </p>
            </div>
          </div>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Restaurant Info & Cart Items List */}
          <div className="lg:col-span-7 space-y-6">
            {/* Restaurant Card */}
            {cartRestaurant && (
              <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden bg-stone-100 flex-shrink-0">
                    <img
                      src={cartRestaurant.image}
                      alt={cartRestaurant.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900 text-base font-heading">
                      {cartRestaurant.name}
                    </h3>
                    <div className="text-xs text-stone-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-crave-600" />
                      <span>{cartRestaurant.locality}, {cartRestaurant.city}</span>
                    </div>
                  </div>
                </div>

                <Link
                  to={`/restaurant/${cartRestaurant.id}`}
                  className="text-xs font-bold text-crave-600 hover:text-crave-700 bg-crave-50 px-3 py-1.5 rounded-xl transition"
                >
                  Add More Items
                </Link>
              </div>
            )}

            {/* Cart Items List */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-2">
                <h3 className="font-bold text-stone-900 text-sm font-heading uppercase tracking-wider">
                  Order Items ({cartItems.length})
                </h3>
              </div>

              <div className="divide-y divide-stone-100">
                {cartItems.map(item => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </div>

            {/* Delivery Transparency Note */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-600 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-800">Simulated Order Environment:</strong> Crave charges no real money and transmits no real orders. All delivery charges and GST calculations are demonstration estimates.
              </div>
            </div>
          </div>

          {/* Right Column: Bill Details & Coupons */}
          <div className="lg:col-span-5 sticky top-24">
            <CartSummary onProceedToCheckout={() => navigate('/checkout')} />
          </div>
        </div>
      </div>
    </div>
  );
}
