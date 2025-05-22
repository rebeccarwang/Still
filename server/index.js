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
        content: true
      },
      orderBy: {content: 'asc'}
    });

    return res.status(200).json(allPublicSelfCare);
  }
  catch (err) {
    return res.status(500).json({error: 'Failed to fetch public self-care strategies'})
  }
})

// get all app-wide, public coping strategies
app.get('/public_coping_strategies', async (req, res) => {

  try {
    const allPublicCopingStrategies = await prisma.copingStrategy.findMany({
      where: {isPrivate: false},
      select: {
        content: true
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
        content: true
      },
      orderBy: {content: 'asc'}
    });

    return res.status(200).json(allPublicSelfAffirmation);
  }
  catch (err) {
    return res.status(500).json({error: 'Failed to fetch public self-care strategies'})
  }
})

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
