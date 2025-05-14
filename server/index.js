const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const {Pool} = require('pg');

// connect to PostgreSQL database
const pool = new Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  ssl: {rejectUnauthorized: false}
});


app.use(cors());
app.user(express.json());

app.get('/', (req, res) => {
  res.send('Testing')
})

app.listen(8080, () => {
  console.log('server listening on port 8080');
})
