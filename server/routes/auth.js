const express = require('express');
const router = express.Router();
const prisma = require('../utils/db');
const bcrypt = require('bcrypt');

const {isAuthenticated} = require('../middleware/auth');
// login
router.post('/login', async (req, res) => {
  const {email, password} = req.body;

  // check user inputs email and password
  if (!email || !password) {
    return res.status(400).json({error: 'Must input both email and password'});
  }

  // check if email exists
  const user = await prisma.user.findUnique({
    where: {email: email}
  });
  if (!user) {
    return res.status(401).json({error: 'The email or password you entered is incorrect'});
  }

  // check if email and password match
  const isPasswordCorrect = await isCorrectPassword(password, user.password);
  if (!isPasswordCorrect) {
    return res.status(401).json({error: 'The email or password you entered is incorrect'});
  }

  // if user name and password valid
  req.session.isLoggedIn = true;
  req.session.userId = user.id;
  req.session.firstName = user.firstName;
  req.session.hasCompletedOnboarding = user.hasCompletedOnboarding;
  return res.status(200).json({message: 'Login successful', isLoggedIn: true, userId: req.session.userId, firstName: req.session.firstName, hasCompletedOnboarding: req.session.hasCompletedOnboarding});
})


// logout
router.post('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error while logging out:', err);
      return res.status(500).json({error: 'Logout failed'});
    }
    res.status(200).json({message: 'Logout successful'});
  })
})


// session info
router.get('/session', isAuthenticated, (req, res) => {
  return res.status(200).json({
    isLoggedIn: true,
    firstName: req.session.firstName,
    userId: req.session.userId
  })
})

// helper functions
// check password matches what's in the database
async function isCorrectPassword(userInput, hashedPassword) {
  const isCorrect = await bcrypt.compare(userInput, hashedPassword);
  if (isCorrect) {
    return true;
  }
  return false;
}

module.exports = router;