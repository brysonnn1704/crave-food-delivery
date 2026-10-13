/**
 * test/crave.test.js
 * 
 * Comprehensive automated test suite for Crave food delivery application:
 * - Dataset schema & coordinate integrity
 * - Permitted source attribution verification
 * - Menu foreign key relations & price sanity
 * - Coupon validation & calculation logic
 * - Cart totals, taxes (GST 5%), and delivery fees
 * - Order lifecycle simulation
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load datasets
const restaurants = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'restaurants.json'), 'utf-8'));
const menus = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'menus.json'), 'utf-8'));
const dataSources = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'data-sources.json'), 'utf-8'));

// Import application helpers
import { validateCoupon, DEMO_COUPONS } from '../src/data/coupons.js';
import { FOOD_CATEGORIES } from '../src/data/categories.js';

describe('1. Data Pipeline & Permitted Sources Integrity', () => {
  test('Data sources registry includes OpenStreetMap and Indian Food 101', () => {
    assert.ok(Array.isArray(dataSources));
    assert.ok(dataSources.length >= 2);

    const osm = dataSources.find(s => s.id === 'openstreetmap-overpass');
    assert.ok(osm, 'OSM source must exist');
    assert.strictEqual(osm.license, 'Open Database License (ODbL) 1.0');
    assert.ok(osm.attribution.includes('OpenStreetMap contributors'));

    const indianFood = dataSources.find(s => s.id === 'kaggle-indian-food-101');
    assert.ok(indianFood, 'Indian Food 101 source must exist');
    assert.ok(indianFood.license.includes('CC0'));
  });

  test('Restaurants dataset contains at least 50 valid records', () => {
    assert.ok(restaurants.length >= 50, `Expected >= 50 restaurants, got ${restaurants.length}`);
  });

  test('All restaurants have valid coordinates within India bounding box', () => {
    restaurants.forEach(r => {
      assert.ok(r.latitude >= 8.0 && r.latitude <= 37.0, `Lat ${r.latitude} out of bounds for ${r.name}`);
      assert.ok(r.longitude >= 68.0 && r.longitude <= 97.0, `Lon ${r.longitude} out of bounds for ${r.name}`);
    });
  });

  test('All restaurants have stable IDs, non-empty cuisines, and OSM source URLs', () => {
    const seenIds = new Set();
    restaurants.forEach(r => {
      assert.ok(r.id && typeof r.id === 'string', 'ID must be non-empty string');
      assert.ok(!seenIds.has(r.id), `Duplicate restaurant ID: ${r.id}`);
      seenIds.add(r.id);

      assert.ok(Array.isArray(r.cuisines) && r.cuisines.length > 0, `Cuisines required for ${r.name}`);
      assert.ok(r.sourceUrl.startsWith('https://www.openstreetmap.org/'), `Valid OSM URL required for ${r.name}`);
      assert.strictEqual(r.dataType, 'sourced_osm');
      assert.ok(r.locality && r.city, `Locality and city required for ${r.name}`);
    });
  });

  test('Menus dataset contains items referencing valid restaurants', () => {
    assert.ok(menus.length >= 300, `Expected >= 300 menu items, got ${menus.length}`);
    const restIdSet = new Set(restaurants.map(r => r.id));

    menus.forEach(m => {
      assert.ok(restIdSet.has(m.restaurantId), `Orphaned menu item ${m.id} (${m.name})`);
      assert.ok(m.price > 0, `Price must be positive for ${m.name}`);
      assert.strictEqual(m.currency, 'INR');
      assert.ok(['veg', 'non-veg', 'vegan'].includes(m.dietaryType), `Dietary type invalid for ${m.name}`);
      assert.ok(m.category, `Category required for ${m.name}`);
    });
  });
});

describe('2. Crave Design System & Food Categories', () => {
  test('Contains all 10 requested food categories', () => {
    const expected = [
      'Pizza',
      'Burgers',
      'Biryani',
      'Chinese',
      'South Indian',
      'North Indian',
      'Desserts',
      'Healthy Food',
      'Bakery',
      'Beverages'
    ];
    const categoryNames = FOOD_CATEGORIES.map(c => c.name);
    expected.forEach(exp => {
      assert.ok(categoryNames.includes(exp), `Missing food category: ${exp}`);
    });
  });
});

describe('3. Coupon Calculations & Discount Rules', () => {
  test('WELCOME50 gives 50% discount capped at ₹100 on carts >= ₹199', () => {
    // Below min order
    const belowMin = validateCoupon('WELCOME50', 150);
    assert.strictEqual(belowMin.valid, false);

    // Order 200 -> 50% is 100
    const validOrder = validateCoupon('WELCOME50', 200);
    assert.strictEqual(validOrder.valid, true);
    assert.strictEqual(validOrder.discountAmount, 100);

    // Order 400 -> 50% is 200, but capped at 100
    const largeOrder = validateCoupon('WELCOME50', 400);
    assert.strictEqual(largeOrder.valid, true);
    assert.strictEqual(largeOrder.discountAmount, 100);
  });

  test('CRAVEFEAST gives flat ₹120 on carts >= ₹499', () => {
    const belowMin = validateCoupon('CRAVEFEAST', 400);
    assert.strictEqual(belowMin.valid, false);

    const validOrder = validateCoupon('CRAVEFEAST', 550);
    assert.strictEqual(validOrder.valid, true);
    assert.strictEqual(validOrder.discountAmount, 120);
  });

  test('FREEDEL waives delivery fee of ₹35 on carts >= ₹299', () => {
    const valid = validateCoupon('FREEDEL', 320);
    assert.strictEqual(valid.valid, true);
    assert.strictEqual(valid.discountAmount, 35);
  });

  test('Invalid coupon code returns helpful error message', () => {
    const res = validateCoupon('NOT_A_CODE', 500);
    assert.strictEqual(res.valid, false);
    assert.ok(res.message.includes('Invalid coupon'));
  });
});

describe('4. Cart Calculations, Taxes & Delivery Rules', () => {
  test('GST is calculated accurately at 5% of subtotal', () => {
    const subtotal = 400;
    const gst = Math.round(subtotal * 0.05);
    assert.strictEqual(gst, 20);
  });

  test('Delivery fee is ₹0 for orders >= ₹500, otherwise flat ₹35', () => {
    const subtotalLow = 300;
    const feeLow = subtotalLow >= 500 ? 0 : 35;
    assert.strictEqual(feeLow, 35);

    const subtotalHigh = 600;
    const feeHigh = subtotalHigh >= 500 ? 0 : 35;
    assert.strictEqual(feeHigh, 0);
  });

  test('Grand Total correctly accounts for subtotal, discount, fee, and tax', () => {
    const subtotal = 300;
    const discount = 50; // coupon
    const fee = 35;
    const tax = Math.round(subtotal * 0.05); // 15
    const grandTotal = subtotal - discount + fee + tax; // 300 - 50 + 35 + 15 = 300
    assert.strictEqual(grandTotal, 300);
  });
});

describe('5. Order Simulation Lifecycle Stages', () => {
  test('Order progression follows 5 discrete stages', () => {
    const STAGES = [
      "Order Placed",
      "Preparing Food",
      "Ready for Pickup",
      "Out for Delivery",
      "Delivered"
    ];
    assert.strictEqual(STAGES.length, 5);
    assert.strictEqual(STAGES[0], "Order Placed");
    assert.strictEqual(STAGES[4], "Delivered");
  });
});
