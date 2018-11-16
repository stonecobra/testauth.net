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
        res.clearCookie('auth', {httpOnly: true, secure: true})
  	    return res.json({anonymous: true})
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