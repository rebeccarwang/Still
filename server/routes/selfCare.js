const express = require('express');
const router = express.Router();
const prisma = require('../utils/db');

const {isAuthenticated} = require('../middleware/auth');
const {createPreferences} = require('../utils/preferences');

// create new self-care items
router.post('/user', isAuthenticated, async (req, res) => {
  const [userSelectionExisting, userSelectionNew] = createPreferences(req.body.items);

    try {

      // ensure atomicity
      await prisma.$transaction(async (tx) => {
        // inserts new user-created selections into selfCare database
        let newItemsId = [];
        if (userSelectionNew.length !== 0) {
          const newItems = await tx.selfCare.createMany({
            data: userSelectionNew.map(item => ({
              content: item,
              createdById: req.session.userId
            })),
            skipDuplicates: true
          });

          // finds ids of all new user-created selections
          newItemsId = await tx.selfCare.findMany({
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
        const relTableInsertion = await tx.userSelfCare.createMany({
          data: [...newItemsId, ...userSelectionExisting].map(item => ({
            userId: req.session.userId,
            selfCareId: item.id
          })),
          skipDuplicates: true
        })
      }
    )

      return res.status(201).json({message: 'Self care items successfully added.'});
    }
    catch (err) {
      console.log('Error:', err);
      return res.status(500).json({error: 'Something went wrong. Please try again later.'});
    }
  // }

})


// get all user self-care content
router.get('/user', isAuthenticated, async (req, res) => {
  try {
    const allUserSelfCare = await prisma.userSelfCare.findMany({
      where: {userId: req.session.userId},
      include: {
        selfCare: {
          select: {
            content: true
          }
        }
      }
    });
    const allUserSelfCareContent = allUserSelfCare.map(item => item.selfCare.content)
    return res.status(200).json(allUserSelfCareContent);
  }
  catch (err) {
    return res.status(500).json({error: 'Failed to fetch user self-care content'});
  }
})



// get all app-wide, public self-care items
router.get('/public', async (req, res) => {

  try {
    const allPublicSelfCare = await prisma.selfCare.findMany({
      where: {isPrivate: false},
      select: {
        content: true,
        id: true
      },
      orderBy: {content: 'asc'}
    });

    return res.status(200).json(allPublicSelfCare);
  }
  catch (err) {
    return res.status(500).json({error: 'Failed to fetch public self-care strategies'})
  }
})

module.exports = router;