require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');

const session = require('express-session');

const authRoutes = require('./routes/auth');
const copingStrategyRoutes = require('./routes/copingStrategies');
const affirmationRoutes = require('./routes/selfAffirmations');
const selfCareRoutes = require('./routes/selfCare');
const userRoutes = require('./routes/users');

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


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/coping-strategies', copingStrategyRoutes);
app.use('/api/affirmations', affirmationRoutes);
app.use('/api/self-care', selfCareRoutes);
app.use('/api/users', userRoutes);


app.get('/', (req, res) => {
  res.send('Testing')
})

app.listen(8080, () => {
  console.log('server listening on port 8080');
})
