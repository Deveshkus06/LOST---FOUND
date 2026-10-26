const https = require('https');
const fs = require('fs');

const query = `[out:json][timeout:25];
(
  way["leisure"](27.600,77.590,27.610,77.602);
  way["amenity"](27.600,77.590,27.610,77.602);
  node["amenity"](27.600,77.590,27.610,77.602);
  way["sport"](27.600,77.590,27.610,77.602);
);
out tags center;`;

const req = https.request('https://overpass-api.de/api/interpreter', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'User-Agent': 'GLA-UniFind/1.0'
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log('Additional amenities:', parsed.elements?.length);
      fs.writeFileSync('osm_amenities.json', JSON.stringify(parsed.elements, null, 2));
    } catch(e) {
      console.log('Error parsing:', e.message);
    }
  });
});

req.on('error', e => console.error(e));
req.write('data=' + encodeURIComponent(query));
req.end();
