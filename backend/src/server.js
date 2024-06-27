const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport'); // Add this line
const connectDB = require('./config/db');
const expenseRoutes = require('./routes/expenseRoutes');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
require('dotenv').config();
require('./config/passportConfig'); // Ensure passport is configured

const app = express();
const PORT = process.env.PORT || 1000;

// Connect to the database
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET, // Ensure this is in your .env file
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // In production, set secure: true for HTTPS
}));

// Initialize Passport and restore authentication state, if any, from the session
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api', expenseRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', categoryRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
