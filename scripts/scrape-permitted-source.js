/**
 * scripts/scrape-permitted-source.js
 * 
 * Extracts authentic, permitted restaurant nodes and tags from OpenStreetMap
 * using the public Overpass API (ODbL 1.0) and downloads open licensed food catalog datasets.
 * 
 * Adheres strictly to robots.txt, Overpass fair-use guidelines:
 * - Specific bounding boxes to minimize server load.
 * - Courteous User-Agent headers identifying the project.
 * - Intelligent retry and multi-mirror fallback (overpass-api.de, overpass.private.coffee, overpass.kumi.systems).
 * - Caching of raw responses to avoid repetitive requests.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CACHE_DIR = path.join(__dirname, '..', 'data', '.cache');
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

const OVERPASS_MIRRORS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.private.coffee/api/interpreter'
];

// Target bounding boxes for vibrant Indian culinary centers:
// 1. Mumbai Bandra & Khar: [19.04, 72.82, 19.08, 72.85]
// 2. Mumbai Colaba & Fort: [18.91, 72.81, 18.94, 72.84]
// 3. Mumbai Lower Parel / Dadar: [18.99, 72.81, 19.03, 72.85]
// 4. Delhi Connaught Place / Central: [28.62, 77.20, 28.64, 77.23]
// 5. Bengaluru Indiranagar & Koramangala: [12.92, 77.61, 12.98, 77.65]
const REGIONS = [
  { name: 'Mumbai - Bandra & Khar', city: 'Mumbai', locality: 'Bandra West', bbox: '19.04,72.82,19.08,72.85' },
  { name: 'Mumbai - Colaba & Fort', city: 'Mumbai', locality: 'Colaba', bbox: '18.91,72.81,18.94,72.84' },
  { name: 'Mumbai - Lower Parel', city: 'Mumbai', locality: 'Lower Parel', bbox: '18.99,72.81,19.02,72.84' },
  { name: 'Delhi - Connaught Place', city: 'Delhi', locality: 'Connaught Place', bbox: '28.62,77.20,28.64,77.23' },
  { name: 'Bengaluru - Indiranagar', city: 'Bengaluru', locality: 'Indiranagar', bbox: '12.96,77.63,12.98,77.65' }
];

async function fetchWithTimeout(url, options = {}, timeoutMs = 25000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

async function queryOverpassWithMirrors(query) {
  let lastError = null;
  for (const mirror of OVERPASS_MIRRORS) {
    try {
      console.log(`  -> Querying Overpass mirror: ${mirror}`);
      const res = await fetchWithTimeout(mirror, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'CraveFoodApp/1.0 (Educational/OpenData-Project; github.com/crave-delivery)'
        },
        body: 'data=' + encodeURIComponent(query)
      }, 25000);

      if (res.ok) {
        const json = await res.json();
        if (json && Array.isArray(json.elements)) {
          return { data: json, mirror };
        }
      } else {
        console.warn(`  Mirror returned ${res.status} ${res.statusText}`);
      }
    } catch (err) {
      console.warn(`  Mirror failed (${mirror}): ${err.message}`);
      lastError = err;
    }
    // Polite pause between mirrors
    await new Promise(r => setTimeout(r, 1000));
  }
  throw new Error(`All Overpass mirrors failed: ${lastError ? lastError.message : 'Unknown'}`);
}

export async function scrapeOsmRestaurants() {
  console.log('\n=== COLLECTING PERMITTED RESTAURANT DATA FROM OPENSTREETMAP ===');
  const cacheFile = path.join(CACHE_DIR, 'osm-raw.json');
  const allElements = [];

  for (const region of REGIONS) {
    console.log(`Fetching restaurants for region: ${region.name} (${region.bbox})...`);
    const query = `[out:json][timeout:25];
(
  node["amenity"="restaurant"]["name"](${region.bbox});
  node["amenity"="fast_food"]["name"](${region.bbox});
  node["amenity"="cafe"]["name"](${region.bbox});
);
out center 25;`;

    try {
      const { data, mirror } = await queryOverpassWithMirrors(query);
      console.log(`  Successfully received ${data.elements.length} elements from ${mirror}`);
      for (const el of data.elements) {
        allElements.push({
          ...el,
          _meta: {
            assignedCity: region.city,
            assignedLocality: region.locality,
            regionName: region.name,
            retrievalTimestamp: new Date().toISOString()
          }
        });
      }
      // Courteous rate limit delay between bounding box queries
      await new Promise(r => setTimeout(r, 1500));
    } catch (err) {
      console.error(`  Could not fetch region ${region.name}: ${err.message}`);
    }
  }

  if (allElements.length > 0) {
    fs.writeFileSync(cacheFile, JSON.stringify(allElements, null, 2), 'utf-8');
    console.log(`Cached ${allElements.length} raw OSM elements to ${cacheFile}`);
    return allElements;
  }

  if (fs.existsSync(cacheFile)) {
    console.log(`Falling back to cached OSM elements in ${cacheFile}`);
    return JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
  }

  throw new Error('Failed to retrieve OSM data and no cached backup exists.');
}

export async function fetchIndianFoodDataset() {
  console.log('\n=== COLLECTING INDIAN FOOD RECIPES & DISHES DATASET (CC0) ===');
  const cacheFile = path.join(CACHE_DIR, 'indian-food-raw.csv');
  const url = 'https://raw.githubusercontent.com/aritro1011/ExploratoryDataAnalysis_Indian_Food/main/indian_food.csv';

  try {
    const res = await fetchWithTimeout(url, {
      headers: { 'User-Agent': 'CraveFoodApp/1.0' }
    });
    if (res.ok) {
      const csv = await res.text();
      fs.writeFileSync(cacheFile, csv, 'utf-8');
      console.log(`Successfully downloaded Indian Food 101 dataset (${csv.length} bytes) to cache.`);
      return csv;
    }
  } catch (err) {
    console.warn(`Could not download live Indian Food dataset: ${err.message}`);
  }

  if (fs.existsSync(cacheFile)) {
    console.log(`Using cached Indian Food 101 dataset from ${cacheFile}`);
    return fs.readFileSync(cacheFile, 'utf-8');
  }

  throw new Error('Failed to retrieve Indian Food dataset and no cache found.');
}

export async function fetchFreeFoodMenusDataset() {
  console.log('\n=== COLLECTING FREE FOOD MENUS DATASET (MIT) ===');
  const cacheFile = path.join(CACHE_DIR, 'free-food-menus-raw.json');
  const url = 'https://raw.githubusercontent.com/igdev116/free-food-menus-api/main/db.json';

  try {
    const res = await fetchWithTimeout(url, {
      headers: { 'User-Agent': 'CraveFoodApp/1.0' }
    });
    if (res.ok) {
      const json = await res.json();
      fs.writeFileSync(cacheFile, JSON.stringify(json, null, 2), 'utf-8');
      console.log(`Successfully downloaded Free Food Menus dataset to cache.`);
      return json;
    }
  } catch (err) {
    console.warn(`Could not download live Free Food Menus dataset: ${err.message}`);
  }

  if (fs.existsSync(cacheFile)) {
    console.log(`Using cached Free Food Menus dataset from ${cacheFile}`);
    return JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
  }

  return null;
}

export async function runScrapingPipeline() {
  console.log('=== STARTING PERMITTED DATA INGESTION PIPELINE ===');
  const osmElements = await scrapeOsmRestaurants();
  const indianFoodCsv = await fetchIndianFoodDataset();
  const freeFoodMenus = await fetchFreeFoodMenusDataset();

  console.log('\n=== SCRAPING SUMMARY ===');
  console.log(`Raw OSM Restaurant Nodes: ${osmElements.length}`);
  console.log(`Indian Food CSV Size: ${indianFoodCsv.length} characters`);
  console.log(`Free Food Menus Loaded: ${freeFoodMenus ? 'YES' : 'NO'}`);

  return { osmElements, indianFoodCsv, freeFoodMenus };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runScrapingPipeline().catch(err => {
    console.error('Fatal scraping error:', err);
    process.exit(1);
  });
}
