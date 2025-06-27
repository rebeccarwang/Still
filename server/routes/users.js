const express = require('express');
const router = express.Router();
const prisma = require('../utils/db');
const rateLimit = require('express-rate-limit');

const {isAuthenticated} = require('../middleware/auth');
const bcrypt = require('bcrypt');


// rate limiting
const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 60,
  max: 3,
  message: JSON.stringify({error: 'Too many signup requests. Try again later.'}),
})


// rate limiting
function createLimiter() {
  return rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: JSON.stringify({error: 'Too many requests. Try again later.'}),
    keyGenerator: (req) => {return req.session?.userId || req.ip}
  })
}


// create new user
router.post('/', signupLimiter, async (req, res) => {
  const {email, password, firstName, lastName} = req.body;

  // check that all required input fields exist
  if (!email || !password || !firstName || !lastName || password.length < 8) {
    return res.status(400).json({error: 'Must input all required fields, following specifications'});
  }

  // check email isn't already taken
  const isExistingUser = await prisma.user.findUnique({
    where: {email: email}
  });
  if (isExistingUser) {
    return res.status(400).json({error: 'Email is already in use.'});
  }

  // create user if password meets length requirements and can be hashed
  try {
    const hashedPassword = await createPassword(password);
    const post = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName}
    });
    return res.status(201).json({message: 'User created.'});
  }
  catch (err) {
    if (err.message === 'Password hashing failed') {
      return res.status(500).json({error: 'Something went wrong. Please try again later.'});
    }
  }
})


// set user's hasCompletedOnboarding attribute to true
router.patch('/onboarding-complete', createLimiter(), isAuthenticated, async (req, res) => {
  try {
    await prisma.user.update({
      where: {id: req.session.userId},
      data: {hasCompletedOnboarding: true}
    });
    return res.status(200).json({message: 'User hasCompletedOnboarding attribute successfully updated.'});
  } catch (err) {
    return res.status(500).json({error: 'Failed to update user hasCompletedOnboarding attribute.'});
  }
})


// helper functions
// password hashing
async function createPassword(userPassword) {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userPassword, saltRounds);
    console.log(hashedPassword);
    return hashedPassword;
  }
  catch (err) {
    console.error('Hashing failed:', err.message);
    throw new Error('Password hashing failed');
  }
}

module.exports = router;