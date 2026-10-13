import React from 'react';
import { NavLink } from 'react-router-dom';
import { Utensils, Search, Tag, Heart, ShoppingBag, User } from 'lucide-react';
import { useCrave } from '../../context/CraveContext';

export default function MobileBottomNav() {
  const { cartItemCount, favourites } = useCrave();

  const navItems = [
    { to: '/', label: 'Delivery', icon: Utensils },
    { to: '/search', label: 'Search', icon: Search },
    { to: '/offers', label: 'Offers', icon: Tag },
    { to: '/favourites', label: 'Saved', icon: Heart, badge: favourites.length },
    { to: '/cart', label: 'Cart', icon: ShoppingBag, badge: cartItemCount },
    { to: '/profile', label: 'Profile', icon: User }
  ];

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-stone-200 py-2 px-3 shadow-lg">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-bold transition relative ${
                  isActive ? 'text-crave-600' : 'text-stone-500 hover:text-stone-900'
                }`
              }
            >
              <div className="relative mb-0.5">
                <Icon className="w-5 h-5" />
                {item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 bg-crave-600 text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
