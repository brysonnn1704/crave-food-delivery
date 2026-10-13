import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function fetchBengaluru() {
  const query = `[out:json][timeout:25];
(
  node["amenity"="restaurant"]["name"](12.96,77.63,12.99,77.66);
  node["amenity"="cafe"]["name"](12.96,77.63,12.99,77.66);
);
out center 25;`;

  try {
    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'CraveFoodApp/1.0'
      },
      body: 'data=' + encodeURIComponent(query)
    });

    if (res.ok) {
      const json = await res.json();
      console.log('Fetched elements from Bengaluru:', json.elements?.length);
      const cachePath = path.join(__dirname, '..', 'data', '.cache', 'osm-raw.json');
      const cur = JSON.parse(fs.readFileSync(cachePath, 'utf-8'));
      const existingIds = new Set(cur.map(x => x.id));

      const newItems = [];
      for (const el of json.elements) {
        if (!existingIds.has(el.id)) {
          newItems.push({
            ...el,
            _meta: {
              assignedCity: 'Bengaluru',
              assignedLocality: 'Indiranagar',
              regionName: 'Bengaluru - Indiranagar',
              retrievalTimestamp: new Date().toISOString()
            }
          });
          existingIds.add(el.id);
        }
      }

      const merged = [...cur, ...newItems];
      fs.writeFileSync(cachePath, JSON.stringify(merged, null, 2), 'utf-8');
      console.log(`Updated cache with ${newItems.length} new records. Total: ${merged.length}`);
    } else {
      console.log('Server response status:', res.status, res.statusText);
    }
  } catch (err) {
    console.error('Error fetching Bengaluru:', err.message);
  }
}

fetchBengaluru();
