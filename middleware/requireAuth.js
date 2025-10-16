

function requireAuth(req, res, next) {
  if (req.session && req.session.account) {
    req.account = req.session.account; 
    return next();
  }
  res.redirect('/account/login'); 
}

module.exports = requireAuth;


