import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  FileText,
  ShieldCheck,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useCrave } from '../context/CraveContext';
import AddressSelector from '../components/checkout/AddressSelector';
import PaymentMethodSelector from '../components/checkout/PaymentMethodSelector';
import CartSummary from '../components/cart/CartSummary';
import EmptyState from '../components/common/EmptyState';

export default function Checkout() {
  const {
    cartItems,
    cartRestaurant,
    addresses,
    selectedAddressId,
    placeOrder,
    grandTotal
  } = useCrave();

  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' | 'upi' | 'card'
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8f8f8] py-12">
        <div className="max-w-2xl mx-auto px-4">
          <EmptyState
            title="No Items in Cart"
            message="Your cart is empty. Please add delicious items from a restaurant before heading to checkout."
            actionLabel="Discover Restaurants"
            actionHref="/"
          />
        </div>
      </div>
    );
  }

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Form validations
    if (!selectedAddressId || addresses.length === 0) {
      setErrorMsg('Please select or add a valid delivery address.');
      return;
    }

    setSubmitting(true);

    try {
      const order = placeOrder({
        paymentMethod,
        deliveryInstructions
      });

      // Navigate to order confirmation
      navigate(`/order-confirmation/${order.id}`);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to place demo order.');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8] py-8 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            to="/cart"
            className="p-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-stone-900 transition"
            title="Return to Cart"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black font-heading text-stone-900 tracking-tight">
              Checkout &amp; Delivery
            </h1>
            <p className="text-xs text-stone-500">
              Confirm your delivery address and choose a test payment method
            </p>
          </div>
        </div>

        {/* 2 Column Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Delivery Address, Instructions & Payment */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Address Section */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
              <AddressSelector />
            </div>

            {/* 2. Delivery Instructions */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-crave-600" />
                <h3 className="text-base font-bold font-heading text-stone-900">
                  Delivery Instructions (Optional)
                </h3>
              </div>
              <input
                type="text"
                placeholder="e.g. Leave package with building security, ring doorbell twice, avoid calling..."
                value={deliveryInstructions}
                onChange={(e) => setDeliveryInstructions(e.target.value)}
                className="w-full p-3 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white text-xs focus:ring-2 focus:ring-crave-500 focus:outline-none"
              />
            </div>

            {/* 3. Payment Method */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
              <PaymentMethodSelector
                selectedMethod={paymentMethod}
                onSelectMethod={setPaymentMethod}
              />
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* Right Column: Order Review & Place Order Button */}
          <div className="lg:col-span-5 sticky top-24 space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Restaurant
                </div>
                <div className="font-bold text-sm text-stone-900">
                  {cartRestaurant?.name}
                </div>
              </div>

              {/* Items Summary */}
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between text-xs text-stone-600">
                    <span className="truncate max-w-[200px]">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="font-semibold text-stone-900">
                      ₹{(item.price + (item.addonsTotal || 0)) * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Full Bill breakdown */}
              <CartSummary isCheckout={true} />

              {/* Submit Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={submitting}
                className="w-full py-4 px-6 rounded-2xl bg-crave-600 hover:bg-crave-700 disabled:bg-stone-300 text-white font-black text-sm shadow-xl shadow-crave-600/30 transition flex items-center justify-center gap-2 active:scale-98"
              >
                <CheckCircle className="w-5 h-5" />
                <span>{submitting ? 'Placing Order...' : `Place Demo Order (₹${grandTotal})`}</span>
              </button>

              <div className="text-center text-[11px] text-stone-400">
                By placing this order you acknowledge that this is a simulated order and no real monetary transaction will take place.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
