const cookie = require('cookie');

module.exports = (req, res) => {
    // POST /auth/logout
    const validOrigins = ['https://testauth.net', 'https://testpb.net', 'https://testws.net'];
    const origin = req.url.origin;
    if (req.method === 'POST') {
      if (origin && validOrigins.includes(origin) ) {
        //we have a valid CORS request, continue
        res.setHeader('Cache-Control', 'max-age=0');
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Credentials', 'true')
        res.setHeader('Set-Cookie', cookie.serialize('auth', null, {domain: '.testauth.net', path: '/', secure: true, httpOnly: true}));
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        return res.end('{anonymous: true}');
      } else {
        //this is an invalid CORS request (no origin)
        res.statusCode = 500;
        return res.end();
      }  
    } else {
      //this is an invalid request, not a POST
      res.statusCode = 501;
      return res.end();
  }
  };