require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const connectDB = require('./config/db');
require('./config/passportConfig');
const expenseRoutes = require('./routes/expenseRoutes');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api', expenseRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', categoryRoutes);

// Handle root URL
app.get('/', (req, res) => {
  res.redirect('localhost:3000');
});

module.exports = app;
