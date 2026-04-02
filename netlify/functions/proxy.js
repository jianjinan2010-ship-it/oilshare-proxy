exports.handler = async function(event) {
  const https = require('https');
  const targetUrl = event.queryStringParameters && event.queryStringParameters.url;
  
  if (!targetUrl) {
    return { statusCode: 400, body: 'Missing url param' };
  }

  return new Promise(function(resolve) {
    https.get(targetUrl, function(res) {
      var data = '';
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
    }).on('error', function(e) {
      resolve({
        statusCode: 500,
        body: JSON.stringify({ error: e.message })
      });
    });
  });
};
