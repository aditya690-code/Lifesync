const Expenses = require("../models/expenses.model.js");

const createExpenses = async (req, res) => {
  const { title, content, amount, date = new Date() } = req.body;
  const newExpense = await Expenses.create({
    title,
    content,
    amount,
    createdAt: date,
    userId: req.user.id,
  });

  res.status(201).json({ success: true, message: "created", newExpense });
};

const getAllNotes = async (req, res) => {
  try {
    const expenses = await Expenses.find({ userId: req.user.id });

    res.status(200).json({ success: true, expenses });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  createExpense: createExpenses,
  getAllNotes,
};
