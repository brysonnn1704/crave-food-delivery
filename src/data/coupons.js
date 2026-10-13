/**
 * src/data/coupons.js
 * 
 * Configurable discount offers and promotional vouchers for Crave.
 * Note: Clearly identified demo coupons for test checkout calculations.
 */

export const DEMO_COUPONS = [
  {
    code: "WELCOME50",
    title: "Flat 50% OFF on First Order",
    description: "Get 50% discount up to ₹100 on your first craving order.",
    discountType: "percentage",
    discountValue: 50,
    minOrderValue: 199,
    maxDiscount: 100,
    badgeText: "POPULAR",
    expiryDate: "2026-12-31",
    tag: "FIRST_ORDER",
    terms: "Valid on orders above ₹199. Maximum savings of ₹100. Demo coupon."
  },
  {
    code: "CRAVEFEAST",
    title: "Flat ₹120 OFF on Feasts",
    description: "Order hearty family meals or biryanis and get flat ₹120 OFF.",
    discountType: "flat",
    discountValue: 120,
    minOrderValue: 499,
    maxDiscount: 120,
    badgeText: "BIG SAVINGS",
    expiryDate: "2026-11-30",
    tag: "MEAL_SAVER",
    terms: "Applicable on orders of ₹499 or higher. Demo voucher."
  },
  {
    code: "TASTYTUESDAY",
    title: "20% OFF Midweek Treat",
    description: "Enjoy 20% discount up to ₹75 on select partner restaurants.",
    discountType: "percentage",
    discountValue: 20,
    minOrderValue: 249,
    maxDiscount: 75,
    badgeText: "SPECIAL",
    expiryDate: "2026-12-15",
    tag: "WEEKDAY",
    terms: "Valid on minimum cart value of ₹249. Maximum savings ₹75."
  },
  {
    code: "FREEDEL",
    title: "Free Delivery Voucher",
    description: "Save ₹35 on delivery fees for orders over ₹299.",
    discountType: "flat",
    discountValue: 35,
    minOrderValue: 299,
    maxDiscount: 35,
    badgeText: "ZERO DELIVERY",
    expiryDate: "2026-12-31",
    tag: "DELIVERY",
    terms: "Waiver of standard ₹35 delivery charge on carts above ₹299."
  }
];

export function validateCoupon(code, cartSubtotal) {
  if (!code) return { valid: false, message: "Please enter a coupon code." };
  
  const cleanCode = code.trim().toUpperCase();
  const coupon = DEMO_COUPONS.find(c => c.code === cleanCode);

  if (!coupon) {
    return { valid: false, message: `Invalid coupon '${code}'. Try WELCOME50 or CRAVEFEAST.` };
  }

  if (cartSubtotal < coupon.minOrderValue) {
    return {
      valid: false,
      coupon,
      message: `Add items worth ₹${coupon.minOrderValue - cartSubtotal} more to apply ${coupon.code}. (Min order: ₹${coupon.minOrderValue})`
    };
  }

  let discountAmount = 0;
  if (coupon.discountType === "percentage") {
    discountAmount = Math.round((cartSubtotal * coupon.discountValue) / 100);
    if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
      discountAmount = coupon.maxDiscount;
    }
  } else {
    discountAmount = coupon.discountValue;
  }

  // Safety: discount cannot exceed subtotal
  discountAmount = Math.min(discountAmount, cartSubtotal);

  return {
    valid: true,
    coupon,
    discountAmount,
    message: `Coupon '${coupon.code}' applied! Saved ₹${discountAmount}.`
  };
}
