require('dotenv').config();

console.log('NODE_ENV is:', process.env.NODE_ENV);
const express = require('express');
const app = express();
const cors = require('cors');

const session = require('express-session');

const authRoutes = require('./routes/auth');
const copingStrategyRoutes = require('./routes/copingStrategies');
const affirmationRoutes = require('./routes/selfAffirmations');
const selfCareRoutes = require('./routes/selfCare');
const userRoutes = require('./routes/users');
const moodCheckInRoutes = require('./routes/moodCheckIn');
const journalEntryRoutes = require('./routes/journal');
const tagRoutes = require('./routes/tags');
const hasCheckedInRoutes = require('./routes/hasCheckedIn');
const trendRoutes = require('./routes/trends');

app.use(cors({
  origin: ['http://localhost:3000', 'https://still-ruddy.vercel.app'],
  credentials: true
}));
app.use(express.json());

app.set('trust proxy', 1);
// use session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 1000*60*60*3,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none': 'lax'
  }
}))


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/coping-strategies', copingStrategyRoutes);
app.use('/api/affirmations', affirmationRoutes);
app.use('/api/self-care', selfCareRoutes);
app.use('/api/users', userRoutes);
app.use('/api/mood-checkin', moodCheckInRoutes);
app.use('/api/journal', journalEntryRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/has-checked-in', hasCheckedInRoutes);
app.use('/api/trends', trendRoutes);


app.get('/', (req, res) => {
  res.send('Testing')
})

app.listen(process.env.PORT, () => {
  console.log(`server listening on port ${process.env.PORT}`);
})
