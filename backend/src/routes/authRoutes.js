const express = require('express');
const passport = require('passport');
const { register, login, protect, generateToken } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/protected', protect, (req, res) => {
  res.send('This is a protected route');
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  async (req, res) => {
    const token = generateToken(req.user._id);
    res.redirect(`http://localhost:3000?token=${token}`);
  });

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
