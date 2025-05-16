const {PrismaClient} = require('../generated/prisma');
const prisma = new PrismaClient();
const express = require('express');
const app = express();
const cors = require('cors');
const bcrypt = require('bcrypt');
require('dotenv').config();
const {Pool} = require('pg');

app.use(cors());
app.use(express.json());

// creates new user
app.post('/post_new_user', async (req, res) => {
  const {username, password, firstName, lastName} = req.body;

  // checks that all required input fields exist
  if (!username || !password || !firstName || !lastName || password.length < 8) {
    return res.status(400).json({error: 'Must input all required fields, following specifications'});
  }

  // checks username isn't already taken
  const isExistingUser = await prisma.user.findUnique({
    where: {username: username}
  });
  if (isExistingUser) {
    return res.status(400).json({error: 'Username is already taken.'});
  }

  // creates user if password meets length requirements and can be hashed
  try {
    const hashedPassword = await createPassword(password);
    const post = await prisma.user.create({
      data: {
        username,
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
