const express = require('express');
const router = express.Router();
const prisma = require('../utils/db');

const {isAuthenticated} = require('../middleware/auth');

// get all journal entries and associated tags
router.get('/entries', isAuthenticated, async (req, res) => {
  try {
    const journalEntries = await prisma.journalEntry.findMany({
      where: {userId: req.session.userId},
      include: {
        tags: {
          include: {
            tag: true
          }
        }
      }
    })

    const journalEntriesCondensed = journalEntries.map(entry => (
      {id: entry.id,
      date: entry.createdAt,
      mood: entry.moodAtTimeOfEntry,
      tags: entry.tags.map(obj => obj.tag.name),
      content: entry.content.slice(0, 51)}
    ))
    return res.status(200).json(journalEntriesCondensed);
  }
  catch (err) {
    console.log('Error:', err);
    return res.status(500).json({error: 'Something went wrong. Please try again later.'});
  }
})

// get single journal entry
router.get('/entries/:id', isAuthenticated, async (req, res) => {
  const {id} = req.params;
  const entryId = Number(id);
  // checks if id is an integer
  if (!Number.isInteger(entryId)) {
    return res.status(400).json({error: 'Invalid journal entry.'});
  }
  try {
    // get journal entry associated with id along with its tags
    const entry = await prisma.journalEntry.findUnique({
      where: {id: entryId},
      include: {
        tags: {
          include: {
            tag: true
          }
        }
      }
    })

    // checks an entry is returned
    if (!entry) {
      return res.status(400).json({error: 'Invalid journal entry.'});
    }

    // checks that the requesting user is the user who wrote the journal entry
    if (entry.userId !== req.session.userId) {
      return res.status(403).json({error: 'You are not authorized to access this resource.'})
    }

    // extracts relevant information to return to client
    const entryCondensed = {id: entry.id,
      date: entry.createdAt,
      mood: entry.moodAtTimeOfEntry,
      tags: entry.tags.map(obj => obj.tag.name),
      content: entry.content};


    return res.status(200).json(entryCondensed);
  }
  catch (err) {
    console.log('Error:', err);
    return res.status(500).json({error: 'Something went wrong. Please try again later.'});
  }
})

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

    let mismatch = false;

    // check if there's a mismatch between moodAtTimeOfEntry and sentimentScore
    if ((req.session.mood === 4 || req.session.mood === 5) && sentimentScore < 0.4) {
      mismatch = true
    }
    else if ((req.session.mood === 1 || req.session.mood === 2) && sentimentScore > 0.6) {
      mismatch = true
    }

    return res.status(201).json({message: 'Journal entry successfully added.', journalEntryId: newJournalEntry.id, mismatch: mismatch});
  }
  catch (err) {
    console.log('Error:', err);
    return res.status(500).json({error: 'Something went wrong. Please try again later.'});
  }

})

module.exports = router;