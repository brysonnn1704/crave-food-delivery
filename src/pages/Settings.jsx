import React, { useState } from 'react';
import {
  Database,
  ShieldCheck,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Trash2,
  Info,
  Server,
  FileJson
} from 'lucide-react';
import dataSources from '../data/data-sources.json';
import { useCrave } from '../context/CraveContext';

export default function Settings() {
  const { restaurants, menus, clearCart } = useCrave();
  const [resetMessage, setResetMessage] = useState('');

  const handleResetLocalStorage = () => {
    localStorage.removeItem('crave_cart_items');
    localStorage.removeItem('crave_cart_restaurant');
    localStorage.removeItem('crave_orders');
    localStorage.removeItem('crave_favourites');
    localStorage.removeItem('crave_addresses');
    clearCart();
    setResetMessage('All local demo caches (cart, favourites, orders) have been reset.');
    setTimeout(() => setResetMessage(''), 3000);
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8] py-8 pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black font-heading text-stone-900 tracking-tight">
              About Data &amp; Application Transparency
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Documentation of data provenance, open licenses, and ingestion methodology
          </p>
        </div>

        {/* Ingestion Overview Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-heading text-stone-900">
                Ethical Data Collection &amp; Ingestion Pipeline
              </h2>
              <p className="text-xs text-stone-500">
                Permitted automated collection strictly respecting terms of use
              </p>
            </div>
          </div>

          <p className="text-xs text-stone-600 leading-relaxed">
            In compliance with ethical web standards and the Crave specification, this application does <strong>not</strong> scrape closed commercial portals (such as Swiggy or Zomato) whose Terms of Service forbid automated access. Instead, all restaurant nodes and geographic points of interest are sourced from the authorized public <strong>Overpass API</strong> of <strong>OpenStreetMap</strong> under the <strong>Open Database License (ODbL) 1.0</strong>, paired with culinary recipes from the open <strong>Indian Food 101</strong> dataset (CC0 1.0 Universal).
          </p>

          {/* Dataset Statistics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-center">
              <span className="text-2xl font-black font-heading text-crave-600 block">
                {restaurants.length}
              </span>
              <span className="text-xs font-semibold text-stone-600">OSM Restaurants</span>
            </div>
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-center">
              <span className="text-2xl font-black font-heading text-stone-900 block">
                {menus.length}
              </span>
              <span className="text-xs font-semibold text-stone-600">Dishes &amp; Items</span>
            </div>
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-center">
              <span className="text-2xl font-black font-heading text-emerald-600 block">
                0
              </span>
              <span className="text-xs font-semibold text-stone-600">Schema Errors</span>
            </div>
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-center">
              <span className="text-2xl font-black font-heading text-amber-600 block">
                3
              </span>
              <span className="text-xs font-semibold text-stone-600">Metro Clusters</span>
            </div>
          </div>
        </div>

        {/* Registered Data Sources */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-stone-900 uppercase tracking-wider flex items-center gap-2">
            <Server className="w-4 h-4 text-crave-600" />
            <span>Registered &amp; Verified Data Sources</span>
          </h3>

          <div className="space-y-4">
            {dataSources.map(source => (
              <div
                key={source.id}
                className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-base text-stone-900 font-heading">
                        {source.name}
                      </h4>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                        {source.permissionStatus}
                      </span>
                    </div>
                    <span className="text-xs text-stone-400 font-mono">
                      {source.homepage || source.sourceUrl}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-stone-600 bg-stone-100 px-3 py-1 rounded-xl self-start sm:self-auto">
                    License: <strong className="text-stone-900">{source.license}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Left: Fields obtained */}
                  <div className="space-y-2">
                    <span className="font-bold text-stone-900 block uppercase tracking-wider text-[11px]">
                      Fields Obtained from Source:
                    </span>
                    <ul className="space-y-1 text-stone-600 list-disc list-inside">
                      {source.fieldsProvided?.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Right: Known limitations & Missing fields */}
                  <div className="space-y-2">
                    <span className="font-bold text-stone-900 block uppercase tracking-wider text-[11px]">
                      Known Limitations &amp; Simulated Values:
                    </span>
                    <ul className="space-y-1 text-stone-600 list-disc list-inside">
                      {source.fieldsMissing?.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-stone-500">
                  <div>
                    <strong>Attribution:</strong> {source.attribution}
                  </div>
                  {source.sourceUrl && (
                    <a
                      href={source.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-crave-600 hover:text-crave-700 font-bold flex items-center gap-1"
                    >
                      <span>Direct Dataset Source</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Local Storage & Cache Management */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-stone-900 uppercase tracking-wider flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-rose-600" />
            <span>Local State &amp; Cache Storage</span>
          </h3>

          <p className="text-xs text-stone-500 leading-relaxed">
            All user preferences, active cart items, simulated order histories, and saved delivery addresses are stored in browser localStorage. You can clear this storage at any time to reset the application state to default.
          </p>

          <div className="pt-2">
            <button
              onClick={handleResetLocalStorage}
              className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-rose-50 text-stone-700 hover:text-rose-700 text-xs font-bold transition flex items-center gap-2"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset All Local Storage Demo Data</span>
            </button>
          </div>

          {resetMessage && (
            <p className="text-xs text-emerald-600 font-bold">{resetMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
}
