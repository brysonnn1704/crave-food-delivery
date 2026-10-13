import React from 'react';
import { Plus, Minus } from 'lucide-react';
import DietaryBadge from '../common/DietaryBadge';
import { useCrave } from '../../context/CraveContext';

export default function MenuItemCard({ item, restaurant, onOpenDishModal }) {
  const { cartItems, addToCart, updateQuantity } = useCrave();

  // Check if item is already in cart
  const cartItem = cartItems.find(ci => ci.id === item.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAddClick = (e) => {
    e.stopPropagation();
    if (onOpenDishModal) {
      onOpenDishModal(item);
    } else {
      addToCart(item, restaurant, [], '', 1);
    }
  };

  const handleMinus = (e) => {
    e.stopPropagation();
    if (cartItem) {
      updateQuantity(cartItem.id, quantity - 1);
    }
  };

  const handlePlus = (e) => {
    e.stopPropagation();
    if (cartItem) {
      updateQuantity(cartItem.id, quantity + 1);
    }
  };

  return (
    <div
      onClick={() => onOpenDishModal && onOpenDishModal(item)}
      className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-white border border-stone-200/80 hover:border-stone-300 hover:shadow-sm transition cursor-pointer group"
    >
      {/* Left: Info */}
      <div className="flex-1 space-y-1.5">
        <div className="flex items-center gap-2">
          <DietaryBadge type={item.dietaryType} size="sm" showLabel={false} />
          {item.category && (
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
              {item.category}
            </span>
          )}
        </div>

        <h4 className="font-bold text-stone-900 text-base font-heading group-hover:text-crave-600 transition leading-snug">
          {item.name}
        </h4>

        <div className="font-extrabold text-stone-900 text-sm">
          ₹{item.price}
        </div>

        {item.description && (
          <p className="text-stone-500 text-xs line-clamp-2 leading-relaxed pt-1">
            {item.description}
          </p>
        )}
      </div>

      {/* Right: Image and Add Button */}
      <div className="relative flex-shrink-0 w-28 h-28 sm:w-32 sm:h-32">
        <div className="w-full h-full rounded-2xl overflow-hidden bg-stone-100">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80';
            }}
          />
        </div>

        {/* Add / Counter Button positioned bottom-center */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 shadow-md rounded-xl overflow-hidden border border-stone-200">
          {quantity > 0 ? (
            <div className="flex items-center justify-between bg-crave-600 text-white font-extrabold text-xs h-8 px-2">
              <button
                onClick={handleMinus}
                className="p-1 hover:bg-crave-700 rounded transition"
                title="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span>{quantity}</span>
              <button
                onClick={handlePlus}
                className="p-1 hover:bg-crave-700 rounded transition"
                title="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddClick}
              className="w-full bg-white hover:bg-crave-50 text-crave-600 font-extrabold text-xs h-8 flex items-center justify-center gap-1 transition uppercase tracking-wider"
            >
              <span>ADD</span>
              <Plus className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
