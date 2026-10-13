import React from 'react';
import { ShieldCheck, ExternalLink } from 'lucide-react';

export default function DataTransparencyBadge({ sourceUrl, license = 'ODbL 1.0', compact = false }) {
  if (compact) {
    return (
      <a
        href={sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-500 hover:text-stone-800 bg-stone-100 hover:bg-stone-200 px-2 py-0.5 rounded transition"
        title="Verified real establishment on OpenStreetMap (ODbL 1.0)"
        onClick={(e) => e.stopPropagation()}
      >
        <ShieldCheck className="w-3 h-3 text-emerald-600" />
        <span>OSM Verified</span>
      </a>
    );
  }

  return (
    <div className="flex items-center justify-between p-2.5 rounded-lg bg-stone-50 border border-stone-200 text-xs text-stone-600">
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
        <span>
          Real record sourced from <strong>OpenStreetMap</strong> under <strong>{license}</strong>.
        </span>
      </div>
      {sourceUrl && (
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-crave-600 hover:text-crave-700 font-semibold transition flex-shrink-0 ml-2"
        >
          <span>View Source</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      )}
    </div>
  );
}
