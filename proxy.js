const https = require('https');

exports.handler = async function(event) {
  const targetUrl = event.queryStringParameters?.url;
  if (!targetUrl) return { statusCode: 400, body: 'Missing url param' };

  return new Promise((resolve) => {
    https.get(targetUrl, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        },
        body: data
      }));
    }).on('error', (e) => resolve({
      statusCode: 500,
      body: JSON.stringify({ error: e.message })
    }));
  });
};