// testing if authenticated
function isAuthenticated (req, res, next) {
  if (req.session.isLoggedIn) {
    next();
  }
  else {
    res.status(401).json({error: 'Must be logged in to view content'});
  }
}

// testing if user has finished a mood check-in
function hasCompletedMoodCheckIn (req, res, next) {
  if (req.session.mood) {
    next();
  }
  else {
    res.status(401).json({error: 'Must have completed mood check-in first'});
  }
}

module.exports = {isAuthenticated, hasCompletedMoodCheckIn};