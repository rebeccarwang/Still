const express = require('express');
const router = express.Router();
const prisma = require('../utils/db');

const {isAuthenticated} = require('../middleware/auth');
const {createPreferences} = require('../utils/preferences');

// create new affirmation items
router.post('/user', isAuthenticated, async (req, res) => {
  const [userSelectionExisting, userSelectionNew] = createPreferences(req.body.items);

    try {

      // ensure atomicity
      await prisma.$transaction(async (tx) => {

        let newItemsId = [];
        if (userSelectionNew.length !== 0) {
          // inserts new user-created selections into selfCare database
          const newItems = await tx.selfAffirmation.createMany({
            data: userSelectionNew.map(item => ({
              content: item,
              createdById: req.session.userId
            })),
            skipDuplicates: true
          });

          // finds ids of all new user-created selections
          newItemsId = await tx.selfAffirmation.findMany({
            where: {
              content: {in: userSelectionNew},
              createdById: req.session.userId
            },
            select: {
              id: true
            }
          })
        }
        // update UserSelfCare database
        const relTableInsertion = await tx.userSelfAffirmation.createMany({
          data: [...newItemsId, ...userSelectionExisting].map(item => ({
            userId: req.session.userId,
            selfAffirmationId: item.id
          })),
          skipDuplicates: true
        })
      })

      return res.status(201).json({message: 'Affirmation items successfully added.'});
    }
    catch (err) {
      console.log('Error:', err);
      return res.status(500).json({error: 'Something went wrong. Please try again later.'});
    }
  // }

})


// get all user affirmations
router.get('/user', isAuthenticated, async (req, res) => {
  try {
    const allUserAffirmations = await prisma.userSelfAffirmation.findMany({
      where: {userId: req.session.userId},
      include: {
        selfAffirmation: {
          select: {
            content: true
          }
        }
      }
    });
    const allUserAffirmationContent = allUserAffirmations.map(item => item.selfAffirmation.content)
    return res.status(200).json(allUserAffirmationContent);
  }
  catch (err) {
    return res.status(500).json({error: 'Failed to fetch user affirmations'});
  }
})


// get all app-wide, public self-affirmation items
router.get('/public', async (req, res) => {

  try {
    const allPublicSelfAffirmation = await prisma.selfAffirmation.findMany({
      where: {isPrivate: false},
      select: {
        content: true,
        id: true
      },
      orderBy: {content: 'asc'}
    });

    return res.status(200).json(allPublicSelfAffirmation);
  }
  catch (err) {
    return res.status(500).json({error: 'Failed to fetch public self-care strategies'})
  }
})

module.exports = router;