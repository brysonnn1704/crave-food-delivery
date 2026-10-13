async function testOverpass() {
  const query = `[out:json][timeout:25];
(
  node["amenity"="restaurant"]["name"](19.00,72.80,19.10,72.90);
  way["amenity"="restaurant"]["name"](19.00,72.80,19.10,72.90);
);
out center 15;`;

  try {
    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'CraveFoodApp/1.0 (Educational/Demo Food App)' },
      body: 'data=' + encodeURIComponent(query)
    });
    console.log('Status:', res.status, res.statusText);
    const json = await res.json();
    console.log('Elements retrieved:', json.elements?.length);
    if (json.elements && json.elements.length > 0) {
      console.log('Sample record:', JSON.stringify(json.elements[0], null, 2));
    }
  } catch (err) {
    console.error('Error fetching from Overpass:', err.message);
  }
}

testOverpass();
