const express = require('express');
const router = express.Router();
const prisma = require('../utils/db');

const {isAuthenticated} = require('../middleware/auth');

// create new journal entry
router.post('/entries', isAuthenticated, async (req, res) => {
  const {journalText} = req.body;

  if (typeof journalText !== 'string') {
    return res.status(400).json({error: 'Invalid journal entry -strings only.'});
  }

  try {

    // get sentiment score for journalEntry text
    const sentimentRes = await fetch('http://localhost:8000/api/sentiment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({journalText})
    });
    const sentimentResJson = await sentimentRes.json();
    const sentimentScore = sentimentResJson.score;
    // console.log('sentiment score:', sentimentScore);

    // create new entry in journalEntry table
    const newJournalEntry = await prisma.journalEntry.create({
      data: {
        userId: req.session.userId,
        content: journalText,
        moodAtTimeOfEntry: req.session.mood,
        sentimentScore: sentimentScore
      }
    });

    return res.status(201).json({message: 'Journal entry successfully added.', journalEntryId: newJournalEntry.id});
  }
  catch (err) {
    console.log('Error:', err);
    return res.status(500).json({error: 'Something went wrong. Please try again later.'});
  }

})

module.exports = router;