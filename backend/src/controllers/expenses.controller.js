
const Expenses = require("../models/expenses.model.js");
const User = require("../models/user.model.js");

const createExpenses = async (req, res) => {
  const { title, content, amount, date } = req.body;
  const newExpense = new Expenses({
    title,
    content,
    amount,
    date,
    userId: "698888d97e250684d5470cab",
  });

  const user = await User.findById("698888d97e250684d5470cab");

  user.expenses.push(newExpense._id);
  await user.save();

  await newExpense.save();

  res.status(201).json({ success: true, message: "created" });
};






module.exports = {
  createExpense: createExpenses,
};
