const cookie = require('cookie');

module.exports = (req, res) => {
  // POST /auth/logout
  const validOrigins = ['https://testauth.net', 'https://testpb.net', 'https://testws.net'];
  const origin = req.headers['origin'];
  console.log(`origin: ${origin}`);
  if (req.method === 'POST') {
    console.log('logout request is a POST request', req.url);
    if (origin && validOrigins.includes(origin)) {
      //we have a valid CORS request, continue
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      //remove the authenticated cookie
      res.setHeader('Set-Cookie', cookie.serialize('auth', '', { domain: '.testauth.net', path: '/', secure: true, httpOnly: true, maxAge: -1 }));
      res.statusCode = 200;
      //res.setHeader('Vary', 'Cookie, Access-Control-Allow-Origin');
      // res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Content-Type', 'application/json');
      return res.end('{"anonymous": true}');
    } else {
      //this is an invalid CORS request (no origin)
      res.statusCode = 500;
      return res.end('Invalid CORS Origin');
    }
  } else {
    //this is an invalid request, not a POST
    res.statusCode = 501;
    return res.end('Only POST is supported for this API');
  }
};