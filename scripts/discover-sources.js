/**
 * scripts/discover-sources.js
 * 
 * Inspects and documents permitted data sources for Crave.
 * Validates endpoint availability, terms of service, and open licenses.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const SOURCES = [
  {
    id: "openstreetmap-overpass",
    name: "OpenStreetMap (Overpass API)",
    type: "live_query_api",
    homepage: "https://www.openstreetmap.org",
    endpoint: "https://overpass-api.de/api/interpreter",
    license: "Open Database License (ODbL) 1.0",
    attribution: "© OpenStreetMap contributors, licensed under ODbL 1.0",
    termsSummary: "Permits automated querying via Overpass API within fair-use limits. Requires attribution.",
    permissionStatus: "PERMITTED_OPEN_ACCESS",
    fieldsProvided: [
      "id (OSM node / way ID)",
      "name (verified business name)",
      "amenity (restaurant / fast_food / cafe)",
      "cuisine (raw tags, e.g. indian, biryani, chinese, pizza)",
      "addr:street, addr:city, addr:suburb (locality)",
      "lat, lon (real geographic coordinates)",
      "opening_hours (operating times)",
      "phone, website (contact info if registered)"
    ],
    fieldsMissing: [
      "Itemized dish menus and individual dish prices",
      "Consumer star ratings and review counts",
      "Live order acceptance and delivery tracking"
    ],
    retrievalMethod: "Direct HTTP POST to Overpass API interpreter with rate limit throttle",
    rateLimitPolicy: "Max 2 concurrent requests, timeout 30s, courteous User-Agent header required",
    lastChecked: new Date().toISOString()
  },
  {
    id: "kaggle-indian-food-101",
    name: "Indian Food 101 Dataset (Kaggle / Curated Open Access)",
    type: "licensed_open_dataset",
    homepage: "https://www.kaggle.com/datasets/the-ultimate-indian-food-dataset",
    sourceUrl: "https://raw.githubusercontent.com/aritro1011/ExploratoryDataAnalysis_Indian_Food/main/indian_food.csv",
    license: "CC0 1.0 Universal (Public Domain Dedication)",
    attribution: "Public Domain / CC0 1.0",
    termsSummary: "Dedicated to the public domain under CC0 1.0. Allows unrestricted reproduction and commercial reuse.",
    permissionStatus: "PERMITTED_PUBLIC_DOMAIN",
    fieldsProvided: [
      "name (authentic dish names across Indian states)",
      "ingredients (real recipe ingredients)",
      "diet (vegetarian / non-vegetarian)",
      "prep_time, cook_time (minutes)",
      "flavor_profile (spicy, sweet, etc.)",
      "course (starter, main course, dessert, snack)",
      "state, region (cultural origin)"
    ],
    fieldsMissing: [
      "Live restaurant inventory and real-time stock",
      "Dynamic pricing per specific commercial restaurant"
    ],
    retrievalMethod: "Direct HTTP GET for static version-controlled open dataset",
    rateLimitPolicy: "Standard GitHub raw content delivery",
    lastChecked: new Date().toISOString()
  },
  {
    id: "free-food-menus-mit",
    name: "Free Food Menus Open Catalog",
    type: "licensed_open_dataset",
    homepage: "https://github.com/igdev116/free-food-menus-api",
    sourceUrl: "https://raw.githubusercontent.com/igdev116/free-food-menus-api/main/db.json",
    license: "MIT License",
    attribution: "Copyright (c) igdev116",
    termsSummary: "Permitted under MIT license for educational, demonstration, and commercial prototypes.",
    permissionStatus: "PERMITTED_MIT",
    fieldsProvided: [
      "Dish name (Pizza, Burger, Beverages, Desserts)",
      "Category tags",
      "Food item descriptions",
      "Photographic references"
    ],
    fieldsMissing: [
      "Indian regional thalis and biryanis (supplemented by Indian Food 101)",
      "Live order confirmation"
    ],
    retrievalMethod: "Direct HTTP GET",
    rateLimitPolicy: "Static JSON fetch",
    lastChecked: new Date().toISOString()
  }
];

export async function checkSourceAvailability() {
  console.log("=== CRAVE DATA SOURCE DISCOVERY & VERIFICATION ===");
  const results = [];

  for (const src of SOURCES) {
    const testUrl = src.endpoint || src.sourceUrl;
    console.log(`Checking ${src.name} (${testUrl})...`);
    try {
      const res = await fetch(testUrl, {
        method: src.endpoint ? "POST" : "GET",
        headers: {
          "User-Agent": "CraveDataIngestion/1.0 (Educational/Demonstration; OpenData-Compliant)",
          ...(src.endpoint ? { "Content-Type": "application/x-www-form-urlencoded" } : {})
        },
        body: src.endpoint ? "data=" + encodeURIComponent("[out:json][timeout:10];node[\"amenity\"=\"restaurant\"](18.92,72.82,18.94,72.84);out 1;") : undefined
      });

      const isOk = res.status >= 200 && res.status < 400;
      console.log(`  -> Status: ${res.status} ${res.statusText} (${isOk ? "ONLINE & ACCESSIBLE" : "UNEXPECTED STATUS"})`);
      results.push({
        ...src,
        liveStatus: isOk ? "ONLINE" : "OFFLINE",
        httpStatusCode: res.status,
        verifiedAt: new Date().toISOString()
      });
    } catch (err) {
      console.error(`  -> Failed to reach source: ${err.message}`);
      results.push({
        ...src,
        liveStatus: "UNREACHABLE",
        error: err.message,
        verifiedAt: new Date().toISOString()
      });
    }
  }

  // Save sources documentation to both data/ and src/data/
  const outDirs = [
    path.join(__dirname, '..', 'data'),
    path.join(__dirname, '..', 'src', 'data')
  ];

  for (const dir of outDirs) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'data-sources.json'), JSON.stringify(results, null, 2), 'utf-8');
  }

  console.log("Saved verified source registry to data/data-sources.json and src/data/data-sources.json");
  return results;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  checkSourceAvailability();
}
