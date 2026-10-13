import React, { useState } from 'react';
import { MapPin, X, Check, Search } from 'lucide-react';
import { useCrave } from '../../context/CraveContext';

export default function LocationModal({ isOpen, onClose }) {
  const {
    selectedCity,
    setSelectedCity,
    selectedLocality,
    setSelectedLocality,
    availableLocations
  } = useCrave();

  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const cities = Object.keys(availableLocations);
  const localities = availableLocations[selectedCity] || ['All Localities'];

  const filteredLocalities = localities.filter(loc =>
    loc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectLocality = (loc) => {
    setSelectedLocality(loc);
    onClose();
  };

  const handleCityChange = (c) => {
    setSelectedCity(c);
    setSelectedLocality('All Localities');
    setSearchTerm('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-stone-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-crave-50 text-crave-600">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-lg font-heading">Choose Delivery Location</h3>
              <p className="text-xs text-stone-500">Discover real restaurants near your neighborhood</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* City selection pills */}
        <div className="px-6 pt-4 pb-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
            Select Metro City
          </label>
          <div className="flex gap-2">
            {cities.map(city => (
              <button
                key={city}
                onClick={() => handleCityChange(city)}
                className={`flex-1 py-2 px-3 rounded-xl text-sm font-semibold transition border ${
                  selectedCity === city
                    ? 'bg-crave-600 text-white border-crave-600 shadow-sm'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Locality Search */}
        <div className="px-6 py-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder={`Search localities in ${selectedCity}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-sm focus:outline-none focus:ring-2 focus:ring-crave-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Localities list */}
        <div className="px-6 py-2 max-h-64 overflow-y-auto divide-y divide-stone-100">
          {filteredLocalities.map(loc => {
            const isSelected = selectedLocality === loc;
            return (
              <button
                key={loc}
                onClick={() => handleSelectLocality(loc)}
                className="w-full flex items-center justify-between py-3 text-left hover:text-crave-600 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isSelected ? 'bg-crave-100 text-crave-600' : 'bg-stone-100 text-stone-400 group-hover:bg-crave-50 group-hover:text-crave-500'
                  }`}>
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className={`text-sm font-medium ${isSelected ? 'text-crave-600 font-bold' : 'text-stone-800'}`}>
                      {loc}
                    </span>
                    <span className="block text-xs text-stone-400">{selectedCity}</span>
                  </div>
                </div>
                {isSelected && (
                  <Check className="w-4 h-4 text-crave-600 font-bold" />
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-stone-50 border-t border-stone-100 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-stone-600 hover:text-stone-900 rounded-lg"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
