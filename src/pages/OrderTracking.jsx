import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Bike,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
  Play,
  ArrowLeft,
  UtensilsCrossed,
  PhoneCall,
  ShoppingBag
} from 'lucide-react';
import { useCrave } from '../context/CraveContext';
import EmptyState from '../components/common/EmptyState';

const STAGE_DESCRIPTIONS = {
  "Order Placed": "Your demo order has been received by our system.",
  "Preparing Food": "The kitchen is actively preparing your fresh dishes.",
  "Ready for Pickup": "Dishes are packed and awaiting courier pickup.",
  "Out for Delivery": "Rider is en route to your doorstep.",
  "Delivered": "Order completed! Enjoy your meal."
};

export default function OrderTracking() {
  const { orderId } = useParams();
  const { orders, advanceOrderStatus } = useCrave();

  const order = orders.find(o => o.id === orderId);

  if (!order) {
    return (
      <div className="min-h-screen bg-[#f8f8f8] py-12">
        <div className="max-w-2xl mx-auto px-4">
          <EmptyState
            title="Order Not Found"
            message={`Order ${orderId} does not exist in local storage.`}
            actionLabel="Return to Orders"
            actionHref="/orders"
          />
        </div>
      </div>
    );
  }

  const isDelivered = order.status === "Delivered";

  return (
    <div className="min-h-screen bg-[#f8f8f8] py-8 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link
              to="/orders"
              className="p-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-stone-900 transition"
              title="Order History"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black font-heading text-stone-900 tracking-tight">
                  Simulated Order Tracking
                </h1>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  Demo
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Order ID: <span className="font-mono font-bold text-stone-800">{order.id}</span> • Placed {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Timeline & Simulator Controls */}
          <div className="lg:col-span-7 space-y-6">
            {/* Active Status Card */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-crave-600">
                    Current Stage
                  </span>
                  <h2 className="text-2xl font-black font-heading text-stone-900">
                    {order.status}
                  </h2>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-crave-50 text-crave-600 flex items-center justify-center">
                  <Bike className="w-6 h-6" />
                </div>
              </div>

              <p className="text-xs text-stone-600">
                {STAGE_DESCRIPTIONS[order.status] || "Simulated order in progress."}
              </p>

              {/* Demo Stage Advance Button */}
              {!isDelivered ? (
                <div className="pt-2">
                  <button
                    onClick={() => advanceOrderStatus(order.id)}
                    className="w-full py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-sm"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Advance to Next Stage (Simulator)</span>
                  </button>
                  <span className="block text-[10px] text-stone-400 text-center mt-1">
                    Click to simulate rider movement and cooking progression
                  </span>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold text-center border border-emerald-200">
                  ✓ Order successfully delivered to {order.deliveryAddress.locality}!
                </div>
              )}
            </div>

            {/* Timeline Stages */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-6">
              <h3 className="font-bold text-sm text-stone-900 uppercase tracking-wider">
                Order Timeline (Simulated)
              </h3>

              <div className="space-y-6 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200 pl-2">
                {order.timeline.map((step, idx) => (
                  <div key={step.stage} className="flex items-start gap-4 relative">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center z-10 text-[10px] font-bold ${
                        step.completed
                          ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                          : 'bg-stone-200 text-stone-400'
                      }`}
                    >
                      {step.completed ? '✓' : idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-sm font-bold ${
                            step.completed ? 'text-stone-900' : 'text-stone-400'
                          }`}
                        >
                          {step.stage}
                        </span>
                        {step.time && (
                          <span className="text-[11px] font-mono text-stone-500">
                            {step.time}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        {STAGE_DESCRIPTIONS[step.stage]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Transparency Note */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-600 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Simulation Disclaimer:</strong> Live GPS tracking and restaurant kitchen dispatch are demonstration mockups. No real driver is on the road.
              </div>
            </div>
          </div>

          {/* Right Column: Order Items & Delivery Address */}
          <div className="lg:col-span-5 space-y-6">
            {/* Delivery Details */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-stone-900 uppercase tracking-wider">
                Delivery Details
              </h3>

              <div className="space-y-3 text-xs text-stone-600">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-crave-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-stone-900 block">
                      {order.deliveryAddress.label} ({order.deliveryAddress.recipientName})
                    </span>
                    <span>
                      {order.deliveryAddress.flat}, {order.deliveryAddress.street}, {order.deliveryAddress.locality}, {order.deliveryAddress.city} - {order.deliveryAddress.pincode}
                    </span>
                  </div>
                </div>

                {order.deliveryInstructions && (
                  <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-100 text-[11px] text-amber-900">
                    <strong>Instructions:</strong> {order.deliveryInstructions}
                  </div>
                )}
              </div>
            </div>

            {/* Items Summary */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <span className="font-bold text-stone-900 text-sm">
                  {order.restaurant.name}
                </span>
                <span className="text-xs text-stone-400">
                  {order.items.length} items
                </span>
              </div>

              <div className="divide-y divide-stone-100">
                {order.items.map(item => (
                  <div key={item.id} className="py-2.5 flex justify-between text-xs">
                    <div>
                      <span className="font-bold text-stone-900">{item.quantity}x</span>{' '}
                      <span className="text-stone-700">{item.name}</span>
                      {item.addons && item.addons.length > 0 && (
                        <span className="block text-[10px] text-stone-400">
                          +{item.addons.map(a => a.name).join(', ')}
                        </span>
                      )}
                    </div>
                    <span className="font-semibold text-stone-900">
                      ₹{(item.price + (item.addonsTotal || 0)) * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-stone-200 space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-500">
                  <span>Subtotal</span>
                  <span>₹{order.subtotal}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount</span>
                    <span>-₹{order.discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-500">
                  <span>Delivery &amp; Taxes</span>
                  <span>₹{order.deliveryFee + order.gstAmount}</span>
                </div>
                <div className="flex justify-between font-black text-stone-900 text-sm pt-2 border-t border-stone-100">
                  <span>Paid Total</span>
                  <span className="text-crave-600">₹{order.grandTotal}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
