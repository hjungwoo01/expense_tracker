const Expense = require('../models/Expense');

exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.addExpense = async (req, res) => {
  try {
    const { description, amount, category, date, currency } = req.body;
    const expense = new Expense({
      user: req.user.id,
      description,
      amount,
      category,
      date,
      currency
    });
    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ error: 'Not authorized' });
    }
    await Expense.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Expense removed' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};  

exports.updateExpense = async (req, res) => {
  try {
    const { description, amount, category, date, currency } = req.body;
    let expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ error: 'Not authorized' });
    }
    expense.description = description || expense.description;
    expense.amount = amount || expense.amount;
    expense.category = category || expense.category;
    expense.date = date || expense.date;
    expense.currency = currency || expense.currency;
    await expense.save();
    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
