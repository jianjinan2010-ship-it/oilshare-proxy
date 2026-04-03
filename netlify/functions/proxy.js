exports.handler = async function(event) {
  const https = require('https');
  const url = require('url');

  let targetUrl = event.queryStringParameters && event.queryStringParameters.url;
  if (!targetUrl) return { statusCode: 400, body: 'Missing url param' };

  try { targetUrl = decodeURIComponent(targetUrl); } catch(e) {}

  const apiKey = event.queryStringParameters.key ? decodeURIComponent(event.queryStringParameters.key) : null;
  const method = (event.queryStringParameters.method || 'GET').toUpperCase();
  const bodyParam = event.queryStringParameters.body;

  const parsed = url.parse(targetUrl);

  const options = {
    hostname: parsed.hostname,
    path: parsed.path,
    method: method,
    headers: { 'Content-Type': 'application/json' }
  };

  if (apiKey) options.headers['X-Goog-Api-Key'] = apiKey;
  if (method === 'POST') options.headers['X-Goog-FieldMask'] = 'places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.internationalPhoneNumber,places.rating,places.userRatingCount,places.currentOpeningHours,places.id';

  return new Promise(function(resolve) {
    const req = https.request(options, function(res) {
      let data = '';
      res.on('data', function(chunk) { data += chunk; });
      res.on('end', function() {
        resolve({
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
          },
          body: data
        });
      });
    });
    req.on('error', function(e) {
      resolve({ statusCode: 500, body: JSON.stringify({ error: e.message }) });
    });
    if (method === 'POST' && bodyParam) {
      req.write(decodeURIComponent(bodyParam));
    }
    req.end();
  });
};
