import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  MapPin,
  Heart,
  ShoppingBag,
  Settings,
  ShieldCheck,
  Check,
  Sparkles,
  Phone,
  Mail,
  Sliders
} from 'lucide-react';
import { useCrave } from '../context/CraveContext';
import AddressSelector from '../components/checkout/AddressSelector';
import DietaryBadge from '../components/common/DietaryBadge';

export default function Profile() {
  const {
    selectedCity,
    setSelectedCity,
    selectedLocality,
    setSelectedLocality,
    availableLocations,
    vegOnly,
    setVegOnly,
    orders,
    favourites,
    addresses
  } = useCrave();

  const [userName, setUserName] = useState('Aarav Sharma');
  const [userEmail, setUserEmail] = useState('aarav.sharma@example.in');
  const [userPhone, setUserPhone] = useState('+91 98201 54321');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8] py-8 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Profile Card Header */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <div className="w-20 h-20 rounded-full bg-crave-600 text-white flex items-center justify-center font-black text-2xl font-heading shadow-md shadow-crave-600/20">
            AS
          </div>
          <div className="space-y-1 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-2xl font-black font-heading text-stone-900">
                  {userName}
                </h1>
                <p className="text-xs text-stone-500">
                  {userEmail} • {userPhone}
                </p>
              </div>
              <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 self-center sm:self-auto">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Demo Guest Profile</span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center justify-center sm:justify-start gap-6 pt-4 text-xs">
              <Link to="/orders" className="hover:text-crave-600 transition">
                <strong className="text-stone-900 font-bold block text-sm">{orders.length}</strong>
                <span className="text-stone-400">Past Orders</span>
              </Link>
              <Link to="/favourites" className="hover:text-crave-600 transition">
                <strong className="text-stone-900 font-bold block text-sm">{favourites.length}</strong>
                <span className="text-stone-400">Favourites</span>
              </Link>
              <div>
                <strong className="text-stone-900 font-bold block text-sm">{addresses.length}</strong>
                <span className="text-stone-400">Addresses</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dietary Preferences Section */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-stone-900 uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-crave-600" />
            <span>Dining Preferences</span>
          </h3>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-stone-50 border border-stone-200">
            <div className="flex items-center gap-3">
              <DietaryBadge type="veg" size="md" />
              <div>
                <div className="font-bold text-sm text-stone-900">Vegetarian Preference Only</div>
                <div className="text-xs text-stone-500">Only surface pure-veg restaurants and vegetarian dishes</div>
              </div>
            </div>
            <button
              onClick={() => setVegOnly(!vegOnly)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-300 ${
                vegOnly ? 'bg-emerald-600' : 'bg-stone-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition duration-300 ${
                  vegOnly ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Address Management Section */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
          <AddressSelector />
        </div>

        {/* Links to Order History & Settings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/orders"
            className="p-5 rounded-3xl bg-white border border-stone-200 hover:border-crave-300 shadow-xs transition flex items-center gap-4 group"
          >
            <div className="p-3 rounded-2xl bg-crave-50 text-crave-600 group-hover:scale-105 transition">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-stone-900 group-hover:text-crave-600 transition">
                Order History &amp; Reordering
              </h4>
              <p className="text-xs text-stone-500">
                View previous test orders and one-click reorder
              </p>
            </div>
          </Link>

          <Link
            to="/settings"
            className="p-5 rounded-3xl bg-white border border-stone-200 hover:border-crave-300 shadow-xs transition flex items-center gap-4 group"
          >
            <div className="p-3 rounded-2xl bg-stone-100 text-stone-700 group-hover:scale-105 transition">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-stone-900 group-hover:text-crave-600 transition">
                Data Sources &amp; Transparency
              </h4>
              <p className="text-xs text-stone-500">
                Inspect OpenStreetMap licences and dataset verification
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
