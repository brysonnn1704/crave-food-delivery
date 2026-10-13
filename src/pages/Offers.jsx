import React, { useState } from 'react';
import { Tag, Copy, Check, Sparkles, ShieldCheck, ArrowRight, Percent, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DEMO_COUPONS } from '../data/coupons';

export default function Offers() {
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopy = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8] py-8 pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-amber-600 via-rose-600 to-crave-600 rounded-3xl p-8 text-white mb-8 shadow-md">
          <div className="max-w-xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider">
              <Gift className="w-3.5 h-3.5" />
              <span>Simulated Discounts</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black font-heading tracking-tight">
              Exclusive Food Delivery Offers
            </h1>
            <p className="text-white/90 text-sm">
              Use these demo coupon codes during checkout to test discounts and price deductions on your orders.
            </p>
          </div>
        </div>

        {/* Demo Disclosure Box */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3 mb-8">
          <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold mb-0.5">Demo Coupons Disclosure:</strong>
            These offers are configurable simulation vouchers for test orders. They are not issued by the real scraped restaurants from OpenStreetMap.
          </div>
        </div>

        {/* Coupon Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {DEMO_COUPONS.map(coupon => (
            <div
              key={coupon.code}
              className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs flex flex-col justify-between hover:border-crave-300 transition group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-crave-600 bg-crave-50 px-2.5 py-1 rounded-lg">
                    {coupon.badgeText}
                  </span>
                  <span className="text-[11px] font-semibold text-stone-400">
                    Expires {coupon.expiryDate}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold font-heading text-stone-900 group-hover:text-crave-600 transition">
                    {coupon.title}
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed mt-1">
                    {coupon.description}
                  </p>
                </div>

                <div className="p-3 bg-stone-50 rounded-2xl border border-dashed border-stone-200 text-xs text-stone-600 space-y-1">
                  <div>• Minimum Order: <strong>₹{coupon.minOrderValue}</strong></div>
                  <div>• Maximum Savings: <strong>₹{coupon.maxDiscount}</strong></div>
                  <div className="text-[11px] text-stone-400">• {coupon.terms}</div>
                </div>
              </div>

              {/* Action row: Code Pill & Copy Button */}
              <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between gap-3">
                <div className="font-mono font-black text-sm text-stone-900 tracking-wider bg-stone-100 px-3 py-1.5 rounded-xl border border-stone-200">
                  {coupon.code}
                </div>

                <button
                  onClick={() => handleCopy(coupon.code)}
                  className="px-4 py-2 rounded-xl bg-crave-600 hover:bg-crave-700 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  {copiedCode === coupon.code ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-stone-900 text-white font-bold text-sm hover:bg-black transition shadow-sm"
          >
            <span>Explore Restaurants to Apply Offers</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
