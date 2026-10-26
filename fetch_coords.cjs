const https = require('https');
const fs = require('fs');

const query = `[out:json][timeout:25];
(
  way["name"](27.600,77.590,27.610,77.602);
  node["name"](27.600,77.590,27.610,77.602);
  way["building"](27.600,77.590,27.610,77.602);
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
      console.log('Found elements:', parsed.elements?.length);
      fs.writeFileSync('osm_data.json', JSON.stringify(parsed.elements, null, 2));
    } catch(e) {
      console.log('Error parsing:', e.message, data.slice(0, 200));
    }
  });
});

req.on('error', e => console.error(e));
req.write('data=' + encodeURIComponent(query));
req.end();
