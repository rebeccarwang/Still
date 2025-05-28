const express = require('express');
const router = express.Router();
const prisma = require('../utils/db');

const {isAuthenticated} = require('../middleware/auth');

// get all app-wide, public tag items
router.get('/public', async (req, res) => {

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
router.post('/journal-entry', isAuthenticated, async (req, res) => {
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
      }))
    });

    return res.status(201).json({message: 'Journal tags successfully added.'});
  }
  catch (err) {
    console.log('Error:', err);
    return res.status(500).json({error: 'Something went wrong. Please try again later.'});
  }
})


module.exports = router;