/**
 * src/context/CraveContext.jsx
 * 
 * Global state management for Crave Food Delivery:
 * - Active delivery location (City & Locality)
 * - Persistent cart with multi-restaurant conflict detection
 * - Coupon application and price calculations (Subtotal, GST 5%, Delivery Fee, Discounts)
 * - Saved delivery addresses
 * - Persistent favourites
 * - Order submission, demo tracking status, and order history
 * - User preferences (Veg-only filter, recently viewed)
 */

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import restaurantsData from '../data/restaurants.json';
import menusData from '../data/menus.json';
import { validateCoupon } from '../data/coupons';

const CraveContext = createContext(null);

const DEFAULT_ADDRESSES = [
  {
    id: "addr-home",
    label: "Home",
    type: "home",
    recipientName: "Aarav Sharma",
    phone: "+91 98201 54321",
    flat: "Flat 402, Sea Green Apartments",
    street: "Bandra West, near Mehboob Studio",
    locality: "Bandra West",
    city: "Mumbai",
    pincode: "400050",
    isDefault: true
  },
  {
    id: "addr-office",
    label: "Work / Office",
    type: "work",
    recipientName: "Aarav Sharma",
    phone: "+91 98201 54321",
    flat: "Level 8, Express Towers",
    street: "Nariman Point",
    locality: "Colaba",
    city: "Mumbai",
    pincode: "400021",
    isDefault: false
  }
];

