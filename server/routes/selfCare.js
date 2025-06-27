const express = require('express');
const router = express.Router();
const prisma = require('../utils/db');
const rateLimit = require('express-rate-limit');

const {isAuthenticated} = require('../middleware/auth');
const {createPreferences} = require('../utils/preferences');


// rate limiting
function createLimiter() {
  return rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 150,
    message: JSON.stringify({error: 'Too many requests. Try again later.'}),
    keyGenerator: (req) => {return req.session?.userId || req.ip}
  })
}


// create new self-care items
router.post('/user', createLimiter(), isAuthenticated, async (req, res) => {
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


// delete self-care items
router.post('/user/delete', createLimiter(), isAuthenticated, async (req, res) => {
  const delSelfCare = req.body.items;
  // console.log('this is delSelfCare on backend:', delSelfCare);
  if (!delSelfCare || delSelfCare.length === 0) {
    return res.status(200).json({message: 'Nothing to delete.'});
  }

  try {
    // ensure atomicity
    await prisma.$transaction(async (tx) => {

      // delete from UserSelfCare database
      const relTableDeletion = await tx.userSelfCare.deleteMany({
        where: {
          userId: req.session.userId,
          selfCareId: {in: delSelfCare.map(item => item.id)}
        }})

      // check all items to delete are actually deleted
      if (relTableDeletion.count !== delSelfCare.length) {
        throw new Error('Incorrect number of deletions.');
      }

      // deletes selections from selfCare database if they were created by the user and are private to the user
      const deleteItems = await tx.selfCare.deleteMany({
        where: {
          id: {in: delSelfCare.map(item => item.id)},
          createdById: req.session.userId,
          isPrivate: true
        }
      })
    })

    return res.status(200).json({message: 'Self care items successfully deleted.'});
  }
  catch (err) {
    console.log('Error:', err);
    return res.status(500).json({error: 'Something went wrong. Please try again later.'});
  }
})


// get all user self-care content
router.get('/user', createLimiter(), isAuthenticated, async (req, res) => {
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


// get all user self-care content (full)
router.get('/user/id-content', createLimiter(), isAuthenticated, async (req, res) => {
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

    const allUserSelfCareContent = allUserSelfCare.map(item => ({id: item.selfCareId, content: item.selfCare.content}))
    return res.status(200).json(allUserSelfCareContent);
  }
  catch (err) {
    return res.status(500).json({error: 'Failed to fetch user self-care content'});
  }
})


// get all app-wide, public self-care items
router.get('/public', createLimiter(), async (req, res) => {

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