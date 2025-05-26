const express = require('express');
const router = express.Router();
const prisma = require('../utils/db');

const {isAuthenticated} = require('../middleware/auth');
const {createPreferences} = require('../utils/preferences');

// create new self-care item
router.post('/user', isAuthenticated, async (req, res) => {
  const [userSelectionExisting, userSelectionNew] = createPreferences(req.body.items);

    try {

      // ensure atomicity
      await prisma.$transaction(async (tx) => {

        let newItemsId = [];
        if (userSelectionNew.length !== 0) {
        // inserts new user-created selections into selfCare database
          const newItems = await tx.copingStrategy.createMany({
            data: userSelectionNew.map(item => ({
              content: item,
              createdById: req.session.userId
            })),
            skipDuplicates: true
          });

          // finds ids of all new user-created selections
          newItemsId = await tx.copingStrategy.findMany({
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
        const relTableInsertion = await tx.userCopingStrategy.createMany({
          data: [...newItemsId, ...userSelectionExisting].map(item => ({
            userId: req.session.userId,
            strategyId: item.id
          })),
          skipDuplicates: true
        })
        // return res.status(201).json({message: 'Coping strategy items successfully added.'});
      }
    )

      return res.status(201).json({message: 'Coping strategy items successfully added.'});
    }
    catch (err) {
      console.log('Error:', err);
      return res.status(500).json({error: 'Something went wrong. Please try again later.'});
    }
  })


// get all user coping strategies
router.get('/user', isAuthenticated, async (req, res) => {
  try {
    const allUserCoping = await prisma.userCopingStrategy.findMany({
      where: {userId: req.session.userId},
      include: {
        strategy: {
          select: {
            content: true
          }
        }
      }
    });
    const allUserCopingContent = allUserCoping.map(item => item.strategy.content)
    return res.status(200).json(allUserCopingContent);
  }
  catch (err) {
    return res.status(500).json({error: 'Failed to fetch user coping strategies'});
  }
})


// get all app-wide, public coping strategies
router.get('/public', async (req, res) => {

  try {
    const allPublicCopingStrategies = await prisma.copingStrategy.findMany({
      where: {isPrivate: false},
      select: {
        content: true,
        id: true
      },
      orderBy: {content: 'asc'}
    });

    return res.status(200).json(allPublicCopingStrategies);
  }
  catch (err) {
    return res.status(500).json({error: 'Failed to fetch public coping strategies'})
  }
})

module.exports = router;