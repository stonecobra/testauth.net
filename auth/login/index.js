const cookie = require('cookie');
const parse = require('urlencoded-body-parser');
const users = require('../users');

module.exports = (req, res) => {
  // POST /auth/login
  const validOrigins = ['https://testauth.net', 'https://testpb.net', 'https://testws.net'];
  const origin = req.headers['origin'];
  console.log(`origin: ${origin}`);
  if (req.method === 'POST') {
    console.log('login request is a POST request', req.url);
    if (origin && validOrigins.includes(origin)) {
      const data = parse(req).then(data => {
        // make sure we have a body to process
        console.log(`login attempting login: ${data.username}`);
        if (!data || !data.username) return res.end(400);
      
        //we have a valid CORS request, continue
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
  
        const username = data.username;
        var profile = users[username].profile;
        if (profile) {
          profile.tag = new Date().toString();
          console.dir(profile);
          res.setHeader('Set-Cookie', cookie.serialize('auth', JSON.stringify(profile), {
            domain: '.testauth.net',
            httpOnly: true,
            path: "/",
            secure: true,
            maxAge: 60 * 60 * 24 * 7 // 1 week
          }));
          res.statusCode = 200;
          // res.setHeader('Vary', 'Cookie, Access-Control-Allow-Origin');
          res.setHeader('Cache-Control', 'no-cache');
          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify(profile));
        }
        res.statusCode = 200;
        // res.setHeader('Vary', 'Cookie, Access-Control-Allow-Origin');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Content-Type', 'application/json');
        return res.end('{"anonymous": true}');
      });
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