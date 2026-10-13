import React, { useState } from 'react';
import { Banknote, QrCode, CreditCard, ShieldCheck, Check, Sparkles } from 'lucide-react';

export default function PaymentMethodSelector({ selectedMethod, onSelectMethod }) {
  const [upiId, setUpiId] = useState('demo.user@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold font-heading text-stone-900">
            Payment Method
          </h3>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            100% Simulated Demo
          </span>
        </div>
        <p className="text-xs text-stone-500">
          Safe sandbox payment test — no real payment credentials required
        </p>
      </div>

      <div className="space-y-3">
        {/* Cash on Delivery */}
        <div
          onClick={() => onSelectMethod('cod')}
          className={`p-4 rounded-2xl border transition cursor-pointer flex items-start justify-between ${
            selectedMethod === 'cod'
              ? 'border-crave-600 bg-crave-50/40 ring-1 ring-crave-600'
              : 'border-stone-200 hover:border-stone-300 bg-white'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-xl ${
              selectedMethod === 'cod' ? 'bg-crave-600 text-white' : 'bg-stone-100 text-stone-600'
            }`}>
              <Banknote className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-stone-900">Cash on Delivery (COD)</div>
              <p className="text-xs text-stone-500">Pay cash or scan courier QR on arrival</p>
            </div>
          </div>
          {selectedMethod === 'cod' && (
            <span className="w-4 h-4 rounded-full bg-crave-600 text-white flex items-center justify-center">
              <Check className="w-3 h-3 stroke-[3]" />
            </span>
          )}
        </div>

        {/* UPI Demo */}
        <div
          onClick={() => onSelectMethod('upi')}
          className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col gap-2 ${
            selectedMethod === 'upi'
              ? 'border-crave-600 bg-crave-50/40 ring-1 ring-crave-600'
              : 'border-stone-200 hover:border-stone-300 bg-white'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-xl ${
                selectedMethod === 'upi' ? 'bg-crave-600 text-white' : 'bg-stone-100 text-stone-600'
              }`}>
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-stone-900">UPI Instant Demo</div>
                <p className="text-xs text-stone-500">Simulate Google Pay, PhonePe, Paytm</p>
              </div>
            </div>
            {selectedMethod === 'upi' && (
              <span className="w-4 h-4 rounded-full bg-crave-600 text-white flex items-center justify-center">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
            )}
          </div>
          {selectedMethod === 'upi' && (
            <div className="pt-2 pl-11 text-xs">
              <span className="text-stone-500 block mb-1">Simulated VPA Address:</span>
              <div className="p-2 bg-white rounded-lg border border-stone-200 font-mono text-stone-800 text-xs">
                {upiId}
              </div>
            </div>
          )}
        </div>

        {/* Card Demo */}
        <div
          onClick={() => onSelectMethod('card')}
          className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col gap-2 ${
            selectedMethod === 'card'
              ? 'border-crave-600 bg-crave-50/40 ring-1 ring-crave-600'
              : 'border-stone-200 hover:border-stone-300 bg-white'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-xl ${
                selectedMethod === 'card' ? 'bg-crave-600 text-white' : 'bg-stone-100 text-stone-600'
              }`}>
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-stone-900">Credit / Debit Card Demo</div>
                <p className="text-xs text-stone-500">Simulated test card authorization</p>
              </div>
            </div>
            {selectedMethod === 'card' && (
              <span className="w-4 h-4 rounded-full bg-crave-600 text-white flex items-center justify-center">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
            )}
          </div>
          {selectedMethod === 'card' && (
            <div className="pt-2 pl-11 text-xs">
              <span className="text-stone-500 block mb-1">Simulated Test Card:</span>
              <div className="p-2 bg-white rounded-lg border border-stone-200 font-mono text-stone-800 text-xs flex justify-between">
                <span>{cardNumber}</span>
                <span className="text-stone-400">EXP 12/28</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 flex items-center gap-2 text-stone-500 text-xs">
        <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
        <span>No genuine bank details or UPI PINs are ever requested or stored.</span>
      </div>
    </div>
  );
}
