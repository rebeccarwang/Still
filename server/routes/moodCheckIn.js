const express = require('express');
const router = express.Router();
const prisma = require('../utils/db');

const {isAuthenticated} = require('../middleware/auth');

// create new mood check-in
router.post('/', isAuthenticated, async (req, res) => {
  const {score} = req.body;

  if (typeof score !== 'number' || score < 1 || score > 5) {
    return res.status(400).json({error: 'Invalid mood score.'});
  }

    try {
      // create new entry in moodCheckIn table
      const moodInsertion = await prisma.moodCheckIn.create({
        data: {
          userId: req.session.userId,
          moodScore: score
        }
      });

      req.session.mood = score;

      return res.status(201).json({message: 'Mood score successfully added.'});
    }
    catch (err) {
      console.log('Error:', err);
      return res.status(500).json({error: 'Something went wrong. Please try again later.'});
    }
})

// get current mood
router.get('/current', isAuthenticated, (req, res) => {
  const mood = req.session.mood;

  if (!mood) {
    return res.status(400).json({error: 'No mood was input during this session.'});
  }

  return res.status(200).json({message: 'Returned current mood.', mood: mood});
})

module.exports = router;