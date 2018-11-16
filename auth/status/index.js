// const cookie = require('cookie');

module.exports = (req, res) => {
  // GET /auth/status
  const validOrigins = ['https://testauth.net', 'https://testpb.net', 'https://testws.net'];
  const origin = req.url.origin;
  if (req.method === 'GET') {
    if (origin && validOrigins.includes(origin) ) {
      //we have a valid CORS request, continue
      res.vary('Cookie');
      res.setHeader('Cache-Control', 'max-age=31');
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true')
      if (req.cookies && req.cookies['auth']) {
        console.log('cookies present!', req.cookies.auth);
        const profile = JSON.parse(req.cookies['auth'])
        res.setHeader('ETag', profile.tag)
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify(profile));
      } else {
        console.log('no cookies set in request')
      }
      res.setHeader('ETag', 'anonymous');
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end('{anonymous: true}');
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