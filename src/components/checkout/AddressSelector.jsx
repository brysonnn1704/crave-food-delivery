import React, { useState } from 'react';
import { MapPin, Plus, Check, Home, Briefcase, Trash2 } from 'lucide-react';
import { useCrave } from '../../context/CraveContext';
import AddressModal from './AddressModal';

export default function AddressSelector() {
  const { addresses, selectedAddressId, setSelectedAddressId, deleteAddress } = useCrave();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold font-heading text-stone-900">
            Delivery Address
          </h3>
          <p className="text-xs text-stone-500">
            Choose where your food should be delivered
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-crave-600 hover:text-crave-700 bg-crave-50 hover:bg-crave-100 px-3 py-1.5 rounded-xl transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {addresses.map(addr => {
          const isSelected = selectedAddressId === addr.id;
          return (
            <div
              key={addr.id}
              onClick={() => setSelectedAddressId(addr.id)}
              className={`p-4 rounded-2xl border transition cursor-pointer relative flex flex-col justify-between ${
                isSelected
                  ? 'border-crave-600 bg-crave-50/40 shadow-xs ring-1 ring-crave-600'
                  : 'border-stone-200 hover:border-stone-300 bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${
                      isSelected ? 'bg-crave-600 text-white' : 'bg-stone-100 text-stone-600'
                    }`}>
                      {addr.type === 'home' ? (
                        <Home className="w-3.5 h-3.5" />
                      ) : (
                        <Briefcase className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <span className="font-extrabold text-xs text-stone-900 uppercase tracking-wider">
                      {addr.label}
                    </span>
                  </div>
                  {isSelected && (
                    <span className="w-4 h-4 rounded-full bg-crave-600 text-white flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </div>

                <div className="text-xs text-stone-700 font-semibold mb-1">
                  {addr.recipientName} • {addr.phone}
                </div>

                <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                  {addr.flat}, {addr.street}, {addr.locality}, {addr.city} - {addr.pincode}
                </p>
              </div>

              {addresses.length > 1 && (
                <div className="pt-3 mt-2 border-t border-stone-100 flex justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteAddress(addr.id);
                    }}
                    className="text-stone-400 hover:text-rose-600 text-[11px] flex items-center gap-1 transition"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <AddressModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
