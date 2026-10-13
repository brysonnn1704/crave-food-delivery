import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CraveProvider } from './context/CraveContext';
import AppLayout from './components/layout/AppLayout';

// Lazy-loaded pages for optimal bundle chunking and performance
const Home = lazy(() => import('./pages/Home'));
const Search = lazy(() => import('./pages/Search'));
const Offers = lazy(() => import('./pages/Offers'));
const RestaurantDetails = lazy(() => import('./pages/RestaurantDetails'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'));
const OrderTracking = lazy(() => import('./pages/OrderTracking'));
const OrderHistory = lazy(() => import('./pages/OrderHistory'));
const Favourites = lazy(() => import('./pages/Favourites'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-crave-200 border-t-crave-600 rounded-full animate-spin" />
        <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
          Loading Crave...
        </span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <CraveProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Home />} />
              <Route path="search" element={<Search />} />
              <Route path="offers" element={<Offers />} />
              <Route path="restaurant/:id" element={<RestaurantDetails />} />
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="order-confirmation/:orderId" element={<OrderConfirmation />} />
              <Route path="order-tracking/:orderId" element={<OrderTracking />} />
              <Route path="orders" element={<OrderHistory />} />
              <Route path="favourites" element={<Favourites />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </CraveProvider>
  );
}
