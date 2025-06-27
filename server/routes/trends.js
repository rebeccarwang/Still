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


// get mood trends
router.get('/mood/:reflectionPref', createLimiter(), isAuthenticated, async (req, res) => {
  const {reflectionPref} = req.params;

  // checks if reflectionPref value is valid
  const frequencies = {'weekly': 7, 'biweekly': 14, 'monthly': 30};
  const frequency = frequencies[reflectionPref];
  if (!frequency) {
    return res.status(400).json({error: 'Invalid trend frequency.'});
  }

  try {
    let cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - frequency);
    let journalEntries = [];
    let moodEntries = [];

    // get all journal entries of user from cutoffDate onwards with tags
    journalEntries = await prisma.journalEntry.findMany({
      where: {userId: req.session.userId, createdAt: {gte: cutoffDate}},
      include: {
        tags: {
          include: {
            tag: true
          }
        }
      }
    })

    // get all mood entries of user from cutoffDate onwards with tags
    moodEntries = await prisma.moodCheckIn.findMany({
      where: {userId: req.session.userId, createdAt: {gte: cutoffDate}},
      include: {
        tags: {
          include: {
            tag: true
          }
        }
      },
      orderBy: {id: 'asc'}
    })

    let tagFrequencies = {};

    // extracts tag frequencies from journalEntries
    journalEntries.map(entry => {
      let tagNames = entry.tags.map(obj => obj.tag.name);
      tagNames.forEach(name => {
        tagFrequencies[name] = (tagFrequencies[name] || 0) + 1;
      });
    });
    console.log('tag frequencies after journalentry mapping:', tagFrequencies);

    // get mood data and extract tag frequency from moodEntries
    let moodData = moodEntries.map(entry => {
      // count frequency of each tag
      let tagNames = entry.tags.map(obj => obj.tag.name);
      tagNames.forEach(name => {
        tagFrequencies[name] = (tagFrequencies[name] || 0) + 1;
      });

      // create array of mood entries with time of creation
      return {createdAt: entry.createdAt,
        mood: entry.moodScore};
    })
    console.log('tag frequencies after mood entry mapping:', tagFrequencies);
    console.log('all moods and times', moodData);

    return res.status(200).json({tagFrequencies, moodData});
  }
  catch (err) {
    console.log('Error:', err);
    return res.status(500).json({error: 'Something went wrong. Please try again later.'});
  }
})

module.exports = router;