import React from 'react';
import { AlertTriangle, Trash2, ArrowLeft } from 'lucide-react';
import { useCrave } from '../../context/CraveContext';

export default function RestaurantConflictModal() {
  const {
    conflictModalOpen,
    cartRestaurant,
    pendingCartAction,
    resolveConflictReplace,
    resolveConflictCancel
  } = useCrave();

  if (!conflictModalOpen || !pendingCartAction) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-stone-200 p-6 text-center">
        <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <h3 className="text-lg font-bold font-heading text-stone-900 mb-2">
          Replace Cart Items?
        </h3>

        <p className="text-stone-600 text-xs sm:text-sm mb-6 leading-relaxed">
          Your cart contains items from{' '}
          <strong className="text-stone-900">{cartRestaurant?.name}</strong>.
          Would you like to discard the existing cart and add items from{' '}
          <strong className="text-crave-600">{pendingCartAction.restaurant?.name}</strong>{' '}
          instead?
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={resolveConflictCancel}
            className="flex-1 py-2.5 px-4 rounded-xl border border-stone-200 text-stone-700 font-bold text-xs hover:bg-stone-50 transition"
          >
            Keep Existing Cart
          </button>
          <button
            onClick={resolveConflictReplace}
            className="flex-1 py-2.5 px-4 rounded-xl bg-crave-600 hover:bg-crave-700 text-white font-bold text-xs shadow-md shadow-crave-600/20 transition flex items-center justify-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            <span>Discard &amp; Add New</span>
          </button>
        </div>
      </div>
    </div>
  );
}
