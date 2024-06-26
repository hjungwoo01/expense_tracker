const express = require('express');
const { register, login, protect } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/protected', protect, (req, res) => {
  res.send('This is a protected route');
});

module.exports = router;
