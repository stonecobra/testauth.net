const cookie = require('cookie');

module.exports = (req, res) => {
  // GET /auth/status
  const validOrigins = ['https://testauth.net', 'https://testpb.net', 'https://testws.net'];
  const origin = req.headers['origin'];
  console.log(`origin: ${origin}`);
  if (req.method === 'GET') {
    if (origin && validOrigins.includes(origin)) {
      //we have a valid CORS request, continue
      res.setHeader('Vary', 'Cookie, Origin');
      res.setHeader('Cache-Control', 'max-age=31');
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      console.log('request headers');
      console.dir(req.headers);
      if (req.headers && req.headers['cookie']) {
        const cookies = cookie.parse(req.headers['cookie']);
        // console.log(`cookies: ${cookies}`);
        if (cookies && cookies['auth']) {
          // console.log('cookies present!', cookies.auth);
          const profile = JSON.parse(cookies['auth']);
          res.setHeader('ETag', profile.tag);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify(profile));
        } else {
          console.log('no cookies set in request');
        }
      }
      res.setHeader('ETag', 'anonymous');
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end('{"anonymous": true}');
    } else {
      //this is an invalid CORS request (no origin)
      res.statusCode = 500;
      return res.end();
    }
  } else {
    //this is an invalid request, not a GET
    res.statusCode = 501;
    return res.end();
  }
};