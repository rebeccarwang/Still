const express = require('express');
const router = express.Router();
const prisma = require('../utils/db');
const rateLimit = require('express-rate-limit');

const {hasCompletedMoodCheckIn} = require('../middleware/auth');


// rate limiting
const highLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 1000,
  message: JSON.stringify({error: 'Too many requests. Try again later.'}),
  keyGenerator: (req) => {return req.session?.userId || req.ip}
  // message: 'Too many requests. Try again later.'
})


// session info
router.get('/home', highLimiter, hasCompletedMoodCheckIn, (req, res) => {
  return res.status(200).json({message: 'Home page accessed'});
})

module.exports = router;