const express = require('express');
const router = express.Router();
const prisma = require('../utils/db');
const rateLimit = require('express-rate-limit');

const {isAuthenticated} = require('../middleware/auth');


// rate limiting
function createLimiter() {
  return rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 150,
    message: JSON.stringify({error: 'Too many requests. Try again later.'}),
    keyGenerator: (req) => {return req.session?.userId || req.ip}
  })
}


// create new mood check-in
router.post('/', createLimiter(), isAuthenticated, async (req, res) => {
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

      return res.status(201).json({message: 'Mood score successfully added.', moodId: moodInsertion.id});
    }
    catch (err) {
      console.log('Error:', err);
      return res.status(500).json({error: 'Something went wrong. Please try again later.'});
    }
})


// // get current mood
// router.get('/current', isAuthenticated, (req, res) => {
//   const mood = req.session.mood;

//   if (!mood) {
//     return res.status(400).json({error: 'No mood was input during this session.'});
//   }

//   return res.status(200).json({message: 'Returned current mood.', mood: mood});
// })

module.exports = router;