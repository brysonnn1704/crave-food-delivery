import React, { useState } from 'react';
import { X, Plus, Minus, Check, Sparkles, MessageSquare } from 'lucide-react';
import DietaryBadge from '../common/DietaryBadge';
import { useCrave } from '../../context/CraveContext';

// Standard demo add-on choices matching the dish type
const DEMO_ADDON_OPTIONS = [
  { id: 'addon-1', name: 'Extra Mint Raita & Salad', price: 25, tag: 'Accompaniment' },
  { id: 'addon-2', name: 'Grated Amul Cheese Topping', price: 35, tag: 'Topping' },
  { id: 'addon-3', name: 'Spicy Garlic Chutney Dip', price: 15, tag: 'Dip' },
  { id: 'addon-4', name: 'Extra Butter / Ghee Drizzle', price: 20, tag: 'Drizzle' }
];

export default function DishModal({ item, restaurant, isOpen, onClose }) {
  const { addToCart } = useCrave();
  const [quantity, setQuantity] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [specialInstructions, setSpecialInstructions] = useState('');

  if (!isOpen || !item) return null;

  const toggleAddon = (addon) => {
    setSelectedAddons(prev => {
      const exists = prev.some(a => a.id === addon.id);
      if (exists) {
        return prev.filter(a => a.id !== addon.id);
      } else {
        return [...prev, addon];
      }
    });
  };

  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const unitPrice = item.price + addonsTotal;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    addToCart(item, restaurant, selectedAddons, specialInstructions, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-stone-200 flex flex-col max-h-[90vh]">
        {/* Header Image */}
        <div className="relative aspect-[16/9] w-full bg-stone-100 flex-shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80';
            }}
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black text-white transition shadow-md"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-3 left-4 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-lg shadow-sm flex items-center gap-1.5">
            <DietaryBadge type={item.dietaryType} size="sm" showLabel={true} />
          </div>
        </div>

        {/* Content Body (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 divide-y divide-stone-100">
          {/* Title & Price */}
          <div>
            <div className="flex items-start justify-between gap-4 mb-2">
              <h3 className="text-xl font-bold font-heading text-stone-900 leading-tight">
                {item.name}
              </h3>
              <span className="text-lg font-black text-stone-900 whitespace-nowrap">
                ₹{item.price}
              </span>
            </div>
            {item.description && (
              <p className="text-stone-600 text-sm leading-relaxed">
                {item.description}
              </p>
            )}
            <div className="mt-2 text-[11px] text-stone-400">
              From <strong className="text-stone-700">{restaurant.name}</strong> • {restaurant.locality}
            </div>
          </div>

          {/* Add-ons (Clearly labeled demo customizations) */}
          <div className="pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-stone-900">Customizations &amp; Add-ons</h4>
                <p className="text-xs text-stone-500">Optional sides to complement your dish</p>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                <Sparkles className="w-3 h-3" />
                Demo Options
              </span>
            </div>

            <div className="space-y-2">
              {DEMO_ADDON_OPTIONS.map(addon => {
                const isSelected = selectedAddons.some(a => a.id === addon.id);
                return (
                  <button
                    key={addon.id}
                    onClick={() => toggleAddon(addon)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition ${
                      isSelected
                        ? 'border-crave-500 bg-crave-50/50'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border transition ${
                          isSelected
                            ? 'bg-crave-600 border-crave-600 text-white'
                            : 'border-stone-300 bg-stone-50'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-stone-800">{addon.name}</span>
                        <span className="block text-[10px] text-stone-400">{addon.tag}</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-stone-900">+₹{addon.price}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Special Instructions Input */}
          <div className="pt-4 space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-bold text-stone-700">
              <MessageSquare className="w-3.5 h-3.5 text-crave-600" />
              <span>Special Cooking Instructions (Optional)</span>
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Make it extra spicy, less oil, or do not include plastic cutlery..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="w-full p-3 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-crave-500 bg-stone-50 focus:bg-white resize-none"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-4 flex-shrink-0">
          {/* Quantity Selector */}
          <div className="flex items-center border border-stone-300 rounded-xl bg-white p-1">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="p-1.5 text-stone-500 hover:text-stone-800 disabled:opacity-40 transition"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-bold text-sm text-stone-900">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-1.5 text-stone-500 hover:text-stone-800 transition"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="flex-1 py-3 px-6 rounded-xl bg-crave-600 hover:bg-crave-700 text-white font-bold text-sm shadow-md shadow-crave-600/20 transition flex items-center justify-between active:scale-98"
          >
            <span>Add Item</span>
            <span>₹{totalPrice}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
