const express = require('express');
const { getCategories, addCategory, editCategory, deleteCategory } = require('../controllers/categoryController');
const { protect } = require('../controllers/authController');
const router = express.Router();

router.get('/categories', protect, getCategories);
router.post('/categories', protect, addCategory);
router.put('/categories/:id', protect, editCategory);
router.delete('/categories/:id', protect, deleteCategory);

module.exports = router;
