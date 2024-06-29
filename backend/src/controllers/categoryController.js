const Category = require('../models/Category');

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user._id });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const existingCategory = await Category.findOne({ name, user: req.user._id });
    if (existingCategory) {
      return res.status(400).json({ error: 'Category name already exists' });
    }

    const newCategory = new Category({
      name,
      user: req.user._id,
    });
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.editCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const category = await Category.findById(id);

    if (category.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: 'Not authorized to edit this category' });
    }
    
    const existingCategory = await Category.findOne({ name, user: req.user._id });
    if (existingCategory) {
      return res.status(400).json({ error: 'Category name already exists' });
    }

    category.name = name;
    const updatedCategory = await category.save();
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (category.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: 'Not authorized to delete this category' });
    }

    await category.deleteOne();
    res.status(200).json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
