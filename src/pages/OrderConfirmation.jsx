import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Bike,
  ShieldCheck,
  ArrowRight,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { useCrave } from '../context/CraveContext';
import EmptyState from '../components/common/EmptyState';

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const { orders } = useCrave();

  const order = orders.find(o => o.id === orderId);

  if (!order) {
    return (
      <div className="min-h-screen bg-[#f8f8f8] py-12">
        <div className="max-w-2xl mx-auto px-4">
          <EmptyState
            title="Order Not Found"
            message={`We couldn't find order ${orderId} in your local order history.`}
            actionLabel="View All Orders"
            actionHref="/orders"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f8f8] py-10 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Success Card */}
        <div className="bg-white rounded-3xl p-8 border border-stone-200/80 shadow-md text-center space-y-6">
          {/* Animated checkmark */}
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce-once">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-600">
              Order Confirmed (Simulated)
            </span>
            <h1 className="text-3xl sm:text-4xl font-black font-heading text-stone-900 tracking-tight">
              Thank You for Ordering!
            </h1>
            <p className="text-sm text-stone-500 max-w-md mx-auto">
              Your test order from <strong className="text-stone-900">{order.restaurant.name}</strong> has been saved.
            </p>
          </div>

          {/* Transparent Simulation Notice */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 text-left flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold mb-0.5">Demo Simulation Notice:</strong>
              This is an educational demo order. No live dispatch has occurred and no payment was collected.
            </div>
          </div>

          {/* Order Snapshot Box */}
          <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 text-left space-y-3">
            <div className="flex justify-between items-center text-xs pb-3 border-b border-stone-200">
              <span className="text-stone-500">Demo Order ID:</span>
              <span className="font-mono font-bold text-stone-900 text-sm">{order.id}</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-stone-500">Restaurant:</span>
              <span className="font-bold text-stone-900">{order.restaurant.name} ({order.restaurant.locality})</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-stone-500">Delivering To:</span>
              <span className="font-medium text-stone-800 text-right truncate max-w-[240px]">
                {order.deliveryAddress.flat}, {order.deliveryAddress.locality}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-stone-500">Payment Method:</span>
              <span className="font-bold uppercase text-stone-900">{order.paymentMethod} (Demo)</span>
            </div>

            <div className="flex justify-between items-center text-xs pt-2 border-t border-stone-200 font-bold">
              <span className="text-stone-700">Total Amount:</span>
              <span className="text-base text-crave-600 font-black">₹{order.grandTotal}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              to={`/order-tracking/${order.id}`}
              className="flex-1 py-3.5 px-6 rounded-2xl bg-crave-600 hover:bg-crave-700 text-white font-bold text-sm shadow-md shadow-crave-600/20 transition flex items-center justify-center gap-2"
            >
              <Bike className="w-4 h-4" />
              <span>Track Simulated Delivery</span>
            </Link>

            <Link
              to="/orders"
              className="flex-1 py-3.5 px-6 rounded-2xl border border-stone-200 text-stone-700 font-bold text-sm hover:bg-stone-50 transition flex items-center justify-center gap-2"
            >
              <span>View Order History</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
