/**
 * scripts/validate-data.js
 * 
 * Strict schema and data integrity validator for Crave restaurant and menu datasets.
 * Checks coordinate boundaries, required fields, foreign key references,
 * pricing sanity, and source attribution.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', 'data');

export function validateDatasets() {
  console.log('=== RUNNING CRAVE DATASET VALIDATION ===');

  const restPath = path.join(DATA_DIR, 'restaurants.json');
  const menuPath = path.join(DATA_DIR, 'menus.json');
  const srcPath = path.join(DATA_DIR, 'data-sources.json');

  if (!fs.existsSync(restPath) || !fs.existsSync(menuPath)) {
    console.error('CRITICAL: Data files not found. Run normalize-data.js first.');
    process.exit(1);
  }

  const restaurants = JSON.parse(fs.readFileSync(restPath, 'utf-8'));
  const menus = JSON.parse(fs.readFileSync(menuPath, 'utf-8'));
  let sources = [];
  if (fs.existsSync(srcPath)) {
    sources = JSON.parse(fs.readFileSync(srcPath, 'utf-8'));
  }

  const errors = [];
  const warnings = [];

  // Track sets
  const restaurantIds = new Set();
  const menuIds = new Set();

  console.log(`\nValidating ${restaurants.length} restaurant records...`);
  restaurants.forEach((r, idx) => {
    // ID Check
    if (!r.id || typeof r.id !== 'string') {
      errors.push(`Restaurant #${idx}: Missing or invalid 'id'`);
    } else if (restaurantIds.has(r.id)) {
      errors.push(`Restaurant #${idx} (${r.id}): Duplicate ID`);
    } else {
      restaurantIds.add(r.id);
    }

    // Name Check
    if (!r.name || typeof r.name !== 'string' || r.name.trim().length === 0) {
      errors.push(`Restaurant ${r.id}: Missing or empty 'name'`);
    }

    // Coordinates Bounds (India: Lat 8.0 - 37.0, Lon 68.0 - 97.0)
    if (typeof r.latitude !== 'number' || r.latitude < 8.0 || r.latitude > 37.0) {
      errors.push(`Restaurant ${r.id} (${r.name}): Latitude ${r.latitude} outside valid range for India (8.0-37.0)`);
    }
    if (typeof r.longitude !== 'number' || r.longitude < 68.0 || r.longitude > 97.0) {
      errors.push(`Restaurant ${r.id} (${r.name}): Longitude ${r.longitude} outside valid range for India (68.0-97.0)`);
    }

    // Cuisines Check
    if (!Array.isArray(r.cuisines) || r.cuisines.length === 0) {
      errors.push(`Restaurant ${r.id} (${r.name}): Missing or empty 'cuisines' array`);
    }

    // Locality & City
    if (!r.locality || !r.city) {
      errors.push(`Restaurant ${r.id} (${r.name}): Missing locality or city`);
    }

    // Attribution
    if (!r.sourceUrl || !r.sourceLicense || !r.attribution) {
      errors.push(`Restaurant ${r.id} (${r.name}): Missing sourceUrl, sourceLicense, or attribution`);
    }

    // Retrieval timestamp
    if (!r.retrievedAt || isNaN(new Date(r.retrievedAt).getTime())) {
      errors.push(`Restaurant ${r.id} (${r.name}): Invalid retrievedAt timestamp`);
    }

    // Price for two
    if (typeof r.priceForTwo !== 'number' || r.priceForTwo <= 0) {
      errors.push(`Restaurant ${r.id} (${r.name}): Invalid priceForTwo ${r.priceForTwo}`);
    }
  });

  console.log(`\nValidating ${menus.length} menu items...`);
  menus.forEach((m, idx) => {
    // Menu ID
    if (!m.id || typeof m.id !== 'string') {
      errors.push(`Menu item #${idx}: Missing or invalid 'id'`);
    } else if (menuIds.has(m.id)) {
      errors.push(`Menu item #${idx} (${m.id}): Duplicate ID`);
    } else {
      menuIds.add(m.id);
    }

    // Foreign key reference
    if (!m.restaurantId || !restaurantIds.has(m.restaurantId)) {
      errors.push(`Menu item ${m.id} (${m.name}): Orphaned item referencing non-existent restaurantId ${m.restaurantId}`);
    }

    // Name & Price
    if (!m.name || typeof m.name !== 'string' || m.name.trim().length === 0) {
      errors.push(`Menu item ${m.id}: Missing or empty 'name'`);
    }
    if (typeof m.price !== 'number' || m.price <= 0) {
      errors.push(`Menu item ${m.id} (${m.name}): Invalid price ${m.price}`);
    }
    if (m.currency !== 'INR') {
      errors.push(`Menu item ${m.id} (${m.name}): Invalid currency '${m.currency}', expected 'INR'`);
    }

    // Dietary type
    if (!['veg', 'non-veg', 'vegan'].includes(m.dietaryType)) {
      errors.push(`Menu item ${m.id} (${m.name}): Invalid dietaryType '${m.dietaryType}'`);
    }

    // Category
    if (!m.category || typeof m.category !== 'string') {
      errors.push(`Menu item ${m.id} (${m.name}): Missing category`);
    }
  });

  console.log('\n=== VALIDATION SUMMARY REPORT ===');
  console.log(`Total Restaurants Validated: ${restaurants.length}`);
  console.log(`Total Menu Items Validated:  ${menus.length}`);
  console.log(`Registered Data Sources:     ${sources.length}`);
  console.log(`Errors Found:                ${errors.length}`);
  console.log(`Warnings Found:              ${warnings.length}`);

  if (errors.length > 0) {
    console.error('\nVALIDATION FAILED WITH ERRORS:');
    errors.slice(0, 15).forEach(e => console.error('  - ' + e));
    if (errors.length > 15) console.error(`  ... and ${errors.length - 15} more errors.`);
    process.exit(1);
  }

  console.log('\n✓ ALL DATASET INTEGRITY CHECKS PASSED SUCCESSFULLY!');
  return { valid: true, restaurantCount: restaurants.length, menuCount: menus.length };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  validateDatasets();
}
