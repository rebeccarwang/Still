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
    message: JSON.stringify({error: 'Too many tag requests. Try again later.'}),
    keyGenerator: (req) => {return req.session?.userId || req.ip}
  })
}


function createViewLimiter() {
  return rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 300,
    message: JSON.stringify({error: 'Too many requests. Try again later.'}),
    keyGenerator: (req) => {return req.session?.userId || req.ip}
  })
}


// get all app-wide, public tag items
router.get('/public', createViewLimiter(), async (req, res) => {

  try {
    const allPublicTags = await prisma.tag.findMany({
      select: {
        name: true,
        id: true
      }
    });

    return res.status(200).json(allPublicTags);
  }
  catch (err) {
    return res.status(500).json({error: 'Failed to fetch public tags'})
  }
})


// posts new tags
router.post('/journal-entry', createLimiter(), isAuthenticated, async (req, res) => {
  const {tagsUser, journalEntryId} = req.body;

  // checks if there are tags to be added
  if (tagsUser.length === 0) {
    return res.status(200).json({message: 'No tags added'});
  }

  // checks for valid input types
  if (!Number.isInteger(journalEntryId) || !Array.isArray(tagsUser) || !(tagsUser.every(id => Number.isInteger(id)))) {
    return res.status(400).json({error: 'Invalid data'});
  }

  // checks if all tag ids are actual tags in the tags relation table
  const allTagOverlaps = await prisma.tag.findMany({
    where: {id: {in: tagsUser}}
  })
  if (allTagOverlaps.length !== tagsUser.length) {
    return res.status(400).json({error: 'Invalid data length'});
  }

  // checks if journal entry exists and if user has authorization to update journal entry
  const journalEntry = await prisma.journalEntry.findUnique({
    where: {id: journalEntryId}
  })
  if (!journalEntry || journalEntry.userId !== req.session.userId) {
    return res.status(403).json({error: 'User does not have permission to access resource'});
  }

  try {
    // create new entries in EntryTagMap relation
    const newTagEntries = await prisma.entryTagMap.createMany({
      data: [...tagsUser].map(tag => ({
        tagId: tag,
        entryId: journalEntryId
      })),
      skipDuplicates: true
    });

    return res.status(201).json({message: 'Journal tags successfully added.'});
  }
  catch (err) {
    console.log('Error:', err);
    return res.status(500).json({error: 'Something went wrong. Please try again later.'});
  }
})


// posts new tags
router.post('/mood', createLimiter(), isAuthenticated, async (req, res) => {
  const {tagsUser, moodId} = req.body;
  const moodIdInt = parseInt(moodId);

  // checks if there are tags to be added
  if (tagsUser.length === 0) {
    return res.status(200).json({message: 'No tags added'});
  }

  // checks for valid input types
  if (!Number.isInteger(moodIdInt) || !Array.isArray(tagsUser) || !(tagsUser.every(id => Number.isInteger(id)))) {
    return res.status(400).json({error: 'Invalid data'});
  }

  // checks if all tag ids are actual tags in the tags relation table
  const allTagOverlaps = await prisma.tag.findMany({
    where: {id: {in: tagsUser}}
  })
  if (allTagOverlaps.length !== tagsUser.length) {
    return res.status(400).json({error: 'Invalid data length'});
  }

  // checks if mood entry exists and if user has authorization to update mood entry tags
  const moodEntry = await prisma.moodCheckIn.findUnique({
    where: {id: moodIdInt}
  })
  if (!moodEntry || moodEntry.userId !== req.session.userId) {
    return res.status(403).json({error: 'User does not have permission to access resource'});
  }

  try {
    // create new entries in MoodCheckInTagMap relation
    const newTagEntries = await prisma.moodCheckInTagMap.createMany({
      data: [...tagsUser].map(tag => ({
        tagId: tag,
        moodCheckInId: moodIdInt
      })),
      skipDuplicates: true
    });

    return res.status(201).json({message: 'Mood tags successfully added.'});
  }
  catch (err) {
    console.log('Error:', err);
    return res.status(500).json({error: 'Something went wrong. Please try again later.'});
  }
})


module.exports = router;