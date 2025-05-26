const express = require('express');
const router = express.Router();
const prisma = require('../utils/db');

const {isAuthenticated} = require('../middleware/auth');

// create new self-care items
router.post('/entries', isAuthenticated, async (req, res) => {
  const {journalText} = req.body;

  if (typeof journalText !== 'string') {
    return res.status(400).json({error: 'Invalid journal entry -strings only.'});
  }

  try {
    // create new entry in journalEntry table
    const newJournalEntry = await prisma.journalEntry.create({
      data: {
        userId: req.session.userId,
        content: journalText,
        moodAtTimeOfEntry: req.session.mood
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