const User = require("../models/user.model");
const Expense = require("../models/expenses.model");
const Journal = require("../models/diary.model");
const Note = require("../models/Note.model");

const getHomeData = async (req, res) => {
  const userId = req.user.id;

  const journals = await Journal.find({}).sort({ _id: -1 }).limit(5);

  res.status(200).json({
    success: true,
    message: "Data fetched",
    journals,
  });
};

module.exports = { getHomeData };
