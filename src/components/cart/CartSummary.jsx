import React, { useState } from 'react';
import { Tag, Check, X, Info, Trash2, ArrowRight, ShieldCheck, Bike } from 'lucide-react';
import { useCrave } from '../../context/CraveContext';
import { DEMO_COUPONS } from '../../data/coupons';

export default function CartSummary({ onProceedToCheckout, isCheckout = false }) {
  const {
    cartItems,
    cartRestaurant,
    cartSubtotal,
    deliveryFee,
    gstAmount,
    grandTotal,
    appliedCoupon,
    discountAmount,
    couponError,
    applyCoupon,
    removeCoupon,
    clearCart
  } = useCrave();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponFeedback, setCouponFeedback] = useState(null);

  const handleApply = (codeToApply) => {
    const code = (codeToApply || inputCoupon).trim();
    if (!code) return;
    const res = applyCoupon(code);
    if (res.success) {
      setCouponFeedback({ type: 'success', message: res.message });
      setInputCoupon('');
    } else {
      setCouponFeedback({ type: 'error', message: res.message });
    }
  };

  const handleRemove = () => {
    removeCoupon();
    setCouponFeedback(null);
  };

  // Progress to free delivery (₹500 threshold)
  const amountForFreeDel = Math.max(0, 500 - cartSubtotal);

  return (
    <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-6">
      {/* Free Delivery Bar */}
      {cartSubtotal < 500 && deliveryFee > 0 && (
        <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200/70 text-xs text-amber-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bike className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>
              Add items worth <strong>₹{amountForFreeDel}</strong> more for <strong>FREE Delivery</strong>!
            </span>
          </div>
        </div>
      )}

      {cartSubtotal >= 500 && (
        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <Bike className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Congratulations! Your order qualifies for <strong>FREE Delivery</strong>.</span>
        </div>
      )}

      {/* Coupon Application Box */}
      {!isCheckout && (
        <div className="space-y-3">
          <label className="flex items-center gap-1.5 text-xs font-bold text-stone-700">
            <Tag className="w-4 h-4 text-crave-600" />
            <span>Apply Coupon Voucher</span>
          </label>

          {appliedCoupon ? (
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
              <div>
                <span className="font-extrabold text-emerald-800 tracking-wider">
                  {appliedCoupon.code}
                </span>
                <span className="block text-[11px] text-emerald-600">
                  Savings of ₹{discountAmount} applied!
                </span>
              </div>
              <button
                onClick={handleRemove}
                className="text-stone-400 hover:text-stone-700 font-bold p-1 rounded-md"
                title="Remove coupon"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter code (e.g. WELCOME50)"
                  value={inputCoupon}
                  onChange={(e) => setInputCoupon(e.target.value.toUpperCase())}
                  className="flex-1 px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-crave-500 bg-stone-50 focus:bg-white"
                />
                <button
                  onClick={() => handleApply()}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition shadow-xs"
                >
                  Apply
                </button>
              </div>

              {/* Quick Coupon Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {DEMO_COUPONS.map(c => (
                  <button
                    key={c.code}
                    onClick={() => handleApply(c.code)}
                    className="text-[10px] font-bold px-2 py-1 rounded-lg border border-dashed border-crave-300 bg-crave-50/50 text-crave-700 hover:bg-crave-100 transition"
                  >
                    {c.code} (Save {c.discountType === 'percentage' ? `${c.discountValue}%` : `₹${c.discountValue}`})
                  </button>
                ))}
              </div>
            </div>
          )}

          {couponFeedback && (
            <p className={`text-xs ${couponFeedback.type === 'success' ? 'text-emerald-600 font-bold' : 'text-rose-600'}`}>
              {couponFeedback.message}
            </p>
          )}
          {couponError && !couponFeedback && (
            <p className="text-xs text-rose-600">{couponError}</p>
          )}
        </div>
      )}

      {/* Bill Breakdown */}
      <div className="space-y-2.5 pt-4 border-t border-stone-100 text-xs">
        <h4 className="font-bold text-stone-900 text-sm font-heading mb-2">
          Bill Details
        </h4>

        {/* Item Total */}
        <div className="flex justify-between text-stone-600">
          <span>Item Total</span>
          <span className="font-semibold text-stone-900">₹{cartSubtotal}</span>
        </div>

        {/* Discount */}
        {discountAmount > 0 && (
          <div className="flex justify-between text-emerald-600 font-bold">
            <span>Coupon Discount ({appliedCoupon?.code})</span>
            <span>-₹{discountAmount}</span>
          </div>
        )}

        {/* Delivery Fee */}
        <div className="flex justify-between text-stone-600">
          <span className="flex items-center gap-1">
            <span>Delivery Fee</span>
            <span className="text-[10px] text-stone-400" title="Simulated standard delivery charge">(Demo)</span>
          </span>
          <span className="font-semibold text-stone-900">
            {deliveryFee === 0 ? (
              <span className="text-emerald-600 font-bold">FREE</span>
            ) : (
              `₹${deliveryFee}`
            )}
          </span>
        </div>

        {/* GST */}
        <div className="flex justify-between text-stone-600">
          <span className="flex items-center gap-1">
            <span>GST &amp; Restaurant Charges (5%)</span>
            <span className="text-[10px] text-stone-400" title="Simulated standard 5% Indian GST">(Demo)</span>
          </span>
          <span className="font-semibold text-stone-900">₹{gstAmount}</span>
        </div>

        {/* Grand Total */}
        <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline text-stone-900 font-black text-base">
          <span>To Pay</span>
          <span className="text-xl font-heading text-crave-600">₹{grandTotal}</span>
        </div>
      </div>

      {/* Primary Action Button */}
      {!isCheckout && (
        <div className="space-y-2 pt-2">
          <button
            onClick={onProceedToCheckout}
            disabled={cartItems.length === 0}
            className="w-full py-3.5 px-6 rounded-2xl bg-crave-600 hover:bg-crave-700 disabled:bg-stone-300 text-white font-black text-sm shadow-lg shadow-crave-600/25 transition flex items-center justify-between active:scale-98"
          >
            <span>Proceed to Checkout</span>
            <div className="flex items-center gap-1">
              <span>₹{grandTotal}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </button>

          <button
            onClick={clearCart}
            className="w-full py-2 text-stone-400 hover:text-rose-600 text-xs font-semibold transition flex items-center justify-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Cart</span>
          </button>
        </div>
      )}
    </div>
  );
}
