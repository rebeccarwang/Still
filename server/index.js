require('dotenv').config();
const {PrismaClient} = require('../generated/prisma');
const prisma = new PrismaClient();

const express = require('express');
const app = express();
const cors = require('cors');

const bcrypt = require('bcrypt');
const {Pool} = require('pg');

const session = require('express-session');

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// use session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 1000*60*60*3,
    httpOnly: true
  }
}))

// testing if authenticated
function isAuthenticated (req, res, next) {
  if (req.session.isLoggedIn) {
    next();
  }
  else {
    res.status(401).json({error: 'Must be logged in to view content'});
  }
}

// login
app.post('/login', async (req, res) => {
  const {email, password} = req.body;

  // check user inputs email and password
  if (!email || !password) {
    return res.status(400).json({error: 'Must input both email and password'});
  }

  // check if email exists
  const user = await prisma.user.findUnique({
    where: {email: email}
  });
  if (!user) {
    return res.status(401).json({error: 'The email or password you entered is incorrect'});
  }

  // check if email and password match
  const isPasswordCorrect = await isCorrectPassword(password, user.password);
  if (!isPasswordCorrect) {
    return res.status(401).json({error: 'The email or password you entered is incorrect'});
  }

  // if user name and password valid
  req.session.isLoggedIn = true;
  req.session.userId = user.id;
  req.session.firstName = user.firstName;
  req.session.hasCompletedOnboarding = user.hasCompletedOnboarding;
  return res.status(200).json({message: 'Login successful', isLoggedIn: true, userId: req.session.userId, firstName: req.session.firstName, hasCompletedOnboarding: req.session.hasCompletedOnboarding});
})

// logout
app.post('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error while logging out:', err);
      return res.status(500).json({error: 'Logout failed'});
    }
    res.status(200).json({message: 'Logout successful'});
  })
})

// session info
app.get('/session', isAuthenticated, (req, res) => {
  return res.status(200).json({
    isLoggedIn: true,
    firstName: req.session.firstName,
    userId: req.session.userId
  })
})

// create new user
app.post('/post_new_user', async (req, res) => {
  const {email, password, firstName, lastName} = req.body;

  // check that all required input fields exist
  if (!email || !password || !firstName || !lastName || password.length < 8) {
    return res.status(400).json({error: 'Must input all required fields, following specifications'});
  }

  // check email isn't already taken
  const isExistingUser = await prisma.user.findUnique({
    where: {email: email}
  });
  if (isExistingUser) {
    return res.status(400).json({error: 'Email is already in use.'});
  }

  // create user if password meets length requirements and can be hashed
  try {
    const hashedPassword = await createPassword(password);
    const post = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName}
    });
    return res.status(201).json({message: 'User created.'});
  }
  catch (err) {
    if (err.message === 'Password hashing failed') {
      return res.status(500).json({error: 'Something went wrong. Please try again later.'});
    }
  }
})

// password hashing
async function createPassword(userPassword) {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userPassword, saltRounds);
    console.log(hashedPassword);
    return hashedPassword;
  }
  catch (err) {
    console.error('Hashing failed:', err.message);
    throw new Error('Password hashing failed');
  }
}


// check password matches what's in the database
async function isCorrectPassword(userInput, hashedPassword) {
  const isCorrect = await bcrypt.compare(userInput, hashedPassword);
  if (isCorrect) {
    return true;
  }
  return false;
}


// get all app-wide, public self-care items
app.get('/public_self_care_items', async (req, res) => {

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


// create new self-care items
app.post('/post_new_self_care', isAuthenticated, async (req, res) => {
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

// create new affirmation items
app.post('/post_new_affirmations', isAuthenticated, async (req, res) => {
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

// create new self-care item
app.post('/post_new_coping', isAuthenticated, async (req, res) => {
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

// get all app-wide, public coping strategies
app.get('/public_coping_strategies', async (req, res) => {

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
    return res.status(500).json({error: 'Failed to fetch public self-care strategies'})
  }
})

// get all app-wide, public self-affirmation items
app.get('/public_self_affirmation_items', async (req, res) => {

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

// set user's hasCompletedOnboarding attribute to true
app.patch('/api/user-completed-onboarding', isAuthenticated, async (req, res) => {
  try {
    await prisma.user.update({
      where: {id: req.session.userId},
      data: {hasCompletedOnboarding: true}
    });
    return res.status(200).json({message: 'User hasCompletedOnboarding attribute successfully updated.'});
  } catch (err) {
    return res.status(500).json({error: 'Failed to update user hasCompletedOnboarding attribute.'});
  }
})


// helper function for user preferences
// separates selections for each user preference category (i.e., self-care, coping strategies, affirmations)
// takes as input user preferences for one category and returns two arrays- one for selections that already
// exist in the public category database, and one for selections that the user custom-created
function createPreferences(userSelection) {
  const userSelectionExisting = [];
  const userSelectionNew = [];
  for (let i = 0; i < userSelection.length; i ++) {
    if (!userSelection[i].id) {
      userSelectionNew.push(userSelection[i]);
    }
    else {
      userSelectionExisting.push(userSelection[i]);
    }
  }
  return [userSelectionExisting, userSelectionNew];
}



// connect to PostgreSQL database
const pool = new Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  ssl: {rejectUnauthorized: false}
});


app.get('/', (req, res) => {
  res.send('Testing')
})

app.listen(8080, () => {
  console.log('server listening on port 8080');
})
