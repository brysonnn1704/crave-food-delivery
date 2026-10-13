import React, { useState } from 'react';
import { Plus, Minus, Trash2, Edit2, Check } from 'lucide-react';
import DietaryBadge from '../common/DietaryBadge';
import { useCrave } from '../../context/CraveContext';

export default function CartItem({ item }) {
  const { updateQuantity, removeItem, updateItemInstructions } = useCrave();
  const [editingInstructions, setEditingInstructions] = useState(false);
  const [instructionsText, setInstructionsText] = useState(item.specialInstructions || '');

  const unitPrice = item.price + (item.addonsTotal || 0);
  const itemTotal = unitPrice * item.quantity;

  const handleSaveInstructions = () => {
    updateItemInstructions(item.id, instructionsText);
    setEditingInstructions(false);
  };

  return (
    <div className="py-4 border-b border-stone-100 last:border-0">
      <div className="flex items-start justify-between gap-3">
        {/* Left: Info */}
        <div className="flex items-start gap-2.5 flex-1">
          <div className="pt-1">
            <DietaryBadge type={item.dietaryType} size="sm" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-stone-900 leading-snug">
              {item.name}
            </h4>
            <div className="text-xs font-semibold text-stone-500">
              ₹{unitPrice}
            </div>

            {/* Addons if any */}
            {item.addons && item.addons.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1">
                {item.addons.map(addon => (
                  <span
                    key={addon.id}
                    className="inline-block text-[10px] font-medium bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md"
                  >
                    +{addon.name} (₹{addon.price})
                  </span>
                ))}
              </div>
            )}

            {/* Special instructions display & editor */}
            {item.specialInstructions && !editingInstructions && (
              <div className="flex items-center gap-1.5 text-[11px] text-amber-700 bg-amber-50/80 px-2 py-1 rounded-md mt-1.5">
                <span className="italic font-medium">Note: {item.specialInstructions}</span>
                <button
                  onClick={() => setEditingInstructions(true)}
                  className="text-stone-400 hover:text-stone-700 ml-auto"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              </div>
            )}

            {!item.specialInstructions && !editingInstructions && (
              <button
                onClick={() => setEditingInstructions(true)}
                className="text-[11px] text-stone-400 hover:text-crave-600 font-medium block mt-1 transition"
              >
                + Add cooking note
              </button>
            )}

            {editingInstructions && (
              <div className="mt-2 space-y-1.5">
                <input
                  type="text"
                  placeholder="e.g. Less spicy, no cutlery"
                  value={instructionsText}
                  onChange={(e) => setInstructionsText(e.target.value)}
                  className="w-full text-xs p-1.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-crave-500"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveInstructions}
                    className="text-[10px] font-bold bg-crave-600 text-white px-2 py-0.5 rounded hover:bg-crave-700 flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={() => setEditingInstructions(false)}
                    className="text-[10px] font-medium text-stone-500 hover:text-stone-800"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Quantity Controls & Subtotal */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50 p-0.5">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="p-1 text-stone-600 hover:text-crave-600 rounded hover:bg-white transition"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-6 text-center text-xs font-bold text-stone-900">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="p-1 text-stone-600 hover:text-crave-600 rounded hover:bg-white transition"
              aria-label="Increase quantity"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <div className="text-xs font-black text-stone-900">
            ₹{itemTotal}
          </div>
        </div>
      </div>
    </div>
  );
}
