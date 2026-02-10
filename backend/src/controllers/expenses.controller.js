
const Expenses = require("../models/expenses.model.js");
const User = require("../models/user.model.js");
const jwt = require("jsonwebtoken");

const createExpenses = async (req, res) => {
  const { title, content, amount, date } = req.body;
  const newExpense = new Expenses({
    title,
    content,
    amount,
    date,
    userId: "698888d97e250684d5470cab",
  });

  const cookieToken = req.cookies.token;
  const userId = req.cookies.userId;

  if (!cookieToken) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(cookieToken, process.env.JWT_SECRET);
    if (decoded.userId !== userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
  } catch (err) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  
  const user = await User.findById(userId);

  user.expenses.push(newExpense._id);
  await user.save();

  await newExpense.save();

  res.status(201).json({ success: true, message: "created" });
};






module.exports = {
  createExpense: createExpenses,
};
