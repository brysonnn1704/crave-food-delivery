import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Clock,
  ArrowRight,
  Repeat,
  CheckCircle2,
  MapPin,
  Calendar
} from 'lucide-react';
import { useCrave } from '../context/CraveContext';
import EmptyState from '../components/common/EmptyState';

export default function OrderHistory() {
  const { orders, addToCart } = useCrave();
  const navigate = useNavigate();

  const handleReorder = (order) => {
    // Add all items from this order into cart
    order.items.forEach(item => {
      addToCart(item, order.restaurant, item.addons || [], item.specialInstructions || '', item.quantity);
    });
    navigate('/cart');
  };

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8f8f8] py-12">
        <div className="max-w-2xl mx-auto px-4">
          <EmptyState
            title="No Past Orders Yet"
            message="You haven't placed any demo orders yet. Try exploring real restaurants and placing your first simulated order!"
            actionLabel="Order Food Now"
            actionHref="/"
            icon={ShoppingBag}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f8f8] py-8 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-stone-900 tracking-tight">
            Your Order History
          </h1>
          <p className="text-xs text-stone-500">
            Past simulated orders saved in your browser localStorage
          </p>
        </div>

        <div className="space-y-4">
          {orders.map(order => (
            <div
              key={order.id}
              className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs hover:border-stone-300 transition space-y-4"
            >
              {/* Header row: Restaurant, Date, Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden bg-stone-100 flex-shrink-0">
                    <img
                      src={order.restaurant.image}
                      alt={order.restaurant.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-stone-900 font-heading">
                      {order.restaurant.name}
                    </h3>
                    <div className="text-xs text-stone-500 flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-crave-600" />
                      <span>{order.restaurant.locality}, {order.restaurant.city}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:text-right">
                  <span className="text-xs font-mono font-bold text-stone-500 bg-stone-100 px-2 py-1 rounded-lg">
                    {order.id}
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                    order.status === 'Delivered'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Items Summary */}
              <div className="text-xs text-stone-600 space-y-1">
                {order.items.map(item => (
                  <div key={item.id} className="flex justify-between">
                    <span>{item.quantity}x {item.name}</span>
                    <span className="font-semibold text-stone-900">
                      ₹{(item.price + (item.addonsTotal || 0)) * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer row: Total, Date, Actions */}
              <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 text-stone-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(order.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </span>
                  <span className="font-bold text-stone-900 text-sm">
                    Total: <strong className="text-crave-600">₹{order.grandTotal}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleReorder(order)}
                    className="px-3.5 py-2 rounded-xl bg-crave-50 text-crave-600 font-bold hover:bg-crave-100 transition flex items-center gap-1.5"
                  >
                    <Repeat className="w-3.5 h-3.5" />
                    <span>Reorder</span>
                  </button>
                  <Link
                    to={`/order-tracking/${order.id}`}
                    className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-black text-white font-bold transition flex items-center gap-1.5"
                  >
                    <span>Track Status</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
