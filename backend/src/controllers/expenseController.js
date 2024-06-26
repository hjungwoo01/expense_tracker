const Expense = require('../models/Expense');

exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addExpense = async (req, res) => {
  try {
    const { description, amount, category, date, currency } = req.body;
    const newExpense = new Expense({
      description,
      amount,
      category,
      date,
      currency,
      user: req.user._id,
    });
    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findById(id);

    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: 'Not authorized to delete this expense' });
    }

    await expense.remove();
    res.status(200).json({ message: 'Expense deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
