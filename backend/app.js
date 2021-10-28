const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

const app = express();
require('dotenv').config({ path: path.join(__dirname, '../.env') });

//Connect to mongoose
mongoose
  .connect(`${process.env.DB_CONNECTION_STRING}`)
  // the .env file should be in the root project directory, you will find an example.env file there as an example
  .then(() => {
    console.log('Connected to database!');
  })
  .catch(() => {
    console.log('Connection failed! (check the IP address)');
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  next();
});

app.use('/api/posts', postsRoutes);
app.use('/api/user', userRoutes);

module.exports = app;
