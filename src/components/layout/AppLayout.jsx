import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import MobileBottomNav from './MobileBottomNav';
import RestaurantConflictModal from '../cart/RestaurantConflictModal';

export default function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f8f8f8] text-stone-900 font-sans selection:bg-crave-100 selection:text-crave-700">
      {/* Top Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Global Restaurant Conflict Warning Modal */}
      <RestaurantConflictModal />

      {/* Bottom Footer */}
      <Footer />

      {/* Mobile Sticky Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}
