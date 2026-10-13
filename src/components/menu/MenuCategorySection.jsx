import React from 'react';
import MenuItemCard from './MenuItemCard';

export default function MenuCategorySection({ category, items, restaurant, onOpenDishModal }) {
  if (!items || items.length === 0) return null;

  return (
    <section id={`category-${category.toLowerCase().replace(/\s+/g, '-')}`} className="scroll-mt-32">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg sm:text-xl font-black font-heading text-stone-900 tracking-tight">
          {category}
        </h3>
        <span className="text-xs font-bold text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">
          {items.length}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map(item => (
          <MenuItemCard
            key={item.id}
            item={item}
            restaurant={restaurant}
            onOpenDishModal={onOpenDishModal}
          />
        ))}
      </div>
    </section>
  );
}
