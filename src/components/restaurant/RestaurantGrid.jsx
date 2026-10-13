import React from 'react';
import RestaurantCard from './RestaurantCard';
import EmptyState from '../common/EmptyState';

export default function RestaurantGrid({ restaurants = [], emptyMessage = "No restaurants match your filters." }) {
  if (!restaurants || restaurants.length === 0) {
    return (
      <EmptyState
        title="No Restaurants Found"
        message={emptyMessage}
        actionLabel="Explore All Restaurants"
        actionHref="/"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {restaurants.map(restaurant => (
        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
      ))}
    </div>
  );
}
