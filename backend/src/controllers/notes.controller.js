const Note = require("../models/Note.model.js");

const getAllNotes = async (req, res) => {
  try {
    const { skip, limit } = req.params;

    const notes = await Note.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .skip(Number(skip))
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      message: "data fetched",
      notes,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getAllNotes,
};
