import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, ShieldCheck, Database, Info, Heart } from 'lucide-react';
import dataSources from '../../data/data-sources.json';

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-12 pb-16 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-crave-600 flex items-center justify-center text-white">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              <span className="text-2xl font-black font-heading text-white tracking-tight">crave</span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Authentic restaurant discovery and realistic food ordering experience powered by verified open datasets.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-800 border border-stone-700 text-[11px] text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Permitted Open Data Compliant</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3 font-heading uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li><Link to="/" className="hover:text-white transition">Restaurants & Cuisines</Link></li>
              <li><Link to="/search" className="hover:text-white transition">Search Food & Dishes</Link></li>
              <li><Link to="/offers" className="hover:text-white transition">Offers & Coupons</Link></li>
              <li><Link to="/favourites" className="hover:text-white transition">Saved Favourites</Link></li>
              <li><Link to="/profile" className="hover:text-white transition">Profile & Addresses</Link></li>
              <li><Link to="/settings" className="hover:text-white transition">Data Sources & Settings</Link></li>
            </ul>
          </div>

          {/* Popular Localities */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3 font-heading uppercase tracking-wider">Culinary Localities</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li><Link to="/search?locality=Colaba" className="hover:text-white transition">Colaba & Fort (Mumbai)</Link></li>
              <li><Link to="/search?locality=Bandra+West" className="hover:text-white transition">Bandra West & Khar (Mumbai)</Link></li>
              <li><Link to="/search?locality=Connaught+Place" className="hover:text-white transition">Connaught Place (Delhi)</Link></li>
              <li><Link to="/search?locality=Indiranagar" className="hover:text-white transition">Indiranagar (Bengaluru)</Link></li>
            </ul>
          </div>

          {/* About Data Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-sm uppercase tracking-wider">
              <Database className="w-4 h-4 text-crave-500" />
              <h4>About Data &amp; Licences</h4>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Real restaurant establishments, coordinates, and contact metadata are retrieved via the Overpass API from <strong>OpenStreetMap</strong> under the <strong>ODbL 1.0</strong> licence. Authentic dishes and recipes are sourced from the open <strong>Indian Food 101 (CC0)</strong> dataset.
            </p>
            <div className="text-[11px] text-stone-400 bg-stone-800/80 p-2.5 rounded-lg border border-stone-700/60 space-y-1">
              <div>• 75 Verified Restaurants (OSM)</div>
              <div>• 444 Authentic Menu Items</div>
              <div>• Ratings &amp; Delivery Tracking are Simulated Demos</div>
              <div>• <Link to="/settings" className="text-crave-400 underline hover:text-crave-300">View Full Provenance</Link></div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-stone-800 text-center sm:flex sm:justify-between sm:text-left text-xs text-stone-400">
          <div>
            © {new Date().getFullYear()} Crave Delivery. Open Database License (ODbL) © OpenStreetMap contributors.
          </div>
          <div className="mt-2 sm:mt-0">
            Inspired by Indian food delivery platforms (Zomato/Swiggy). Built with React &amp; Tailwind CSS.
          </div>
        </div>
      </div>
    </footer>
  );
}
