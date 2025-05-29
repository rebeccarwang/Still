const express = require('express');
const router = express.Router();
const prisma = require('../utils/db');

const {hasCompletedMoodCheckIn} = require('../middleware/auth');

// session info
router.get('/home', hasCompletedMoodCheckIn, (req, res) => {
  return res.status(200).json({message: 'Home page accessed'});
})

module.exports = router;