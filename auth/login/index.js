const cookie = require('cookie');
const parse = require('urlencoded-body-parser');
const users = require('./users');

module.exports = (req, res) => {
    // POST /auth/logout
    // make sure we have a body to process
    const data = await parse(req);
    if (!data || !data.username) return res.end(400);
    const validOrigins = ['https://testauth.net', 'https://testpb.net', 'https://testws.net'];
    const origin = req.url.origin;
    if (req.method === 'POST') {
      if (origin && validOrigins.includes(origin) ) {
        //we have a valid CORS request, continue
        res.setHeader('Cache-Control', 'max-age=0');
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Credentials', 'true');

        const username = data.username;
        if (users[username] && users[username].profile) {
            users[username].profile.tag = new Date().toString()  		
        }
        var profile = users[username].profile
        if (profile) {
            res.setHeader('Set-Cookie', cookie.serialize('auth', JSON.stringify(profile), {
                domain: '.testauth.net',
                httpOnly: true,
                path: "/",
                secure: true,
                maxAge: 60 * 60 * 24 * 7 // 1 week
              }));
            return res.json(profile)
        }
        return res.json({anonymous: true})
        res.clearCookie('auth', {httpOnly: true, secure: true})
  	    return res.json({anonymous: true})
      } else {
        //this is an invalid CORS request (no origin)
        return res.end(500);
      }  
    } else {
      //this is an invalid request, not a POST
      return res.end(501);
    }
  };