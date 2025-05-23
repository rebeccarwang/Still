// testing if authenticated
function isAuthenticated (req, res, next) {
  if (req.session.isLoggedIn) {
    next();
  }
  else {
    res.status(401).json({error: 'Must be logged in to view content'});
  }
}

module.exports = {isAuthenticated};