const express = require('express');
const { getExpenses, addExpense, deleteExpense } = require('../controllers/expenseController');
const { protect } = require('../controllers/authController');
const router = express.Router();

router.get('/expenses', protect, getExpenses);
router.post('/expenses', protect, addExpense);
router.delete('/expenses/:id', protect, deleteExpense);

module.exports = router;