export function CraveProvider({ children }) {
  // 1. Location state
  const [selectedCity, setSelectedCity] = useState(() => {
    return localStorage.getItem('crave_city') || 'Mumbai';
  });
  const [selectedLocality, setSelectedLocality] = useState(() => {
    return localStorage.getItem('crave_locality') || 'All Localities';
  });

  // 2. Favourites
  const [favourites, setFavourites] = useState(() => {
    try {
      const saved = localStorage.getItem('crave_favourites');
      return saved ? JSON.parse(saved) : ['osm-node-245653876', 'osm-node-488208617']; // Initial favorites (Copper Chimney, Bademiya)
    } catch {
      return [];
    }
  });

  // 3. Saved Addresses
  const [addresses, setAddresses] = useState(() => {
    try {
      const saved = localStorage.getItem('crave_addresses');
      return saved ? JSON.parse(saved) : DEFAULT_ADDRESSES;
    } catch {
      return DEFAULT_ADDRESSES;
    }
  });
  const [selectedAddressId, setSelectedAddressId] = useState(() => {
    const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
    return defaultAddr ? defaultAddr.id : '';
  });

  // 4. Cart State
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('crave_cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [cartRestaurant, setCartRestaurant] = useState(() => {
    try {
      const saved = localStorage.getItem('crave_cart_restaurant');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  // Conflict modal state when adding from different restaurant
  const [conflictModalOpen, setConflictModalOpen] = useState(false);
  const [pendingCartAction, setPendingCartAction] = useState(null);

  // 5. Orders history
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('crave_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 6. User Preferences
  const [vegOnly, setVegOnly] = useState(() => {
    return localStorage.getItem('crave_veg_only') === 'true';
  });
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    try {
      const saved = localStorage.getItem('crave_recently_viewed');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persistence side-effects
  useEffect(() => {
    localStorage.setItem('crave_city', selectedCity);
    localStorage.setItem('crave_locality', selectedLocality);
  }, [selectedCity, selectedLocality]);

  useEffect(() => {
    localStorage.setItem('crave_favourites', JSON.stringify(favourites));
  }, [favourites]);

  useEffect(() => {
    localStorage.setItem('crave_addresses', JSON.stringify(addresses));
  }, [addresses]);

  useEffect(() => {
    localStorage.setItem('crave_cart_items', JSON.stringify(cartItems));
    localStorage.setItem('crave_cart_restaurant', JSON.stringify(cartRestaurant));
  }, [cartItems, cartRestaurant]);

  useEffect(() => {
    localStorage.setItem('crave_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('crave_veg_only', vegOnly.toString());
  }, [vegOnly]);

  useEffect(() => {
    localStorage.setItem('crave_recently_viewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  // Derived available cities and localities
  const availableLocations = useMemo(() => {
    const locMap = {};
    restaurantsData.forEach(r => {
      const c = r.city || 'Mumbai';
      if (!locMap[c]) locMap[c] = new Set();
      if (r.locality) locMap[c].add(r.locality);
    });
    const result = {};
    Object.keys(locMap).forEach(city => {
      result[city] = ['All Localities', ...Array.from(locMap[city])];
    });
    return result;
  }, []);

  // Favourites actions
  const toggleFavourite = (restaurantId) => {
    setFavourites(prev => {
      if (prev.includes(restaurantId)) {
        return prev.filter(id => id !== restaurantId);
      } else {
        return [...prev, restaurantId];
      }
    });
  };

  const isFavourite = (restaurantId) => favourites.includes(restaurantId);

  // Address actions
  const addAddress = (addr) => {
    const newAddr = { ...addr, id: `addr-${Date.now()}` };
    if (newAddr.isDefault) {
      setAddresses(prev => prev.map(a => ({ ...a, isDefault: false })).concat(newAddr));
    } else {
      setAddresses(prev => [...prev, newAddr]);
    }
    setSelectedAddressId(newAddr.id);
  };

  const deleteAddress = (id) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
    if (selectedAddressId === id) {
      const remaining = addresses.filter(a => a.id !== id);
      if (remaining.length > 0) setSelectedAddressId(remaining[0].id);
    }
  };

  // Cart actions
  const addToCart = (item, restaurant, addons = [], specialInstructions = '', quantity = 1) => {
    // Check if adding from another restaurant
    if (cartRestaurant && cartItems.length > 0 && cartRestaurant.id !== restaurant.id) {
      setPendingCartAction({ item, restaurant, addons, specialInstructions, quantity });
      setConflictModalOpen(true);
      return;
    }

    setCartRestaurant({
      id: restaurant.id,
      name: restaurant.name,
      locality: restaurant.locality,
      city: restaurant.city,
      image: restaurant.image,
      deliveryTime: restaurant.deliveryTime,
      deliveryFee: restaurant.deliveryFee ?? 35
    });

    setCartItems(prev => {
      // Find matching item (same item ID and same addons)
      const existingIdx = prev.findIndex(ci => ci.id === item.id);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: updated[existingIdx].quantity + quantity,
          specialInstructions: specialInstructions || updated[existingIdx].specialInstructions
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            id: item.id,
            name: item.name,
            price: item.price,
            category: item.category,
            dietaryType: item.dietaryType,
            image: item.image,
            description: item.description,
            quantity,
            addons: addons || [],
            addonsTotal: (addons || []).reduce((acc, a) => acc + (a.price || 0), 0),
            specialInstructions: specialInstructions || ''
          }
        ];
      }
    });
  };

  const resolveConflictReplace = () => {
    if (pendingCartAction) {
      const { item, restaurant, addons, specialInstructions, quantity } = pendingCartAction;
      setCartRestaurant({
        id: restaurant.id,
        name: restaurant.name,
        locality: restaurant.locality,
        city: restaurant.city,
        image: restaurant.image,
        deliveryTime: restaurant.deliveryTime,
        deliveryFee: restaurant.deliveryFee ?? 35
      });
      setCartItems([
        {
          id: item.id,
          name: item.name,
          price: item.price,
          category: item.category,
          dietaryType: item.dietaryType,
          image: item.image,
          description: item.description,
          quantity,
          addons: addons || [],
          addonsTotal: (addons || []).reduce((acc, a) => acc + (a.price || 0), 0),
          specialInstructions: specialInstructions || ''
        }
      ]);
      setAppliedCoupon(null);
    }
    setPendingCartAction(null);
    setConflictModalOpen(false);
  };

  const resolveConflictCancel = () => {
    setPendingCartAction(null);
    setConflictModalOpen(false);
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setCartItems(prev => prev.map(item => item.id === itemId ? { ...item, quantity } : item));
  };

  const removeItem = (itemId) => {
    setCartItems(prev => {
      const remaining = prev.filter(item => item.id !== itemId);
      if (remaining.length === 0) {
        setCartRestaurant(null);
        setAppliedCoupon(null);
      }
      return remaining;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    setCartRestaurant(null);
    setAppliedCoupon(null);
    setCouponError('');
  };

  const updateItemInstructions = (itemId, text) => {
    setCartItems(prev => prev.map(item => item.id === itemId ? { ...item, specialInstructions: text } : item));
  };

  // Calculations
  const cartSubtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const unit = item.price + (item.addonsTotal || 0);
      return acc + (unit * item.quantity);
    }, 0);
  }, [cartItems]);

  const cartItemCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  // Delivery fee rules: Free over ₹500, or flat ₹35
  const deliveryFee = useMemo(() => {
    if (cartItems.length === 0) return 0;
    if (appliedCoupon?.code === "FREEDEL") return 0;
    if (cartSubtotal >= 500) return 0;
    return cartRestaurant?.deliveryFee ?? 35;
  }, [cartItems, cartSubtotal, cartRestaurant, appliedCoupon]);

  // GST 5% on restaurant food
  const gstAmount = useMemo(() => {
    if (cartSubtotal === 0) return 0;
    return Math.round(cartSubtotal * 0.05);
  }, [cartSubtotal]);

  // Coupon application logic
  const handleApplyCoupon = (code) => {
    setCouponError('');
    const result = validateCoupon(code, cartSubtotal);
    if (result.valid) {
      setAppliedCoupon({ ...result.coupon, discountAmount: result.discountAmount });
      return { success: true, message: result.message };
    } else {
      setCouponError(result.message);
      return { success: false, message: result.message };
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
  };

  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    // Re-verify against subtotal
    const res = validateCoupon(appliedCoupon.code, cartSubtotal);
    return res.valid ? res.discountAmount : 0;
  }, [appliedCoupon, cartSubtotal]);

  const grandTotal = useMemo(() => {
    if (cartItems.length === 0) return 0;
    return Math.max(0, cartSubtotal - discountAmount + deliveryFee + gstAmount);
  }, [cartItems, cartSubtotal, discountAmount, deliveryFee, gstAmount]);

  // Orders
  const placeOrder = ({ paymentMethod, deliveryInstructions = '' }) => {
    if (cartItems.length === 0) throw new Error("Cart is empty");
    const activeAddress = addresses.find(a => a.id === selectedAddressId) || addresses[0];

    const orderId = `CRV-${Math.floor(1000 + Math.random() * 9000)}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;
    const now = new Date();

    const newOrder = {
      id: orderId,
      createdAt: now.toISOString(),
      restaurant: { ...cartRestaurant },
      items: [...cartItems],
      subtotal: cartSubtotal,
      deliveryFee,
      gstAmount,
      discountAmount,
      grandTotal,
      appliedCoupon: appliedCoupon ? { code: appliedCoupon.code, discountAmount } : null,
      deliveryAddress: activeAddress,
      deliveryInstructions,
      paymentMethod, // 'cod' | 'upi' | 'card'
      status: "Order Placed", // Stages: Order Placed -> Preparing -> Ready for Pickup -> Out for Delivery -> Delivered
      timeline: [
        { stage: "Order Placed", time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), completed: true },
        { stage: "Preparing Food", time: null, completed: false },
        { stage: "Ready for Pickup", time: null, completed: false },
        { stage: "Out for Delivery", time: null, completed: false },
        { stage: "Delivered", time: null, completed: false }
      ]
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  // Demo advancement of order status
  const advanceOrderStatus = (orderId) => {
    const STAGES = ["Order Placed", "Preparing Food", "Ready for Pickup", "Out for Delivery", "Delivered"];
    setOrders(prev => prev.map(ord => {
      if (ord.id !== orderId) return ord;
      const currentIdx = STAGES.indexOf(ord.status);
      if (currentIdx < STAGES.length - 1) {
        const nextStatus = STAGES[currentIdx + 1];
        const updatedTimeline = ord.timeline.map((step, idx) => {
          if (idx <= currentIdx + 1) {
            return {
              ...step,
              completed: true,
              time: step.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
          }
          return step;
        });
        return {
          ...ord,
          status: nextStatus,
          timeline: updatedTimeline
        };
      }
      return ord;
    }));
  };

  const addRecentlyViewed = (restaurantId) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(id => id !== restaurantId);
      return [restaurantId, ...filtered].slice(0, 8);
    });
  };

  const value = {
    // Location
    selectedCity,
    setSelectedCity,
    selectedLocality,
    setSelectedLocality,
    availableLocations,
    // Data collections
    restaurants: restaurantsData,
    menus: menusData,
    // Favourites
    favourites,
    toggleFavourite,
    isFavourite,
    // Addresses
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    addAddress,
    deleteAddress,
    // Cart
    cartItems,
    cartRestaurant,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    updateItemInstructions,
    cartSubtotal,
    cartItemCount,
    deliveryFee,
    gstAmount,
    grandTotal,
    // Conflict modal
    conflictModalOpen,
    pendingCartAction,
    resolveConflictReplace,
    resolveConflictCancel,
    // Coupons
    appliedCoupon,
    couponError,
    applyCoupon: handleApplyCoupon,
    removeCoupon: handleRemoveCoupon,
    discountAmount,
    // Orders
    orders,
    placeOrder,
    advanceOrderStatus,
    // Preferences
    vegOnly,
    setVegOnly,
    recentlyViewed,
    addRecentlyViewed
  };

  return (
    <CraveContext.Provider value={value}>
      {children}
    </CraveContext.Provider>
  );
}

export function useCrave() {
  const context = useContext(CraveContext);
  if (!context) {
    throw new Error('useCrave must be used within a CraveProvider');
  }
  return context;
}
