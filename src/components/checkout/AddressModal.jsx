import React, { useState } from 'react';
import { X, MapPin, Home, Briefcase, Plus, Check } from 'lucide-react';
import { useCrave } from '../../context/CraveContext';

export default function AddressModal({ isOpen, onClose }) {
  const { addAddress, selectedCity, selectedLocality } = useCrave();

  const [formData, setFormData] = useState({
    label: 'Home',
    type: 'home',
    recipientName: 'Aarav Sharma',
    phone: '+91 98201 54321',
    flat: '',
    street: '',
    locality: selectedLocality !== 'All Localities' ? selectedLocality : 'Bandra West',
    city: selectedCity,
    pincode: '400050',
    isDefault: false
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.flat.trim()) newErrors.flat = 'House / Flat number is required';
    if (!formData.street.trim()) newErrors.street = 'Street or landmark is required';
    if (!formData.recipientName.trim()) newErrors.recipientName = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    addAddress(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-stone-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-crave-50 text-crave-600">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-lg font-heading">Add Delivery Address</h3>
              <p className="text-xs text-stone-500">Save address for faster checkout</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Address Tag Selector */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">Save as</label>
            <div className="flex gap-2">
              {['Home', 'Work', 'Other'].map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ ...formData, label: type, type: type.toLowerCase() })}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition border ${
                    formData.label === type
                      ? 'bg-crave-600 text-white border-crave-600 shadow-sm'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Recipient Details */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.recipientName}
                onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-crave-500 focus:outline-none"
              />
              {errors.recipientName && <span className="text-[10px] text-rose-500">{errors.recipientName}</span>}
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-crave-500 focus:outline-none"
              />
              {errors.phone && <span className="text-[10px] text-rose-500">{errors.phone}</span>}
            </div>
          </div>

          {/* House / Flat */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Flat / Building / Apartment</label>
            <input
              type="text"
              placeholder="e.g. Flat 301, Sunshine Heights"
              value={formData.flat}
              onChange={(e) => setFormData({ ...formData, flat: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-crave-500 focus:outline-none"
            />
            {errors.flat && <span className="text-[10px] text-rose-500">{errors.flat}</span>}
          </div>

          {/* Street / Landmark */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Street / Area / Landmark</label>
            <input
              type="text"
              placeholder="e.g. Near St. Andrews Church, Hill Road"
              value={formData.street}
              onChange={(e) => setFormData({ ...formData, street: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-crave-500 focus:outline-none"
            />
            {errors.street && <span className="text-[10px] text-rose-500">{errors.street}</span>}
          </div>

          {/* Locality, City, Pin */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-stone-700 mb-1">Locality</label>
              <input
                type="text"
                value={formData.locality}
                onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-crave-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-stone-700 mb-1">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-crave-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-stone-700 mb-1">Pincode</label>
              <input
                type="text"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-crave-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-crave-600 hover:bg-crave-700 text-white font-bold text-xs shadow-md shadow-crave-600/20 transition active:scale-98"
            >
              Save Address
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
