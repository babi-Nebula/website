const app = require('../../backend/vercel-auth');
module.exports = (req, res) => {
  req.url = req.url.replace(/^\/api\/auth-api(?=\/|\?|$)/, '/auth-api');
  return app(req, res);
};
