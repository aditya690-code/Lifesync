const Journal = require("../models/journal.model");

const newJouranl = async (req, res) => {
  const { title, content } = req.body;

  const journal = await Journal.create({ title, content, userId: req.user.id });

  res
    .status(201)
    .json({ success: true, message: "New journal created", journal });
};

const getData = async (req, res) => {
  const { skip, limit } = req.params;
  const journal = await Journal.find({ userId: req.user.id })
    .sort({ createdAt: -1 })
    .skip(Number(skip))
    .limit(Number(limit));

  res.status(200).json({ success: true, journal });
};

module.exports = { newJouranl, getData };
