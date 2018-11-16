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
        const profile = JSON.parse(req.cookies['auth'])
        res.setHeader('ETag', profile.tag)
        return res.json(profile);
      }
      res.setHeader('ETag', 'anonymous');
      return res.json({anonymous: true});
    } else {
      //this is an invalid CORS request (no origin)
      return res.end(500);
    }
  } else {
      //this is an invalid request, not a GET
      return res.end(501);
  }
};