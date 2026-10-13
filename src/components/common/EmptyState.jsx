import React from 'react';
import { Utensils, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmptyState({
  title = "No items found",
  message = "We couldn't find what you were searching for. Try adjusting your filters or location.",
  actionLabel = "Back to Restaurants",
  actionHref = "/",
  icon: Icon = Utensils
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-stone-200/80 my-6 shadow-sm">
      <div className="w-16 h-16 rounded-full bg-crave-50 flex items-center justify-center text-crave-600 mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-stone-900 mb-2 font-heading">{title}</h3>
      <p className="text-stone-500 max-w-md text-sm mb-6 leading-relaxed">{message}</p>
      {actionHref && (
        <Link
          to={actionHref}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-crave-600 text-white font-semibold hover:bg-crave-700 transition shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{actionLabel}</span>
        </Link>
      )}
    </div>
  );
}
